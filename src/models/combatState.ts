import type { GambitId } from './gambit.js';
import type { WeaponProfile } from './weapon.js';

/**
 * The current phase within the Challenge procedure state machine.
 *
 * Flow per round:
 *   setup → faceOff → focus → strike-player → strike-ai → glory → (faceOff | ended)
 */
export type ChallengePhase =
  | 'setup'
  | 'faceOff'
  | 'focus'
  | 'strike-player'
  | 'strike-ai'
  | 'glory'
  | 'ended';

/** Severity levels used for log entry colouring in the UI. */
export type LogSeverity = 'info' | 'success' | 'warning' | 'danger';

/** A single entry in the scrollable combat log. */
export interface LogEntry {
  round: number;
  phase: ChallengePhase;
  message: string;
  severity: LogSeverity;
}

/** Mutable-snapshot state for one combatant within a Challenge. */
export interface CombatantState {
  characterId: string;
  currentWounds: number;
  /** Base wounds from the character profile; used for CRP calculation. */
  baseWounds: number;
  /** Total wounds inflicted on the enemy in all rounds of this Challenge. */
  woundsInflictedThisChallenge: number;
  /** True if this model has been removed as a casualty (Wounds = 0). */
  isCasualty: boolean;
  /** The gambit selected in the current Face-Off step, null if not yet chosen. */
  selectedGambit: GambitId | null;
  /** The weapon profile this model will use in the current Strike step. */
  selectedWeaponProfile: WeaponProfile | null;
  /**
   * Accumulated bonus to the *next* Focus Roll from the Guard Up gambit
   * (one +1 per enemy attack that missed while Guard Up was active).
   */
  guardUpFocusBonus: number;
  /**
   * Number of times the player has selected Taunt and Bait in *this* Challenge.
   * Each use adds +1 CRP if the player wins.
   */
  tauntAndBaitCount: number;
  /**
   * True if this model used the Brutal but Kunnin' gambit in a previous
   * round (it may only be selected once per Challenge).
   */
  usedBrutalButKunnin: boolean;
  /**
   * If Feint and Riposte was played, the gambit id that was banned for
   * the *opposing* player in the current Face-Off.  Cleared at the start
   * of each new Face-Off.
   */
  feintAndRiposteBan: GambitId | null;
}

/** Immutable-snapshot of the full Challenge state after each engine step. */
export interface CombatState {
  round: number;
  phase: ChallengePhase;
  player: CombatantState;
  ai: CombatantState;
  /**
   * Which side currently holds Challenge Advantage.
   * Null until the first Focus Roll has been resolved.
   */
  challengeAdvantage: 'player' | 'ai' | null;
  /**
   * Which side will automatically win the next Face-Off due to Test the Foe.
   * Null if no pending advantage.
   */
  testTheFoeAdvantage: 'player' | 'ai' | null;
  /** Combat Resolution Points accumulated this Challenge so far. */
  playerCRP: number;
  aiCRP: number;
  /** Full event log for the combat log panel. */
  log: LogEntry[];
}
