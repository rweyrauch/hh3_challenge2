/**
 * Daemon weapons for Daemons of the Ruinstorm characters.
 *
 * Sources: Daemons of the Ruinstorm — Armoury of the Ruinstorm Daemons.
 *
 * Note on Phage(S): the Sovereign blade and greatblade carry Phage(S), which
 * reduces the enemy's Strength by 1 per unsaved wound. The challenge engine
 * only models Phage(T); Phage(S) is noted in comments but not simulated.
 *
 * Note on Reaping Blow(X): per the rules, this special rule has no effect
 * during the Challenge Sub-Phase. Omitted from profiles.
 */
import type { Weapon } from '../../models/weapon.js';

// ── Generic daemon melee weapons ─────────────────────────────────────────────

/** Sovereign blade: I, A, S, AP2, D2 [Phage(S) — not simulated; Reaping Blow(1) — no effect in Challenge] */
export const SOVEREIGN_BLADE: Weapon = {
  name: 'Sovereign Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Sovereign Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [],  // Phage(S) not simulated; Reaping Blow no-op in Challenge
  }],
};

/** Sovereign greatblade: -2I, A, +3S, AP2, D3 [Phage(S) — not simulated; Reaping Blow(2) — no effect in Challenge] */
export const SOVEREIGN_GREATBLADE: Weapon = {
  name: 'Sovereign Greatblade',
  type: 'melee',
  profiles: [{
    profileName: 'Sovereign Greatblade',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 3 },
    ap: 2, damage: 3,
    specialRules: [],  // Phage(S) not simulated; Reaping Blow no-op in Challenge
  }],
};

/** Hierarch blade: I, A, S, AP2, D2, Duellist's Edge(1), Critical Hit(6+) */
export const HIERARCH_BLADE: Weapon = {
  name: 'Hierarch Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Hierarch Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [
      { name: 'DuellistsEdge', value: 1 },
      { name: 'CriticalHit',   threshold: 6 },
    ],
  }],
};

/** Hierarch greatblade: -2I, A, +2S, AP2, D2, Critical Hit(5+) */
export const HIERARCH_GREATBLADE: Weapon = {
  name: 'Hierarch Greatblade',
  type: 'melee',
  profiles: [{
    profileName: 'Hierarch Greatblade',
    initiativeModifier: { kind: 'add', value: -2 },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'add', value: 2 },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** Harbinger blade: I, A, S, AP3, D1, Breaching(5+), Shred(6+) */
export const HARBINGER_BLADE: Weapon = {
  name: 'Harbinger Blade',
  type: 'melee',
  profiles: [{
    profileName: 'Harbinger Blade',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 1,
    specialRules: [
      { name: 'Breaching', threshold: 5 },
      { name: 'Shred',     threshold: 6 },
    ],
  }],
};

// ── Named character weapons ───────────────────────────────────────────────────

/** Baneaxe (Ka'bandha): I, A, S, AP2, D2, Critical Hit(5+) */
export const BANEAXE: Weapon = {
  name: 'Baneaxe',
  type: 'melee',
  profiles: [{
    profileName: 'Baneaxe',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 5 }],
  }],
};

/** Reaping Claws (Cor'bax Utterblight): I, A, S, AP3, D2, Breaching(6+) [Reaping Blow(2) — no effect in Challenge] */
export const REAPING_CLAWS: Weapon = {
  name: "Reaping Claws",
  type: 'melee',
  profiles: [{
    profileName: 'Reaping Claws',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 3, damage: 2,
    specialRules: [{ name: 'Breaching', threshold: 6 }],
  }],
};

/** Blade of Samus: I, A, S, AP2, D2, Critical Hit(6+) */
export const BLADE_OF_SAMUS: Weapon = {
  name: 'Blade of Samus',
  type: 'melee',
  profiles: [{
    profileName: 'Blade of Samus',
    initiativeModifier: { kind: 'none' },
    attacksModifier:    { kind: 'none' },
    strengthModifier:   { kind: 'none' },
    ap: 2, damage: 2,
    specialRules: [{ name: 'CriticalHit', threshold: 6 }],
  }],
};
