/**
 * Legiones Astartes playable characters.
 *
 * Stat sources: Legiones Astartes army list.
 * Only characters with the Command Sub-Type are eligible for a Challenge.
 *
 * Faction gambits: Legion Astartes use the nine core gambits only.
 */
import type { Character } from '../../models/character.js';
import {
  POWER_SWORD,
  PARAGON_BLADE,
  POWER_FIST,
  THUNDER_HAMMER,
  CROZIUS_ARCANUM,
  LIGHTNING_CLAWS_PAIR,
  LIGHTNING_CLAW,
  CHAINSWORD,
  POWER_AXE,
  POWER_LANCE,
  POWER_MAUL,
  CHAINFIST,
  SATURNINE_WAR_AXE, 
  SATURNINE_DISRUPTION_FIST, 
  SATURNINE_CONCUSSION_HAMMER
} from '../weapons/legionAstartes.js';

// ── Praetor ─────────────────────────────────────────────────────────────────
// The senior commander of a Legion detachment.  Wears artificer armour and
// carries an Iron Halo (4+ Inv).  Can take a Paragon blade or power weapon.
const PRAETOR: Character = {
  id: 'praetor',
  name: 'Praetor',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST],
  factionGambitIds: [],
  specialRules: [],
};

// ── Cataphractii Praetor ─────────────────────────────────────────────────────
// Praetor clad in Cataphractii Terminator armour.  The Heavy sub-type imposes
// a −1 penalty on Focus Rolls.  In return it gains T5, W5 and a 4+ Inv.
const CATAPHRACTII_PRAETOR: Character = {
  id: 'cataphractii-praetor',
  name: 'Cataphractii Praetor',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [],
};

// ── Tartaros Praetor ─────────────────────────────────────────────────────
// Praetor clad in Tartaros Terminator armour.
const TARTAROS_PRAETOR: Character = {
  id: 'tartaros-praetor',
  name: 'Tartaros Praetor',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [],
};

// ── Saturnine Praetor ─────────────────────────────────────────────────────
// Praetor clad in Saturnine Terminator armour.  The Heavy sub-type imposes
// a −1 penalty on Focus Rolls.
const SATURNINE_PRAETOR: Character = {
  id: 'saturnine-praetor',
  name: 'Saturnine Praetor',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 5, WS: 6, BS: 5, S: 4, T: 6, W: 6,
    I: 4, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [SATURNINE_WAR_AXE, SATURNINE_DISRUPTION_FIST, SATURNINE_CONCUSSION_HAMMER],
  factionGambitIds: [],
  specialRules: [],
};

// ── Legion Champion ──────────────────────────────────────────────────────────
// Dedicated duellist armed with a Paragon blade.  Slightly lower survivability
// than a Praetor but equally dangerous in the strike phase.
const LEGION_CHAMPION: Character = {
  id: 'legion-champion',
  name: 'Legion Champion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 5, LD: 8, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, LIGHTNING_CLAWS_PAIR],
  factionGambitIds: [],
  specialRules: [],
};

// ── Chaplain ─────────────────────────────────────────────────────────────────
// Bearer of the Crozius Arcanum.  High morale leader with a powerful but
// slow (AP3 D2) melee weapon.
const CHAPLAIN: Character = {
  id: 'chaplain',
  name: 'Chaplain',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 10, WP: 8, IN: 7,
    Sv: 2, Inv: 5,
  },
  weapons: [CROZIUS_ARCANUM, CHAINSWORD],
  factionGambitIds: [],
  specialRules: [],
};

// ── Centurion ─────────────────────────────────────────────────────────────────
// Mid-ranking officer.  Lower WS and Wounds than a Praetor but still a
// competent challenger.
const CENTURION: Character = {
  id: 'centurion',
  name: 'Centurion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR],
  factionGambitIds: [],
  specialRules: [],
};

// ── Cataphractii Centurion ────────────────────────────────────────────────────
// Centurion in Cataphractii plate.  Trades Initiative penalty for toughness.
const CATAPHRACTII_CENTURION: Character = {
  id: 'cataphractii-centurion',
  name: 'Cataphractii Centurion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [THUNDER_HAMMER, POWER_SWORD, POWER_AXE, POWER_LANCE, POWER_MAUL, LIGHTNING_CLAWS_PAIR],
  factionGambitIds: [],
  specialRules: [],
};

// ── Tartaros Centurion ────────────────────────────────────────────────────
// Centurion in Tartaros plate. 
const TARTAROS_CENTURION: Character = {
  id: 'tartaros-centurion',
  name: 'Tartaros Centurion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [THUNDER_HAMMER, POWER_SWORD, POWER_AXE, POWER_LANCE, POWER_MAUL, LIGHTNING_CLAWS_PAIR],
  factionGambitIds: [],
  specialRules: [],
};

// ── Chosen Champion ──────────────────────────────────────────────────────────
// Dedicated Champion-sub-type duellist in artificer armour.
// Stats: M7 WS5 BS4 S4 T4 W2 I4 A4 LD8 CL8 WP7 IN7 Sv2+
const CHOSEN_CHAMPION: Character = {
  id: 'chosen-champion',
  name: 'Chosen Champion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 4, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER],
  factionGambitIds: [],
  specialRules: [],
};

// ── Chosen Champion (Jump Pack) ──────────────────────────────────────────────
// As Chosen Champion but with Jump Pack; Bulky(2) used by Angelic Descent.
const CHOSEN_CHAMPION_JUMP_PACK: Character = {
  id: 'chosen-champion-jump-pack',
  name: 'Chosen Champion (Jump Pack)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 12, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 4, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ── Veteran Champion ─────────────────────────────────────────────────────────
// Champion drawn from Veteran Tactical ranks; 3+ Sv, lower Attacks than Chosen.
// Stats: M7 WS5 BS4 S4 T4 W2 I4 A3 LD8 CL8 WP7 IN7 Sv3+
const VETERAN_CHAMPION: Character = {
  id: 'veteran-champion',
  name: 'Veteran Champion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 3, Inv: null,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER],
  factionGambitIds: [],
  specialRules: [],
};

// ── Tartaros Chosen Champion ─────────────────────────────────────────────────
// Chosen Champion in Tartaros Terminator armour; T5, Inv5+, Bulky(2).
// Stats: M7 WS5 BS4 S4 T5 W2 I4 A4 LD8 CL8 WP7 IN7 Sv2+ Inv5+
const TARTAROS_CHOSEN_CHAMPION: Character = {
  id: 'tartaros-chosen-champion',
  name: 'Tartaros Chosen Champion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 5, W: 2,
    I: 4, A: 4, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, POWER_FIST, CHAINFIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ── Cataphractii Chosen Champion ─────────────────────────────────────────────
// Chosen Champion in Cataphractii Terminator armour; T5, Inv4+, Bulky(2), Heavy.
// Stats: M6 WS5 BS4 S4 T5 W2 I4 A4 LD8 CL8 WP7 IN7 Sv2+ Inv4+
const CATAPHRACTII_CHOSEN_CHAMPION: Character = {
  id: 'cataphractii-chosen-champion',
  name: 'Cataphractii Chosen Champion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Champion', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 4, S: 4, T: 5, W: 2,
    I: 4, A: 4, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, POWER_FIST, CHAINFIST],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ── Scimitar Chosen Champion ─────────────────────────────────────────────────
// Mounted Chosen Champion on Scimitar jetbike; cavalry, Bulky(3), W3.
// Stats: M16 WS5 BS4 S4 T4 W3 I4 A4 LD8 CL8 WP7 IN7 Sv2+
const SCIMITAR_CHOSEN_CHAMPION: Character = {
  id: 'scimitar-chosen-champion',
  name: 'Scimitar Chosen Champion',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Champion'],
  stats: {
    M: 16, WS: 5, BS: 4, S: 4, T: 4, W: 3,
    I: 4, A: 4, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 3 },
  ],
};

// ── Outrider Chosen Champion ─────────────────────────────────────────────────
// Mounted Chosen Champion on bike; cavalry, Bulky(2), W3.
// Stats: M14 WS5 BS4 S4 T4 W3 I4 A4 LD8 CL8 WP7 IN6 Sv2+
const OUTRIDER_CHOSEN_CHAMPION: Character = {
  id: 'outrider-chosen-champion',
  name: 'Outrider Chosen Champion',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Champion'],
  stats: {
    M: 14, WS: 5, BS: 4, S: 4, T: 4, W: 3,
    I: 4, A: 4, LD: 8, CL: 8, WP: 7, IN: 6,
    Sv: 2, Inv: null,
  },
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

export const LEGION_ASTARTES_CHARACTERS: Character[] = [
  PRAETOR,
  CATAPHRACTII_PRAETOR,
  TARTAROS_PRAETOR,
  SATURNINE_PRAETOR,
  LEGION_CHAMPION,
  CHAPLAIN,
  CENTURION,
  CATAPHRACTII_CENTURION,
  TARTAROS_CENTURION,
  CHOSEN_CHAMPION,
  CHOSEN_CHAMPION_JUMP_PACK,
  VETERAN_CHAMPION,
  TARTAROS_CHOSEN_CHAMPION,
  CATAPHRACTII_CHOSEN_CHAMPION,
  SCIMITAR_CHOSEN_CHAMPION,
  OUTRIDER_CHOSEN_CHAMPION,
];
