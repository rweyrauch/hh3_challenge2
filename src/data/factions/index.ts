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
import { CUSTODES_CHARACTERS }        from './custodes.js';
import { ORK_CHARACTERS }             from './orks.js';
import { LEGION_ASTARTES_CHARACTERS } from './legionAstartes.js';
import { LOYALIST_LEGION_CHARACTERS } from './loyalistLegions.js';
import { TRAITOR_LEGION_CHARACTERS }  from './traitorLegions.js';
import { DAEMON_CHARACTERS }          from './daemons.js';
import { MILITIA_CHARACTERS }         from './militia.js';
import { ASSASSIN_CHARACTERS }        from './assassins.js';
import { MECHANICUM_CHARACTERS }      from './mechanicum.js';
import { CORE_GAMBITS }               from '../gambits/coreGambits.js';
import { CUSTODES_GAMBITS }           from '../gambits/custodes.js';
import { ORK_GAMBITS }                from '../gambits/orks.js';
import { LOYALIST_LEGION_GAMBITS }    from '../gambits/loyalistLegions.js';
import { TRAITOR_LEGION_GAMBITS }     from '../gambits/traitorLegions.js';
import { ASSASSIN_GAMBITS }           from '../gambits/assassins.js';

export const ALL_CHARACTERS: Character[] = [
  ...CUSTODES_CHARACTERS,
  ...ORK_CHARACTERS,
  ...LEGION_ASTARTES_CHARACTERS,
  ...LOYALIST_LEGION_CHARACTERS,
  ...TRAITOR_LEGION_CHARACTERS,
  ...DAEMON_CHARACTERS,
  ...MILITIA_CHARACTERS,
  ...ASSASSIN_CHARACTERS,
  ...MECHANICUM_CHARACTERS,
];

const CHAR_MAP = new Map<string, Character>(
  ALL_CHARACTERS.map(c => [c.id, c]),
);

export function getCharacterById(id: string): Character | undefined {
  return CHAR_MAP.get(id);
}

/** All gambits indexed by id. */
const ALL_GAMBITS: Gambit[] = [
  ...CORE_GAMBITS,
  ...CUSTODES_GAMBITS,
  ...ORK_GAMBITS,
  ...LOYALIST_LEGION_GAMBITS,
  ...TRAITOR_LEGION_GAMBITS,
  ...ASSASSIN_GAMBITS,
];
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
    // Pre-existing factions
    'legio-custodes':  'Legio Custodes',
    'orks':            'Orks',
    'legion-astartes': 'Legion Astartes',
    // Loyalist Legions
    'dark-angels':     'Dark Angels (I)',
    'white-scars':     'White Scars (V)',
    'space-wolves':    'Space Wolves (VI)',
    'imperial-fists':  'Imperial Fists (VII)',
    'blood-angels':    'Blood Angels (IX)',
    'iron-hands':      'Iron Hands (X)',
    'ultramarines':    'Ultramarines (XIII)',
    'salamanders':     'Salamanders (XVIII)',
    'raven-guard':     'Raven Guard (XIX)',
    // Traitor Legions
    'emperors-children': "Emperor's Children (III)",
    'iron-warriors':     'Iron Warriors (IV)',
    'night-lords':       'Night Lords (VIII)',
    'world-eaters':      'World Eaters (XII)',
    'death-guard':       'Death Guard (XIV)',
    'thousand-sons':     'Thousand Sons (XV)',
    'sons-of-horus':     'Sons of Horus (XVI)',
    'word-bearers':      'Word Bearers (XVII)',
    'alpha-legion':      'Alpha Legion (XX)',
    // Daemons of the Ruinstorm
    'daemons-of-the-ruinstorm': 'Daemons of the Ruinstorm',
    // Imperialis Militia
    'imperialis-militia': 'Imperialis Militia',
    // Divisio Assassinorum
    'divisio-assassinorum': 'Divisio Assassinorum',
    // Mechanicum
    'mechanicum': 'Mechanicum',
  };
  return labels[faction] ?? faction;
}
