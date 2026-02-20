/**
 * Legiones Astartes melee weapon profiles.
 *
 * Only melee profiles are defined here; ranged profiles are omitted as they
 * are not used in the Challenge Sub-Phase.
 *
 * Weapon stat sources: Legiones Astartes — Armoury of the Legiones Astartes.
 */
import type { Weapon } from '../../models/weapon.js';

/** Power Sword: I, A, S, AP3, D1, Breaching(6+) */
export const POWER_SWORD: Weapon = {
  name: 'Power Sword',
  type: 'melee',
  profiles: [
    {
      profileName: 'Power Sword',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: 3,
      damage: 1,
      specialRules: [{ name: 'Breaching', threshold: 6 }],
    },
  ],
};

export const POWER_AXE: Weapon = {
  name: 'Power Axe',
  type: 'melee',
  profiles: [
    {
      profileName: 'Power Axe',
      initiativeModifier: { kind: 'add', value: -1 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 1 },
      ap: 3,
      damage: 1,
      specialRules: [{ name: 'Breaching', threshold: 5 }],
    },
  ],
};

export const POWER_MAUL: Weapon = {
  name: 'Power Maul',
  type: 'melee',
  profiles: [
    {
      profileName: 'Power Maul',
      initiativeModifier: { kind: 'add', value: -1 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 2 },
      ap: 3,
      damage: 1,
      specialRules: [{ name: 'Breaching', threshold: 6 }],
    },
  ],
};

export const POWER_LANCE: Weapon = {
  name: 'Power Lance',
  type: 'melee',
  profiles: [
    {
      profileName: 'Power Lance',
      initiativeModifier: { kind: 'add', value: 1 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: 3,
      damage: 1,
      specialRules: [{ name: 'Precision', threshold: 6 }],
    },
  ],
};

/** Paragon Blade: I, A, +1S, AP2, D1, Critical Hit(6+) */
export const PARAGON_BLADE: Weapon = {
  name: 'Paragon Blade',
  type: 'melee',
  profiles: [
    {
      profileName: 'Paragon Blade',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 1 },
      ap: 2,
      damage: 1,
      specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    },
  ],
};

/** Power Fist: I-3, A, +4S, AP2, D2 */
export const POWER_FIST: Weapon = {
  name: 'Power Fist',
  type: 'melee',
  profiles: [
    {
      profileName: 'Power Fist',
      initiativeModifier: { kind: 'add', value: -3 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 4 },
      ap: 2,
      damage: 2,
      specialRules: [],
    },
  ],
};

/** Thunder Hammer: I-2, A, +3S, AP2, D2 */
export const THUNDER_HAMMER: Weapon = {
  name: 'Thunder Hammer',
  type: 'melee',
  profiles: [
    {
      profileName: 'Thunder Hammer',
      initiativeModifier: { kind: 'add', value: -2 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 3 },
      ap: 2,
      damage: 2,
      specialRules: [],
    },
  ],
};

/** Crozius Arcanum: I, A, +2S, AP3, D2, Breaching(6+) */
export const CROZIUS_ARCANUM: Weapon = {
  name: 'Crozius Arcanum',
  type: 'melee',
  profiles: [
    {
      profileName: 'Crozius Arcanum',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 2 },
      ap: 3,
      damage: 2,
      specialRules: [{ name: 'Breaching', threshold: 6 }],
    },
  ],
};

/**
 * Lightning Claws (pair): I, +2A, S, AP3, D1, Rending(6+).
 * The paired bonus (+2A) represents both claws striking simultaneously.
 */
export const LIGHTNING_CLAWS_PAIR: Weapon = {
  name: 'Lightning Claws (pair)',
  type: 'melee',
  profiles: [
    {
      profileName: 'Lightning Claws (pair)',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'add', value: 2 },
      strengthModifier:   { kind: 'none' },
      ap: 3,
      damage: 1,
      specialRules: [{ name: 'Rending', threshold: 6 }, { name: 'Breaching', threshold: 6 }],
    },
  ],
};

/** Chainsword: I, A, S, AP5, D1 */
export const CHAINSWORD: Weapon = {
  name: 'Chainsword',
  type: 'melee',
  profiles: [
    {
      profileName: 'Chainsword',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: 5,
      damage: 1,
      specialRules: [{ name: 'Shred', threshold: 6}],
    },
  ],
};

/** Lightning Claw: I, A, S, AP3, D1 */
export const LIGHTNING_CLAW: Weapon = {
  name: 'Lightning Claw',
  type: 'melee',
  profiles: [
    {
      profileName: 'Lightning Claw',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: 3,
      damage: 1,
      specialRules: [{ name: 'Rending', threshold: 6 }, { name: 'Breaching', threshold: 6 }],
    },
  ],
};

/** Chainfist: I-3, A-1, +6S, AP2, D2 */
export const CHAINFIST: Weapon = {
  name: 'Chainfist',
  type: 'melee',
  profiles: [
    {
      profileName: 'Chainfist',
      initiativeModifier: { kind: 'add', value: -3 },
      attacksModifier:    { kind: 'add', value: -1 },
      strengthModifier:   { kind: 'add', value: 6 },
      ap: 2,
      damage: 2,
      specialRules: [{ name: 'Shred', threshold: 6}],
    },
  ],
};

export const SATURNINE_WAR_AXE: Weapon = {
  name: 'Saturnine War Axe',
  type: 'melee',
  profiles: [
    {
      profileName: 'Saturnine War Axe',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 1 },
      ap: 2,
      damage: 2,
      specialRules: [],
    },
  ],
};

export const SATURNINE_DISRUPTION_FIST: Weapon = {
  name: 'Saturnine Disruption Fist',
  type: 'melee',
  profiles: [
    {
      profileName: 'Saturnine Disruption Fist',
      initiativeModifier: { kind: 'add', value: -2 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 2 },
      ap: 2,
      damage: 3,
      specialRules: [],
    },
  ],
};
 
export const SATURNINE_CONCUSSION_HAMMER: Weapon = {
  name: 'Saturnine Concussion Hammer',
  type: 'melee',
  profiles: [
    {
      profileName: 'Saturnine Concussion Hammer',
      initiativeModifier: { kind: 'add', value: -3 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'mult', value: 2 },
      ap: 2,
      damage: 2,
      specialRules: [{ name: 'CriticalHit', threshold: 6}],
    },
  ],

};