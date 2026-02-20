/**
 * Divisio Assassinorum playable characters.
 *
 * All five Assassin archetypes are eligible for a Challenge via the Champion
 * Sub-Type.  Each has mandatory gambits (Eversor/Adamus) or uses only core
 * gambits (Callidus/Culexus/Venenum).
 *
 * Stat sources: Legio Custodes army list (Divisio Assassinorum section).
 */
import type { Character } from '../../models/character.js';
import {
  NEURO_GAUNTLET,
  POWER_SWORD_ASSASSIN,
  PHASE_SWORD,
  PSYK_OUT_BOMBS,
  NEMESII_BLADE,
  HOOKFANG,
} from '../weapons/assassins.js';

// ── Eversor Assassin ─────────────────────────────────────────────────────────
// Frenzon Rage: must always select biological-overload; no other gambit allowed.
const EVERSOR_ASSASSIN: Character = {
  id: 'eversor-assassin',
  name: 'Eversor Assassin',
  faction: 'divisio-assassinorum',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 8, WS: 6, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 10, CL: 10, WP: 7, IN: 7,
    Sv: 4, Inv: 4,
  },
  weapons: [NEURO_GAUNTLET, POWER_SWORD_ASSASSIN],
  factionGambitIds: ['biological-overload'],
  mandatoryGambitId: 'biological-overload',
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
  ],
};

// ── Callidus Assassin ────────────────────────────────────────────────────────
const CALLIDUS_ASSASSIN: Character = {
  id: 'callidus-assassin',
  name: 'Callidus Assassin',
  faction: 'divisio-assassinorum',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 8, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 10, CL: 10, WP: 7, IN: 7,
    Sv: 4, Inv: 4,
  },
  weapons: [PHASE_SWORD],
  factionGambitIds: [],
  specialRules: [],
};

// ── Culexus Assassin ─────────────────────────────────────────────────────────
// Psyk-out Bombs use fixed AM:3, fixed SM:5.
// WP:10 represents the psychic dampening field.
const CULEXUS_ASSASSIN: Character = {
  id: 'culexus-assassin',
  name: 'Culexus Assassin',
  faction: 'divisio-assassinorum',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 8, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 10, CL: 10, WP: 10, IN: 7,
    Sv: 4, Inv: 4,
  },
  weapons: [PSYK_OUT_BOMBS],
  factionGambitIds: [],
  specialRules: [
    { name: 'Fear', value: 1 },
  ],
};

// ── Adamus Assassin ──────────────────────────────────────────────────────────
// Death's Artisan: must always select mirror-form; no other gambit allowed.
const ADAMUS_ASSASSIN: Character = {
  id: 'adamus-assassin',
  name: 'Adamus Assassin',
  faction: 'divisio-assassinorum',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 8, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 10, CL: 10, WP: 7, IN: 7,
    Sv: 4, Inv: 4,
  },
  weapons: [NEMESII_BLADE],
  factionGambitIds: ['mirror-form'],
  mandatoryGambitId: 'mirror-form',
  specialRules: [],
};

// ── Venenum Assassin ─────────────────────────────────────────────────────────
const VENENUM_ASSASSIN: Character = {
  id: 'venenum-assassin',
  name: 'Venenum Assassin',
  faction: 'divisio-assassinorum',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 8, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 10, CL: 10, WP: 7, IN: 7,
    Sv: 4, Inv: 4,
  },
  weapons: [HOOKFANG],
  factionGambitIds: [],
  specialRules: [],
};

export const ASSASSIN_CHARACTERS: Character[] = [
  EVERSOR_ASSASSIN,
  CALLIDUS_ASSASSIN,
  CULEXUS_ASSASSIN,
  ADAMUS_ASSASSIN,
  VENENUM_ASSASSIN,
];
