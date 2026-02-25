/**
 * Psychic Discipline configuration for Legion Astartes Librarian characters.
 *
 * Each discipline may grant:
 *   - A melee Psychic Weapon
 *   - Character-level Special Rules
 *   - Faction Gambit IDs
 *
 * Applying a discipline returns a shallow-cloned Character with the discipline's
 * weapons, rules, and gambits merged in.
 */
import type { Character, PsychicDiscipline } from '../models/character.js';
import type { Weapon, SpecialRule } from '../models/weapon.js';
import type { GambitId } from '../models/gambit.js';
import { BIOMANTIC_SLAM } from './weapons/psychic.js';
import { CONFLAGRATION }  from './weapons/psychic.js';

export interface DisciplineConfig {
  name: string;
  meleeWeapon?: Weapon;
  specialRules: SpecialRule[];
  gambitIds: GambitId[];
}

export const DISCIPLINE_CONFIGS: Record<PsychicDiscipline, DisciplineConfig> = {
  biomancy: {
    name: 'Biomancy',
    meleeWeapon: BIOMANTIC_SLAM,
    specialRules: [],
    gambitIds: [],
  },
  pyromancy: {
    name: 'Pyromancy',
    meleeWeapon: CONFLAGRATION,
    specialRules: [],
    gambitIds: [],
  },
  telekinesis: {
    name: 'Telekinesis',
    // All powers are Ranged/Reaction — no melee weapon, no challenge effects
    specialRules: [],
    gambitIds: [],
  },
  divination: {
    name: 'Divination',
    specialRules: [{ name: 'DuellistsEdge', value: 2 }],
    gambitIds: ['divination-every-strike-foreseen'],
  },
  thaumaturgy: {
    name: 'Thaumaturgy',
    specialRules: [{ name: 'Hatred', target: 'Psykers' }],
    gambitIds: [],
  },
};

/**
 * Return a shallow-cloned Character with the chosen discipline's weapons,
 * special rules, and gambit IDs merged in.
 *
 * The discipline weapon (if any) is appended to the end of the weapons array
 * so that existing weapon indices remain unchanged.
 */
export function applyDiscipline(char: Character, discipline: PsychicDiscipline): Character {
  const config = DISCIPLINE_CONFIGS[discipline];
  const weapons = config.meleeWeapon
    ? [...char.weapons, config.meleeWeapon]
    : char.weapons;
  const specialRules = config.specialRules.length
    ? [...char.specialRules, ...config.specialRules]
    : char.specialRules;
  const factionGambitIds = config.gambitIds.length
    ? [...char.factionGambitIds, ...config.gambitIds]
    : char.factionGambitIds;

  return { ...char, weapons, specialRules, factionGambitIds };
}
