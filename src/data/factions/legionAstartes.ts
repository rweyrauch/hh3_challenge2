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
  CHAINBLADE,
  CHAINAXE,
  POWER_AXE,
  POWER_LANCE,
  POWER_MAUL,
  CHAINFIST,
  SATURNINE_WAR_AXE,
  SATURNINE_DISRUPTION_FIST,
  SATURNINE_CONCUSSION_HAMMER,
  FORCE_SWORD,
  FORCE_AXE,
  FORCE_MAUL,
  FORCE_STAFF,
} from '../weapons/legionAstartes.js';
import { CHARNABAL_SABRE } from '../weapons/militia.js';

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
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHARNABAL_SABRE, CHAINBLADE, CHAINAXE],
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
  specialRules: [{ name: 'Bulky', value: 2 }],
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
    Sv: 2, Inv: 4, // Tartaros Praetor really do have a 4+ Inv.
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
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
  specialRules: [{ name: 'Bulky', value: 4 }],
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
  weapons: [PARAGON_BLADE],
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

// ── Cataphractii Librarian ────────────────────────────────────────────────────
// Legion Psyker in Cataphractii Terminator armour.  WP9 makes the Force weapon
// WP check very reliable.  Heavy sub-type imposes −1 to Focus Rolls.
// Implacable Advance and Slow and Purposeful are movement/shooting rules with
// no effect in the Challenge Sub-Phase.
const CATAPHRACTII_LIBRARIAN: Character = {
  id: 'cataphractii-librarian',
  name: 'Cataphractii Librarian',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 8, CL: 7, WP: 9, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_MAUL, FORCE_STAFF],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
};

// ── Tartaros Librarian ────────────────────────────────────────────────────────
// As Cataphractii Librarian but in Tartaros plate: faster (M7), lighter save
// (Inv5+ vs 4+), and no Heavy sub-type penalty on Focus Rolls.
const TARTAROS_LIBRARIAN: Character = {
  id: 'tartaros-librarian',
  name: 'Tartaros Librarian',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 8, CL: 7, WP: 9, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_MAUL, FORCE_STAFF],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
};

// ── Librarian (Jump Pack) ─────────────────────────────────────────────────────
// Standard Librarian mounted on a jump pack; same stats as the base Librarian
// but with M12 and the Antigrav/Deep Strike movement rules.
const LIBRARIAN_JUMP_PACK: Character = {
  id: 'librarian-jump-pack',
  name: 'Librarian (Jump Pack)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 8, CL: 7, WP: 9, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_MAUL, FORCE_STAFF],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
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
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHARNABAL_SABRE, CHAINBLADE, CHAINAXE],
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
  specialRules: [{ name: 'Bulky', value: 2 }],
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
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Librarian ──────────────────────────────────────────────────────────
const LIBRARIAN: Character = {
  id: 'librarian',
  name: 'Librarian',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 8, CL: 7, WP: 9, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_STAFF, FORCE_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
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
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER, CHAINAXE, CHAINSWORD, CHARNABAL_SABRE, POWER_FIST, LIGHTNING_CLAWS_PAIR],
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
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER, CHAINAXE, CHAINSWORD, CHARNABAL_SABRE, POWER_FIST, LIGHTNING_CLAWS_PAIR],
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
  weapons: [POWER_SWORD, LIGHTNING_CLAWS_PAIR, POWER_AXE, POWER_LANCE, POWER_MAUL, THUNDER_HAMMER, CHAINAXE, CHAINSWORD, CHARNABAL_SABRE, POWER_FIST, LIGHTNING_CLAWS_PAIR],
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

// ── Cataphractii Legion Champion ──────────────────────────────────────────────
// Legion Champion in Cataphractii plate; gains T5 W4 Inv4+ at cost of Heavy.
// Stats: M6 WS6 BS5 S4 T5 W4 I5 A5 LD8 CL8 WP8 IN8 Sv2+ Inv4+
const CATAPHRACTII_LEGION_CHAMPION: Character = {
  id: 'cataphractii-legion-champion',
  name: 'Cataphractii Legion Champion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 5, LD: 8, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [PARAGON_BLADE, LIGHTNING_CLAWS_PAIR],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Legion Champion (Jump Pack) ───────────────────────────────────────────────
// Legion Champion with Jump Pack; M12, retains Inv5+ of standard armour.
// Stats: M12 WS6 BS5 S4 T4 W3 I5 A5 LD8 CL8 WP8 IN8 Sv2+ Inv5+
const LEGION_CHAMPION_JUMP_PACK: Character = {
  id: 'legion-champion-jump-pack',
  name: 'Legion Champion (Jump Pack)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 6, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 5, LD: 8, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, LIGHTNING_CLAWS_PAIR],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ── Delegatus ────────────────────────────────────────────────────────────────
// The Delegatus is a mid-ranking officer empowered to speak with the authority
// of a Praetor.  Equivalent stats to a Centurion; can take standard power weapons.
const DELEGATUS: Character = {
  id: 'delegatus',
  name: 'Delegatus',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [],
};

const DELEGATUS_TERMINATOR: Character = {
  id: 'delegatus-terminator',
  name: 'Delegatus (Terminator Armour)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

const DELEGATUS_MOUNTED: Character = {
  id: 'delegatus-mounted',
  name: 'Delegatus (Mounted)',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 14, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Forge Lord ───────────────────────────────────────────────────────────────
// Senior Techmarine officer.  Carries a Machinator array (wargear; no challenge
// effect) in addition to a power weapon of choice.
const FORGE_LORD: Character = {
  id: 'forge-lord',
  name: 'Forge Lord',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [],
};

const FORGE_LORD_TERMINATOR: Character = {
  id: 'forge-lord-terminator',
  name: 'Forge Lord (Terminator Armour)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

const FORGE_LORD_MOUNTED: Character = {
  id: 'forge-lord-mounted',
  name: 'Forge Lord (Mounted)',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 14, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Herald ───────────────────────────────────────────────────────────────────
// Bearer of an Icon of Allegiance.  Infantry/Terminator/Jump Pack/Mounted variants.
// Fear(1) per the army list entry.
const HERALD: Character = {
  id: 'herald',
  name: 'Herald',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [{ name: 'Fear', value: 1 }],
};

const HERALD_TERMINATOR: Character = {
  id: 'herald-terminator',
  name: 'Herald (Terminator Armour)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Fear', value: 1 }],
};

const HERALD_JUMP_PACK: Character = {
  id: 'herald-jump-pack',
  name: 'Herald (Jump Pack)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Fear', value: 1 }],
};

const HERALD_MOUNTED: Character = {
  id: 'herald-mounted',
  name: 'Herald (Mounted)',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 14, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Fear', value: 1 }, { name: 'Bulky', value: 2 }],
};

// ── Esoterist ────────────────────────────────────────────────────────────────
// Legion Chaplain-Psyker hybrid.  WP10; access to psychic disciplines.
const ESOTERIST: Character = {
  id: 'esoterist',
  name: 'Esoterist',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 10, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_MAUL, FORCE_STAFF, CROZIUS_ARCANUM, POWER_SWORD],
  factionGambitIds: [],
  specialRules: [{ name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
};

const ESOTERIST_TERMINATOR: Character = {
  id: 'esoterist-terminator',
  name: 'Esoterist (Terminator Armour)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 10, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_MAUL, FORCE_STAFF, CROZIUS_ARCANUM, POWER_SWORD],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
};

const ESOTERIST_JUMP_PACK: Character = {
  id: 'esoterist-jump-pack',
  name: 'Esoterist (Jump Pack)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 10, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_MAUL, FORCE_STAFF, CROZIUS_ARCANUM, POWER_SWORD],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
};

const ESOTERIST_MOUNTED: Character = {
  id: 'esoterist-mounted',
  name: 'Esoterist (Mounted)',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 14, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 10, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [FORCE_SWORD, FORCE_AXE, FORCE_MAUL, FORCE_STAFF, CROZIUS_ARCANUM, POWER_SWORD],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }, { name: 'Psykers' }],
  availablePsychicDisciplines: ['biomancy', 'pyromancy', 'telekinesis', 'divination', 'thaumaturgy'],
};

// ── Master of Signals ────────────────────────────────────────────────────────
// Vox-communications specialist officer.  WP7; infantry/jump pack/mounted.
const MASTER_OF_SIGNALS: Character = {
  id: 'master-of-signals',
  name: 'Master of Signals',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 7, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [],
};

const MASTER_OF_SIGNALS_JUMP_PACK: Character = {
  id: 'master-of-signals-jump-pack',
  name: 'Master of Signals (Jump Pack)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 7, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

const MASTER_OF_SIGNALS_MOUNTED: Character = {
  id: 'master-of-signals-mounted',
  name: 'Master of Signals (Mounted)',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 14, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 7, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Siege Breaker ────────────────────────────────────────────────────────────
// Engineering officer specialising in breaching and fortification warfare.
const SIEGE_BREAKER: Character = {
  id: 'siege-breaker',
  name: 'Siege Breaker',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [],
};

const SIEGE_BREAKER_TERMINATOR: Character = {
  id: 'siege-breaker-terminator',
  name: 'Siege Breaker (Terminator Armour)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

const SIEGE_BREAKER_JUMP_PACK: Character = {
  id: 'siege-breaker-jump-pack',
  name: 'Siege Breaker (Jump Pack)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 12, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

const SIEGE_BREAKER_MOUNTED: Character = {
  id: 'siege-breaker-mounted',
  name: 'Siege Breaker (Mounted)',
  faction: 'legion-astartes',
  type: 'cavalry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 14, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Armistos ─────────────────────────────────────────────────────────────────
// An artificer-armour clad officer attached to heavy weapon squads.
// WS4, lower profile than a standard Centurion.
const ARMISTOS: Character = {
  id: 'armistos',
  name: 'Armistos',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 4, BS: 4, S: 4, T: 4, W: 3,
    I: 5, A: 3, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_LANCE, POWER_MAUL, POWER_FIST],
  factionGambitIds: [],
  specialRules: [],
};

// ── Vigilator ────────────────────────────────────────────────────────────────
// Recon and assassination specialist officer.  WS4.
const VIGILATOR: Character = {
  id: 'vigilator',
  name: 'Vigilator',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 4, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 3, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_LANCE, POWER_MAUL, POWER_FIST],
  factionGambitIds: [],
  specialRules: [],
};

// ── Pathfinder ───────────────────────────────────────────────────────────────
// Scout specialist officer.  Light and Skirmish sub-types; Sv4+/Inv5+.
const PATHFINDER: Character = {
  id: 'pathfinder',
  name: 'Pathfinder',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Light'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 4, Inv: 5,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_LANCE, POWER_MAUL, POWER_FIST, CHAINSWORD, CHAINAXE],
  factionGambitIds: [],
  specialRules: [],
};

// ── Praevian ─────────────────────────────────────────────────────────────────
// Automata controller officer.  Feel No Pain(5+) from Cortex controller bond.
const PRAEVIAN: Character = {
  id: 'praevian',
  name: 'Praevian',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [{ name: 'FeelNoPain', threshold: 5 }],
};

// ── Overseer ─────────────────────────────────────────────────────────────────
// Provosts officer maintaining discipline.  Fear(1); carries a Vexilla.
const OVERSEER: Character = {
  id: 'overseer',
  name: 'Overseer',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [{ name: 'Fear', value: 1 }],
};

// ── Master of Descent ────────────────────────────────────────────────────────
// Drop Pod / jump assault specialist.  Jump Pack type (Antigrav).  A3.
const MASTER_OF_DESCENT: Character = {
  id: 'master-of-descent',
  name: 'Master of Descent',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 3, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Warmonger ────────────────────────────────────────────────────────────────
// Shock assault specialist officer.  Infantry and Terminator variants.
const WARMONGER: Character = {
  id: 'warmonger',
  name: 'Warmonger',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [PARAGON_BLADE, POWER_SWORD, LIGHTNING_CLAWS_PAIR, LIGHTNING_CLAW, THUNDER_HAMMER, POWER_FIST, POWER_AXE, POWER_LANCE, POWER_MAUL, CHAINFIST, CHAINBLADE, CHAINAXE],
  factionGambitIds: [],
  specialRules: [],
};

const WARMONGER_TERMINATOR: Character = {
  id: 'warmonger-terminator',
  name: 'Warmonger (Terminator Armour)',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [POWER_FIST, POWER_SWORD, LIGHTNING_CLAW, CHAINFIST, THUNDER_HAMMER, POWER_AXE, POWER_LANCE, POWER_MAUL],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
};

// ── Optae ────────────────────────────────────────────────────────────────────
// A junior officer from a Tactical Support squad.  Sv3+; W2; lower profile.
const OPTAE: Character = {
  id: 'optae',
  name: 'Optae',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 2,
    I: 5, A: 3, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 3, Inv: null,
  },
  weapons: [POWER_SWORD, POWER_AXE, POWER_LANCE, POWER_MAUL, POWER_FIST, CHAINSWORD, CHAINAXE],
  factionGambitIds: [],
  specialRules: [],
};

// ── Saturnine Chosen Champion ─────────────────────────────────────────────────
// Champion of the Saturnine Terminator Command Squad.
// Saturnine plate: T6, Inv4+, Bulky(2), Heavy; Slower I3.
// Uses the same restricted weapon pool as the Saturnine Praetor.
const SATURNINE_CHOSEN_CHAMPION: Character = {
  id: 'saturnine-chosen-champion',
  name: 'Saturnine Chosen Champion',
  faction: 'legion-astartes',
  type: 'infantry',
  subTypes: ['Champion', 'Heavy'],
  stats: {
    M: 5, WS: 5, BS: 4, S: 4, T: 6, W: 3,
    I: 3, A: 3, LD: 8, CL: 7, WP: 7, IN: 7,
    Sv: 2, Inv: 4,
  },
  weapons: [SATURNINE_WAR_AXE, SATURNINE_DISRUPTION_FIST, SATURNINE_CONCUSSION_HAMMER],
  factionGambitIds: [],
  specialRules: [{ name: 'Bulky', value: 2 }],
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
  LIBRARIAN,
  CATAPHRACTII_LIBRARIAN,
  TARTAROS_LIBRARIAN,
  LIBRARIAN_JUMP_PACK,
  LEGION_CHAMPION_JUMP_PACK,
  CATAPHRACTII_LEGION_CHAMPION,
  CHOSEN_CHAMPION,
  CHOSEN_CHAMPION_JUMP_PACK,
  VETERAN_CHAMPION,
  TARTAROS_CHOSEN_CHAMPION,
  CATAPHRACTII_CHOSEN_CHAMPION,
  SCIMITAR_CHOSEN_CHAMPION,
  OUTRIDER_CHOSEN_CHAMPION,
  // Generic officer types
  DELEGATUS,
  DELEGATUS_TERMINATOR,
  DELEGATUS_MOUNTED,
  FORGE_LORD,
  FORGE_LORD_TERMINATOR,
  FORGE_LORD_MOUNTED,
  HERALD,
  HERALD_TERMINATOR,
  HERALD_JUMP_PACK,
  HERALD_MOUNTED,
  ESOTERIST,
  ESOTERIST_TERMINATOR,
  ESOTERIST_JUMP_PACK,
  ESOTERIST_MOUNTED,
  MASTER_OF_SIGNALS,
  MASTER_OF_SIGNALS_JUMP_PACK,
  MASTER_OF_SIGNALS_MOUNTED,
  SIEGE_BREAKER,
  SIEGE_BREAKER_TERMINATOR,
  SIEGE_BREAKER_JUMP_PACK,
  SIEGE_BREAKER_MOUNTED,
  ARMISTOS,
  VIGILATOR,
  PATHFINDER,
  PRAEVIAN,
  OVERSEER,
  MASTER_OF_DESCENT,
  WARMONGER,
  WARMONGER_TERMINATOR,
  OPTAE,
  SATURNINE_CHOSEN_CHAMPION,
];
