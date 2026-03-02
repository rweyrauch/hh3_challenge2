/**
 * Mechanicum faction-specific Gambits.
 */
import type { Gambit } from '../../models/gambit.js';

export const MECHANICUM_GAMBITS: Gambit[] = [
  {
    id: 'liquifractor-onslaught',
    name: 'Liquifractor Onslaught',
    description:
      'Roll an extra die in the Focus Step and discard the highest result. ' +
      'In the Strike Step, before either model attacks, make a Shooting Attack ' +
      'with the Liquifractor (FP3, hits on 2+, AP6, D1, Poisoned(2+), Breaching(4+), Phage(T & S)) ' +
      'targeting the opposing model (auto Line of Sight, Range 1).',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];
