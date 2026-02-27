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
import type { DiceRoller } from './dice.js';
import type { CombatState, CombatantState } from '../models/combatState.js';
import type { Character } from '../models/character.js';
import type { WeaponProfile } from '../models/weapon.js';
import { isSwordProfile } from '../models/weapon.js';
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
  forceBoost: string | null = null,
  forcedAttacks: number | null = null,
): AttackResult {
  const log: string[] = [];

  // ── Compute effective stats ──────────────────────────────────────────────
  // Roll D3 for weapons with 6+D3 attacks (e.g. Conflagration) before anything else.
  const weaponD3 = (profile.attacksExtraD3 ?? false) ? dice.rollD3() : 0;

  // Only roll D3 when the gambit actually needs it (Flurry of Blows).
  // Calling rollD3() unconditionally would make the dice sequence
  // non-deterministic for every other gambit.
  const d3Result = attacker.selectedGambit === 'flurry-of-blows' ? dice.rollD3() : 1;
  const rawMods = getStrikeModifiers(attacker.selectedGambit, state, isForPlayer, d3Result);
  // Sword of the Order: -1A and CriticalHit(6+) only apply when using a sword weapon.
  const mods = (attacker.selectedGambit === 'sword-of-the-order' && !isSwordProfile(profile))
    ? { ...rawMods, attacksDelta: 0, criticalHitThreshold: null }
    : rawMods;

  // Defender's gambit may override their Toughness (Steadfast Resilience, Tempered by War)
  const defenderMods = getStrikeModifiers(
    defender.selectedGambit, state, !isForPlayer, 1, attackerChar.stats.WS,
  );

  // Force: log boost before computing stats
  if (forceBoost !== null) {
    const boostDesc = forceBoost === 'AP' ? 'AP → AP2'
      : forceBoost === 'I' ? 'I (attack order already resolved)'
        : `${forceBoost}×2`;
    log.push(`Force: WP check succeeded — ${boostDesc}`);
  }

  // Bite of the Betrayed: persistent +1 WS and +1 S when attacking; +1 T when defending
  const biteAtkBonus = attacker.biteOfTheBetrayedActive ? 1 : 0;
  const biteDefBonus = defender.biteOfTheBetrayedActive ? 1 : 0;
  if (biteAtkBonus > 0) {
    log.push(`Bite of the Betrayed: ${attackerChar.name} has +1 WS and +1 S.`);
  }
  if (biteDefBonus > 0) {
    log.push(`Bite of the Betrayed: ${defenderChar.name} has +1 T.`);
  }

  let atkWS = (forceBoost === 'WS' ? attackerChar.stats.WS * 2 : attackerChar.stats.WS) + mods.wsDelta + biteAtkBonus;

  // Apply weapon profile Strength modifier (kind:'none' = base S, 'add' = S+n, 'fixed' = n, 'mult' = S*n)
  const sm = profile.strengthModifier;
  let atkS = forceBoost === 'S' ? attackerChar.stats.S * 2 : attackerChar.stats.S;
  if (biteAtkBonus > 0) atkS += 1; // bite bonus to base S before weapon modifier
  if (sm.kind === 'add') atkS += sm.value;
  if (sm.kind === 'fixed') atkS = sm.value;
  if (sm.kind === 'mult') atkS *= sm.value;

  // Apply weapon profile Attacks modifier, then gambit delta/override
  const am = profile.attacksModifier;
  let baseA = forceBoost === 'A' ? attackerChar.stats.A * 2 : attackerChar.stats.A;
  if (am.kind === 'add') baseA += am.value;
  if (am.kind === 'fixed') baseA = am.value;
  // Conflagration: weapon has 6+D3 attacks (attacksExtraD3 flag)
  if (profile.attacksExtraD3 ?? false) baseA += weaponD3;

  let atkA = mods.attacksOverride !== null
    ? mods.attacksOverride
    : baseA + mods.attacksDelta;

  // Taunt and Bait: reduce own WS/A to enemy's (or enemy-1 if equal)
  if (attacker.selectedGambit === 'taunt-and-bait') {
    const defWS = defenderChar.stats.WS;
    const defA = defenderChar.stats.A;
    atkWS = atkWS <= defWS ? defWS - 1 : defWS;
    atkA = atkA <= defA ? defA - 1 : defA;
  }

  // Minimum 1 attack
  atkA = Math.max(1, atkA + attackBonus);

  // Sublime Swordsman: +1A per point this model's Base I exceeds the opponent's,
  // but only when this model has Challenge Advantage (attackBonus > 0).
  if (attackBonus > 0) {
    const hasSublimeSwordsman = attackerChar.specialRules.some(
      sr => sr.name === 'SublimeSwordsman',
    );
    if (hasSublimeSwordsman) {
      const iBonus = Math.max(0, attackerChar.stats.I - defenderChar.stats.I);
      if (iBonus > 0) {
        log.push(`Sublime Swordsman: +${iBonus} Attacks (I${attackerChar.stats.I} vs I${defenderChar.stats.I})`);
        atkA += iBonus;
      }
    }
  }

  // Single-attack cap (Guard Up / Withdraw)
  if (mods.singleAttackCap) atkA = 1;

  // Dirty Fighter pre-strike: hard-override to the specified attack count
  if (forcedAttacks !== null) atkA = forcedAttacks;

  const defWS = defenderChar.stats.WS;
  const defT = defenderChar.stats.T;
  // Bite of the Betrayed: +1 T to the defender's base Toughness
  const defTWithBite = defT + biteDefBonus;
  // Steadfast Resilience / Tempered by War may override defender's effective Toughness
  const effectiveDefT = defenderMods.overrideDefenderToughness ?? defTWithBite;

  // Effective Strength and Damage for wound/damage calc
  const effectiveS = Math.max(1, atkS + mods.strengthDelta);

  // Weapon AP, possibly improved by Abyssal Strike or Force(AP)
  let weaponAP = profile.ap;
  if (mods.apImprovement > 0 && weaponAP !== null) {
    weaponAP = Math.max(2, weaponAP - mods.apImprovement);
  }
  if (forceBoost === 'AP') weaponAP = 2;

  // Force(D) doubles the Damage Characteristic
  const baseDmg = forceBoost === 'D' ? profile.damage * 2 : profile.damage;

  const tNote = effectiveDefT !== defT ? ` (effective T${effectiveDefT})` : '';
  log.push(
    `${attackerChar.name} attacks: ${atkA} attacks, WS${atkWS} vs WS${defWS}, S${effectiveS} vs T${defT}${tNote}, AP${weaponAP ?? '-'}`,
  );

  // Armourbane: no glancing-hit distinction for infantry; log only
  if (profile.specialRules.some(sr => sr.name === 'Armourbane')) {
    log.push('Armourbane: no glancing-hit distinction for infantry — rule has no effect here');
  }

  // ── Hit Tests ────────────────────────────────────────────────────────────
  // Mirror-Form: Adamus hits always on 4+ regardless of WS comparison
  const mirrorFormActive = attacker.selectedGambit === 'mirror-form';
  const hitTN = mirrorFormActive ? 4 : getHitTargetNumber(atkWS, defWS);

  // Divination — Every Strike Foreseen: WP check (no Perils).
  // If successful, all Hit Tests succeed on 2+ for this attack sequence.
  let hitTNOverride: number | null = null;
  if (attacker.selectedGambit === 'divination-every-strike-foreseen') {
    const [d1, d2] = dice.rollNd6(2);
    const total = d1 + d2;
    const success = total <= attackerChar.stats.WP;
    log.push(
      `Every Strike Foreseen: ${d1}+${d2}=${total} vs WP${attackerChar.stats.WP} — ` +
      (success ? 'hit on 2+' : 'normal hits'),
    );
    if (success) hitTNOverride = 2;
  }

  const hitRolls = dice.rollNd6(atkA);
  let hits = 0;
  let critHits = 0;
  let guardUpMissCount = 0;
  let hitRollOnes = 0; // for Biological Overload self-wound tracking

  // Preternatural Resilience: CriticalHit(X) attacks against this model use X=6
  const hasPraeternaturalResilience = defenderChar.specialRules.some(
    sr => sr.name === 'PraeternaturalResilience',
  );

  for (const roll of hitRolls) {
    // Track unmodified 1s for Biological Overload
    if (roll === 1) hitRollOnes++;

    const effectiveHitTN = hitTNOverride ?? hitTN;
    const isHit = effectiveHitTN <= 6 && roll >= effectiveHitTN;

    // Critical Hit only applies when a hit is actually inflicted by this Hit Test
    // (rule: "if a Hit is inflicted by that Hit Test, that Hit becomes a Critical Hit")
    let isCrit = false;
    if (isHit) {
      for (const sr of profile.specialRules) {
        if (sr.name === 'CriticalHit') {
          const effectiveCritTN = hasPraeternaturalResilience ? Math.max(sr.threshold, 6) : sr.threshold;
          if (roll >= effectiveCritTN) isCrit = true;
        }
      }
      if (mods.criticalHitThreshold !== null) {
        const effectiveCritTN = hasPraeternaturalResilience ? Math.max(mods.criticalHitThreshold, 6) : mods.criticalHitThreshold;
        if (roll >= effectiveCritTN) isCrit = true;
      }
    }

    if (isHit) {
      hits++;
      if (isCrit) critHits++;
    } else {
      // Missed – Guard Up bonus for next Focus Roll
      if (defender.selectedGambit === 'guard-up') guardUpMissCount++;
    }
  }

  const normalHits = hits - critHits;
  const critHitNote = critHits > 0 ? ` (${critHits} critical)` : '';
  log.push(`Hit rolls [${hitRolls.join(',')}] needing ${hitTNOverride ?? hitTN}+ → ${hits} hit(s)${critHitNote}`);

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
  // Hatred(Psykers): +1 to wound tests when the defender has the Psyker rule
  const attackerHatredPsykers = attackerChar.specialRules.some(
    sr => sr.name === 'Hatred' && sr.target === 'Psykers',
  );
  const defenderIsPsyker = defenderChar.specialRules.some(sr => sr.name === 'Psyker');
  const woundTestBonus = (attackerHatredPsykers && defenderIsPsyker) ? 1 : 0;

  // Base wound TN uses effectiveDefT (may be overridden by Steadfast Resilience / Tempered by War)
  const baseWoundTN = getWoundTargetNumber(effectiveS, effectiveDefT);

  // Poisoned: if the weapon has Poisoned(X+), wounds always on the *better* of table TN or X
  let poisonedTN: number | null = null;
  for (const sr of profile.specialRules) {
    if (sr.name === 'Poisoned') poisonedTN = sr.threshold;
  }

  // Critical hits automatically inflict a wound without any dice being rolled,
  // counting as a roll of 6 for variable special rules (Breaching, Shred) triggered
  // by the Wound Test.
  let critBreachingWounds = 0;
  let critShredTriggers = 0;
  for (const sr of profile.specialRules) {
    if (sr.name === 'Breaching' && 6 >= sr.threshold) critBreachingWounds += critHits;
    if (sr.name === 'Shred' && 6 >= sr.threshold) critShredTriggers += critHits;
  }
  critBreachingWounds = Math.min(critBreachingWounds, critHits);
  critShredTriggers = Math.min(critShredTriggers, critHits);
  const critWounds = critHits;

  // Normal hits go through the wound test as usual
  const woundRolls = dice.rollNd6(normalHits);
  let normalWounds = 0;
  let normalBreachingWounds = 0;  // wounds treated as AP2 (Breaching rule)
  let normalShredTriggers = 0;  // wounds that deal +1 Damage (Shred rule)
  // Phage(T): Merciless Strike reduces defender T by 1 per unsaved wound
  let currentDefT = effectiveDefT;

  for (const roll of woundRolls) {
    // With Phage(T), recompute the wound TN each time as T decreases
    const tableWoundTN = mods.phageToughness
      ? getWoundTargetNumber(effectiveS, currentDefT)
      : baseWoundTN;

    // Poisoned: use whichever TN is easier (lower number = easier to wound)
    let woundTN = poisonedTN !== null
      ? Math.min(tableWoundTN, poisonedTN)
      : tableWoundTN;

    // Hatred(Psykers): +1 to wound tests (lower TN by 1, minimum 2)
    if (woundTestBonus > 0) woundTN = Math.max(2, woundTN - woundTestBonus);

    let isWound = woundTN <= 6 && roll >= woundTN;
    for (const sr of profile.specialRules) {
      // Rending: high hit roll auto-wounds (approximated on wound roll here)
      if (sr.name === 'Rending' && roll >= sr.threshold) isWound = true;
    }
    // Bulwark of the Imperium: unmodified wound rolls below the minimum always fail,
    // regardless of Strength, Toughness comparisons, Poisoned, or Rending.
    if (defenderMods.minimumWoundRoll !== null && roll < defenderMods.minimumWoundRoll) {
      isWound = false;
    }
    if (isWound) {
      normalWounds++;
      if (mods.phageToughness) currentDefT = Math.max(1, currentDefT - 1);
      for (const sr of profile.specialRules) {
        // Breaching: wound roll ≥ threshold → this wound ignores normal armour (AP2)
        if (sr.name === 'Breaching' && roll >= sr.threshold) normalBreachingWounds++;
        // Shred: wound roll ≥ threshold → this wound gains +1 Damage
        if (sr.name === 'Shred' && roll >= sr.threshold) normalShredTriggers++;
      }
    }
  }

  const wounds = critWounds + normalWounds;
  const totalBreachingWounds = critBreachingWounds + normalBreachingWounds;

  const phageNote = mods.phageToughness ? ' (Phage: T reduces per wound)' : '';
  const poisonNote = poisonedTN !== null ? ` (Poisoned ${poisonedTN}+, table ${baseWoundTN})` : '';
  const hatredNote = woundTestBonus > 0 ? ` (Hatred +1 wound bonus)` : '';
  const effectiveWoundTN = poisonedTN !== null
    ? Math.max(2, Math.min(baseWoundTN, poisonedTN) - woundTestBonus)
    : Math.max(2, baseWoundTN - woundTestBonus);
  if (critWounds > 0) {
    log.push(`${critHits} Critical Hit(s) → ${critWounds} automatic wound(s) (counts as roll of 6)`);
  }
  if (normalHits > 0) {
    log.push(`Wound rolls [${woundRolls.join(',')}] needing ${effectiveWoundTN}+${poisonNote}${hatredNote}${phageNote} → ${normalWounds} wound(s)`);
  }

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
  const defSv = defenderChar.stats.Sv;
  const defInv = defenderChar.stats.Inv;
  // Split wounds into four save pools: (crit | normal) × (weapon AP | AP2 breaching)
  const critNormalCount = critWounds - critBreachingWounds;
  const normNormalCount = normalWounds - normalBreachingWounds;
  const effectiveSave = getEffectiveSave(defSv, defInv, weaponAP);
  // Breaching wounds are always treated as AP2 for saves regardless of weapon AP
  const breachSave = totalBreachingWounds > 0 ? getEffectiveSave(defSv, defInv, 2) : null;

  let saved = 0;
  let unsavedCritWounds = 0;
  // Tracks wounds that fail saves (before FNP) for Deflagrate triggering
  let deflagrateUnsavedCount = 0;
  let evsfUsed = false; // Every Strike Foreseen may only re-roll ONE failed save

  // Pool 1: crit wounds at weapon AP — track each failure as an unsaved crit wound
  const critNormSaveRolls = dice.rollNd6(critNormalCount);
  if (effectiveSave !== null) {
    for (let i = 0; i < critNormSaveRolls.length; i++) {
      let roll = critNormSaveRolls[i];
      if (everyStrikeActive && !evsfUsed && roll < effectiveSave) {
        const reroll = dice.rollD6();
        log.push(`Every Strike Foreseen: re-roll save ${roll} → ${reroll}`);
        critNormSaveRolls[i] = reroll;
        roll = reroll;
        evsfUsed = true;
      }
      if (roll >= effectiveSave) saved++;
      else { unsavedCritWounds++; deflagrateUnsavedCount++; }
    }
  } else {
    unsavedCritWounds += critNormalCount;
    deflagrateUnsavedCount += critNormalCount;
  }

  // Pool 2: normal wounds at weapon AP
  const normalSaveRolls = dice.rollNd6(normNormalCount);
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
      else deflagrateUnsavedCount++;
    }
  } else {
    deflagrateUnsavedCount += normNormalCount;
  }

  // Pool 3: crit breaching wounds at AP2 — track failures as unsaved crit wounds
  const critBreachSaveRolls = dice.rollNd6(critBreachingWounds);
  if (breachSave !== null) {
    for (let i = 0; i < critBreachSaveRolls.length; i++) {
      let roll = critBreachSaveRolls[i];
      if (everyStrikeActive && !evsfUsed && roll < breachSave) {
        const reroll = dice.rollD6();
        log.push(`Every Strike Foreseen: re-roll save ${roll} → ${reroll}`);
        critBreachSaveRolls[i] = reroll;
        roll = reroll;
        evsfUsed = true;
      }
      if (roll >= breachSave) saved++;
      else { unsavedCritWounds++; deflagrateUnsavedCount++; }
    }
  } else {
    unsavedCritWounds += critBreachingWounds;
    deflagrateUnsavedCount += critBreachingWounds;
  }

  // Pool 4: normal breaching wounds at AP2
  const normBreachSaveRolls = dice.rollNd6(normalBreachingWounds);
  if (breachSave !== null) {
    for (let i = 0; i < normBreachSaveRolls.length; i++) {
      let roll = normBreachSaveRolls[i];
      if (everyStrikeActive && !evsfUsed && roll < breachSave) {
        const reroll = dice.rollD6();
        log.push(`Every Strike Foreseen: re-roll save ${roll} → ${reroll}`);
        normBreachSaveRolls[i] = reroll;
        roll = reroll;
        evsfUsed = true;
      }
      if (roll >= breachSave) saved++;
      else deflagrateUnsavedCount++;
    }
  } else {
    deflagrateUnsavedCount += normalBreachingWounds;
  }

  const saveRolls = [...critNormSaveRolls, ...normalSaveRolls, ...critBreachSaveRolls, ...normBreachSaveRolls];
  if (effectiveSave !== null || breachSave !== null) {
    const allNormRolls = [...critNormSaveRolls, ...normalSaveRolls];
    const allBreachRolls = [...critBreachSaveRolls, ...normBreachSaveRolls];
    const saveLine = totalBreachingWounds > 0
      ? `Normal saves [${allNormRolls.join(',')}] vs ${effectiveSave ?? '-'}+, Breaching saves [${allBreachRolls.join(',')}] vs ${breachSave ?? '-'}+ → ${saved} saved`
      : `Save rolls [${allNormRolls.join(',')}] vs ${effectiveSave}+ → ${saved} saved`;
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
    // Distribute FNP cancels proportionally between crit and normal unsaved wounds
    const fnpCritCancelled = unsavedWounds > 0
      ? Math.min(unsavedCritWounds, Math.round((unsavedCritWounds / unsavedWounds) * fnpSaved))
      : 0;
    unsavedCritWounds = Math.max(0, unsavedCritWounds - fnpCritCancelled);
    unsavedWounds -= fnpSaved;
    // Clamp for rounding safety
    unsavedCritWounds = Math.min(unsavedCritWounds, unsavedWounds);
  }

  // Check if Deflagrate can still trigger (uses pre-FNP count)
  const deflagrateRule = profile.specialRules.find(sr => sr.name === 'Deflagrate');
  if (unsavedWounds === 0 && !(deflagrateRule && deflagrateUnsavedCount > 0)) {
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

  // Critical Hit wounds increase the Damage Characteristic by +1 (before EW reduction).
  // When Flurry of Blows caps damage to 1, the crit bonus is suppressed by the cap.
  const critDmgPerWound = mods.damageSetToOne
    ? 1
    : Math.max(1, (baseDmg + mods.damageDelta + 1) - ewReduction);

  // Shred: wounds that triggered Shred deal +1 Damage (suppressed when Flurry caps D to 1).
  // Normal hits: approximate shred-triggering unsaved wounds via fraction of wound rolls.
  // Critical hits count as a roll of 6, so they also trigger Shred when 6 ≥ threshold;
  // such wounds stack both bonuses and deal +2D total (CriticalHit +1 and Shred +1).
  const unsavedNormalWounds = unsavedWounds - unsavedCritWounds;
  const unsavedShredWounds = normalWounds > 0 && !mods.damageSetToOne
    ? Math.round((normalShredTriggers / normalWounds) * unsavedNormalWounds)
    : 0;
  const unsavedCritShredWounds = critHits > 0 && !mods.damageSetToOne
    ? Math.round((critShredTriggers / critHits) * unsavedCritWounds)
    : 0;
  const shredDmgPerWound = Math.max(1, (baseDmg + mods.damageDelta + 1) - ewReduction);
  const critShredDmgPerWound = Math.max(1, (baseDmg + mods.damageDelta + 2) - ewReduction);
  let totalDamage =
    (unsavedCritWounds - unsavedCritShredWounds) * critDmgPerWound +
    unsavedCritShredWounds * critShredDmgPerWound +
    (unsavedNormalWounds - unsavedShredWounds) * dmgPerWound +
    unsavedShredWounds * shredDmgPerWound;

  let defenderWoundsRemaining = Math.max(0, defender.currentWounds - totalDamage);
  let defenderIsCasualty = defenderWoundsRemaining <= 0;

  const critNonShredCount = unsavedCritWounds - unsavedCritShredWounds;
  const critDmgNote = critNonShredCount > 0
    ? ` (${critNonShredCount} critical × D${critDmgPerWound})`
    : '';
  const critShredNote = unsavedCritShredWounds > 0
    ? ` (${unsavedCritShredWounds} Crit+Shred × D${critShredDmgPerWound})`
    : '';
  const shredNote = unsavedShredWounds > 0
    ? ` (${unsavedShredWounds} Shred wound(s) at +1 dmg)`
    : '';
  if (unsavedWounds > 0) {
    log.push(
      `${unsavedWounds} unsaved wound(s) × ${dmgPerWound} dmg${critDmgNote}${critShredNote}${shredNote} = ${totalDamage} damage. ` +
      `${defenderChar.name}: ${defender.currentWounds} → ${defenderWoundsRemaining} wounds` +
      (defenderIsCasualty ? ' (CASUALTY)' : ''),
    );
  }

  // ── Deflagrate ──────────────────────────────────────────────────────────
  // Unsaved wounds from a weapon with Deflagrate(X) generate additional
  // automatic hits at S(X) AP- D1 against the same target.
  if (deflagrateRule && deflagrateUnsavedCount > 0 && !defenderIsCasualty) {
    const extra = resolveDeflagrateGroup(
      dice, deflagrateUnsavedCount, deflagrateRule.value,
      defenderChar, effectiveDefT, log,
    );
    if (extra.damage > 0) {
      const prevWounds = defenderWoundsRemaining;
      defenderWoundsRemaining = Math.max(0, defenderWoundsRemaining - extra.damage);
      defenderIsCasualty = defenderWoundsRemaining <= 0;
      log.push(
        `Deflagrate: ${extra.damage} extra damage. ` +
        `${defenderChar.name}: ${prevWounds} → ${defenderWoundsRemaining} wounds` +
        (defenderIsCasualty ? ' (CASUALTY)' : ''),
      );
      totalDamage += extra.damage;
    }
  }

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
function resolveSpitefulDemise(
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
  const isWound = (woundTN <= 6 && woundRoll >= woundTN) || breaching;
  log.push(`Spiteful Demise: Wound roll ${woundRoll} needing ${woundTN}+${breaching ? ' (Breaching)' : ''} → ${isWound ? 'wound' : 'no wound'}`);
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
  const newWounds = Math.max(0, defenderState.currentWounds - damage);
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
 * Resolve Deflagrate extra hits.
 *
 * For each unsaved wound caused by a weapon with Deflagrate(X), one extra
 * automatic hit is inflicted at Strength X, AP -, D1.  The defender always
 * benefits from their best available save (armour or invulnerable, whichever
 * is better) since the hit is AP-.
 *
 * @param hits          - number of extra hits (= unsaved wounds that triggered Deflagrate)
 * @param strength      - the Deflagrate Strength value
 * @param defenderChar  - full character record of the defender
 * @param effectiveDefT - defender's effective Toughness
 * @param log           - log array to append messages to
 */
function resolveDeflagrateGroup(
  dice: DiceRoller,
  hits: number,
  strength: number,
  defenderChar: Character,
  effectiveDefT: number,
  log: string[],
): { damage: number } {
  const woundTN = getWoundTargetNumber(strength, effectiveDefT);
  const woundRolls = dice.rollNd6(hits);
  let wounds = 0;
  for (const roll of woundRolls) {
    if (woundTN <= 6 && roll >= woundTN) wounds++;
  }
  log.push(
    `Deflagrate(${strength}): ${hits} extra hit(s) → wound rolls [${woundRolls.join(',')}] needing ${woundTN}+ → ${wounds} wound(s)`,
  );
  if (wounds === 0) return { damage: 0 };

  // AP -: defender always gets their best save (lower number = better)
  const defSv = defenderChar.stats.Sv;
  const defInv = defenderChar.stats.Inv;
  const bestSave = defInv !== null ? Math.min(defSv, defInv) : defSv;
  const saveRolls = dice.rollNd6(wounds);
  let saved = 0;
  for (const roll of saveRolls) {
    if (roll >= bestSave) saved++;
  }
  log.push(`Deflagrate saves [${saveRolls.join(',')}] vs ${bestSave}+ → ${saved} saved`);
  let unsaved = wounds - saved;

  // Feel No Pain applies to Deflagrate wounds
  let fnpThreshold: number | null = null;
  for (const sr of defenderChar.specialRules) {
    if (sr.name === 'FeelNoPain') fnpThreshold = sr.threshold;
  }
  if (fnpThreshold !== null && unsaved > 0) {
    const fnpRolls = dice.rollNd6(unsaved);
    const fnpSaved = fnpRolls.filter(r => r >= fnpThreshold!).length;
    log.push(`Deflagrate FNP ${fnpThreshold}+: rolls [${fnpRolls.join(',')}] → ${fnpSaved} cancelled`);
    unsaved -= fnpSaved;
  }

  if (unsaved === 0) return { damage: 0 };

  // D1 damage per unsaved wound, reduced by Eternal Warrior (minimum 1)
  let ewReduction = 0;
  for (const sr of defenderChar.specialRules) {
    if (sr.name === 'EternalWarrior') ewReduction = sr.value;
  }
  const dmgPerWound = Math.max(1, 1 - ewReduction);
  return { damage: unsaved * dmgPerWound };
}

/**
 * Resolve a Force(X) Willpower Check for a model about to attack with a Force weapon.
 *
 * Rules:
 *  - Roll 2d6. If total ≤ WP the check succeeds and characteristic X is doubled
 *    (or set to AP2 when X is 'AP').
 *  - If both dice show the same value (doubles), the attacker suffers Perils of the
 *    Warp regardless of pass/fail — D3 unsaveable wounds allocated before attacks.
 *
 * Returns immediately (consuming no dice) when the weapon profile has no Force rule.
 */
function resolveForceCheck(
  dice: DiceRoller,
  attackerChar: Character,
  profile: WeaponProfile,
  log: string[],
): { forceBoost: string | null; perilsWounds: number } {
  const forceRule = profile.specialRules.find(sr => sr.name === 'Force');
  if (!forceRule || forceRule.name !== 'Force') return { forceBoost: null, perilsWounds: 0 };

  const wp = attackerChar.stats.WP;
  const [d1, d2] = dice.rollNd6(2);
  const total = d1 + d2;
  const isDoubles = d1 === d2;
  const isSuccess = total <= wp;

  log.push(
    `Force(${forceRule.characteristic}) WP check: 2d6 [${d1},${d2}] = ${total} vs WP${wp} — ` +
    (isSuccess ? 'SUCCESS' : 'FAIL') + (isDoubles ? ' (DOUBLES — Perils of the Warp!)' : ''),
  );

  let perilsWounds = 0;
  if (isDoubles) {
    perilsWounds = dice.rollD3();
    log.push(`Perils of the Warp: ${attackerChar.name} suffers D3 = ${perilsWounds} unsaveable wound(s)!`);
  }

  return { forceBoost: isSuccess ? forceRule.characteristic : null, perilsWounds };
}

/**
 * Resolve the Dirty Fighter pre-strike (Night Lords / Sevatar).
 *
 * At the end of the Face-Off Step (before the Focus Roll), the model that
 * selected Dirty Fighter resolves steps 1–4 of the Strike Step once with
 * Attacks Characteristic of 1 and no Focus-winner bonus.  The Focus Step
 * then proceeds as normal.
 *
 * If both sides somehow selected Dirty Fighter the player fires first; the
 * AI fires second only if the player survived.
 */
export function resolveDirtyFighterPreStrike(
  dice: DiceRoller,
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
): { updatedState: CombatState; log: string[] } {
  const log: string[] = [];

  const playerHasDF = state.player.selectedGambit === 'dirty-fighter';
  const aiHasDF = state.ai.selectedGambit === 'dirty-fighter';
  if (!playerHasDF && !aiHasDF) return { updatedState: state, log };

  /**
   * Return the model's selected weapon profile, falling back to the first
   * melee profile if the weapon hasn't been chosen yet (weapon selection
   * normally happens at the start of the Focus Step, but Dirty Fighter fires
   * before it — the player will have pre-selected on the selection screen).
   */
  const getProfile = (char: Character, selected: WeaponProfile | null): WeaponProfile => {
    if (selected !== null) return selected;
    return char.weapons.find(w => w.type === 'melee')?.profiles[0]
      ?? char.weapons[0].profiles[0];
  };

  let updatedState = { ...state };

  // ── Player's Dirty Fighter pre-strike ─────────────────────────────────────
  if (playerHasDF && !updatedState.player.isCasualty) {
    log.push(`Dirty Fighter: ${playerChar.name} makes a pre-strike (1 attack) before the Focus Roll.`);
    const profile = getProfile(playerChar, updatedState.player.selectedWeaponProfile);

    const forceResult = resolveForceCheck(dice, playerChar, profile, log);
    if (forceResult.perilsWounds > 0) {
      const newW = Math.max(0, updatedState.player.currentWounds - forceResult.perilsWounds);
      updatedState = {
        ...updatedState,
        player: { ...updatedState.player, currentWounds: newW, isCasualty: newW <= 0 },
      };
    }

    if (!updatedState.player.isCasualty) {
      const result = resolveAttackSequence(
        dice,
        updatedState.player, updatedState.ai,
        playerChar, aiChar,
        profile,
        0,      // no Focus-winner attack bonus
        true,
        updatedState,
        updatedState.ai.selectedGambit === 'every-strike-foreseen',
        forceResult.forceBoost,
        1,      // forcedAttacks = 1
      );
      log.push(...result.log);
      updatedState = {
        ...updatedState,
        ai: {
          ...updatedState.ai,
          currentWounds: result.defenderWoundsRemaining,
          isCasualty: result.defenderIsCasualty,
        },
        player: {
          ...updatedState.player,
          woundsInflictedThisChallenge:
            updatedState.player.woundsInflictedThisChallenge + result.totalDamage,
        },
      };
    }
  }

  // ── AI's Dirty Fighter pre-strike ─────────────────────────────────────────
  if (aiHasDF && !updatedState.ai.isCasualty) {
    log.push(`Dirty Fighter: ${aiChar.name} makes a pre-strike (1 attack) before the Focus Roll.`);
    const profile = getProfile(aiChar, updatedState.ai.selectedWeaponProfile);

    const forceResult = resolveForceCheck(dice, aiChar, profile, log);
    if (forceResult.perilsWounds > 0) {
      const newW = Math.max(0, updatedState.ai.currentWounds - forceResult.perilsWounds);
      updatedState = {
        ...updatedState,
        ai: { ...updatedState.ai, currentWounds: newW, isCasualty: newW <= 0 },
      };
    }

    if (!updatedState.ai.isCasualty) {
      const result = resolveAttackSequence(
        dice,
        updatedState.ai, updatedState.player,
        aiChar, playerChar,
        profile,
        0,      // no Focus-winner attack bonus
        false,
        updatedState,
        updatedState.player.selectedGambit === 'every-strike-foreseen',
        forceResult.forceBoost,
        1,      // forcedAttacks = 1
      );
      log.push(...result.log);
      updatedState = {
        ...updatedState,
        player: {
          ...updatedState.player,
          currentWounds: result.defenderWoundsRemaining,
          isCasualty: result.defenderIsCasualty,
        },
        ai: {
          ...updatedState.ai,
          woundsInflictedThisChallenge:
            updatedState.ai.woundsInflictedThisChallenge + result.totalDamage,
        },
      };
    }
  }

  return { updatedState, log };
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
  const aiAttackBonus = advantage === 'ai' ? 1 : 0;

  let playerProfile = state.player.selectedWeaponProfile!;
  let aiProfile = state.ai.selectedWeaponProfile!;

  // ── Hammerblow gambit: force the Hammerblow weapon profile ───────────────
  // The gambit prohibits any other weapon; override whatever the player
  // pre-selected on the selection screen.
  if (state.player.selectedGambit === 'hammerblow') {
    const hammerblowProfile = playerChar.weapons
      .flatMap(w => w.profiles)
      .find(p => p.profileName === 'Hammerblow');
    if (hammerblowProfile) {
      playerProfile = hammerblowProfile;
      log.push(`Hammerblow: ${playerChar.name} must use the Hammerblow weapon profile (no other weapon permitted).`);
    }
  }
  if (state.ai.selectedGambit === 'hammerblow') {
    const hammerblowProfile = aiChar.weapons
      .flatMap(w => w.profiles)
      .find(p => p.profileName === 'Hammerblow');
    if (hammerblowProfile) {
      aiProfile = hammerblowProfile;
      log.push(`Hammerblow: ${aiChar.name} must use the Hammerblow weapon profile (no other weapon permitted).`);
    }
  }

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

  // ── Force WP checks: resolve at the start of the Strike Step ─────────────
  // Each model makes a WP check if their selected weapon has the Force(X) rule.
  // On success, characteristic X is doubled for the attack sequence.
  // If doubles are rolled the attacker suffers Perils of the Warp (D3 wounds).
  const playerForceResult = resolveForceCheck(dice, playerChar, playerProfile, log);
  const playerForceBoost = playerForceResult.forceBoost;
  if (playerForceResult.perilsWounds > 0) {
    const newW = Math.max(0, updatedState.player.currentWounds - playerForceResult.perilsWounds);
    updatedState = {
      ...updatedState,
      player: { ...updatedState.player, currentWounds: newW, isCasualty: newW <= 0 },
    };
  }

  const aiForceResult = resolveForceCheck(dice, aiChar, aiProfile, log);
  const aiForceBoost = aiForceResult.forceBoost;
  if (aiForceResult.perilsWounds > 0) {
    const newW = Math.max(0, updatedState.ai.currentWounds - aiForceResult.perilsWounds);
    updatedState = {
      ...updatedState,
      ai: { ...updatedState.ai, currentWounds: newW, isCasualty: newW <= 0 },
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
      playerForceBoost,
    );
    log.push(...playerResult.log);

    // Update AI wounds
    updatedState = {
      ...updatedState,
      ai: {
        ...updatedState.ai,
        currentWounds: playerResult.defenderWoundsRemaining,
        isCasualty: playerResult.defenderIsCasualty,
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
      const sd = resolveSpitefulDemise(dice, aiChar.name, updatedState.player, playerChar, log);
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
        aiForceBoost,
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
      aiForceBoost,
    );
    log.push(...aiResult.log);

    updatedState = {
      ...updatedState,
      player: {
        ...updatedState.player,
        currentWounds: aiResult.defenderWoundsRemaining,
        isCasualty: aiResult.defenderIsCasualty,
      },
      ai: {
        ...updatedState.ai,
        woundsInflictedThisChallenge:
          state.ai.woundsInflictedThisChallenge + aiResult.totalDamage,
      },
    };

    // Spiteful Demise: player inflicts auto-hit on AI when reduced to 0 wounds
    if (aiResult.defenderIsCasualty && updatedState.player.selectedGambit === 'spiteful-demise') {
      const sd = resolveSpitefulDemise(dice, playerChar.name, updatedState.ai, aiChar, log);
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
        playerForceBoost,
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
        isCasualty: aiResult!.defenderIsCasualty,
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
        isCasualty: playerResult!.defenderIsCasualty,
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
  const aiBioOverload = state.ai.selectedGambit === 'biological-overload';

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

  // ── Seeker of Atonement (Hibou Khan / White Scars) ───────────────────────
  // If the player with this gambit is reduced to 0 Wounds, roll a d6.
  // On a 4+, they survive with W1 and their controller gains Challenge Advantage.
  if (updatedState.player.isCasualty && state.player.selectedGambit === 'seeker-of-atonement') {
    const roll = dice.rollD6();
    log.push(`Seeker of Atonement: ${playerChar.name} reduced to 0 Wounds — rolling to survive: ${roll} (need 4+).`);
    if (roll >= 4) {
      log.push(`Seeker of Atonement: SUCCESS — ${playerChar.name} remains Engaged with 1 Wound. Player gains Challenge Advantage.`);
      updatedState = {
        ...updatedState,
        player: { ...updatedState.player, isCasualty: false, currentWounds: 1 },
        challengeAdvantage: 'player',
      };
    } else {
      log.push(`Seeker of Atonement: FAILED — ${playerChar.name} is Removed as a Casualty.`);
    }
  }

  if (updatedState.ai.isCasualty && state.ai.selectedGambit === 'seeker-of-atonement') {
    const roll = dice.rollD6();
    log.push(`Seeker of Atonement: ${aiChar.name} reduced to 0 Wounds — rolling to survive: ${roll} (need 4+).`);
    if (roll >= 4) {
      log.push(`Seeker of Atonement: SUCCESS — ${aiChar.name} remains Engaged with 1 Wound. AI gains Challenge Advantage.`);
      updatedState = {
        ...updatedState,
        ai: { ...updatedState.ai, isCasualty: false, currentWounds: 1 },
        challengeAdvantage: 'ai',
      };
    } else {
      log.push(`Seeker of Atonement: FAILED — ${aiChar.name} is Removed as a Casualty.`);
    }
  }

  return {
    firstAttacker: advantage,
    playerResult: playerResult!,
    aiResult: aiResult!,
    updatedState,
    log,
  };
}
