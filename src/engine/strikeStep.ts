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

  let atkWS = attackerChar.stats.WS + mods.wsDelta;
  let atkS  = attackerChar.stats.S;
  let atkA  = mods.attacksOverride !== null
    ? mods.attacksOverride
    : attackerChar.stats.A + mods.attacksDelta;

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

  // Effective Strength and Damage for wound/damage calc
  const effectiveS = Math.max(1, atkS + mods.strengthDelta);

  // Weapon AP, possibly improved by Abyssal Strike
  let weaponAP = profile.ap;
  if (mods.apImprovement > 0 && weaponAP !== null) {
    weaponAP = Math.max(2, weaponAP - mods.apImprovement);
  }
  const baseDmg = profile.damage;

  log.push(
    `${attackerChar.name} attacks: ${atkA} attacks, WS${atkWS} vs WS${defWS}, S${effectiveS} vs T${defT}, AP${weaponAP ?? '-'}`,
  );

  // ── Hit Tests ────────────────────────────────────────────────────────────
  const hitTN = getHitTargetNumber(atkWS, defWS);
  const hitRolls = dice.rollNd6(atkA);
  let hits = 0;
  let guardUpMissCount = 0;

  for (const roll of hitRolls) {
    const isHit = hitTN <= 6 && roll >= hitTN;

    // Check for Critical Hit special rule (extra wound on high roll)
    let critHit = false;
    for (const sr of profile.specialRules) {
      if (sr.name === 'CriticalHit' && roll >= sr.threshold) critHit = true;
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
      defenderIsCasualty: false, log,
    };
  }

  // ── Wound Tests ──────────────────────────────────────────────────────────
  const woundTN = getWoundTargetNumber(effectiveS, defT);
  const woundRolls = dice.rollNd6(hits);
  let wounds = 0;

  // Check for Rending (auto-wound on high roll)
  for (const roll of woundRolls) {
    let isWound = woundTN <= 6 && roll >= woundTN;
    for (const sr of profile.specialRules) {
      if (sr.name === 'Rending' && roll >= sr.threshold) {
        isWound = true;
        // Rending also sets AP to 2 (handled below in save calc)
      }
    }
    if (isWound) wounds++;
  }

  log.push(`Wound rolls [${woundRolls.join(',')}] vs TN${woundTN} → ${wounds} wound(s)`);

  if (wounds === 0) {
    return {
      attackerName: attackerChar.name,
      attacks: atkA, hitRolls, hits,
      woundRolls, wounds: 0,
      saveRolls: [], unsavedWounds: 0,
      totalDamage: 0, defenderWoundsRemaining: defender.currentWounds,
      defenderIsCasualty: false, log,
    };
  }

  // ── Saving Throws ────────────────────────────────────────────────────────
  const defSv  = defenderChar.stats.Sv;
  const defInv = defenderChar.stats.Inv;
  const effectiveSave = getEffectiveSave(defSv, defInv, weaponAP);

  const saveRolls = dice.rollNd6(wounds);
  let saved = 0;

  if (effectiveSave !== null) {
    for (let i = 0; i < saveRolls.length; i++) {
      let roll = saveRolls[i];

      // Every Strike Foreseen: defender re-rolls one failed save
      if (everyStrikeActive && roll < effectiveSave) {
        const reroll = dice.rollD6();
        log.push(`Every Strike Foreseen: re-roll save ${roll} → ${reroll}`);
        saveRolls[i] = reroll;
        roll = reroll;
      }

      if (roll >= effectiveSave) saved++;
    }
    log.push(`Save rolls [${saveRolls.join(',')}] vs ${effectiveSave}+ → ${saved} saved`);
  } else {
    log.push(`No save available (AP${weaponAP} vs Sv${defSv}+/Inv${defInv ?? '-'})`);
  }

  const unsavedWounds = wounds - saved;

  if (unsavedWounds === 0) {
    return {
      attackerName: attackerChar.name,
      attacks: atkA, hitRolls, hits,
      woundRolls, wounds,
      saveRolls, unsavedWounds: 0,
      totalDamage: 0, defenderWoundsRemaining: defender.currentWounds,
      defenderIsCasualty: false, log,
    };
  }

  // ── Apply Damage ─────────────────────────────────────────────────────────
  let dmgPerWound = baseDmg + mods.damageDelta;
  if (mods.damageSetToOne) dmgPerWound = 1;

  // Eternal Warrior: reduce damage by X, minimum 1
  for (const sr of defenderChar.specialRules) {
    if (sr.name === 'EternalWarrior') {
      dmgPerWound = Math.max(1, dmgPerWound - sr.value);
    }
  }

  const totalDamage = unsavedWounds * dmgPerWound;
  const defenderWoundsRemaining = Math.max(0, defender.currentWounds - totalDamage);
  const defenderIsCasualty = defenderWoundsRemaining <= 0;

  log.push(
    `${unsavedWounds} unsaved wound(s) × ${dmgPerWound} dmg = ${totalDamage} damage. ` +
    `${defenderChar.name}: ${defender.currentWounds} → ${defenderWoundsRemaining} wounds` +
    (defenderIsCasualty ? ' (CASUALTY)' : ''),
  );

  return {
    attackerName: attackerChar.name,
    attacks: atkA, hitRolls, hits,
    woundRolls, wounds,
    saveRolls, unsavedWounds,
    totalDamage, defenderWoundsRemaining,
    defenderIsCasualty, log,
  };
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
        defenderIsCasualty: false, log: ['AI did not attack — already a casualty.'],
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
        defenderIsCasualty: false, log: ['Player did not attack — already a casualty.'],
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

  return {
    firstAttacker: advantage,
    playerResult: playerResult!,
    aiResult:     aiResult!,
    updatedState,
    log,
  };
}
