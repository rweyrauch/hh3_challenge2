/**
 * Skitarii Conclaves playable characters.
 *
 * Stat sources: reference/output/units.json (Skitarii Conclaves army list).
 * Only models with the Command Sub-Type are eligible for a Challenge.
 *
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import { POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST } from '../weapons/legionAstartes.js';

// ── Skitarii Battle-Pilgrym Marshal ──────────────────────────────────────────
// Senior commander of a Skitarii Conclave warband.
// Infantry (Command); Sv4+/Inv5+; W4; WS5; WP8.
// Default weapon is an arc pike / radium jezzail (ranged); melee loadout varies.
// A selection of power weapons is offered here to represent wargear options.
const SKITARII_MARSHAL: Character = {
  id: 'skitarii-battle-pilgrym-marshal',
  name: 'Skitarii Battle-Pilgrym Marshal',
  faction: 'skitarii',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 3, T: 4, W: 4,
    I: 4, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 4, Inv: 5,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST],
  factionGambitIds: [],
  specialRules: [],
};

export const SKITARII_CHARACTERS: Character[] = [
  SKITARII_MARSHAL,
];
