/**
 * Melee weapon profiles for Imperialis Militia characters.
 *
 * Sources: Imperialis Militia Army List — Armoury of the Imperialis Militia
 *          (reference/militia.md), Melee Weapons section.
 *
 * Only weapons relevant to the Challenge Sub-Phase are defined.
 * Ranged-only weapons (militia pistols, militia rifles, etc.) are omitted.
 *
 * Note on AP '-': represented as ap: null, which means no armour penetration
 * — the enemy's full armour save is always available.  Breaching(X) can still
 * override this on the relevant wound roll result.
 *
 * Charnabal weapons give the player a choice of sabre or tabar variant;
 * both are included so the UI can present them as separate weapon options.
 *
 * Standard power weapons (Power Sword, Power Axe, Power Fist) are shared
 * with Legion Astartes and imported from weapons/legionAstartes.ts.
 */
import { type Weapon, profile } from '../../models/weapon.js';

// ── Rudimentary Weapons ───────────────────────────────────────────────────────

/** Close combat weapon: I, A, S, AP-, D1 */
export const MILITIA_CCW: Weapon = {
  name: 'Close Combat Weapon',
  type: 'melee',
  profiles: [profile({ profileName: 'Close Combat Weapon', ap: null, damage: 1 })],
};

// ── Charnabal Weapons ─────────────────────────────────────────────────────────

/** Charnabal sabre: +1I, A, S, AP-, D1, Breaching(6+), Duellist's Edge(1) */
export const CHARNABAL_SABRE: Weapon = {
  name: 'Charnabal Sabre',
  type: 'melee',
  profiles: [profile({
    profileName: 'Charnabal Sabre',
    initiativeModifier: { kind: 'add', value: 1 },
    ap: null, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'DuellistsEdge', value: 1 },
    ],
    traits: ['Charnabal'],
  })],
};

/** Charnabal tabar: I, A, +1S, AP-, D1, Breaching(6+), Duellist's Edge(1) */
export const CHARNABAL_TABAR: Weapon = {
  name: 'Charnabal Tabar',
  type: 'melee',
  profiles: [profile({
    profileName: 'Charnabal Tabar',
    strengthModifier: { kind: 'add', value: 1 },
    ap: null, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'DuellistsEdge', value: 1 },
    ],
    traits: ['Charnabal'],
  })],
};

// ── Paragon Weapons ───────────────────────────────────────────────────────────

/** Paragon blade: I, A, +1S, AP2, D1, Critical Hit(6+) */
export const MILITIA_PARAGON_BLADE: Weapon = {
  name: 'Paragon Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Paragon Blade',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  })],
};
