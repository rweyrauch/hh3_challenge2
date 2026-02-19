import { describe, it, expect } from 'vitest';
import { resolveGloryStep } from '../gloryStep.js';
import { buildInitialState } from '../challengeEngine.js';
import { CUSTODES_CHARACTERS } from '../../data/factions/custodes.js';
import { ORK_CHARACTERS } from '../../data/factions/orks.js';
import type { CombatState } from '../../models/combatState.js';

const VALDOR     = CUSTODES_CHARACTERS.find(c => c.id === 'constantin-valdor')!;
const TRIBUNE    = CUSTODES_CHARACTERS.find(c => c.id === 'tribune')!;
const WARBOSS    = ORK_CHARACTERS.find(c => c.id === 'warboss-goffs')!;
const BIGBOSS    = ORK_CHARACTERS.find(c => c.id === 'bigboss-goffs')!;

function makeState(
  playerChar = VALDOR,
  aiChar = WARBOSS,
  overrides: Partial<CombatState> = {},
): CombatState {
  const base = buildInitialState(playerChar, aiChar);
  return { ...base, ...overrides, player: { ...base.player, ...overrides.player }, ai: { ...base.ai, ...overrides.ai } };
}

describe('resolveGloryStep', () => {
  it('player wins by casualty: AI receives base wounds CRP', () => {
    const state = makeState(VALDOR, WARBOSS, {
      ai: { ...makeState().ai, isCasualty: true },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    expect(result.winner).toBe('player');
    // WARBOSS W=4, no Paragon/Command? Actually WARBOSS has Command sub-type → +1
    expect(result.playerCRP).toBe(4 + 1); // W(4) + command bonus(1) = 5
  });

  it('AI wins by casualty: player receives base wounds CRP', () => {
    const state = makeState(VALDOR, WARBOSS, {
      player: { ...makeState().player, isCasualty: true },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    expect(result.winner).toBe('ai');
    // VALDOR W=6, Paragon type → +1 = 7
    expect(result.aiCRP).toBe(6 + 1);
  });

  it('draw when both are casualties', () => {
    const state = makeState(VALDOR, WARBOSS, {
      player: { ...makeState().player, isCasualty: true },
      ai:     { ...makeState().ai,     isCasualty: true },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    expect(result.winner).toBe('draw');
    expect(result.playerCRP).toBe(0);
    expect(result.aiCRP).toBe(0);
  });

  it('player wins by most wounds inflicted', () => {
    const state = makeState(VALDOR, WARBOSS, {
      player: { ...makeState().player, woundsInflictedThisChallenge: 3 },
      ai:     { ...makeState().ai,     woundsInflictedThisChallenge: 1 },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    expect(result.winner).toBe('player');
    expect(result.playerCRP).toBe(3); // = wounds inflicted
  });

  it('draw when both inflict equal wounds', () => {
    const state = makeState(VALDOR, WARBOSS, {
      player: { ...makeState().player, woundsInflictedThisChallenge: 2 },
      ai:     { ...makeState().ai,     woundsInflictedThisChallenge: 2 },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    expect(result.winner).toBe('draw');
  });

  it('draw when no wounds inflicted by either side', () => {
    const state = makeState();
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    expect(result.winner).toBe('draw');
    expect(result.playerCRP).toBe(0);
    expect(result.aiCRP).toBe(0);
  });

  it('Taunt and Bait bonus is added to winner CRP', () => {
    const state = makeState(VALDOR, WARBOSS, {
      player: {
        ...makeState().player,
        woundsInflictedThisChallenge: 2,
        tauntAndBaitCount: 2,
      },
      ai: { ...makeState().ai, woundsInflictedThisChallenge: 0 },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    expect(result.winner).toBe('player');
    // CRP = wounds(2) + taunt bonus(2) = 4
    expect(result.playerCRP).toBe(4);
  });

  it('accumulated CRP from previous rounds is preserved', () => {
    const state = makeState(VALDOR, WARBOSS, {
      playerCRP: 5, // from previous rounds
      aiCRP: 3,
      ai: { ...makeState().ai, isCasualty: true },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS);
    // WARBOSS W=4, Command+1 = 5 new CRP; previous 5 → total 10
    expect(result.playerCRP).toBe(10);
    expect(result.aiCRP).toBe(3); // unchanged
  });

  it('Withdraw: ends challenge with 0 CRP when player activates it', () => {
    const state = makeState(VALDOR, WARBOSS, {
      player: {
        ...makeState().player,
        selectedGambit: 'withdraw',
        isCasualty: false,
        woundsInflictedThisChallenge: 3,
      },
    });
    const result = resolveGloryStep(state, VALDOR, WARBOSS, true);
    expect(result.withdrawUsed).toBe(true);
    expect(result.winner).toBe('draw');
    expect(result.playerCRP).toBe(0);
    expect(result.aiCRP).toBe(0);
  });
});
