/**
 * Blackshields characters.
 *
 * Blackshields are renegade Space Marines who have renounced their Legion
 * allegiances and fight under their own banner.  They draw on the training
 * and equipment of their former Legions but operate independently.
 *
 * Only characters with the Command Sub-Type are eligible for a Challenge.
 *
 * Stat sources: Legiones Astartes — Age of Darkness army list (Blackshields
 * expanded rules).
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import { TERRAWATT_POWER_GAUNTLET } from '../weapons/namedCharacters.js';

// ════════════════════════════════════════════════════════════════
// ENDRYD HAAR
// Infantry (Command, Unique) — High Command
// ════════════════════════════════════════════════════════════════

// ── Endryd Haar ───────────────────────────────────────────────────────────────
// The Riven Hound: special gambit — make a single attack at +4S and +2D.
// Not modelled as a faction gambit here (no Blackshields gambit file exists).
// Hatred(World Eaters): +1 to wound vs World Eaters models.
// EW(1): unsaved wound damage reduced by 1 (min 1).
// Fangs of the Emperor: army special rule (not relevant to Challenge engine).
const ENDRYD_HAAR: Character = {
  id: 'endryd-haar',
  name: 'Endryd Haar',
  faction: 'blackshields',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 10, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [TERRAWATT_POWER_GAUNTLET],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Hatred', target: 'World Eaters' },
  ],
  traits: ['Loyalist', 'Blackshields'],
};

export const BLACKSHIELDS_CHARACTERS: Character[] = [
  ENDRYD_HAAR,
];
