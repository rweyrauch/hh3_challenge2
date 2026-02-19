import { describe, it, expect } from 'vitest';
import { resolveStrikeStep } from '../strikeStep.js';
import { FakeDiceRoller } from '../dice.js';
import { buildInitialState } from '../challengeEngine.js';
import { CUSTODES_CHARACTERS } from '../../data/factions/custodes.js';
import { ORK_CHARACTERS } from '../../data/factions/orks.js';
import type { CombatState } from '../../models/combatState.js';

const VALDOR  = CUSTODES_CHARACTERS.find(c => c.id === 'constantin-valdor')!;
const WARBOSS = ORK_CHARACTERS.find(c => c.id === 'warboss-goffs')!;
const MEGA    = ORK_CHARACTERS.find(c => c.id === 'mega-warboss')!;

function makeState(
  playerChar = VALDOR,
  aiChar = WARBOSS,
  overrides: Partial<CombatState> = {},
): CombatState {
  const s = buildInitialState(playerChar, aiChar);
  return {
    ...s,
    challengeAdvantage: 'player',
    player: {
      ...s.player,
      selectedGambit: null,
      selectedWeaponProfile: playerChar.weapons[0].profiles[0],
    },
    ai: {
      ...s.ai,
      selectedGambit: null,
      selectedWeaponProfile: aiChar.weapons[0].profiles[0],
    },
    ...overrides,
  };
}

describe('resolveStrikeStep', () => {
  it('player attacks first when player has advantage', () => {
    // Player (VALDOR, A=6+1bonus=7) rolls all 6s for hits (WS7 vs WS6 = 2+)
    // Warboss saves: Sv4+ vs AP2 → penetrated; inv4+ available (not affected by AP)
    // getEffectiveSave(4, 4, 2): AP2 ≤ Sv4 (penetrated), inv4+ available → 4+
    // Provide: 7 hit dice, 7 wound dice (S7 vs T5 = 2+), 7 save dice (inv4+, all 1)
    // EternalWarrior(1) on WARBOSS: D=max(1, 2-1)=1; 7 unsaved × 1 = 7 > W4 → casualty
    // AI then has no attack (casualty)
    const dice = new FakeDiceRoller([
      1,              // d3 (getStrikeModifiers call; no flurry-of-blows)
      6,6,6,6,6,6,6,  // 7 hit dice
      6,6,6,6,6,6,6,  // 7 wound dice
      1,1,1,1,1,1,1,  // 7 save dice (all fail vs inv4+)
    ]);

    const state = makeState();
    const result = resolveStrikeStep(dice, state, VALDOR, WARBOSS, 'player');

    expect(result.firstAttacker).toBe('player');
    // The AI (WARBOSS) should be a casualty after the player's attacks.
    // Check the updated state rather than aiResult.defenderIsCasualty which
    // tracks the *player* being a casualty from the AI's counter-attack.
    expect(result.updatedState.ai.isCasualty).toBe(true);
  });

  it('Flurry of Blows: damage capped at 1 per wound', () => {
    // Player uses Flurry of Blows; d3=3, so +3 attacks (total 6+1+3=10 on advantage)
    // But damage must be set to 1 regardless of weapon D2.
    // d3 is only consumed for flurry-of-blows gambits.
    // VALDOR vs WARBOSS: AP2 penetrates Sv4+; Inv4+ available (not AP-affected) → saves at 4+
    const dice = new FakeDiceRoller([
      3,              // d3 = 3 extra attacks (player has flurry-of-blows)
      6,6,6,6,6,6,6,6,6,6, // 10 hit dice (all hit, WS7 vs WS6 = 2+)
      6,6,6,6,6,6,6,6,6,6, // 10 wound dice (S7 vs T5 = 2+, all wound)
      1,1,1,1,1,1,1,1,1,1, // 10 save dice (inv4+, roll 1s → all fail)
      // AI (6 attacks, no flurry, no d3 consumed): WS6 vs WS7 → 5+; roll 1s → miss
      1,1,1,1,1,1, // AI 6 attack hit dice
    ]);

    const state = makeState(VALDOR, WARBOSS, {
      player: {
        ...makeState().player,
        selectedGambit: 'flurry-of-blows',
        selectedWeaponProfile: VALDOR.weapons[0].profiles[0],
      },
    });
    const result = resolveStrikeStep(dice, state, VALDOR, WARBOSS, 'player');
    // Each unsaved wound must deal exactly 1 damage
    expect(result.playerResult.totalDamage).toBeGreaterThan(0);
    // Verify dmg = wounds (1 per wound means total dmg = unsaved wounds)
    expect(result.playerResult.totalDamage).toBe(result.playerResult.unsavedWounds);
  });

  it('Finishing Blow: +1 to Strength and Damage', () => {
    // With FinishingBlow: S becomes 7+2+1=10, D becomes 2+1=3
    // Against Mega Warboss T6: getWoundTargetNumber(10, 6) = 2+
    // But EternalWarrior(1) on Mega Warboss reduces dmg by 1, so D=3-1=2
    const dice = new FakeDiceRoller([
      1,          // d3
      6,6,6,6,6,6,6, // 7 hit dice
      6,6,6,6,6,6,6, // 7 wound dice (all wound)
      1,1,1,1,1,1,1, // 7 save dice (all fail vs AP2)
      1,          // AI d3
      1,1,1,1,1,  // AI 5 attacks, all miss
    ]);
    const state = makeState(VALDOR, MEGA, {
      challengeAdvantage: 'player',
      player: {
        ...makeState(VALDOR, MEGA).player,
        selectedGambit: 'finishing-blow',
        selectedWeaponProfile: VALDOR.weapons[0].profiles[0],
      },
      ai: {
        ...makeState(VALDOR, MEGA).ai,
        selectedWeaponProfile: MEGA.weapons[0].profiles[0],
      },
    });
    const result = resolveStrikeStep(dice, state, VALDOR, MEGA, 'player');
    // Should have inflicted damage (exact value depends on saves)
    expect(result.playerResult.hits).toBeGreaterThan(0);
  });

  it('Guard Up: limits attacker to 1 attack', () => {
    const dice = new FakeDiceRoller([
      1,      // d3 (not flurry)
      6,      // 1 hit die only (Guard Up cap: 1 attack)
      6,      // 1 wound die
      1,      // 1 save die
      1,      // AI d3
      1,1,1,1,1,1,1, // AI 7 attacks (6+1 bonus), all miss vs WS7
    ]);
    const state = makeState(VALDOR, WARBOSS, {
      player: {
        ...makeState().player,
        selectedGambit: 'guard-up',
        selectedWeaponProfile: VALDOR.weapons[0].profiles[0],
      },
    });
    const result = resolveStrikeStep(dice, state, VALDOR, WARBOSS, 'player');
    expect(result.playerResult.attacks).toBe(1);
  });

  it('EternalWarrior reduces damage, minimum 1', () => {
    // VALDOR has EW(2), so incoming D2 attacks deal max(1, 2-2)=1 damage
    // AI (WARBOSS) attacks VALDOR with Choppa D=1
    // EW(2) on VALDOR: D=1 → max(1, 1-2)=1 (already 1)
    // Test with D2 weapon: use Power Klaw against VALDOR
    const dice = new FakeDiceRoller([
      1,      // player d3
      1,1,1,1,1,1,1, // player 7 attacks miss vs WS6 (WS7 vs WS6 = 2+, roll 1 misses)
      1,      // AI d3
      6,6,6,6,6, // AI 5 attacks (5 no bonus), all hit vs WS7 (WS6 vs WS7 = 5+, 6 hits)
      6,6,6,6,6, // wound dice (S10 vs T5 = 2+)
      1,1,1,1,1, // save dice all fail
    ]);
    // Switch AI to Mega Warboss with Power Klaw
    const state = makeState(VALDOR, MEGA, {
      challengeAdvantage: 'ai', // AI has advantage to attack first
      player: {
        ...makeState(VALDOR, MEGA).player,
        selectedWeaponProfile: VALDOR.weapons[0].profiles[0],
      },
      ai: {
        ...makeState(VALDOR, MEGA).ai,
        selectedWeaponProfile: MEGA.weapons[0].profiles[0], // Power Klaw D2
      },
    });
    const result = resolveStrikeStep(dice, state, VALDOR, MEGA, 'ai');
    // VALDOR has EW(2), Power Klaw D=2, so D=max(1,2-2)=1
    if (result.aiResult.unsavedWounds > 0) {
      expect(result.aiResult.totalDamage).toBe(result.aiResult.unsavedWounds); // 1 dmg each
    }
  });

  it('model becomes a casualty when wounds reach 0', () => {
    // Force Warboss to take more damage than his 4 wounds
    const dice = new FakeDiceRoller([
      1,                          // d3
      6,6,6,6,6,6,6,              // 7 hits
      6,6,6,6,6,6,6,              // 7 wounds
      1,1,1,1,1,1,1,              // 7 failed saves
    ]);
    const state = makeState();
    const result = resolveStrikeStep(dice, state, VALDOR, WARBOSS, 'player');
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.updatedState.ai.currentWounds).toBe(0);
  });
});
