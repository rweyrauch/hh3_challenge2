import { describe, it, expect } from 'vitest';
import { resolveFocusStep } from '../focusStep.js';
import { FakeDiceRoller } from '../dice.js';
import { CUSTODES_CHARACTERS } from '../../data/factions/custodes.js';
import { ORK_CHARACTERS } from '../../data/factions/orks.js';
import { TRAITOR_LEGION_CHARACTERS } from '../../data/factions/traitorLegions.js';
import { buildInitialState } from '../challengeEngine.js';

const VALDOR     = CUSTODES_CHARACTERS.find(c => c.id === 'constantin-valdor')!;
const TRIBUNE    = CUSTODES_CHARACTERS.find(c => c.id === 'tribune')!;
const WARBOSS    = ORK_CHARACTERS.find(c => c.id === 'warboss-goffs')!;
const MEGA_BOSS  = ORK_CHARACTERS.find(c => c.id === 'mega-warboss')!;
const MAGNUS     = TRAITOR_LEGION_CHARACTERS.find(c => c.id === 'magnus-the-red')!;

function makeState(playerChar = VALDOR, aiChar = WARBOSS) {
  const s = buildInitialState(playerChar, aiChar);
  return {
    ...s,
    player: {
      ...s.player,
      selectedGambit: null as any,
      selectedWeaponProfile: playerChar.weapons[0].profiles[0],
    },
    ai: {
      ...s.ai,
      selectedGambit: null as any,
      selectedWeaponProfile: aiChar.weapons[0].profiles[0],
    },
  };
}

describe('resolveFocusStep', () => {
  it('player wins when player roll is higher', () => {
    // Player rolls 6, AI rolls 1 → player total dominates
    const dice = new FakeDiceRoller([6, 1]);
    const state = makeState();
    const result = resolveFocusStep(dice, state, VALDOR, WARBOSS, null);
    expect(result.advantage).toBe('player');
  });

  it('AI wins when AI roll is higher', () => {
    const dice = new FakeDiceRoller([1, 6]);
    const state = makeState();
    const result = resolveFocusStep(dice, state, VALDOR, WARBOSS, null);
    expect(result.advantage).toBe('ai');
  });

  it('re-rolls on tie until one side wins', () => {
    // First two rolls tie, third pair breaks the tie
    // VALDOR I=6, WARBOSS I=4; roll same raw die, differences come from CI
    // To force a tie: match totals exactly. Both roll 1 first (tie if I is same).
    // Use same characters with same I for tie test → use TRIBUNE vs TRIBUNE
    // Tribune I=6, Warboss I=4 → CI difference = 2.
    // Force raw rolls: player=1, ai=3 → totals: (1+6)=7 vs (3+4)=7 → tie!
    // Second pair: player=4, ai=1 → totals: (4+6)=10 vs (1+4)=5 → player wins
    const dice = new FakeDiceRoller([1, 3, 4, 1]);
    const state = makeState(TRIBUNE, WARBOSS);
    const result = resolveFocusStep(dice, state, TRIBUNE, WARBOSS, null);
    expect(result.advantage).toBe('player');
    expect(result.log.some(l => l.includes('Tie'))).toBe(true);
  });

  it('Seize the Initiative: rolls 2d6 and keeps highest', () => {
    // Player uses Seize the Init → rolls [2,5], keeps 5
    // AI rolls [3] (no gambit)
    // VALDOR I=6, WARBOSS I=4
    // Player total: 5 + 6 + DE2 = 13 (Apollonian Spear has DE+2)
    // AI total: 3 + 4 = 7
    const dice = new FakeDiceRoller([2, 5, 3]);
    const state = {
      ...makeState(),
      player: {
        ...makeState().player,
        selectedGambit: 'seize-the-initiative' as any,
      },
    };
    const result = resolveFocusStep(dice, state, VALDOR, WARBOSS, null);
    expect(result.advantage).toBe('player');
    expect(result.playerRoll.diceKept).toContain(5);
    expect(result.playerRoll.diceKept).not.toContain(2);
  });

  it('Finishing Blow: rolls 2d6 and keeps lowest (worse for focus)', () => {
    // Player uses Finishing Blow → rolls [5,2], keeps 2
    // AI rolls [1]
    // VALDOR I=6: 2+6+2(DE)=10; WARBOSS I=4: 1+4=5 → player still wins due to I+DE
    const dice = new FakeDiceRoller([5, 2, 1]);
    const state = {
      ...makeState(),
      player: {
        ...makeState().player,
        selectedGambit: 'finishing-blow' as any,
        selectedWeaponProfile: VALDOR.weapons[0].profiles[0],
      },
    };
    const result = resolveFocusStep(dice, state, VALDOR, WARBOSS, null);
    expect(result.playerRoll.diceKept).toContain(2);
    expect(result.playerRoll.diceKept).not.toContain(5);
  });

  it('Test the Foe: specified side automatically gets advantage', () => {
    const dice = new FakeDiceRoller([]); // no dice needed
    const state = makeState();
    const result = resolveFocusStep(dice, state, VALDOR, WARBOSS, 'player');
    expect(result.advantage).toBe('player');
    expect(result.log.some(l => l.includes('Test the Foe'))).toBe(true);
  });

  it('Guard Up: accumulated bonus increases total', () => {
    // Player has 2 Guard Up focus bonus from previous round
    const dice = new FakeDiceRoller([1, 6]);
    const state = {
      ...makeState(),
      player: {
        ...makeState().player,
        guardUpFocusBonus: 2,
        selectedWeaponProfile: VALDOR.weapons[0].profiles[0],
      },
    };
    const result = resolveFocusStep(dice, state, VALDOR, WARBOSS, null);
    // Player total = 1 + CI(6) + DE(2) + guardUp(2) = 11; AI = 6 + CI(4) = 10
    expect(result.playerRoll.total).toBe(11);
    expect(result.advantage).toBe('player');
  });

  it('Battle of the Wills: adds WP difference as flat Focus bonus', () => {
    // Magnus WP=10 vs WARBOSS WP=9 → flatBonus = max(0, 10−9) = +1
    // Magnus CI = I(6) + no I modifier = 6; DE = 0 (Blade of Ahn-nunurta has no DuellistsEdge)
    // Dice: player rolls 4, AI rolls 1
    // Magnus total = 4 + CI(6) + bonus(1) = 11; WARBOSS total = 1 + CI(4) = 5
    const dice = new FakeDiceRoller([4, 1]);
    const state = {
      ...makeState(MAGNUS, WARBOSS),
      player: {
        ...makeState(MAGNUS, WARBOSS).player,
        selectedGambit: 'battle-of-the-wills' as any,
      },
    };
    const result = resolveFocusStep(dice, state, MAGNUS, WARBOSS, null);
    expect(result.playerRoll.total).toBe(11);
    expect(result.playerRoll.modifiers).toBe(1); // WP bonus only, no DE
    expect(result.advantage).toBe('player');
  });

  it('Battle of the Wills: no bonus when WP difference is zero or negative', () => {
    // Magnus WP=10 vs opponent with WP=10 → flatBonus = max(0, 10−10) = 0
    // Dice: player rolls 4, AI rolls 1
    // Magnus total = 4 + CI(6) + 0 = 10
    const opponentWP10 = { ...WARBOSS, stats: { ...WARBOSS.stats, WP: 10 } };
    const dice = new FakeDiceRoller([4, 1]);
    const state = {
      ...makeState(MAGNUS, opponentWP10),
      player: {
        ...makeState(MAGNUS, opponentWP10).player,
        selectedGambit: 'battle-of-the-wills' as any,
      },
    };
    const result = resolveFocusStep(dice, state, MAGNUS, opponentWP10, null);
    expect(result.playerRoll.total).toBe(10);
    expect(result.playerRoll.modifiers).toBe(0); // no bonus
    expect(result.advantage).toBe('player');
  });
});
