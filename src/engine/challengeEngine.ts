/**
 * ChallengeEngine — the top-level state machine that drives one complete
 * Challenge Sub-Phase.
 *
 * Callers interact via a single `advance()` method that consumes player input
 * (when required) and returns the next CombatState.  The engine never mutates
 * state in place.
 *
 * State machine transitions:
 *   setup        → faceOff      (after initialization)
 *   faceOff      → focus        (both gambits & weapon profiles chosen)
 *   focus        → strike-player | strike-ai  (after Focus Roll)
 *   strike-player→ strike-ai    (intermediate; player already attacked)
 *   strike-ai    → glory        (after both attacks resolved)
 *   glory        → faceOff      (if challenge continues) | ended
 */
import type { DiceRoller }  from './dice.js';
import type { CombatState, CombatantState, LogEntry } from '../models/combatState.js';
import type { Character }   from '../models/character.js';
import type { GambitId }    from '../models/gambit.js';
import type { WeaponProfile } from '../models/weapon.js';
import { resolveFocusStep }  from './focusStep.js';
import { resolveStrikeStep } from './strikeStep.js';
import { resolveGloryStep }  from './gloryStep.js';
import { selectAIGambit }    from '../ai/heuristicAI.js';

/** Input that the human player provides per phase. */
export interface PlayerInput {
  /** Gambit selected during the faceOff phase. */
  selectedGambit?: GambitId;
  /** Weapon profile index (into character.weapons[].profiles) chosen in focus. */
  selectedWeaponIndex?: number;
  selectedProfileIndex?: number;
  /** In the glory phase: true if player chooses to continue, false to end. */
  continueChallenge?: boolean;
  /** In the glory phase: true if player invokes their Withdraw option. */
  useWithdraw?: boolean;
}

/** Possible outcomes of a single `advance()` call. */
export interface AdvanceResult {
  state: CombatState;
  /** True when the engine is waiting for more player input before proceeding. */
  waitingForInput: boolean;
}

/** Helper to append a log entry without mutation. */
function addLog(
  state: CombatState,
  message: string,
  severity: LogEntry['severity'] = 'info',
): CombatState {
  return {
    ...state,
    log: [...state.log, { round: state.round, phase: state.phase, message, severity }],
  };
}

/**
 * Build the initial CombatState for both combatants.
 */
export function buildInitialState(playerChar: Character, aiChar: Character): CombatState {
  const makeCombatant = (char: Character): CombatantState => ({
    characterId: char.id,
    currentWounds: char.stats.W,
    baseWounds: char.stats.W,
    woundsInflictedThisChallenge: 0,
    isCasualty: false,
    selectedGambit: null,
    selectedWeaponProfile: null,
    guardUpFocusBonus: 0,
    tauntAndBaitCount: 0,
    usedBrutalButKunnin: false,
    feintAndRiposteBan: null,
  });

  return {
    round: 1,
    phase: 'faceOff',
    player: makeCombatant(playerChar),
    ai: makeCombatant(aiChar),
    challengeAdvantage: null,
    testTheFoeAdvantage: null,
    playerCRP: 0,
    aiCRP: 0,
    log: [],
  };
}

/**
 * ChallengeEngine drives the state machine.
 *
 * Instantiate once per Challenge with the two character records and a dice
 * roller.  Call `advance()` repeatedly, providing PlayerInput where required,
 * until `state.phase === 'ended'`.
 */
export class ChallengeEngine {
  private readonly playerChar: Character;
  private readonly aiChar:     Character;
  private readonly dice:       DiceRoller;

  constructor(playerChar: Character, aiChar: Character, dice: DiceRoller) {
    this.playerChar = playerChar;
    this.aiChar     = aiChar;
    this.dice       = dice;
  }

  /**
   * Advance the state machine by one step.
   *
   * @param state - current CombatState (from the previous call or buildInitialState)
   * @param input - player input for this step (optional; ignored in AI-only phases)
   * @returns next CombatState + waitingForInput flag
   */
  advance(state: CombatState, input?: PlayerInput): AdvanceResult {
    switch (state.phase) {
      case 'faceOff':  return this.advanceFaceOff(state, input);
      case 'focus':    return this.advanceFocus(state, input);
      case 'strike-player': return this.advanceStrikePlayer(state);
      case 'strike-ai':     return this.advanceStrikeAi(state, input);
      case 'glory':    return this.advanceGlory(state, input);
      default:
        return { state, waitingForInput: false };
    }
  }

  // ── faceOff ──────────────────────────────────────────────────────────────

  private advanceFaceOff(state: CombatState, input?: PlayerInput): AdvanceResult {
    // Step 1: player selects their gambit
    if (state.player.selectedGambit === null) {
      if (!input?.selectedGambit) {
        return { state, waitingForInput: true };
      }

      let gambitId = input.selectedGambit;
      // Feint and Riposte by opponent bans a gambit for the player
      if (state.ai.feintAndRiposteBan === gambitId) {
        // Caller should not offer banned gambit; silently fall back to null
        // and wait again — this should not occur in well-formed UI code.
        return { state, waitingForInput: true };
      }

      let next: CombatState = { ...state, player: { ...state.player, selectedGambit: gambitId } };

      // Handle Feint and Riposte selected by the player
      if (gambitId === 'feint-and-riposte') {
        // Will be handled separately via a second input (banGambitId)
        // For now, mark it selected; the ban target comes from the UI as
        // part of the same input object or a follow-up.
      }

      // Taunt and Bait: increment counter
      if (gambitId === 'taunt-and-bait') {
        next = { ...next, player: { ...next.player, tauntAndBaitCount: state.player.tauntAndBaitCount + 1 } };
      }

      next = addLog(next, `Player selects gambit: ${gambitId}`, 'info');

      // Now AI selects its gambit
      return this.advanceFaceOff(next, undefined);
    }

    // Step 2: AI selects its gambit (always automated)
    if (state.ai.selectedGambit === null) {
      const aiGambitId = selectAIGambit(
        state,
        this.aiChar,
        this.playerChar,
        state.player.feintAndRiposteBan,
      );

      let next: CombatState = { ...state, ai: { ...state.ai, selectedGambit: aiGambitId } };

      // Taunt and Bait: increment counter for AI
      if (aiGambitId === 'taunt-and-bait') {
        next = { ...next, ai: { ...next.ai, tauntAndBaitCount: state.ai.tauntAndBaitCount + 1 } };
      }

      next = addLog(next, `AI selects gambit: ${aiGambitId}`, 'info');

      // Transition to focus phase.
      // If the player's weapon was pre-selected (chosen once at startup),
      // advance directly through focus instead of waiting for weapon input.
      next = { ...next, phase: 'focus' };
      if (next.player.selectedWeaponProfile !== null) {
        return this.advanceFocus(next, undefined);
      }
      return { state: next, waitingForInput: true }; // wait for weapon selection
    }

    return { state, waitingForInput: true };
  }

  // ── focus ─────────────────────────────────────────────────────────────────

  private advanceFocus(state: CombatState, input?: PlayerInput): AdvanceResult {
    // Reactive player (player) picks weapon first
    if (state.player.selectedWeaponProfile === null) {
      if (input?.selectedWeaponIndex === undefined) {
        return { state, waitingForInput: true };
      }
      const wIdx = input.selectedWeaponIndex;
      const pIdx = input.selectedProfileIndex ?? 0;
      const profile = this.playerChar.weapons[wIdx]?.profiles[pIdx];
      if (!profile) return { state, waitingForInput: true };

      const next = {
        ...state,
        player: { ...state.player, selectedWeaponProfile: profile },
      };
      return this.advanceFocus(next, undefined);
    }

    // AI picks weapon
    if (state.ai.selectedWeaponProfile === null) {
      const profile = this.selectAIWeapon();
      let next: CombatState = { ...state, ai: { ...state.ai, selectedWeaponProfile: profile } };
      next = addLog(next, `AI selects weapon: ${profile.profileName}`, 'info');

      // Resolve Focus Roll
      const focusResult = resolveFocusStep(
        this.dice, next,
        this.playerChar, this.aiChar,
        state.testTheFoeAdvantage,
      );

      for (const msg of focusResult.log) {
        next = addLog(next, msg, 'info');
      }

      next = {
        ...next,
        challengeAdvantage: focusResult.advantage,
        testTheFoeAdvantage: null, // consume the pending advantage
        // Guard Up bonuses are consumed
        player: { ...next.player, guardUpFocusBonus: 0 },
        ai:     { ...next.ai,     guardUpFocusBonus: 0 },
        phase: focusResult.advantage === 'player' ? 'strike-player' : 'strike-ai',
      };

      return { state: next, waitingForInput: false };
    }

    return { state, waitingForInput: false };
  }

  // ── strike-player ─────────────────────────────────────────────────────────

  private advanceStrikePlayer(state: CombatState): AdvanceResult {
    // resolveStrikeStep sequences both attack sequences in one call, ordered by
    // state.challengeAdvantage — the advantage holder strikes first.
    const strikeResult = resolveStrikeStep(
      this.dice, state,
      this.playerChar, this.aiChar,
      state.challengeAdvantage!,
    );

    let next = strikeResult.updatedState;
    for (const msg of strikeResult.log) {
      next = addLog(next, msg, msg.includes('CASUALTY') ? 'danger' : 'info');
    }

    next = { ...next, phase: 'glory' };
    return { state: next, waitingForInput: false };
  }

  // ── strike-ai ────────────────────────────────────────────────────────────

  private advanceStrikeAi(state: CombatState, _input?: PlayerInput): AdvanceResult {
    // resolveStrikeStep uses state.challengeAdvantage to determine who attacks
    // first, so the same resolution path handles both advantage holders.
    return this.advanceStrikePlayer(state);
  }

  // ── glory ─────────────────────────────────────────────────────────────────

  private advanceGlory(state: CombatState, input?: PlayerInput): AdvanceResult {
    const playerGambit = state.player.selectedGambit;
    const canWithdraw =
      playerGambit === 'withdraw' && !state.player.isCasualty;

    // If neither model is a casualty, the player with advantage decides to
    // continue or end.  Also allow Withdraw option.
    if (!state.player.isCasualty && !state.ai.isCasualty) {
      if (input?.continueChallenge === undefined && !input?.useWithdraw) {
        return { state, waitingForInput: true };
      }
    }

    const useWithdraw = canWithdraw && (input?.useWithdraw ?? false);
    const gloryResult = resolveGloryStep(
      state,
      this.playerChar,
      this.aiChar,
      useWithdraw,
    );

    let next = {
      ...state,
      playerCRP: gloryResult.playerCRP,
      aiCRP:     gloryResult.aiCRP,
    };
    for (const msg of gloryResult.log) {
      next = addLog(next, msg,
        gloryResult.winner === 'player' ? 'success'
        : gloryResult.winner === 'ai'   ? 'danger'
        : 'warning',
      );
    }

    // Challenge ends if either model is a casualty or player chose to end
    const challengeEnds =
      state.player.isCasualty ||
      state.ai.isCasualty ||
      gloryResult.withdrawUsed ||
      input?.continueChallenge === false;

    if (challengeEnds) {
      next = { ...next, phase: 'ended' };
      next = addLog(next,
        `Challenge ended. Player CRP: ${next.playerCRP}, AI CRP: ${next.aiCRP}`,
        next.playerCRP > next.aiCRP ? 'success'
        : next.aiCRP > next.playerCRP ? 'danger'
        : 'warning',
      );
      return { state: next, waitingForInput: false };
    }

    // Continue to next round
    next = {
      ...next,
      round: state.round + 1,
      phase: 'faceOff',
      challengeAdvantage: gloryResult.winner !== 'draw' ? gloryResult.winner : state.challengeAdvantage,
      // Test the Foe: carry over advantage
      testTheFoeAdvantage:
        state.player.selectedGambit === 'test-the-foe' ? 'player'
        : state.ai.selectedGambit   === 'test-the-foe' ? 'ai'
        : null,
      player: {
        ...next.player,
        selectedGambit: null,
        // selectedWeaponProfile is intentionally kept — chosen once at startup
        feintAndRiposteBan: null,
        woundsInflictedThisChallenge: 0, // reset for next round comparison
      },
      ai: {
        ...next.ai,
        selectedGambit: null,
        selectedWeaponProfile: null, // reset so AI re-runs weapon selection + focus roll
        feintAndRiposteBan: null,
        woundsInflictedThisChallenge: 0,
      },
    };

    // Handle Guard Up: missed attacks accumulate focus bonus
    // (already tracked per-attack in strikeStep; reset after being used in focus)

    next = addLog(next, `--- Round ${next.round} begins ---`, 'info');
    return { state: next, waitingForInput: true }; // wait for next gambit selection
  }

  /**
   * Choose the AI's weapon profile for the current round.
   * Prefer highest (S × A) product; in Round 1 prefer highest CI.
   */
  private selectAIWeapon(): WeaponProfile {
    const char  = this.aiChar;
    const round = 0; // accessed inside closure

    let bestProfile: WeaponProfile | null = null;
    let bestScore = -Infinity;

    for (const weapon of char.weapons) {
      if (weapon.type !== 'melee') continue;
      for (const profile of weapon.profiles) {
        const s = this.resolveStrength(char.stats.S, profile);
        const a = this.resolveAttacks(char.stats.A, profile);
        const ci = this.resolveCI(char.stats.I, profile);
        // Score: strength × attacks, tie-break by CI
        const score = s * a + ci * 0.01;
        if (score > bestScore) {
          bestScore = score;
          bestProfile = profile;
        }
      }
    }

    return bestProfile ?? char.weapons[0].profiles[0];
    void round; // suppress unused-variable warning (round reserved for future round-1 CI preference)
  }

  private resolveStrength(baseS: number, profile: WeaponProfile): number {
    const sm = profile.strengthModifier;
    if (sm.kind === 'none')  return baseS;
    if (sm.kind === 'add')   return baseS + sm.value;
    if (sm.kind === 'mult')  return baseS * sm.value;
    return sm.value; // fixed
  }

  private resolveAttacks(baseA: number, profile: WeaponProfile): number {
    const am = profile.attacksModifier;
    if (am.kind === 'none')  return baseA;
    if (am.kind === 'add')   return baseA + am.value;
    return am.value; // fixed
  }

  private resolveCI(baseI: number, profile: WeaponProfile): number {
    const im = profile.initiativeModifier;
    if (im.kind === 'none')  return baseI;
    if (im.kind === 'add')   return baseI + im.value;
    return im.value; // fixed
  }
}
