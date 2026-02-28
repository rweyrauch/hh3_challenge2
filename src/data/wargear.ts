/**
 * Optional wargear items that certain characters may equip during selection.
 *
 * Currently limited to Boarding Shield and Combat Shield, available to
 * Legiones Astartes Praetor and Centurion models.
 *
 * Applying wargear returns a shallow-cloned Character with the wargear's
 * mechanical effects merged in (improved Inv save, sub-type, or special rules).
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
};

/**
 * Return a shallow-cloned Character with the chosen wargear's effects applied.
 *
 * Boarding Shield: Inv → min(current, 5); adds Heavy sub-type.
 * Combat Shield:   Inv → min(current, 5); adds DuellistsEdge(1) to specialRules.
 */
export function applyWargear(char: Character, wargearId: WargearId): Character {
  const currentInv = char.stats.Inv ?? 6;
  const newInv = Math.min(currentInv, 5);
  const newStats = { ...char.stats, Inv: newInv };

  if (wargearId === 'boarding-shield') {
    const subTypes = char.subTypes.includes('Heavy')
      ? char.subTypes
      : ([...char.subTypes, 'Heavy'] as typeof char.subTypes);
    return { ...char, stats: newStats, subTypes };
  }

  // combat-shield: DuellistsEdge(1) grants +1 to Focus rolls via getDuellistsEdgeBonus()
  const specialRules = [...char.specialRules, { name: 'DuellistsEdge' as const, value: 1 }];
  return { ...char, stats: newStats, specialRules };
}
