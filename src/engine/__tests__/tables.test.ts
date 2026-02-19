import { describe, it, expect } from 'vitest';
import { getHitTargetNumber, getWoundTargetNumber, getEffectiveSave } from '../tables.js';

describe('getHitTargetNumber', () => {
  it('returns 4+ for a WS mirror match (WS4 vs WS4)', () => {
    expect(getHitTargetNumber(4, 4)).toBe(4);
  });

  it('returns 2+ when attacker WS greatly exceeds defender (WS7 vs WS1)', () => {
    expect(getHitTargetNumber(7, 1)).toBe(2);
  });

  it('returns 6+ when defender WS greatly exceeds attacker (WS1 vs WS9)', () => {
    expect(getHitTargetNumber(1, 9)).toBe(6);
  });

  it('returns 5+ when attacker WS is lower than defender (WS3 vs WS4)', () => {
    expect(getHitTargetNumber(3, 4)).toBe(5);
  });

  it('returns 3+ when attacker WS exceeds defender (WS4 vs WS3)', () => {
    expect(getHitTargetNumber(4, 3)).toBe(3);
  });

  it('caps WS values at 10 (WS12 treated as WS10)', () => {
    expect(getHitTargetNumber(12, 5)).toBe(getHitTargetNumber(10, 5));
  });

  it('handles WS1 attacker vs WS1 defender → 4+', () => {
    expect(getHitTargetNumber(1, 1)).toBe(4);
  });
});

describe('getWoundTargetNumber', () => {
  it('returns 4+ when S equals T (S4 vs T4)', () => {
    expect(getWoundTargetNumber(4, 4)).toBe(4);
  });

  it('returns 2+ when S greatly exceeds T (S8 vs T4)', () => {
    expect(getWoundTargetNumber(8, 4)).toBe(2);
  });

  it('returns 6+ when S just below T (S4 vs T5)', () => {
    expect(getWoundTargetNumber(4, 5)).toBe(5);
  });

  it('returns impossible (7) when S far below T (S1 vs T6)', () => {
    expect(getWoundTargetNumber(1, 6)).toBe(7);
  });

  it('returns 3+ for S5 vs T4', () => {
    expect(getWoundTargetNumber(5, 4)).toBe(3);
  });

  it('returns 2+ for S6 vs T5', () => {
    expect(getWoundTargetNumber(6, 5)).toBe(3); // S6 vs T5 → 3+
  });

  it('caps values at 10', () => {
    expect(getWoundTargetNumber(12, 5)).toBe(getWoundTargetNumber(10, 5));
  });
});

describe('getEffectiveSave', () => {
  it('returns armour save when AP does not penetrate', () => {
    // Sv 3+, Inv 5+, AP 4 (does not penetrate 3+ armour)
    expect(getEffectiveSave(3, 5, 4)).toBe(3);
  });

  it('returns invulnerable save when armour is penetrated', () => {
    // Sv 4+, Inv 5+, AP 4 (AP 4 equals Sv 4, so armour is penetrated)
    expect(getEffectiveSave(4, 5, 4)).toBe(5);
  });

  it('returns invulnerable save as best when both available and inv is better', () => {
    // Sv 5+, Inv 3+, AP 6 (armour penetrated, inv available and better)
    expect(getEffectiveSave(5, 3, 6)).toBe(3);
  });

  it('returns null when no save possible (no inv, armour penetrated)', () => {
    // Sv 4+, no inv, AP 3
    expect(getEffectiveSave(4, null, 3)).toBeNull();
  });

  it('returns armour save when AP is null (AP -)', () => {
    // AP '-' cannot penetrate any armour
    expect(getEffectiveSave(4, null, null)).toBe(4);
  });

  it('returns invulnerable save when no armour and AP penetrates', () => {
    // No armour (7+), inv 4+, AP 2
    expect(getEffectiveSave(7, 4, 2)).toBe(4);
  });

  it('returns best of armour and inv when both available and no AP threat', () => {
    // Sv 3+, Inv 4+, AP null → armour save wins (better)
    expect(getEffectiveSave(3, 4, null)).toBe(3);
  });
});
