/**
 * Daemon weapons for Daemons of the Ruinstorm characters.
 *
 * Sources: Daemons of the Ruinstorm — Armoury of the Ruinstorm Daemons.
 *
 * Note on Reaping Blow(X): per the rules, this special rule has no effect
 * during the Challenge Sub-Phase. Omitted from profiles.
 */
import { type Weapon, profile } from '../../models/weapon.js';

// ── Generic daemon melee weapons ─────────────────────────────────────────────

/** Sovereign blade: I, A, S, AP2, D2, Phage(S) [Reaping Blow(1) — no effect in Challenge] */
export const SOVEREIGN_BLADE: Weapon = {
  name: 'Sovereign Blade',
  type: 'melee',
  // Phage(S) not simulated; Reaping Blow no-op in Challenge
  profiles: [profile({ 
    profileName: 'Sovereign Blade', 
    ap: 2, damage: 2, 
    specialRules: [{ name: 'Phage', characteristic: 'S' }], 
    traits: ['Immaterial'] })],
};

/** Sovereign greatblade: -2I, A, +3S, AP2, D3, Phage(S) [Reaping Blow(2) — no effect in Challenge] */
export const SOVEREIGN_GREATBLADE: Weapon = {
  name: 'Sovereign Greatblade',
  type: 'melee',
  // Phage(S) not simulated; Reaping Blow no-op in Challenge
  profiles: [profile({
    profileName: 'Sovereign Greatblade',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 3 },
    ap: 2, damage: 3,
    specialRules: [{ name: 'Phage', characteristic: 'S' }],
    traits: ['Immaterial'],
  })],
};

/** Hierarch blade: I, A, S, AP2, D2, Duellist's Edge(1), Critical Hit(6+) */
export const HIERARCH_BLADE: Weapon = {
  name: 'Hierarch Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Hierarch Blade',
    ap: 2, damage: 2,
    specialRules: [
      { name: 'DuellistsEdge', value: 1 },
      { name: 'CriticalHit', threshold: 6 },
    ],
    traits: ['Immaterial'],
  })],
};

/** Hierarch greatblade: -2I, A, +2S, AP2, D2, Critical Hit(5+) */
export const HIERARCH_GREATBLADE: Weapon = {
  name: 'Hierarch Greatblade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Hierarch Greatblade',
    initiativeModifier: { kind: 'add', value: -2 },
    strengthModifier: { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Immaterial'],
  })],
};

/** Harbinger blade: I, A, S, AP3, D1, Breaching(5+), Shred(6+) */
export const HARBINGER_BLADE: Weapon = {
  name: 'Harbinger Blade',
  type: 'melee',
  profiles: [profile({
    profileName: 'Harbinger Blade',
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'Shred', threshold: 6 },
    ],
    traits: ['Immaterial'],
  })],
};

// ── Named character weapons ───────────────────────────────────────────────────

/** Baneaxe (Ka'bandha): I, A, S, AP2, D2, Critical Hit(5+) */
export const BANEAXE: Weapon = {
  name: 'Baneaxe',
  type: 'melee',
  profiles: [profile({
    profileName: 'Baneaxe',
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
    traits: ['Immaterial'],
  })],
};

/** Reaping Claws (Cor'bax Utterblight): I, A, S, AP3, D2, Breaching(6+) [Reaping Blow(2) — no effect in Challenge] */
export const REAPING_CLAWS: Weapon = {
  name: "Reaping Claws",
  type: 'melee',
  profiles: [profile({
    profileName: 'Reaping Claws',
    ap: 3, damage: 2,
    specialRules: [{ name: 'Breaching', threshold: 6 }],
    traits: ['Immaterial'],
  })],
};

/** Blade of Samus: I, A, S, AP2, D2, Critical Hit(6+) */
export const BLADE_OF_SAMUS: Weapon = {
  name: 'Blade of Samus',
  type: 'melee',
  profiles: [profile({
    profileName: 'Blade of Samus',
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
    traits: ['Immaterial'],
  })],
};
