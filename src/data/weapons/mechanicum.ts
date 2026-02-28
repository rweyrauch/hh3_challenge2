/**
 * Melee weapons for Mechanicum characters.
 *
 * Notes on rules not simulated:
 *   Shock (Pinning/Stunned/Suppressed) — status effects outside Challenge scope
 *   Armourbane — affects vehicles only, not relevant in Challenge
 */
import { type Weapon, profile } from '../../models/weapon.js';

/** The Vodian Sceptre — Anacharis Scoria's signature two-handed sceptre */
export const VODIAN_SCEPTRE: Weapon = {
  name: 'The Vodian Sceptre',
  type: 'melee',
  profiles: [profile({
    profileName: 'The Vodian Sceptre',
    initiativeModifier: { kind: 'add', value: -1 },
    attacksModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 3 },
    ap: 2, damage: 2,
    // Shock (Pinning, Stunned, Suppressed) not simulated
  })],
};

/** Scorian talons — natural weapons of Anacharis Scoria; AP2/D2 with CriticalHit(6+) */
export const SCORIAN_TALONS: Weapon = {
  name: 'Scorian talons',
  type: 'melee',
  profiles: [profile({
    profileName: 'Scorian talons',
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  })],
};

/** Pair of Arc scourges — AM+1/SM+2/AP3/D2 */
export const ARC_SCOURGES: Weapon = {
  name: 'Pair of Arc scourges',
  type: 'melee',
  profiles: [profile({
    profileName: 'Pair of Arc scourges',
    attacksModifier: { kind: 'add', value: 1 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 3, damage: 2,
    // Shock (Suppressed) not simulated
  })],
};
