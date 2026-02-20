/**
 * Heuristic AI for gambit selection.
 *
 * The AI scores each available gambit using weighted rules, then adds
 * ±20% random noise before selecting the highest-scoring option.
 *
 * This approach keeps the AI challenging without being optimal — it makes
 * plausible decisions while remaining beatable through good play.
 */
import type { CombatState } from '../models/combatState.js';
import type { Character }   from '../models/character.js';
import type { GambitId }    from '../models/gambit.js';
import { getFactionGambits } from '../data/factions/index.js';

/**
 * Score a single gambit for the AI to use in the current round.
 *
 * @param gambitId    - gambit being evaluated
 * @param state       - current combat state
 * @param aiChar      - AI character
 * @param playerChar  - player character
 * @returns a numeric score (higher = more desirable)
 */
export function scoreGambit(
  gambitId: GambitId,
  state: CombatState,
  aiChar: Character,
  playerChar: Character,
): number {
  const round  = state.round;
  const aiWounds     = state.ai.currentWounds;
  const aiBaseWounds = state.ai.baseWounds;
  const aiWoundPct   = aiWounds / aiBaseWounds;
  const aiI          = aiChar.stats.I;
  const playerI      = playerChar.stats.I;
  const aiS          = aiChar.stats.S;
  const playerW      = playerChar.stats.W;
  const playerT      = playerChar.stats.T;
  const aiWS         = aiChar.stats.WS;
  const playerWS     = playerChar.stats.WS;

  let score = 0;

  switch (gambitId) {
    // ── Core gambits ───────────────────────────────────────────────────────

    case 'seize-the-initiative':
      // Valuable when AI is slower than player
      if (aiI < playerI) score += 3;
      else if (aiI === playerI) score += 1;
      break;

    case 'flurry-of-blows':
      // Good vs high-wound targets; bad vs high Toughness
      if (playerW >= 4) score += 2;
      if (playerT >= 6) score -= 2;
      if (playerW <= 2) score -= 1;
      break;

    case 'test-the-foe':
      // Very valuable in Round 1 to guarantee next Focus; less so later
      if (round === 1) score += 3;
      else if (round === 2) score += 1;
      // No value if AI already has advantage
      if (state.challengeAdvantage === 'ai') score -= 2;
      break;

    case 'guard-up':
      // Defensive; good when wounded or out-classed in WS
      if (aiWoundPct < 0.6) score += 2;
      if (playerWS >= aiWS) score += 1;
      break;

    case 'taunt-and-bait':
      // Risky but CRP-generating; mild attraction
      score += 1;
      if (aiWS <= playerWS) score -= 1; // extra downside when already weaker
      break;

    case 'grandstand':
      // OS = 0 in a duel, so this is purely a disadvantage
      score = 0;
      break;

    case 'feint-and-riposte':
      // Only available to the first-mover; solid in early rounds
      if (round <= 2) score += 2;
      else score += 1;
      break;

    case 'withdraw':
      // Survival gambit — highly valued when near death
      if (aiWoundPct <= 0.25 && !state.player.isCasualty) score += 5;
      else if (aiWoundPct <= 0.5) score += 2;
      break;

    case 'finishing-blow':
      // Good when AI is strong; bad when slow
      if (aiS >= 6) score += 2;
      if (aiI < playerI) score -= 2;
      break;

    // ── Custodes faction gambits ───────────────────────────────────────────

    case 'every-strike-foreseen':
      // Reactive save re-roll; prioritise in early rounds
      if (round <= 2) score += 4;
      else score += 2;
      break;

    case 'abyssal-strike':
      // Useful when player has higher I — swap it out
      if (playerI > aiI) score += 4;
      else if (round <= 2) score += 2;
      break;

    // ── Ork faction gambits ────────────────────────────────────────────────

    case 'brutal-but-kunnin':
    case 'kunnin-but-brutal':
      // High priority in early rounds to try the signature move
      // Can only be used once per challenge
      if (!state.ai.usedBrutalButKunnin) {
        if (round <= 2) score += 4;
        else score += 2;
      } else {
        score = -99; // already used
      }
      break;

    default:
      score = 0;
  }

  return score;
}

/**
 * Select the best gambit for the AI using heuristic scoring + noise.
 *
 * @param state         - current combat state
 * @param aiChar        - AI character record
 * @param playerChar    - player character record
 * @param bannedGambit  - gambit banned by Feint and Riposte (if any)
 * @returns chosen GambitId
 */
export function selectAIGambit(
  state: CombatState,
  aiChar: Character,
  playerChar: Character,
  bannedGambit: GambitId | null,
): GambitId {
  const available = getFactionGambits(aiChar)
    .map(g => g.id as GambitId)
    .filter(id => {
      // Filter banned gambit
      if (id === bannedGambit) return false;
      // Filter once-per-challenge gambits already used
      if (
        (id === 'brutal-but-kunnin' || id === 'kunnin-but-brutal') &&
        state.ai.usedBrutalButKunnin
      ) return false;
      // Feint and Riposte only available to first mover
      if (id === 'feint-and-riposte') {
        const hasAdvantage =
          state.challengeAdvantage === 'ai' ||
          (state.round === 1 && state.challengeAdvantage === null);
        if (!hasAdvantage) return false;
      }
      return true;
    });

  if (available.length === 0) {
    // Fallback — should never happen in a well-formed game
    return 'seize-the-initiative';
  }

  // Score each available gambit and add ±20% random noise.
  // (Math.random() * 2 - 1) produces a value in [-1, +1], so noise is ±20% of base score.
  // This prevents the AI from being perfectly predictable while keeping it challenging.
  const scored = available.map(id => {
    const base  = scoreGambit(id, state, aiChar, playerChar);
    const noise = base * 0.2 * (Math.random() * 2 - 1);
    return { id, score: base + noise };
  });

  // Pick highest-scoring gambit
  scored.sort((a, b) => b.score - a.score);
  return scored[0].id;
}
