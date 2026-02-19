/**
 * Central character and gambit registry.
 *
 * Exports:
 *  - ALL_CHARACTERS  — flat list of every playable character
 *  - getCharacterById() — look up a character by id
 *  - getFactionGambits() — get gambit list for a character
 */
import type { Character } from '../../models/character.js';
import type { Gambit, GambitId } from '../../models/gambit.js';
import { CUSTODES_CHARACTERS }       from './custodes.js';
import { ORK_CHARACTERS }            from './orks.js';
import { LEGION_ASTARTES_CHARACTERS } from './legionAstartes.js';
import { CORE_GAMBITS }              from '../gambits/coreGambits.js';
import { CUSTODES_GAMBITS }          from '../gambits/custodes.js';
import { ORK_GAMBITS }               from '../gambits/orks.js';

export const ALL_CHARACTERS: Character[] = [
  ...CUSTODES_CHARACTERS,
  ...ORK_CHARACTERS,
  ...LEGION_ASTARTES_CHARACTERS,
];

const CHAR_MAP = new Map<string, Character>(
  ALL_CHARACTERS.map(c => [c.id, c]),
);

export function getCharacterById(id: string): Character | undefined {
  return CHAR_MAP.get(id);
}

/** All gambits indexed by id. */
const ALL_GAMBITS: Gambit[] = [...CORE_GAMBITS, ...CUSTODES_GAMBITS, ...ORK_GAMBITS];
const GAMBIT_MAP = new Map<GambitId, Gambit>(
  ALL_GAMBITS.map(g => [g.id, g]),
);

export function getGambitById(id: GambitId): Gambit | undefined {
  return GAMBIT_MAP.get(id);
}

/**
 * Return the full Gambit objects available to a given character, including
 * the 9 core gambits plus any faction-specific ones.
 *
 * Gambits that are `oncePerChallenge` and have already been used are
 * filtered by the caller (the UI / engine), not here.
 */
export function getFactionGambits(character: Character): Gambit[] {
  const factionGambits = character.factionGambitIds
    .map(id => GAMBIT_MAP.get(id))
    .filter((g): g is Gambit => g !== undefined);

  return [...CORE_GAMBITS, ...factionGambits];
}

/** Characters grouped by faction for the selection screen. */
export function getCharactersByFaction(): { faction: string; characters: Character[] }[] {
  const map = new Map<string, Character[]>();
  for (const char of ALL_CHARACTERS) {
    if (!map.has(char.faction)) map.set(char.faction, []);
    map.get(char.faction)!.push(char);
  }
  return Array.from(map.entries()).map(([faction, characters]) => ({ faction, characters }));
}

/** Human-readable faction label. */
export function getFactionLabel(faction: string): string {
  const labels: Record<string, string> = {
    'legio-custodes':  'Legio Custodes',
    'orks':            'Orks',
    'legion-astartes': 'Legion Astartes',
  };
  return labels[faction] ?? faction;
}
