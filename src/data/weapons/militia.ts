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
 */
import type { Weapon } from '../../models/weapon.js';

// ── Rudimentary Weapons ───────────────────────────────────────────────────────

/** Close combat weapon: I, A, S, AP-, D1 */
export const MILITIA_CCW: Weapon = {
  name: 'Close Combat Weapon',
  type: 'melee',
  profiles: [{
    profileName: 'Close Combat Weapon',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: null, damage: 1,
    specialRules: [],
  }],
};

// ── Charnabal Weapons ─────────────────────────────────────────────────────────

/** Charnabal sabre: +1I, A, S, AP-, D1, Breaching(6+), Duellist's Edge(1) */
export const CHARNABAL_SABRE: Weapon = {
  name: 'Charnabal Sabre',
  type: 'melee',
  profiles: [{
    profileName: 'Charnabal Sabre',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: null, damage: 1,
    specialRules: [
      { name: 'Breaching',      threshold: 6 },
      { name: 'DuellistsEdge', value: 1 },
    ],
  }],
};

/** Charnabal tabar: I, A, +1S, AP-, D1, Breaching(6+), Duellist's Edge(1) */
export const CHARNABAL_TABAR: Weapon = {
  name: 'Charnabal Tabar',
  type: 'melee',
  profiles: [{
    profileName: 'Charnabal Tabar',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: null, damage: 1,
    specialRules: [
      { name: 'Breaching',      threshold: 6 },
      { name: 'DuellistsEdge', value: 1 },
    ],
  }],
};

// ── Paragon Weapons ───────────────────────────────────────────────────────────

/** Paragon blade: I, A, +1S, AP2, D1, Critical Hit(6+) */
export const MILITIA_PARAGON_BLADE: Weapon = {
  name: 'Paragon Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Paragon Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

// ── Power Weapons ─────────────────────────────────────────────────────────────

/** Power sword: I, A, S, AP3, D1, Breaching(6+) */
export const MILITIA_POWER_SWORD: Weapon = {
  name: 'Power Sword',
  type: 'melee',
  profiles: [{
    profileName: 'Power Sword',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 6 }],
  }],
};

/** Power axe: -1I, A, +1S, AP3, D1, Breaching(5+) */
export const MILITIA_POWER_AXE: Weapon = {
  name: 'Power Axe',
  type: 'melee',
  profiles: [{
    profileName: 'Power Axe',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
  }],
};

/** Power fist: -3I, A, +4S, AP2, D2 */
export const MILITIA_POWER_FIST: Weapon = {
  name: 'Power Fist',
  type: 'melee',
  profiles: [{
    profileName: 'Power Fist',
    initiativeModifier: { kind: 'add', value: -3 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};
