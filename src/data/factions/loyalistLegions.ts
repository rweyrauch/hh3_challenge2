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
  CALIBANITE_CHARGE_BLADE,
  EXCINDIO_CLAWS,
  FROST_AXE,
  FROST_SWORD,
  FROST_CLAW,
  GREAT_FROST_BLADE,
  BLADE_OF_JUDGEMENT,
  ARGEAN_POWER_SWORD,
} from '../weapons/legionChampions.js';
import { POWER_SWORD } from '../weapons/legionAstartes.js';
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
  factionGambitIds: ['sword-of-the-order', 'the-lions-choler'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
  ],
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
  factionGambitIds: ['sword-of-the-order'],
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
  factionGambitIds: ['sword-of-the-order'],
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
  factionGambitIds: ['the-path-of-the-warrior', 'death-by-a-thousand-cuts'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
  ],
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
  factionGambitIds: ['the-path-of-the-warrior'],
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
  factionGambitIds: ['the-path-of-the-warrior'],
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
  factionGambitIds: ['no-prey-escapes', 'a-saga-woven-of-glory', 'howl-of-the-death-wolf'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 5 },
  ],
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
  factionGambitIds: ['no-prey-escapes', 'a-saga-woven-of-glory'],
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
  factionGambitIds: ['no-prey-escapes', 'a-saga-woven-of-glory'],
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
  factionGambitIds: ['a-wall-unyielding'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
  ],
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
  factionGambitIds: ['a-wall-unyielding', 'deaths-champion'],
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
  factionGambitIds: ['a-wall-unyielding', 'executioners-tax'],
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
  factionGambitIds: ['a-wall-unyielding'],
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
  factionGambitIds: ['a-wall-unyielding'],
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
  factionGambitIds: ['a-wall-unyielding'],
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
  factionGambitIds: ['thrall-of-the-red-thirst', 'angelic-descent'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 6 },
  ],
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
  factionGambitIds: ['thrall-of-the-red-thirst'],
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
  factionGambitIds: ['thrall-of-the-red-thirst'],
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
  factionGambitIds: ['thrall-of-the-red-thirst'],
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
  factionGambitIds: ['legion-of-one', 'tempered-by-war'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 5 },
  ],
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
  factionGambitIds: ['legion-of-one'],
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
  factionGambitIds: ['legion-of-one'],
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
  factionGambitIds: ['aegis-of-wisdom', 'calculating-swordsman'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
  ],
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
  factionGambitIds: ['aegis-of-wisdom'],
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
  factionGambitIds: ['duty-is-sacrifice'],
  specialRules: [
    { name: 'EternalWarrior', value: 3 },
    { name: 'Bulky', value: 5 },
  ],
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
  factionGambitIds: ['decapitation-strike', 'the-shadowed-lord'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 6 },
  ],
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
  factionGambitIds: ['paragon-of-excellence', 'bite-of-the-betrayed'],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// CHAMPION SUB-TYPE ADDITIONS
// ════════════════════════════════════════════════════════════════

// ── Firewing Enigmatii (Dark Angels) ─────────────────────────────────────────
// An elite Dark Angels warrior bearing a Calibanite charge-blade.
// Bulky(2); infantry despite Jump Pack being typical (modelled as infantry for Challenge).
// Stats: M12 WS5 BS4 S4 T4 W2 I4 A3 LD8 CL8 WP7 IN7 Sv3+
const FIREWING_ENIGMATII: Character = {
  id: 'firewing-enigmatii',
  name: 'Firewing Enigmatii',
  faction: 'dark-angels',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 12, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 3, Inv: null,
  },
  weapons: [CALIBANITE_CHARGE_BLADE],
  factionGambitIds: ['sword-of-the-order'],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ── Excindio Battle-Automata (Dark Angels) ───────────────────────────────────
// A slumbering engine of the I Legion; classified as 'Artificia' in the rules
// but modelled as infantry here since the Challenge mechanics don't differ by type.
// Exceptionally durable: T7, W8, EternalWarrior(1), Bulky(6).
// Stats: M7 WS5 BS5 S7 T7 W8 I4 A4 LD10 CL10 WP10 IN10 Sv3+ Inv5+
const EXCINDIO: Character = {
  id: 'excindio',
  name: 'Excindio Battle-Automata',
  faction: 'dark-angels',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 7, T: 7, W: 8,
    I: 4, A: 4, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 3, Inv: 5,
  },
  weapons: [EXCINDIO_CLAWS],
  factionGambitIds: ['sword-of-the-order'],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Bulky', value: 6 },
  ],
};

// ── Thegn (Space Wolves) ─────────────────────────────────────────────────────
// A champion of the VI Legion in Terminator armour; Heavy, Fear(1), Bulky(2).
// Carries a selection of frost weapons; player picks one.
// Stats: M6 WS5 BS4 S4 T5 W2 I4 A4 LD9 CL9 WP7 IN7 Sv2+ Inv4+
const THEGN: Character = {
  id: 'thegn',
  name: 'Thegn',
  faction: 'space-wolves',
  type: 'infantry',
  subTypes: ['Champion', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 4, S: 4, T: 5, W: 2,
    I: 4, A: 4, LD: 9, CL: 9, WP: 7, IN: 7,
    Sv: 2, Inv: 4,
  },
  weapons: [FROST_AXE, FROST_SWORD, FROST_CLAW, GREAT_FROST_BLADE],
  factionGambitIds: ['no-prey-escapes'],
  specialRules: [
    { name: 'Fear',  value: 1 },
    { name: 'Bulky', value: 2 },
  ],
};

// ── Templar Champion (Imperial Fists) ────────────────────────────────────────
// A duelling expert of the Black Templars (VII Legion).
// Stats: M7 WS5 BS4 S4 T4 W2 I4 A3 LD9 CL8 WP8 IN8 Sv2+
const TEMPLAR_CHAMPION: Character = {
  id: 'templar-champion',
  name: 'Templar Champion',
  faction: 'imperial-fists',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: null,
  },
  weapons: [POWER_SWORD],
  factionGambitIds: ['a-wall-unyielding'],
  specialRules: [],
};

// ── Ofanim (Blood Angels) ────────────────────────────────────────────────────
// Shadows of Judgement: while engaged in a Challenge this model has
// FeelNoPain(5+) and DuellistsEdge(1).  These are encoded as character-level
// special rules; the weapon gains the DuellistsEdge effect via the character rule
// (which stacks with any weapon DuellistsEdge at the engine level).
// Stats: M7 WS5 BS4 S4 T4 W2 I4 A3 LD9 CL8 WP8 IN7 Sv2+
const OFANIM: Character = {
  id: 'ofanim',
  name: 'Ofanim',
  faction: 'blood-angels',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 9, CL: 8, WP: 8, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [BLADE_OF_JUDGEMENT],
  factionGambitIds: ['thrall-of-the-red-thirst'],
  specialRules: [
    { name: 'FeelNoPain',    threshold: 5 }, // Shadows of Judgement
    { name: 'DuellistsEdge', value: 1 },     // Shadows of Judgement
  ],
};

// ── Ofanim (Jump Pack) ───────────────────────────────────────────────────────
// As Ofanim but with Jump Pack; Bulky(2).
const OFANIM_JUMP_PACK: Character = {
  id: 'ofanim-jump-pack',
  name: 'Ofanim (Jump Pack)',
  faction: 'blood-angels',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 9, CL: 8, WP: 8, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [BLADE_OF_JUDGEMENT],
  factionGambitIds: ['thrall-of-the-red-thirst'],
  specialRules: [
    { name: 'FeelNoPain',    threshold: 5 }, // Shadows of Judgement
    { name: 'DuellistsEdge', value: 1 },     // Shadows of Judgement
    { name: 'Bulky',         value: 2 },
  ],
};

// ── Locutarus Strike Leader (Ultramarines) ───────────────────────────────────
// An Ultramarines void-assault specialist; Bulky(2).
// Stats: M12 WS5 BS4 S4 T4 W2 I4 A3 LD8 CL8 WP7 IN7 Sv2+
const LOCUTARUS_STRIKE_LEADER: Character = {
  id: 'locutarus-strike-leader',
  name: 'Locutarus Strike Leader',
  faction: 'ultramarines',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 12, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [ARGEAN_POWER_SWORD],
  factionGambitIds: ['aegis-of-wisdom'],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ════════════════════════════════════════════════════════════════
// Exports
// ════════════════════════════════════════════════════════════════

export const LOYALIST_LEGION_CHARACTERS: Character[] = [
  // Dark Angels
  LION_EL_JONSON, CORSWAIN, MARDUK_SEDRAS,
  FIREWING_ENIGMATII, EXCINDIO,
  // White Scars
  JAGHATAI_KHAN, QIN_XA, HIBOU_KHAN,
  // Space Wolves
  LEMAN_RUSS, HVARL_RED_BLADE, GEIGOR_FELL_HAND,
  THEGN,
  // Imperial Fists
  ROGAL_DORN, SIGISMUND, FAFNIR_RANN, EVANDER_GARRIUS, CAMBA_DIAZ, ALEXIS_POLUX,
  TEMPLAR_CHAMPION,
  // Blood Angels
  SANGUINIUS, RALDORON, DOMINION_ZEPHON, ASTER_CROHNE,
  OFANIM, OFANIM_JUMP_PACK,
  // Iron Hands
  FERRUS_MANUS, SHADRAK_MEDUSON, IRON_FATHER,
  // Ultramarines
  ROBOUTE_GUILLIMAN, REMUS_VENTANUS,
  LOCUTARUS_STRIKE_LEADER,
  // Salamanders
  VULKAN,
  // Raven Guard
  CORVUS_CORAX,
  // Emperor's Children (loyalist)
  SAUL_TARVITZ,
];
