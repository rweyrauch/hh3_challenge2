/**
 * Mechanicum playable characters.
 *
 * Stat sources: reference/output/units.json (Mechanicum.cat).
 * Only models with Command or Champion sub-type are eligible for a Challenge.
 *
 * Melee weapon notes:
 *   - Anacharis Scoria and Archmagos Draykavac have specific named weapons in
 *     the catalogue data.
 *   - Archmagos, Magos, Arcuitor Magisterium, and Myrmidon Lords have wargear
 *     group options ("Mechanicum Melee Weapons / Magos Weapons") rather than
 *     fixed loadouts; a representative selection of power weapons is provided.
 *   - Feel No Pain thresholds: Archmagos-tier (5+), Magos-tier (6+).
 *     Myrmidon Lords gain Feel No Pain (6+) via Battle Meditation in Challenges.
 *   - Shock, Armourbane, and other non-Challenge special rules are omitted.
 */
import type { Character } from '../../models/character.js';
import {
  POWER_AXE,
  POWER_MAUL,
  POWER_FIST,
  PARAGON_BLADE,
} from '../weapons/legionAstartes.js';
import { VODIAN_SCEPTRE, SCORIAN_TALONS, ARC_SCOURGES } from '../weapons/mechanicum.js';

// ── Unique Characters ─────────────────────────────────────────────────────────

/** Anacharis Scoria — Archmagos of the Xanan Dominion (Walker, Champion) */
const ANACHARIS_SCORIA: Character = {
  id: 'anacharis-scoria',
  name: 'Anacharis Scoria',
  faction: 'mechanicum',
  type: 'infantry',  // Walker type modelled as infantry; Challenge mechanics identical
  subTypes: ['Champion'],
  stats: {
    M: 9, WS: 6, BS: 6, S: 6, T: 7, W: 9,
    I: 5, A: 5, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [VODIAN_SCEPTRE, SCORIAN_TALONS],
  factionGambitIds: [],
  specialRules: [
    { name: 'Fear',           value: 1 },
    { name: 'EternalWarrior', value: 1 },
    { name: 'FeelNoPain',     threshold: 5 },
  ],
};

/** Archmagos Draykavac — unique Archmagos with Paragon blade */
const ARCHMAGOS_DRAYKAVAC: Character = {
  id: 'archmagos-draykavac',
  name: 'Archmagos Draykavac',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 6, S: 6, T: 6, W: 6,
    I: 4, A: 4, LD: 10, CL: 9, WP: 9, IN: 12,
    Sv: 2, Inv: 4,
  },
  weapons: [PARAGON_BLADE],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 5 },
  ],
};

// ── Archmagos ─────────────────────────────────────────────────────────────────

/** Archmagos — senior Mechanicum commander */
const ARCHMAGOS: Character = {
  id: 'archmagos',
  name: 'Archmagos',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 6, S: 6, T: 6, W: 6,
    I: 4, A: 4, LD: 9, CL: 10, WP: 9, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_AXE, PARAGON_BLADE, POWER_FIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 5 },
  ],
};

/**
 * Archmagos on Abeyant — mounted on an antigrav platform.
 * Heavy sub-type (Abeyant bulk) gives −1 to Focus Roll.
 */
const ARCHMAGOS_ON_ABEYANT: Character = {
  id: 'archmagos-on-abeyant',
  name: 'Archmagos on Abeyant',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 6, S: 6, T: 7, W: 6,
    I: 3, A: 4, LD: 10, CL: 10, WP: 9, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_AXE, PARAGON_BLADE, POWER_FIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 5 },
  ],
};

// ── Arcuitor Magisterium ──────────────────────────────────────────────────────

/** Arcuitor Magisterium — elite warrior-enforcer of the Mechanicum */
const ARCUITOR_MAGISTERIUM: Character = {
  id: 'arcuitor-magisterium',
  name: 'Arcuitor Magisterium',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 5, T: 5, W: 4,
    I: 4, A: 5, LD: 9, CL: 9, WP: 8, IN: 9,
    Sv: 2, Inv: 5,
  },
  weapons: [ARC_SCOURGES, POWER_AXE, POWER_MAUL, POWER_FIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 5 },
  ],
};

// ── Magos ─────────────────────────────────────────────────────────────────────

/** Magos — mid-rank Mechanicum commander */
const MAGOS: Character = {
  id: 'magos',
  name: 'Magos',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 4, BS: 5, S: 5, T: 5, W: 4,
    I: 3, A: 3, LD: 8, CL: 9, WP: 8, IN: 9,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_AXE, POWER_FIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 6 },
  ],
};

/**
 * Magos on Abeyant — Magos mounted on an antigrav platform.
 * Heavy sub-type gives −1 to Focus Roll.
 */
const MAGOS_ON_ABEYANT: Character = {
  id: 'magos-on-abeyant',
  name: 'Magos on Abeyant',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 4, BS: 5, S: 5, T: 6, W: 4,
    I: 2, A: 3, LD: 9, CL: 9, WP: 8, IN: 9,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_AXE, POWER_FIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 6 },
  ],
};

// ── Myrmidon Lords ────────────────────────────────────────────────────────────

/**
 * Myrmidon Destructor Lord — leader of a Destructor Host.
 * Heavy sub-type; receives Feel No Pain (6+) from Battle Meditation in Challenges.
 */
const MYRMIDON_DESTRUCTOR_LORD: Character = {
  id: 'myrmidon-destructor-lord',
  name: 'Myrmidon Destructor Lord',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Champion', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 5, T: 5, W: 4,
    I: 2, A: 3, LD: 9, CL: 9, WP: 8, IN: 8,
    Sv: 3, Inv: 5,
  },
  weapons: [POWER_FIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 6 },  // from Battle Meditation in Challenges
  ],
};

/**
 * Myrmidon Secutor Lord — leader of a Secutor Host; close-combat specialist.
 * Heavy sub-type; receives Feel No Pain (6+) from Battle Meditation in Challenges.
 */
const MYRMIDON_SECUTOR_LORD: Character = {
  id: 'myrmidon-secutor-lord',
  name: 'Myrmidon Secutor Lord',
  faction: 'mechanicum',
  type: 'infantry',
  subTypes: ['Champion', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 5, T: 5, W: 4,
    I: 2, A: 3, LD: 9, CL: 9, WP: 8, IN: 8,
    Sv: 3, Inv: 5,
  },
  weapons: [ARC_SCOURGES, POWER_FIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'FeelNoPain', threshold: 6 },  // from Battle Meditation in Challenges
  ],
};

export const MECHANICUM_CHARACTERS: Character[] = [
  ANACHARIS_SCORIA,
  ARCHMAGOS_DRAYKAVAC,
  ARCHMAGOS,
  ARCHMAGOS_ON_ABEYANT,
  ARCUITOR_MAGISTERIUM,
  MAGOS,
  MAGOS_ON_ABEYANT,
  MYRMIDON_DESTRUCTOR_LORD,
  MYRMIDON_SECUTOR_LORD,
];
