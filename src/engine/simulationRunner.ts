/**
 * Simulation Runner — automated batch-simulation for gambit analysis.
 *
 * Drives the ChallengeEngine fully automatically (no UI) to evaluate the
 * effectiveness of every opening gambit over N simulations, then ranks
 * them by a composite score.
 */
import type { Character }   from '../models/character.js';
import type { GambitId }    from '../models/gambit.js';
import type { CombatState } from '../models/combatState.js';
import { ChallengeEngine, buildInitialState } from './challengeEngine.js';
import type { PlayerInput } from './challengeEngine.js';
import { RealDiceRoller }   from './dice.js';
import { scoreGambit }      from '../ai/heuristicAI.js';
import { getFactionGambits } from '../data/factions/index.js';

export const SIMULATIONS_PER_GAMBIT = 500;

export interface SimResult {
  winner: 'player' | 'ai' | 'draw';
  playerCRP: number;
  aiCRP: number;
}

export interface GambitStats {
  gambitId: GambitId;
  gambitName: string;
  winRate: number;        // 0–1
  avgCRPDelta: number;    // avg (playerCRP - aiCRP)
  compositeScore: number; // 0–1
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Heuristically select a gambit for the simulated player in round 2+.
 *
 * Mirrors selectAIGambit but from the player's perspective: scores each
 * available gambit using scoreGambit() with player/AI character args
 * swapped, then picks the best.
 */
function selectPlayerGambitHeuristic(
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
): GambitId {
  const bannedGambit = state.player.feintAndRiposteBan;

  const available = getFactionGambits(playerChar)
    .map(g => g.id as GambitId)
    .filter(id => {
      if (id === bannedGambit) return false;
      if (
        (id === 'brutal-but-kunnin' || id === 'kunnin-but-brutal') &&
        state.player.usedBrutalButKunnin
      ) return false;
      if (id === 'feint-and-riposte') {
        const hasAdvantage =
          state.challengeAdvantage === 'player' ||
          (state.round === 1 && state.challengeAdvantage === null);
        if (!hasAdvantage) return false;
      }
      return true;
    });

  if (available.length === 0) return 'seize-the-initiative';

  // Score with swapped player/AI character args (player scored as "ai" perspective)
  const scored = available.map(id => ({
    id,
    score: scoreGambit(id, state, playerChar, aiChar),
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored[0].id;
}

/**
 * Run a single complete simulation with a specified opening gambit.
 *
 * - Round 1 faceOff: player uses openingGambitId
 * - Round 2+ faceOff: player picks heuristically via scoreGambit()
 * - Focus: player's weapon is pre-selected (no UI pause)
 * - Glory: always continue (keeps simulations comparable)
 */
export function runSingleSimulation(
  playerChar: Character,
  aiChar: Character,
  openingGambitId: GambitId,
  weaponIdx: number,
  profileIdx: number,
): SimResult {
  const dice   = new RealDiceRoller();
  const engine = new ChallengeEngine(playerChar, aiChar, dice);
  let   state  = buildInitialState(playerChar, aiChar);

  // Pre-select the player's weapon so the engine never pauses for weapon input.
  const preSelected =
    playerChar.weapons[weaponIdx]?.profiles[profileIdx] ??
    playerChar.weapons[0]?.profiles[0];
  if (preSelected) {
    state = { ...state, player: { ...state.player, selectedWeaponProfile: preSelected } };
  }

  while (state.phase !== 'ended') {
    let input: PlayerInput | undefined;

    if (state.phase === 'faceOff' && state.player.selectedGambit === null) {
      const gambitId = state.round === 1
        ? openingGambitId
        : selectPlayerGambitHeuristic(state, playerChar, aiChar);
      input = { selectedGambit: gambitId };
    } else if (state.phase === 'glory') {
      input = { continueChallenge: true };
    }

    let result = engine.advance(state, input);
    state = result.state;

    // Auto-advance until the engine needs player input or the challenge ends.
    while (!result.waitingForInput && state.phase !== 'ended') {
      result = engine.advance(state);
      state  = result.state;
    }
  }

  // Determine winner: casualty takes priority, then CRP total.
  let winner: 'player' | 'ai' | 'draw';
  if      (state.ai.isCasualty && !state.player.isCasualty) winner = 'player';
  else if (state.player.isCasualty && !state.ai.isCasualty) winner = 'ai';
  else if (state.playerCRP > state.aiCRP)                    winner = 'player';
  else if (state.aiCRP > state.playerCRP)                    winner = 'ai';
  else                                                        winner = 'draw';

  return { winner, playerCRP: state.playerCRP, aiCRP: state.aiCRP };
}

/**
 * Aggregate a batch of simulation results for a single gambit.
 *
 * compositeScore = winRate × 0.7 + clamp(avgCRPDelta / totalMaxWounds, 0, 1) × 0.3
 */
export function analyseGambit(
  results: SimResult[],
  gambitId: GambitId,
  gambitName: string,
  totalMaxWounds: number,
): GambitStats {
  const n = results.length;
  if (n === 0) {
    return { gambitId, gambitName, winRate: 0, avgCRPDelta: 0, compositeScore: 0 };
  }

  const wins        = results.filter(r => r.winner === 'player').length;
  const winRate     = wins / n;
  const avgCRPDelta = results.reduce((sum, r) => sum + (r.playerCRP - r.aiCRP), 0) / n;
  const compositeScore =
    winRate * 0.7 + clamp(avgCRPDelta / totalMaxWounds, 0, 1) * 0.3;

  return { gambitId, gambitName, winRate, avgCRPDelta, compositeScore };
}

/**
 * Run the full gambit analysis and return ranked results.
 *
 * Iterates over every gambit available to the player, runs simsPerGambit
 * simulations for each, yields to the UI thread between gambits, then
 * returns a sorted array (highest composite score first).
 *
 * @param onProgress - called after each gambit batch with (done, total) sim counts
 */
export async function runAllSimulations(
  playerChar: Character,
  aiChar: Character,
  weaponIdx: number,
  profileIdx: number,
  simsPerGambit: number = SIMULATIONS_PER_GAMBIT,
  onProgress: (done: number, total: number) => void,
): Promise<GambitStats[]> {
  const gambits       = getFactionGambits(playerChar);
  const totalMaxWounds = playerChar.stats.W + aiChar.stats.W;
  const total         = gambits.length * simsPerGambit;
  let   done          = 0;

  const allStats: GambitStats[] = [];

  for (const gambit of gambits) {
    const results: SimResult[] = [];
    for (let i = 0; i < simsPerGambit; i++) {
      results.push(
        runSingleSimulation(playerChar, aiChar, gambit.id, weaponIdx, profileIdx),
      );
    }

    allStats.push(analyseGambit(results, gambit.id, gambit.name, totalMaxWounds));

    done += simsPerGambit;
    onProgress(done, total);

    // Yield to the UI thread so the progress bar can repaint.
    await new Promise(r => setTimeout(r, 0));
  }

  allStats.sort((a, b) => b.compositeScore - a.compositeScore);
  return allStats;
}
