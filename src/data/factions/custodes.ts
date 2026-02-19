/**
 * Legio Custodes playable characters.
 *
 * Stat sources: Legacies of the Age of Darkness — Talons of the Emperor.
 * Only characters with Paragon Type or Command Sub-Type are eligible for
 * a Challenge; all three defined here qualify.
 */
import type { Character } from '../../models/character.js';
import {
  APOLLONIAN_SPEAR,
  SENTINEL_WARBLADE,
  GUARDIAN_SPEAR,
  MISERICORDIA,
} from '../weapons/custodes.js';

export const CUSTODES_CHARACTERS: Character[] = [
  // ── Constantin Valdor ──────────────────────────────────────────────────
  {
    id: 'constantin-valdor',
    name: 'Constantin Valdor',
    faction: 'legio-custodes',
    type: 'paragon',
    subTypes: ['Paragon', 'Command'],
    stats: {
      M: 8, WS: 7, BS: 6, S: 5, T: 5, W: 6,
      I: 6, A: 6, LD: 12, CL: 10, WP: 10, IN: 10,
      Sv: 2, Inv: 4,
    },
    weapons: [APOLLONIAN_SPEAR, MISERICORDIA],
    factionGambitIds: ['every-strike-foreseen', 'abyssal-strike'],
    specialRules: [
      { name: 'EternalWarrior', value: 2 },
      { name: 'Hatred', target: 'Paragon' },
    ],
  },

  // ── Tribune ────────────────────────────────────────────────────────────
  {
    id: 'tribune',
    name: 'Tribune',
    faction: 'legio-custodes',
    type: 'infantry',
    subTypes: ['Command'],
    stats: {
      M: 8, WS: 7, BS: 5, S: 5, T: 5, W: 5,
      I: 6, A: 6, LD: 12, CL: 10, WP: 10, IN: 10,
      Sv: 2, Inv: 4,
    },
    weapons: [SENTINEL_WARBLADE, MISERICORDIA],
    factionGambitIds: ['every-strike-foreseen', 'abyssal-strike'],
    specialRules: [
      { name: 'EternalWarrior', value: 2 },
    ],
  },

  // ── Shield Captain ─────────────────────────────────────────────────────
  {
    id: 'shield-captain',
    name: 'Shield Captain',
    faction: 'legio-custodes',
    type: 'infantry',
    subTypes: ['Command'],
    stats: {
      M: 8, WS: 6, BS: 5, S: 5, T: 5, W: 3,
      I: 5, A: 4, LD: 10, CL: 10, WP: 9, IN: 9,
      Sv: 2, Inv: 4,
    },
    weapons: [SENTINEL_WARBLADE, MISERICORDIA],
    factionGambitIds: ['every-strike-foreseen', 'abyssal-strike'],
    specialRules: [
      { name: 'EternalWarrior', value: 1 },
    ],
  },

  // ── Custodian Guard ─────────────────────────────────────────────────────
  // (Not command/paragon but included for broader play options)
  {
    id: 'custodian-guard',
    name: 'Custodian Guard',
    faction: 'legio-custodes',
    type: 'infantry',
    subTypes: [],
    stats: {
      M: 8, WS: 5, BS: 5, S: 5, T: 5, W: 2,
      I: 5, A: 3, LD: 10, CL: 10, WP: 8, IN: 8,
      Sv: 2, Inv: 6,
    },
    weapons: [GUARDIAN_SPEAR, MISERICORDIA],
    factionGambitIds: ['every-strike-foreseen', 'abyssal-strike'],
    specialRules: [
      { name: 'EternalWarrior', value: 1 },
    ],
  },
];
