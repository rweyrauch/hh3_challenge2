/**
 * Named character weapon profiles for all 18 Legiones Astartes.
 *
 * Covers both Loyalist and Traitor Primarchs plus senior named heroes.
 * Only melee profiles are included; ranged profiles are omitted as they
 * are not used in the Challenge Sub-Phase.
 *
 * Special rules not modelled by the engine (Armourbane, Reaping Blow,
 * Force, Phage, Impact) are silently omitted.
 * AP 'S' (strength-based) is represented as ap: null.
 */
import { type Weapon, profile } from '../../models/weapon.js';

// ════════════════════════════════════════════════════════════════
// DARK ANGELS
// ════════════════════════════════════════════════════════════════

/** The Lion Sword (Lion El'Jonson): I, A, +2S, AP2, D3 */
export const LION_SWORD: Weapon = {
  name: 'The Lion Sword',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Lion Sword',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 3,
    traits: ['Power', 'Sword of the Order'],
  })],
};

/** The Wolf Blade (Lion El'Jonson alt): I, A, S, AP3, D1, Shred(4+), Breaching(4+) */
export const WOLF_BLADE: Weapon = {
  name: 'The Wolf Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Wolf Blade',
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Shred', threshold: 4 },
      { name: 'Breaching', threshold: 4 },
    ],
    traits: ['Chain', 'Sword of the Order'],
  })],
};

/** The Blade (Corswain): I, A, +2S, AP2, D2, Duellist's Edge(2) */
export const CORSWAIN_THE_BLADE: Weapon = {
  name: 'The Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Blade',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 2 }],
    traits: ['Power', 'Sword of the Order'],
  })],
};

/** The Death of Worlds (Marduk Sedras): +2I, 4A(fixed), +5S, AP2, D3 */
export const DEATH_OF_WORLDS: Weapon = {
  name: 'The Death of Worlds',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Death of Worlds',
    initiativeModifier: { kind: 'add', value: 2 },
    attacksModifier: { kind: 'fixed', value: 4 },
    strengthModifier: { kind: 'add', value: 5 },
    ap: 2, damage: 3,
  })],
};

// ════════════════════════════════════════════════════════════════
// WHITE SCARS
// ════════════════════════════════════════════════════════════════

/** White Tiger Dao (Jaghatai Khan): +2I, A, S, AP2, D2, Duellist's Edge(1) */
export const WHITE_TIGER_DAO: Weapon = {
  name: 'White Tiger Dao',
  type: 'melee',
  profiles: [profile({
    profileName: 'White Tiger Dao',
    initiativeModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
    traits: ['Power'],
  })],
};

/** The Tails of the Dragon (Qin Xa): I, A, +1S, AP2, D1, Critical Hit(5+), Precision(3+) */
export const TAILS_OF_THE_DRAGON: Weapon = {
  name: 'The Tails of the Dragon',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Tails of the Dragon',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 5 },
      { name: 'Precision', threshold: 3 },
    ],
    traits: ['Power'],
  })],
};

/** The Breath of the Storm (Hibou Khan): +1I, A, +2S, AP3, D1, Critical Hit(6+), Breaching(4+) */
export const BREATH_OF_THE_STORM: Weapon = {
  name: 'The Breath of the Storm',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Breath of the Storm',
    initiativeModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Breaching', threshold: 4 },
    ],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// SPACE WOLVES
// ════════════════════════════════════════════════════════════════

/** The Axe of Helwinter (Leman Russ): I, A, +2S, AP2, D2 */
export const AXE_OF_HELWINTER: Weapon = {
  name: 'The Axe of Helwinter',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Axe of Helwinter',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
  })],
};

/** The Sword of Balenight (Leman Russ): I, A, +1S, AP2, D2, Critical Hit(5+) */
export const SWORD_OF_BALENIGHT: Weapon = {
  name: 'The Sword of Balenight',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Sword of Balenight',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  })],
};

/** Hearth-splitter (Hvarl Red-blade): I, A, +2S, AP2, D2 */
export const HEARTH_SPLITTER: Weapon = {
  name: 'Hearth-splitter',
  type: 'melee',
  profiles: [profile({
    profileName: 'Hearth-splitter',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    traits: ['Power'],
  })],
};

/** The Fell-Hand (Geigor Fell-hand): I, A, S, AP3, D1, Breaching(4+), Shred(5+) */
export const THE_FELL_HAND: Weapon = {
  name: 'The Fell-Hand',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Fell-Hand',
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 4 },
      { name: 'Shred', threshold: 5 },
    ],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// IMPERIAL FISTS
// ════════════════════════════════════════════════════════════════

/** Storm's Teeth (Rogal Dorn): I, A, S, AP2, D2, Shred(4+) */
export const STORMS_TEETH: Weapon = {
  name: "Storm's Teeth",
  type: 'melee',
  profiles: [profile({
    profileName: "Storm's Teeth",
    ap: 2, damage: 2,
    specialRules: [{ name: 'Shred', threshold: 4 }],
    traits: ['Chain'],
  })],
};

/** The Black Sword (Sigismund): I, A, +2S, AP2, D1, Critical Hit(6+), Duellist's Edge(2) */
export const THE_BLACK_SWORD: Weapon = {
  name: 'The Black Sword',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Black Sword',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'DuellistsEdge', value: 2 },
    ],
  })],
};

/** The Headsman and the Hunter (Fafnir Rann): I, A, +2S, AP3, D1, Breaching(4+) */
export const HEADSMAN_AND_HUNTER: Weapon = {
  name: 'The Headsman and the Hunter',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Headsman and the Hunter',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 4 }],
    traits: ['Power'],
  })],
};

/** Subjugator (Evander Garrius): −2I, A, +4S, AP2, D2 */
export const SUBJUGATOR: Weapon = {
  name: 'Subjugator',
  type: 'melee',
  profiles: [profile({
    profileName: 'Subjugator',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    traits: ['Power'],
  })],
};

/** Durenda (Camba Diaz): I, A, +1S, AP3, D1, Breaching(5+) */
export const DURENDA: Weapon = {
  name: 'Durenda',
  type: 'melee',
  profiles: [profile({
    profileName: 'Durenda',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** Solarite Power Gauntlet (Alexis Polux): −2I, A, +4S, AP2, D2, Critical Hit(6+) */
export const SOLARITE_POWER_GAUNTLET: Weapon = {
  name: 'Solarite Power Gauntlet',
  type: 'melee',
  profiles: [profile({
    profileName: 'Solarite Power Gauntlet',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Hammerblow (Alexis Polux gambit): I, fixed 2A (M=1+AM=1), +0S, AP2, D3, Critical Hit(6+), Power */
export const HAMMERBLOW: Weapon = {
  name: 'Hammerblow',
  type: 'melee',
  profiles: [profile({
    profileName: 'Hammerblow',
    attacksModifier: { kind: 'fixed', value: 2 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// BLOOD ANGELS
// ════════════════════════════════════════════════════════════════

/** Blade Encarmine (Sanguinius primary): I, A, +1S, AP2, D2, Critical Hit(5+) */
export const BLADE_ENCARMINE: Weapon = {
  name: 'Blade Encarmine',
  type: 'melee',
  profiles: [profile({
    profileName: 'Blade Encarmine',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** Spear of Telesto (Sanguinius): −1I, −2A, +3S, AP2, D2 */
export const SPEAR_OF_TELESTO: Weapon = {
  name: 'Spear of Telesto',
  type: 'melee',
  profiles: [profile({
    profileName: 'Spear of Telesto',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    traits: ['Power'],
  })],
};

/** Moonsilver Blade (Sanguinius): I, A, S, AP3, D2, Duellist's Edge(1) */
export const MOONSILVER_BLADE: Weapon = {
  name: 'Moonsilver Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Moonsilver Blade',
    ap: 3, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
    traits: ['Power'],
  })],
};

/** Encarmine Warblade (Raldoron): I, A, +1S, AP2, D2, Critical Hit(6+) */
export const ENCARMINE_WARBLADE: Weapon = {
  name: 'Encarmine Warblade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Encarmine Warblade',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Spiritum Sanguis (Dominion Zephon): I, A, +1S, AP2, D2 */
export const SPIRITUM_SANGUIS: Weapon = {
  name: 'Spiritum Sanguis',
  type: 'melee',
  profiles: [profile({
    profileName: 'Spiritum Sanguis',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    traits: ['Power'],
  })],
};

/** Saiphan Shard-axe (Aster Crohne): I, +1A, +1S, AP3, D1, Breaching(4+) */
export const SAIPHAN_SHARD_AXE: Weapon = {
  name: 'Saiphan Shard-axe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Saiphan Shard-axe',
    attacksModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 4 }],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// IRON HANDS
// ════════════════════════════════════════════════════════════════

/**
 * Forgebreaker (Ferrus Manus): −1I, A, +3S, AP2, D3, Critical Hit(5+)
 * The hammer later taken by Fulgrim and then Perturabo — this is Ferrus's version.
 */
export const FORGEBREAKER: Weapon = {
  name: 'Forgebreaker',
  type: 'melee',
  profiles: [profile({
    profileName: 'Forgebreaker',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 3 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** Albian Power Gladius (Shadrak Meduson): I, A, +1S, AP3, D1, Breaching(6+) */
export const ALBIAN_POWER_GLADIUS: Weapon = {
  name: 'Albian Power Gladius',
  type: 'melee',
  profiles: [profile({
    profileName: 'Albian Power Gladius',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Artificer Power Axe (Iron Father): I, A, +1S, AP3, D1 */
export const ARTIFICER_POWER_AXE: Weapon = {
  name: 'Artificer Power Axe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Artificer Power Axe',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// ULTRAMARINES
// ════════════════════════════════════════════════════════════════

/** Gladius Incandor (Roboute Guilliman): I, A, S, AP3, D2, Breaching(5+), Duellist's Edge(1) */
export const GLADIUS_INCANDOR: Weapon = {
  name: 'Gladius Incandor',
  type: 'melee',
  profiles: [profile({
    profileName: 'Gladius Incandor',
    ap: 3, damage: 2,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'DuellistsEdge', value: 1 },
    ],
    traits: ['Power'],
  })],
};

/** Hand of Dominion (Roboute Guilliman): −3I, A, +4S, AP3, D3 */
export const HAND_OF_DOMINION: Weapon = {
  name: 'Hand of Dominion',
  type: 'melee',
  profiles: [profile({
    profileName: 'Hand of Dominion',
    initiativeModifier: { kind: 'add', value: -3 },
    strengthModifier: { kind: 'add', value: 4 },
    ap: 3, damage: 3,
    traits: ['Power'],
  })],
};

/** Phaeton (Remus Ventanus): I, +1A, S, AP3, D1, Breaching(6+), Duellist's Edge(1) */
export const PHAETON: Weapon = {
  name: 'Phaeton',
  type: 'melee',
  profiles: [profile({
    profileName: 'Phaeton',
    attacksModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'DuellistsEdge', value: 1 },
    ],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// SALAMANDERS
// ════════════════════════════════════════════════════════════════

/** Dawnbringer (Vulkan): I, A, +2S, AP2, D3, Critical Hit(5+) */
export const DAWNBRINGER: Weapon = {
  name: 'Dawnbringer',
  type: 'melee',
  profiles: [profile({
    profileName: 'Dawnbringer',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// RAVEN GUARD
// ════════════════════════════════════════════════════════════════

/** Talonis (Corvus Corax): +4I, 3A(fixed), S, AP3, D2, Breaching(6+) */
export const TALONIS: Weapon = {
  name: 'Talonis',
  type: 'melee',
  profiles: [profile({
    profileName: 'Talonis',
    initiativeModifier: { kind: 'add', value: 4 },
    attacksModifier: { kind: 'fixed', value: 3 },
    ap: 3, damage: 2,
    specialRules: [{ name: 'Breaching', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Corvidine Talons (Corvus Corax): +1I, +2A, S, AP2, D1, Critical Hit(6+) */
export const CORVIDINE_TALONS: Weapon = {
  name: 'Corvidine Talons',
  type: 'melee',
  profiles: [profile({
    profileName: 'Corvidine Talons',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// EMPEROR'S CHILDREN
// ════════════════════════════════════════════════════════════════

/** Laeran Blade (Fulgrim): I, A, S, AP2, D2, Duellist's Edge(1) */
export const LAERAN_BLADE: Weapon = {
  name: 'Laeran Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Laeran Blade',
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
    traits: ['Power'],
  })],
};

/** Blades of Lucius (Captain Lucius): I, A, S, AP2, D2, Duellist's Edge(1) */
export const BLADES_OF_LUCIUS: Weapon = {
  name: 'Blades of Lucius',
  type: 'melee',
  profiles: [profile({
    profileName: 'Blades of Lucius',
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
  })],
};

export const GLORY_AETERNA: Weapon = {
  name: 'Glory Aeterna',
  type: 'melee',
  profiles: [profile({
    profileName: 'Glory Aeterna',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Charnabal Broadsword (Saul Tarvitz): I, A, +2S, AP−, D1, Breaching(5+), Duellist's Edge(1) */
export const CHARNABAL_BROADSWORD: Weapon = {
  name: 'Charnabal Broadsword',
  type: 'melee',
  profiles: [profile({
    profileName: 'Charnabal Broadsword',
    strengthModifier: { kind: 'add', value: 2 },
    ap: null, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'DuellistsEdge', value: 1 },
    ],
    traits: ['Charnabal'],
  })],
};

// ════════════════════════════════════════════════════════════════
// IRON WARRIORS
// ════════════════════════════════════════════════════════════════

/** The Logos Array (Perturabo): I, +2A, 6S(fixed), AP3, D1, Shred(4+) */
export const LOGOS_ARRAY: Weapon = {
  name: 'The Logos Array',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Logos Array',
    attacksModifier: { kind: 'add', value: 2 },
    strengthModifier: { kind: 'fixed', value: 6 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Shred', threshold: 4 }],
    traits: ['Power'],
  })],
};

/**
 * Forgebreaker — Desecrated (Perturabo): −2I, A, +4S, AP2, D2, Critical Hit(5+)
 * Perturabo's corrupted version of the hammer taken from Ferrus Manus.
 */
export const FORGEBREAKER_DESECRATED: Weapon = {
  name: 'Forgebreaker (Desecrated)',
  type: 'melee',
  profiles: [profile({
    profileName: 'Forgebreaker (Desecrated)',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// NIGHT LORDS
// ════════════════════════════════════════════════════════════════

/** Mercy and Forgiveness (Konrad Curze): I, +2A, S, AP2, D1, Critical Hit(5+), Shred(4+) */
export const MERCY_AND_FORGIVENESS: Weapon = {
  name: 'Mercy and Forgiveness',
  type: 'melee',
  profiles: [profile({
    profileName: 'Mercy and Forgiveness',
    attacksModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 5 },
      { name: 'Shred', threshold: 4 },
    ],
    traits: ['Power'],
  })],
};

/** Night's Whisper (Sevatar): +1I, A, +2S, AP2, D1, Critical Hit(6+), Shred(5+) */
export const NIGHTS_WHISPER: Weapon = {
  name: "Night's Whisper",
  type: 'melee',
  profiles: [profile({
    profileName: "Night's Whisper",
    initiativeModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Shred', threshold: 5 },
    ],
    traits: ['Chain'],
  })],
};

// ════════════════════════════════════════════════════════════════
// WORLD EATERS
// ════════════════════════════════════════════════════════════════

/** Gorefather and Gorechild (Angron): I, +1A, S, AP2, D2, Critical Hit(6+), Shred(5+) */
export const GOREFATHER_AND_GORECHILD: Weapon = {
  name: 'Gorefather and Gorechild',
  type: 'melee',
  profiles: [profile({
    profileName: 'Gorefather and Gorechild',
    attacksModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Shred', threshold: 5 },
    ],
    traits: ['Chain'],
  })],
};

/** The Cutter (Khârn): I, A, +1S, AP2, D1, Critical Hit(6+) */
export const THE_CUTTER: Weapon = {
  name: 'The Cutter',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Cutter',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Chain'],
  })],
};

/** Gorechild Reforged (Khârn): I, A, +1S, AP2, D1, Critical Hit(6+), Shred(5+) */
export const GORECHILD_REFORGED: Weapon = {
  name: 'Gorechild Reforged',
  type: 'melee',
  profiles: [profile({
    profileName: 'Gorechild Reforged',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Shred', threshold: 5 },
    ],
    traits: ['Chain'],
  })],
};

// ════════════════════════════════════════════════════════════════
// DEATH GUARD
// ════════════════════════════════════════════════════════════════

/** Silence (Mortarion): −1I, A, +1S, AP2, D2, Critical Hit(6+) */
export const SILENCE: Weapon = {
  name: 'Silence',
  type: 'melee',
  profiles: [profile({
    profileName: 'Silence',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Lakrimae (Calas Typhon): −1I, A, +1S, AP−, D2 (AP 'S' = strength-based, modelled as null) */
export const LAKRIMAE: Weapon = {
  name: 'Lakrimae',
  type: 'melee',
  profiles: [profile({
    profileName: 'Lakrimae',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: null, damage: 2,
    specialRules: [{ name: 'Poisoned', threshold: 3}], // Poisoned(3+)
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// THOUSAND SONS
// ════════════════════════════════════════════════════════════════

/** Blade of Ahn-nunurta (Magnus the Red): I, A, +1S, AP2, D2 */
export const BLADE_OF_AHN_NUNURTA: Weapon = {
  name: 'Blade of Ahn-nunurta',
  type: 'melee',
  profiles: [profile({
    profileName: 'Blade of Ahn-nunurta',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    traits: ['Psychic'],
  })],
};

/** Corvidaean Sceptre (Ahzek Ahriman): +1I, A, +1S, AP2, D1, Critical Hit(6+) */
export const CORVIDAEAN_SCEPTRE: Weapon = {
  name: 'Corvidaean Sceptre',
  type: 'melee',
  profiles: [profile({
    profileName: 'Corvidaean Sceptre',
    initiativeModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Psychic'],
  })],
};

// ════════════════════════════════════════════════════════════════
// SONS OF HORUS
// ════════════════════════════════════════════════════════════════

/** Warmaster's Talon (Horus Lupercal): I, A, S, AP2, D1, Shred(6+) */
export const WARMASTERS_TALON: Weapon = {
  name: "Warmaster's Talon",
  type: 'melee',
  profiles: [profile({
    profileName: "Warmaster's Talon",
    ap: 2, damage: 1,
    specialRules: [{ name: 'Shred', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Worldbreaker (Horus Lupercal): −2I, A, +4S, AP2, D3, Critical Hit(5+) */
export const WORLDBREAKER: Weapon = {
  name: 'Worldbreaker',
  type: 'melee',
  profiles: [profile({
    profileName: 'Worldbreaker',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 4 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** Cthonian Power Claw (Ezekyle Abaddon): −2I, A, +4S, AP2, D2, Shred(5+) */
export const CTHONIAN_POWER_CLAW: Weapon = {
  name: 'Cthonian Power Claw',
  type: 'melee',
  profiles: [profile({
    profileName: 'Cthonian Power Claw',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'Shred', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** Mourn-it-all (Horus Aximand): I, A, +1S, AP2, D2, Critical Hit(6+) */
export const MOURN_IT_ALL: Weapon = {
  name: 'Mourn-it-all',
  type: 'melee',
  profiles: [profile({
    profileName: 'Mourn-it-all',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Power'],
  })],
};

// ════════════════════════════════════════════════════════════════
// WORD BEARERS
// ════════════════════════════════════════════════════════════════

/** Illuminarum (Lorgar): I, A, +2S, AP2, D3, Critical Hit(5+) */
export const ILLUMINARUM: Weapon = {
  name: 'Illuminarum',
  type: 'melee',
  profiles: [profile({
    profileName: 'Illuminarum',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** Patriarch's Claws (Kor Phaeron): I, A, S, AP2, D1, Shred(6+) */
export const PATRIARCHS_CLAWS: Weapon = {
  name: "Patriarch's Claws",
  type: 'melee',
  profiles: [profile({
    profileName: "Patriarch's Claws",
    ap: 2, damage: 1,
    specialRules: [{ name: 'Shred', threshold: 6 }],
    traits: ['Power'],
  })],
};

/** Crux Malifica (Erebus): I, A, +3S, AP2, D2 */
export const CRUX_MALIFICA: Weapon = {
  name: 'Crux Malifica',
  type: 'melee',
  profiles: [profile({
    profileName: 'Crux Malifica',
    strengthModifier: { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    traits: ['Power', 'Psychic'],
  })],
};

/** Daemonic Talons (Argel Tal): I, A, S, AP2, D2 */
export const DAEMONIC_TALONS: Weapon = {
  name: 'Daemonic Talons',
  type: 'melee',
  profiles: [profile({
    profileName: 'Daemonic Talons',
    ap: 2, damage: 2,
    traits: ['Psychic'],
  })],
};

// ════════════════════════════════════════════════════════════════
// ALPHA LEGION
// ════════════════════════════════════════════════════════════════

/** The Pale Spear (Alpharius): +1I, A, +1S, AP2, D2, Critical Hit(5+) */
export const THE_PALE_SPEAR: Weapon = {
  name: 'The Pale Spear',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Pale Spear',
    initiativeModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** The Prince (Armillus Dynat): I, A, S, AP3, D1, Breaching(5+) */
export const THE_PRINCE: Weapon = {
  name: 'The Prince',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Prince',
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Power'],
  })],
};

/** The Prophet (Armillus Dynat): −2I, −1A, +3S, AP2, D2 */
export const THE_PROPHET: Weapon = {
  name: 'The Prophet',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Prophet',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    traits: ['Power'],
  })],
};
