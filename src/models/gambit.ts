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
  | 'kunnin-but-brutal'
  // ── Dark Angels (I) ──────────────────────────────────────────────────────
  | 'sword-of-the-order'      // all DA: sword weapons get CriticalHit(6+), -1 Attack
  | 'the-lions-choler'        // Lion El'Jonson: +2 Focus if ≤2W, ignore wound penalty
  // ── White Scars (V) ──────────────────────────────────────────────────────
  | 'the-path-of-the-warrior' // all WS: predict 1-3/4-6 before roll; if correct ignore negatives
  | 'death-by-a-thousand-cuts'// Jaghatai Khan: enemy S -1 in Strike Step if enemy has been wounded
  // ── Space Wolves (VI) ────────────────────────────────────────────────────
  | 'no-prey-escapes'         // all SW: Glory Step unavailable until a casualty occurs
  | 'a-saga-woven-of-glory'   // all SW: unit gains +1A after killing opponent (no-op in 1v1)
  | 'howl-of-the-death-wolf'  // Leman Russ: once/battle; +5 Focus each round until fail to wound
  // ── Imperial Fists (VII) ─────────────────────────────────────────────────
  | 'a-wall-unyielding'       // all IF: no CI contribution to Focus, gain EternalWarrior(1)
  | 'deaths-champion'         // Sigismund: attacks gain CriticalHit(5+)
  | 'executioners-tax'        // Fafnir Rann: roll 2d6 discard highest, attacks gain CriticalHit(6+)
  // ── Blood Angels (IX) ────────────────────────────────────────────────────
  | 'thrall-of-the-red-thirst'// all BA: ignore wound penalties, +1 Damage, no OS bonus
  | 'angelic-descent'         // Sanguinius: +Focus bonus equal to enemy Bulky(X)
  // ── Iron Hands (X) ───────────────────────────────────────────────────────
  | 'legion-of-one'           // all IH: double OS bonus (no-op in 1v1 duel)
  | 'tempered-by-war'         // Ferrus Manus: T set to 8 for Strike Step
  // ── Ultramarines (XIII) ──────────────────────────────────────────────────
  | 'aegis-of-wisdom'         // all UM: +1 Focus per friendly Command UM model (no-op in 1v1)
  | 'calculating-swordsman'   // Guilliman: +Focus equal to battle round number (max +4)
  // ── Salamanders (XVIII) ──────────────────────────────────────────────────
  | 'duty-is-sacrifice'       // all SA: choose +1/+2/+3 to Focus, suffer same wounds
  // ── Raven Guard (XIX) ────────────────────────────────────────────────────
  | 'decapitation-strike'     // all RG: once/challenge; no Focus Roll, one attack first
  | 'the-shadowed-lord'       // Corvus Corax: ignore wound penalties; may choose early Glory Step
  // ── Emperor's Children (III) ─────────────────────────────────────────────
  | 'paragon-of-excellence'   // all EC: first round only; +2 Focus Roll
  | 'bite-of-the-betrayed'    // Saul Tarvitz: first round vs traitors; +1 WS/S/T for challenge
  // ── Iron Warriors (IV) ───────────────────────────────────────────────────
  | 'spiteful-demise'         // all IW: if killed in Strike Step, deal one auto-hit to opponent
  | 'the-breaker'             // Perturabo: first round; skip attacks, friendly IW unit shoots (N/A in 1v1)
  // ── Night Lords (VIII) ───────────────────────────────────────────────────
  | 'nostraman-courage'       // all NL: once/challenge; swap this model for another (N/A in 1v1)
  | 'a-death-long-foreseen'   // Konrad Curze: available on 5+; WP checks for FNP/+A/+I
  // ── World Eaters (XII) ───────────────────────────────────────────────────
  | 'violent-overkill'        // all WE: excess wounds spill to other enemies (N/A in 1v1)
  // ── Death Guard (XIV) ────────────────────────────────────────────────────
  | 'steadfast-resilience'    // all DG: T = opponent's WS for Strike Step
  | 'witchblood'              // Calas Typhon: once/battle; WP check → +2A/+2S or 1 wound
  // ── Thousand Sons (XV) ───────────────────────────────────────────────────
  | 'prophetic-duellist'      // all TS: after Focus Roll, may replace total with own WP
  // ── Sons of Horus (XVI) ──────────────────────────────────────────────────
  | 'merciless-strike'        // all SoH: first round only; weapons gain Phage(T) (reduce enemy T per wound)
  // ── Word Bearers (XVII) ──────────────────────────────────────────────────
  | 'beseech-the-gods'        // all WB: first round; WP check → +1S/+1A, or suffer 1 wound
  // ── Alpha Legion (XX) ────────────────────────────────────────────────────
  | 'i-am-alpharius';         // all AL: first round; set opponent's CI to 1

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
