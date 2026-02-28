/**
 * Legio Custodes melee weapon profiles.
 *
 * Only melee profiles are defined here; ranged profiles are omitted as they
 * are not used in the Challenge Sub-Phase.
 *
 * Weapon stat sources: Legacies of the Age of Darkness — Talons of the Emperor.
 */
import { type Weapon, profile } from '../../models/weapon.js';

/** The Apollonian Spear (melee profile: I, A, +2S, AP2, D2, Crit5+, DE2) */
export const APOLLONIAN_SPEAR: Weapon = {
  name: 'The Apollonian Spear',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Apollonian Spear (Melee)',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [
      { name: 'CriticalHit', threshold: 5 },
      { name: 'DuellistsEdge', value: 2 },
    ],
    traits: ['Power'],
  })],
};

/** Sentinel Warblade (melee: I, A, S, AP2, D1) */
export const SENTINEL_WARBLADE: Weapon = {
  name: 'Sentinel Warblade',
  type: 'melee',
  profiles: [profile({ profileName: 'Sentinel Warblade', ap: 2, damage: 1, traits: ['Power'] })],
};

/** Guardian Spear (melee: I, A, +1S, AP2, D1) */
export const GUARDIAN_SPEAR: Weapon = {
  name: 'Guardian Spear',
  type: 'melee',
  profiles: [profile({
    profileName: 'Guardian Spear',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    traits: ['Power'],
  })],
};

/** Paragon Spear (melee: I, A, +1S, AP2, D1, Critical Hit 6+) */
export const PARAGON_SPEAR: Weapon = {
  name: 'Paragon Spear',
  type: 'melee',
  profiles: [profile({
    profileName: 'Paragon Spear',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  })],
};

/** Misericordia (I, 1A fixed, S, AP3, D1, Precision(2+), Breaching(5+)) — simplified to AP3 D1 for Challenge use */
export const MISERICORDIA: Weapon = {
  name: 'Misericordia',
  type: 'melee',
  profiles: [profile({
    profileName: 'Misericordia',
    attacksModifier: { kind: 'fixed', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Precision', threshold: 2 },
      { name: 'Breaching', threshold: 5 },
    ],
    traits: ['Power'],
  })],
};
