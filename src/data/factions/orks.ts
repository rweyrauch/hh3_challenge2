/**
 * Ork playable characters.
 *
 * Stat sources: Xenos Forces of the Age of Darkness (Orks fan supplement).
 * Only characters with Command Sub-Type are eligible for a Challenge.
 *
 * Characters are defined for two sub-factions so the player can choose:
 *   - Goffs      → Brutal but Kunnin' gambit
 *   - Blood Axes → Kunnin' but Brutal gambit
 */
import type { Character } from '../../models/character.js';
import { CHOPPA, POWER_KLAW, SLUGGA, STIKKBOMBS, BIG_CHOPPA } from '../weapons/orks.js';

/** Warboss (Goffs) */
const WARBOSS_GOFFS: Character = {
  id: 'warboss-goffs',
  name: 'Warboss (Goffs)',
  faction: 'orks',
  subFaction: 'goffs',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 2, S: 5, T: 5, W: 4,
    I: 4, A: 6, LD: 9, CL: 10, WP: 9, IN: 7,
    Sv: 4, Inv: 4,
  },
  weapons: [CHOPPA, SLUGGA, STIKKBOMBS],
  factionGambitIds: ['brutal-but-kunnin'],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear', value: 1 },
  ],
};

/** Warboss (Blood Axes) */
const WARBOSS_BLOOD_AXES: Character = {
  id: 'warboss-blood-axes',
  name: 'Warboss (Blood Axes)',
  faction: 'orks',
  subFaction: 'blood-axes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 2, S: 5, T: 5, W: 4,
    I: 4, A: 6, LD: 9, CL: 10, WP: 9, IN: 7,
    Sv: 4, Inv: 4,
  },
  weapons: [CHOPPA, SLUGGA, STIKKBOMBS],
  factionGambitIds: ['kunnin-but-brutal'],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear', value: 1 },
  ],
};

/** Mega Warboss — Heavy sub-type (−1 Focus Roll), powerful S6 T6 */
const MEGA_WARBOSS: Character = {
  id: 'mega-warboss',
  name: 'Mega Warboss',
  faction: 'orks',
  subFaction: 'goffs',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 6, BS: 2, S: 6, T: 6, W: 5,
    I: 3, A: 5, LD: 9, CL: 10, WP: 9, IN: 7,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_KLAW],
  factionGambitIds: ['brutal-but-kunnin'],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear', value: 1 },
  ],
};

/** Bigboss (Goffs) */
const BIGBOSS_GOFFS: Character = {
  id: 'bigboss-goffs',
  name: 'Bigboss (Goffs)',
  faction: 'orks',
  subFaction: 'goffs',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 2, S: 4, T: 4, W: 3,
    I: 3, A: 4, LD: 8, CL: 9, WP: 8, IN: 6,
    Sv: 4, Inv: 5,
  },
  weapons: [BIG_CHOPPA, CHOPPA, SLUGGA],
  factionGambitIds: ['brutal-but-kunnin'],
  specialRules: [],
};

/** Bigboss (Blood Axes) */
const BIGBOSS_BLOOD_AXES: Character = {
  id: 'bigboss-blood-axes',
  name: 'Bigboss (Blood Axes)',
  faction: 'orks',
  subFaction: 'blood-axes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 2, S: 4, T: 4, W: 3,
    I: 3, A: 4, LD: 8, CL: 9, WP: 8, IN: 6,
    Sv: 4, Inv: 5,
  },
  weapons: [BIG_CHOPPA, CHOPPA, SLUGGA],
  factionGambitIds: ['kunnin-but-brutal'],
  specialRules: [],
};

export const ORK_CHARACTERS: Character[] = [
  WARBOSS_GOFFS,
  WARBOSS_BLOOD_AXES,
  MEGA_WARBOSS,
  BIGBOSS_GOFFS,
  BIGBOSS_BLOOD_AXES,
];
