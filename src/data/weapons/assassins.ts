/**
 * Divisio Assassinorum melee weapon profiles.
 *
 * Stat sources: Legio Custodes army list (Divisio Assassinorum section).
 *
 * Rules intentionally omitted from simulation:
 *   Bypass(6+)   — Phase sword: bypasses all saves; too complex for Challenge scope
 *   Aflame(2)    — Psyk-out bombs: combat fire effect; outside Challenge scope
 *   Limited(3)   — Psyk-out bombs: use limit; outside Challenge scope
 *   The Venom    — Hookfang secondary Poisoned effect; omitted
 */
import { type Weapon, profile } from '../../models/weapon.js';

/** Neuro-gauntlet (Eversor Assassin). IM+1/AM+1/SM—/AP3/D2. */
export const NEURO_GAUNTLET: Weapon = {
  name: 'Neuro-gauntlet',
  type: 'melee',
  profiles: [profile({
    profileName: 'Neuro-gauntlet',
    initiativeModifier: { kind: 'add', value: 1 },
    attacksModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 2,
    specialRules: [
      { name: 'Rending', threshold: 4 },
      { name: 'Poisoned', threshold: 4 },
    ],
  })],
};

/**
 * Phase sword (Callidus Assassin). IM+2/AM—/SM—/AP2/D1.
 * Precision(5+), Rending(6+).
 * Bypass(6+) — bypasses all saves — is NOT simulated.
 */
export const PHASE_SWORD: Weapon = {
  name: 'Phase Sword',
  type: 'melee',
  profiles: [profile({
    profileName: 'Phase Sword',
    initiativeModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 1,
    specialRules: [
      { name: 'Precision', threshold: 5 },
      { name: 'Rending', threshold: 6 },
      // Bypass(6+) not simulated — Phase sword would bypass all saves on 6+;
      // this effect is outside the scope of the Challenge simulator.
    ],
    traits: ['Power'],
  })],
};

/**
 * Psyk-out bombs (Culexus Assassin). Fixed AM:3 Fixed SM:5/AP3/D2.
 * Aflame(2) and Limited(3) are omitted — outside Challenge scope.
 */
export const PSYK_OUT_BOMBS: Weapon = {
  name: 'Psyk-out Bombs',
  type: 'melee',
  // Aflame(2) and Limited(3) not simulated
  profiles: [profile({
    profileName: 'Psyk-out Bombs',
    attacksModifier: { kind: 'fixed', value: 3 },
    strengthModifier: { kind: 'fixed', value: 5 },
    ap: 3, damage: 2,
  })],
};

/** Nemesii blade (Adamus Assassin). IM—/AM—/SM—/AP2/D1, CriticalHit(5+), Shred(5+). */
export const NEMESII_BLADE: Weapon = {
  name: 'Nemesii Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Nemesii Blade',
    ap: 2, damage: 1,
    specialRules: [
      { name: 'CriticalHit', threshold: 5 },
      { name: 'Shred', threshold: 5 },
    ],
  })],
};

/**
 * Hookfang (Venenum Assassin). IM+1/AM—/SM—/AP3/D1, Rending(6+), Precision(2+).
 * The Venom secondary effect is NOT simulated.
 */
export const HOOKFANG: Weapon = {
  name: 'Hookfang',
  type: 'melee',
  profiles: [profile({
    profileName: 'Hookfang',
    initiativeModifier: { kind: 'add', value: 1 },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Rending', threshold: 6 },
      { name: 'Precision', threshold: 2 },
      // The Venom (Poisoned secondary effect) not simulated
    ],
  })],
};
