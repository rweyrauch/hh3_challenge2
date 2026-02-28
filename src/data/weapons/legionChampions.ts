/**
 * Melee weapon profiles specific to Legion Champion-sub-type units.
 *
 * Stat sources: Legiones Astartes army list.
 *
 * Rules intentionally omitted:
 *   Reaping Blow(X) — established pattern; no effect in Challenge Sub-Phase
 *   Impact(X)       — charge-only bonus; no effect in Challenge Sub-Phase
 */
import { type Weapon, profile } from '../../models/weapon.js';

// ── Space Wolves Frost Weapons ───────────────────────────────────────────────

/** Frost axe. IM-1/AM—/SM+1/AP3/D1, Breaching(4+). Reaping Blow(1) omitted. */
export const FROST_AXE: Weapon = {
  name: 'Frost Axe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Frost Axe',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 4 }],
    // Reaping Blow(1) not simulated
    traits: ['Power'],
  })],
};

/** Frost sword. IM+1/AM—/SM—/AP3/D1, Breaching(5+). Reaping Blow(1) omitted. */
export const FROST_SWORD: Weapon = {
  name: 'Frost Sword',
  type: 'melee',
  profiles: [profile({
    profileName: 'Frost Sword',
    initiativeModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    // Reaping Blow(1) not simulated
    traits: ['Power'],
  })],
};

/** Frost claw. IM—/AM—/SM—/AP3/D1, Breaching(4+), Shred(6+). Reaping Blow(1) omitted. */
export const FROST_CLAW: Weapon = {
  name: 'Frost Claw',
  type: 'melee',
  profiles: [profile({
    profileName: 'Frost Claw',
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 4 },
      { name: 'Shred', threshold: 6 },
    ],
    // Reaping Blow(1) not simulated
    traits: ['Power'],
  })],
};

/** Great frost blade. IM-2/AM—/SM+3/AP2/D2. Reaping Blow(1) omitted. */
export const GREAT_FROST_BLADE: Weapon = {
  name: 'Great Frost Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Great Frost Blade',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    // Reaping Blow(1) not simulated
    traits: ['Power'],
  })],
};

// ── Dark Angels Weapons ──────────────────────────────────────────────────────

export const CALIBANITE_WARBLADE: Weapon = {
  name: 'Calibanite Warblade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Calibanite Warblade',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Sword of the Order'],
  })],
};

export const TERRANIC_GREATSWORD: Weapon = {
  name: 'Terranic Greatsword',
  type: 'melee',
  profiles: [profile({
    profileName: 'Terranic Greatsword',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 2,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Sword of the Order'],
  })],
};

/**
 * Calibanite charge-blade (Firewing Enigmatii / Dark Angels).
 * Two profiles: Uncharged and Charged. Player selects one per engagement.
 * Both profiles have the Sword of the Order trait (sword keyword for DA gambit).
 */
export const CALIBANITE_CHARGE_BLADE: Weapon = {
  name: 'Calibanite Charge-blade',
  type: 'melee',
  profiles: [
    profile({
      profileName: 'Uncharged',
      initiativeModifier: { kind: 'add', value: 2 },
      ap: 4, damage: 1,
      traits: ['Sword of the Order'],
    }),
    profile({
      profileName: 'Charged',
      initiativeModifier: { kind: 'add', value: -1 },
      strengthModifier: { kind: 'add', value: 1 },
      ap: 3, damage: 1,
      specialRules: [{ name: 'Breaching', threshold: 6 }],
      traits: ['Sword of the Order'],
    }),
  ],
};

/**
 * Excindio claws (Excindio Battle-Automata / Dark Angels).
 * IM—/AM—/SM+1/AP3/D2, Breaching(5+). Reaping Blow(2) omitted.
 */
export const EXCINDIO_CLAWS: Weapon = {
  name: 'Excindio Claws',
  type: 'melee',
  profiles: [profile({
    profileName: 'Excindio Claws',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 2,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      // Reaping Blow(2) not simulated
    ],
    traits: ['Power'],
  })],
};

// ── White Scars Weapons ─────────────────────────────────────────────────────

export const POWER_GLAIVE: Weapon = {
  name: 'Power glaive',
  type: 'melee',
  profiles: [profile({
    profileName: 'Power glaive',
    initiativeModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Power'],
  })],
};

// ── Blood Angels Weapons ─────────────────────────────────────────────────────

/** Blade of Judgement (Ofanim / Blood Angels). IM—/AM—/SM+2/AP3/D1, Breaching(5+), CriticalHit(6+). */
export const BLADE_OF_JUDGEMENT: Weapon = {
  name: 'Blade of Judgement',
  type: 'melee',
  profiles: [profile({
    profileName: 'Blade of Judgement',
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'CriticalHit', threshold: 6 },
    ],
    traits: ['Power'],
  })],
};

export const BLADE_OF_PERDITION: Weapon = {
  name: 'Blade of Perdition',
  type: 'melee',
  profiles: [profile({
    profileName: 'Blade of Perdition',
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      //{ name: 'Aflame', threshold: 1 },
    ],
    traits: ['Power', 'Flame'],
  })],
};

export const AXE_OF_PERDITION: Weapon = {
  name: 'Axe of Perdition',
  type: 'melee',
  profiles: [profile({
    profileName: 'Axe of Perdition',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      //{ name: 'Aflame', threshold: 1 },
    ],
    traits: ['Power', 'Flame'],
  })],
};

export const MAUL_OF_PERDITION: Weapon = {
  name: 'Maul of Perdition',
  type: 'melee',
  profiles: [profile({
    profileName: 'Maul of Perdition',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      //{ name: 'Aflame', threshold: 1 },
    ],
    traits: ['Power', 'Flame'],
  })],
};

export const SPEAR_OF_PERDITION: Weapon = {
  name: 'Spear of Perdition',
  type: 'melee',
  profiles: [profile({
    profileName: 'Spear of Perdition',
    initiativeModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Precision', threshold: 6 },
      //{ name: 'Aflame', threshold: 1 },
    ],
    traits: ['Power', 'Flame'],
  })],
};

// ── Ultramarines Weapons ─────────────────────────────────────────────────────

/** Argean power sword (Locutarus Strike Leader / Ultramarines). IM—/AM—/SM—/AP3/D1, Breaching(5+). */
export const ARGEAN_POWER_SWORD: Weapon = {
  name: 'Argean Power Sword',
  type: 'melee',
  profiles: [profile({
    profileName: 'Argean Power Sword',
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Power'],
  })],
};

export const LEGATINE_AXE: Weapon = {
  name: 'Legatine Axe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Legatine Axe',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 4 }],
    traits: ['Power'],
  })],
};

// ── Emperor's Children Weapons ───────────────────────────────────────────────

/**
 * Phoenix power spear (Phoenix Champion / Emperor's Children).
 * IM+1/AM—/SM+1/AP3/D1, Impact(D), Breaching(6+).
 * Impact(D) is stored but the engine ignores it in the Challenge Sub-Phase
 * (charge-only bonus).
 */
export const PHOENIX_POWER_SPEAR: Weapon = {
  name: 'Phoenix Power Spear',
  type: 'melee',
  profiles: [profile({
    profileName: 'Phoenix Power Spear',
    initiativeModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Impact', modifier: { kind: 'none' } }, // charge-only, not simulated
      { name: 'Breaching', threshold: 6 },
    ],
    traits: ['Power'],
  })],
};

export const PHOENIX_RAPIER: Weapon = {
  name: 'Phoenix Rapier',
  type: 'melee',
  profiles: [profile({
    profileName: 'Phoenix Rapier',
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Impact', modifier: { kind: 'none' } }, // charge-only, not simulated
      { name: 'Breaching', threshold: 6 },
    ],
    traits: ['Power'],
  })],
};

/** Palatine blade (Palatine Prefector / Emperor's Children). IM—/AM—/SM+1/AP3/D1, Breaching(5+), DuellistsEdge(1). */
export const PALATINE_BLADE: Weapon = {
  name: 'Palatine Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Palatine Blade',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'DuellistsEdge', value: 1 },
    ],
    traits: ['Power'],
  })],
};

// ── Raven Guard Weapons ─────────────────────────────────────────────

export const RAVENS_TALON: Weapon = {
  name: 'Raven\'s Talon',
  type: 'melee',
  profiles: [profile({
    profileName: 'Raven\'s Talon',
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'Rending', threshold: 6 },
      // Impact(IM) not simulated — charge-only bonus
    ],
    traits: ['Power'],
  })],
};

export const PAIR_OF_RAVENS_TALONS: Weapon = {
  name: 'Pair of Raven\'s Talons',
  type: 'melee',
  profiles: [profile({
    profileName: 'Pair of Raven\'s Talons',
    attacksModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'Rending', threshold: 6 },
      // Impact(IM) not simulated — charge-only bonus
    ],
    traits: ['Power'],
  })],
};

// ── Iron Warriors Weapons ─────────────────────────────────────────────

export const GRAVITON_MACE: Weapon = {
  name: 'Graviton Mace',
  type: 'melee',
  profiles: [profile({
    profileName: 'Graviton Mace',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 3 },
    ap: 3, damage: 1,
    // Shock (Pinned) not simulated
    traits: ['Graviton'],
  })],
};

// ── Night Lords Weapons ─────────────────────────────────────────────

export const CHAINGLAIVE: Weapon = {
  name: 'Chainglaive',
  type: 'melee',
  profiles: [profile({
    profileName: 'Chainglaive',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'Shred', threshold: 6 },
    ],
    traits: ['Chain'],
  })],
};

export const HEADSMANS_AXE: Weapon = {
  name: 'Headsman\'s Axe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Headsman\'s Axe',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Chain'],
  })],
};

// ── World Eaters Caedere Weapons ─────────────────────────────────────────────

/**
 * Meteor hammer (Rampager Champion / World Eaters).
 * IM—/AM-1/SM+2/AP3/D2. Impact(IM) omitted — charge-only bonus.
 */
export const METEOR_HAMMER: Weapon = {
  name: 'Meteor Hammer',
  type: 'melee',
  // Impact(IM) not simulated — charge-only bonus
  profiles: [profile({
    profileName: 'Meteor Hammer',
    attacksModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 2,
    traits: ['Power'],
  })],
};

/** Excoriator chainaxe (Rampager Champion / World Eaters). IM-2/AM—/SM+2/AP3/D1, Breaching(6+), Shred(6+). */
export const EXCORIATOR_CHAINAXE: Weapon = {
  name: 'Excoriator Chainaxe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Excoriator Chainaxe',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'Shred', threshold: 6 },
    ],
    traits: ['Chain'],
  })],
};

/** Paired falax blades (Rampager Champion / World Eaters). IM—/AM+2/SM—/AP3/D1. */
export const PAIRED_FALAX_BLADES: Weapon = {
  name: 'Paired Falax Blades',
  type: 'melee',
  profiles: [profile({
    profileName: 'Paired Falax Blades',
    attacksModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    traits: ['Power'],
  })],
};

/**
 * Barb-hook lash (Rampager Champion / World Eaters).
 * IM+1/AM—/SM—/AP3/D1, CriticalHit(6+), Phage(S).
 */
export const BARB_HOOK_LASH: Weapon = {
  name: 'Barb-hook Lash',
  type: 'melee',
  profiles: [profile({
    profileName: 'Barb-hook Lash',
    initiativeModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      { name: 'Phage', characteristic: 'S' },
    ],
    traits: ['Power'],
  })],
};

// ── Word Bearers Weapons ─────────────────────────────────────────────────────

/**
 * Anakatis blade (Anakatis Kul / Word Bearers).
 * IM—/AM—/SM—/AP3/D2, Breaching(6+), Phage(S).
 */
export const ANAKATIS_BLADE: Weapon = {
  name: 'Anakatis Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Anakatis Blade',
    ap: 3, damage: 2,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'Phage', characteristic: 'S' },
    ],
    traits: ['Psychic'],
  })],
};

// ── Death Guard Weapons ─────────────────────────────────────────────────────

export const POWER_SCYTHE: Weapon = {
  name: 'Power Scythe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Power Scythe',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      // ReapingBlow(2) not simulated — established pattern
    ],
    traits: ['Power'],
  })],
};

// ── The Thousand Sons Weapons ─────────────────────────────────────────────────────

export const ACHEA_PATTERN_FORCE_SWORD: Weapon = {
  name: 'Achea pattern force sword',
  type: 'melee',
  profiles: [profile({
    profileName: 'Achea pattern force sword',
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Psychic'],
  })],
};

// ── Sons of Horus Weapons ─────────────────────────────────────────────────────

export const CARSORAN_POWER_AXE: Weapon = {
  name: 'Carsoran Power Axe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Carsoran Power Axe',
    initiativeModifier: { kind: 'add', value: -1 },
    strengthModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'Shred', threshold: 6 },
    ],
    traits: ['Power'],
  })],
};

export const CARSORAN_POWER_TABAR: Weapon = {
  name: 'Carsoran Power Tabar',
  type: 'melee',
  profiles: [profile({
    profileName: 'Carsoran Power Tabar',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'Shred', threshold: 5 },
    ],
    traits: ['Power'],
  })],
};

// ── Alpha Legion Weapons ─────────────────────────────────────────────────────

export const POWER_DAGGER: Weapon = {
  name: 'Power Dagger',
  type: 'melee',
  profiles: [profile({
    profileName: 'Power Dagger',
    initiativeModifier: { kind: 'add', value: 2 },
    strengthModifier: { kind: 'add', value: -1 },
    ap: 3, damage: 1,
    specialRules: [{ name: 'Breaching', threshold: 5 }],
    traits: ['Power'],
  })],
};
