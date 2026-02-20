/**
 * Strike Step resolution.
 *
 * The model with Challenge Advantage attacks first.  After all their attacks
 * resolve (including potential casualty), the other model attacks.
 *
 * Each attack sequence: Hit Tests → Wound Tests → Saving Throws → Damage.
 *
 * Rules reference: HH3 Challenge Sub-Phase, Step 4 (Strike).
 */
import type { DiceRoller }    from './dice.js';
import type { CombatState, CombatantState }  from '../models/combatState.js';
import type { Character }     from '../models/character.js';
import type { WeaponProfile } from '../models/weapon.js';
import { getHitTargetNumber, getWoundTargetNumber, getEffectiveSave } from './tables.js';
import { getStrikeModifiers } from './gambitEffects.js';

/** Detailed result of one model's attack sequence. */
export interface AttackResult {
  attackerName: string;
  attacks: number;       // number of Hit Tests rolled
  hitRolls: number[];
  hits: number;
  woundRolls: number[];
  wounds: number;
  saveRolls: number[];
  unsavedWounds: number;
  totalDamage: number;
  /** Wounds remaining on defender after this attack sequence. */
  defenderWoundsRemaining: number;
  /** True if the defender was reduced to 0 Wounds. */
  defenderIsCasualty: boolean;
  /** Number of unmodified hit rolls of 1 (used for Biological Overload self-wound). */
  hitRollOnes: number;
  log: string[];
}

/** Output of the full Strike step (both attack sequences). */
export interface StrikeStepResult {
  firstAttacker: 'player' | 'ai';
  playerResult: AttackResult;
  aiResult: AttackResult;
  /** Updated combat state after all attacks. */
  updatedState: CombatState;
  log: string[];
}

/**
 * Resolve one model's attack sequence against the other.
 *
 * @param dice          - dice roller
 * @param attacker      - combatant state of the attacker
 * @param defender      - combatant state of the defender
 * @param attackerChar  - full character record of attacker
 * @param defenderChar  - full character record of defender
 * @param profile       - weapon profile being used by attacker
 * @param attackBonus   - +1 from winning Focus Roll
 * @param isForPlayer   - true if the attacker is the human player
 * @param state         - current combat state (for gambit references)
 * @param everyStrikeActive - true if Every Strike Foreseen is in effect for defender
 * @returns attack result and updated defender wound total
 */
function resolveAttackSequence(
  dice: DiceRoller,
  attacker: CombatantState,
  defender: CombatantState,
  attackerChar: Character,
  defenderChar: Character,
  profile: WeaponProfile,
  attackBonus: number,
  isForPlayer: boolean,
  state: CombatState,
  everyStrikeActive: boolean,
): AttackResult {
  const log: string[] = [];

  // ── Compute effective stats ──────────────────────────────────────────────
  // Only roll D3 when the gambit actually needs it (Flurry of Blows).
  // Calling rollD3() unconditionally would make the dice sequence
  // non-deterministic for every other gambit.
  const d3Result = attacker.selectedGambit === 'flurry-of-blows' ? dice.rollD3() : 1;
  const mods = getStrikeModifiers(attacker.selectedGambit, state, isForPlayer, d3Result);

  // Defender's gambit may override their Toughness (Steadfast Resilience, Tempered by War)
  const defenderMods = getStrikeModifiers(
    defender.selectedGambit, state, !isForPlayer, 1, attackerChar.stats.WS,
  );

  let atkWS = attackerChar.stats.WS + mods.wsDelta;

  // Apply weapon profile Strength modifier (kind:'none' = base S, 'add' = S+n, 'fixed' = n, 'mult' = S*n)
  const sm = profile.strengthModifier;
  let atkS = attackerChar.stats.S;
  if (sm.kind === 'add')   atkS += sm.value;
  if (sm.kind === 'fixed') atkS  = sm.value;
  if (sm.kind === 'mult')  atkS *= sm.value;

  // Apply weapon profile Attacks modifier, then gambit delta/override
  const am = profile.attacksModifier;
  let baseA = attackerChar.stats.A;
  if (am.kind === 'add')   baseA += am.value;
  if (am.kind === 'fixed') baseA  = am.value;

  let atkA = mods.attacksOverride !== null
    ? mods.attacksOverride
    : baseA + mods.attacksDelta;

  // Taunt and Bait: reduce own WS/A to enemy's (or enemy-1 if equal)
  if (attacker.selectedGambit === 'taunt-and-bait') {
    const defWS = defenderChar.stats.WS;
    const defA  = defenderChar.stats.A;
    atkWS = atkWS <= defWS ? defWS - 1 : defWS;
    atkA  = atkA  <= defA  ? defA  - 1 : defA;
  }

  // Minimum 1 attack
  atkA = Math.max(1, atkA + attackBonus);

  // Single-attack cap (Guard Up / Withdraw)
  if (mods.singleAttackCap) atkA = 1;

  const defWS = defenderChar.stats.WS;
  const defT  = defenderChar.stats.T;
  // Steadfast Resilience / Tempered by War may override defender's effective Toughness
  const effectiveDefT = defenderMods.overrideDefenderToughness ?? defT;

  // Effective Strength and Damage for wound/damage calc
  const effectiveS = Math.max(1, atkS + mods.strengthDelta);

  // Weapon AP, possibly improved by Abyssal Strike
  let weaponAP = profile.ap;
  if (mods.apImprovement > 0 && weaponAP !== null) {
    weaponAP = Math.max(2, weaponAP - mods.apImprovement);
  }
  const baseDmg = profile.damage;

  const tNote = effectiveDefT !== defT ? ` (effective T${effectiveDefT})` : '';
  log.push(
    `${attackerChar.name} attacks: ${atkA} attacks, WS${atkWS} vs WS${defWS}, S${effectiveS} vs T${defT}${tNote}, AP${weaponAP ?? '-'}`,
  );

  // ── Hit Tests ────────────────────────────────────────────────────────────
  // Mirror-Form: Adamus hits always on 4+ regardless of WS comparison
  const mirrorFormActive = attacker.selectedGambit === 'mirror-form';
  const hitTN = mirrorFormActive ? 4 : getHitTargetNumber(atkWS, defWS);
  const hitRolls = dice.rollNd6(atkA);
  let hits = 0;
  let guardUpMissCount = 0;
  let hitRollOnes = 0; // for Biological Overload self-wound tracking

  for (const roll of hitRolls) {
    // Track unmodified 1s for Biological Overload
    if (roll === 1) hitRollOnes++;

    const isHit = hitTN <= 6 && roll >= hitTN;

    // Check for Critical Hit special rule (extra wound on high roll)
    // Sources: weapon special rules AND gambit modifiers (e.g., Executioner's Tax, Death's Champion)
    let critHit = false;
    for (const sr of profile.specialRules) {
      if (sr.name === 'CriticalHit' && roll >= sr.threshold) critHit = true;
    }
    if (mods.criticalHitThreshold !== null && roll >= mods.criticalHitThreshold) {
      critHit = true;
    }

    if (isHit || critHit) {
      hits++;
    } else {
      // Missed – Guard Up bonus for next Focus Roll
      if (defender.selectedGambit === 'guard-up') guardUpMissCount++;
    }
  }

  log.push(`Hit rolls [${hitRolls.join(',')}] vs TN${hitTN} → ${hits} hit(s)`);

  if (hits === 0) {
    const defWounds = defender.currentWounds;
    return {
      attackerName: attackerChar.name,
      attacks: atkA, hitRolls, hits: 0,
      woundRolls: [], wounds: 0,
      saveRolls: [], unsavedWounds: 0,
      totalDamage: 0, defenderWoundsRemaining: defWounds,
      defenderIsCasualty: false, hitRollOnes, log,
    };
  }

  // ── Wound Tests ──────────────────────────────────────────────────────────
  // Base wound TN uses effectiveDefT (may be overridden by Steadfast Resilience / Tempered by War)
  const baseWoundTN = getWoundTargetNumber(effectiveS, effectiveDefT);

  // Poisoned: if the weapon has Poisoned(X+), wounds always on the *better* of table TN or X
  let poisonedTN: number | null = null;
  for (const sr of profile.specialRules) {
    if (sr.name === 'Poisoned') poisonedTN = sr.threshold;
  }

  const woundRolls = dice.rollNd6(hits);
  let wounds          = 0;
  let breachingWounds = 0;  // wounds treated as AP2 (Breaching rule)
  let shredTriggers   = 0;  // wounds that deal +1 Damage (Shred rule)
  // Phage(T): Merciless Strike reduces defender T by 1 per unsaved wound
  let currentDefT = effectiveDefT;

  for (const roll of woundRolls) {
    // With Phage(T), recompute the wound TN each time as T decreases
    const tableWoundTN = mods.phageToughness
      ? getWoundTargetNumber(effectiveS, currentDefT)
      : baseWoundTN;

    // Poisoned: use whichever TN is easier (lower number = easier to wound)
    const woundTN = poisonedTN !== null
      ? Math.min(tableWoundTN, poisonedTN)
      : tableWoundTN;

    let isWound = woundTN <= 6 && roll >= woundTN;
    for (const sr of profile.specialRules) {
      // Rending: high hit roll auto-wounds (approximated on wound roll here)
      if (sr.name === 'Rending' && roll >= sr.threshold) isWound = true;
    }
    if (isWound) {
      wounds++;
      if (mods.phageToughness) currentDefT = Math.max(1, currentDefT - 1);
      for (const sr of profile.specialRules) {
        // Breaching: wound roll ≥ threshold → this wound ignores normal armour (AP2)
        if (sr.name === 'Breaching' && roll >= sr.threshold) breachingWounds++;
        // Shred: wound roll ≥ threshold → this wound gains +1 Damage
        if (sr.name === 'Shred'     && roll >= sr.threshold) shredTriggers++;
      }
    }
  }

  const phageNote    = mods.phageToughness ? ' (Phage: T reduces per wound)' : '';
  const poisonNote   = poisonedTN !== null ? ` (Poisoned ${poisonedTN}+, table ${baseWoundTN})` : '';
  const effectiveWoundTN = poisonedTN !== null ? Math.min(baseWoundTN, poisonedTN) : baseWoundTN;
  log.push(`Wound rolls [${woundRolls.join(',')}] vs TN${effectiveWoundTN}${poisonNote}${phageNote} → ${wounds} wound(s)`);

  if (wounds === 0) {
    return {
      attackerName: attackerChar.name,
      attacks: atkA, hitRolls, hits,
      woundRolls, wounds: 0,
      saveRolls: [], unsavedWounds: 0,
      totalDamage: 0, defenderWoundsRemaining: defender.currentWounds,
      defenderIsCasualty: false, hitRollOnes, log,
    };
  }

  // ── Saving Throws ────────────────────────────────────────────────────────
  const defSv  = defenderChar.stats.Sv;
  const defInv = defenderChar.stats.Inv;
  const normalWounds  = wounds - breachingWounds;
  const effectiveSave = getEffectiveSave(defSv, defInv, weaponAP);
  // Breaching wounds are always treated as AP2 for saves regardless of weapon AP
  const breachSave    = breachingWounds > 0 ? getEffectiveSave(defSv, defInv, 2) : null;

  let saved    = 0;
  let evsfUsed = false; // Every Strike Foreseen may only re-roll ONE failed save

  // Normal wounds — saved against weapon AP
  const normalSaveRolls = dice.rollNd6(normalWounds);
  if (effectiveSave !== null) {
    for (let i = 0; i < normalSaveRolls.length; i++) {
      let roll = normalSaveRolls[i];
      if (everyStrikeActive && !evsfUsed && roll < effectiveSave) {
        const reroll = dice.rollD6();
        log.push(`Every Strike Foreseen: re-roll save ${roll} → ${reroll}`);
        normalSaveRolls[i] = reroll;
        roll = reroll;
        evsfUsed = true;
      }
      if (roll >= effectiveSave) saved++;
    }
  }

  // Breaching wounds — always AP2
  const breachSaveRolls = dice.rollNd6(breachingWounds);
  if (breachSave !== null) {
    for (let i = 0; i < breachSaveRolls.length; i++) {
      let roll = breachSaveRolls[i];
      if (everyStrikeActive && !evsfUsed && roll < breachSave) {
        const reroll = dice.rollD6();
        log.push(`Every Strike Foreseen: re-roll save ${roll} → ${reroll}`);
        breachSaveRolls[i] = reroll;
        roll = reroll;
        evsfUsed = true;
      }
      if (roll >= breachSave) saved++;
    }
  }

  const saveRolls = [...normalSaveRolls, ...breachSaveRolls];
  if (effectiveSave !== null || breachSave !== null) {
    const saveLine = breachingWounds > 0
      ? `Normal saves [${normalSaveRolls.join(',')}] vs ${effectiveSave ?? '-'}+, Breaching saves [${breachSaveRolls.join(',')}] vs ${breachSave ?? '-'}+ → ${saved} saved`
      : `Save rolls [${normalSaveRolls.join(',')}] vs ${effectiveSave}+ → ${saved} saved`;
    log.push(saveLine);
  } else {
    log.push(`No save available (AP${weaponAP ?? '-'} vs Sv${defSv}+/Inv${defInv ?? '-'})`);
  }

  let unsavedWounds = wounds - saved;

  // ── Feel No Pain ─────────────────────────────────────────────────────────
  // After failed saves, the defender may roll Feel No Pain to cancel wounds.
  let fnpThreshold: number | null = null;
  for (const sr of defenderChar.specialRules) {
    if (sr.name === 'FeelNoPain') fnpThreshold = sr.threshold;
  }
  if (fnpThreshold !== null && unsavedWounds > 0) {
    const fnpRolls = dice.rollNd6(unsavedWounds);
    const fnpSaved = fnpRolls.filter(r => r >= fnpThreshold!).length;
    log.push(`Feel No Pain ${fnpThreshold}+: rolls [${fnpRolls.join(',')}] → ${fnpSaved} wound(s) cancelled`);
    unsavedWounds -= fnpSaved;
  }

  if (unsavedWounds === 0) {
    return {
      attackerName: attackerChar.name,
      attacks: atkA, hitRolls, hits,
      woundRolls, wounds,
      saveRolls, unsavedWounds: 0,
      totalDamage: 0, defenderWoundsRemaining: defender.currentWounds,
      defenderIsCasualty: false, hitRollOnes, log,
    };
  }

  // ── Apply Damage ─────────────────────────────────────────────────────────
  let dmgPerWound = baseDmg + mods.damageDelta;
  if (mods.damageSetToOne) dmgPerWound = 1;

  // Eternal Warrior: reduce damage by X, minimum 1
  // A Wall Unyielding also grants EW(1) to its user during the opponent's Strike Step
  let ewReduction = 0;
  for (const sr of defenderChar.specialRules) {
    if (sr.name === 'EternalWarrior') ewReduction = sr.value;
  }
  if (defender.selectedGambit === 'a-wall-unyielding') {
    ewReduction = Math.max(ewReduction, 1);
  }
  dmgPerWound = Math.max(1, dmgPerWound - ewReduction);

  // Shred: wounds that triggered Shred deal +1 Damage (suppressed when Flurry caps D to 1)
  const unsavedShredWounds = wounds > 0 && !mods.damageSetToOne
    ? Math.round((shredTriggers / wounds) * unsavedWounds)
    : 0;
  const shredDmgPerWound = Math.max(1, (baseDmg + mods.damageDelta + 1) - ewReduction);
  const totalDamage =
    (unsavedWounds - unsavedShredWounds) * dmgPerWound +
    unsavedShredWounds * shredDmgPerWound;

  const defenderWoundsRemaining = Math.max(0, defender.currentWounds - totalDamage);
  const defenderIsCasualty = defenderWoundsRemaining <= 0;

  const shredNote = unsavedShredWounds > 0
    ? ` (${unsavedShredWounds} Shred wound(s) at +1 dmg)`
    : '';
  log.push(
    `${unsavedWounds} unsaved wound(s) × ${dmgPerWound} dmg${shredNote} = ${totalDamage} damage. ` +
    `${defenderChar.name}: ${defender.currentWounds} → ${defenderWoundsRemaining} wounds` +
    (defenderIsCasualty ? ' (CASUALTY)' : ''),
  );

  return {
    attackerName: attackerChar.name,
    attacks: atkA, hitRolls, hits,
    woundRolls, wounds,
    saveRolls, unsavedWounds,
    totalDamage, defenderWoundsRemaining,
    defenderIsCasualty, hitRollOnes, log,
  };
}

/**
 * Resolve Spiteful Demise (Iron Warriors): when reduced to 0 wounds the
 * model immediately inflicts one automatic hit on the opponent
 * (S6/AP4/D2, Breaching(5+)).
 */
function resolveSpitefullDemise(
  dice: DiceRoller,
  attackerName: string,
  defenderState: CombatantState,
  defenderChar: Character,
  log: string[],
): { newWounds: number; isCasualty: boolean } {
  log.push(`${attackerName} (Spiteful Demise): 1 automatic hit — S6/AP4/D2, Breaching(5+)!`);
  const woundTN = getWoundTargetNumber(6, defenderChar.stats.T);
  const woundRoll = dice.rollD6();
  const breaching = woundRoll >= 5;
  const isWound   = (woundTN <= 6 && woundRoll >= woundTN) || breaching;
  log.push(`Spiteful Demise: Wound roll ${woundRoll} vs TN${woundTN}${breaching ? ' (Breaching)' : ''} → ${isWound ? 'wound' : 'no wound'}`);
  if (!isWound) return { newWounds: defenderState.currentWounds, isCasualty: false };

  const weaponAP = breaching ? 2 : 4;
  const effectiveSave = getEffectiveSave(defenderChar.stats.Sv, defenderChar.stats.Inv, weaponAP);
  if (effectiveSave !== null) {
    const saveRoll = dice.rollD6();
    const saved = saveRoll >= effectiveSave;
    log.push(`Spiteful Demise: Save roll ${saveRoll} vs ${effectiveSave}+ → ${saved ? 'saved' : 'failed'}`);
    if (saved) return { newWounds: defenderState.currentWounds, isCasualty: false };
  } else {
    log.push(`Spiteful Demise: No save (AP${weaponAP} vs Sv${defenderChar.stats.Sv}/Inv${defenderChar.stats.Inv ?? '-'})`);
  }

  // Apply D2 damage with EW reduction
  let ewReduction = 0;
  for (const sr of defenderChar.specialRules) {
    if (sr.name === 'EternalWarrior') ewReduction = sr.value;
  }
  const damage = Math.max(1, 2 - ewReduction);
  const newWounds  = Math.max(0, defenderState.currentWounds - damage);
  const isCasualty = newWounds <= 0;
  log.push(
    `Spiteful Demise: ${damage} damage. ${defenderChar.name}: ${defenderState.currentWounds} → ${newWounds}` +
    (isCasualty ? ' (CASUALTY)' : ''),
  );
  return { newWounds, isCasualty };
}

/**
 * Apply Duty is Sacrifice self-wounds (Salamanders).
 * The gambit user suffers automatic wounds (AP2, D1; Invulnerable save only).
 */
function applyDutyIsSacrificeWounds(
  dice: DiceRoller,
  selfState: CombatantState,
  selfChar: Character,
  wounds: number,
  log: string[],
): { newWounds: number; isCasualty: boolean } {
  log.push(`Duty is Sacrifice: ${selfChar.name} suffers ${wounds} automatic wound(s) (AP2, D1; Inv save only).`);
  let current = selfState.currentWounds;
  for (let i = 0; i < wounds && current > 0; i++) {
    const inv = selfChar.stats.Inv;
    if (inv !== null) {
      const roll = dice.rollD6();
      if (roll >= inv) {
        log.push(`  Inv save ${roll} vs ${inv}+ — saved.`);
        continue;
      }
      log.push(`  Inv save ${roll} vs ${inv}+ — failed.`);
    } else {
      log.push('  No Invulnerable Save — wound taken.');
    }
    current = Math.max(0, current - 1);
  }
  if (current <= 0) log.push(`  ${selfChar.name} is removed as a Casualty!`);
  return { newWounds: current, isCasualty: current <= 0 };
}

/**
 * Resolve the full Strike Step.
 *
 * The model that won Challenge Advantage attacks first.  If they kill the
 * opponent the second model does not attack.
 */
export function resolveStrikeStep(
  dice: DiceRoller,
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
  advantage: 'player' | 'ai',
): StrikeStepResult {
  const log: string[] = [];

  const everyStrikeForeseenForPlayer =
    state.ai.selectedGambit === 'every-strike-foreseen';
  const everyStrikeForeseenForAI =
    state.player.selectedGambit === 'every-strike-foreseen';

  // Determine attack bonus (+1 Attacks for Focus Roll winner)
  const playerAttackBonus = advantage === 'player' ? 1 : 0;
  const aiAttackBonus     = advantage === 'ai'     ? 1 : 0;

  const playerProfile = state.player.selectedWeaponProfile!;
  const aiProfile     = state.ai.selectedWeaponProfile!;

  let updatedState = { ...state };
  let playerResult: AttackResult;
  let aiResult: AttackResult;

  // ── Duty is Sacrifice: self-wounds at the start of the Strike Step ────────
  if (state.player.selectedGambit === 'duty-is-sacrifice') {
    const playerMods = getStrikeModifiers('duty-is-sacrifice', state, true);
    const dis = applyDutyIsSacrificeWounds(dice, state.player, playerChar, playerMods.dutyIsSacrificeWounds, log);
    updatedState = {
      ...updatedState,
      player: { ...updatedState.player, currentWounds: dis.newWounds, isCasualty: dis.isCasualty },
    };
  }
  if (state.ai.selectedGambit === 'duty-is-sacrifice') {
    const aiMods = getStrikeModifiers('duty-is-sacrifice', state, false);
    const dis = applyDutyIsSacrificeWounds(dice, state.ai, aiChar, aiMods.dutyIsSacrificeWounds, log);
    updatedState = {
      ...updatedState,
      ai: { ...updatedState.ai, currentWounds: dis.newWounds, isCasualty: dis.isCasualty },
    };
  }

  if (advantage === 'player') {
    // Player attacks first
    playerResult = resolveAttackSequence(
      dice,
      state.player, state.ai,
      playerChar, aiChar,
      playerProfile, playerAttackBonus,
      true, state,
      everyStrikeForeseenForPlayer,
    );
    log.push(...playerResult.log);

    // Update AI wounds
    updatedState = {
      ...updatedState,
      ai: {
        ...updatedState.ai,
        currentWounds: playerResult.defenderWoundsRemaining,
        isCasualty:    playerResult.defenderIsCasualty,
        // Guard Up: enemy missed attacks accumulate as focus bonus
        guardUpFocusBonus: state.ai.selectedGambit === 'guard-up'
          ? 0  // guard up is on the AI; misses by player would boost AI
          : state.ai.guardUpFocusBonus,
      },
    };

    // Track wounds inflicted
    updatedState = {
      ...updatedState,
      player: {
        ...updatedState.player,
        woundsInflictedThisChallenge:
          state.player.woundsInflictedThisChallenge + playerResult.totalDamage,
      },
    };

    // Spiteful Demise: AI inflicts auto-hit on player when reduced to 0 wounds
    if (playerResult.defenderIsCasualty && updatedState.ai.selectedGambit === 'spiteful-demise') {
      const sd = resolveSpitefullDemise(dice, aiChar.name, updatedState.player, playerChar, log);
      updatedState = {
        ...updatedState,
        player: { ...updatedState.player, currentWounds: sd.newWounds, isCasualty: sd.isCasualty },
      };
    }

    // AI attacks second (only if not already a casualty)
    if (!playerResult.defenderIsCasualty) {
      aiResult = resolveAttackSequence(
        dice,
        updatedState.ai, updatedState.player,
        aiChar, playerChar,
        aiProfile, aiAttackBonus,
        false, updatedState,
        everyStrikeForeseenForAI,
      );
      log.push(...aiResult.log);
    } else {
      aiResult = {
        attackerName: aiChar.name,
        attacks: 0, hitRolls: [], hits: 0,
        woundRolls: [], wounds: 0,
        saveRolls: [], unsavedWounds: 0,
        totalDamage: 0, defenderWoundsRemaining: updatedState.player.currentWounds,
        defenderIsCasualty: false, hitRollOnes: 0, log: ['AI did not attack — already a casualty.'],
      };
      log.push('AI did not attack — AI was removed as a casualty.');
    }
  } else {
    // AI attacks first
    aiResult = resolveAttackSequence(
      dice,
      state.ai, state.player,
      aiChar, playerChar,
      aiProfile, aiAttackBonus,
      false, state,
      everyStrikeForeseenForAI,
    );
    log.push(...aiResult.log);

    updatedState = {
      ...updatedState,
      player: {
        ...updatedState.player,
        currentWounds: aiResult.defenderWoundsRemaining,
        isCasualty:    aiResult.defenderIsCasualty,
      },
      ai: {
        ...updatedState.ai,
        woundsInflictedThisChallenge:
          state.ai.woundsInflictedThisChallenge + aiResult.totalDamage,
      },
    };

    // Spiteful Demise: player inflicts auto-hit on AI when reduced to 0 wounds
    if (aiResult.defenderIsCasualty && updatedState.player.selectedGambit === 'spiteful-demise') {
      const sd = resolveSpitefullDemise(dice, playerChar.name, updatedState.ai, aiChar, log);
      updatedState = {
        ...updatedState,
        ai: { ...updatedState.ai, currentWounds: sd.newWounds, isCasualty: sd.isCasualty },
      };
    }

    if (!aiResult.defenderIsCasualty) {
      playerResult = resolveAttackSequence(
        dice,
        updatedState.player, updatedState.ai,
        playerChar, aiChar,
        playerProfile, playerAttackBonus,
        true, updatedState,
        everyStrikeForeseenForPlayer,
      );
      log.push(...playerResult.log);
    } else {
      playerResult = {
        attackerName: playerChar.name,
        attacks: 0, hitRolls: [], hits: 0,
        woundRolls: [], wounds: 0,
        saveRolls: [], unsavedWounds: 0,
        totalDamage: 0, defenderWoundsRemaining: updatedState.ai.currentWounds,
        defenderIsCasualty: false, hitRollOnes: 0, log: ['Player did not attack — already a casualty.'],
      };
      log.push('Player did not attack — Player was removed as a casualty.');
    }
  }

  // Update wounds inflicted (second attacker)
  if (advantage === 'player') {
    updatedState = {
      ...updatedState,
      player: {
        ...updatedState.player,
        currentWounds: aiResult!.defenderWoundsRemaining,
        isCasualty:    aiResult!.defenderIsCasualty,
      },
      ai: {
        ...updatedState.ai,
        woundsInflictedThisChallenge:
          updatedState.ai.woundsInflictedThisChallenge + aiResult!.totalDamage,
      },
    };
  } else {
    updatedState = {
      ...updatedState,
      ai: {
        ...updatedState.ai,
        currentWounds: playerResult!.defenderWoundsRemaining,
        isCasualty:    playerResult!.defenderIsCasualty,
      },
      player: {
        ...updatedState.player,
        woundsInflictedThisChallenge:
          updatedState.player.woundsInflictedThisChallenge + playerResult!.totalDamage,
      },
    };
  }

  // ── Biological Overload self-wounds (Eversor Assassin) ───────────────────
  // For each unmodified hit roll of 1 in the Eversor's own attack sequence,
  // the Eversor suffers 1 wound (AP2, D1, allocated after Strike Step).
  // Self-wound cannot be prevented by invulnerable save (per rules text).
  const playerBioOverload = state.player.selectedGambit === 'biological-overload';
  const aiBioOverload     = state.ai.selectedGambit === 'biological-overload';

  if (playerBioOverload && playerResult!.hitRollOnes > 0) {
    const selfWounds = playerResult!.hitRollOnes;
    log.push(`Biological Overload: ${playerChar.name} suffers ${selfWounds} self-wound(s) (AP2/D1) from hit rolls of 1.`);
    const newW = Math.max(0, updatedState.player.currentWounds - selfWounds);
    updatedState = {
      ...updatedState,
      player: { ...updatedState.player, currentWounds: newW, isCasualty: newW <= 0 },
    };
  }

  if (aiBioOverload && aiResult!.hitRollOnes > 0) {
    const selfWounds = aiResult!.hitRollOnes;
    log.push(`Biological Overload: ${aiChar.name} suffers ${selfWounds} self-wound(s) (AP2/D1) from hit rolls of 1.`);
    const newW = Math.max(0, updatedState.ai.currentWounds - selfWounds);
    updatedState = {
      ...updatedState,
      ai: { ...updatedState.ai, currentWounds: newW, isCasualty: newW <= 0 },
    };
  }

  return {
    firstAttacker: advantage,
    playerResult: playerResult!,
    aiResult:     aiResult!,
    updatedState,
    log,
  };
}
