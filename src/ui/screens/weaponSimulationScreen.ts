/**
 * Weapon Simulation Screen — shows progress then a ranked results table.
 *
 * Progress state:
 *   Finding Best Weapon header + Bootstrap progress bar + "Running X / Y weapons…"
 *
 * Results state (replaces progress in-place):
 *   Rank | Weapon | Profile | Win% | CRP Δ | Score table, best row highlighted table-success
 *   Back to Selection | Play with best Weapon buttons
 */
import type { Character } from '../../models/character.js';
import {
  runAllWeaponSimulations,
  SIMULATIONS_PER_WEAPON,
} from '../../engine/simulationRunner.js';
import type { WeaponStats } from '../../engine/simulationRunner.js';

export function mountWeaponSimulationScreen(
  container: HTMLElement,
  playerChar: Character,
  aiChar: Character,
  onBack: () => void,
  onPlayWithBestWeapon: (weaponIdx: number, profileIdx: number) => void,
): void {
  container.innerHTML = buildProgressHTML(playerChar.name, aiChar.name);

  const progressBar = container.querySelector<HTMLElement>('#wsim-progress-bar')!;
  const statusText  = container.querySelector<HTMLElement>('#wsim-status')!;

  runAllWeaponSimulations(
    playerChar, aiChar, SIMULATIONS_PER_WEAPON,
    (done, total) => {
      const weaponsDone  = Math.round(done  / SIMULATIONS_PER_WEAPON);
      const weaponsTotal = Math.round(total / SIMULATIONS_PER_WEAPON);
      const pct          = total > 0 ? Math.round((done / total) * 100) : 0;

      progressBar.style.width = `${pct}%`;
      progressBar.setAttribute('aria-valuenow', String(pct));
      progressBar.textContent = `${pct}%`;
      statusText.textContent  = `Running ${weaponsDone} / ${weaponsTotal} weapons…`;
    },
  ).then(stats => {
    showResults(container, playerChar.name, aiChar.name, stats, onBack, onPlayWithBestWeapon);
  }).catch(() => {
    container.innerHTML = `
      <div class="container py-4 text-center">
        <p class="text-danger">Simulation failed. Please go back and try again.</p>
        <button id="wsim-back-err-btn" class="btn btn-outline-secondary">← Back to Selection</button>
      </div>
    `;
    container.querySelector('#wsim-back-err-btn')?.addEventListener('click', onBack);
  });
}

function buildProgressHTML(playerName: string, aiName: string): string {
  return `
    <div class="container py-4">
      <div class="text-center mb-4">
        <h2 class="fw-bold">🗡 Finding Best Weapon: ${escapeHtml(playerName)} vs ${escapeHtml(aiName)}</h2>
        <p class="text-muted">Testing all weapon profiles — please wait…</p>
      </div>
      <div class="progress mb-3" style="height: 2rem;">
        <div
          id="wsim-progress-bar"
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style="width: 0%"
          aria-valuenow="0"
          aria-valuemin="0"
          aria-valuemax="100"
        >0%</div>
      </div>
      <p id="wsim-status" class="text-muted small text-center">Starting simulations…</p>
    </div>
  `;
}

function showResults(
  container: HTMLElement,
  playerName: string,
  aiName: string,
  stats: WeaponStats[],
  onBack: () => void,
  onPlayWithBestWeapon: (weaponIdx: number, profileIdx: number) => void,
): void {
  const best = stats[0] ?? null;

  const rows = stats.map((s, i) => {
    const rank   = i + 1;
    const isBest = rank === 1;
    const winPct = Math.round(s.winRate * 100);
    const delta  = s.avgCRPDelta >= 0
      ? `+${s.avgCRPDelta.toFixed(1)}`
      : s.avgCRPDelta.toFixed(1);
    const score  = s.compositeScore.toFixed(2);
    const badge  = isBest ? ' <span class="badge bg-success ms-1">Best</span>' : '';

    return `
      <tr class="${isBest ? 'table-success' : ''}">
        <td class="text-center fw-bold">${rank}</td>
        <td>${escapeHtml(s.weaponName)}${badge}</td>
        <td>${escapeHtml(s.profileName)}</td>
        <td class="text-center">${winPct}%</td>
        <td class="text-center">${delta}</td>
        <td class="text-center">${score}</td>
      </tr>
    `;
  }).join('');

  const playBtn = best
    ? `<button id="wsim-play-btn" class="btn btn-warning btn-lg px-4">⚔ Play with best Weapon</button>`
    : '';

  container.innerHTML = `
    <div class="container py-4">
      <div class="text-center mb-4">
        <h2 class="fw-bold">🗡 Best Weapon: ${escapeHtml(playerName)} vs ${escapeHtml(aiName)}</h2>
        <p class="text-muted small">${SIMULATIONS_PER_WEAPON} simulations per weapon profile</p>
      </div>

      <div class="table-responsive">
        <table class="table table-dark table-bordered table-hover align-middle">
          <thead class="table-secondary">
            <tr>
              <th class="text-center">Rank</th>
              <th>Weapon</th>
              <th>Profile</th>
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
        <button id="wsim-back-btn" class="btn btn-outline-secondary btn-lg px-4">
          ← Back to Selection
        </button>
        ${playBtn}
      </div>
    </div>
  `;

  container.querySelector('#wsim-back-btn')?.addEventListener('click', onBack);

  if (best) {
    container.querySelector('#wsim-play-btn')?.addEventListener('click', () => {
      onPlayWithBestWeapon(best.weaponIdx, best.profileIdx);
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
