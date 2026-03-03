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
  {
    id: 'the-myrmidons-path',
    name: "The Myrmidon's Path",
    description:
      'Roll an extra die in the Focus Step and discard the highest result. ' +
      'In the Strike Step, before either model attacks, make a Shooting Attack ' +
      'with a single eligible Ranged Weapon (no Blast, Template or Barrage) ' +
      'targeting the opposing model (auto Line of Sight, Range 1").',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'power-of-the-machine-spirit',
    name: 'Power of the Machine Spirit',
    description:
      'Before the Focus Roll, make an IN check (2d6 ≤ IN). ' +
      'On success: +2 WS and +1 A for the Strike Step. ' +
      'After all attacks, always suffer Cybertheurgic Feedback (1 automatic unsaved wound, no save, no FNP), ' +
      'regardless of IN check outcome.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];
