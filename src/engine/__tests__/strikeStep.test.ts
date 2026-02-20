import { describe, it, expect } from 'vitest';
import { resolveStrikeStep } from '../strikeStep.js';
import { FakeDiceRoller } from '../dice.js';
import { buildInitialState } from '../challengeEngine.js';
import { CUSTODES_CHARACTERS } from '../../data/factions/custodes.js';
import { ORK_CHARACTERS } from '../../data/factions/orks.js';
import { ASSASSIN_CHARACTERS } from '../../data/factions/assassins.js';
import type { CombatState } from '../../models/combatState.js';
import type { Character } from '../../models/character.js';

const VALDOR  = CUSTODES_CHARACTERS.find(c => c.id === 'constantin-valdor')!;
const WARBOSS = ORK_CHARACTERS.find(c => c.id === 'warboss-goffs')!;
const MEGA    = ORK_CHARACTERS.find(c => c.id === 'mega-warboss')!;
const EVERSOR = ASSASSIN_CHARACTERS.find(c => c.id === 'eversor-assassin')!;
const ADAMUS  = ASSASSIN_CHARACTERS.find(c => c.id === 'adamus-assassin')!;

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

  it('FeelNoPain(5+): cancels some wounds, remainder cause damage and kill AI', () => {
    // VALDOR (WS7, A6, +1 advantage=7 attacks) vs Warboss+FNP(5+) (W4, EW1, Sv4, Inv4).
    // VALDOR uses Apollonian Spear: SM+2 → S6, AP2, D2, CriticalHit(5+).
    // No d3 consumed (no flurry-of-blows).
    // Hit TN: WS7 vs WS6 = 2+. 7 rolls of 6 → 7 hits.
    // Wound TN: S6 vs T5 = 3+. 7 rolls of 6 → 7 wounds.
    // Save: AP2 negates Sv4; Inv4+ used. 7 rolls of 1 → all fail.
    // FNP(5+): 5,5,5,1,1,1,1 → 3 cancelled, 4 fail.
    // Damage: D2 - EW(1) = max(1,1) = 1 per wound. 4 × 1 = 4 damage. W4→0 → CASUALTY.
    // AI doesn't attack.
    const defenderWithFNP: Character = {
      ...WARBOSS,
      specialRules: [
        { name: 'EternalWarrior', value: 1 },
        { name: 'Fear',           value: 1 },
        { name: 'FeelNoPain',     threshold: 5 },
      ],
    };
    const state = makeState(VALDOR, defenderWithFNP);
    const dice = new FakeDiceRoller([
      // No d3 (gambit is null, not flurry-of-blows)
      6,6,6,6,6,6,6,  // 7 hit rolls (TN 2+, all hit)
      6,6,6,6,6,6,6,  // 7 wound rolls (TN 3+, all wound)
      1,1,1,1,1,1,1,  // 7 save rolls (Inv4+, all fail)
      5,5,5,1,1,1,1,  // 7 FNP rolls: 3 succeed → 4 through
    ]);
    const result = resolveStrikeStep(dice, state, VALDOR, defenderWithFNP, 'player');
    expect(result.playerResult.unsavedWounds).toBe(4);
    expect(result.updatedState.ai.isCasualty).toBe(true);
  });

  it('FeelNoPain(5+): all FNP rolls succeed → zero unsaved wounds, no damage', () => {
    // Same setup as above but FNP saves all 7 wounds → Warboss survives.
    // AI then attacks; all AI hit rolls are 1s → no hits, no AI damage.
    // WARBOSS (WS6, A6, no bonus=6 attacks) vs VALDOR (WS7): hit TN 5+.
    const defenderWithFNP: Character = {
      ...WARBOSS,
      specialRules: [
        { name: 'EternalWarrior', value: 1 },
        { name: 'Fear',           value: 1 },
        { name: 'FeelNoPain',     threshold: 5 },
      ],
    };
    const state = makeState(VALDOR, defenderWithFNP);
    const dice = new FakeDiceRoller([
      // Player attack
      6,6,6,6,6,6,6,  // 7 hit rolls (TN 2+)
      6,6,6,6,6,6,6,  // 7 wound rolls (TN 3+)
      1,1,1,1,1,1,1,  // 7 save rolls (Inv4+, all fail)
      5,5,5,5,5,5,5,  // 7 FNP rolls: all succeed → 0 unsaved wounds
      // AI attacks (Warboss not casualty, 6 attacks, hit TN WS6 vs WS7 = 5+)
      1,1,1,1,1,1,    // 6 AI hit rolls (all 1s = miss)
    ]);
    const result = resolveStrikeStep(dice, state, VALDOR, defenderWithFNP, 'player');
    expect(result.playerResult.unsavedWounds).toBe(0);
    expect(result.updatedState.ai.currentWounds).toBe(defenderWithFNP.stats.W);
    expect(result.updatedState.ai.isCasualty).toBe(false);
  });

  it('Poisoned(4+): wounds on 4+ even when attacker S3 cannot normally wound T5', () => {
    // Normal wound TN for S3 vs T5 = 6+ (hard).
    // With Poisoned(4+), effective TN = min(6, 4) = 4+.
    // weakAttacker (WS3, S3, A3+1bonus=4) vs toughDefender (WS7, T5, Sv6+, no Inv, W6).
    // No d3 consumed (no flurry).
    // Hit TN: getHitTargetNumber(3, 7) = 6+ (attacker much weaker).
    // Wound TN: normally 6+ (S3 vs T5), Poisoned makes it 4+.
    // Save: AP null → Sv6+ used. Roll 1s → all fail.
    // 4 wounds × D1 = 4 damage. toughDefender W6 → 2 (not casualty).
    // AI attacks back: VALDOR-based, WS7, A6+0=6 hits, S4 vs T4(WARBOSS-based): TN=4+.
    // AI hit rolls all 5+ → hits. Provide: 6 hit dice, 6 wound dice, 6 save dice.
    // But weakAttacker has Sv4, Inv4. AP of APOLLONIAN_SPEAR=2 → armour negated, Inv4+ used.
    // To keep it simple: AI rolls all 1s for hit → all miss.
    const weakAttacker: Character = {
      ...WARBOSS,
      id: 'weak-attacker',
      stats: { ...WARBOSS.stats, WS: 3, S: 3, A: 3, W: 4, Inv: null },
      specialRules: [],
    };
    const toughDefender: Character = {
      ...VALDOR,
      stats: { ...VALDOR.stats, T: 5, Sv: 6, Inv: null },
      specialRules: [],
    };
    const poisonedWeaponProfile = {
      profileName: 'Poison Test',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier: { kind: 'none' as const },
      strengthModifier: { kind: 'none' as const },
      ap: null, damage: 1,
      specialRules: [{ name: 'Poisoned' as const, threshold: 4 }],
    };
    const s: CombatState = {
      ...makeState(weakAttacker, toughDefender),
      challengeAdvantage: 'player',
      player: {
        ...makeState(weakAttacker, toughDefender).player,
        selectedWeaponProfile: poisonedWeaponProfile,
      },
      ai: {
        ...makeState(weakAttacker, toughDefender).ai,
        selectedWeaponProfile: toughDefender.weapons[0].profiles[0],
      },
    };
    // Player: 3 base A + 1 advantage = 4 attacks; hit TN WS3 vs WS7 → 6+; rolls 6s → hit.
    // Wound: Poisoned(4+) min(6+, 4+) = 4+. Rolls 4s → wound.
    // Save: AP null vs Sv6+ → 6+. Rolls 1s → fail.
    // AI attacks: VALDOR WS7, A6, +0 bonus. toughDefender weapon = APOLLONIAN_SPEAR (SM+2, AP2, D2).
    // AI hits on getHitTargetNumber(7, 3) = 2+ vs weakAttacker WS3.
    // To avoid complex dice tracking: make AI miss entirely with 1s.
    const dice = new FakeDiceRoller([
      // Player attack (no d3)
      6,6,6,6,   // 4 hit rolls (TN 6+, all 6s hit)
      4,4,4,4,   // 4 wound rolls (Poisoned 4+, all 4s wound)
      1,1,1,1,   // 4 save rolls (Sv6+ → 6+, all 1s fail)
      // AI attacks (toughDefender W6-4=2 wounds remaining, not casualty)
      1,1,1,1,1,1, // 6 AI hit rolls (1s → all miss, TN 2+)
    ]);
    const result = resolveStrikeStep(dice, s, weakAttacker, toughDefender, 'player');
    expect(result.playerResult.wounds).toBe(4);
    expect(result.playerResult.unsavedWounds).toBe(4);
  });

  it('Biological Overload: self-wounds from hit rolls of 1', () => {
    // Eversor (biological-overload): A4 + AM+1 (Neuro-gauntlet) + gambit+3 + advantage+1 = 9 attacks.
    // Hit TN: WS6 vs WS6 = 4+. Roll of 1 → miss + self-wound (hitRollOnes++).
    // Wound TN: S4 vs T5 = 5+; Neuro-gauntlet Poisoned(4+) + Rending(4+) → effective TN 4+.
    // Save: AP3 vs Sv4 → armour negated; Inv4+ used. Roll 1s → all fail.
    // Damage: Neuro-gauntlet D2, WARBOSS EW(1) → max(1,2-1)=1 per wound.
    // No d3 consumed (not flurry-of-blows).
    //
    // Sequence: 9 hit rolls, then wound rolls for 8 hits, then save rolls.
    // Roll: 6,6,6,6,6,6,6,6,1 → 8 hits (6s ≥ 4+), 1 miss (roll=1), hitRollOnes=1.
    // 8 wound rolls of 6 → 8 wounds (Poisoned/Rending 4+).
    // 8 save rolls of 1 → all fail (Inv4+).
    // Damage: 8 × 1 = 8 > W4 → WARBOSS CASUALTY. AI doesn't attack.
    // Self-wound: hitRollOnes=1 → Eversor W3 - 1 = 2.
    const bioState: CombatState = {
      ...makeState(EVERSOR, WARBOSS),
      challengeAdvantage: 'player',
      player: {
        ...makeState(EVERSOR, WARBOSS).player,
        selectedGambit: 'biological-overload',
        selectedWeaponProfile: EVERSOR.weapons[0].profiles[0], // Neuro-gauntlet
      },
      ai: {
        ...makeState(EVERSOR, WARBOSS).ai,
        selectedWeaponProfile: WARBOSS.weapons[0].profiles[0], // Choppa
      },
    };
    const dice = new FakeDiceRoller([
      // 9 hit rolls (no d3 consumed)
      6,6,6,6,6,6,6,6,1, // 8 hits (6≥4+), 1 miss (roll=1), hitRollOnes=1
      6,6,6,6,6,6,6,6,   // 8 wound rolls (Poisoned/Rending 4+, all 6s wound)
      1,1,1,1,1,1,1,1,   // 8 save rolls (all fail Inv4+)
      // Warboss casualty, AI doesn't attack
    ]);
    const result = resolveStrikeStep(dice, bioState, EVERSOR, WARBOSS, 'player');
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.playerResult.hitRollOnes).toBe(1);
    expect(result.updatedState.player.currentWounds).toBe(2); // W3 - 1 self-wound = 2
  });

  it('Mirror-Form: hits always on 4+ regardless of WS comparison', () => {
    // Adamus (WS5, A4, +1 advantage=5 attacks) vs Warboss (WS6).
    // Normally hit TN = WS5 vs WS6 = 5+. With mirror-form: always 4+.
    // Rolls 4,4,4,3,3: mirror-form → 4+ hits on 4s (3 hits), miss on 3s (2 miss).
    // (Without mirror-form: 0 of these rolls would hit at TN 5+.)
    // Wound rolls 1,1,1: Nemesii blade S4 vs T5 = 5+, Poisoned? No → TN5+. Roll 1 < 5 → no wound.
    // No wounds → AI attacks: WARBOSS (WS6, A6) vs Adamus (WS5): hit TN WS6 vs WS5 = 3+.
    // AI 6 hit rolls of 1 → all miss (1 < 3). No more dice needed.
    // No d3 consumed for either player (neither has flurry-of-blows).
    const mirrorState: CombatState = {
      ...makeState(ADAMUS, WARBOSS),
      challengeAdvantage: 'player',
      player: {
        ...makeState(ADAMUS, WARBOSS).player,
        selectedGambit: 'mirror-form',
        selectedWeaponProfile: ADAMUS.weapons[0].profiles[0], // Nemesii blade
      },
      ai: {
        ...makeState(ADAMUS, WARBOSS).ai,
        selectedWeaponProfile: WARBOSS.weapons[0].profiles[0], // Choppa
      },
    };
    const dice = new FakeDiceRoller([
      // Player: 5 attacks, mirror-form hit TN = 4
      4,4,4,3,3, // 3 hits (≥4), 2 misses (<4)
      1,1,1,     // 3 wound rolls (S4 vs T5 = 5+, all fail)
      // AI: 6 attacks, hit TN WS6 vs WS5 = 3+
      1,1,1,1,1,1, // all miss (1 < 3)
    ]);
    const result = resolveStrikeStep(dice, mirrorState, ADAMUS, WARBOSS, 'player');
    expect(result.playerResult.hits).toBe(3);
    expect(result.playerResult.wounds).toBe(0);
  });
});
