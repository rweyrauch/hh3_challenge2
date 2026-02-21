/**
 * Simulation Screen — shows progress then a ranked results table.
 *
 * Progress state:
 *   Simulating header + Bootstrap progress bar + "Running X / Y gambits…"
 *
 * Results state (replaces progress in-place):
 *   Rank | Gambit | Win% | CRP Δ | Score table, best row highlighted table-success
 *   Back to Selection | Play with best Gambit buttons
 */
import type { Character } from '../../models/character.js';
import type { GambitId }  from '../../models/gambit.js';
import {
  runAllSimulations,
  SIMULATIONS_PER_GAMBIT,
} from '../../engine/simulationRunner.js';
import type { GambitStats } from '../../engine/simulationRunner.js';

export function mountSimulationScreen(
  container: HTMLElement,
  playerChar: Character,
  aiChar: Character,
  weaponIdx: number,
  profileIdx: number,
  onBack: () => void,
  onPlayWithBest: (gambitId: GambitId) => void,
): void {
  container.innerHTML = buildProgressHTML(playerChar.name, aiChar.name);

  const progressBar = container.querySelector<HTMLElement>('#sim-progress-bar')!;
  const statusText  = container.querySelector<HTMLElement>('#sim-status')!;

  runAllSimulations(
    playerChar, aiChar, weaponIdx, profileIdx, SIMULATIONS_PER_GAMBIT,
    (done, total) => {
      const gambitsDone  = Math.round(done  / SIMULATIONS_PER_GAMBIT);
      const gambitsTotal = Math.round(total / SIMULATIONS_PER_GAMBIT);
      const pct          = total > 0 ? Math.round((done / total) * 100) : 0;

      progressBar.style.width = `${pct}%`;
      progressBar.setAttribute('aria-valuenow', String(pct));
      progressBar.textContent = `${pct}%`;
      statusText.textContent  = `Running ${gambitsDone} / ${gambitsTotal} gambits…`;
    },
  ).then(stats => {
    showResults(container, playerChar.name, aiChar.name, stats, onBack, onPlayWithBest);
  }).catch(() => {
    container.innerHTML = `
      <div class="container py-4 text-center">
        <p class="text-danger">Simulation failed. Please go back and try again.</p>
        <button id="sim-back-err-btn" class="btn btn-outline-secondary">← Back to Selection</button>
      </div>
    `;
    container.querySelector('#sim-back-err-btn')?.addEventListener('click', onBack);
  });
}

function buildProgressHTML(playerName: string, aiName: string): string {
  return `
    <div class="container py-4">
      <div class="text-center mb-4">
        <h2 class="fw-bold">📊 Simulating: ${escapeHtml(playerName)} vs ${escapeHtml(aiName)}</h2>
        <p class="text-muted">Testing all opening gambits — please wait…</p>
      </div>
      <div class="progress mb-3" style="height: 2rem;">
        <div
          id="sim-progress-bar"
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style="width: 0%"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
        >0%</div>
      </div>
      <p id="sim-status" class="text-muted small text-center">Starting simulations…</p>
    </div>
  `;
}

function showResults(
  container: HTMLElement,
  playerName: string,
  aiName: string,
  stats: GambitStats[],
  onBack: () => void,
  onPlayWithBest: (gambitId: GambitId) => void,
): void {
  const topGambitId = stats[0]?.gambitId ?? null;

  const rows = stats.map((s, i) => {
    const rank    = i + 1;
    const isBest  = rank === 1;
    const winPct  = Math.round(s.winRate * 100);
    const delta   = s.avgCRPDelta >= 0
      ? `+${s.avgCRPDelta.toFixed(1)}`
      : s.avgCRPDelta.toFixed(1);
    const score   = s.compositeScore.toFixed(2);
    const badge   = isBest ? ' <span class="badge bg-success ms-1">Best</span>' : '';

    return `
      <tr class="${isBest ? 'table-success' : ''}">
        <td class="text-center fw-bold">${rank}</td>
        <td>${escapeHtml(s.gambitName)}${badge}</td>
        <td class="text-center">${winPct}%</td>
        <td class="text-center">${delta}</td>
        <td class="text-center">${score}</td>
      </tr>
    `;
  }).join('');

  const playBtn = topGambitId
    ? `<button id="sim-play-btn" class="btn btn-warning btn-lg px-4">⚔ Play with best Gambit</button>`
    : '';

  container.innerHTML = `
    <div class="container py-4">
      <div class="text-center mb-4">
        <h2 class="fw-bold">📊 Results: ${escapeHtml(playerName)} vs ${escapeHtml(aiName)}</h2>
        <p class="text-muted small">${SIMULATIONS_PER_GAMBIT} simulations per gambit</p>
      </div>

      <div class="table-responsive">
        <table class="table table-dark table-bordered table-hover align-middle">
          <thead class="table-secondary">
            <tr>
              <th class="text-center">Rank</th>
              <th>Gambit</th>
              <th class="text-center">Win%</th>
              <th class="text-center">CRP Δ</th>
              <th class="text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <div class="text-center mt-4 d-flex flex-wrap justify-content-center gap-3">
        <button id="sim-back-btn" class="btn btn-outline-secondary btn-lg px-4">
          ← Back to Selection
        </button>
        ${playBtn}
      </div>
    </div>
  `;

  container.querySelector('#sim-back-btn')?.addEventListener('click', onBack);

  if (topGambitId) {
    container.querySelector('#sim-play-btn')?.addEventListener('click', () => {
      onPlayWithBest(topGambitId);
    });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
