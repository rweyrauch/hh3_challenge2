/**
 * Core look-up tables for the Age of Darkness rules.
 *
 * All functions are pure and have no side effects.
 *
 * Sources:
 *  - Melee Hit Table (HH3 core rulebook p. 195)
 *  - Wound Table     (HH3 core rulebook p. 196)
 *  - Saving Throw rules (HH3 core rulebook p. 197)
 */

/**
 * Full 10×10 melee Hit table.
 *
 * Indexed as HIT_TABLE[attackerWS - 1][defenderWS - 1].
 * Values ≥ 10 are treated as 10.
 * Each entry is the minimum d6 result needed to score a hit (Target Number).
 * A value of 7 means "impossible" (no save, hits never land).
 */
const HIT_TABLE: number[][] = [
  // Atk WS 1 vs Def WS 1..10+
  [4, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  // Atk WS 2
  [2, 4, 5, 6, 6, 6, 6, 6, 6, 6],
  // Atk WS 3
  [2, 3, 4, 5, 5, 6, 6, 6, 6, 6],
  // Atk WS 4
  [2, 2, 3, 4, 5, 5, 5, 6, 6, 6],
  // Atk WS 5
  [2, 2, 3, 3, 4, 5, 5, 5, 6, 6],
  // Atk WS 6
  [2, 2, 2, 3, 3, 4, 5, 5, 5, 6],
  // Atk WS 7
  [2, 2, 2, 3, 3, 3, 4, 5, 5, 5],
  // Atk WS 8
  [2, 2, 2, 2, 3, 3, 3, 4, 5, 5],
  // Atk WS 9
  [2, 2, 2, 2, 3, 3, 3, 3, 4, 5],
  // Atk WS 10+
  [2, 2, 2, 2, 2, 3, 3, 3, 3, 4],
];

/**
 * Return the minimum d6 result needed to score a hit in melee.
 *
 * @param atkWS - attacker's current Weapon Skill (capped at 10)
 * @param defWS - defender's current Weapon Skill (capped at 10)
 * @returns Target Number (2–6), or 7 if the hit is impossible.
 */
export function getHitTargetNumber(atkWS: number, defWS: number): number {
  const row = Math.min(Math.max(atkWS, 1), 10) - 1;
  const col = Math.min(Math.max(defWS, 1), 10) - 1;
  return HIT_TABLE[row][col];
}

/**
 * Full S vs T wound table.
 *
 * Indexed as WOUND_TABLE[strength - 1][toughness - 1].
 * Values ≥ 10 treated as 10.
 * 7 means "impossible" (-).
 */
const WOUND_TABLE: number[][] = [
  // S 1 vs T 1..10+
  [4, 5, 6, 6, 7, 7, 7, 7, 7, 7],
  // S 2
  [3, 4, 5, 6, 6, 7, 7, 7, 7, 7],
  // S 3
  [2, 3, 4, 5, 6, 6, 7, 7, 7, 7],
  // S 4
  [2, 2, 3, 4, 5, 6, 6, 7, 7, 7],
  // S 5
  [2, 2, 2, 3, 4, 5, 6, 6, 7, 7],
  // S 6
  [2, 2, 2, 2, 3, 4, 5, 6, 6, 7],
  // S 7
  [2, 2, 2, 2, 2, 3, 4, 5, 6, 6],
  // S 8
  [2, 2, 2, 2, 2, 2, 3, 4, 5, 6],
  // S 9
  [2, 2, 2, 2, 2, 2, 2, 3, 4, 5],
  // S 10+
  [2, 2, 2, 2, 2, 2, 2, 2, 3, 4],
];

/**
 * Return the minimum d6 result needed for a wound.
 *
 * @param strength  - effective Strength of the hit
 * @param toughness - defender's current Toughness
 * @returns Target Number (2–6), or 7 if impossible.
 */
export function getWoundTargetNumber(strength: number, toughness: number): number {
  const row = Math.min(Math.max(strength, 1), 10) - 1;
  const col = Math.min(Math.max(toughness, 1), 10) - 1;
  return WOUND_TABLE[row][col];
}

/**
 * Determine the best available saving throw value for a model given the AP
 * of the incoming wound.
 *
 * Rules:
 *  - Armour Save may be used unless AP ≤ Sv (i.e., the armour is penetrated).
 *  - Invulnerable Save ignores AP entirely.
 *  - The best (lowest number = easier) applicable save is returned.
 *  - Returns null if no save is possible.
 *
 * @param armourSave   - Armour Save characteristic value (e.g., 2 means 2+).
 *                       Pass 7 or Infinity to indicate no armour save ('-').
 * @param invSave      - Invulnerable Save value, or null for '-'.
 * @param ap           - AP of the incoming wound, or null for AP '-' (no AP).
 * @returns The Target Number of the best save, or null if no save available.
 */
export function getEffectiveSave(
  armourSave: number,
  invSave: number | null,
  ap: number | null,
): number | null {
  const saves: number[] = [];

  // Armour save is available only when the AP value does NOT equal or beat it.
  // AP null means "AP '-'" which cannot penetrate any armour.
  const armourPenetrated = ap !== null && ap <= armourSave;
  if (!armourPenetrated && armourSave <= 6) {
    saves.push(armourSave);
  }

  // Invulnerable save is never affected by AP.
  if (invSave !== null && invSave <= 6) {
    saves.push(invSave);
  }

  if (saves.length === 0) return null;
  return Math.min(...saves);
}
