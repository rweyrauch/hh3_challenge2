import { describe, it, expect } from 'vitest';
import { ChallengeEngine, buildInitialState } from '../challengeEngine.js';
import { FakeDiceRoller } from '../dice.js';
import { CUSTODES_CHARACTERS } from '../../data/factions/custodes.js';
import { ORK_CHARACTERS } from '../../data/factions/orks.js';

const VALDOR  = CUSTODES_CHARACTERS.find(c => c.id === 'constantin-valdor')!;
const WARBOSS = ORK_CHARACTERS.find(c => c.id === 'warboss-goffs')!;

/**
 * Run the engine until it reaches 'ended' or maxRounds, feeding fixed input
 * at each faceOff / focus step.  Returns the final state.
 *
 * For simplicity, player always picks:
 *   - gambit: 'seize-the-initiative' (unless overridden per round)
 *   - weapon: weapons[0] / profiles[0]
 */
function runToEnd(
  dice: FakeDiceRoller,
  playerChar = VALDOR,
  aiChar = WARBOSS,
  maxRounds = 20,
) {
  const engine = new ChallengeEngine(playerChar, aiChar, dice);
  let state = buildInitialState(playerChar, aiChar);
  let iterations = 0;

  while (state.phase !== 'ended' && iterations < maxRounds * 10) {
    iterations++;
    let result;

    if (state.phase === 'faceOff' && state.player.selectedGambit === null) {
      result = engine.advance(state, { selectedGambit: 'seize-the-initiative' });
    } else if (state.phase === 'focus' && state.player.selectedWeaponProfile === null) {
      result = engine.advance(state, { selectedWeaponIndex: 0, selectedProfileIndex: 0 });
    } else if (state.phase === 'glory') {
      result = engine.advance(state, { continueChallenge: false });
    } else {
      result = engine.advance(state);
    }

    state = result.state;
  }

  return state;
}

describe('ChallengeEngine', () => {
  it('transitions from setup to ended', () => {
    // Player uses seize-the-initiative (rolls 2d6 in focus, keeps highest).
    // AI may pick any gambit; some (Seize/Finishing Blow/Grandstand) also roll
    // 2d6 in focus, consuming 1 extra die.  Provide 2 extra "1" dice so the
    // sequence works regardless of the AI's gambit choice.
    //
    // Focus:  [6,1] → player keeps 6;  [1,1] → AI keeps 1 (worst case 2 dice)
    // Strike: player wins advantage → 7 hits, 7 wounds, 7 saves (all fail)
    //         Warboss: 7 unsaved × 1 dmg (EW1 on D2) = 7 > W4 → casualty
    const dice = new FakeDiceRoller([
      6, 1, 1, 1,                      // focus: player Seize [6,1]→6; AI [1,(1)]→1
      6,6,6,6,6,6,6,                   // 7 hit dice  (TN 2+, all hit)
      6,6,6,6,6,6,6,                   // 7 wound dice (TN 2+, all wound)
      1,1,1,1,1,1,1,                   // 7 save dice  (Inv 4+, all fail)
    ]);

    const state = runToEnd(dice);
    expect(state.phase).toBe('ended');
  });

  it('player wins when dealing enough damage to cause AI casualty', () => {
    const dice = new FakeDiceRoller([
      // Seize focus: player [6,6] keep highest = 6; ai [1]
      6, 6, 1,
      // strike: d3=1, 7 hits (all 6), 7 wounds (all 6), 7 saves (all 1)
      1,
      6,6,6,6,6,6,6,
      6,6,6,6,6,6,6,
      1,1,1,1,1,1,1,
    ]);

    const state = runToEnd(dice);
    expect(state.phase).toBe('ended');
    // Warboss W=4; total dmg after EW(1): min 1 per wound
    // 7 unsaved × 1 dmg = 7 > 4 → casualty
    expect(state.ai.isCasualty).toBe(true);
    expect(state.playerCRP).toBeGreaterThan(0);
  });

  it('Withdraw allows ending with 0 CRP', () => {
    // Use FakeDice that ensures neither side kills the other,
    // then player withdraws.
    const dice = new FakeDiceRoller([
      // Focus: player [3], ai [2]
      3, 2,
      // Strike (player advantage): d3=1, all misses (roll 1s vs WS6 which needs 5+)
      1, 1,1,1,1,1,1,1,   // 7 attacks, all 1s → miss (WS7 vs WS6 = 2+, actually 1 misses)
      // Wait: WS7 vs WS6 = 2+ means even a 1 misses (need ≥2).
      // AI then attacks: d3=1, all 1s → misses
      1, 1,1,1,1,1,1,
    ]);

    const engine = new ChallengeEngine(VALDOR, WARBOSS, dice);
    let state = buildInitialState(VALDOR, WARBOSS);

    // faceOff: player picks withdraw
    let r = engine.advance(state, { selectedGambit: 'withdraw' });
    state = r.state;

    // focus: weapon selection
    r = engine.advance(state, { selectedWeaponIndex: 0, selectedProfileIndex: 0 });
    state = r.state;

    // Should now be in glory phase after strike resolves
    while (state.phase !== 'glory' && state.phase !== 'ended') {
      r = engine.advance(state);
      state = r.state;
    }

    if (state.phase === 'glory') {
      // Player invokes Withdraw
      r = engine.advance(state, { useWithdraw: true });
      state = r.state;
    }

    expect(state.phase).toBe('ended');
    expect(state.playerCRP).toBe(0);
    expect(state.aiCRP).toBe(0);
  });

  it('Test the Foe: advantage carries to next round', () => {
    // Player uses test-the-foe (1 die in focus; no strike modifiers).
    // VALDOR CI=6 beats WARBOSS CI≤4 so player wins the focus roll even with
    // low dice, keeping both models alive through Round 1.
    //
    // AI may pick any gambit including flurry-of-blows (consumes a d3 die) or
    // a 2-dice focus gambit.  Provide 3 focus dice + 7 player hits + 10 AI
    // attack dice so any combination is covered (all 1s → zero hits/wounds).
    const dice = new FakeDiceRoller([
      1, 1, 1,                         // focus: player [1]+CI6=7; AI [1,(1)]→≤5
      1,1,1,1,1,1,1,                   // player 7 attacks (TN 2+, roll 1 → miss)
      1,1,1,1,1,1,1,1,1,1,            // AI: up to 1 d3 + 9 attacks (all miss)
    ]);

    const engine = new ChallengeEngine(VALDOR, WARBOSS, dice);
    let state = buildInitialState(VALDOR, WARBOSS);

    // Round 1: player picks Test the Foe
    let r = engine.advance(state, { selectedGambit: 'test-the-foe' });
    state = r.state;

    r = engine.advance(state, { selectedWeaponIndex: 0, selectedProfileIndex: 0 });
    state = r.state;

    // Advance through strike and glory
    while (state.phase !== 'glory' && state.phase !== 'ended') {
      r = engine.advance(state);
      state = r.state;
    }

    // End Round 1 (continue)
    if (state.phase === 'glory') {
      r = engine.advance(state, { continueChallenge: true });
      state = r.state;
    }

    // Round 2 should have testTheFoeAdvantage = 'player'
    expect(state.testTheFoeAdvantage).toBe('player');
  });
});
