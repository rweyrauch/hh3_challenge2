/**
 * Traitor Legion faction-specific Gambits.
 *
 * Covers Emperor's Children, Iron Warriors, Night Lords, World Eaters,
 * Death Guard, Thousand Sons, Sons of Horus, Word Bearers, and Alpha Legion.
 *
 * Note: The Emperor's Children gambit is also available to Saul Tarvitz
 * (a loyalist Emperor's Children character).
 */
import type { Gambit } from '../../models/gambit.js';

// ── Emperor's Children (III) ─────────────────────────────────────────────────

export const EMPERORS_CHILDREN_GAMBITS: Gambit[] = [
  {
    id: 'paragon-of-excellence',
    name: 'Paragon of Excellence',
    description: 'Only selectable during the first Face-Off Step of a Challenge. Adds +2 to the Focus Roll. (Captain Lucius gains +4 instead due to The Faultless Blade.)',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
  {
    id: 'bite-of-the-betrayed',
    name: 'Bite of the Betrayed',
    description: 'Only selectable during the first Face-Off Step of a Challenge, and only when fighting a model with the Emperor\'s Children, World Eaters, Sons of Horus, or Death Guard Trait. Until the Challenge ends, this model\'s WS, Strength, and Toughness are each increased by +1.',
    timings: ['faceOff'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Iron Warriors (IV) ───────────────────────────────────────────────────────

export const IRON_WARRIORS_GAMBITS: Gambit[] = [
  {
    id: 'spiteful-demise',
    name: 'Spiteful Demise',
    description: 'If this model loses its last Wound during the following Strike Step, immediately inflict one automatic Hit on the opposing model (resolved as a weapon: I/1A/S6/AP4/D2 with Breaching(5+)).',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'the-breaker',
    name: 'The Breaker',
    description: 'Only selectable during the first Face-Off Step. This model makes no attacks during the Strike Step. Instead, select a friendly Iron Warriors unit within 12" of any enemy model in this Combat; that unit makes a Shooting Attack (Snap Shots only, no Blast/Template) targeting only the enemy model in the Challenge. (No effect in a 1v1 duel without a supporting unit.)',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Night Lords (VIII) ───────────────────────────────────────────────────────

export const NIGHT_LORDS_GAMBITS: Gambit[] = [
  {
    id: 'nostraman-courage',
    name: 'Nostraman Courage',
    description: 'Once per Challenge. At the start of any Strike Step, return this model to its unit and replace it with another model from the same unit. (No effect in a 1v1 duel without a unit to draw from.)',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
  {
    id: 'a-death-long-foreseen',
    name: 'A Death Long Foreseen',
    description: 'Only available on a die roll of 5+ when selecting Gambits. If selected, make one Willpower Check for each benefit: Feel No Pain(5+), +1 Attack, and Mercy & Forgiveness gains Initiative Modifier of +2. Each benefit applies only if the check is passed.',
    timings: ['faceOff', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── World Eaters (XII) ───────────────────────────────────────────────────────

export const WORLD_EATERS_GAMBITS: Gambit[] = [
  {
    id: 'violent-overkill',
    name: 'Violent Overkill',
    description: 'When attacking, if the opponent is removed as a Casualty any remaining wounds must be allocated to other eligible enemy models in the same Combat. (No effect in a 1v1 duel.)',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Death Guard (XIV) ────────────────────────────────────────────────────────

export const DEATH_GUARD_GAMBITS: Gambit[] = [
  {
    id: 'steadfast-resilience',
    name: 'Steadfast Resilience',
    description: 'This model\'s Toughness Characteristic is replaced with the Base Weapon Skill Characteristic of the opposing model for the duration of the following Strike Step.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'witchblood',
    name: 'Witchblood',
    description: 'Once per battle. At the start of the Focus Step, make a Willpower Check. If passed, this model\'s Attacks and Strength are each increased by +2 in the following Strike Step. If failed, this model suffers 1 Wound (AP2, D1; only Invulnerable Saves may be taken). May cause this model to be removed as a Casualty.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Thousand Sons (XV) ───────────────────────────────────────────────────────

export const THOUSAND_SONS_GAMBITS: Gambit[] = [
  {
    id: 'prophetic-duellist',
    name: 'Prophetic Duellist',
    description: 'Immediately after making the Focus Roll, the controlling player may choose to replace the result (after all modifiers) with this model\'s Willpower Characteristic.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];

// ── Sons of Horus (XVI) ──────────────────────────────────────────────────────

export const SONS_OF_HORUS_GAMBITS: Gambit[] = [
  {
    id: 'merciless-strike',
    name: 'Merciless Strike',
    description: 'Only selectable during the first Face-Off Step of a Challenge. For the duration of this Strike Step, any weapon this model uses gains the Phage(T) Special Rule (each Unsaved Wound reduces the opponent\'s Toughness Characteristic by 1).',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Word Bearers (XVII) ──────────────────────────────────────────────────────

export const WORD_BEARERS_GAMBITS: Gambit[] = [
  {
    id: 'beseech-the-gods',
    name: 'Beseech the Gods',
    description: 'Only selectable during the first Face-Off Step of a Challenge. Make a Willpower Check. If passed, this model\'s Strength and Attacks are each increased by +1 until the end of the Challenge Sub-Phase. If failed, this model suffers 1 Wound (AP2, D1; no Saves or Damage Mitigation Rolls allowed).',
    timings: ['faceOff', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Alpha Legion (XX) ────────────────────────────────────────────────────────

export const ALPHA_LEGION_GAMBITS: Gambit[] = [
  {
    id: 'i-am-alpharius',
    name: 'I Am Alpharius',
    description: 'Only selectable during the first Face-Off Step of a Challenge. The opposing model\'s Combat Initiative is set to 1 until the end of the following Strike Step.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];

// ── Combined export ──────────────────────────────────────────────────────────

export const TRAITOR_LEGION_GAMBITS: Gambit[] = [
  ...EMPERORS_CHILDREN_GAMBITS,
  ...IRON_WARRIORS_GAMBITS,
  ...NIGHT_LORDS_GAMBITS,
  ...WORLD_EATERS_GAMBITS,
  ...DEATH_GUARD_GAMBITS,
  ...THOUSAND_SONS_GAMBITS,
  ...SONS_OF_HORUS_GAMBITS,
  ...WORD_BEARERS_GAMBITS,
  ...ALPHA_LEGION_GAMBITS,
];
