/**
 * Gambit effect functions.
 *
 * Gambits are pure modifier functions rather than classes.  Each function
 * takes the selected gambit and relevant state and returns a plain modifier
 * value or flag.
 *
 * All functions here are pure and have no side effects.
 */
import type { GambitId } from '../models/gambit.js';
import type { CombatState } from '../models/combatState.js';
import type { CharacterStats } from '../models/character.js';

// ─── Focus step modifiers ─────────────────────────────────────────────────────

export interface FocusDiceModification {
  /** Number of *extra* d6 to roll (beyond the base 1). */
  extraDice: number;
  /** If true, discard the lowest result from the pool. */
  discardLowest: boolean;
  /** If true, discard the highest result from the pool. */
  discardHighest: boolean;
  /** If true, the normal Combat Initiative contribution is suppressed
   *  (e.g., Brutal but Kunnin' / Kunnin' but Brutal replaces the roll). */
  suppressCI: boolean;
  /**
   * If not null, after rolling the Focus dice the controlling player may
   * *replace* the entire dice-total with this fixed number (the gambit value,
   * e.g. Leadership for Kunnin' but Brutal).
   */
  replaceRollWith: number | null;
}

/**
 * Return dice-pool modifications that a gambit applies to the Focus Roll.
 * Outside Support is always 0 in a 1v1 duel so Grandstand's suppression is
 * a no-op (but it still modifies the dice pool).
 */
export function getFocusDiceModification(gambitId: GambitId | null): FocusDiceModification {
  const base: FocusDiceModification = {
    extraDice: 0,
    discardLowest: false,
    discardHighest: false,
    suppressCI: false,
    replaceRollWith: null,
  };

  switch (gambitId) {
    case 'seize-the-initiative':
      return { ...base, extraDice: 1, discardLowest: true };

    case 'finishing-blow':
      return { ...base, extraDice: 1, discardHighest: true };

    case 'grandstand':
      // Roll 2d6 discard highest; no Outside Support bonus (OS=0 in duel, no-op)
      return { ...base, extraDice: 1, discardHighest: true };

    // Kunnin' but Brutal: after normal roll, may replace result with LD.
    // The replaceRollWith value must be set by the engine which knows the LD.
    // We return suppressCI=false; the engine fills replaceRollWith.
    case 'kunnin-but-brutal':
      return { ...base, replaceRollWith: null }; // filled by engine

    default:
      return base;
  }
}

// ─── Strike step modifiers ────────────────────────────────────────────────────

export interface StrikeModifiers {
  /** Delta applied to current WS before hit roll. */
  wsDelta: number;
  /** If not null, override the model's Attacks to this value. */
  attacksOverride: number | null;
  /** Delta applied to current Attacks (ignored if attacksOverride is set). */
  attacksDelta: number;
  /** Delta applied to Strength for all hits. */
  strengthDelta: number;
  /** Delta applied to Damage for all hits. */
  damageDelta: number;
  /** If true, all hits have their Damage capped at 1 (Flurry of Blows). */
  damageSetToOne: boolean;
  /**
   * If true, the model may only make 1 attack regardless of other modifiers
   * (Guard Up / Withdraw single-attack cap).
   */
  singleAttackCap: boolean;
  /** Extra AP improvement (additive, lower = better). */
  apImprovement: number;
}

/**
 * Return strike-step modifiers for the given gambit.
 *
 * @param gambitId    - selected gambit (or null)
 * @param state       - current combat state snapshot
 * @param forPlayer   - true if computing mods for the human player
 * @param d3Result    - pre-rolled D3 value for Flurry of Blows (provide when
 *                      gambitId === 'flurry-of-blows')
 */
export function getStrikeModifiers(
  gambitId: GambitId | null,
  state: CombatState,
  forPlayer: boolean,
  d3Result = 1,
): StrikeModifiers {
  const base: StrikeModifiers = {
    wsDelta: 0,
    attacksOverride: null,
    attacksDelta: 0,
    strengthDelta: 0,
    damageDelta: 0,
    damageSetToOne: false,
    singleAttackCap: false,
    apImprovement: 0,
  };

  const attacker = forPlayer ? state.player : state.ai;
  const defender = forPlayer ? state.ai    : state.player;

  switch (gambitId) {
    case 'flurry-of-blows':
      return {
        ...base,
        attacksDelta: d3Result,   // +D3 Attacks
        damageSetToOne: true,     // all Damage → 1
      };

    case 'guard-up':
      return {
        ...base,
        wsDelta: +1,
        singleAttackCap: true,    // may only make 1 attack
      };

    case 'taunt-and-bait': {
      // Reduce own WS and Attacks to equal the enemy's (or enemy−1 if already equal)
      // We express this as a wsDelta and attacksDelta relative to own stats.
      // (The engine must have access to the actual character stats to compute deltas.)
      // Here we return a sentinel and let the engine apply it.
      return base; // engine handles taunt-and-bait directly
    }

    case 'withdraw':
      return {
        ...base,
        singleAttackCap: true,
      };

    case 'finishing-blow':
      return {
        ...base,
        strengthDelta: +1,
        damageDelta: +1,
      };

    case 'abyssal-strike':
      // +1 AP improvement to all hits (lower AP = better penetration)
      return {
        ...base,
        apImprovement: 1,
      };

    case 'every-strike-foreseen':
      // Effect applies in *opponent's* strike step (re-roll one failed save).
      // No direct modifier to the user's own strike.
      return base;

    default:
      return base;
  }

  // Suppress TS unreachable warning
  void attacker; void defender;
}

// ─── Glory step helpers ───────────────────────────────────────────────────────

/**
 * Check whether the Withdraw gambit allows the player to end the Challenge
 * without scoring CRP.
 *
 * @param gambitId  - gambit used by the side wishing to exit
 * @param isCasualty - true if that model was removed as a casualty
 */
export function canWithdrawFromChallenge(
  gambitId: GambitId | null,
  isCasualty: boolean,
): boolean {
  return gambitId === 'withdraw' && !isCasualty;
}

/**
 * Extra CRP modifier from Taunt and Bait (winner gets +1 per use).
 *
 * @param tauntCount  - number of times Taunt and Bait was used in this Challenge
 * @param isWinner    - true if the side in question won the Challenge
 */
export function getTauntAndBaitCRPBonus(tauntCount: number, isWinner: boolean): number {
  return isWinner ? tauntCount : 0;
}
