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
];
