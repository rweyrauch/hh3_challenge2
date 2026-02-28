/**
 * Anathema Psykana characters.
 *
 * The Anathema Psykana is the formal order of the Sisters of Silence, also
 * known as the Witchseekers or Null-Maidens.  They are the militant wing of
 * the Adeptus Astra Telepathica and are immune to psychic powers.
 *
 * Only characters with the Command Sub-Type are eligible for a Challenge.
 *
 * Stat sources: Legacies of the Age of Darkness — Talons of the Emperor /
 * Anathema Psykana Army List.
 * Special rules not modelled by the engine are omitted from specialRules[].
 */
import type { Character } from '../../models/character.js';
import { SWORD_OF_OBLIVION } from '../weapons/namedCharacters.js';

// ════════════════════════════════════════════════════════════════
// JENETIA KROLE
// Infantry (Unique, Command, Light) — High Command
// ════════════════════════════════════════════════════════════════

// ── Jenetia Krole ─────────────────────────────────────────────────────────────
// The Soulless Queen: while in a Challenge, grants access to the Abyssal Strike
// gambit (Focus Roll bonus = own WP − enemy WP).  Uses the same gambit id as the
// Custodes version; the Focus Roll bonus logic is not modelled differently here.
// Hatred(Psyker, Malefic) — +1 to wound vs Psyker or Malefic models.
// EW(1): unsaved wound damage reduced by 1 (min 1).
// Fear(1): units within 12" reduce advanced characteristics by 1.
// Precision(5+): not modelled (no effect in Challenge vs single opponent).
const JENETIA_KROLE: Character = {
  id: 'jenetia-krole',
  name: 'Jenetia Krole',
  faction: 'anathema-psykana',
  type: 'infantry',
  subTypes: ['Command', 'Light'],
  stats: {
    M: 6, WS: 6, BS: 5, S: 3, T: 3, W: 4,
    I: 5, A: 5, LD: 10, CL: 10, WP: 12, IN: 10,
    Sv: 2, Inv: 4,
  },
  weapons: [SWORD_OF_OBLIVION],
  // The Soulless Queen grants Abyssal Strike; she also qualifies for the
  // Custodes 'every-strike-foreseen' gambit via Talons of the Emperor rules,
  // but that is a cross-army special case — omitted here.
  factionGambitIds: ['abyssal-strike'],
  specialRules: [
    { name: 'EternalWarrior', value: 1 },
    { name: 'Fear', value: 1 },
    { name: 'Hatred', target: 'Psyker' },
  ],
  traits: ['Loyalist', 'Anathema Psykana'],
};

export const ANATHEMA_PSYKANA_CHARACTERS: Character[] = [
  JENETIA_KROLE,
];
