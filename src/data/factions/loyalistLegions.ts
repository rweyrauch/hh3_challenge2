/**
 * Loyalist Legion named characters.
 *
 * Covers all nine loyalist Legiones Astartes: Dark Angels, White Scars,
 * Space Wolves, Imperial Fists, Blood Angels, Iron Hands, Ultramarines,
 * Salamanders, and Raven Guard.
 *
 * Includes each legion's Primarch plus senior named heroes.
 * Only characters with the Command Sub-Type are eligible for a Challenge.
 *
 * Stat sources: Legiones Astartes — Age of Darkness army list.
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import {
  LION_SWORD,
  WOLF_BLADE,
  CORSWAIN_THE_BLADE,
  DEATH_OF_WORLDS,
  WHITE_TIGER_DAO,
  TAILS_OF_THE_DRAGON,
  BREATH_OF_THE_STORM,
  AXE_OF_HELWINTER,
  SWORD_OF_BALENIGHT,
  HEARTH_SPLITTER,
  THE_FELL_HAND,
  STORMS_TEETH,
  THE_BLACK_SWORD,
  HEADSMAN_AND_HUNTER,
  SUBJUGATOR,
  DURENDA,
  SOLARITE_POWER_GAUNTLET,
  BLADE_ENCARMINE,
  SPEAR_OF_TELESTO,
  MOONSILVER_BLADE,
  ENCARMINE_WARBLADE,
  SPIRITUM_SANGUIS,
  SAIPHAN_SHARD_AXE,
  FORGEBREAKER,
  ALBIAN_POWER_GLADIUS,
  ARTIFICER_POWER_AXE,
  GLADIUS_INCANDOR,
  HAND_OF_DOMINION,
  PHAETON,
  DAWNBRINGER,
  TALONIS,
  CORVIDINE_TALONS,
  CHARNABAL_BROADSWORD,
} from '../weapons/namedCharacters.js';

// ════════════════════════════════════════════════════════════════
// DARK ANGELS  (I Legion)
// ════════════════════════════════════════════════════════════════

const LION_EL_JONSON: Character = {
  id: 'lion-el-jonson',
  name: "Lion El'Jonson",
  faction: 'dark-angels',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 8, BS: 6, S: 7, T: 6, W: 6,
    I: 7, A: 7, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [LION_SWORD, WOLF_BLADE],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const CORSWAIN: Character = {
  id: 'corswain',
  name: 'Corswain',
  faction: 'dark-angels',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [CORSWAIN_THE_BLADE],
  factionGambitIds: [],
  specialRules: [],
};

const MARDUK_SEDRAS: Character = {
  id: 'marduk-sedras',
  name: 'Marduk Sedras',
  faction: 'dark-angels',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [DEATH_OF_WORLDS],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// WHITE SCARS  (V Legion)
// ════════════════════════════════════════════════════════════════

const JAGHATAI_KHAN: Character = {
  id: 'jaghatai-khan',
  name: 'Jaghatai Khan',
  faction: 'white-scars',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 6, S: 6, T: 6, W: 6,
    I: 7, A: 7, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [WHITE_TIGER_DAO],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const QIN_XA: Character = {
  id: 'qin-xa',
  name: 'Qin Xa',
  faction: 'white-scars',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 4, S: 4, T: 5, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [TAILS_OF_THE_DRAGON],
  factionGambitIds: [],
  specialRules: [],
};

const HIBOU_KHAN: Character = {
  id: 'hibou-khan',
  name: 'Hibou Khan',
  faction: 'white-scars',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 10, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [BREATH_OF_THE_STORM],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// SPACE WOLVES  (VI Legion)
// ════════════════════════════════════════════════════════════════

const LEMAN_RUSS: Character = {
  id: 'leman-russ',
  name: 'Leman Russ',
  faction: 'space-wolves',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 8, BS: 6, S: 7, T: 6, W: 6,
    I: 7, A: 7, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [AXE_OF_HELWINTER, SWORD_OF_BALENIGHT],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const HVARL_RED_BLADE: Character = {
  id: 'hvarl-red-blade',
  name: 'Hvarl Red-blade',
  faction: 'space-wolves',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [HEARTH_SPLITTER],
  factionGambitIds: [],
  specialRules: [],
};

const GEIGOR_FELL_HAND: Character = {
  id: 'geigor-fell-hand',
  name: 'Geigor Fell-hand',
  faction: 'space-wolves',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 10, CL: 8, WP: 9, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [THE_FELL_HAND],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// IMPERIAL FISTS  (VII Legion)
// ════════════════════════════════════════════════════════════════

const ROGAL_DORN: Character = {
  id: 'rogal-dorn',
  name: 'Rogal Dorn',
  faction: 'imperial-fists',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 6, S: 6, T: 6, W: 6,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [STORMS_TEETH],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const SIGISMUND: Character = {
  id: 'sigismund',
  name: 'Sigismund',
  faction: 'imperial-fists',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 4, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [THE_BLACK_SWORD],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Precision', threshold: 4 },
  ],
};

const FAFNIR_RANN: Character = {
  id: 'fafnir-rann',
  name: 'Fafnir Rann',
  faction: 'imperial-fists',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 7, WS: 6, BS: 4, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [HEADSMAN_AND_HUNTER],
  factionGambitIds: [],
  specialRules: [],
};

const EVANDER_GARRIUS: Character = {
  id: 'evander-garrius',
  name: 'Evander Garrius',
  faction: 'imperial-fists',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 4, T: 5, W: 4,
    I: 5, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [SUBJUGATOR],
  factionGambitIds: [],
  specialRules: [],
};

const CAMBA_DIAZ: Character = {
  id: 'camba-diaz',
  name: 'Camba Diaz',
  faction: 'imperial-fists',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 3, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [DURENDA],
  factionGambitIds: [],
  specialRules: [],
};

const ALEXIS_POLUX: Character = {
  id: 'alexis-polux',
  name: 'Alexis Polux',
  faction: 'imperial-fists',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 7, WS: 6, BS: 4, S: 4, T: 4, W: 3,
    I: 1, A: 3, LD: 9, CL: 9, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [SOLARITE_POWER_GAUNTLET],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// BLOOD ANGELS  (IX Legion)
// ════════════════════════════════════════════════════════════════

const SANGUINIUS: Character = {
  id: 'sanguinius',
  name: 'Sanguinius',
  faction: 'blood-angels',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 16, WS: 8, BS: 6, S: 6, T: 6, W: 6,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [BLADE_ENCARMINE, SPEAR_OF_TELESTO, MOONSILVER_BLADE],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const RALDORON: Character = {
  id: 'raldoron',
  name: 'Raldoron',
  faction: 'blood-angels',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [ENCARMINE_WARBLADE],
  factionGambitIds: [],
  specialRules: [],
};

const DOMINION_ZEPHON: Character = {
  id: 'dominion-zephon',
  name: 'Dominion Zephon',
  faction: 'blood-angels',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 6, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [SPIRITUM_SANGUIS],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 1 }],
};

const ASTER_CROHNE: Character = {
  id: 'aster-crohne',
  name: 'Aster Crohne',
  faction: 'blood-angels',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 3, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [SAIPHAN_SHARD_AXE],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// IRON HANDS  (X Legion)
// ════════════════════════════════════════════════════════════════

const FERRUS_MANUS: Character = {
  id: 'ferrus-manus',
  name: 'Ferrus Manus',
  faction: 'iron-hands',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 6, S: 7, T: 7, W: 6,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [FORGEBREAKER],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const SHADRAK_MEDUSON: Character = {
  id: 'shadrak-meduson',
  name: 'Shadrak Meduson',
  faction: 'iron-hands',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [ALBIAN_POWER_GLADIUS],
  factionGambitIds: [],
  specialRules: [],
};

const IRON_FATHER: Character = {
  id: 'iron-father',
  name: 'Iron Father',
  faction: 'iron-hands',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [ARTIFICER_POWER_AXE],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// ULTRAMARINES  (XIII Legion)
// ════════════════════════════════════════════════════════════════

const ROBOUTE_GUILLIMAN: Character = {
  id: 'roboute-guilliman',
  name: 'Roboute Guilliman',
  faction: 'ultramarines',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 6, S: 6, T: 6, W: 6,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [GLADIUS_INCANDOR, HAND_OF_DOMINION],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const REMUS_VENTANUS: Character = {
  id: 'remus-ventanus',
  name: 'Remus Ventanus',
  faction: 'ultramarines',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 3, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [PHAETON],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// SALAMANDERS  (XVIII Legion)
// ════════════════════════════════════════════════════════════════

const VULKAN: Character = {
  id: 'vulkan',
  name: 'Vulkan',
  faction: 'salamanders',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 7, T: 7, W: 7,
    I: 5, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [DAWNBRINGER],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 3 }],
};

// ════════════════════════════════════════════════════════════════
// RAVEN GUARD  (XIX Legion)
// ════════════════════════════════════════════════════════════════

const CORVUS_CORAX: Character = {
  id: 'corvus-corax',
  name: 'Corvus Corax',
  faction: 'raven-guard',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 16, WS: 7, BS: 6, S: 6, T: 6, W: 6,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [TALONIS, CORVIDINE_TALONS],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

// ════════════════════════════════════════════════════════════════
// EMPEROR'S CHILDREN — loyalist characters
// (Saul Tarvitz fights for the Loyalists during the Isstvan massacre)
// ════════════════════════════════════════════════════════════════

const SAUL_TARVITZ: Character = {
  id: 'saul-tarvitz',
  name: 'Saul Tarvitz',
  faction: 'emperors-children',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [CHARNABAL_BROADSWORD],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// Exports
// ════════════════════════════════════════════════════════════════

export const LOYALIST_LEGION_CHARACTERS: Character[] = [
  // Dark Angels
  LION_EL_JONSON, CORSWAIN, MARDUK_SEDRAS,
  // White Scars
  JAGHATAI_KHAN, QIN_XA, HIBOU_KHAN,
  // Space Wolves
  LEMAN_RUSS, HVARL_RED_BLADE, GEIGOR_FELL_HAND,
  // Imperial Fists
  ROGAL_DORN, SIGISMUND, FAFNIR_RANN, EVANDER_GARRIUS, CAMBA_DIAZ, ALEXIS_POLUX,
  // Blood Angels
  SANGUINIUS, RALDORON, DOMINION_ZEPHON, ASTER_CROHNE,
  // Iron Hands
  FERRUS_MANUS, SHADRAK_MEDUSON, IRON_FATHER,
  // Ultramarines
  ROBOUTE_GUILLIMAN, REMUS_VENTANUS,
  // Salamanders
  VULKAN,
  // Raven Guard
  CORVUS_CORAX,
  // Emperor's Children (loyalist)
  SAUL_TARVITZ,
];
