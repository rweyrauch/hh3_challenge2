/**
 * Legio Custodes faction-specific Gambits.
 *
 * These gambits are only available to Legio Custodes models.
 *
 * Note: The descriptions below represent simplified versions appropriate for
 * this 1v1 Challenge simulator.
 */
import type { Gambit } from '../../models/gambit.js';

export const CUSTODES_GAMBITS: Gambit[] = [
  {
    id: 'every-strike-foreseen',
    name: 'Every Strike Foreseen',
    description: 'Reactive player only: re-roll one failed saving throw during the opponent\'s Strike Step.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'abyssal-strike',
    name: 'Abyssal Strike',
    description: 'Replace your own Initiative with the opponent\'s for the Focus Roll. If you win Challenge Advantage, all your hits in the Strike Step gain +1 AP improvement.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'heavens-strike',
    name: "Heaven's Strike",
    description: 'Halves your Attacks Characteristic but upgrades CriticalHit(6+) on your weapon to CriticalHit(5+). Only has effect if your weapon has the CriticalHit(6+) Special Rule.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'raptors-surge',
    name: "Raptor's Surge",
    description: 'Gain bonus Attacks equal to the difference in Outside Support Bonuses (opponent OSB − own OSB, max +3). No effect in a 1v1 duel.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'stones-aegis',
    name: "Stone's Aegis",
    description: 'Requires the Shield Trait. Your Toughness is increased by +1 for the Strike Step, but enemy Wound Tests against you automatically fail on a natural result of 1 or 2.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'world-serpents-bane',
    name: "World Serpent's Bane",
    description: 'You may only make a single attack this Strike Step, but the Damage Characteristic of that attack equals your current Wounds Characteristic.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];
