/**
 * Optional wargear items that certain characters may equip during selection.
 *
 * Applying wargear returns a shallow-cloned Character with the wargear's
 * mechanical effects merged in (improved Inv save, sub-type, or special rules).
 *
 * Vigil Pattern Storm Shield is available to Imperial Fists Command and Champion
 * sub-type models; it supersedes the other shields with a 4+ Inv save.
 */
import type { Character, WargearId } from '../models/character.js';

export interface WargearConfig {
  name: string;
  /** Human-readable label shown in the wargear dropdown. */
  label: string;
}

export const WARGEAR_CONFIGS: Record<WargearId, WargearConfig> = {
  'boarding-shield': {
    name: 'Boarding Shield',
    label: 'Boarding Shield (Inv 5+, Heavy)',
  },
  'combat-shield': {
    name: 'Combat Shield',
    label: 'Combat Shield (Inv 5+, +1 Focus)',
  },
  'vigil-pattern-storm-shield': {
    name: 'Vigil Pattern Storm Shield',
    label: 'Vigil Pattern Storm Shield (Inv 4+, Heavy, Shield)',
  },
};

/**
 * WargearId values that are granted conditionally by subfaction rather than
 * baked into the character's availableWargear list.
 *
 * Maps subfaction ID → wargear IDs available to Command/Champion sub-types.
 */
export const SUBFACTION_WARGEAR: Partial<Record<string, WargearId[]>> = {
  'imperial-fists': ['vigil-pattern-storm-shield'],
};

/**
 * Return a shallow-cloned Character with the chosen wargear's effects applied.
 *
 * Boarding Shield:            Inv → min(current, 5); adds Heavy sub-type.
 * Combat Shield:              Inv → min(current, 5); adds DuellistsEdge(1) to specialRules.
 * Vigil Pattern Storm Shield: Inv → min(current, 4); adds Heavy sub-type; adds Shield trait.
 */
export function applyWargear(char: Character, wargearId: WargearId): Character {
  if (wargearId === 'boarding-shield') {
    const newInv = Math.min(char.stats.Inv ?? 6, 5);
    const subTypes = char.subTypes.includes('Heavy')
      ? char.subTypes
      : ([...char.subTypes, 'Heavy'] as typeof char.subTypes);
    return { ...char, stats: { ...char.stats, Inv: newInv }, subTypes };
  }

  if (wargearId === 'combat-shield') {
    const newInv = Math.min(char.stats.Inv ?? 6, 5);
    // DuellistsEdge(1) grants +1 to Focus rolls via getDuellistsEdgeBonus()
    const specialRules = [...char.specialRules, { name: 'DuellistsEdge' as const, value: 1 }];
    return { ...char, stats: { ...char.stats, Inv: newInv }, specialRules };
  }

  // vigil-pattern-storm-shield
  const newInv = Math.min(char.stats.Inv ?? 6, 4);
  const subTypes = char.subTypes.includes('Heavy')
    ? char.subTypes
    : ([...char.subTypes, 'Heavy'] as typeof char.subTypes);
  const traits = char.traits
    ? (char.traits.includes('Shield') ? char.traits : [...char.traits, 'Shield'])
    : ['Shield'];
  return { ...char, stats: { ...char.stats, Inv: newInv }, subTypes, traits };
}
