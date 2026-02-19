/**
 * Loyalist Legion faction-specific Gambits.
 *
 * Covers Dark Angels, White Scars, Space Wolves, Imperial Fists,
 * Blood Angels, Iron Hands, Ultramarines, Salamanders, and Raven Guard.
 *
 * Note: Emperor's Children loyalist characters (Saul Tarvitz) use the
 * Emperor's Children gambit defined in traitorLegions.ts.
 */
import type { Gambit } from '../../models/gambit.js';

// ── Dark Angels (I) ──────────────────────────────────────────────────────────

export const DARK_ANGELS_GAMBITS: Gambit[] = [
  {
    id: 'sword-of-the-order',
    name: 'Sword of the Order',
    description: 'If using a sword weapon (chainsword, power sword, or Sword of the Order trait), that weapon\'s Attacks Modifier is reduced by 1 and it gains Critical Hit(6+), or improves an existing Critical Hit by +1.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'the-lions-choler',
    name: 'The Lion\'s Choler',
    description: 'Only selectable when this model has 2 or fewer Wounds remaining. Adds +2 to the Focus Roll and this model does not suffer negative modifiers for Wounds lost.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── White Scars (V) ──────────────────────────────────────────────────────────

export const WHITE_SCARS_GAMBITS: Gambit[] = [
  {
    id: 'the-path-of-the-warrior',
    name: 'The Path of the Warrior',
    description: 'Before rolling, predict whether the Focus Roll result (before modifiers) will be 1–3 (Strike Low) or 4–6 (Strike High). If correct, ignore all negative modifiers to that Focus Roll.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'death-by-a-thousand-cuts',
    name: 'Death by a Thousand Cuts',
    description: 'During the Strike Step, the Strength of attacks made by the enemy model are reduced by 1 if that model\'s Wounds have been reduced from its Base value. Cannot reduce enemy Strength below 1.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Space Wolves (VI) ────────────────────────────────────────────────────────

export const SPACE_WOLVES_GAMBITS: Gambit[] = [
  {
    id: 'no-prey-escapes',
    name: 'No Prey Escapes',
    description: 'The opposing player may not choose to move to the Glory Step until one or both models are removed as Casualties.',
    timings: ['glory'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'a-saga-woven-of-glory',
    name: 'A Saga Woven of Glory',
    description: 'If this model wins the Challenge while this Gambit is selected and the opposing model is removed as a Casualty, all models in the same unit gain +1 Attack in the following Fight Sub-Phase. (No effect in a 1v1 duel.)',
    timings: ['glory'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'howl-of-the-death-wolf',
    name: 'Howl of the Death Wolf',
    description: 'Once per battle. Once selected, no other Gambit may be chosen for this model. Adds +5 to Focus Rolls each successive round until this model fails to inflict an Unsaved Wound in the Strike Step.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Imperial Fists (VII) ─────────────────────────────────────────────────────

export const IMPERIAL_FISTS_GAMBITS: Gambit[] = [
  {
    id: 'a-wall-unyielding',
    name: 'A Wall Unyielding',
    description: 'This model does not add its Combat Initiative to the Focus Roll, but gains Eternal Warrior(1) for the duration of the following Strike Step.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'deaths-champion',
    name: 'Death\'s Champion',
    description: 'All attacks made by this model in the following Strike Step gain the Critical Hit(5+) Special Rule.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'executioners-tax',
    name: 'Executioner\'s Tax',
    description: 'Roll an additional die in the Focus Step and discard the highest result. Attacks made in the following Strike Step gain the Critical Hit(6+) Special Rule.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Blood Angels (IX) ────────────────────────────────────────────────────────

export const BLOOD_ANGELS_GAMBITS: Gambit[] = [
  {
    id: 'thrall-of-the-red-thirst',
    name: 'Thrall of the Red Thirst',
    description: 'This model ignores negative Focus Roll modifiers for Wounds lost, and each wound inflicted on the opponent has its Damage increased by +1. This model gains no bonus from Outside Support.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'angelic-descent',
    name: 'Angelic Descent',
    description: 'Only selectable before the first Focus Roll if this model charged this Assault Phase. Gain a positive Focus modifier equal to the enemy model\'s Bulky(X) value.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Iron Hands (X) ───────────────────────────────────────────────────────────

export const IRON_HANDS_GAMBITS: Gambit[] = [
  {
    id: 'legion-of-one',
    name: 'Legion of One',
    description: 'This model gains double the normal Outside Support bonus to Focus Roll. The opponent\'s Outside Support bonus is capped at +2. (No effect in a 1v1 duel where Outside Support is 0.)',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'tempered-by-war',
    name: 'Tempered by War',
    description: 'This model\'s Toughness Characteristic is set to 8 for the duration of the following Strike Step.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Ultramarines (XIII) ──────────────────────────────────────────────────────

export const ULTRAMARINES_GAMBITS: Gambit[] = [
  {
    id: 'aegis-of-wisdom',
    name: 'Aegis of Wisdom',
    description: 'Instead of the normal Outside Support bonus, gain +1 to the Focus Roll for every friendly Command Ultramarines model on the Battlefield (excluding this model). (No effect in a 1v1 duel.)',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'calculating-swordsman',
    name: 'Calculating Swordsman',
    description: 'Gain a positive modifier to the Focus Roll equal to the current Battle Round number, to a maximum of +4.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Salamanders (XVIII) ──────────────────────────────────────────────────────

export const SALAMANDERS_GAMBITS: Gambit[] = [
  {
    id: 'duty-is-sacrifice',
    name: 'Duty is Sacrifice',
    description: 'Choose to add +1, +2, or +3 to your Focus Roll. In the opponent\'s Strike Step, this model suffers an equal number of automatic wounds (AP5, no Cover Saves) against which normal Saves may be taken.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Raven Guard (XIX) ────────────────────────────────────────────────────────

export const RAVEN_GUARD_GAMBITS: Gambit[] = [
  {
    id: 'decapitation-strike',
    name: 'Decapitation Strike',
    description: 'Once per Challenge. No Focus Roll is made. Instead, make a single attack at the end of the Focus Step. If both the Hit and Wound Tests succeed, make the remaining attacks in the Strike Step minus this one. If either fails, make no further attacks this Strike Step.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
  {
    id: 'the-shadowed-lord',
    name: 'The Shadowed Lord',
    description: 'Must select Talonis at the start of the Focus Step. Ignore negative Focus Roll modifiers for Wounds lost. If the Active Player and scored at least one hit with Talonis, may choose to move to the Glory Step after both Strike Steps resolve.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Combined export ──────────────────────────────────────────────────────────

export const LOYALIST_LEGION_GAMBITS: Gambit[] = [
  ...DARK_ANGELS_GAMBITS,
  ...WHITE_SCARS_GAMBITS,
  ...SPACE_WOLVES_GAMBITS,
  ...IMPERIAL_FISTS_GAMBITS,
  ...BLOOD_ANGELS_GAMBITS,
  ...IRON_HANDS_GAMBITS,
  ...ULTRAMARINES_GAMBITS,
  ...SALAMANDERS_GAMBITS,
  ...RAVEN_GUARD_GAMBITS,
];
