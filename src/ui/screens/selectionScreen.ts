/**
 * Selection Screen — character picker for both sides.
 *
 * Layout: [Player side col-12 col-md-5] [VS col-md-2] [AI side col-12 col-md-5]
 */
import type { Character } from '../../models/character.js';
import {
  ALL_CHARACTERS,
  getFactionLabel,
  getCharactersByFaction,
} from '../../data/factions/index.js';
import { renderStatBlock } from '../components/statBlock.js';

export interface SelectionResult {
  playerCharId: string;
  aiCharId: string;
}

/** Inject the selection screen HTML into the #app container. */
export function mountSelectionScreen(
  container: HTMLElement,
  onBegin: (result: SelectionResult) => void,
): void {
  container.innerHTML = buildHTML();
  attachListeners(container, onBegin);
}

function buildHTML(): string {
  const factions = getCharactersByFaction();
  const options = factions.flatMap(({ faction, characters }) =>
    characters.map(c => `<option value="${c.id}">${getFactionLabel(faction)} — ${c.name}</option>`)
  ).join('');

  return `
    <div class="container py-4">
      <div class="text-center mb-4">
        <h1 class="display-5 fw-bold">⚔ Challenge Phase Simulator</h1>
        <p class="lead text-muted">Horus Heresy 3rd Edition — 1v1 Duel</p>
      </div>

      <div class="row g-3 align-items-start">
        <!-- Player side -->
        <div class="col-12 col-md-5">
          <div class="card bg-dark border-info">
            <div class="card-header text-info fw-bold text-center">Your Warrior</div>
            <div class="card-body">
              <label class="form-label small text-muted">Choose your character:</label>
              <select id="player-char-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-3">
                <option value="">— Select a character —</option>
                ${options}
              </select>
              <div id="player-stat-block"></div>
            </div>
          </div>
        </div>

        <!-- VS divider -->
        <div class="col-12 col-md-2 text-center d-flex align-items-center justify-content-center">
          <div class="vs-divider">
            <div class="fw-bold fs-1 text-warning">VS</div>
          </div>
        </div>

        <!-- AI side -->
        <div class="col-12 col-md-5">
          <div class="card bg-dark border-danger">
            <div class="card-header text-danger fw-bold text-center">AI Warrior</div>
            <div class="card-body">
              <label class="form-label small text-muted">Choose the AI's character:</label>
              <select id="ai-char-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-3">
                <option value="">— Select a character —</option>
                ${options}
              </select>
              <div id="ai-stat-block"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button id="begin-btn" class="btn btn-warning btn-lg px-5" disabled>
          ⚔ Begin Challenge
        </button>
        <p id="begin-hint" class="text-muted small mt-2">Select both characters to begin.</p>
      </div>

      <div class="mt-5 text-center text-muted small">
        <p>Rules based on <em>Warhammer: The Horus Heresy — Age of Darkness</em> (3rd Edition)</p>
      </div>
    </div>
  `;
}

function attachListeners(
  container: HTMLElement,
  onBegin: (result: SelectionResult) => void,
): void {
  const playerSelect = container.querySelector<HTMLSelectElement>('#player-char-select')!;
  const aiSelect     = container.querySelector<HTMLSelectElement>('#ai-char-select')!;
  const beginBtn     = container.querySelector<HTMLButtonElement>('#begin-btn')!;
  const playerStat   = container.querySelector<HTMLElement>('#player-stat-block')!;
  const aiStat       = container.querySelector<HTMLElement>('#ai-stat-block')!;

  const updateBeginBtn = () => {
    const ready = Boolean(playerSelect.value && aiSelect.value);
    beginBtn.disabled = !ready;
  };

  playerSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === playerSelect.value);
    playerStat.innerHTML = char ? renderStatBlock(char) : '';
    updateBeginBtn();
  });

  aiSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === aiSelect.value);
    aiStat.innerHTML = char ? renderStatBlock(char) : '';
    updateBeginBtn();
  });

  beginBtn.addEventListener('click', () => {
    if (playerSelect.value && aiSelect.value) {
      onBegin({ playerCharId: playerSelect.value, aiCharId: aiSelect.value });
    }
  });
}
