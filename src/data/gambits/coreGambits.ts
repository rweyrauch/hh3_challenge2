/**
 * Core Gambits — available to every model in a Challenge.
 *
 * Rules reference: HH3 core rulebook, Challenge Sub-Phase, Face-Off Step.
 */
import type { Gambit } from '../../models/gambit.js';

export const CORE_GAMBITS: Gambit[] = [
  {
    id: 'seize-the-initiative',
    name: 'Seize the Initiative',
    description: 'Roll an extra die in the Focus Step and discard the lowest result.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'flurry-of-blows',
    name: 'Flurry of Blows',
    description: '+D3 Attacks in the Strike Step, but all hits have Damage set to 1.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'test-the-foe',
    name: 'Test the Foe',
    description: 'No immediate benefit, but automatically gain Challenge Advantage at the start of the next Face-Off Step.',
    timings: ['faceOff'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'guard-up',
    name: 'Guard Up',
    description: '+1 WS in the Strike Step, but only 1 Attack. Each enemy attack that misses grants +1 to your next Focus Roll.',
    timings: ['strike', 'focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'taunt-and-bait',
    name: 'Taunt and Bait',
    description: 'Your WS and Attacks are reduced to equal the enemy\'s (or enemy−1 if already equal). Each use grants +1 CRP if you win the Challenge.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'grandstand',
    name: 'Grandstand',
    description: 'Roll an extra die in the Focus Step and discard the highest; no Outside Support bonus. (Outside Support is 0 in a duel, making this a pure disadvantage.)',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'feint-and-riposte',
    name: 'Feint and Riposte',
    description: 'First-mover only: name one gambit — your opponent cannot select it this Face-Off.',
    timings: ['faceOff'],
    firstMoverOnly: true,
    oncePerChallenge: false,
  },
  {
    id: 'withdraw',
    name: 'Withdraw',
    description: 'Only 1 Attack. In the Glory Step, if your model survives, you may end the Challenge with 0 CRP scored by either side.',
    timings: ['strike', 'glory'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
  {
    id: 'finishing-blow',
    name: 'Finishing Blow',
    description: 'Roll an extra die in the Focus Step and discard the highest. All hits gain +1 Strength and +1 Damage.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
  },
];
