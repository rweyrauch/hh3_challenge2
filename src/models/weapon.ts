/**
 * Weapon model types.
 *
 * Melee weapons have three modifier characteristics (IM, AM, SM) that work
 * as follows:
 *   - kind:'none'  → the weapon uses the model's base characteristic unchanged
 *   - kind:'add'   → adds/subtracts a fixed number (e.g., +2S means SM = {add,2})
 *   - kind:'fixed' → replaces the model's characteristic entirely (e.g., IM:-3)
 *   - kind:'mult'  → multiplies by a fixed number (e.g., x2S means SM = {mult,2})
 */
export type CharModifier =
  | { kind: 'none' }
  | { kind: 'add'; value: number }
  | { kind: 'fixed'; value: number }
  | { kind: 'mult'; value: number };

/**
 * Named type aliases to distinguish the three modifier slots; they share the
 * same structure but live on separate fields to avoid mix-ups.
 */
export type InitiativeModifier = CharModifier;
export type StrengthModifier = CharModifier;
export type AttacksModifier = CharModifier;

/** Special rules that directly affect challenge combat resolution. */
export type SpecialRule =
  | { name: 'DuellistsEdge'; value: number }      // +X to Focus Roll
  | { name: 'CriticalHit'; threshold: number }  // hit becomes a Critical Hit when roll ≥ threshold (auto-wounds, +1D)
  | { name: 'EternalWarrior'; value: number }      // reduce unsaved wound damage by X (min 1)
  | { name: 'Rending'; threshold: number }  // AP 2 on roll ≥ threshold
  | { name: 'Impact'; modifier: CharModifier } // bonus attacks on charge (out of scope for Challenge)
  | { name: 'LightningBlows' }                        // no direct effect in Challenge
  | { name: 'Hatred'; target: string }      // +1 to Wound Tests vs target
  | { name: 'Fear'; value: number }       // out of scope for Challenge
  | { name: 'Shred'; threshold: number }   // +1 Damage on wound roll ≥ threshold
  | { name: 'Breaching'; threshold: number }   // ignore armour on roll ≥ threshold
  | { name: 'Precision'; threshold: number }   // allocate wound to specific model
  | { name: 'Bulky'; value: number }       // counts as X models; used by Angelic Descent
  | { name: 'FeelNoPain'; threshold: number }  // ignore unsaved wound on roll ≥ threshold
  | { name: 'Poisoned'; threshold: number }   // wound always on roll ≥ threshold (ignores S vs T comparison)
  | { name: 'PraeternaturalResilience' }              // CriticalHit(X) attacks against this model use X=6 (raises threshold to 6+)
  | { name: 'SublimeSwordsman' }                      // +1A per point this model's Base I exceeds opponent's, when this model has Challenge Advantage
  | { name: 'Force'; characteristic: 'S' | 'A' | 'D' | 'AP' | 'I' | 'WS' }  // WP check (2d6≤WP): doubles characteristic X; doubles trigger Perils of the Warp
  | { name: 'Armourbane' }              // AP 1 vs vehicles; infantry get no benefit — logged only
  | { name: 'Deflagrate'; value: number }  // unsaved wounds generate extra S(X)/AP-/D1 hits
  | { name: 'Psyker' };              // marks model as a Psyker for Hatred(Psykers) targeting
// Rules intentionally not simulated:
//   Bypass(X+) — Phase sword's bypass of all saves; omitted (no Bypass special rule added)
//   Phage(S)   — established pattern (daemon weapons); omit from profiles
//   Reaping Blow(X) — established pattern; no effect in Challenge
//   Aflame(X), Limited(X) — combat rules outside Challenge scope

/** A single attack profile for a melee weapon. */
export interface WeaponProfile {
  profileName: string;
  initiativeModifier: InitiativeModifier;
  attacksModifier: AttacksModifier;
  strengthModifier: StrengthModifier;
  /** Armour Penetration value (lower = better). null means AP '-' (no AP). */
  ap: number | null;
  damage: number;
  specialRules: SpecialRule[];
  /** Free-form trait keywords (e.g. 'Sword of the Order', 'Power'). */
  traits?: string[];
  /**
   * If true, roll a D3 at the start of the attack sequence and add it to
   * the Attacks total (after applying the attacksModifier).
   * Used by Conflagration (6+D3 attacks).
   */
  attacksExtraD3?: boolean;
}

/** A weapon, which may have multiple profiles (e.g., melee + ranged). */
export interface Weapon {
  name: string;
  type: 'melee' | 'ranged';
  /** Only melee profiles are used in Challenges. */
  profiles: WeaponProfile[];
}

/**
 * Return true if this weapon profile qualifies for the Dark Angels
 * 'Sword of the Order' gambit — i.e., it carries the 'Sword of the Order'
 * trait, or its profile name contains 'sword' (covers Power Sword, Chainsword,
 * Terranic Greatsword, etc.).
 */
export function isSwordProfile(profile: WeaponProfile): boolean {
  if (profile.traits?.includes('Sword of the Order')) return true;
  return profile.profileName.toLowerCase().includes('sword');
}
