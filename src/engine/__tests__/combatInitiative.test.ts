import { describe, it, expect } from 'vitest';
import { calculateCombatInitiative, buildFocusTotal, getDuellistsEdgeBonus } from '../combatInitiative.js';
import type { CharacterStats } from '../../models/character.js';
import type { WeaponProfile } from '../../models/weapon.js';

const baseStats: CharacterStats = {
  M: 8, WS: 7, BS: 5, S: 5, T: 5, W: 5,
  I: 6, A: 6, LD: 12, CL: 10, WP: 10, IN: 10,
  Sv: 2, Inv: 4,
};

function makeProfile(override: Partial<WeaponProfile> = {}): WeaponProfile {
  return {
    profileName: 'Test',
    initiativeModifier: { kind: 'none' },
    attacksModifier: { kind: 'none' },
    strengthModifier: { kind: 'none' },
    ap: 2,
    damage: 1,
    specialRules: [],
    ...override,
  };
}

describe('calculateCombatInitiative', () => {
  it('returns base I when IM is none', () => {
    const profile = makeProfile({ initiativeModifier: { kind: 'none' } });
    expect(calculateCombatInitiative(baseStats, profile)).toBe(6);
  });

  it('adds positive modifier to I', () => {
    const profile = makeProfile({ initiativeModifier: { kind: 'add', value: 2 } });
    expect(calculateCombatInitiative(baseStats, profile)).toBe(8);
  });

  it('subtracts negative modifier (Heavy weapon)', () => {
    // Power Klaw has IM -3
    const profile = makeProfile({ initiativeModifier: { kind: 'add', value: -3 } });
    expect(calculateCombatInitiative(baseStats, profile)).toBe(3);
  });

  it('uses fixed IM, replacing model I entirely', () => {
    const profile = makeProfile({ initiativeModifier: { kind: 'fixed', value: 1 } });
    expect(calculateCombatInitiative(baseStats, profile)).toBe(1);
  });

  it('never goes below 0', () => {
    const lowI = { ...baseStats, I: 1 };
    const profile = makeProfile({ initiativeModifier: { kind: 'add', value: -5 } });
    expect(calculateCombatInitiative(lowI, profile)).toBe(0);
  });
});

describe('buildFocusTotal', () => {
  it('sums dice + CI + modifiers', () => {
    // Roll [4], CI=6, no penalties or bonuses
    const total = buildFocusTotal([4], 6, false, false, 0, 0, 0, 0);
    expect(total).toBe(10);
  });

  it('applies Heavy sub-type −1 penalty', () => {
    const total = buildFocusTotal([4], 6, true, false, 0, 0, 0, 0);
    expect(total).toBe(9); // 4 + 6 - 1
  });

  it('applies Light sub-type +1 bonus', () => {
    const total = buildFocusTotal([4], 6, false, true, 0, 0, 0, 0);
    expect(total).toBe(11); // 4 + 6 + 1
  });

  it('applies wound penalty (-1 per missing wound)', () => {
    // 2 wounds below base
    const total = buildFocusTotal([4], 6, false, false, 2, 0, 0, 0);
    expect(total).toBe(8); // 4 + 6 - 2
  });

  it('applies Duellist\'s Edge bonus', () => {
    const total = buildFocusTotal([4], 6, false, false, 0, 2, 0, 0);
    expect(total).toBe(12); // 4 + 6 + 2
  });

  it('applies Guard Up focus bonus from previous round', () => {
    const total = buildFocusTotal([4], 6, false, false, 0, 0, 0, 3);
    expect(total).toBe(13); // 4 + 6 + 3
  });
});

describe('getDuellistsEdgeBonus', () => {
  it('returns 0 when no DuellistsEdge rules present', () => {
    expect(getDuellistsEdgeBonus([], [])).toBe(0);
  });

  it('sums DuellistsEdge values from weapon and model rules', () => {
    const weaponRules = [{ name: 'DuellistsEdge' as const, value: 2 }];
    const modelRules  = [{ name: 'DuellistsEdge' as const, value: 1 }];
    expect(getDuellistsEdgeBonus(weaponRules, modelRules)).toBe(3);
  });

  it('only counts DuellistsEdge rules, ignoring others', () => {
    const rules = [
      { name: 'CriticalHit' as const, threshold: 5 },
      { name: 'DuellistsEdge' as const, value: 2 },
    ];
    expect(getDuellistsEdgeBonus(rules, [])).toBe(2);
  });
});
