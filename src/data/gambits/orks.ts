/**
 * Ork faction-specific Gambits.
 *
 * Brutal but Kunnin' — Goffs clan gambit.
 * Kunnin' but Brutal — Blood Axes clan gambit.
 *
 * Both may only be selected once per Challenge.
 * Both allow the model to use its Leadership characteristic in place of a
 * Focus Roll result, representing the Ork's innate cunning outweighing finesse.
 */
import type { Gambit } from '../../models/gambit.js';

export const ORK_GAMBITS: Gambit[] = [
  {
    id: 'brutal-but-kunnin',
    name: "Brutal but Kunnin'",
    description: 'Goffs only. Once per Challenge. Use your Leadership characteristic as your Focus Roll total instead of rolling dice.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
  {
    id: 'kunnin-but-brutal',
    name: "Kunnin' but Brutal",
    description: 'Blood Axes only. Once per Challenge. After rolling Focus dice, you may replace the dice result with your Leadership characteristic.',
    timings: ['focus'],
    firstMoverOnly: false,
    oncePerChallenge: true,
  },
];
