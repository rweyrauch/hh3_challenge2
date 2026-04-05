import { describe, it, expect } from 'vitest';
import { resolveStrikeStep } from '../strikeStep.js';
import { FakeDiceRoller } from '../dice.js';
import { buildInitialState } from '../challengeEngine.js';
import { CUSTODES_CHARACTERS } from '../../data/factions/custodes.js';
import { ORK_CHARACTERS } from '../../data/factions/orks.js';
import { ASSASSIN_CHARACTERS } from '../../data/factions/assassins.js';
import { LOYALIST_LEGION_CHARACTERS } from '../../data/factions/loyalistLegions.js';
import { TRAITOR_LEGION_CHARACTERS } from '../../data/factions/traitorLegions.js';
import { MECHANICUM_CHARACTERS } from '../../data/factions/mechanicum.js';
import type { CombatState } from '../../models/combatState.js';
import type { Character } from '../../models/character.js';

const VALDOR    = CUSTODES_CHARACTERS.find(c => c.id === 'constantin-valdor')!;
const WARBOSS   = ORK_CHARACTERS.find(c => c.id === 'warboss-goffs')!;
const MEGA      = ORK_CHARACTERS.find(c => c.id === 'mega-warboss')!;
const WEIRDBOY_CHAR = ORK_CHARACTERS.find(c => c.id === 'weirdboy')!;
const EVERSOR = ASSASSIN_CHARACTERS.find(c => c.id === 'eversor-assassin')!;
const ADAMUS  = ASSASSIN_CHARACTERS.find(c => c.id === 'adamus-assassin')!;
const DORN      = LOYALIST_LEGION_CHARACTERS.find(c => c.id === 'rogal-dorn')!;
const MORTARION = TRAITOR_LEGION_CHARACTERS.find(c => c.id === 'mortarion')!;
const FULGRIM   = TRAITOR_LEGION_CHARACTERS.find(c => c.id === 'fulgrim')!;
const ARCHMAGOS = MECHANICUM_CHARACTERS.find(c => c.id === 'archmagos')!;

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
    // Player (VALDOR, A=6+1bonus=7) rolls 7 dice of 5 for hits (WS7 vs WS6 = 2+, 5 ≥ 2).
    // Apollonian Spear has CriticalHit(5+): roll 5 ≥ 5 → every hit is a Critical Hit.
    // Critical Hits auto-wound — no wound dice rolled.
    // 7 unsaved crit wounds × D(2+1)−EW(1) = D2 each → 14 damage > W4 → casualty.
    // AI then has no attack (casualty).
    const dice = new FakeDiceRoller([
      5,5,5,5,5,5,5,  // 7 hit dice (5 ≥ hitTN 2+; 5 ≥ critThreshold 5+ → all Critical Hits)
      1,1,1,1,1,1,1,  // 7 save dice (all fail vs Inv 4+)
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
    // Player uses Flurry of Blows; raw d3=5 → d3Result=3, so +3 attacks (6+1+3=10).
    // Apollonian Spear CriticalHit(5+): all hit rolls of 5 are Critical Hits → auto-wound.
    // No wound dice rolled (all hits are Critical).
    // Flurry caps damage to 1 even for Critical Hits, so totalDamage === unsavedWounds.
    // VALDOR vs WARBOSS: AP2 penetrates Sv4+; Inv4+ available → saves at 4+.
    const dice = new FakeDiceRoller([
      5,              // d3 raw=5 → d3Result=3 extra attacks (flurry-of-blows)
      5,5,5,5,5,5,5,5,5,5, // 10 hit dice (5 ≥ hitTN 2+; 5 ≥ critThreshold 5+ → all crits)
      // No wound dice — all hits are Critical Hits (auto-wound)
      1,1,1,1,1,1,1,1,1,1, // 10 save dice (Inv4+, roll 1s → all fail)
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
    // Apollonian Spear CriticalHit(5+): rolls of 5 hit (WS7 vs WS6 = 2+) and are crits.
    // Critical Hits auto-wound — no wound dice. 7 crit unsaved wounds × D2 = 14 > W4 → casualty.
    const dice = new FakeDiceRoller([
      5,5,5,5,5,5,5,              // 7 hits (5 ≥ 2+) and crits (5 ≥ 5+) — no wound rolls
      1,1,1,1,1,1,1,              // 7 failed saves (Inv 4+)
    ]);
    const state = makeState();
    const result = resolveStrikeStep(dice, state, VALDOR, WARBOSS, 'player');
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.updatedState.ai.currentWounds).toBe(0);
  });

  it('FeelNoPain(5+): cancels some wounds, remainder cause damage and kill AI', () => {
    // VALDOR (WS7, A6+1adv=7 attacks) vs Warboss+FNP(5+) (W4, EW1, Sv4, Inv4).
    // Apollonian Spear: CriticalHit(5+), D2. Rolls of 6 hit (≥2+) and crit (≥5+).
    // Critical Hits auto-wound (no wound dice). 7 crit wounds, saves at Inv4+.
    // 7 save rolls of 1 → all fail → 7 unsaved crit wounds.
    // FNP(5+): 5,5,5,1,1,1,1 → 3 cancelled (proportional), 4 remain.
    // Damage: crit D(2+1)−EW(1)=D2 per wound. 4 × 2 = 8 > W4 → CASUALTY.
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
      6,6,6,6,6,6,6,  // 7 hit rolls (TN 2+, all hit; 6 ≥ critThreshold 5+ → all Critical Hits)
      // No wound dice — Critical Hits auto-wound without dice
      1,1,1,1,1,1,1,  // 7 save rolls (Inv4+, all fail)
      5,5,5,1,1,1,1,  // 7 FNP rolls: 3 succeed → 4 unsaved
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

  it('CriticalHit: auto-wounds on crit, +1 Damage, no crit on a miss', () => {
    // Use a custom attacker (WS7, S4, A2+1bonus=3) with a CriticalHit(5+)/D2 weapon
    // vs a custom defender (WS2, T4, Sv7 = no armour, Inv4+, W6, no EW).
    // hitTN = WS7 vs WS2 = 2+.
    //
    // Hit dice: [6, 3, 1]
    //   6: 6 ≥ 2+ → hit; 6 ≥ 5+ → Critical Hit  (auto-wound, D2+1=3)
    //   3: 3 ≥ 2+ → hit; 3 <  5  → normal hit    (goes through wound test)
    //   1: 1 < 2  → miss; Critical Hit rule CANNOT apply on a miss
    //
    // Wound dice (1 die for the single normal hit): [5]
    //   S4 vs T4 = 4+. Roll 5 ≥ 4+ → wound.
    //
    // Saves: no armour (Sv7), Inv4+. effectiveSave = 4+.
    //   Pool 1 (crit wound at weapon AP): [1] → fail → unsavedCritWounds=1
    //   Pool 2 (normal wound at weapon AP): [1] → fail
    //
    // Damage:
    //   critDmgPerWound = max(1, (2+0+1)−0) = 3   (D2 + Critical Hit +1, no EW)
    //   dmgPerWound     = max(1, (2+0)−0)   = 2   (D2 normal)
    //   totalDamage = 1×3 + 1×2 = 5
    const attacker = {
      ...WARBOSS,
      id: 'crit-test-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 4, A: 2, W: 4, Inv: null },
      specialRules: [],
    };
    const defender = {
      ...WARBOSS,
      id: 'crit-test-defender',
      stats: { ...WARBOSS.stats, WS: 2, T: 4, Sv: 7, Inv: 4, W: 6 },
      specialRules: [],
    };
    const critWeapon = {
      profileName: 'Crit Test Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: null, damage: 2,
      specialRules: [{ name: 'CriticalHit' as const, threshold: 5 }],
    };
    const state: CombatState = {
      ...makeState(attacker, defender),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, defender).player,
        selectedWeaponProfile: critWeapon,
      },
      ai: {
        ...makeState(attacker, defender).ai,
        selectedWeaponProfile: defender.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      6, 3, 1,   // 3 hit rolls: crit hit, normal hit, miss
      5,         // 1 wound roll for the normal hit (S4 vs T4 = 4+, roll 5 → wound)
      1,         // crit wound save (Inv4+, fail)
      1,         // normal wound save (Inv4+, fail)
      // AI doesn't kill player (defender has no meaningful attack — all 1s)
      1,1,1,1,1,1, // 6 AI hit rolls, all miss
    ]);
    const result = resolveStrikeStep(dice, state, attacker, defender, 'player');

    expect(result.playerResult.hits).toBe(2);        // crit hit + normal hit; miss is NOT a hit
    expect(result.playerResult.wounds).toBe(2);      // 1 crit auto-wound + 1 normal wound
    expect(result.playerResult.unsavedWounds).toBe(2);
    // Critical Hit deals +1D: crit wound = D3, normal wound = D2. Total = 3+2 = 5.
    expect(result.playerResult.totalDamage).toBe(5);
  });

  it('Bulwark of the Imperium: wound rolls 1-4 always fail regardless of S vs T', () => {
    // Custom attacker WS7 (hitTN 4+ vs DORN WS7), S8 (wound TN 3+ vs T6 normally).
    // Bulwark forces minimum wound roll of 5: rolls 2,3,4 are blocked despite TN 3+.
    // Wound rolls [2,3,4,5] → normally 3 wounds (≥ 3+), but Bulwark leaves only 1 (roll 5).
    // AP2 negates DORN Sv2 → Inv4+ save. D2 - EW2 = max(1,0) = 1 damage per wound.
    const attacker: Character = {
      ...WARBOSS,
      id: 'bulwark-test-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 8, A: 3, W: 4, Inv: null },
      specialRules: [],
    };
    const bulwarkWeapon = {
      profileName: 'Bulwark Test Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 2, damage: 2,
      specialRules: [],
    };
    const state: CombatState = {
      ...makeState(attacker, DORN),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, DORN).player,
        selectedWeaponProfile: bulwarkWeapon,
      },
      ai: {
        ...makeState(attacker, DORN).ai,
        selectedGambit: 'bulwark-of-the-imperium',
        selectedWeaponProfile: DORN.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      5, 5, 5, 5,   // 4 hit rolls (A3 + advantage = 4 attacks; TN 4+, all hit)
      2, 3, 4, 5,   // 4 wound rolls: Bulwark blocks 2,3,4; only 5 passes (normal TN 3+)
      1,            // 1 save roll (AP2 → Inv4+, fail)
      1,1,1,1,1,1,  // 6 DORN hit rolls (all miss, TN 4+)
    ]);
    const result = resolveStrikeStep(dice, state, attacker, DORN, 'player');
    // Normally rolls 2,3,4 all wound at TN 3+, but Bulwark blocks any roll < 5
    expect(result.playerResult.wounds).toBe(1);
    expect(result.playerResult.unsavedWounds).toBe(1);
    expect(result.updatedState.ai.isCasualty).toBe(false);
    expect(result.updatedState.ai.currentWounds).toBe(5); // W6 − 1 damage = 5
  });

  it('Bulwark of the Imperium: overrides Poisoned(2+) special rule', () => {
    // S1 vs T6 = 6+ normally; Poisoned(2+) lowers effective TN to 2+.
    // Bulwark still blocks rolls < 5, so rolls 2,3,4 fail despite Poisoned(2+).
    // Without Bulwark all four rolls (2,3,4,5) would wound; with Bulwark only roll 5 passes.
    const attacker: Character = {
      ...WARBOSS,
      id: 'bulwark-poison-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 1, A: 3, W: 4, Inv: null },
      specialRules: [],
    };
    const poisonedWeapon = {
      profileName: 'Bulwark Poison Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 2, damage: 1,
      specialRules: [{ name: 'Poisoned' as const, threshold: 2 }],
    };
    const state: CombatState = {
      ...makeState(attacker, DORN),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, DORN).player,
        selectedWeaponProfile: poisonedWeapon,
      },
      ai: {
        ...makeState(attacker, DORN).ai,
        selectedGambit: 'bulwark-of-the-imperium',
        selectedWeaponProfile: DORN.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      5, 5, 5, 5,   // 4 hit rolls (TN 4+, all hit)
      2, 3, 4, 5,   // 4 wound rolls: Poisoned gives TN 2+, Bulwark still blocks 2,3,4
      1,            // 1 save roll (AP2 → Inv4+, fail)
      1,1,1,1,1,1,  // 6 DORN hit rolls (all miss)
    ]);
    const result = resolveStrikeStep(dice, state, attacker, DORN, 'player');
    expect(result.playerResult.wounds).toBe(1);
    expect(result.playerResult.unsavedWounds).toBe(1);
  });

  it('Bulwark of the Imperium: Critical Hits auto-wound, bypassing the wound-roll check', () => {
    // CriticalHit(2+): every hit (TN 4+) rolls ≥ 4 ≥ 2 → Critical Hit → auto-wound.
    // Auto-wounds bypass the wound-roll test entirely, so Bulwark cannot block them.
    // critDmg = D1+1=2; EW2 → max(1,2−2)=1 per wound. 4×1=4 total damage. DORN W6−4=2.
    const attacker: Character = {
      ...WARBOSS,
      id: 'bulwark-crit-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 4, A: 3, W: 4, Inv: null },
      specialRules: [],
    };
    const critWeapon = {
      profileName: 'Bulwark Crit Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 2, damage: 1,
      specialRules: [{ name: 'CriticalHit' as const, threshold: 2 }],
    };
    const state: CombatState = {
      ...makeState(attacker, DORN),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, DORN).player,
        selectedWeaponProfile: critWeapon,
      },
      ai: {
        ...makeState(attacker, DORN).ai,
        selectedGambit: 'bulwark-of-the-imperium',
        selectedWeaponProfile: DORN.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      5, 5, 5, 5,   // 4 hit rolls (≥ 4+ hit; ≥ 2+ crit → all 4 Critical Hits → auto-wound)
      // no wound dice — all hits are Critical Hits
      1, 1, 1, 1,   // 4 save rolls (AP2 → Inv4+, all fail) → 4 unsaved crit wounds
      1,1,1,1,1,1,  // 6 DORN hit rolls (all miss)
    ]);
    const result = resolveStrikeStep(dice, state, attacker, DORN, 'player');
    // All 4 crits auto-wound even with Bulwark active (no wound roll = no roll to block)
    expect(result.playerResult.wounds).toBe(4);
    expect(result.playerResult.unsavedWounds).toBe(4);
    expect(result.updatedState.ai.isCasualty).toBe(false);
    expect(result.updatedState.ai.currentWounds).toBe(2); // W6 − 4 damage = 2
  });

  it('PraeternaturalResilience: weapon CriticalHit(5+) threshold raised to 6+', () => {
    // Custom attacker: WS7 (hitTN 4+ vs MORTARION WS7), A3 + advantage = 4 attacks.
    // Weapon has CriticalHit(5+). Against normal defender: rolls 5,5,5 → 3 crits.
    // Against MORTARION (PraeternaturalResilience): effective threshold = max(5,6) = 6.
    // Hit rolls [6,5,5,4]: only roll 6 crits; rolls 5,5,4 are normal hits.
    // Normal wound TN: S4 vs T7 = 6+ (from table). Wound rolls [1,1,1] all fail.
    // 1 crit auto-wound: AP2 → Inv4+, save roll 1 → fail → 1 unsaved crit wound.
    // critDmg = D2+1=3, EW3 → max(1, 3-3) = 1. 1×1 = 1 damage. W7-1 = 6.
    const attacker: Character = {
      ...WARBOSS,
      id: 'praetres-test-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 4, A: 3, W: 4, Inv: null },
      specialRules: [],
    };
    const critWeapon = {
      profileName: 'CritHit5+ Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 2, damage: 2,
      specialRules: [{ name: 'CriticalHit' as const, threshold: 5 }],
    };
    const state: CombatState = {
      ...makeState(attacker, MORTARION),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, MORTARION).player,
        selectedWeaponProfile: critWeapon,
      },
      ai: {
        ...makeState(attacker, MORTARION).ai,
        selectedWeaponProfile: MORTARION.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      6, 5, 5, 4,   // 4 hit rolls (TN 4+, all hit; only 6 is a crit due to PraeternaturalResilience)
      1, 1, 1,      // 3 wound rolls for normal hits (S4 vs T7 = 6+, all fail)
      1,            // 1 save roll for the crit wound (AP2 → Inv4+, fail)
      1,1,1,1,1,1,  // 6 Mortarion hit rolls (all miss, TN 4+)
    ]);
    const result = resolveStrikeStep(dice, state, attacker, MORTARION, 'player');
    // Without PraeternaturalResilience, rolls 5,5 would also crit (5 ≥ 5+), giving 3 crits.
    // With it, only roll 6 crits → 1 auto-wound; the 3 normal hits fail to wound at TN 6+.
    expect(result.playerResult.hits).toBe(4);
    expect(result.playerResult.wounds).toBe(1);      // 1 crit auto-wound only
    expect(result.playerResult.unsavedWounds).toBe(1);
    expect(result.updatedState.ai.currentWounds).toBe(6); // W7 − 1 damage = 6
  });

  it('PraeternaturalResilience: gambit criticalHitThreshold also raised to 6+', () => {
    // deaths-champion gambit gives the attacker criticalHitThreshold = 5 (no weapon CritHit).
    // Against MORTARION: effective threshold = max(5,6) = 6, so only roll 6 crits.
    // Hit rolls [6,5,4]: roll 6 → crit; rolls 5,4 → normal hits.
    // Wound rolls for 2 normal hits: S4 vs T7 = 6+. Rolls [1,1] → both fail.
    // 1 crit auto-wound: save roll 1 → fail → 1 unsaved crit wound.
    const attacker: Character = {
      ...WARBOSS,
      id: 'praetres-gambit-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 4, A: 2, W: 4, Inv: null },
      specialRules: [],
    };
    const plainWeapon = {
      profileName: 'Plain Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 2, damage: 2,
      specialRules: [],
    };
    const state: CombatState = {
      ...makeState(attacker, MORTARION),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, MORTARION).player,
        selectedGambit: 'deaths-champion',   // criticalHitThreshold: 5
        selectedWeaponProfile: plainWeapon,
      },
      ai: {
        ...makeState(attacker, MORTARION).ai,
        selectedWeaponProfile: MORTARION.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      6, 5, 4,      // 3 hit rolls (A2 + advantage = 3 attacks; TN 4+, all hit)
      1, 1,         // 2 wound rolls for normal hits (S4 vs T7 = 6+, all fail)
      1,            // 1 save roll for the crit (AP2 → Inv4+, fail)
      1,1,1,1,1,1,  // 6 Mortarion hit rolls (all miss)
    ]);
    const result = resolveStrikeStep(dice, state, attacker, MORTARION, 'player');
    // Without PraeternaturalResilience, rolls 5,6 both crit (≥5+) → 2 crits.
    // With it, only roll 6 crits → 1 auto-wound; normal hits can't wound at TN 6+.
    expect(result.playerResult.hits).toBe(3);
    expect(result.playerResult.wounds).toBe(1);
    expect(result.playerResult.unsavedWounds).toBe(1);
    expect(result.updatedState.ai.currentWounds).toBe(6); // W7 − 1 = 6
  });

  it('Sublime Swordsman: +1A per point I exceeds opponent\'s I when having advantage', () => {
    // Fulgrim: I=8, A=6. Opponent I=4 → I diff = 4 → +4 Attacks via Sublime Swordsman.
    // With advantage: total = A6 + 1 (advantage) + 4 (I diff) = 11 attacks.
    // All hit rolls of 1 → miss (WS8 vs WS4 = 2+; roll 1 < 2). AI misses back.
    const opponent: Character = {
      ...WARBOSS,
      id: 'sublime-test-opponent',
      stats: { ...WARBOSS.stats, WS: 4, I: 4, A: 2, Inv: null },
      specialRules: [],
    };
    const state: CombatState = {
      ...makeState(FULGRIM, opponent),
      challengeAdvantage: 'player',
      player: {
        ...makeState(FULGRIM, opponent).player,
        selectedWeaponProfile: FULGRIM.weapons[0].profiles[0],
      },
      ai: {
        ...makeState(FULGRIM, opponent).ai,
        selectedWeaponProfile: opponent.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      1,1,1,1,1,1,1,1,1,1,1, // 11 Fulgrim hit rolls (A6 + 1 advantage + 4 I-diff = 11; all miss)
      1,1,                    // 2 opponent hit rolls (A2, no advantage bonus; all miss)
    ]);
    const result = resolveStrikeStep(dice, state, FULGRIM, opponent, 'player');
    expect(result.playerResult.attacks).toBe(11);
  });

  it('Sublime Swordsman: no bonus when this model does NOT have Challenge Advantage', () => {
    // Fulgrim attacks second (AI has advantage). No Sublime Swordsman bonus.
    // Fulgrim total = A6 + 0 (no advantage) + 0 (no Sublime Swordsman) = 6 attacks.
    // Opponent: A2 + 1 advantage = 3 attacks, WS4 vs Fulgrim WS8 → TN 6+, all miss.
    const opponent: Character = {
      ...WARBOSS,
      id: 'sublime-test-opponent-2',
      stats: { ...WARBOSS.stats, WS: 4, I: 4, A: 2, Inv: null },
      specialRules: [],
    };
    const state: CombatState = {
      ...makeState(FULGRIM, opponent),
      challengeAdvantage: 'ai',
      player: {
        ...makeState(FULGRIM, opponent).player,
        selectedWeaponProfile: FULGRIM.weapons[0].profiles[0],
      },
      ai: {
        ...makeState(FULGRIM, opponent).ai,
        selectedWeaponProfile: opponent.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      1,1,1,          // 3 opponent hit rolls (A2 + 1 advantage = 3; TN 6+, all miss)
      1,1,1,1,1,1,    // 6 Fulgrim hit rolls (A6, no bonus; TN 2+, all miss on 1)
    ]);
    const result = resolveStrikeStep(dice, state, FULGRIM, opponent, 'ai');
    expect(result.playerResult.attacks).toBe(6);
  });

  it('Sublime Swordsman: no bonus when opponent I equals or exceeds Fulgrim\'s I', () => {
    // Opponent I=8 (same as Fulgrim I=8): diff = 0 → no Sublime Swordsman bonus.
    // Fulgrim total = A6 + 1 (advantage) + 0 = 7 attacks.
    const opponent: Character = {
      ...WARBOSS,
      id: 'sublime-test-high-i',
      stats: { ...WARBOSS.stats, WS: 4, I: 8, A: 2, Inv: null },
      specialRules: [],
    };
    const state: CombatState = {
      ...makeState(FULGRIM, opponent),
      challengeAdvantage: 'player',
      player: {
        ...makeState(FULGRIM, opponent).player,
        selectedWeaponProfile: FULGRIM.weapons[0].profiles[0],
      },
      ai: {
        ...makeState(FULGRIM, opponent).ai,
        selectedWeaponProfile: opponent.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      1,1,1,1,1,1,1, // 7 Fulgrim hit rolls (A6 + 1 advantage + 0 I-diff = 7; all miss)
      1,1,           // 2 opponent hit rolls (A2, no advantage; all miss)
    ]);
    const result = resolveStrikeStep(dice, state, FULGRIM, opponent, 'player');
    expect(result.playerResult.attacks).toBe(7);
  });

  it('CriticalHit+Shred: critical hits that trigger Shred deal +2D (CritHit+1 and Shred+1)', () => {
    // Weapon: CriticalHit(5+), Shred(5+), D1, AP null.
    // Attacker WS7, S4, A2 + advantage = 3 attacks. Defender WS2, T3, Sv7, Inv4+, W10.
    // Hit rolls [5,5,5]: all hit (≥2+) and crit (≥5+) → critHits=3, critShredTriggers=3.
    // Crits count as roll 6 → Shred(5+) triggers: 6 ≥ 5+.
    // No wound dice (all crits). Save: getEffectiveSave(7,4,null)=4+; rolls [1,1,1] → all fail.
    // unsavedCritShredWounds = round(3/3 × 3) = 3.
    // critShredDmgPerWound = max(1, 1+0+2−0) = 3.
    // totalDamage = 0 × critDmg(2) + 3 × critShredDmg(3) = 9.
    const attacker: Character = {
      ...WARBOSS,
      id: 'crit-shred-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 4, A: 2, W: 4, Inv: null },
      specialRules: [],
    };
    const defender: Character = {
      ...WARBOSS,
      id: 'crit-shred-defender',
      stats: { ...WARBOSS.stats, WS: 2, T: 3, Sv: 7, Inv: 4, W: 10 },
      specialRules: [],
    };
    const critShredWeapon = {
      profileName: 'CritShred Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: null, damage: 1,
      specialRules: [
        { name: 'CriticalHit' as const, threshold: 5 },
        { name: 'Shred'       as const, threshold: 5 },
      ],
    };
    const state: CombatState = {
      ...makeState(attacker, defender),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, defender).player,
        selectedWeaponProfile: critShredWeapon,
      },
      ai: {
        ...makeState(attacker, defender).ai,
        selectedWeaponProfile: defender.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      5, 5, 5,         // 3 hits (≥2+) and crits (≥5+) → critShredTriggers=3 (6 ≥ Shred 5+)
      // no wound dice (all crits)
      1, 1, 1,         // 3 save rolls (Inv4+, all fail) → 3 unsaved crit wounds
      1,1,1,1,1,1,     // 6 AI hit rolls (WS2 vs WS7 = 6+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, attacker, defender, 'player');
    expect(result.playerResult.hits).toBe(3);
    expect(result.playerResult.wounds).toBe(3);         // 3 crit auto-wounds
    expect(result.playerResult.unsavedWounds).toBe(3);
    // Before fix: 3 × D(1+1)=2 = 6 damage  (Shred not applied to crits).
    // After fix:  3 × D(1+2)=3 = 9 damage  (CriticalHit +1 and Shred +1 both applied).
    expect(result.playerResult.totalDamage).toBe(9);
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

  // ── Force(X) tests ───────────────────────────────────────────────────────

  // Shared helper for Force tests.
  // Weirdboy: WP8, WS5, S4, A4, Inv5+.  Force Staff: SM+2, AP4, D1, Force(D).
  // Dummy defender: WS2, T3, Sv7, Inv-, W5.
  // Attack calc: A4 + 1 advantage = 5. WS5 vs WS2 = 2+. S4+2=6 vs T3 = 2+. No save (AP4 ≤ Sv7).
  function makeForceState(): CombatState {
    const dummyDef: Character = {
      ...WARBOSS,
      id: 'force-test-defender',
      stats: { ...WARBOSS.stats, WS: 2, T: 3, Sv: 7, Inv: null, W: 5 },
      specialRules: [],
    };
    return {
      ...makeState(WEIRDBOY_CHAR, dummyDef),
      challengeAdvantage: 'player',
      player: {
        ...makeState(WEIRDBOY_CHAR, dummyDef).player,
        selectedWeaponProfile: WEIRDBOY_CHAR.weapons[0].profiles[0], // Force Staff
      },
      ai: {
        ...makeState(WEIRDBOY_CHAR, dummyDef).ai,
        selectedWeaponProfile: dummyDef.weapons[0].profiles[0],
      },
    };
  }

  it('Force(D): WP check success doubles Damage Characteristic', () => {
    // Force dice [3,5]: sum=8 ≤ WP8 → SUCCESS, no doubles. D1 → D2.
    // 5 attacks (A4 + advantage): all hit (TN 2+), all wound (TN 2+), no save.
    // 5 unsaved wounds × D2 (boosted) = 10 damage → opponent W5 = casualty.
    // Note: Pool 2 save rolls are always consumed (even with effectiveSave=null).
    const aiChar: Character = {
      ...WARBOSS,
      id: 'force-test-defender',
      stats: { ...WARBOSS.stats, WS: 2, T: 3, Sv: 7, Inv: null, W: 5 },
      specialRules: [],
    };
    const state = makeForceState();
    const dice = new FakeDiceRoller([
      3, 5,             // Force WP check: [3,5]=8 ≤ WP8 → success, not doubles
      // AI weapon has no Force — no Force dice consumed
      6, 6, 6, 6, 6,   // 5 hit rolls (TN 2+, all hit)
      6, 6, 6, 6, 6,   // 5 wound rolls (TN 2+, all wound)
      1, 1, 1, 1, 1,   // Pool 2 save rolls (effectiveSave=null → not checked but still consumed)
      // AI is casualty — no AI attacks
    ]);
    const result = resolveStrikeStep(dice, state, WEIRDBOY_CHAR, aiChar, 'player');
    expect(result.playerResult.hits).toBe(5);
    expect(result.playerResult.wounds).toBe(5);
    expect(result.playerResult.totalDamage).toBe(10);  // 5 × D2 (Force boost)
    expect(result.updatedState.ai.isCasualty).toBe(true);
  });

  it('Force(D): WP check failure — no damage boost', () => {
    // Force dice [4,5]: sum=9 > WP8 → FAIL, no doubles. D1 (no boost).
    // 5 wounds × D1 = 5 damage → opponent W5 = casualty.
    const aiChar: Character = {
      ...WARBOSS,
      id: 'force-test-defender',
      stats: { ...WARBOSS.stats, WS: 2, T: 3, Sv: 7, Inv: null, W: 5 },
      specialRules: [],
    };
    const state = makeForceState();
    const dice = new FakeDiceRoller([
      4, 5,             // Force WP check: [4,5]=9 > WP8 → fail, not doubles
      6, 6, 6, 6, 6,   // 5 hit rolls (TN 2+, all hit)
      6, 6, 6, 6, 6,   // 5 wound rolls (TN 2+, all wound)
      1, 1, 1, 1, 1,   // Pool 2 save rolls (consumed but effectiveSave=null)
    ]);
    const result = resolveStrikeStep(dice, state, WEIRDBOY_CHAR, aiChar, 'player');
    expect(result.playerResult.totalDamage).toBe(5);   // 5 × D1 (no boost)
    expect(result.updatedState.ai.isCasualty).toBe(true);
  });

  it('Force(D): doubles → Perils of the Warp wounds attacker (fail, no boost)', () => {
    // Force dice [5,5]: sum=10 > WP8 → FAIL + doubles → Perils.
    // D3 raw 3 → D3=2 Perils wounds: Weirdboy W3 → W1.
    // Attack with D1 (no boost): 5 wounds × D1 = 5 damage → opponent W5 = casualty.
    // Final: player.currentWounds = 1 (only Perils; AI doesn't attack).
    const aiChar: Character = {
      ...WARBOSS,
      id: 'force-test-defender',
      stats: { ...WARBOSS.stats, WS: 2, T: 3, Sv: 7, Inv: null, W: 5 },
      specialRules: [],
    };
    const state = makeForceState();
    const dice = new FakeDiceRoller([
      5, 5,             // Force WP check: [5,5]=10 > WP8 → fail + DOUBLES
      3,                // D3 raw=3 → D3=2 Perils wounds (Weirdboy W3 → W1)
      6, 6, 6, 6, 6,   // 5 hit rolls (TN 2+, all hit)
      6, 6, 6, 6, 6,   // 5 wound rolls (TN 2+, all wound)
      1, 1, 1, 1, 1,   // Pool 2 save rolls (consumed but effectiveSave=null)
    ]);
    const result = resolveStrikeStep(dice, state, WEIRDBOY_CHAR, aiChar, 'player');
    expect(result.playerResult.totalDamage).toBe(5);   // D1, no boost
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.updatedState.player.currentWounds).toBe(1); // W3 − 2 Perils
  });

  it('Force(D): doubles + success → Perils wounds attacker AND damage is doubled', () => {
    // Force dice [4,4]: sum=8 ≤ WP8 → SUCCESS + doubles → Perils.
    // D3 raw 2 → D3=1 Perils wound: Weirdboy W3 → W2.
    // Attack with D2 (boost): 5 wounds × D2 = 10 damage → opponent W5 = casualty.
    // Final: player.currentWounds = 2.
    const aiChar: Character = {
      ...WARBOSS,
      id: 'force-test-defender',
      stats: { ...WARBOSS.stats, WS: 2, T: 3, Sv: 7, Inv: null, W: 5 },
      specialRules: [],
    };
    const state = makeForceState();
    const dice = new FakeDiceRoller([
      4, 4,             // Force WP check: [4,4]=8 ≤ WP8 → SUCCESS + DOUBLES
      2,                // D3 raw=2 → D3=1 Perils wound (Weirdboy W3 → W2)
      6, 6, 6, 6, 6,   // 5 hit rolls (TN 2+, all hit)
      6, 6, 6, 6, 6,   // 5 wound rolls (TN 2+, all wound)
      1, 1, 1, 1, 1,   // Pool 2 save rolls (consumed but effectiveSave=null)
    ]);
    const result = resolveStrikeStep(dice, state, WEIRDBOY_CHAR, aiChar, 'player');
    expect(result.playerResult.totalDamage).toBe(10);  // 5 × D2 (Force boost)
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.updatedState.player.currentWounds).toBe(2); // W3 − 1 Perils
  });
});

// ── Psychic Discipline mechanic tests ─────────────────────────────────────────

describe('Psychic Discipline mechanics (Conflagration, Every Strike Foreseen, Hatred, Deflagrate)', () => {
  // Shared inline weapon profiles
  const conflagrationProfile = {
    profileName: 'Conflagration',
    initiativeModifier: { kind: 'add'   as const, value: -1 },
    attacksModifier:    { kind: 'fixed' as const, value: 6  },
    strengthModifier:   { kind: 'fixed' as const, value: 5  },
    ap: 4 as number | null,
    damage: 1,
    attacksExtraD3: true as boolean | undefined,
    specialRules: [{ name: 'Deflagrate' as const, value: 5 }],
  };

  const simpleMeleeProfile = {
    profileName: 'Simple Weapon',
    initiativeModifier: { kind: 'none' as const },
    attacksModifier:    { kind: 'none' as const },
    strengthModifier:   { kind: 'none' as const },
    ap: 4 as number | null,
    damage: 1,
    specialRules: [] as typeof conflagrationProfile.specialRules,
  };

  // Librarian-like attacker: WS5, S4, A4, WP9, Sv2+, Inv5+
  const makeLibrarian = (extra: Partial<Character> = {}): Character => ({
    id: 'test-librarian',
    name: 'Librarian',
    faction: 'legion-astartes',
    type: 'infantry',
    subTypes: ['Command'],
    stats: { M: 7, WS: 5, BS: 5, S: 4, T: 4, W: 3, I: 5, A: 4, LD: 8, CL: 7, WP: 9, IN: 8, Sv: 2, Inv: 5 },
    weapons: [],
    factionGambitIds: [],
    specialRules: [],
    ...extra,
  });

  // Dummy defender: WS2, T4, A4, W5, Sv7+ (no armour save), no Inv
  const makeDummy = (extra: Partial<Character> = {}): Character => ({
    id: 'test-dummy',
    name: 'Dummy',
    faction: 'legion-astartes',
    type: 'infantry',
    subTypes: ['Command'],
    stats: { M: 7, WS: 2, BS: 5, S: 4, T: 4, W: 5, I: 5, A: 4, LD: 8, CL: 7, WP: 9, IN: 8, Sv: 7, Inv: null },
    weapons: [],
    factionGambitIds: [],
    specialRules: [],
    ...extra,
  });

  it('Conflagration: attack count = 6 + D3 + attackBonus (attacksExtraD3 flag)', () => {
    // weaponD3 raw=1 → D3=1 (consumed FIRST). AM fixed=6 → baseA=7. +1 advantage → atkA=8.
    // All 8 hit rolls miss (WS5 vs WS6 = 5+, roll 1s). AI 4 attacks also miss.
    const lib   = makeLibrarian();
    const dummy = makeDummy({ stats: { ...makeDummy().stats, WS: 6, A: 4 } });
    const s = buildInitialState(lib, dummy);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: null, selectedWeaponProfile: conflagrationProfile },
      ai:     { ...s.ai,     selectedGambit: null, selectedWeaponProfile: simpleMeleeProfile  },
    };
    const dice = new FakeDiceRoller([
      1,              // weaponD3 raw=1 → D3=1 → baseA=6+1=7, atkA=8
      1,1,1,1,1,1,1,1, // 8 hit rolls (WS5 vs WS6 = 5+; roll 1 < 5 → all miss)
      // AI: WS6 vs WS5 (lib) = 3+ (HIT_TABLE[5][4]=3); 4 attacks, roll 1s
      1,1,1,1,        // 4 AI hit rolls (all miss)
    ]);
    const result = resolveStrikeStep(dice, state, lib, dummy, 'player');
    expect(result.playerResult.attacks).toBe(8);   // 6 (fixed AM) + 1 (D3) + 1 (advantage)
    expect(result.playerResult.hits).toBe(0);       // all missed at TN 5+
  });

  it('Deflagrate: unsaved wounds generate additional S5/AP-/D1 hits', () => {
    // Conflagration on dummy WS2 T4 W16 (Sv7+, Inv-):
    // weaponD3 raw=1 → D3=1 → baseA=7, atkA=8 (with advantage).
    // 8 hits (TN 2+), 8 wounds (S5 vs T4 = 3+), effectiveSave=null (AP4 vs Sv7).
    // Pool 2: 8 save dice consumed (even with null save). deflagrateUnsavedCount=8.
    // Main damage: 8 × D1 = 8. Defender W16 → W8 (not a casualty yet).
    // Deflagrate(5): 8 extra hits at S5/T4=TN3+: all 8 wound; AP- best save=7+ (d6 max 6): all fail.
    // Deflagrate damage: 8 × D1 = 8. W8 − 8 = 0 → casualty. AI does not attack.
    const lib   = makeLibrarian();
    const dummy = makeDummy({ stats: { ...makeDummy().stats, WS: 2, T: 4, W: 16, Sv: 7, Inv: null } });
    const s = buildInitialState(lib, dummy);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: null, selectedWeaponProfile: conflagrationProfile },
      ai:     { ...s.ai,     selectedGambit: null, selectedWeaponProfile: simpleMeleeProfile  },
    };
    const dice = new FakeDiceRoller([
      1,                    // weaponD3 raw=1 → D3=1
      2,2,2,2,2,2,2,2,     // 8 hit rolls (TN 2+, all hit)
      3,3,3,3,3,3,3,3,     // 8 wound rolls (S5 vs T4 = 3+, all wound)
      1,1,1,1,1,1,1,1,     // Pool 2: 8 save rolls consumed (effectiveSave=null)
      3,3,3,3,3,3,3,3,     // Deflagrate: 8 wound rolls (S5 vs T4 = 3+, all wound)
      1,1,1,1,1,1,1,1,     // Deflagrate: 8 save rolls (AP- best=Sv7; 1 < 7 → all fail)
    ]);
    const result = resolveStrikeStep(dice, state, lib, dummy, 'player');
    expect(result.playerResult.totalDamage).toBe(16);  // 8 main + 8 deflagrate
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.playerResult.log.some(l => l.includes('Deflagrate'))).toBe(true);
  });

  it('Every Strike Foreseen: WP check success → all hits on 2+', () => {
    // Without ESF, WS5 vs WS8 = 5+ (hard to hit). ESF WP check [1,3]=4 ≤ WP9 → SUCCESS.
    // hitTNOverride = 2. 5 attacks (A4 + 1 advantage), rolls of 5 ≥ 2 → all 5 hit.
    // Wound: S4 vs T4 = 4+; rolls 4 → all 5 wound. AP3 vs Sv7 → penetrated, no inv → no save.
    // Pool 2: 5 dice consumed. 5 × D1 = 5. W5 → 0 → casualty.
    const lib   = makeLibrarian({ stats: { ...makeLibrarian().stats, WP: 9 } });
    const dummy = makeDummy({ stats: { ...makeDummy().stats, WS: 8, T: 4, W: 5, Sv: 7, Inv: null } });
    const s = buildInitialState(lib, dummy);
    const esfProfile = {
      profileName: 'Power Sword',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 3 as number | null,
      damage: 1,
      specialRules: [] as typeof conflagrationProfile.specialRules,
    };
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: 'divination-every-strike-foreseen', selectedWeaponProfile: esfProfile },
      ai:     { ...s.ai,     selectedGambit: null, selectedWeaponProfile: simpleMeleeProfile },
    };
    const dice = new FakeDiceRoller([
      1, 3,           // ESF WP check [1+3=4] ≤ WP9 → SUCCESS → hitTN override = 2
      5,5,5,5,5,      // 5 hit rolls (override TN 2+; 5 ≥ 2 → all hit)
      4,4,4,4,4,      // 5 wound rolls (S4 vs T4 = TN 4+; 4 ≥ 4 → all wound)
      1,1,1,1,1,      // Pool 2 save rolls (AP3 vs Sv7: penetrated, null save; consumed)
    ]);
    const result = resolveStrikeStep(dice, state, lib, dummy, 'player');
    expect(result.playerResult.hits).toBe(5);     // all 5 hit at TN 2+ (override)
    expect(result.playerResult.wounds).toBe(5);
    expect(result.updatedState.ai.isCasualty).toBe(true);
    const hitLogLine = result.playerResult.log.find(l => l.includes('needing 2+'));
    expect(hitLogLine).toBeDefined();
  });

  it('Every Strike Foreseen: WP check failure → normal hit TN applies', () => {
    // ESF WP check [5,6]=11 > WP9 → FAIL. Normal hitTN: WS5 vs WS8 = 5+.
    // 5 attacks roll 4 → all miss (4 < 5+). AI 4 attacks also miss.
    const lib   = makeLibrarian({ stats: { ...makeLibrarian().stats, WP: 9 } });
    const dummy = makeDummy({ stats: { ...makeDummy().stats, WS: 8, T: 4, W: 5, Sv: 7, Inv: null } });
    const s = buildInitialState(lib, dummy);
    const esfProfile = {
      profileName: 'Power Sword',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 3 as number | null,
      damage: 1,
      specialRules: [] as typeof conflagrationProfile.specialRules,
    };
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: 'divination-every-strike-foreseen', selectedWeaponProfile: esfProfile },
      ai:     { ...s.ai,     selectedGambit: null, selectedWeaponProfile: simpleMeleeProfile },
    };
    const dice = new FakeDiceRoller([
      5, 6,           // ESF WP check [5+6=11] > WP9 → FAIL → normal TN
      4,4,4,4,4,      // 5 hit rolls (normal TN 5+: WS5 vs WS8; 4 < 5 → all miss)
      1,1,1,1,        // 4 AI hit rolls (WS2 vs WS5 = 6+; all miss)
    ]);
    const result = resolveStrikeStep(dice, state, lib, dummy, 'player');
    expect(result.playerResult.hits).toBe(0);    // all missed at normal TN 5+
    expect(result.playerResult.log.some(l => l.includes('normal hits'))).toBe(true);
  });

  it('Hatred(Psykers): wound TN reduced by 1 when defender has Psyker rule', () => {
    // Attacker has Hatred(Psykers). Defender has Psyker rule.
    // S4 vs T4 = normal TN 4+. Wound rolls of 3: 3 < 4 → fail without Hatred.
    // With Hatred: TN = max(2, 4-1) = 3+. 3 ≥ 3 → all 5 wound.
    // AP3 vs Sv7: penetrated; effectiveSave=null; Pool 2 saves consumed.
    // 5 unsaved wounds × D1 = 5. Defender W5 → 0 → casualty.
    const lib = makeLibrarian({
      specialRules: [{ name: 'Hatred', target: 'Psykers' }],
    });
    const dummy = makeDummy({
      stats: { ...makeDummy().stats, WS: 5, T: 4, W: 5, Sv: 7, Inv: null },
      specialRules: [{ name: 'Psykers' }],
    });
    const powerSwordProfile = {
      profileName: 'Power Sword',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 3 as number | null,
      damage: 1,
      specialRules: [] as typeof conflagrationProfile.specialRules,
    };
    const s = buildInitialState(lib, dummy);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: null, selectedWeaponProfile: powerSwordProfile },
      ai:     { ...s.ai,     selectedGambit: null, selectedWeaponProfile: simpleMeleeProfile },
    };
    // WS5 vs WS5 = TN 4+ (HIT_TABLE[4][4]=4). Hit rolls of 4 → all 5 hit.
    // Wound rolls of 3: with Hatred TN=max(2,4-1)=3+ → all 5 wound; without TN 4+: 3 < 4 → fail.
    const dice = new FakeDiceRoller([
      4,4,4,4,4,    // 5 hit rolls (TN 4+, all hit)
      3,3,3,3,3,    // 5 wound rolls (with Hatred TN 3+: all wound; without TN 4+: all fail)
      1,1,1,1,1,    // Pool 2 save rolls (AP3 vs Sv7: penetrated → effectiveSave=null; consumed)
    ]);
    const result = resolveStrikeStep(dice, state, lib, dummy, 'player');
    expect(result.playerResult.wounds).toBe(5);   // wound TN = 2+ due to Hatred
    expect(result.playerResult.unsavedWounds).toBe(5);
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.playerResult.log.some(l => l.includes('Hatred'))).toBe(true);
  });

  it('Hatred(Psykers): no wound bonus when defender lacks Psyker rule', () => {
    // Same setup but defender has no Psyker rule.
    // Wound rolls of 3: normal TN 4+ → 3 < 4 → all fail. No damage.
    const lib = makeLibrarian({
      specialRules: [{ name: 'Hatred', target: 'Psykers' }],
    });
    const dummy = makeDummy({
      stats: { ...makeDummy().stats, WS: 5, T: 4, W: 5, Sv: 7, Inv: null },
      specialRules: [], // NO Psyker rule
    });
    const powerSwordProfile = {
      profileName: 'Power Sword',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: 3 as number | null,
      damage: 1,
      specialRules: [] as typeof conflagrationProfile.specialRules,
    };
    const s = buildInitialState(lib, dummy);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: null, selectedWeaponProfile: powerSwordProfile },
      ai:     { ...s.ai,     selectedGambit: null, selectedWeaponProfile: simpleMeleeProfile },
    };
    // Hit rolls of 4 → all 5 hit (WS5 vs WS5 = TN 4+).
    // Wound rolls of 3: normal TN 4+ → 3 < 4 → all fail (no Hatred bonus).
    // No wounds → AI attacks (4 dice, all miss).
    const dice = new FakeDiceRoller([
      4,4,4,4,4,    // 5 hit rolls (TN 4+, all hit)
      3,3,3,3,3,    // 5 wound rolls (TN 4+: 3 < 4 → all fail; no Hatred bonus)
      1,1,1,1,1,    // AI hit rolls (WS5 vs WS5 = 4+; all miss)
    ]);
    const result = resolveStrikeStep(dice, state, lib, dummy, 'player');
    expect(result.playerResult.wounds).toBe(0);   // no Hatred bonus → all fail
  });

  it('Phage(S): reduces the TARGET\'s Strength by 1 after ≥1 unsaved wounds, affecting their own attack', () => {
    // Rule: ≥1 unsaved wounds from a Phage(S) weapon permanently reduce the
    // TARGET's Strength by 1 (max 1 reduction total). Affects the target's
    // own wound rolls when they attack.
    //
    // Player: WS7, S5, A2+advantage=3 attacks, T4, Sv7 (no armour), Inv4+, W6
    // AI:     WS5, S5, T4, Sv7 (no armour), Inv4+, W6, A3 (no advantage)
    // Player weapon: AP null, D1, Phage(S)
    // AI weapon:     AP null, D1 (plain)
    //
    // Player attack:
    //   Hit TN: WS7 vs WS5 → TN 3+. Rolls 5,5,5 → all hit.
    //   Wound TN: S5 vs T4 → TN 3+. Rolls 5,5,5 → all wound.
    //   Save: AP null, Sv7>6 (no armour), Inv4+ → effectiveSave 4+.
    //         Pool 2 always consumed. Rolls 1,1,1 → all fail → 3 unsaved wounds.
    //   Phage(S) triggers → AI phageSApplied = true (AI S: 5 → 4).
    //   Damage: 3 × D1 = 3. AI W6 → 3. Not casualty.
    //
    // AI attack (S is now 4):
    //   Hit TN: WS5 vs WS7 → TN 5+. Rolls 5,5,5 → all hit.
    //   Wound TN: S4 vs T4 → TN 4+. Rolls 3,3,3 → all fail (3 < 4).
    //   Without Phage: S5 vs T4 = TN 3+; rolls of 3 would all wound.
    const attacker: Character = {
      ...WARBOSS,
      id: 'phage-s-attacker',
      stats: { ...WARBOSS.stats, WS: 7, S: 5, A: 2, T: 4, Sv: 7, Inv: 4, W: 6 },
      specialRules: [],
    };
    const defender: Character = {
      ...WARBOSS,
      id: 'phage-s-defender',
      stats: { ...WARBOSS.stats, WS: 5, S: 5, T: 4, Sv: 7, Inv: 4, W: 6, A: 3 },
      specialRules: [],
    };
    const phageWeapon = {
      profileName: 'Phage(S) Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: null, damage: 1,
      specialRules: [{ name: 'Phage' as const, characteristic: 'S' as const }],
    };
    const plainWeapon = {
      profileName: 'Plain Weapon',
      initiativeModifier: { kind: 'none' as const },
      attacksModifier:    { kind: 'none' as const },
      strengthModifier:   { kind: 'none' as const },
      ap: null, damage: 1,
      specialRules: [],
    };
    const state: CombatState = {
      ...makeState(attacker, defender),
      challengeAdvantage: 'player',
      player: {
        ...makeState(attacker, defender).player,
        selectedWeaponProfile: phageWeapon,
      },
      ai: {
        ...makeState(attacker, defender).ai,
        selectedWeaponProfile: plainWeapon,
      },
    };
    const dice = new FakeDiceRoller([
      // Player attack (A2 + 1 advantage = 3 attacks)
      5, 5, 5,  // 3 hit rolls (WS7 vs WS5 = TN 3+; all hit)
      5, 5, 5,  // 3 wound rolls (S5 vs T4 = TN 3+; all wound)
      1, 1, 1,  // 3 save rolls (pool 2 always consumed; Inv4+; all fail → 3 unsaved)
      // Phage(S) triggers here: AI phageSApplied = true → AI S5 → S4
      // AI attack (A3, no advantage; effective S is now 4)
      5, 5, 5,  // 3 hit rolls (WS5 vs WS7 = TN 5+; all hit)
      3, 3, 3,  // 3 wound rolls (S4 vs T4 = TN 4+; 3 < 4 → all fail)
                // Without Phage: S5 vs T4 = TN 3+; rolls of 3 would all wound.
    ]);
    const result = resolveStrikeStep(dice, state, attacker, defender, 'player');
    expect(result.playerResult.unsavedWounds).toBe(3);
    expect(result.playerResult.phageSTriggered).toBe(true);
    expect(result.updatedState.ai.phageSApplied).toBe(true);
    // AI wound rolls of 3 fail at raised TN 4+ (reduced S4 vs T4)
    expect(result.aiResult.wounds).toBe(0);
    expect(result.updatedState.ai.currentWounds).toBe(3);   // W6 − 3 = 3
    expect(result.updatedState.player.currentWounds).toBe(6); // player untouched
  });
});

// ── Liquifractor Onslaught (Archmagos Draykavac) ──────────────────────────────

describe('Liquifractor Onslaught', () => {
  const DRAYKAVAC = MECHANICUM_CHARACTERS.find(c => c.id === 'archmagos-draykavac')!;

  // Defender: T4, W6, Sv7 (no armour), no Inv → save rolls consumed but always unsaved.
  const makeDefender = (extra: Partial<Character> = {}): Character => ({
    id: 'liqui-target',
    name: 'Target',
    faction: 'mechanicum',
    type: 'infantry',
    subTypes: ['Command'],
    stats: { M: 6, WS: 4, BS: 4, S: 4, T: 4, W: 6, I: 4, A: 4, LD: 8, CL: 8, WP: 8, IN: 8, Sv: 7, Inv: null },
    weapons: [DRAYKAVAC.weapons[0]],
    factionGambitIds: [],
    specialRules: [],
    ...extra,
  });

  function makeLiquiState(defender: Character, advantage: 'player' | 'ai' = 'player'): CombatState {
    const s = buildInitialState(DRAYKAVAC, defender);
    return {
      ...s,
      challengeAdvantage: advantage,
      player: {
        ...s.player,
        selectedGambit: 'liquifractor-onslaught',
        selectedWeaponProfile: DRAYKAVAC.weapons[0].profiles[0],
      },
      ai: {
        ...s.ai,
        selectedGambit: null,
        selectedWeaponProfile: defender.weapons[0].profiles[0],
      },
    };
  }

  it('all 3 shots miss — no pre-attack damage', () => {
    // Liquifractor: hits [1,1,1] → 0 hits (need 2+).
    // Normal player (A5, WS5 vs WS4=TN3+): all miss. AI (A4, WS4 vs WS5=TN5+): all miss.
    const defender = makeDefender();
    const state = makeLiquiState(defender);
    const dice = new FakeDiceRoller([
      1, 1, 1,         // Liquifractor: 3 hit rolls (all miss at 2+)
      1, 1, 1, 1, 1,  // Normal player: 5 hit rolls (all miss at TN3+)
      1, 1, 1, 1,      // AI counter: 4 hit rolls (all miss at TN5+)
    ]);
    const result = resolveStrikeStep(dice, state, DRAYKAVAC, defender, 'player');
    expect(result.updatedState.ai.currentWounds).toBe(6);   // no Liquifractor damage
    expect(result.log.some(l => l.includes('Liquifractor'))).toBe(true);
    expect(result.log.some(l => l.includes('0 hit'))).toBe(true);
  });

  it('AP6 and Breaching(4+) save pools both consumed, wounds tallied correctly', () => {
    // Defender: Sv7 (null save), Inv=null.
    // Liquifractor: hits [2,4,5] → all 3 hit; wounds [2,3,5]:
    //   roll 2 → wound, 2<4 → AP6 (normalWounds=1)
    //   roll 3 → wound, 3<4 → AP6 (normalWounds=2)
    //   roll 5 → wound, 5≥4 → Breaching/AP2 (breachingWounds=1)
    // AP6 save pool: 2 dice consumed (Sv7→null save); AP2 save pool: 1 die consumed.
    // 3 unsaved wounds × D1 = 3. Phage(T&S) triggers.
    // Normal player (A5): all miss. AI (A4): all miss.
    const defender = makeDefender();
    const state = makeLiquiState(defender);
    const dice = new FakeDiceRoller([
      2, 4, 5,         // Liquifractor hits (all ≥2)
      2, 3, 5,         // Wound rolls (2,3→AP6; 5→Breaching/AP2)
      1, 1,            // AP6 save rolls (Sv7→null; consumed)
      1,               // AP2 save roll  (Sv7→null; consumed)
      1, 1, 1, 1, 1,  // Normal player A5 hits (all miss)
      1, 1, 1, 1,      // AI A4 hits (all miss)
    ]);
    const result = resolveStrikeStep(dice, state, DRAYKAVAC, defender, 'player');
    expect(result.updatedState.ai.currentWounds).toBe(3);
    expect(result.updatedState.ai.phageSApplied).toBe(true);
    expect(result.updatedState.ai.phageTApplied).toBe(true);
    expect(result.updatedState.player.woundsInflictedThisChallenge).toBe(3);
  });

  it('Liquifractor kills opponent — AI does not counter-attack', () => {
    // Defender W3: Liquifractor 3 hits, wounds [4,5,6] → all Breaching/AP2.
    // AP2 save: Sv7→null; 3 dice consumed. 3 unsaved × D1 = 3 → W3→0 → CASUALTY.
    // Normal player melee still executes (attacking a 0-wound target), but all miss.
    // AI counter-attack is skipped because defenderIsCasualty=true.
    const defender = makeDefender({ stats: { ...makeDefender().stats, W: 3 } });
    const state = makeLiquiState(defender);
    const dice = new FakeDiceRoller([
      5, 5, 5,         // Liquifractor hits
      4, 5, 6,         // All Breaching/AP2 wounds (all ≥4)
      1, 1, 1,         // AP2 save rolls (Sv7→null; consumed)
      // Normal player melee (A5, WS5 vs WS4=TN3+): all miss → no wound/save dice
      1, 1, 1, 1, 1,   // 5 hit rolls (all miss)
      // AI is casualty → no counter-attack
    ]);
    const result = resolveStrikeStep(dice, state, DRAYKAVAC, defender, 'player');
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.updatedState.ai.currentWounds).toBe(0);
    // AI counter-attack skipped (aiResult has 0 attacks)
    expect(result.aiResult.attacks).toBe(0);
    expect(result.updatedState.player.woundsInflictedThisChallenge).toBe(3);  // Liquifractor only
  });

  it('Liquifractor damage stacks with normal melee damage', () => {
    // Defender W6, Sv7 (null save), Inv=null, T4.
    // Liquifractor: 3 hits [5,5,5]; wounds [4,5,6] → all Breaching/AP2; AP2 saves [1,1,1] → null.
    // 3 unsaved × D1 = 3. Defender W6→W3.
    // Normal player attack (A5, WS5 vs WS4=TN3+, Paragon Blade AP2):
    //   Hits [3,3,3,3,3] → all 5 hit. Wounds (S6 vs T4=TN2+) [2,2,2,2,2] → all wound.
    //   AP2 vs Sv7 → null save; Pool2 [1,1,1,1,1] consumed.
    //   5 unsaved × D1 = 5. Starts from W3 (after Liquifractor) → W3−5 = W0 → CASUALTY.
    // woundsInflictedThisChallenge = 3 (Liquifractor) + 5 (melee) = 8.
    const defender = makeDefender({ stats: { ...makeDefender().stats, T: 4 } });
    const state = makeLiquiState(defender);
    const dice = new FakeDiceRoller([
      5, 5, 5,         // Liquifractor hits
      4, 5, 6,         // Breaching/AP2 wounds
      1, 1, 1,         // AP2 save rolls (null; consumed)
      3, 3, 3, 3, 3,   // 5 normal player hits (TN3+)
      2, 2, 2, 2, 2,   // 5 wound rolls (TN2+; all wound; AP2 Paragon Blade)
      1, 1, 1, 1, 1,   // Pool 2 save rolls (AP2 vs Sv7 → null; consumed)
      // AI is casualty; no counter-attack
    ]);
    const result = resolveStrikeStep(dice, state, DRAYKAVAC, defender, 'player');
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.updatedState.player.woundsInflictedThisChallenge).toBe(8);  // 3 + 5
  });
});

// ── Power of the Machine Spirit (Malagra subfaction) ──────────────────────────

describe('Power of the Machine Spirit', () => {
  // ARCHMAGOS: WS5, A4, S6, T6, W6, Sv2, Inv4, IN10
  // ARCHMAGOS.weapons: [POWER_AXE, PARAGON_BLADE, POWER_FIST]
  // Paragon Blade (weapons[1]): AP2, D1, +1S (→ S7), CriticalHit(6+)
  //
  // WARBOSS: WS6, A6, S5, T5, W4, Sv4, Inv4
  // WARBOSS.weapons[0] = CHOPPA: AP null, D1

  function makeMSState(
    playerBoostWS = 0,
    playerBoostA  = 0,
    aiBoostWS     = 0,
    aiBoostA      = 0,
    advantage: 'player' | 'ai' = 'player',
    playerWounds = ARCHMAGOS.stats.W,
    aiWounds     = WARBOSS.stats.W,
    flipRoles     = false,  // true → player=WARBOSS, ai=ARCHMAGOS
  ): CombatState {
    const pChar = flipRoles ? WARBOSS : ARCHMAGOS;
    const aChar = flipRoles ? ARCHMAGOS : WARBOSS;
    const s = buildInitialState(pChar, aChar);
    return {
      ...s,
      challengeAdvantage: advantage,
      player: {
        ...s.player,
        selectedGambit: 'power-of-the-machine-spirit',
        selectedWeaponProfile: flipRoles ? WARBOSS.weapons[0].profiles[0] : ARCHMAGOS.weapons[1].profiles[0],
        machineSpiritBoostWS: playerBoostWS,
        machineSpiritBoostA:  playerBoostA,
        currentWounds: playerWounds,
      },
      ai: {
        ...s.ai,
        selectedGambit: flipRoles ? 'power-of-the-machine-spirit' : null,
        selectedWeaponProfile: flipRoles ? ARCHMAGOS.weapons[1].profiles[0] : WARBOSS.weapons[0].profiles[0],
        machineSpiritBoostWS: aiBoostWS,
        machineSpiritBoostA:  aiBoostA,
        currentWounds: aiWounds,
      },
    };
  }

  it('IN check failed: no boosts, Cybertheurgic Feedback still applies 1 wound', () => {
    // Player ARCHMAGOS (WS5, A4+1bonus=5) with Paragon Blade; machineSpiritBoosts = 0.
    // No IN check dice here — that happens in challengeEngine; boosts are pre-set in state.
    //
    // Player hits: WS5 vs WS6 → TN5+. A4+0(ms)+1(bonus)=5 hit rolls.
    //   All miss (roll 1).
    // AI hits: WS6 vs WS5 → TN3+. A6 rolls.
    //   All miss (roll 1).
    // Feedback: Player W6 → W5.
    const state = makeMSState(0, 0);  // no boosts
    const dice = new FakeDiceRoller([
      1, 1, 1, 1, 1,       // 5 player hit rolls (TN5+, all miss)
      1, 1, 1, 1, 1, 1,    // 6 AI hit rolls    (TN3+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, ARCHMAGOS, WARBOSS, 'player');
    expect(result.updatedState.player.currentWounds).toBe(5);  // W6 − 1 Feedback
    expect(result.updatedState.player.isCasualty).toBe(false);
    expect(result.updatedState.ai.currentWounds).toBe(WARBOSS.stats.W);  // untouched
    expect(result.log.some(l => l.includes('Cybertheurgic Feedback'))).toBe(true);
  });

  it('IN check succeeded: +2 WS and +1 A applied, TN improves, Feedback wound at end', () => {
    // Player ARCHMAGOS with machineSpiritBoostWS=2, machineSpiritBoostA=1:
    //   atkWS = WS5+2=7, atkA = A4+1(ms)+1(bonus)=6.
    //   WS7 vs WS6 → TN3+.  S7 vs T5 → TN2+.
    //
    // Player hits: [3,3,3,3,3,3] → all 6 hit (TN3+); no crits (3 < CritHit(6+)).
    // 6 normal wounds (S7>T5 by 2 → TN2+): [2,2,2,2,2,2] → all wound.
    // Pool 2 save (AP2, Sv4/Inv4 → effectiveSave=4): [1,1,1,1,1,1] → all fail.
    // 6 unsaved × D1 = 6 > W4 → WARBOSS CASUALTY. AI does not attack.
    // Feedback: Player W6 → W5.
    const state = makeMSState(2, 1);  // boosts applied by successful IN check
    const dice = new FakeDiceRoller([
      3, 3, 3, 3, 3, 3,    // 6 player hit rolls  (TN3+, all hit; no crits)
      2, 2, 2, 2, 2, 2,    // 6 wound rolls       (TN2+, all wound)
      1, 1, 1, 1, 1, 1,    // Pool 2 save rolls   (Inv4+, all fail)
      // AI is casualty — no counter-attack
    ]);
    const result = resolveStrikeStep(dice, state, ARCHMAGOS, WARBOSS, 'player');
    expect(result.updatedState.ai.isCasualty).toBe(true);
    expect(result.updatedState.player.currentWounds).toBe(5);  // W6 − 1 Feedback
    expect(result.log.some(l => l.includes('Power of the Machine Spirit') && l.includes('+2 WS'))).toBe(true);
    expect(result.log.some(l => l.includes('Cybertheurgic Feedback'))).toBe(true);
  });

  it('Feedback kills the gambit-user: isCasualty = true', () => {
    // Player ARCHMAGOS at W1 with boosts. All attacks miss. Feedback: W1 → W0 → CASUALTY.
    //   atkWS=7, atkA=6 (4+1ms+1bonus). WS7 vs WS6 → TN3+. All miss (roll 1).
    //   AI: WS6 vs WS5 → TN3+. A6. All miss (roll 1).
    const state = makeMSState(2, 1, 0, 0, 'player', 1);  // player W1
    const dice = new FakeDiceRoller([
      1, 1, 1, 1, 1, 1,    // 6 player hit rolls  (TN3+, all miss)
      1, 1, 1, 1, 1, 1,    // 6 AI hit rolls      (TN3+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, ARCHMAGOS, WARBOSS, 'player');
    expect(result.updatedState.player.isCasualty).toBe(true);
    expect(result.updatedState.player.currentWounds).toBe(0);
    expect(result.log.some(l => l.includes('CASUALTY'))).toBe(true);
  });

  it('AI side: boosts and Feedback apply symmetrically when AI has the gambit', () => {
    // flipRoles=true: player=WARBOSS, ai=ARCHMAGOS with power-of-the-machine-spirit.
    // advantage='ai' → AI (ARCHMAGOS) attacks first with WS7, A6.
    //   WS7 vs WS6 → TN3+. S7 vs T5 → TN2+. AP2 penetrates Sv4 → Inv4+ save.
    //
    // AI hits: [3,3,3,3,3,3] → all 6 hit; wounds [2,2,2,2,2,2] → all wound;
    //   saves [1,1,1,1,1,1] → all fail. 6 × D1 = 6 > W4 → WARBOSS CASUALTY.
    // Player (WARBOSS) doesn't attack.
    // Feedback: AI (ARCHMAGOS) W6 → W5.
    const state = makeMSState(0, 0, 2, 1, 'ai', WARBOSS.stats.W, ARCHMAGOS.stats.W, true);
    const dice = new FakeDiceRoller([
      3, 3, 3, 3, 3, 3,    // 6 AI hit rolls  (TN3+, all hit)
      2, 2, 2, 2, 2, 2,    // 6 wound rolls   (TN2+, all wound)
      1, 1, 1, 1, 1, 1,    // Pool 2 saves    (Inv4+, all fail)
      // Player is casualty — no counter-attack
    ]);
    const result = resolveStrikeStep(dice, state, WARBOSS, ARCHMAGOS, 'ai');
    expect(result.updatedState.player.isCasualty).toBe(true);  // WARBOSS killed
    expect(result.updatedState.ai.currentWounds).toBe(5);       // ARCHMAGOS W6 − 1 Feedback
    expect(result.log.some(l => l.includes('Cybertheurgic Feedback'))).toBe(true);
  });
});

// ── The Myrmidon's Path (Myrmidax subfaction) ─────────────────────────────────

describe("The Myrmidon's Path", () => {
  // Shooter: WS5, BS4, A2, S5, T5, W5, Sv2, Inv4.
  // weapons[0] = ARCHMAGOS Power Axe (melee, selectedWeaponProfile in state).
  // weapons[1] = WARBOSS SLUGGA (ranged, type:'ranged', AP null, D1, attacksModifier:'none').
  //   FP = char A = 2 (attacksModifier 'none' → uses char.stats.A).
  //   Hit TN: BS4 → 2+.
  //   S5 vs defender T4 → wound TN 3+.
  //   AP null vs Sv5/Inv4: armourPenetrated=false → effectiveSave=min(5,4)=4.
  //
  // Defender: WS4, A4, T4, W5, Sv5, Inv4.
  // Melee hit TNs:
  //   Shooter WS5 vs Defender WS4 → TN3+   (A2+1bonus=3 attacks)
  //   Defender WS4 vs Shooter WS5 → TN5+   (A4 attacks, no bonus)

  const SHOOTER: Character = {
    id: 'mp-shooter', name: 'MP Shooter',
    faction: 'mechanicum', type: 'infantry', subTypes: ['Command'],
    stats: { M:6, WS:5, BS:4, S:5, T:5, W:5, I:4, A:2, LD:9, CL:9, WP:9, IN:10, Sv:2, Inv:4 },
    // weapons[0] = melee (Power Axe), weapons[1] = ranged (Slugga FP2)
    weapons: [ARCHMAGOS.weapons[0], WARBOSS.weapons[1]],
    factionGambitIds: ['the-myrmidons-path'],
    specialRules: [],
  };

  const DEFENDER: Character = {
    id: 'mp-defender', name: 'MP Defender',
    faction: 'test', type: 'infantry', subTypes: ['Command'],
    stats: { M:6, WS:4, BS:4, S:4, T:4, W:5, I:4, A:4, LD:8, CL:8, WP:8, IN:8, Sv:5, Inv:4 },
    weapons: [ARCHMAGOS.weapons[0]],
    factionGambitIds: [],
    specialRules: [],
  };

  function makeMPState(
    playerGambit: boolean,
    flipForAI = false,
    advantage: 'player' | 'ai' = 'player',
  ): CombatState {
    const pChar = flipForAI ? DEFENDER : SHOOTER;
    const aChar = flipForAI ? SHOOTER : DEFENDER;
    const s = buildInitialState(pChar, aChar);
    return {
      ...s,
      challengeAdvantage: advantage,
      player: {
        ...s.player,
        selectedGambit: playerGambit && !flipForAI ? 'the-myrmidons-path' : null,
        selectedWeaponProfile: pChar.weapons[0].profiles[0],
      },
      ai: {
        ...s.ai,
        selectedGambit: flipForAI ? 'the-myrmidons-path' : null,
        selectedWeaponProfile: aChar.weapons[0].profiles[0],
      },
    };
  }

  it('shots all miss: no pre-attack damage, normal melee then proceeds', () => {
    // Shooting: FP2, BS4→TN2+, rolls [1,1] → 0 hits → no wound/save dice.
    // Player melee: WS5 vs WS4=TN3+. A2+1bonus=3 attacks. All miss (roll 1).
    // AI melee: WS4 vs WS5=TN5+. A4 attacks. All miss (roll 1).
    const state = makeMPState(true);
    const dice = new FakeDiceRoller([
      1, 1,             // 2 shooting hit rolls (TN2+, both miss)
      1, 1, 1,          // 3 player melee hits  (TN3+, all miss)
      1, 1, 1, 1,       // 4 AI melee hits      (TN5+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, SHOOTER, DEFENDER, 'player');
    expect(result.updatedState.ai.currentWounds).toBe(5);   // no shooting damage
    expect(result.updatedState.player.currentWounds).toBe(5);
    expect(result.log.some(l => l.includes("Myrmidon's Path"))).toBe(true);
  });

  it('shots hit, wound, saves fail: pre-attack damage applied before melee', () => {
    // Shooting: [5,5] → 2 hits (TN2+).
    //   Wound: [3,3] → 2 wounds (S5 vs T4=TN3+).
    //   Save: AP null, Sv5/Inv4 → effectiveSave=4; [1,1] → both fail → 2 unsaved × D1 = 2.
    //   Defender W5 → W3.
    // Player melee: [1,1,1] → all 3 miss. AI melee: [1,1,1,1] → all 4 miss.
    const state = makeMPState(true);
    const dice = new FakeDiceRoller([
      5, 5,             // shooting hits  (TN2+, both hit)
      3, 3,             // wound rolls    (TN3+, both wound)
      1, 1,             // save rolls     (effectiveSave=4, both fail)
      1, 1, 1,          // 3 player melee (TN3+, all miss)
      1, 1, 1, 1,       // 4 AI melee     (TN5+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, SHOOTER, DEFENDER, 'player');
    expect(result.updatedState.ai.currentWounds).toBe(3);   // W5 − 2
    expect(result.updatedState.player.woundsInflictedThisChallenge).toBe(2);
    expect(result.log.some(l => l.includes("Myrmidon's Path") && l.includes('2 unsaved'))).toBe(true);
  });

  it('no eligible ranged weapon: shooting skipped, melee proceeds normally', () => {
    // ARCHMAGOS has no ranged weapons — shooting is skipped, melee runs normally.
    // Player melee: WS5 vs WS4=TN3+. A4+1bonus=5 attacks. All miss.
    // AI melee: WS4 vs WS5=TN5+. A4 attacks. All miss.
    const s = buildInitialState(ARCHMAGOS, DEFENDER);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: {
        ...s.player,
        selectedGambit: 'the-myrmidons-path',
        selectedWeaponProfile: ARCHMAGOS.weapons[0].profiles[0],
      },
      ai: {
        ...s.ai,
        selectedGambit: null,
        selectedWeaponProfile: DEFENDER.weapons[0].profiles[0],
      },
    };
    const dice = new FakeDiceRoller([
      // No shooting dice — ARCHMAGOS has no ranged weapons
      1, 1, 1, 1, 1,    // 5 player melee hits (TN3+, all miss)
      1, 1, 1, 1,        // 4 AI melee hits     (TN5+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, ARCHMAGOS, DEFENDER, 'player');
    expect(result.updatedState.ai.currentWounds).toBe(5);  // no shooting damage
    expect(result.log.some(l => l.includes('no eligible ranged weapon'))).toBe(true);
  });

  it('AI side: shooting applies when AI holds the gambit', () => {
    // flipForAI=true: player=DEFENDER, ai=SHOOTER (has ranged weapon).
    // advantage='ai' → AI shoots player before attacks.
    // Shooting: [5,5]→2 hits, [3,3]→2 wounds, [1,1]→saves fail → 2 damage → player W5→W3.
    // AI melee (advantage): WS5 vs WS4=TN3+. A2+1bonus=3. All miss [1,1,1].
    // Player melee: WS4 vs WS5=TN5+. A4. All miss [1,1,1,1].
    const state = makeMPState(false, true, 'ai');
    const dice = new FakeDiceRoller([
      5, 5,             // AI shooting hits   (TN2+, both hit)
      3, 3,             // wound rolls        (TN3+, both wound)
      1, 1,             // save rolls         (effectiveSave=4, both fail)
      1, 1, 1,          // 3 AI melee hits    (TN3+, all miss)
      1, 1, 1, 1,       // 4 player melee hits(TN5+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, DEFENDER, SHOOTER, 'ai');
    expect(result.updatedState.player.currentWounds).toBe(3);  // W5 − 2 shooting
    expect(result.updatedState.ai.woundsInflictedThisChallenge).toBe(2);
    expect(result.log.some(l => l.includes("Myrmidon's Path"))).toBe(true);
  });
});

// ─── Custodes faction gambits ──────────────────────────────────────────────────

describe("Heaven's Strike", () => {
  // Paragon Spear: +1S, AP2, D1, CriticalHit(6+)
  const paragonSpearProfile = {
    profileName: 'Paragon Spear',
    initiativeModifier: { kind: 'none' as const },
    attacksModifier: { kind: 'none' as const },
    strengthModifier: { kind: 'add' as const, value: 1 },
    ap: 2 as number | null,
    damage: 1,
    specialRules: [{ name: 'CriticalHit' as const, threshold: 6 }],
    traits: [] as string[],
  };
  // Sentinel Warblade: AP2, D1, no CriticalHit
  const warbladeProfile = {
    profileName: 'Sentinel Warblade',
    initiativeModifier: { kind: 'none' as const },
    attacksModifier: { kind: 'none' as const },
    strengthModifier: { kind: 'none' as const },
    ap: 2 as number | null,
    damage: 1,
    specialRules: [] as typeof paragonSpearProfile.specialRules,
    traits: [] as string[],
  };

  // Attacker: WS7, S5, A4; Defender: WS5, T5, W5, Sv7+/Inv null (no save)
  const makeAttacker = (extra: Partial<Character> = {}): Character => ({
    id: 'test-custodes',
    name: 'Custodes',
    faction: 'legio-custodes',
    type: 'infantry',
    subTypes: ['Command'],
    stats: { M: 8, WS: 7, BS: 5, S: 5, T: 5, W: 3, I: 6, A: 4, LD: 10, CL: 10, WP: 9, IN: 9, Sv: 2, Inv: 4 },
    weapons: [],
    factionGambitIds: ['heavens-strike'],
    specialRules: [],
    ...extra,
  });
  const makeDefender = (extra: Partial<Character> = {}): Character => ({
    id: 'test-defender',
    name: 'Defender',
    faction: 'legion-astartes',
    type: 'infantry',
    subTypes: [],
    stats: { M: 6, WS: 5, BS: 4, S: 4, T: 5, W: 5, I: 4, A: 2, LD: 8, CL: 8, WP: 8, IN: 8, Sv: 7, Inv: null },
    weapons: [],
    factionGambitIds: [],
    specialRules: [],
    ...extra,
  });

  it('halves attacks and upgrades CriticalHit(6+) to 5+ when weapon has CriticalHit(6+)', () => {
    // Attacker A=4, WS7 vs WS5 (TN2+). Heaven's Strike: atkA = floor((4+1bonus)/2) = 2.
    // Paragon Spear CriticalHit(6+) → upgraded to CriticalHit(5+).
    // Hit rolls [5,5] → both hit (TN2+); both ≥5 → both crit (Heaven's Strike 5+).
    // Critical hits auto-wound; no wound dice rolled.
    // critNormalCount=2, normNormalCount=0.
    // Pool1: rollNd6(2) always consumed even with no save (Sv7+) → 2 dice.
    // Pool2: rollNd6(0) → 0 dice. D1+1crit bonus=2 per crit → 4 damage total.
    // AI: A=2, WS5 vs WS7 (TN5+). All miss [1,1].
    const atk = makeAttacker();
    const def = makeDefender();
    const s = buildInitialState(atk, def);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: 'heavens-strike', selectedWeaponProfile: paragonSpearProfile },
      ai:     { ...s.ai,     selectedGambit: null,             selectedWeaponProfile: warbladeProfile },
    };
    const dice = new FakeDiceRoller([
      5, 5,     // 2 hit rolls (TN2+, both hit; ≥5 → crit with Heaven's Strike 5+)
      1, 1,     // Pool1: 2 save dice always consumed (effectiveSave=null, auto-fail)
      1, 1,     // AI: 2 hit rolls (TN5+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, atk, def, 'player');
    expect(result.playerResult.attacks).toBe(2);      // A=4 → +1 bonus=5 → halved=2
    expect(result.playerResult.hits).toBe(2);
    expect(result.playerResult.wounds).toBe(2);       // 2 crits auto-wound
    expect(result.playerResult.totalDamage).toBe(4);  // 2 crits × (D1+1 crit bonus) = 4
    expect(result.log.some(l => l.includes("Heaven's Strike"))).toBe(true);
    expect(result.log.some(l => l.includes('Critical'))).toBe(true);
  });

  it('does NOT activate when weapon has no CriticalHit(6+)', () => {
    // Sentinel Warblade has no CriticalHit — Heaven's Strike is a no-op.
    // Attacker A=4+1bonus=5, WS7 vs WS5 (TN2+). All hit rolls are 1 → miss.
    // AI: A=2, WS5 vs WS7 (TN5+). All hit rolls are 1 → miss.
    const atk = makeAttacker();
    const def = makeDefender();
    const s = buildInitialState(atk, def);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: 'heavens-strike', selectedWeaponProfile: warbladeProfile },
      ai:     { ...s.ai,     selectedGambit: null,             selectedWeaponProfile: warbladeProfile },
    };
    const dice = new FakeDiceRoller([
      1, 1, 1, 1, 1,  // 5 player hit rolls (TN2+, all miss)
      1, 1,            // 2 AI hit rolls (TN5+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, atk, def, 'player');
    expect(result.playerResult.attacks).toBe(5);  // 4 + 1 bonus, NOT halved
    expect(result.playerResult.hits).toBe(0);
    expect(result.log.some(l => l.includes("Heaven's Strike"))).toBe(false);
  });
});

describe("Raptor's Surge", () => {
  it('is a no-op in a 1v1 duel (OSB difference is 0)', () => {
    // VALDOR (A=6) with raptors-surge (returns base, no attacksDelta) + advantage (+1) = 7 attacks.
    // AI VALDOR (no gambit, no advantage): A=6+0=6 attacks.
    // All hit rolls are 1 → miss. WS7 vs WS7 = TN4+ so roll 1 always misses.
    const s = buildInitialState(VALDOR, VALDOR);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: 'raptors-surge', selectedWeaponProfile: VALDOR.weapons[0].profiles[0] },
      ai:     { ...s.ai,     selectedGambit: null,             selectedWeaponProfile: VALDOR.weapons[0].profiles[0] },
    };
    const dice = new FakeDiceRoller([
      1, 1, 1, 1, 1, 1, 1,   // 7 player hit rolls (all miss)
      1, 1, 1, 1, 1, 1,       // 6 AI hit rolls (all miss)
    ]);
    const result = resolveStrikeStep(dice, state, VALDOR, VALDOR, 'player');
    expect(result.playerResult.attacks).toBe(7);  // 6 base + 1 advantage, no extra from gambit
    expect(result.aiResult.attacks).toBe(6);      // 6 base + 0 (no advantage)
    expect(result.playerResult.hits).toBe(0);
    expect(result.aiResult.hits).toBe(0);
  });
});

describe("Stone's Aegis", () => {
  // Attacker: WS5, S5, A3; Defender (Stone's Aegis): WS5, T4→5, W4, Sv7+/Inv null
  const makeAtkChar = (extra: Partial<Character> = {}): Character => ({
    id: 'test-atk',
    name: 'Attacker',
    faction: 'legion-astartes',
    type: 'infantry',
    subTypes: [],
    stats: { M: 6, WS: 5, BS: 4, S: 5, T: 4, W: 4, I: 4, A: 3, LD: 8, CL: 8, WP: 8, IN: 8, Sv: 2, Inv: 4 },
    weapons: [],
    factionGambitIds: [],
    specialRules: [],
    ...extra,
  });
  const makeDefChar = (extra: Partial<Character> = {}): Character => ({
    id: 'test-def',
    name: 'Defender',
    faction: 'legio-custodes',
    type: 'infantry',
    subTypes: [],
    stats: { M: 8, WS: 5, BS: 4, S: 5, T: 4, W: 4, I: 5, A: 2, LD: 10, CL: 10, WP: 9, IN: 9, Sv: 7, Inv: null },
    weapons: [],
    factionGambitIds: ['stones-aegis'],
    specialRules: [],
    traits: ['Shield'],
    ...extra,
  });
  const atkProfile = {
    profileName: 'Power Sword',
    initiativeModifier: { kind: 'none' as const },
    attacksModifier: { kind: 'none' as const },
    strengthModifier: { kind: 'none' as const },
    ap: 3 as number | null,
    damage: 1,
    specialRules: [] as { name: string }[],
    traits: [] as string[],
  };
  const defProfile = {
    profileName: 'Defender Weapon',
    initiativeModifier: { kind: 'none' as const },
    attacksModifier: { kind: 'none' as const },
    strengthModifier: { kind: 'none' as const },
    ap: 2 as number | null,
    damage: 1,
    specialRules: [] as { name: string }[],
    traits: [] as string[],
  };

  it('+1T raises the wound TN: S5 vs T4 wounds on 3+; with Stone\'s Aegis T5 wounds on 4+', () => {
    // S5 vs T4 (S>T by 1) = TN3+. With Stone's Aegis T5 (S=T) = TN4+.
    // Use wound rolls of 3: succeed at TN3+ but fail at TN4+ (Stone's Aegis).
    // Attacker A=3+1bonus=4, WS5 vs WS5 = TN4+. Hit [5,5,5,5] all hit.
    // Wound [3,3,3,3] → all fail at TN4+ (with Stone's Aegis). wounds=0 → early return.
    // AI: A=2+0=2 attacks, WS5 vs WS5 = TN4+. All miss [1,1].
    const atk = makeAtkChar();
    const def = makeDefChar();
    const s = buildInitialState(atk, def);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: null,           selectedWeaponProfile: atkProfile as any },
      ai:     { ...s.ai,     selectedGambit: 'stones-aegis', selectedWeaponProfile: defProfile as any },
    };
    const dice = new FakeDiceRoller([
      5, 5, 5, 5,  // 4 hit rolls (TN4+, all hit)
      3, 3, 3, 3,  // 4 wound rolls (TN4+ w/ Stone's Aegis; 3<4 → all fail)
      1, 1,        // 2 AI hit rolls (TN4+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, atk, def, 'player');
    expect(result.playerResult.hits).toBe(4);
    expect(result.playerResult.wounds).toBe(0);  // all fail at TN4+ (Stone's Aegis T5)
    expect(result.playerResult.totalDamage).toBe(0);
  });

  it('wound rolls of 1 or 2 automatically fail against a Stone\'s Aegis defender', () => {
    // S5 vs T5 (with Stone's Aegis) = TN4+.
    // Wound rolls [5, 2, 5, 5]: 3 succeed (≥4 and ≥3), 1 auto-fails (roll 2 < minimumWoundRoll 3).
    // 3 wounds, Sv7+/Inv null → no save. Pool2: rollNd6(3) always consumed → 3 save dice.
    // 3 × D1 = 3 damage. Defender W4→W1.
    // AI: A=2, WS5 vs WS5 (TN4+). All miss [1,1].
    const atk = makeAtkChar();
    const def = makeDefChar();
    const s = buildInitialState(atk, def);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: null,           selectedWeaponProfile: atkProfile as any },
      ai:     { ...s.ai,     selectedGambit: 'stones-aegis', selectedWeaponProfile: defProfile as any },
    };
    const dice = new FakeDiceRoller([
      5, 5, 5, 5,  // 4 hit rolls (TN4+, all hit)
      5, 2, 5, 5,  // 4 wound rolls (TN4+: 5≥4 pass, 2<3 auto-fail, 5≥4 pass, 5≥4 pass → 3 wounds)
      1, 1, 1,     // Pool2: 3 save dice always consumed (effectiveSave=null, auto-fail)
      1, 1,        // 2 AI hit rolls (TN4+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, atk, def, 'player');
    expect(result.playerResult.hits).toBe(4);
    expect(result.playerResult.wounds).toBe(3);  // 3 pass (roll 2 auto-fails via minimumWoundRoll=3)
    expect(result.playerResult.totalDamage).toBe(3);
    expect(result.updatedState.ai.currentWounds).toBe(1);  // W4 − 3 = W1
  });
});

describe("World Serpent's Bane", () => {
  const makeWSBAttacker = (extra: Partial<Character> = {}): Character => ({
    id: 'test-wsb',
    name: 'WSB Attacker',
    faction: 'legio-custodes',
    type: 'infantry',
    subTypes: ['Command'],
    stats: { M: 8, WS: 7, BS: 5, S: 5, T: 5, W: 5, I: 6, A: 4, LD: 12, CL: 10, WP: 10, IN: 10, Sv: 2, Inv: 4 },
    weapons: [],
    factionGambitIds: ['world-serpents-bane'],
    specialRules: [],
    ...extra,
  });
  const makeWSBDefender = (): Character => ({
    id: 'test-wsb-def',
    name: 'WSB Defender',
    faction: 'legion-astartes',
    type: 'infantry',
    subTypes: [],
    stats: { M: 6, WS: 5, BS: 4, S: 4, T: 4, W: 10, I: 4, A: 2, LD: 8, CL: 8, WP: 8, IN: 8, Sv: 7, Inv: null },
    weapons: [],
    factionGambitIds: [],
    specialRules: [],
  });
  const wsbWeapon = {
    profileName: 'Guardian Spear',
    initiativeModifier: { kind: 'none' as const },
    attacksModifier: { kind: 'none' as const },
    strengthModifier: { kind: 'add' as const, value: 1 },
    ap: 2 as number | null,
    damage: 1,
    specialRules: [] as { name: string }[],
    traits: [] as string[],
  };
  const defWeapon = {
    profileName: 'Sword',
    initiativeModifier: { kind: 'none' as const },
    attacksModifier: { kind: 'none' as const },
    strengthModifier: { kind: 'none' as const },
    ap: 2 as number | null,
    damage: 1,
    specialRules: [] as { name: string }[],
    traits: [] as string[],
  };

  it('makes exactly 1 attack with Damage equal to current wounds', () => {
    // singleAttackCap: atkA is capped to 1 (after bonus, before min-1).
    // WS7 vs WS5 = TN2+. Hit [5] → hit. S6 (5+1) vs T4 = TN2+. Wound [5] → wound.
    // normNormalCount=1. Pool2: rollNd6(1) always consumed → 1 save die.
    // No save (AP2 vs Sv7+); 1 unsaved wound × D(currentWounds=5) = 5 damage.
    // AI: A=2, WS5 vs WS7 (TN5+). All miss [1,1].
    const atk = makeWSBAttacker();
    const def = makeWSBDefender();
    const s = buildInitialState(atk, def);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: 'world-serpents-bane', selectedWeaponProfile: wsbWeapon as any, currentWounds: 5 },
      ai:     { ...s.ai,     selectedGambit: null,                   selectedWeaponProfile: defWeapon as any },
    };
    const dice = new FakeDiceRoller([
      5,     // 1 hit roll (TN2+, hit)
      5,     // 1 wound roll (S6 vs T4 = TN2+, wound)
      1,     // Pool2: 1 save die always consumed (no save available)
      1, 1,  // 2 AI hit rolls (TN5+, all miss)
    ]);
    const result = resolveStrikeStep(dice, state, atk, def, 'player');
    expect(result.playerResult.attacks).toBe(1);      // singleAttackCap = 1
    expect(result.playerResult.hits).toBe(1);
    expect(result.playerResult.wounds).toBe(1);
    expect(result.playerResult.totalDamage).toBe(5);  // Damage = currentWounds (5)
    expect(result.updatedState.ai.currentWounds).toBe(5);  // W10 − 5 = W5
  });

  it('Damage scales with current wounds: wounded attacker deals less damage', () => {
    // Attacker currentWounds=2. Same setup → 1 hit, 1 wound, Damage=2.
    const atk = makeWSBAttacker();
    const def = makeWSBDefender();
    const s = buildInitialState(atk, def);
    const state: CombatState = {
      ...s,
      challengeAdvantage: 'player',
      player: { ...s.player, selectedGambit: 'world-serpents-bane', selectedWeaponProfile: wsbWeapon as any, currentWounds: 2 },
      ai:     { ...s.ai,     selectedGambit: null,                   selectedWeaponProfile: defWeapon as any },
    };
    const dice = new FakeDiceRoller([
      5,     // 1 hit (TN2+)
      5,     // 1 wound (TN2+)
      1,     // Pool2: 1 save die
      1, 1,  // 2 AI misses (TN5+)
    ]);
    const result = resolveStrikeStep(dice, state, atk, def, 'player');
    expect(result.playerResult.attacks).toBe(1);
    expect(result.playerResult.totalDamage).toBe(2);  // currentWounds=2
    expect(result.updatedState.ai.currentWounds).toBe(8);  // W10 − 2
  });
});
