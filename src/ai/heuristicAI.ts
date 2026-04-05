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
import { isSwordProfile } from '../models/weapon.js';

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

    // ── Dark Angels faction gambits ───────────────────────────────────────

    case 'sword-of-the-order':
      // CriticalHit(6+) at cost of -1A; worthwhile when AI has many attacks
      if (aiChar.stats.A >= 4) score += 2;
      else score += 1;
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

    case 'heavens-strike': {
      // Only worthwhile when the selected weapon has CriticalHit(6+) to upgrade.
      const profile = state.ai.selectedWeaponProfile;
      const hasWeaponCrit6 = profile !== null
        && profile.specialRules.some(sr => sr.name === 'CriticalHit' && sr.threshold === 6);
      if (!hasWeaponCrit6) { score = -99; break; }
      // Halving attacks is acceptable when base A is high; crit upgrade adds real value.
      if (aiChar.stats.A >= 4) score += 3;
      else score += 1;
      break;
    }

    case 'raptors-surge':
      // Outside Support is always 0 in a 1v1 duel — no effect.
      score = 0;
      break;

    case 'stones-aegis': {
      // Requires Shield trait; +1T trades a wound floor for survivability.
      const hasShield = (aiChar.traits ?? []).includes('Shield');
      if (!hasShield) { score = -99; break; }
      if (aiChar.stats.T >= 5) score += 3;
      else score += 1;
      break;
    }

    case 'world-serpents-bane': {
      // 1 attack for Damage = current Wounds; very powerful when healthy.
      const wounds = state.ai.currentWounds;
      if (wounds >= 3) score += 4;
      else if (wounds >= 1) score += 2;
      else score = -99;
      break;
    }

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

    // ── Night Lords faction gambits ────────────────────────────────────────

    case 'dirty-fighter':
      // Round-1 pre-strike with 1 attack; always valuable as a free hit
      score += 3;
      break;

    // ── World Eaters faction gambits ────────────────────────────────────────

    case 'brutal-dismemberment':
      // +2 CRP if the opponent is killed; valuable when AI is likely to kill
      if (aiS >= 5 || aiChar.stats.A >= 5) score += 2;
      else score += 1;
      break;

    // ── Emperor's Children faction gambits ────────────────────────────────

    case 'bite-of-the-betrayed':
      // Permanent +1 WS/S/T for the challenge — very valuable in round 1 when eligible
      score += 4;
      break;

    // ── Mechanicum Malagra faction gambits ────────────────────────────────

    case 'power-of-the-machine-spirit':
      // +2 WS / +1 A on IN check success (high IN = high chance); 1-wound Feedback cost
      score += 3;
      break;

    // ── Mechanicum Myrmidax faction gambits ───────────────────────────────

    case 'the-myrmidons-path':
      // Free shooting attack before melee; value depends on having an eligible ranged weapon
      score += 2;
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
      // Dirty Fighter: only eligible in round 1
      if (id === 'dirty-fighter' && state.round > 1) return false;
      // Bite of the Betrayed: only eligible in round 1 vs EC/WE/SoH/DG opponents
      if (id === 'bite-of-the-betrayed') {
        const biteQualifyingFactions = new Set<string>([
          'emperors-children', 'world-eaters', 'sons-of-horus', 'death-guard',
        ]);
        if (
          state.ai.biteOfTheBetrayedActive ||
          state.round > 1 ||
          !biteQualifyingFactions.has(playerChar.faction)
        ) return false;
      }
      // Sword of the Order: only eligible when the AI has at least one sword weapon
      if (id === 'sword-of-the-order') {
        const hasSword = aiChar.weapons.some(
          w => w.type === 'melee' && w.profiles.some(p => isSwordProfile(p)),
        );
        if (!hasSword) return false;
      }
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
