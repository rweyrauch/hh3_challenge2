/**
 * Solar Auxilia playable characters.
 *
 * Stat sources: reference/output/units.json (Solar Auxilia army list).
 * Only models with the Command Sub-Type are eligible for a Challenge.
 * The First Prime has Champion/Sergeant sub-types; included here as it is
 * a legal challenge participant from the Veletaris Command Section.
 *
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import { POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST, POWER_LANCE } from '../weapons/legionAstartes.js';

// ── Legate Marshall ───────────────────────────────────────────────────────────
// Senior officer of the Solar Auxilia Legatine Command Section.
// Infantry (Command); Sv2+/Inv5+; W4; WS5; S3/T3.
const LEGATE_MARSHALL: Character = {
  id: 'legate-marshall',
  name: 'Legate Marshall',
  faction: 'solar-auxilia',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 3, T: 3, W: 4,
    I: 4, A: 4, LD: 9, CL: 8, WP: 7, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST, POWER_LANCE],
  factionGambitIds: [],
  specialRules: [],
};

// ── Auxilia Captain ───────────────────────────────────────────────────────────
// Officer of a Tactical Command Section.
// Infantry (Command); Sv3+/Inv5+; W3; WS4; S3/T3.
const AUXILIA_CAPTAIN: Character = {
  id: 'auxilia-captain',
  name: 'Auxilia Captain',
  faction: 'solar-auxilia',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 4, BS: 5, S: 3, T: 3, W: 3,
    I: 4, A: 3, LD: 9, CL: 8, WP: 7, IN: 8,
    Sv: 3, Inv: 5,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST, POWER_LANCE],
  factionGambitIds: [],
  specialRules: [],
};

// ── First Prime ───────────────────────────────────────────────────────────────
// Champion/Sergeant of the Veletaris Command Section.
// Infantry (Champion, Sergeant); Sv4+, no Inv; W2; WS4; S3/T3.
const FIRST_PRIME: Character = {
  id: 'first-prime',
  name: 'First Prime',
  faction: 'solar-auxilia',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 6, WS: 4, BS: 4, S: 3, T: 3, W: 2,
    I: 3, A: 3, LD: 8, CL: 7, WP: 7, IN: 7,
    Sv: 4, Inv: null,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST],
  factionGambitIds: [],
  specialRules: [],
};

export const SOLAR_AUXILIA_CHARACTERS: Character[] = [
  LEGATE_MARSHALL,
  AUXILIA_CAPTAIN,
  FIRST_PRIME,
];
