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
import type { Weapon } from '../../models/weapon.js';

// ════════════════════════════════════════════════════════════════
// DARK ANGELS
// ════════════════════════════════════════════════════════════════

/** The Lion Sword (Lion El'Jonson): I, A, +2S, AP2, D3 */
export const LION_SWORD: Weapon = {
  name: 'The Lion Sword',
  type: 'melee',
  profiles: [{
    profileName: 'The Lion Sword',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 3,
    specialRules: [],
  }],
};

/** The Wolf Blade (Lion El'Jonson alt): I, A, S, AP3, D1, Shred(4+), Breaching(4+) */
export const WOLF_BLADE: Weapon = {
  name: 'The Wolf Blade',
  type: 'melee',
  profiles: [{
    profileName: 'The Wolf Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Shred',     threshold: 4 },
      { name: 'Breaching', threshold: 4 },
    ],
  }],
};

/** The Blade (Corswain): I, A, +2S, AP2, D2, Duellist's Edge(2) */
export const CORSWAIN_THE_BLADE: Weapon = {
  name: 'The Blade',
  type: 'melee',
  profiles: [{
    profileName: 'The Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 2 }],
  }],
};

/** The Death of Worlds (Marduk Sedras): +2I, 4A(fixed), +5S, AP2, D3 */
export const DEATH_OF_WORLDS: Weapon = {
  name: 'The Death of Worlds',
  type: 'melee',
  profiles: [{
    profileName: 'The Death of Worlds',
    initiativeModifier: { kind: 'add', value: 2 },
    attacksModifier:    { kind: 'fixed', value: 4 },
    strengthModifier:   { kind: 'add', value: 5 },
    ap: 2, damage: 3,
    specialRules: [],
  }],
};

// ════════════════════════════════════════════════════════════════
// WHITE SCARS
// ════════════════════════════════════════════════════════════════

/** White Tiger Dao (Jaghatai Khan): +2I, A, S, AP2, D2, Duellist's Edge(1) */
export const WHITE_TIGER_DAO: Weapon = {
  name: 'White Tiger Dao',
  type: 'melee',
  profiles: [{
    profileName: 'White Tiger Dao',
    initiativeModifier: { kind: 'add', value: 2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
  }],
};

/** The Tails of the Dragon (Qin Xa): I, A, +1S, AP2, D1, Critical Hit(5+), Precision(3+) */
export const TAILS_OF_THE_DRAGON: Weapon = {
  name: 'The Tails of the Dragon',
  type: 'melee',
  profiles: [{
    profileName: 'The Tails of the Dragon',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 5 },
      { name: 'Precision',   threshold: 3 },
    ],
  }],
};

/** The Breath of the Storm (Hibou Khan): +1I, A, +2S, AP3, D1, Critical Hit(6+), Breaching(4+) */
export const BREATH_OF_THE_STORM: Weapon = {
  name: 'The Breath of the Storm',
  type: 'melee',
  profiles: [{
    profileName: 'The Breath of the Storm',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Breaching',   threshold: 4 },
    ],
  }],
};

// ════════════════════════════════════════════════════════════════
// SPACE WOLVES
// ════════════════════════════════════════════════════════════════

/** The Axe of Helwinter (Leman Russ): I, A, +2S, AP2, D2 */
export const AXE_OF_HELWINTER: Weapon = {
  name: 'The Axe of Helwinter',
  type: 'melee',
  profiles: [{
    profileName: 'The Axe of Helwinter',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

/** The Sword of Balenight (Leman Russ): I, A, +1S, AP2, D2, Critical Hit(5+) */
export const SWORD_OF_BALENIGHT: Weapon = {
  name: 'The Sword of Balenight',
  type: 'melee',
  profiles: [{
    profileName: 'The Sword of Balenight',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** Hearth-splitter (Hvarl Red-blade): I, A, +2S, AP2, D2 */
export const HEARTH_SPLITTER: Weapon = {
  name: 'Hearth-splitter',
  type: 'melee',
  profiles: [{
    profileName: 'Hearth-splitter',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

/** The Fell-Hand (Geigor Fell-hand): I, A, S, AP3, D1, Breaching(4+), Shred(5+) */
export const THE_FELL_HAND: Weapon = {
  name: 'The Fell-Hand',
  type: 'melee',
  profiles: [{
    profileName: 'The Fell-Hand',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 4 },
      { name: 'Shred',     threshold: 5 },
    ],
  }],
};

// ════════════════════════════════════════════════════════════════
// IMPERIAL FISTS
// ════════════════════════════════════════════════════════════════

/** Storm's Teeth (Rogal Dorn): I, A, S, AP2, D2, Shred(4+) */
export const STORMS_TEETH: Weapon = {
  name: "Storm's Teeth",
  type: 'melee',
  profiles: [{
    profileName: "Storm's Teeth",
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [{ name: 'Shred', threshold: 4 }],
  }],
};

/** The Black Sword (Sigismund): I, A, +2S, AP2, D1, Critical Hit(6+), Duellist's Edge(2) */
export const THE_BLACK_SWORD: Weapon = {
  name: 'The Black Sword',
  type: 'melee',
  profiles: [{
    profileName: 'The Black Sword',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit',   threshold: 6 },
      { name: 'DuellistsEdge', value: 2 },
    ],
  }],
};

/** The Headsman and the Hunter (Fafnir Rann): I, A, +2S, AP3, D1, Breaching(4+) */
export const HEADSMAN_AND_HUNTER: Weapon = {
  name: 'The Headsman and the Hunter',
  type: 'melee',
  profiles: [{
    profileName: 'The Headsman and the Hunter',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 4 }],
  }],
};

/** Subjugator (Evander Garrius): −2I, A, +4S, AP2, D2 */
export const SUBJUGATOR: Weapon = {
  name: 'Subjugator',
  type: 'melee',
  profiles: [{
    profileName: 'Subjugator',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

/** Durenda (Camba Diaz): I, A, +1S, AP3, D1, Breaching(5+) */
export const DURENDA: Weapon = {
  name: 'Durenda',
  type: 'melee',
  profiles: [{
    profileName: 'Durenda',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
  }],
};

/** Solarite Power Gauntlet (Alexis Polux): −2I, A, +4S, AP2, D2, Critical Hit(6+) */
export const SOLARITE_POWER_GAUNTLET: Weapon = {
  name: 'Solarite Power Gauntlet',
  type: 'melee',
  profiles: [{
    profileName: 'Solarite Power Gauntlet',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

// ════════════════════════════════════════════════════════════════
// BLOOD ANGELS
// ════════════════════════════════════════════════════════════════

/** Blade Encarmine (Sanguinius primary): I, A, +1S, AP2, D2, Critical Hit(5+) */
export const BLADE_ENCARMINE: Weapon = {
  name: 'Blade Encarmine',
  type: 'melee',
  profiles: [{
    profileName: 'Blade Encarmine',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** Spear of Telesto (Sanguinius): −1I, −2A, +3S, AP2, D2 */
export const SPEAR_OF_TELESTO: Weapon = {
  name: 'Spear of Telesto',
  type: 'melee',
  profiles: [{
    profileName: 'Spear of Telesto',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier:    { kind: 'add', value: -2 },
    strengthModifier:   { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

/** Moonsilver Blade (Sanguinius): I, A, S, AP3, D2, Duellist's Edge(1) */
export const MOONSILVER_BLADE: Weapon = {
  name: 'Moonsilver Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Moonsilver Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
  }],
};

/** Encarmine Warblade (Raldoron): I, A, +1S, AP2, D2, Critical Hit(6+) */
export const ENCARMINE_WARBLADE: Weapon = {
  name: 'Encarmine Warblade',
  type: 'melee',
  profiles: [{
    profileName: 'Encarmine Warblade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

/** Spiritum Sanguis (Dominion Zephon): I, A, +1S, AP2, D2 */
export const SPIRITUM_SANGUIS: Weapon = {
  name: 'Spiritum Sanguis',
  type: 'melee',
  profiles: [{
    profileName: 'Spiritum Sanguis',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

/** Saiphan Shard-axe (Aster Crohne): I, +1A, +1S, AP3, D1, Breaching(4+) */
export const SAIPHAN_SHARD_AXE: Weapon = {
  name: 'Saiphan Shard-axe',
  type: 'melee',
  profiles: [{
    profileName: 'Saiphan Shard-axe',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'add', value: 1 },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 4 }],
  }],
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
  profiles: [{
    profileName: 'Forgebreaker',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 3 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** Albian Power Gladius (Shadrak Meduson): I, A, +1S, AP3, D1, Breaching(6+) */
export const ALBIAN_POWER_GLADIUS: Weapon = {
  name: 'Albian Power Gladius',
  type: 'melee',
  profiles: [{
    profileName: 'Albian Power Gladius',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 6 }],
  }],
};

/** Artificer Power Axe (Iron Father): I, A, +1S, AP3, D1 */
export const ARTIFICER_POWER_AXE: Weapon = {
  name: 'Artificer Power Axe',
  type: 'melee',
  profiles: [{
    profileName: 'Artificer Power Axe',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [],
  }],
};

// ════════════════════════════════════════════════════════════════
// ULTRAMARINES
// ════════════════════════════════════════════════════════════════

/** Gladius Incandor (Roboute Guilliman): I, A, S, AP3, D2, Breaching(5+), Duellist's Edge(1) */
export const GLADIUS_INCANDOR: Weapon = {
  name: 'Gladius Incandor',
  type: 'melee',
  profiles: [{
    profileName: 'Gladius Incandor',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 2,
    specialRules: [
      { name: 'Breaching',    threshold: 5 },
      { name: 'DuellistsEdge', value: 1 },
    ],
  }],
};

/** Hand of Dominion (Roboute Guilliman): −3I, A, +4S, AP3, D3 */
export const HAND_OF_DOMINION: Weapon = {
  name: 'Hand of Dominion',
  type: 'melee',
  profiles: [{
    profileName: 'Hand of Dominion',
    initiativeModifier: { kind: 'add', value: -3 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 4 },
    ap: 3, damage: 3,
    specialRules: [],
  }],
};

/** Phaeton (Remus Ventanus): I, +1A, S, AP3, D1, Breaching(6+), Duellist's Edge(1) */
export const PHAETON: Weapon = {
  name: 'Phaeton',
  type: 'melee',
  profiles: [{
    profileName: 'Phaeton',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'add', value: 1 },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching',    threshold: 6 },
      { name: 'DuellistsEdge', value: 1 },
    ],
  }],
};

// ════════════════════════════════════════════════════════════════
// SALAMANDERS
// ════════════════════════════════════════════════════════════════

/** Dawnbringer (Vulkan): I, A, +2S, AP2, D3, Critical Hit(5+) */
export const DAWNBRINGER: Weapon = {
  name: 'Dawnbringer',
  type: 'melee',
  profiles: [{
    profileName: 'Dawnbringer',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

// ════════════════════════════════════════════════════════════════
// RAVEN GUARD
// ════════════════════════════════════════════════════════════════

/** Talonis (Corvus Corax): +4I, 3A(fixed), S, AP3, D2, Breaching(6+) */
export const TALONIS: Weapon = {
  name: 'Talonis',
  type: 'melee',
  profiles: [{
    profileName: 'Talonis',
    initiativeModifier: { kind: 'add', value: 4 },
    attacksModifier:    { kind: 'fixed', value: 3 },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 2,
    specialRules: [{ name: 'Breaching', threshold: 6 }],
  }],
};

/** Corvidine Talons (Corvus Corax): +1I, +2A, S, AP2, D1, Critical Hit(6+) */
export const CORVIDINE_TALONS: Weapon = {
  name: 'Corvidine Talons',
  type: 'melee',
  profiles: [{
    profileName: 'Corvidine Talons',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'add', value: 2 },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

// ════════════════════════════════════════════════════════════════
// EMPEROR'S CHILDREN
// ════════════════════════════════════════════════════════════════

/** Laeran Blade (Fulgrim): I, A, S, AP2, D2, Duellist's Edge(1) */
export const LAERAN_BLADE: Weapon = {
  name: 'Laeran Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Laeran Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
  }],
};

/** Blades of Lucius (Captain Lucius): I, A, S, AP2, D2, Duellist's Edge(1) */
export const BLADES_OF_LUCIUS: Weapon = {
  name: 'Blades of Lucius',
  type: 'melee',
  profiles: [{
    profileName: 'Blades of Lucius',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [{ name: 'DuellistsEdge', value: 1 }],
  }],
};

/** Charnabal Broadsword (Saul Tarvitz): I, A, +2S, AP−, D1, Breaching(5+), Duellist's Edge(1) */
export const CHARNABAL_BROADSWORD: Weapon = {
  name: 'Charnabal Broadsword',
  type: 'melee',
  profiles: [{
    profileName: 'Charnabal Broadsword',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: null, damage: 1,
    specialRules: [
      { name: 'Breaching',    threshold: 5 },
      { name: 'DuellistsEdge', value: 1 },
    ],
  }],
};

// ════════════════════════════════════════════════════════════════
// IRON WARRIORS
// ════════════════════════════════════════════════════════════════

/** The Logos Array (Perturabo): I, +2A, 6S(fixed), AP3, D1, Shred(4+) */
export const LOGOS_ARRAY: Weapon = {
  name: 'The Logos Array',
  type: 'melee',
  profiles: [{
    profileName: 'The Logos Array',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'add', value: 2 },
    strengthModifier:   { kind: 'fixed', value: 6 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Shred', threshold: 4 }],
  }],
};

/**
 * Forgebreaker — Desecrated (Perturabo): −2I, A, +4S, AP2, D2, Critical Hit(5+)
 * Perturabo's corrupted version of the hammer taken from Ferrus Manus.
 */
export const FORGEBREAKER_DESECRATED: Weapon = {
  name: 'Forgebreaker (Desecrated)',
  type: 'melee',
  profiles: [{
    profileName: 'Forgebreaker (Desecrated)',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

// ════════════════════════════════════════════════════════════════
// NIGHT LORDS
// ════════════════════════════════════════════════════════════════

/** Mercy and Forgiveness (Konrad Curze): I, +2A, S, AP2, D1, Critical Hit(5+), Shred(4+) */
export const MERCY_AND_FORGIVENESS: Weapon = {
  name: 'Mercy and Forgiveness',
  type: 'melee',
  profiles: [{
    profileName: 'Mercy and Forgiveness',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'add', value: 2 },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 5 },
      { name: 'Shred',       threshold: 4 },
    ],
  }],
};

/** Night's Whisper (Sevatar): +1I, A, +2S, AP2, D1, Critical Hit(6+), Shred(5+) */
export const NIGHTS_WHISPER: Weapon = {
  name: "Night's Whisper",
  type: 'melee',
  profiles: [{
    profileName: "Night's Whisper",
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Shred',       threshold: 5 },
    ],
  }],
};

// ════════════════════════════════════════════════════════════════
// WORLD EATERS
// ════════════════════════════════════════════════════════════════

/** Gorefather and Gorechild (Angron): I, +1A, S, AP2, D2, Critical Hit(6+), Shred(5+) */
export const GOREFATHER_AND_GORECHILD: Weapon = {
  name: 'Gorefather and Gorechild',
  type: 'melee',
  profiles: [{
    profileName: 'Gorefather and Gorechild',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'add', value: 1 },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Shred',       threshold: 5 },
    ],
  }],
};

/** The Cutter (Khârn): I, A, +1S, AP2, D1, Critical Hit(6+) */
export const THE_CUTTER: Weapon = {
  name: 'The Cutter',
  type: 'melee',
  profiles: [{
    profileName: 'The Cutter',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

/** Gorechild Reforged (Khârn): I, A, +1S, AP2, D1, Critical Hit(6+), Shred(5+) */
export const GORECHILD_REFORGED: Weapon = {
  name: 'Gorechild Reforged',
  type: 'melee',
  profiles: [{
    profileName: 'Gorechild Reforged',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Shred',       threshold: 5 },
    ],
  }],
};

// ════════════════════════════════════════════════════════════════
// DEATH GUARD
// ════════════════════════════════════════════════════════════════

/** Silence (Mortarion): −1I, A, +1S, AP2, D2, Critical Hit(6+) */
export const SILENCE: Weapon = {
  name: 'Silence',
  type: 'melee',
  profiles: [{
    profileName: 'Silence',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

/** Lacrimae (Calas Typhon): −1I, A, +1S, AP−, D2 (AP 'S' = strength-based, modelled as null) */
export const LACRIMAE: Weapon = {
  name: 'Lacrimae',
  type: 'melee',
  profiles: [{
    profileName: 'Lacrimae',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: null, damage: 2,
    specialRules: [],
  }],
};

// ════════════════════════════════════════════════════════════════
// THOUSAND SONS
// ════════════════════════════════════════════════════════════════

/** Blade of Ahn-nunurta (Magnus the Red): I, A, +1S, AP2, D2 */
export const BLADE_OF_AHN_NUNURTA: Weapon = {
  name: 'Blade of Ahn-nunurta',
  type: 'melee',
  profiles: [{
    profileName: 'Blade of Ahn-nunurta',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

/** Corvidaean Sceptre (Ahzek Ahriman): +1I, A, +1S, AP2, D1, Critical Hit(6+) */
export const CORVIDAEAN_SCEPTRE: Weapon = {
  name: 'Corvidaean Sceptre',
  type: 'melee',
  profiles: [{
    profileName: 'Corvidaean Sceptre',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 1,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

// ════════════════════════════════════════════════════════════════
// SONS OF HORUS
// ════════════════════════════════════════════════════════════════

/** Warmaster's Talon (Horus Lupercal): I, A, S, AP2, D1, Shred(6+) */
export const WARMASTERS_TALON: Weapon = {
  name: "Warmaster's Talon",
  type: 'melee',
  profiles: [{
    profileName: "Warmaster's Talon",
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 1,
    specialRules: [{ name: 'Shred', threshold: 6 }],
  }],
};

/** Worldbreaker (Horus Lupercal): −2I, A, +4S, AP2, D3, Critical Hit(5+) */
export const WORLDBREAKER: Weapon = {
  name: 'Worldbreaker',
  type: 'melee',
  profiles: [{
    profileName: 'Worldbreaker',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 4 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** Cthonian Power Claw (Ezekyle Abaddon): −2I, A, +4S, AP2, D2, Shred(5+) */
export const CTHONIAN_POWER_CLAW: Weapon = {
  name: 'Cthonian Power Claw',
  type: 'melee',
  profiles: [{
    profileName: 'Cthonian Power Claw',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 4 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'Shred', threshold: 5 }],
  }],
};

/** Mourn-it-all (Horus Aximand): I, A, +1S, AP2, D2, Critical Hit(6+) */
export const MOURN_IT_ALL: Weapon = {
  name: 'Mourn-it-all',
  type: 'melee',
  profiles: [{
    profileName: 'Mourn-it-all',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};

// ════════════════════════════════════════════════════════════════
// WORD BEARERS
// ════════════════════════════════════════════════════════════════

/** Illuminarum (Lorgar): I, A, +2S, AP2, D3, Critical Hit(5+) */
export const ILLUMINARUM: Weapon = {
  name: 'Illuminarum',
  type: 'melee',
  profiles: [{
    profileName: 'Illuminarum',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** Patriarch's Claws (Kor Phaeron): I, A, S, AP2, D1, Shred(6+) */
export const PATRIARCHS_CLAWS: Weapon = {
  name: "Patriarch's Claws",
  type: 'melee',
  profiles: [{
    profileName: "Patriarch's Claws",
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 1,
    specialRules: [{ name: 'Shred', threshold: 6 }],
  }],
};

/** Crux Malifica (Erebus): I, A, +3S, AP2, D2 */
export const CRUX_MALIFICA: Weapon = {
  name: 'Crux Malifica',
  type: 'melee',
  profiles: [{
    profileName: 'Crux Malifica',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

/** Daemonic Talons (Argel Tal): I, A, S, AP2, D2 */
export const DAEMONIC_TALONS: Weapon = {
  name: 'Daemonic Talons',
  type: 'melee',
  profiles: [{
    profileName: 'Daemonic Talons',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};

// ════════════════════════════════════════════════════════════════
// ALPHA LEGION
// ════════════════════════════════════════════════════════════════

/** The Pale Spear (Alpharius): +1I, A, +1S, AP2, D2, Critical Hit(5+) */
export const THE_PALE_SPEAR: Weapon = {
  name: 'The Pale Spear',
  type: 'melee',
  profiles: [{
    profileName: 'The Pale Spear',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** The Prince (Armillus Dynat): I, A, S, AP3, D1, Breaching(5+) */
export const THE_PRINCE: Weapon = {
  name: 'The Prince',
  type: 'melee',
  profiles: [{
    profileName: 'The Prince',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
  }],
};

/** The Prophet (Armillus Dynat): −2I, −1A, +3S, AP2, D2 */
export const THE_PROPHET: Weapon = {
  name: 'The Prophet',
  type: 'melee',
  profiles: [{
    profileName: 'The Prophet',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'add', value: -1 },
    strengthModifier:   { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    specialRules: [],
  }],
};
