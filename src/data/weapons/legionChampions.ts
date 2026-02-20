/**
 * Melee weapon profiles specific to Legion Champion-sub-type units.
 *
 * Stat sources: Legiones Astartes army list.
 *
 * Rules intentionally omitted:
 *   Reaping Blow(X) — established pattern; no effect in Challenge Sub-Phase
 *   Impact(X)       — charge-only bonus; no effect in Challenge Sub-Phase
 *   Phage(S)        — established pattern (daemon weapons); omit from profiles
 *   Force(D)        — Force staff psychic instakill; outside Challenge scope
 */
import type { Weapon } from '../../models/weapon.js';

// ── Space Wolves Frost Weapons ───────────────────────────────────────────────

/** Frost axe. IM-1/AM—/SM+1/AP3/D1, Breaching(4+). Reaping Blow(1) omitted. */
export const FROST_AXE: Weapon = {
  name: 'Frost Axe',
  type: 'melee',
  profiles: [{
    profileName: 'Frost Axe',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 4 },
      // Reaping Blow(1) not simulated
    ],
  }],
};

/** Frost sword. IM+1/AM—/SM—/AP3/D1, Breaching(5+). Reaping Blow(1) omitted. */
export const FROST_SWORD: Weapon = {
  name: 'Frost Sword',
  type: 'melee',
  profiles: [{
    profileName: 'Frost Sword',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      // Reaping Blow(1) not simulated
    ],
  }],
};

/** Frost claw. IM—/AM—/SM—/AP3/D1, Breaching(4+), Shred(6+). Reaping Blow(1) omitted. */
export const FROST_CLAW: Weapon = {
  name: 'Frost Claw',
  type: 'melee',
  profiles: [{
    profileName: 'Frost Claw',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 4 },
      { name: 'Shred',     threshold: 6 },
      // Reaping Blow(1) not simulated
    ],
  }],
};

/** Great frost blade. IM-2/AM—/SM+3/AP2/D2. Reaping Blow(1) omitted. */
export const GREAT_FROST_BLADE: Weapon = {
  name: 'Great Frost Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Great Frost Blade',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    specialRules: [],
    // Reaping Blow(1) not simulated
  }],
};

// ── Dark Angels Weapons ──────────────────────────────────────────────────────

/**
 * Calibanite charge-blade (Firewing Enigmatii / Dark Angels).
 * Two profiles: Uncharged and Charged. Player selects one per engagement.
 * Both profiles have the Sword of the Order trait (sword keyword for DA gambit).
 */
export const CALIBANITE_CHARGE_BLADE: Weapon = {
  name: 'Calibanite Charge-blade',
  type: 'melee',
  profiles: [
    {
      profileName: 'Uncharged',
      initiativeModifier: { kind: 'add', value: 2 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'none' },
      ap: 4, damage: 1,
      specialRules: [],
    },
    {
      profileName: 'Charged',
      initiativeModifier: { kind: 'add', value: -1 },
      attacksModifier:    { kind: 'none' },
      strengthModifier:   { kind: 'add', value: 1 },
      ap: 3, damage: 1,
      specialRules: [
        { name: 'Breaching', threshold: 6 },
      ],
    },
  ],
};

/**
 * Excindio claws (Excindio Battle-Automata / Dark Angels).
 * IM—/AM—/SM+1/AP3/D2, Breaching(5+). Reaping Blow(2) omitted.
 */
export const EXCINDIO_CLAWS: Weapon = {
  name: 'Excindio Claws',
  type: 'melee',
  profiles: [{
    profileName: 'Excindio Claws',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 2,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      // Reaping Blow(2) not simulated
    ],
  }],
};

// ── Blood Angels Weapons ─────────────────────────────────────────────────────

/** Blade of Judgement (Ofanim / Blood Angels). IM—/AM—/SM+2/AP3/D1, Breaching(5+), CriticalHit(6+). */
export const BLADE_OF_JUDGEMENT: Weapon = {
  name: 'Blade of Judgement',
  type: 'melee',
  profiles: [{
    profileName: 'Blade of Judgement',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching',   threshold: 5 },
      { name: 'CriticalHit', threshold: 6 },
    ],
  }],
};

// ── Ultramarines Weapons ─────────────────────────────────────────────────────

/** Argean power sword (Locutarus Strike Leader / Ultramarines). IM—/AM—/SM—/AP3/D1, Breaching(5+). */
export const ARGEAN_POWER_SWORD: Weapon = {
  name: 'Argean Power Sword',
  type: 'melee',
  profiles: [{
    profileName: 'Argean Power Sword',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
    ],
  }],
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
  profiles: [{
    profileName: 'Phoenix Power Spear',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Impact',    modifier: { kind: 'none' } }, // charge-only, not simulated
      { name: 'Breaching', threshold: 6 },
    ],
  }],
};

/** Palatine blade (Palatine Prefector / Emperor's Children). IM—/AM—/SM+1/AP3/D1, Breaching(5+), DuellistsEdge(1). */
export const PALATINE_BLADE: Weapon = {
  name: 'Palatine Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Palatine Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching',    threshold: 5 },
      { name: 'DuellistsEdge', value: 1 },
    ],
  }],
};

// ── World Eaters Caedere Weapons ─────────────────────────────────────────────

/**
 * Meteor hammer (Rampager Champion / World Eaters).
 * IM—/AM-1/SM+2/AP3/D2. Impact(IM) omitted — charge-only bonus.
 */
export const METEOR_HAMMER: Weapon = {
  name: 'Meteor Hammer',
  type: 'melee',
  profiles: [{
    profileName: 'Meteor Hammer',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'add', value: -1 },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 3, damage: 2,
    specialRules: [],
    // Impact(IM) not simulated — charge-only bonus
  }],
};

/** Excoriator chainaxe (Rampager Champion / World Eaters). IM-2/AM—/SM+2/AP3/D1, Breaching(6+), Shred(6+). */
export const EXCORIATOR_CHAINAXE: Weapon = {
  name: 'Excoriator Chainaxe',
  type: 'melee',
  profiles: [{
    profileName: 'Excoriator Chainaxe',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      { name: 'Shred',     threshold: 6 },
    ],
  }],
};

/** Paired falax blades (Rampager Champion / World Eaters). IM—/AM+2/SM—/AP3/D1. */
export const PAIRED_FALAX_BLADES: Weapon = {
  name: 'Paired Falax Blades',
  type: 'melee',
  profiles: [{
    profileName: 'Paired Falax Blades',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'add', value: 2 },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [],
  }],
};

/**
 * Barb-hook lash (Rampager Champion / World Eaters).
 * IM+1/AM—/SM—/AP3/D1, CriticalHit(6+). Phage(S) omitted.
 */
export const BARB_HOOK_LASH: Weapon = {
  name: 'Barb-hook Lash',
  type: 'melee',
  profiles: [{
    profileName: 'Barb-hook Lash',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 6 },
      // Phage(S) not simulated — established pattern
    ],
  }],
};

// ── Word Bearers Weapons ─────────────────────────────────────────────────────

/**
 * Anakatis blade (Anakatis Kul / Word Bearers).
 * IM—/AM—/SM—/AP3/D2, Breaching(6+). Phage(S) omitted.
 */
export const ANAKATIS_BLADE: Weapon = {
  name: 'Anakatis Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Anakatis Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 2,
    specialRules: [
      { name: 'Breaching', threshold: 6 },
      // Phage(S) not simulated — established pattern
    ],
  }],
};
