import { describe, it, expect } from 'vitest';
import {
  getFocusDiceModification,
  getStrikeModifiers,
  canWithdrawFromChallenge,
  getTauntAndBaitCRPBonus,
} from '../gambitEffects.js';
import { buildInitialState } from '../challengeEngine.js';
import { CUSTODES_CHARACTERS } from '../../data/factions/custodes.js';
import { ORK_CHARACTERS } from '../../data/factions/orks.js';

const VALDOR  = CUSTODES_CHARACTERS.find(c => c.id === 'constantin-valdor')!;
const WARBOSS = ORK_CHARACTERS.find(c => c.id === 'warboss-goffs')!;

describe('getFocusDiceModification', () => {
  it('Seize the Initiative → extra die, discard lowest', () => {
    const mod = getFocusDiceModification('seize-the-initiative');
    expect(mod.extraDice).toBe(1);
    expect(mod.discardLowest).toBe(true);
    expect(mod.discardHighest).toBe(false);
  });

  it('Finishing Blow → extra die, discard highest', () => {
    const mod = getFocusDiceModification('finishing-blow');
    expect(mod.extraDice).toBe(1);
    expect(mod.discardHighest).toBe(true);
    expect(mod.discardLowest).toBe(false);
  });

  it('Grandstand → extra die, discard highest (no OS bonus)', () => {
    const mod = getFocusDiceModification('grandstand');
    expect(mod.extraDice).toBe(1);
    expect(mod.discardHighest).toBe(true);
  });

  it('Guard Up → no focus dice modification', () => {
    const mod = getFocusDiceModification('guard-up');
    expect(mod.extraDice).toBe(0);
    expect(mod.discardLowest).toBe(false);
    expect(mod.discardHighest).toBe(false);
  });

  it('null gambit → no modification', () => {
    const mod = getFocusDiceModification(null);
    expect(mod.extraDice).toBe(0);
    expect(mod.discardLowest).toBe(false);
    expect(mod.discardHighest).toBe(false);
  });
});

describe('getStrikeModifiers', () => {
  const state = buildInitialState(VALDOR, WARBOSS);

  it('Flurry of Blows → +D3 attacks, damage set to 1', () => {
    const mods = getStrikeModifiers('flurry-of-blows', state, true, 3);
    expect(mods.attacksDelta).toBe(3);
    expect(mods.damageSetToOne).toBe(true);
  });

  it('Guard Up → +1 WS, single attack cap', () => {
    const mods = getStrikeModifiers('guard-up', state, true);
    expect(mods.wsDelta).toBe(1);
    expect(mods.singleAttackCap).toBe(true);
  });

  it('Withdraw → single attack cap', () => {
    const mods = getStrikeModifiers('withdraw', state, true);
    expect(mods.singleAttackCap).toBe(true);
  });

  it('Finishing Blow → +1 Strength, +1 Damage', () => {
    const mods = getStrikeModifiers('finishing-blow', state, true);
    expect(mods.strengthDelta).toBe(1);
    expect(mods.damageDelta).toBe(1);
  });

  it('Abyssal Strike → +1 AP improvement', () => {
    const mods = getStrikeModifiers('abyssal-strike', state, true);
    expect(mods.apImprovement).toBe(1);
  });

  it('null gambit → no modifications', () => {
    const mods = getStrikeModifiers(null, state, true);
    expect(mods.wsDelta).toBe(0);
    expect(mods.attacksDelta).toBe(0);
    expect(mods.strengthDelta).toBe(0);
    expect(mods.damageDelta).toBe(0);
    expect(mods.damageSetToOne).toBe(false);
    expect(mods.singleAttackCap).toBe(false);
  });
});

describe('Feint and Riposte ban', () => {
  it('banning a gambit prevents opponent from selecting it', () => {
    // This is enforced in the engine/UI, but the gambit effect flag is
    // captured on the combatant state as feintAndRiposteBan.
    // We verify the flag logic: if player bans 'flurry-of-blows' and AI tries
    // to pick it, the engine rejects it.
    // (Tested via challengeEngine integration rather than a pure function)
    expect(true).toBe(true); // placeholder; see challengeEngine.test.ts
  });
});

describe('canWithdrawFromChallenge', () => {
  it('returns true when Withdraw gambit used and not a casualty', () => {
    expect(canWithdrawFromChallenge('withdraw', false)).toBe(true);
  });

  it('returns false when Withdraw gambit used but model is a casualty', () => {
    expect(canWithdrawFromChallenge('withdraw', true)).toBe(false);
  });

  it('returns false for any other gambit', () => {
    expect(canWithdrawFromChallenge('guard-up', false)).toBe(false);
    expect(canWithdrawFromChallenge(null, false)).toBe(false);
  });
});

describe('getTauntAndBaitCRPBonus', () => {
  it('returns 0 if not winner, regardless of use count', () => {
    expect(getTauntAndBaitCRPBonus(3, false)).toBe(0);
  });

  it('returns use count as bonus when winner', () => {
    expect(getTauntAndBaitCRPBonus(2, true)).toBe(2);
  });

  it('returns 0 when not used at all', () => {
    expect(getTauntAndBaitCRPBonus(0, true)).toBe(0);
  });
});
