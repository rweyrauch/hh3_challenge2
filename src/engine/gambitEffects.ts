/**
 * Gambit effect functions.
 *
 * Gambits are pure modifier functions rather than classes.  Each function
 * takes the selected gambit and relevant state and returns a plain modifier
 * value or flag.
 *
 * All functions here are pure and have no side effects.
 */
import type { GambitId } from '../models/gambit.js';
import type { CombatState } from '../models/combatState.js';
import type { CharacterStats } from '../models/character.js';

// ─── Focus step modifiers ─────────────────────────────────────────────────────

export interface FocusDiceModification {
  /** Number of *extra* d6 to roll (beyond the base 1). */
  extraDice: number;
  /** If true, discard the lowest result from the pool. */
  discardLowest: boolean;
  /** If true, discard the highest result from the pool. */
  discardHighest: boolean;
  /** If true, the normal Combat Initiative contribution is suppressed
   *  (e.g., Brutal but Kunnin' / Kunnin' but Brutal replaces the roll,
   *  A Wall Unyielding removes the CI contribution). */
  suppressCI: boolean;
  /**
   * If not null, after rolling the Focus dice the controlling player may
   * *replace* the entire dice-total with this fixed number (the gambit value,
   * e.g. Leadership for Kunnin' but Brutal).
   */
  replaceRollWith: number | null;
  /** Flat bonus added to the final Focus total. */
  flatBonus: number;
  /** If true, ignore the wound-count penalty to the Focus Roll. */
  suppressWoundPenalties: boolean;
  /**
   * If true, after all dice and modifiers are resolved the controlling player
   * may replace the *entire* Focus total with this model's Willpower
   * (Prophetic Duellist).  The engine must fill the actual WP value.
   */
  replaceWithWP: boolean;
  /**
   * If true, the opponent's Combat Initiative is treated as 1 for the
   * purpose of this Focus Roll (I Am Alpharius).
   */
  setOpponentCIToOne: boolean;
}

/**
 * Context values needed by state-dependent gambits.
 * All fields are optional; defaults are applied when absent.
 */
export interface FocusContext {
  /** Current challenge round (1-based). */
  round?: number;
  /** Current wound count of the gambit user. */
  currentWounds?: number;
  /** Base (starting) wound count of the gambit user. */
  baseWounds?: number;
  /** Willpower of the gambit user (used by Prophetic Duellist). */
  ownWP?: number;
  /** Enemy model's Bulky(X) value (used by Angelic Descent). */
  enemyBulkyValue?: number;
  /** Character ID of the gambit user (for Lucius/Paragon of Excellence). */
  characterId?: string;
}

/**
 * Return dice-pool modifications that a gambit applies to the Focus Roll.
 * Outside Support is always 0 in a 1v1 duel so Grandstand's suppression is
 * a no-op (but it still modifies the dice pool).
 */
export function getFocusDiceModification(
  gambitId: GambitId | null,
  ctx: FocusContext = {},
): FocusDiceModification {
  const base: FocusDiceModification = {
    extraDice: 0,
    discardLowest: false,
    discardHighest: false,
    suppressCI: false,
    replaceRollWith: null,
    flatBonus: 0,
    suppressWoundPenalties: false,
    replaceWithWP: false,
    setOpponentCIToOne: false,
  };

  const round           = ctx.round          ?? 1;
  const currentWounds   = ctx.currentWounds  ?? 99;
  const enemyBulkyValue = ctx.enemyBulkyValue ?? 0;
  const characterId     = ctx.characterId    ?? '';

  switch (gambitId) {
    // ── Core gambits ────────────────────────────────────────────────────────
    case 'seize-the-initiative':
      return { ...base, extraDice: 1, discardLowest: true };

    case 'finishing-blow':
      return { ...base, extraDice: 1, discardHighest: true };

    case 'grandstand':
      // Roll 2d6 discard highest; no Outside Support bonus (OS=0 in duel, no-op)
      return { ...base, extraDice: 1, discardHighest: true };

    // Kunnin' but Brutal: after normal roll, may replace result with LD.
    // The replaceRollWith value must be set by the engine which knows the LD.
    // We return suppressCI=false; the engine fills replaceRollWith.
    case 'kunnin-but-brutal':
      return { ...base, replaceRollWith: null }; // filled by engine

    // ── Dark Angels ─────────────────────────────────────────────────────────
    case 'the-lions-choler':
      // Only available if ≤2 wounds remain; +2 Focus, ignore wound penalty.
      // Availability check is done by the UI/engine before selection;
      // we simply return the modifiers here.
      return { ...base, flatBonus: 2, suppressWoundPenalties: true };

    // ── White Scars ─────────────────────────────────────────────────────────
    case 'the-path-of-the-warrior':
      // Player predicts 1-3 or 4-6 before rolling; if correct, ignore negatives.
      // Prediction and check are handled by the engine; no dice-pool change here.
      return base;

    // ── Space Wolves ────────────────────────────────────────────────────────
    case 'howl-of-the-death-wolf':
      // +5 to Focus Roll each round until the model fails to inflict an
      // Unsaved Wound.  State tracking (wound success/failure) is handled by
      // the challenge engine; here we just return the +5 bonus.
      return { ...base, flatBonus: 5 };

    // ── Imperial Fists ──────────────────────────────────────────────────────
    case 'a-wall-unyielding':
      // No CI contribution to the Focus Roll; EW(1) applied during Strike Step.
      return { ...base, suppressCI: true };

    case 'executioners-tax':
      // Roll 2d6 discard highest, attacks gain CriticalHit(6+) in strike.
      return { ...base, extraDice: 1, discardHighest: true };

    // ── Blood Angels ────────────────────────────────────────────────────────
    case 'thrall-of-the-red-thirst':
      // Ignore wound penalties; +1 Damage handled in strike modifiers.
      return { ...base, suppressWoundPenalties: true };

    case 'angelic-descent':
      // +Focus equal to enemy Bulky(X); once per challenge and only round 1.
      return { ...base, flatBonus: enemyBulkyValue };

    // ── Ultramarines ────────────────────────────────────────────────────────
    case 'calculating-swordsman':
      // +Focus equal to current battle round number (max +4).
      return { ...base, flatBonus: Math.min(round, 4) };

    // ── Salamanders ─────────────────────────────────────────────────────────
    case 'duty-is-sacrifice':
      // Player chooses +1/+2/+3; default to +2. Wounds applied in strike step.
      // A full UI for this choice would need additional input; we use +2 here.
      return { ...base, flatBonus: 2 };

    // ── Raven Guard ─────────────────────────────────────────────────────────
    case 'the-shadowed-lord':
      // Ignore wound penalties; no Focus dice modification.
      return { ...base, suppressWoundPenalties: true };

    // ── Emperor's Children ──────────────────────────────────────────────────
    case 'paragon-of-excellence': {
      // First round only; +2 Focus. Lucius (captain-lucius) gains +4.
      const bonus = characterId === 'captain-lucius' ? 4 : 2;
      return { ...base, flatBonus: bonus };
    }

    // ── Thousand Sons ───────────────────────────────────────────────────────
    case 'prophetic-duellist':
      // After roll, may replace total with own WP.
      return { ...base, replaceWithWP: true };

    // ── Alpha Legion ────────────────────────────────────────────────────────
    case 'i-am-alpharius':
      // Opponent's CI is set to 1.
      return { ...base, setOpponentCIToOne: true };

    // ── Divisio Assassinorum ─────────────────────────────────────────────────
    case 'biological-overload':
      // Mandatory (Eversor): +3 to Focus Roll.
      return { ...base, flatBonus: 3 };

    default:
      return base;
  }

  // Suppress TS unused-variable warnings (variables captured in switch cases above)
  void round; void currentWounds; void enemyBulkyValue;
}

// ─── Strike step modifiers ────────────────────────────────────────────────────

export interface StrikeModifiers {
  /** Delta applied to current WS before hit roll. */
  wsDelta: number;
  /** If not null, override the model's Attacks to this value. */
  attacksOverride: number | null;
  /** Delta applied to current Attacks (ignored if attacksOverride is set). */
  attacksDelta: number;
  /** Delta applied to Strength for all hits. */
  strengthDelta: number;
  /** Delta applied to Damage for all hits. */
  damageDelta: number;
  /** If true, all hits have their Damage capped at 1 (Flurry of Blows). */
  damageSetToOne: boolean;
  /**
   * If true, the model may only make 1 attack regardless of other modifiers
   * (Guard Up / Withdraw single-attack cap).
   */
  singleAttackCap: boolean;
  /** Extra AP improvement (additive, lower = better). */
  apImprovement: number;
  /**
   * If not null, attacks this model makes gain the Critical Hit rule at this
   * threshold (e.g., 5 = CriticalHit(5+), 6 = CriticalHit(6+)).
   * Stacks with existing weapon Critical Hit by improving X.
   */
  criticalHitThreshold: number | null;
  /**
   * If not null, the defender's Toughness is overridden to this value when
   * computing wound rolls against them (Tempered by War, Steadfast Resilience).
   * Set on the *defender's* gambit modifiers and read by the attack engine.
   */
  overrideDefenderToughness: number | null;
  /**
   * If true, each Unsaved Wound inflicted reduces the enemy's Toughness by 1
   * for subsequent wound rolls in this Strike Step (Merciless Strike / Phage(T)).
   */
  phageToughness: boolean;
  /**
   * If true, this side suffers automatic wounds during the opponent's Strike
   * Step equal to the Duty is Sacrifice bonus (Salamanders).
   * Number of self-wounds is tracked separately via dutyIsSacrificeWounds.
   */
  dutyIsSacrificeWounds: number;
}

/**
 * Return strike-step modifiers for the given gambit.
 *
 * @param gambitId    - selected gambit (or null)
 * @param state       - current combat state snapshot
 * @param forPlayer   - true if computing mods for the human player
 * @param d3Result    - pre-rolled D3 value for Flurry of Blows (provide when
 *                      gambitId === 'flurry-of-blows')
 * @param attackerWS  - attacker's base WS (needed for Steadfast Resilience)
 */
export function getStrikeModifiers(
  gambitId: GambitId | null,
  state: CombatState,
  forPlayer: boolean,
  d3Result = 1,
  attackerWS = 0,
): StrikeModifiers {
  const base: StrikeModifiers = {
    wsDelta: 0,
    attacksOverride: null,
    attacksDelta: 0,
    strengthDelta: 0,
    damageDelta: 0,
    damageSetToOne: false,
    singleAttackCap: false,
    apImprovement: 0,
    criticalHitThreshold: null,
    overrideDefenderToughness: null,
    phageToughness: false,
    dutyIsSacrificeWounds: 0,
  };

  const attacker = forPlayer ? state.player : state.ai;
  const defender = forPlayer ? state.ai    : state.player;

  switch (gambitId) {
    // ── Core gambits ────────────────────────────────────────────────────────
    case 'flurry-of-blows':
      return {
        ...base,
        attacksDelta: d3Result,   // +D3 Attacks
        damageSetToOne: true,     // all Damage → 1
      };

    case 'guard-up':
      return {
        ...base,
        wsDelta: +1,
        singleAttackCap: true,    // may only make 1 attack
      };

    case 'taunt-and-bait': {
      // Reduce own WS and Attacks to equal the enemy's (or enemy−1 if already equal)
      // We express this as a wsDelta and attacksDelta relative to own stats.
      // (The engine must have access to the actual character stats to compute deltas.)
      // Here we return a sentinel and let the engine apply it.
      return base; // engine handles taunt-and-bait directly
    }

    case 'withdraw':
      return {
        ...base,
        singleAttackCap: true,
      };

    case 'finishing-blow':
      return {
        ...base,
        strengthDelta: +1,
        damageDelta: +1,
      };

    case 'abyssal-strike':
      // +1 AP improvement to all hits (lower AP = better penetration)
      return {
        ...base,
        apImprovement: 1,
      };

    case 'every-strike-foreseen':
      // Effect applies in *opponent's* strike step (re-roll one failed save).
      // No direct modifier to the user's own strike.
      return base;

    // ── Dark Angels ─────────────────────────────────────────────────────────
    case 'sword-of-the-order':
      // -1 Attack on sword weapons, gain CriticalHit(6+).
      // Whether the weapon is a sword is checked by the engine at the call site.
      return {
        ...base,
        attacksDelta: -1,
        criticalHitThreshold: 6,
      };

    // ── Imperial Fists ──────────────────────────────────────────────────────
    case 'a-wall-unyielding':
      // Eternal Warrior(1) for the *defender* when it comes to the opponent's
      // Strike Step.  We model this as overrideDefenderToughness staying at
      // base (no change) but the EW(1) reduction is applied in strikeStep.
      // Return base; strikeStep.ts checks this gambit directly.
      return base;

    case 'deaths-champion':
      return {
        ...base,
        criticalHitThreshold: 5,
      };

    case 'executioners-tax':
      return {
        ...base,
        criticalHitThreshold: 6,
      };

    // ── Blood Angels ────────────────────────────────────────────────────────
    case 'thrall-of-the-red-thirst':
      return {
        ...base,
        damageDelta: +1,
      };

    // ── Iron Hands ──────────────────────────────────────────────────────────
    case 'tempered-by-war':
      // When this gambit is selected by the *defender*, override their T to 8.
      // The defender's gambit is checked by strikeStep.ts and this value is
      // applied to wound roll computation.
      return {
        ...base,
        overrideDefenderToughness: 8,
      };

    // ── Salamanders ─────────────────────────────────────────────────────────
    case 'duty-is-sacrifice':
      // Self-wounds equal to the Focus bonus chosen (+2 default).
      return {
        ...base,
        dutyIsSacrificeWounds: 2,
      };

    // ── Death Guard ─────────────────────────────────────────────────────────
    case 'steadfast-resilience':
      // T = opponent's WS.  attackerWS is passed from the engine.
      return {
        ...base,
        overrideDefenderToughness: attackerWS > 0 ? attackerWS : null,
      };

    // ── Thousand Sons ───────────────────────────────────────────────────────
    case 'witchblood':
      // WP check result (pass/fail) is resolved by the engine before calling
      // this function.  If the check passed, +2A and +2S are active.
      // The engine stores the result in state; here we return the on-pass mods.
      // This is applied when the engine determines a WP pass occurred.
      return {
        ...base,
        attacksDelta: +2,
        strengthDelta: +2,
      };

    // ── Sons of Horus ────────────────────────────────────────────────────────
    case 'merciless-strike':
      return {
        ...base,
        phageToughness: true,
      };

    // ── Word Bearers ────────────────────────────────────────────────────────
    case 'beseech-the-gods':
      // WP check result is resolved by the engine; +1S/+1A applied on pass.
      return {
        ...base,
        attacksDelta: +1,
        strengthDelta: +1,
      };

    // ── Night Lords ─────────────────────────────────────────────────────────
    case 'a-death-long-foreseen':
      // +1 Attack on WP pass; FNP and I modifier handled in strikeStep.ts.
      return {
        ...base,
        attacksDelta: +1,
      };

    // ── Divisio Assassinorum ─────────────────────────────────────────────────
    case 'biological-overload':
      // Mandatory (Eversor): +3 Attacks. Self-wounds from hit rolls of 1 handled
      // in strikeStep.ts using AttackResult.hitRollOnes.
      return {
        ...base,
        attacksDelta: +3,
      };

    case 'mirror-form':
      // Mandatory (Adamus): hits always on 4+ (handled in strikeStep.ts via
      // mirrorFormActive flag). No additional strike modifiers returned here.
      // Mirror-Form reactive fight is a complex state interaction handled by
      // the engine: if reactive player, allows attacks after reaching 0W.
      return base;

    default:
      return base;
  }

  // Suppress TS unused-variable warnings (variables captured in switch cases above)
  void attacker; void defender;
}

// ─── Glory step helpers ───────────────────────────────────────────────────────

/**
 * Check whether the Withdraw gambit allows the player to end the Challenge
 * without scoring CRP.
 *
 * @param gambitId  - gambit used by the side wishing to exit
 * @param isCasualty - true if that model was removed as a casualty
 */
export function canWithdrawFromChallenge(
  gambitId: GambitId | null,
  isCasualty: boolean,
): boolean {
  return gambitId === 'withdraw' && !isCasualty;
}

/**
 * Extra CRP modifier from Taunt and Bait (winner gets +1 per use).
 *
 * @param tauntCount  - number of times Taunt and Bait was used in this Challenge
 * @param isWinner    - true if the side in question won the Challenge
 */
export function getTauntAndBaitCRPBonus(tauntCount: number, isWinner: boolean): number {
  return isWinner ? tauntCount : 0;
}

/**
 * Check whether the No Prey Escapes gambit prevents moving to the Glory Step.
 * Returns true if the Glory Step is blocked (no casualty yet).
 *
 * @param gambitId   - gambit used by either side
 * @param playerCasualty - true if player was removed as casualty
 * @param aiCasualty     - true if AI was removed as casualty
 */
export function isGloryStepBlocked(
  playerGambit: GambitId | null,
  aiGambit: GambitId | null,
  playerCasualty: boolean,
  aiCasualty: boolean,
): boolean {
  const noPrey = playerGambit === 'no-prey-escapes' || aiGambit === 'no-prey-escapes';
  if (!noPrey) return false;
  return !playerCasualty && !aiCasualty;
}
