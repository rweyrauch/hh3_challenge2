import type { Weapon, SpecialRule } from './weapon.js';
import type { GambitId } from './gambit.js';

/** Sub-types that a model may have in addition to its primary Type. */
export type ModelSubType =
  | 'Command'
  | 'Champion'
  | 'Heavy'
  | 'Light'
  | 'Paragon';

/** The numeric stats used in Challenge resolution. */
export interface CharacterStats {
  M:   number;  // Movement      (not used in Challenge)
  WS:  number;  // Weapon Skill
  BS:  number;  // Ballistic Skill (not used in Challenge)
  S:   number;  // Strength
  T:   number;  // Toughness
  W:   number;  // Wounds
  I:   number;  // Initiative
  A:   number;  // Attacks
  LD:  number;  // Leadership
  CL:  number;  // Cool           (not used in Challenge)
  WP:  number;  // Willpower      (not used in Challenge)
  IN:  number;  // Intelligence   (not used in Challenge)
  Sv:  number;  // Armour Save    (e.g. 3 means 3+)
  Inv: number | null;  // Invulnerable Save, null = '-'
}

/** A playable character that can participate in a Challenge. */
export interface Character {
  /** Unique identifier, e.g. 'constantin-valdor'. */
  id: string;
  name: string;
  /** Top-level faction trait, e.g. 'legio-custodes' or 'orks'. */
  faction: string;
  /**
   * Sub-faction / clan trait if applicable (e.g., 'goffs', 'blood-axes').
   * Only used for Orks to determine which faction gambit is available.
   */
  subFaction?: string;
  /**
   * Primary type of the model.  In the Challenge simulator only non-Vehicle,
   * non-Walker types are supported.
   */
  type: 'infantry' | 'cavalry' | 'paragon';
  subTypes: ModelSubType[];
  stats: CharacterStats;
  /** All weapons available to this model; only melee profiles are used. */
  weapons: Weapon[];
  /** GambitIds for faction-specific gambits this model may select. */
  factionGambitIds: GambitId[];
  /** Model-level special rules relevant to Challenge resolution. */
  specialRules: SpecialRule[];
  /**
   * If set, this gambit is always selected in the Face-Off step; no other
   * gambit is allowed, and Feint & Riposte cannot prevent it.
   * Used by the Eversor ('biological-overload') and Adamus ('mirror-form') assassins.
   */
  mandatoryGambitId?: GambitId;
}
