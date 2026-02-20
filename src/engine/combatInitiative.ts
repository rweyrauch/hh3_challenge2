/**
 * Combat Initiative calculation.
 *
 * Combat Initiative = model's current Initiative + weapon's Initiative Modifier.
 * The modifier may be additive, multiplicative or fixed (replacing the model's I).
 *
 * Source: HH3 core rulebook, Challenge Sub-Phase, Focus Step.
 */
import type { WeaponProfile, SpecialRule } from '../models/weapon.js';
import type { CharacterStats } from '../models/character.js';

/**
 * Calculate the Combat Initiative score for a model using the given weapon
 * profile.
 *
 * @param stats              - current model statistics (I used as base)
 * @param profile            - selected weapon profile (IM applied)
 * @param extraSpecialRules  - model-level special rules (e.g. EternalWarrior not
 *                             relevant here, but DuellistsEdge IS if on the model)
 * @returns raw Combat Initiative score (≥ 0)
 */
export function calculateCombatInitiative(
  stats: CharacterStats,
  profile: WeaponProfile,
): number {
  const baseI = stats.I;
  const im    = profile.initiativeModifier;

  let ci: number = baseI;
  switch (im.kind) {
    case 'none':
      ci = baseI;
      break;
    case 'add':
      ci = baseI + im.value;
      break;
    case 'fixed':
      ci = im.value;
      break;
    case 'mult':
      ci = Math.round(baseI * im.value);
      break;
  }

  return Math.max(0, ci);
}

/**
 * Build the Focus Roll total for one model.
 *
 * Focus Roll = 1d6 result(s) + Combat Initiative + subtype modifiers
 *              + DuellistsEdge bonus + outside support bonus.
 *
 * This function takes the dice results already provided (so the engine can
 * inject fake dice) and combines them with the other modifiers.
 *
 * @param diceResults       - array of d6 results after gambit-based discard rules
 *                            (e.g., Seize the Initiative: 2d6 keep highest;
 *                             Finishing Blow / Grandstand: 2d6 keep lowest)
 * @param combatInitiative  - pre-computed CI score
 * @param isHeavy           - true if model has the Heavy sub-type (−1 penalty)
 * @param isLight           - true if model has the Light sub-type (+1 bonus)
 * @param woundPenalty      - number of wounds below base (each missing = −1)
 * @param duellistsEdge     - total Duellist's Edge bonus from weapon + model
 * @param outsideSupport    - bonus from friendly models in the same combat (0 in 1v1)
 * @param guardUpBonus      - accumulated Guard Up focus bonus from previous round
 * @returns total Focus Roll value
 */
export function buildFocusTotal(
  diceResults: number[],
  combatInitiative: number,
  isHeavy: boolean,
  isLight: boolean,
  woundPenalty: number,
  duellistsEdge: number,
  outsideSupport: number,
  guardUpBonus: number,
): number {
  const diceTotal = diceResults.reduce((a, b) => a + b, 0);
  const heavyMod  = isHeavy ? -1 : 0;
  const lightMod  = isLight ? +1 : 0;

  return (
    diceTotal
    + combatInitiative
    + heavyMod
    + lightMod
    - woundPenalty
    + duellistsEdge
    + outsideSupport
    + guardUpBonus
  );
}

/**
 * Extract the total DuellistsEdge bonus for a model from its weapon's
 * special rules and its own model-level special rules.
 */
export function getDuellistsEdgeBonus(
  weaponRules: SpecialRule[],
  modelRules: SpecialRule[],
): number {
  let total = 0;
  for (const rule of [...weaponRules, ...modelRules]) {
    if (rule.name === 'DuellistsEdge') total += rule.value;
  }
  return total;
}
