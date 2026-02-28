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
  PHOENIX_POWER_SPEAR,
  PALATINE_BLADE,
  METEOR_HAMMER,
  EXCORIATOR_CHAINAXE,
  PAIRED_FALAX_BLADES,
  BARB_HOOK_LASH,
  ANAKATIS_BLADE,
} from '../weapons/legionChampions.js';
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
  LAKRIMAE,
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
  GLORY_AETERNA,
  THE_AXE_SERPENTIS,
  THE_CULLING_BLADE,
  GRAVITON_GAUNTLET,
  STAFF_OF_DARK_AUTHORITY,
  RELIQUARY_OF_DUST,
  AZURDA_CHARIS,
  RIME_SHARD,
} from '../weapons/namedCharacters.js';
import { POWER_SWORD } from '../weapons/legionAstartes.js';

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
  factionGambitIds: ['paragon-of-excellence'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
    { name: 'SublimeSwordsman' },
  ],
  traits: ['Traitor', 'Emperor\'s Children']
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
  // The Faultless Blade special rule causes Paragon of Excellence to give +4
  // instead of the standard +2; handled by the engine via characterId check.
  factionGambitIds: ['paragon-of-excellence'],
  specialRules: [],
  traits: ['Traitor', 'Emperor\'s Children']
};

const LORD_COMMANDER_EIDOLON: Character = {
  id: 'lord-commander-eidolon',
  name: 'Lord Commander Eidolon',
  faction: 'emperors-children',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 6, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [GLORY_AETERNA],
  factionGambitIds: ['paragon-of-excellence'],
  specialRules: [{ name: 'Bulky', value: 2 }],
  traits: ['Traitor', 'Emperor\'s Children']
};

// ════════════════════════════════════════════════════════════════
// IRON WARRIORS  (IV Legion)
// ════════════════════════════════════════════════════════════════

// ── Nârik Dreygur ────────────────────────────────────────────────────────────
// Infantry (Unique, Command, Heavy) — Feel No Pain(5+)
// Unique character with a Graviton gauntlet; no faction-specific gambits beyond Iron Warriors
const NARIK_DREYGUR: Character = {
  id: 'narik-dreygur',
  name: 'Nârik Dreygur',
  faction: 'iron-warriors',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 9,
    Sv: 2, Inv: 5,
  },
  weapons: [GRAVITON_GAUNTLET],
  factionGambitIds: ['spiteful-demise', 'the-breaker'],
  specialRules: [
    { name: 'FeelNoPain', threshold: 5 },
  ],
  traits: ['Traitor', 'Iron Warriors'],
};

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
  factionGambitIds: ['spiteful-demise', 'the-breaker'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 6 },
  ],
  traits: ['Traitor', 'Iron Warriors']
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
    I: 7, A: 6, LD: 10, CL: 10, WP: 8, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [MERCY_AND_FORGIVENESS],
  factionGambitIds: ['nostraman-courage', 'a-death-long-foreseen'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
  ],
  traits: ['Traitor', 'Night Lords']
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
  factionGambitIds: ['nostraman-courage', 'dirty-fighter'],
  specialRules: [{ name: 'Precision', threshold: 4 }],
  traits: ['Traitor', 'Night Lords']
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
  factionGambitIds: ['violent-overkill', 'brutal-dismemberment'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
  ],
  traits: ['Traitor', 'World Eaters']
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
  factionGambitIds: ['violent-overkill', 'brutal-dismemberment'],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Precision', threshold: 5 },
  ],
  traits: ['Traitor', 'World Eaters']
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
  factionGambitIds: ['steadfast-resilience'],
  specialRules: [
    { name: 'EternalWarrior', value: 3 },
    { name: 'Bulky', value: 5 },
    { name: 'PraeternaturalResilience' },
  ],
  traits: ['Traitor', 'Death Guard']
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
  weapons: [LAKRIMAE],
  factionGambitIds: ['steadfast-resilience', 'witchblood'],
  specialRules: [{ name: 'EternalWarrior', value: 1 }, { name: 'Bulky', value: 2 }, { name: 'Psykers' }],
  traits: ['Traitor', 'Death Guard']
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
  factionGambitIds: ['battle-of-the-wills', 'prophetic-duellist'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 5 },
  ],
  traits: ['Traitor', 'Thousand Sons']
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
  factionGambitIds: ['prophetic-duellist'],
  specialRules: [],
  traits: ['Traitor', 'Thousand Sons']
};

// ── Magistus Amon ─────────────────────────────────────────────────────────────
// Infantry (Unique, Command) — The Reliquary of Dust: Poisoned(2+)
// Psyker character; no Eternal Warrior or special defensive rules relevant to engine.
const MAGISTUS_AMON: Character = {
  id: 'magistus-amon',
  name: 'Magistus Amon',
  faction: 'thousand-sons',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [RELIQUARY_OF_DUST],
  factionGambitIds: ['battle-of-the-wills', 'prophetic-duellist'],
  specialRules: [],
  traits: ['Traitor', 'Thousand Sons'],
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
  factionGambitIds: ['merciless-strike'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 6 },
  ],
  traits: ['Traitor', 'Sons of Horus']
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
  factionGambitIds: ['merciless-strike'],
  specialRules: [{ name: 'EternalWarrior', value: 1 }, { name: 'Bulky', value: 2 }],
  traits: ['Traitor', 'Sons of Horus']
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
  factionGambitIds: ['merciless-strike'],
  specialRules: [],
  traits: ['Traitor', 'Sons of Horus']
};

const TYBALT_MARR: Character = {
  id: 'tybalt-marr',
  name: 'Tybalt Marr',
  faction: 'sons-of-horus',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 6, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [THE_CULLING_BLADE],
  factionGambitIds: ['merciless-strike'],
  specialRules: [{name: 'Hatred', target: 'Shattered Legions'}],
  traits: ['Traitor', 'Sons of Horus']
};

const VHEREN_ASHURHADDON: Character = {
  id: 'vheren-ashurhaddon',
  name: 'Vheren Ashurhaddon',
  faction: 'sons-of-horus',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 7, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 5, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 4,
  },
  weapons: [THE_AXE_SERPENTIS],
  factionGambitIds: ['merciless-strike'],
  specialRules: [],
  traits: ['Traitor', 'Sons of Horus']
};

// ── Maloghurst the Twisted ────────────────────────────────────────────────────
// Infantry (Unique, Command) — Slow and Purposeful (not relevant to engine)
// Broken in Body: Controlling Player chooses whether he accepts Challenges (not simulated here).
const MALOGHURST_THE_TWISTED: Character = {
  id: 'maloghurst-the-twisted',
  name: 'Maloghurst the Twisted',
  faction: 'sons-of-horus',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 10, CL: 9, WP: 9, IN: 10,
    Sv: 2, Inv: 5,
  },
  weapons: [POWER_SWORD],
  factionGambitIds: ['merciless-strike'],
  specialRules: [],
  traits: ['Traitor', 'Sons of Horus'],
};

// ── Dark Emissary (Infantry) ──────────────────────────────────────────────────
// Infantry (Unique, Command) — Staff of Dark Authority: Critical Hit(6+)
const DARK_EMISSARY: Character = {
  id: 'dark-emissary',
  name: 'Dark Emissary',
  faction: 'sons-of-horus',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 4,
    I: 5, A: 4, LD: 10, CL: 10, WP: 9, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [STAFF_OF_DARK_AUTHORITY],
  factionGambitIds: ['merciless-strike'],
  specialRules: [],
  traits: ['Traitor', 'Sons of Horus'],
};

// ── Dark Emissary in Terminator Armour ───────────────────────────────────────
// Infantry (Unique, Command, Heavy) — Cataphractii variant; Bulky(2)
const DARK_EMISSARY_TERMINATOR: Character = {
  id: 'dark-emissary-terminator',
  name: 'Dark Emissary (Terminator Armour)',
  faction: 'sons-of-horus',
  type: 'infantry',
  subTypes: ['Command', 'Heavy'],
  stats: {
    M: 6, WS: 5, BS: 5, S: 4, T: 5, W: 5,
    I: 5, A: 4, LD: 10, CL: 10, WP: 9, IN: 8,
    Sv: 2, Inv: 4,
  },
  weapons: [STAFF_OF_DARK_AUTHORITY],
  factionGambitIds: ['merciless-strike'],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
  traits: ['Traitor', 'Sons of Horus'],
};

// ── Horus Ascended ────────────────────────────────────────────────────────────
// Paragon (Unique) — daemonic form; EW(3), Bulky(6), FNP(5+), Fear(1)
// Cannot be included with Horus Lupercal; uses Worldbreaker and Warmaster's Talon.
const HORUS_ASCENDED: Character = {
  id: 'horus-ascended',
  name: 'Horus Ascended',
  faction: 'sons-of-horus',
  type: 'paragon',
  subTypes: ['Command', 'Paragon'],
  stats: {
    M: 8, WS: 9, BS: 7, S: 8, T: 8, W: 8,
    I: 7, A: 7, LD: 14, CL: 12, WP: 12, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [WARMASTERS_TALON, WORLDBREAKER],
  factionGambitIds: ['merciless-strike'],
  specialRules: [
    { name: 'EternalWarrior', value: 3 },
    { name: 'Bulky', value: 6 },
    { name: 'FeelNoPain', threshold: 5 },
    { name: 'Fear', value: 1 },
  ],
  traits: ['Traitor', 'Sons of Horus'],
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
    I: 5, A: 5, LD: 10, CL: 10, WP: 10, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [ILLUMINARUM],
  factionGambitIds: ['beseech-the-gods'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
    { name: 'Hatred', target: 'Loyalist'}
  ],
  traits: ['Traitor', 'Word Bearers']
};

const KOR_PHAERON: Character = {
  id: 'kor-phaeron',
  name: 'Kor Phaeron',
  faction: 'word-bearers',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 5, BS: 4, S: 3, T: 3, W: 3,
    I: 3, A: 4, LD: 10, CL: 9, WP: 9, IN: 9,
    Sv: 2, Inv: 5,
  },
  weapons: [PATRIARCHS_CLAWS],
  factionGambitIds: ['beseech-the-gods'],
  specialRules: [{ name: 'Bulky', value: 2 }],
  traits: ['Traitor', 'Word Bearers']
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
  factionGambitIds: ['beseech-the-gods'],
  specialRules: [],
  traits: ['Traitor', 'Word Bearers']
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
  factionGambitIds: ['beseech-the-gods'],
  specialRules: [
    { name: 'Bulky', value: 3 },
    { name: 'Fear', value: 1 },
    { name: 'FeelNoPain', threshold: 5 },
  ],
  traits: ['Traitor', 'Word Bearers']
};

// ── Zardu Layak ───────────────────────────────────────────────────────────────
// Infantry (Unique, Command, Malefic) — Hatred(Loyalist); Force(D) weapon
// Zardu Layak is accompanied by Anakatis Kul models (handled separately as a champion).
// Stats here represent Zardu Layak himself only.
// Note: the reference data shows S5/T5 for Zardu Layak (boosted from base S4/T4 by wargear/rules).
const ZARDU_LAYAK: Character = {
  id: 'zardu-layak',
  name: 'Zardu Layak',
  faction: 'word-bearers',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 5, T: 5, W: 4,
    I: 5, A: 3, LD: 11, CL: 10, WP: 9, IN: 7,
    Sv: 2, Inv: 4,
  },
  weapons: [AZURDA_CHARIS],
  factionGambitIds: ['beseech-the-gods'],
  specialRules: [
    { name: 'Hatred', target: 'Loyalist' },
  ],
  traits: ['Traitor', 'Word Bearers'],
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
  factionGambitIds: ['i-am-alpharius'],
  specialRules: [
    { name: 'EternalWarrior', value: 2 },
    { name: 'Bulky', value: 4 },
  ],
  traits: ['Alpha Legion']
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
  factionGambitIds: ['i-am-alpharius'],
  specialRules: [],
  traits: ['Alpha Legion']
};

// ── Autilon Skorr ─────────────────────────────────────────────────────────────
// Infantry (Unique, Command) — Consul-Delegatus; no engine-relevant special rules.
const AUTILON_SKORR: Character = {
  id: 'autilon-skorr',
  name: 'Autilon Skorr',
  faction: 'alpha-legion',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3,
    I: 5, A: 4, LD: 9, CL: 8, WP: 8, IN: 8,
    Sv: 2, Inv: 5,
  },
  weapons: [RIME_SHARD],
  factionGambitIds: ['i-am-alpharius'],
  specialRules: [],
  traits: ['Traitor', 'Alpha Legion'],
};

// ════════════════════════════════════════════════════════════════
// CHAMPION SUB-TYPE ADDITIONS
// ════════════════════════════════════════════════════════════════

// ── Phoenix Champion (Emperor's Children) ────────────────────────────────────
// An elite Phoenix Guard duellist bearing a power spear.
// T5, Inv5+, Bulky(2).
// Stats: M7 WS5 BS4 S4 T5 W2 I4 A3 LD9 CL9 WP7 IN7 Sv2+ Inv5+
const PHOENIX_CHAMPION: Character = {
  id: 'phoenix-champion',
  name: 'Phoenix Champion',
  faction: 'emperors-children',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 5, W: 2,
    I: 4, A: 3, LD: 9, CL: 9, WP: 7, IN: 7,
    Sv: 2, Inv: 5,
  },
  weapons: [PHOENIX_POWER_SPEAR],
  factionGambitIds: ['paragon-of-excellence'],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
  traits: ['Emperor\'s Children']
};

// ── Palatine Prefector (Emperor's Children) ──────────────────────────────────
// An elite duelling champion bearing a Palatine blade (DuellistsEdge(1)).
// Stats: M7 WS5 BS4 S4 T4 W2 I4 A3 LD8 CL8 WP7 IN7 Sv2+
const PALATINE_PREFECTOR: Character = {
  id: 'palatine-prefector',
  name: 'Palatine Prefector',
  faction: 'emperors-children',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [PALATINE_BLADE],
  factionGambitIds: ['paragon-of-excellence'],
  specialRules: [],
  traits: ['Emperor\'s Children']
};

// ── Palatine Prefector (Jump Pack) ───────────────────────────────────────────
// As Palatine Prefector but with Jump Pack; Bulky(2).
const PALATINE_PREFECTOR_JUMP_PACK: Character = {
  id: 'palatine-prefector-jump-pack',
  name: 'Palatine Prefector (Jump Pack)',
  faction: 'emperors-children',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 8, CL: 8, WP: 7, IN: 7,
    Sv: 2, Inv: null,
  },
  weapons: [PALATINE_BLADE],
  factionGambitIds: ['paragon-of-excellence'],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
  traits: ['Emperor\'s Children']
};

// ── Rampager Champion (World Eaters) ─────────────────────────────────────────
// A berserker duellist of the XII Legion bearing Caedere weapons.
// Player selects one Caedere weapon option before the challenge.
// Stats: M7 WS5 BS4 S4 T4 W2 I4 A3 LD9 CL8 WP7 IN7 Sv3+
const RAMPAGER_CHAMPION: Character = {
  id: 'rampager-champion',
  name: 'Rampager Champion',
  faction: 'world-eaters',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 7, WS: 5, BS: 4, S: 4, T: 4, W: 2,
    I: 4, A: 3, LD: 9, CL: 8, WP: 7, IN: 7,
    Sv: 3, Inv: null,
  },
  weapons: [METEOR_HAMMER, EXCORIATOR_CHAINAXE, PAIRED_FALAX_BLADES, BARB_HOOK_LASH],
  factionGambitIds: ['violent-overkill'],
  specialRules: [],
  traits: ['World Eaters']
};

// ── Anakatis Kul (Word Bearers) ──────────────────────────────────────────────
// A mighty Champion of the XVII Legion bearing the cursed Anakatis Blade.
// FeelNoPain(5+) from the blade's dark blessings; Fear(1); Bulky(2).
// Phage(S) on the Anakatis Blade reduces attacker's Strength by 1 per wound.
// Stats: M8 WS5 BS4 S5 T5 W3 I5 A3 LD10 CL9 WP4 IN4 Sv3+
const ANAKATIS_KUL: Character = {
  id: 'anakatis-kul',
  name: 'Anakatis Kul',
  faction: 'word-bearers',
  type: 'infantry',
  subTypes: ['Champion'],
  stats: {
    M: 8, WS: 5, BS: 4, S: 5, T: 5, W: 3,
    I: 5, A: 3, LD: 10, CL: 9, WP: 4, IN: 4,
    Sv: 3, Inv: null,
  },
  weapons: [ANAKATIS_BLADE],
  factionGambitIds: ['beseech-the-gods'],
  specialRules: [
    { name: 'FeelNoPain', threshold: 5 },
    { name: 'Fear', value: 1 },
    { name: 'Bulky', value: 2 },
  ],
  traits: ['Traitor', 'Word Bearers']
};

// ════════════════════════════════════════════════════════════════
// Exports
// ════════════════════════════════════════════════════════════════

export const TRAITOR_LEGION_CHARACTERS: Character[] = [
  // Emperor's Children
  FULGRIM, CAPTAIN_LUCIUS, LORD_COMMANDER_EIDOLON,
  PHOENIX_CHAMPION, PALATINE_PREFECTOR, PALATINE_PREFECTOR_JUMP_PACK,
  // Iron Warriors
  PERTURABO, NARIK_DREYGUR,
  // Night Lords
  KONRAD_CURZE, SEVATAR,
  // World Eaters
  ANGRON, KHARN_THE_BLOODY,
  RAMPAGER_CHAMPION,
  // Death Guard
  MORTARION, CALAS_TYPHON,
  // Thousand Sons
  MAGNUS_THE_RED, AHZEK_AHRIMAN, MAGISTUS_AMON,
  // Sons of Horus
  HORUS_LUPERCAL, EZEKYLE_ABADDON, HORUS_AXIMAND, TYBALT_MARR, VHEREN_ASHURHADDON,
  MALOGHURST_THE_TWISTED, DARK_EMISSARY, DARK_EMISSARY_TERMINATOR, HORUS_ASCENDED,
  // Word Bearers
  LORGAR, KOR_PHAERON, EREBUS, ARGEL_TAL,
  ANAKATIS_KUL, ZARDU_LAYAK,
  // Alpha Legion
  ALPHARIUS, ARMILLUS_DYNAT, AUTILON_SKORR,
];
