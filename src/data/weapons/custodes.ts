/**
 * Legio Custodes melee weapon profiles.
 *
 * Only melee profiles are defined here; ranged profiles are omitted as they
 * are not used in the Challenge Sub-Phase.
 *
 * Weapon stat sources: Legacies of the Age of Darkness — Talons of the Emperor.
 */
import type { Weapon } from '../../models/weapon.js';

/** The Apollonian Spear (melee profile: I, A, +2S, AP2, D2, Crit5+, DE2) */
export const APOLLONIAN_SPEAR: Weapon = {
  name: 'The Apollonian Spear',
  type: 'melee',
  profiles: [
    {
      profileName: 'The Apollonian Spear (Melee)',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 2 },
      ap: 2,
      damage: 2,
      specialRules: [
        { name: 'CriticalHit', threshold: 5 },
        { name: 'DuellistsEdge', value: 2 },
      ],
    },
  ],
};

/** Sentinel Warblade (melee: I, A, S, AP2, D1) */
export const SENTINEL_WARBLADE: Weapon = {
  name: 'Sentinel Warblade',
  type: 'melee',
  profiles: [
    {
      profileName: 'Sentinel Warblade',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' }, // 'S' = same as model's S
      ap: 2,
      damage: 1,
      specialRules: [],
    },
  ],
};

/** Guardian Spear (melee: I, A, +1S, AP2, D1, Impact AM) */
export const GUARDIAN_SPEAR: Weapon = {
  name: 'Guardian Spear',
  type: 'melee',
  profiles: [
    {
      profileName: 'Guardian Spear',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 1 },
      ap: 2,
      damage: 1,
      specialRules: [],
    },
  ],
};

/** Paragon Spear (melee: I, A, +1S, AP2, D1, Critical Hit 6+) */
export const PARAGON_SPEAR: Weapon = {
  name: 'Paragon Spear',
  type: 'melee',
  profiles: [
    {
      profileName: 'Paragon Spear',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 1 },
      ap: 2,
      damage: 1,
      specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    },
  ],
};

/** Misericordia (I, 1, S, AP3, *) — simplified to AP3 D1 for Challenge use */
export const MISERICORDIA: Weapon = {
  name: 'Misericordia',
  type: 'melee',
  profiles: [
    {
      profileName: 'Misericordia',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'fixed', value: 1 },
      strengthModifier:   { kind: 'none' },
      ap: 3,
      damage: 1,
      specialRules: [],
    },
  ],
};
