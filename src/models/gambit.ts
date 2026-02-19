/**
 * All gambit identifiers used across the simulation.
 *
 * Core gambits are available to every model in a Challenge.
 * Faction-specific gambits are only available to models whose faction
 * provides them.
 */
export type GambitId =
  // ── Core gambits ─────────────────────────────────────────────────────────
  | 'seize-the-initiative'
  | 'flurry-of-blows'
  | 'test-the-foe'
  | 'guard-up'
  | 'taunt-and-bait'
  | 'grandstand'
  | 'feint-and-riposte'
  | 'withdraw'
  | 'finishing-blow'
  // ── Legio Custodes faction gambits ───────────────────────────────────────
  | 'every-strike-foreseen'
  | 'abyssal-strike'
  // ── Ork faction gambits ──────────────────────────────────────────────────
  | 'brutal-but-kunnin'
  | 'kunnin-but-brutal';

/**
 * When within the Challenge procedure a gambit has its primary effect.
 */
export type GambitTiming = 'faceOff' | 'focus' | 'strike' | 'glory';

/** Metadata for a single gambit. */
export interface Gambit {
  id: GambitId;
  name: string;
  /** Short description shown in the gambit selection panel. */
  description: string;
  /** Which phase(s) the gambit primarily modifies. */
  timings: GambitTiming[];
  /**
   * Whether this gambit may only be chosen by the player who selects the
   * *first* gambit in the Face-Off Step (i.e., the player with Challenge
   * Advantage, or the Challenger in Round 1).
   */
  firstMoverOnly: boolean;
  /** True if the gambit can only be selected once per entire Challenge. */
  oncePerChallenge: boolean;
}
