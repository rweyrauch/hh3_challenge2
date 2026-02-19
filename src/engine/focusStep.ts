/**
 * Focus Step resolution.
 *
 * Each model rolls a Focus Roll; the higher total wins Challenge Advantage
 * and gains +1 Attack in the Strike step.  Ties are re-rolled.
 *
 * Rules reference: HH3 Challenge Sub-Phase, Step 3 (Focus).
 */
import type { DiceRoller }     from './dice.js';
import type { CombatState }    from '../models/combatState.js';
import type { Character }      from '../models/character.js';
import type { WeaponProfile }  from '../models/weapon.js';
import { calculateCombatInitiative, buildFocusTotal, getDuellistsEdgeBonus }
  from './combatInitiative.js';
import { getFocusDiceModification } from './gambitEffects.js';
import type { GambitId }       from '../models/gambit.js';

/** Result of one model's Focus Roll. */
export interface FocusRollResult {
  diceRolled: number[];    // raw dice before any discard
  diceKept:   number[];    // dice after discard rules applied
  diceTotal:  number;      // sum of kept dice
  ci:         number;      // Combat Initiative contribution
  modifiers:  number;      // sum of all other bonuses/penalties
  total:      number;      // grand total = diceTotal + ci + modifiers
}

/** Full output of the Focus Step. */
export interface FocusStepResult {
  playerRoll: FocusRollResult;
  aiRoll:     FocusRollResult;
  /** Which side gains Challenge Advantage (never null after this step). */
  advantage:  'player' | 'ai';
  /** +1 Attack bonus applied to the winner's Strike step. */
  winnerAttackBonus: 1;
  /** Log messages generated during resolution. */
  log: string[];
}

/**
 * Apply dice discard rules and return kept results.
 */
function applyDiscardRules(
  dice: number[],
  discardLowest: boolean,
  discardHighest: boolean,
): number[] {
  if (dice.length <= 1) return dice;
  if (discardLowest) {
    const min = Math.min(...dice);
    const idx = dice.indexOf(min);
    return dice.filter((_, i) => i !== idx);
  }
  if (discardHighest) {
    const max = Math.max(...dice);
    const idx = dice.indexOf(max);
    return dice.filter((_, i) => i !== idx);
  }
  return dice;
}

/**
 * Roll a single model's Focus.
 */
function rollFocus(
  dice: DiceRoller,
  char: Character,
  profile: WeaponProfile,
  gambitId: GambitId | null,
  currentWounds: number,
  baseWounds: number,
  guardUpBonus: number,
): FocusRollResult {
  const mod = getFocusDiceModification(gambitId);
  const numDice = 1 + mod.extraDice;
  const rawDice = dice.rollNd6(numDice);
  let keptDice = applyDiscardRules(rawDice, mod.discardLowest, mod.discardHighest);

  // Kunnin' but Brutal: after rolling, may replace roll result with LD
  if (gambitId === 'kunnin-but-brutal') {
    const ldValue = char.stats.LD;
    const rollTotal = keptDice.reduce((a, b) => a + b, 0);
    if (ldValue > rollTotal) {
      // Replace dice total with LD; represent as a single "die" showing LD
      keptDice = [ldValue];
    }
  }

  const ci = calculateCombatInitiative(char.stats, profile);
  const isHeavy = char.subTypes.includes('Heavy');
  const isLight = char.subTypes.includes('Light');
  const woundPenalty = Math.max(0, baseWounds - currentWounds);
  const de = getDuellistsEdgeBonus(profile.specialRules, char.specialRules);
  // Outside support is always 0 in 1v1
  const os = 0;

  const diceTotal = keptDice.reduce((a, b) => a + b, 0);
  const total = buildFocusTotal(keptDice, ci, isHeavy, isLight, woundPenalty, de, os, guardUpBonus);

  return {
    diceRolled: rawDice,
    diceKept:   keptDice,
    diceTotal,
    ci,
    modifiers: total - diceTotal - ci,
    total,
  };
}

/**
 * Resolve the Focus Step for both combatants.
 *
 * Re-rolls ties until one side wins.  Returns the full result including the
 * advantage winner and a log of what happened.
 *
 * @param dice         - injectable dice roller
 * @param state        - current combat state (gambits already selected)
 * @param playerChar   - full player character record
 * @param aiChar       - full AI character record
 * @param testTheFoe   - if set, this side automatically wins advantage
 */
export function resolveFocusStep(
  dice: DiceRoller,
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
  testTheFoe: 'player' | 'ai' | null,
): FocusStepResult {
  const log: string[] = [];

  // Test the Foe: automatic advantage
  if (testTheFoe !== null) {
    const dummyProfile = playerChar.weapons[0].profiles[0];
    const dummyAiProfile = aiChar.weapons[0].profiles[0];
    const pr: FocusRollResult = {
      diceRolled: [], diceKept: [], diceTotal: 0,
      ci: 0, modifiers: 0, total: 0,
    };
    log.push(`Test the Foe: ${testTheFoe === 'player' ? 'Player' : 'AI'} automatically gains Challenge Advantage.`);
    return { playerRoll: pr, aiRoll: pr, advantage: testTheFoe, winnerAttackBonus: 1, log };
    void dummyProfile; void dummyAiProfile;
  }

  const playerProfile = state.player.selectedWeaponProfile!;
  const aiProfile     = state.ai.selectedWeaponProfile!;

  let attempt = 0;
  let playerRoll: FocusRollResult;
  let aiRoll: FocusRollResult;
  let advantage: 'player' | 'ai';

  // Abyssal Strike: player replaces own I with opponent's I for Focus Roll
  const playerGambit = state.player.selectedGambit;
  const aiGambit     = state.ai.selectedGambit;

  do {
    attempt++;
    if (attempt > 1) log.push('Tie! Re-rolling Focus...');

    let effectivePlayerChar = playerChar;
    let effectiveAiChar     = aiChar;

    // Abyssal Strike: player's CI uses opponent's I
    if (playerGambit === 'abyssal-strike') {
      const swapped = { ...playerChar, stats: { ...playerChar.stats, I: aiChar.stats.I } };
      effectivePlayerChar = swapped;
      if (attempt === 1) log.push('Abyssal Strike: Player uses opponent\'s Initiative for Focus Roll.');
    }
    if (aiGambit === 'abyssal-strike') {
      const swapped = { ...aiChar, stats: { ...aiChar.stats, I: playerChar.stats.I } };
      effectiveAiChar = swapped;
      if (attempt === 1) log.push('Abyssal Strike: AI uses opponent\'s Initiative for Focus Roll.');
    }

    playerRoll = rollFocus(
      dice, effectivePlayerChar, playerProfile,
      playerGambit,
      state.player.currentWounds, state.player.baseWounds,
      state.player.guardUpFocusBonus,
    );

    aiRoll = rollFocus(
      dice, effectiveAiChar, aiProfile,
      aiGambit,
      state.ai.currentWounds, state.ai.baseWounds,
      state.ai.guardUpFocusBonus,
    );

    if (attempt === 1) {
      log.push(
        `Focus Roll — Player: ${playerRoll.diceKept.join(',')} + CI${playerRoll.ci} + mods${playerRoll.modifiers} = ${playerRoll.total}`,
      );
      log.push(
        `Focus Roll — AI: ${aiRoll.diceKept.join(',')} + CI${aiRoll.ci} + mods${aiRoll.modifiers} = ${aiRoll.total}`,
      );
    }

    if (playerRoll.total > aiRoll.total) {
      advantage = 'player';
    } else if (aiRoll.total > playerRoll.total) {
      advantage = 'ai';
    }
    // else loop again (tie)
  } while (playerRoll!.total === aiRoll!.total);

  log.push(`Challenge Advantage: ${advantage! === 'player' ? 'Player' : 'AI'} wins (+1 Attack in Strike).`);

  return {
    playerRoll: playerRoll!,
    aiRoll:     aiRoll!,
    advantage:  advantage!,
    winnerAttackBonus: 1,
    log,
  };
}
