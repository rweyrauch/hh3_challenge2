/**
 * Legio Titanicus playable characters.
 *
 * Stat sources: reference/output/units.json (Legio Titanicus army list).
 * Only models with the Command Sub-Type are eligible for a Challenge.
 *
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import { POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST } from '../weapons/legionAstartes.js';

// ── Secutarii Axiarch ─────────────────────────────────────────────────────────
// Commander of a Secutarii warband assigned to a Titan Maniple.
// Infantry (Command); Sv2+/Inv5+; W3; WS5; WP8.
// Default ranged weapon (rad grenades) has no melee profile; a selection of
// power weapons is offered here to represent challenge-eligible melee options.
const SECUTARII_AXIARCH: Character = {
  id: 'secutarii-axiarch',
  name: 'Secutarii Axiarch',
  faction: 'legio-titanicus',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 3, W: 3,
    I: 4, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_MAUL, POWER_FIST],
  factionGambitIds: [],
  specialRules: [],
};

export const LEGIO_TITANICUS_CHARACTERS: Character[] = [
  SECUTARII_AXIARCH,
];
