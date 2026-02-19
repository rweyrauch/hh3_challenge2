/**
 * Traitor Legion named characters.
 *
 * Covers all nine traitor Legiones Astartes: Emperor's Children,
 * Iron Warriors, Night Lords, World Eaters, Death Guard, Thousand Sons,
 * Sons of Horus, Word Bearers, and Alpha Legion.
 *
 * Includes each legion's Primarch plus senior named heroes.
 * Only characters with the Command Sub-Type are eligible for a Challenge.
 *
 * Stat sources: Legiones Astartes — Age of Darkness army list.
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import {
  LAERAN_BLADE,
  BLADES_OF_LUCIUS,
  LOGOS_ARRAY,
  FORGEBREAKER_DESECRATED,
  MERCY_AND_FORGIVENESS,
  NIGHTS_WHISPER,
  GOREFATHER_AND_GORECHILD,
  THE_CUTTER,
  GORECHILD_REFORGED,
  SILENCE,
  LACRIMAE,
  BLADE_OF_AHN_NUNURTA,
  CORVIDAEAN_SCEPTRE,
  WARMASTERS_TALON,
  WORLDBREAKER,
  CTHONIAN_POWER_CLAW,
  MOURN_IT_ALL,
  ILLUMINARUM,
  PATRIARCHS_CLAWS,
  CRUX_MALIFICA,
  DAEMONIC_TALONS,
  THE_PALE_SPEAR,
  THE_PRINCE,
  THE_PROPHET,
} from '../weapons/namedCharacters.js';

// ════════════════════════════════════════════════════════════════
// EMPEROR'S CHILDREN  (III Legion)
// ════════════════════════════════════════════════════════════════

const FULGRIM: Character = {
  id: 'fulgrim',
  name: 'Fulgrim',
  faction: 'emperors-children',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 8, BS: 7, S: 6, T: 6, W: 6,
    I: 8, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [LAERAN_BLADE],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const CAPTAIN_LUCIUS: Character = {
  id: 'captain-lucius',
  name: 'Captain Lucius',
  faction: 'emperors-children',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 4, T: 4, W: 3,
    I: 6, A: 5, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [BLADES_OF_LUCIUS],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// IRON WARRIORS  (IV Legion)
// ════════════════════════════════════════════════════════════════

const PERTURABO: Character = {
  id: 'perturabo',
  name: 'Perturabo',
  faction: 'iron-warriors',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 7, WS: 7, BS: 6, S: 6, T: 7, W: 6,
    I: 5, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [LOGOS_ARRAY, FORGEBREAKER_DESECRATED],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

// ════════════════════════════════════════════════════════════════
// NIGHT LORDS  (VIII Legion)
// ════════════════════════════════════════════════════════════════

const KONRAD_CURZE: Character = {
  id: 'konrad-curze',
  name: 'Konrad Curze',
  faction: 'night-lords',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 6, S: 6, T: 6, W: 6,
    I: 7, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [MERCY_AND_FORGIVENESS],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const SEVATAR: Character = {
  id: 'sevatar',
  name: 'Sevatar',
  faction: 'night-lords',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [NIGHTS_WHISPER],
  factionGambitIds: [],
  specialRules: [{ name: 'Precision', threshold: 4 }],
};

// ════════════════════════════════════════════════════════════════
// WORLD EATERS  (XII Legion)
// ════════════════════════════════════════════════════════════════

const ANGRON: Character = {
  id: 'angron',
  name: 'Angron',
  faction: 'world-eaters',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 8, BS: 5, S: 6, T: 6, W: 6,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [GOREFATHER_AND_GORECHILD],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const KHARN_THE_BLOODY: Character = {
  id: 'kharn-the-bloody',
  name: 'Khârn the Bloody',
  faction: 'world-eaters',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [THE_CUTTER, GORECHILD_REFORGED],
  factionGambitIds: [],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Precision', threshold: 5 },
  ],
};

// ════════════════════════════════════════════════════════════════
// DEATH GUARD  (XIV Legion)
// ════════════════════════════════════════════════════════════════

const MORTARION: Character = {
  id: 'mortarion',
  name: 'Mortarion',
  faction: 'death-guard',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 6, S: 7, T: 7, W: 7,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [SILENCE],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 3 }],
};

const CALAS_TYPHON: Character = {
  id: 'calas-typhon',
  name: 'Calas Typhon',
  faction: 'death-guard',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [LACRIMAE],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 1 }],
};

// ════════════════════════════════════════════════════════════════
// THOUSAND SONS  (XV Legion)
// ════════════════════════════════════════════════════════════════

const MAGNUS_THE_RED: Character = {
  id: 'magnus-the-red',
  name: 'Magnus the Red',
  faction: 'thousand-sons',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 7, BS: 7, S: 6, T: 6, W: 6,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [BLADE_OF_AHN_NUNURTA],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const AHZEK_AHRIMAN: Character = {
  id: 'ahzek-ahriman',
  name: 'Ahzek Ahriman',
  faction: 'thousand-sons',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 5, T: 4, W: 4,
    I: 4, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [CORVIDAEAN_SCEPTRE],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// SONS OF HORUS  (XVI Legion)
// ════════════════════════════════════════════════════════════════

const HORUS_LUPERCAL: Character = {
  id: 'horus-lupercal',
  name: 'Horus Lupercal',
  faction: 'sons-of-horus',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 8, BS: 6, S: 6, T: 6, W: 7,
    I: 6, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [WARMASTERS_TALON, WORLDBREAKER],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const EZEKYLE_ABADDON: Character = {
  id: 'ezekyle-abaddon',
  name: 'Ezekyle Abaddon',
  faction: 'sons-of-horus',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 7, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 6, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [CTHONIAN_POWER_CLAW],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 1 }],
};

const HORUS_AXIMAND: Character = {
  id: 'horus-aximand',
  name: 'Horus Aximand',
  faction: 'sons-of-horus',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [MOURN_IT_ALL],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// WORD BEARERS  (XVII Legion)
// ════════════════════════════════════════════════════════════════

const LORGAR: Character = {
  id: 'lorgar',
  name: 'Lorgar',
  faction: 'word-bearers',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 6, BS: 6, S: 6, T: 6, W: 6,
    I: 5, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [ILLUMINARUM],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const KOR_PHAERON: Character = {
  id: 'kor-phaeron',
  name: 'Kor Phaeron',
  faction: 'word-bearers',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 4, S: 3, T: 3, W: 3,
    I: 5, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 5,
  },
  weapons: [PATRIARCHS_CLAWS],
  factionGambitIds: [],
  specialRules: [],
};

const EREBUS: Character = {
  id: 'erebus',
  name: 'Erebus',
  faction: 'word-bearers',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 3, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [CRUX_MALIFICA],
  factionGambitIds: [],
  specialRules: [],
};

const ARGEL_TAL: Character = {
  id: 'argel-tal',
  name: 'Argel Tal',
  faction: 'word-bearers',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 14, WS: 6, BS: 5, S: 5, T: 5, W: 5,
    I: 5, A: 6, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [DAEMONIC_TALONS],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// ALPHA LEGION  (XX Legion)
// ════════════════════════════════════════════════════════════════

const ALPHARIUS: Character = {
  id: 'alpharius',
  name: 'Alpharius',
  faction: 'alpha-legion',
  type: 'paragon',
  subTypes: ['Command', 'Paragon', 'Light'],
  stats: {
    M: 8, WS: 7, BS: 6, S: 6, T: 6, W: 6,
    I: 7, A: 6, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: null,
  },
  weapons: [THE_PALE_SPEAR],
  factionGambitIds: [],
  specialRules: [{ name: 'EternalWarrior', value: 2 }],
};

const ARMILLUS_DYNAT: Character = {
  id: 'armillus-dynat',
  name: 'Armillus Dynat',
  faction: 'alpha-legion',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [THE_PRINCE, THE_PROPHET],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// Exports
// ════════════════════════════════════════════════════════════════

export const TRAITOR_LEGION_CHARACTERS: Character[] = [
  // Emperor's Children
  FULGRIM, CAPTAIN_LUCIUS,
  // Iron Warriors
  PERTURABO,
  // Night Lords
  KONRAD_CURZE, SEVATAR,
  // World Eaters
  ANGRON, KHARN_THE_BLOODY,
  // Death Guard
  MORTARION, CALAS_TYPHON,
  // Thousand Sons
  MAGNUS_THE_RED, AHZEK_AHRIMAN,
  // Sons of Horus
  HORUS_LUPERCAL, EZEKYLE_ABADDON, HORUS_AXIMAND,
  // Word Bearers
  LORGAR, KOR_PHAERON, EREBUS, ARGEL_TAL,
  // Alpha Legion
  ALPHARIUS, ARMILLUS_DYNAT,
];
