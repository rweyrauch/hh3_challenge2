/**
 * Daemons of the Ruinstorm characters.
 *
 * Only challenge-eligible models are included — those with the Command,
 * Champion, or Paragon Sub-Type.  Non-character units (Brutes, Lesser
 * Daemons, Swarms, Beasts, Harriers, Riders, Behemoth) are omitted because
 * they lack these Sub-Types and cannot issue or accept Challenges.
 *
 * Generic daemon characters (Sovereign, Hierarch, Harbinger) may have any
 * Ætheric Dominion; specific named characters have a fixed Ætheric Dominion
 * recorded as subFaction.
 *
 * Faction gambits: no daemon-specific Challenge gambits are defined in the
 * Daemons of the Ruinstorm Army List.  All models use core gambits only.
 *
 * Stat sources: Daemons of the Ruinstorm Army List (reference/daemons.md).
 * Special rules not modelled by the Challenge engine are omitted.
 */
import type { Character } from '../../models/character.js';
import {
  SOVEREIGN_BLADE,
  SOVEREIGN_GREATBLADE,
  HIERARCH_BLADE,
  HIERARCH_GREATBLADE,
  HARBINGER_BLADE,
  BANEAXE,
  REAPING_CLAWS,
  BLADE_OF_SAMUS,
} from '../weapons/daemons.js';

// ════════════════════════════════════════════════════════════════
// RUINSTORM DAEMON SOVEREIGN
// Infantry (Champion, Malefic) — High Command
// ════════════════════════════════════════════════════════════════

const RUINSTORM_SOVEREIGN: Character = {
  id: 'ruinstorm-sovereign',
  name: 'Ruinstorm Daemon Sovereign',
  faction: 'daemons-of-the-ruinstorm',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 7, T: 6, W: 7,
    I: 5, A: 5, LD: 9, CL: 9, WP: 9, IN: 7,
    Sv: 3, Inv: 4,
  },
  weapons: [SOVEREIGN_BLADE, SOVEREIGN_GREATBLADE],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear',           value: 1 },
    { name: 'Bulky',          value: 7 },
  ],
};

const RUINSTORM_SOVEREIGN_WINGS: Character = {
  id: 'ruinstorm-sovereign-wings',
  name: 'Ruinstorm Daemon Sovereign (Wings)',
  faction: 'daemons-of-the-ruinstorm',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 12, WS: 6, BS: 5, S: 7, T: 6, W: 7,
    I: 5, A: 5, LD: 9, CL: 9, WP: 9, IN: 7,
    Sv: 3, Inv: 4,
  },
  weapons: [SOVEREIGN_BLADE, SOVEREIGN_GREATBLADE],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear',           value: 1 },
    { name: 'Bulky',          value: 8 },
  ],
};

// ════════════════════════════════════════════════════════════════
// RUINSTORM DAEMON HIERARCH
// Infantry (Champion, Malefic) — Command
// ════════════════════════════════════════════════════════════════

const RUINSTORM_HIERARCH: Character = {
  id: 'ruinstorm-hierarch',
  name: 'Ruinstorm Daemon Hierarch',
  faction: 'daemons-of-the-ruinstorm',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 6, T: 5, W: 4,
    I: 5, A: 4, LD: 8, CL: 8, WP: 9, IN: 7,
    Sv: 3, Inv: 4,
  },
  weapons: [HIERARCH_BLADE, HIERARCH_GREATBLADE],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear',           value: 1 },
    { name: 'Bulky',          value: 5 },
  ],
};

const RUINSTORM_HIERARCH_WINGS: Character = {
  id: 'ruinstorm-hierarch-wings',
  name: 'Ruinstorm Daemon Hierarch (Wings)',
  faction: 'daemons-of-the-ruinstorm',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 12, WS: 5, BS: 4, S: 6, T: 5, W: 4,
    I: 5, A: 4, LD: 8, CL: 8, WP: 9, IN: 7,
    Sv: 3, Inv: 4,
  },
  weapons: [HIERARCH_BLADE, HIERARCH_GREATBLADE],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear',           value: 1 },
    { name: 'Bulky',          value: 6 },
  ],
};

// ════════════════════════════════════════════════════════════════
// RUINSTORM DAEMON HARBINGER
// Infantry (Command, Malefic) — Command
// ════════════════════════════════════════════════════════════════

const RUINSTORM_HARBINGER: Character = {
  id: 'ruinstorm-harbinger',
  name: 'Ruinstorm Daemon Harbinger',
  faction: 'daemons-of-the-ruinstorm',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 3, S: 5, T: 4, W: 3,
    I: 5, A: 4, LD: 8, CL: 8, WP: 9, IN: 6,
    Sv: 4, Inv: 5,
  },
  weapons: [HARBINGER_BLADE],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear',           value: 1 },
    { name: 'Bulky',          value: 3 },
  ],
};

// ════════════════════════════════════════════════════════════════
// KA'BANDHA
// Paragon (Unique, Antigrav, Malefic) — Lords of War
// Ætheric Dominion: Heedless Slaughter
// ════════════════════════════════════════════════════════════════

const KABANDHA: Character = {
  id: 'kabandha',
  name: "Ka'bandha",
  faction: 'daemons-of-the-ruinstorm',
  subFaction: 'heedless-slaughter',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 12, WS: 8, BS: 5, S: 8, T: 8, W: 8,
    I: 6, A: 7, LD: 12, CL: 10, WP: 10, IN: 6,
    Sv: 3, Inv: 4,
  },
  weapons: [BANEAXE],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Fear',           value: 2 },
    { name: 'Bulky',          value: 12 },
  ],
};

// ════════════════════════════════════════════════════════════════
// COR'BAX UTTERBLIGHT
// Paragon (Unique, Heavy, Malefic) — Lords of War
// Ætheric Dominion: Putrid Corruption
// ════════════════════════════════════════════════════════════════

const CORBAX_UTTERBLIGHT: Character = {
  id: 'corbax-utterblight',
  name: "Cor'bax Utterblight",
  faction: 'daemons-of-the-ruinstorm',
  subFaction: 'putrid-corruption',
  type: 'paragon',
  subTypes: ['Command', 'Paragon', 'Heavy'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 7, T: 7, W: 10,
    I: 5, A: 5, LD: 12, CL: 10, WP: 10, IN: 6,
    Sv: 3, Inv: 4,
  },
  weapons: [REAPING_CLAWS],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Fear',           value: 1 },
    { name: 'Bulky',          value: 8 },
  ],
};

// ════════════════════════════════════════════════════════════════
// SAMUS
// Paragon (Unique, Malefic) — Lords of War
// Ætheric Dominion: Encroaching Ruin
// ════════════════════════════════════════════════════════════════

const SAMUS: Character = {
  id: 'samus',
  name: 'Samus',
  faction: 'daemons-of-the-ruinstorm',
  subFaction: 'encroaching-ruin',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 5, S: 7, T: 7, W: 7,
    I: 6, A: 6, LD: 12, CL: 10, WP: 10, IN: 7,
    Sv: 3, Inv: 4,
  },
  weapons: [BLADE_OF_SAMUS],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear',           value: 1 },
    { name: 'Bulky',          value: 8 },
  ],
};

// ── Combined export ───────────────────────────────────────────────────────────

export const DAEMON_CHARACTERS: Character[] = [
  // Generic commanders (player-chosen Ætheric Dominion)
  RUINSTORM_SOVEREIGN,
  RUINSTORM_SOVEREIGN_WINGS,
  RUINSTORM_HIERARCH,
  RUINSTORM_HIERARCH_WINGS,
  RUINSTORM_HARBINGER,
  // Named Daemon Lords
  KABANDHA,
  CORBAX_UTTERBLIGHT,
  SAMUS,
];
