/**
 * Divisio Assassinorum mandatory gambits.
 *
 * Both gambits here have mandatory: true, meaning the character's controlling
 * player must always select them in the Face-Off step.  No other gambit may be
 * chosen, and Feint & Riposte cannot prevent selection.
 */
import type { Gambit } from '../../models/gambit.js';

export const ASSASSIN_GAMBITS: Gambit[] = [
  {
    id: 'biological-overload',
    name: 'Biological Overload',
    description:
      'Mandatory (Eversor). +3 to Focus Roll; +3 Attacks in Strike Step. ' +
      'For each unmodified Hit Test roll of 1, the Eversor suffers 1 wound (AP2/D1) at the end of the Strike Step.',
    timings: ['focus', 'strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
    mandatory: true,
  },
  {
    id: 'mirror-form',
    name: 'Mirror-Form',
    description:
      'Mandatory (Adamus). Hit Tests always succeed on 4+ regardless of WS comparison. ' +
      'If reactive and wounds are reduced to 0 during the opponent\'s Strike Step, the Adamus may still attack before removal.',
    timings: ['strike'],
    firstMoverOnly: false,
    oncePerChallenge: false,
    mandatory: true,
  },
];
