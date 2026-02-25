/**
 * Psychic melee weapon profiles for Legion Astartes Librarian disciplines.
 *
 * These weapons are granted by specialising in a Psychic Discipline and are
 * not available to Librarians without a discipline selected.
 *
 * Biomancy   → Biomantic Slam
 * Pyromancy  → Conflagration
 */
import type { Weapon } from '../../models/weapon.js';

/**
 * Biomantic Slam (Biomancy)
 * IM -3, AM +1, S 12 (fixed), AP 2, D 2
 * Special rules: Armourbane, Force(D)
 */
export const BIOMANTIC_SLAM: Weapon = {
  name: 'Biomantic Slam',
  type: 'melee',
  profiles: [
    {
      profileName: 'Biomantic Slam',
      initiativeModifier: { kind: 'add',   value: -3 },
      attacksModifier:    { kind: 'add',   value: 1  },
      strengthModifier:   { kind: 'fixed', value: 12 },
      ap: 2,
      damage: 2,
      specialRules: [
        { name: 'Armourbane' },
        { name: 'Force', characteristic: 'D' },
      ],
    },
  ],
};

/**
 * Conflagration (Pyromancy)
 * IM -1, AM 6+D3 (fixed 6, plus D3 via attacksExtraD3), S 5 (fixed), AP 4, D 1
 * Special rules: Deflagrate(5)
 */
export const CONFLAGRATION: Weapon = {
  name: 'Conflagration',
  type: 'melee',
  profiles: [
    {
      profileName: 'Conflagration',
      initiativeModifier: { kind: 'add',   value: -1 },
      attacksModifier:    { kind: 'fixed', value: 6  },
      strengthModifier:   { kind: 'fixed', value: 5  },
      ap: 4,
      damage: 1,
      attacksExtraD3: true,
      specialRules: [
        { name: 'Deflagrate', value: 5 },
      ],
    },
  ],
};
