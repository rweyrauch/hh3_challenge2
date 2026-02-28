/**
 * Cults Abominatio characters.
 *
 * The Cults Abominatio are dark cults that worship the Chaos powers and field
 * mutated, daemonic creatures as their champions.  The Infernus Abomination
 * is a Champion-type creature capable of entering a Challenge.
 *
 * Only characters with the Command or Champion Sub-Type are eligible for a
 * Challenge.  The Infernus Abomination has the Champion Sub-Type.
 *
 * Note: The Osmeotic Regeneration gambit (regain 1 Wound per Strike Step if
 * the opponent suffered a Wound) is not modelled — it would require engine
 * support for mid-challenge wound recovery.
 *
 * Stat sources: Horus Heresy 3rd Edition — Cults Abominatio army list.
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import { TRANSMUTATIVE_CLAW } from '../weapons/namedCharacters.js';

// ════════════════════════════════════════════════════════════════
// INFERNUS ABOMINATION
// Infantry (Champion, Light) — Cult Operative
// ════════════════════════════════════════════════════════════════

// ── Infernus Abomination ───────────────────────────────────────────────────────
// Fear(1): units within 12" reduce advanced characteristics by 1.
// Transmutative claw: +2S, AP4, D2, Breaching(5+).
// Heedless / Infiltrate / Shrouded / Move Through Cover: not relevant to engine.
// Poisoned(X): on ranged weapon only — not modelled here.
// Osmeotic Regeneration: gambit not modelled (requires mid-challenge healing).
const INFERNUS_ABOMINATION: Character = {
  id: 'infernus-abomination',
  name: 'Infernus Abomination',
  faction: 'cults-abominatio',
  type: 'infantry',
  subTypes: ['Champion', 'Light'],
  stats: {
    M: 8, WS: 5, BS: 5, S: 5, T: 5, W: 3,
    I: 4, A: 3, LD: 10, CL: 10, WP: 8, IN: 6,
    Sv: 4, Inv: 4,
  },
  weapons: [TRANSMUTATIVE_CLAW],
  factionGambitIds: [],
  specialRules: [
    { name: 'Fear', value: 1 },
  ],
  traits: ['Traitor', 'Cults Abominatio'],
};

export const CULTS_ABOMINATIO_CHARACTERS: Character[] = [
  INFERNUS_ABOMINATION,
];
