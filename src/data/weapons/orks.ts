/**
 * Ork melee weapon profiles.
 *
 * Weapon stat sources: Xenos Forces of the Age of Darkness (Orks fan supplement).
 */
import type { Weapon } from '../../models/weapon.js';

/** Choppa: I, A, S, AP-, D1 */
export const CHOPPA: Weapon = {
  name: 'Choppa',
  type: 'melee',
  profiles: [
    {
      profileName: 'Choppa',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: null,              // AP '-'
      damage: 1,
      specialRules: [],
    },
  ],
};

/** Power Klaw: -3 IM, A, +4S, AP2, D2, Rending 6+ */
export const POWER_KLAW: Weapon = {
  name: 'Power Klaw',
  type: 'melee',
  profiles: [
    {
      profileName: 'Power Klaw',
      initiativeModifier: { kind: 'add', value: -3 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 4 },
      ap: 2,
      damage: 2,
      specialRules: [{ name: 'Rending', threshold: 6 }],
    },
  ],
};

/** Big Choppa: -1 IM, A, +2S, AP5, D2, Shred 6+ */
export const BIG_CHOPPA: Weapon = {
  name: 'Big Choppa',
  type: 'melee',
  profiles: [
    {
      profileName: 'Big Choppa',
      initiativeModifier: { kind: 'add', value: -1 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 2 },
      ap: 5,
      damage: 2,
      specialRules: [{ name: 'Shred', threshold: 6 }],
    },
  ],
};

/**
 * Slugga — included so models that carry it have a ranged option, but it
 * plays no role in the Challenge Sub-Phase (melee only).
 * Listed here for completeness; the engine ignores ranged profiles.
 */
export const SLUGGA: Weapon = {
  name: 'Slugga',
  type: 'ranged',
  profiles: [
    {
      profileName: 'Slugga',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: null,
      damage: 1,
      specialRules: [],
    },
  ],
};

/** Stikkbombs — ranged, not used in Challenge */
export const STIKKBOMBS: Weapon = {
  name: 'Stikkbombs',
  type: 'ranged',
  profiles: [
    {
      profileName: 'Stikkbombs',
      initiativeModifier: { kind: 'none' },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: null,
      damage: 1,
      specialRules: [],
    },
  ],
};
