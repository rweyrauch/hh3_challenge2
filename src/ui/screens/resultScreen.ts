/**
 * Result Screen — winner banner + CRP summary.
 */
import type { CombatState } from '../../models/combatState.js';
import type { Character } from '../../models/character.js';

export function mountResultScreen(
  container: HTMLElement,
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
  onRematch: () => void,
  onNewCharacters: () => void,
): void {
  const playerCRP = state.playerCRP;
  const aiCRP     = state.aiCRP;
  const rounds    = state.round;

  let winner: 'player' | 'ai' | 'draw';
  let bannerClass: string;
  let bannerText: string;

  if (playerCRP > aiCRP) {
    winner = 'player';
    bannerClass = 'alert-success';
    bannerText  = `🏆 Victory! ${playerChar.name} wins the Challenge!`;
  } else if (aiCRP > playerCRP) {
    winner = 'ai';
    bannerClass = 'alert-danger';
    bannerText  = `💀 Defeat! ${aiChar.name} wins the Challenge!`;
  } else {
    winner = 'draw';
    bannerClass = 'alert-warning';
    bannerText  = '⚔ The Challenge ends in a draw!';
  }

  container.innerHTML = `
    <div class="container py-4">
      <div class="alert ${bannerClass} text-center fs-4 fw-bold py-4 mb-4">
        ${bannerText}
      </div>

      <div class="row g-3 justify-content-center mb-4">
        <div class="col-12 col-sm-5">
          <div class="card bg-dark border-info text-center">
            <div class="card-header text-info">Your Warrior</div>
            <div class="card-body">
              <h5>${playerChar.name}</h5>
              <div class="display-4 fw-bold ${winner === 'player' ? 'text-success' : 'text-muted'}">
                ${playerCRP}
              </div>
              <div class="text-muted small">Combat Resolution Points</div>
              ${state.player.isCasualty
                ? '<div class="badge bg-danger mt-2">Slain</div>'
                : '<div class="badge bg-success mt-2">Survived</div>'}
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-5">
          <div class="card bg-dark border-danger text-center">
            <div class="card-header text-danger">AI Warrior</div>
            <div class="card-body">
              <h5>${aiChar.name}</h5>
              <div class="display-4 fw-bold ${winner === 'ai' ? 'text-success' : 'text-muted'}">
                ${aiCRP}
              </div>
              <div class="text-muted small">Combat Resolution Points</div>
              ${state.ai.isCasualty
                ? '<div class="badge bg-danger mt-2">Slain</div>'
                : '<div class="badge bg-success mt-2">Survived</div>'}
            </div>
          </div>
        </div>
      </div>

      <div class="text-center text-muted mb-4">
        Challenge lasted <strong>${rounds}</strong> round${rounds !== 1 ? 's' : ''}.
      </div>

      <div class="d-flex justify-content-center gap-3">
        <button id="rematch-btn" class="btn btn-primary">⚔ Rematch</button>
        <button id="new-chars-btn" class="btn btn-outline-light">🔄 New Characters</button>
      </div>
    </div>
  `;

  container.querySelector('#rematch-btn')!
    .addEventListener('click', onRematch);
  container.querySelector('#new-chars-btn')!
    .addEventListener('click', onNewCharacters);
}
