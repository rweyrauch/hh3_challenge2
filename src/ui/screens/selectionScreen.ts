/**
 * Selection Screen — character picker for both sides.
 *
 * Layout: [Player side col-12 col-md-5] [VS col-md-2] [AI side col-12 col-md-5]
 *
 * Character filter bar (above the row) lets the user narrow both dropdowns to:
 *   All | Primarchs only | Legion Astartes only
 */
import type { Character } from '../../models/character.js';
import type { CharModifier } from '../../models/weapon.js';
import {
  ALL_CHARACTERS,
  getFactionLabel,
  getCharactersByFaction,
} from '../../data/factions/index.js';
import { renderStatBlock } from '../components/statBlock.js';

export interface SelectionResult {
  playerCharId: string;
  aiCharId: string;
  playerWeaponIndex: number;
  playerProfileIndex: number;
}

// ── Filter types ──────────────────────────────────────────────────────────────

type CharacterFilter = 'all' | 'primarchs' | 'legion-astartes';

/** All factions that fall under the "Legion Astartes" umbrella. */
const LEGION_ASTARTES_FACTIONS = new Set([
  'legion-astartes',
  // Loyalist legions
  'dark-angels', 'white-scars', 'space-wolves', 'imperial-fists',
  'blood-angels', 'iron-hands', 'ultramarines', 'salamanders', 'raven-guard',
  // Traitor legions
  'emperors-children', 'iron-warriors', 'night-lords', 'world-eaters',
  'death-guard', 'thousand-sons', 'sons-of-horus', 'word-bearers', 'alpha-legion',
]);

function applyFilter(chars: Character[], filter: CharacterFilter): Character[] {
  if (filter === 'primarchs')       return chars.filter(c => c.type === 'paragon');
  if (filter === 'legion-astartes') return chars.filter(c => LEGION_ASTARTES_FACTIONS.has(c.faction));
  return chars;
}

/** Build the <option> HTML for both character selects under the given filter. */
function buildCharacterOptions(filter: CharacterFilter): string {
  const factions = getCharactersByFaction();
  return factions.flatMap(({ faction, characters }) => {
    const filtered = applyFilter(characters, filter);
    return filtered.map(
      c => `<option value="${c.id}">${getFactionLabel(faction)} — ${c.name}</option>`,
    );
  }).join('');
}

// ── Mount ─────────────────────────────────────────────────────────────────────

/** Inject the selection screen HTML into the #app container. */
export function mountSelectionScreen(
  container: HTMLElement,
  onBegin: (result: SelectionResult) => void,
  onSimulate: (result: SelectionResult) => void,
): void {
  container.innerHTML = buildHTML();
  attachListeners(container, onBegin, onSimulate);
}

function buildHTML(): string {
  return `
    <div class="container py-4">
      <div class="text-center mb-4">
        <h1 class="display-5 fw-bold">⚔ Challenge Phase Simulator</h1>
        <p class="lead text-muted">Horus Heresy 3rd Edition — 1v1 Duel</p>
      </div>

      <!-- Filter bar -->
      <div class="text-center mb-3">
        <div class="btn-group" role="group" aria-label="Character filter">
          <input type="radio" class="btn-check" name="char-filter" id="filter-all"
                 value="all" checked>
          <label class="btn btn-outline-secondary btn-sm" for="filter-all">All</label>

          <input type="radio" class="btn-check" name="char-filter" id="filter-primarchs"
                 value="primarchs">
          <label class="btn btn-outline-secondary btn-sm" for="filter-primarchs">Primarchs only</label>

          <input type="radio" class="btn-check" name="char-filter" id="filter-legion"
                 value="legion-astartes">
          <label class="btn btn-outline-secondary btn-sm" for="filter-legion">Legion Astartes only</label>
        </div>
      </div>

      <div class="row g-3 align-items-start">
        <!-- Player side -->
        <div class="col-12 col-md-5">
          <div class="card bg-dark border-info">
            <div class="card-header text-info fw-bold text-center">Your Warrior</div>
            <div class="card-body">
              <label class="form-label small text-muted">Choose your character:</label>
              <select id="player-char-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-2">
                <option value="">— Select a character —</option>
              </select>
              <div id="player-weapon-section" hidden>
                <label class="form-label small text-muted">Starting weapon:</label>
                <select id="player-weapon-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-2">
                </select>
              </div>
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
              </select>
              <div id="ai-stat-block"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-4">
        <button id="begin-btn" class="btn btn-warning btn-lg px-5 me-2" disabled>
          ⚔ Begin Challenge
        </button>
        <button id="simulate-btn" class="btn btn-outline-info btn-lg px-5" disabled>
          📊 Simulate
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
  onSimulate: (result: SelectionResult) => void,
): void {
  const playerSelect  = container.querySelector<HTMLSelectElement>('#player-char-select')!;
  const weaponSection = container.querySelector<HTMLElement>('#player-weapon-section')!;
  const weaponSelect  = container.querySelector<HTMLSelectElement>('#player-weapon-select')!;
  const aiSelect      = container.querySelector<HTMLSelectElement>('#ai-char-select')!;
  const beginBtn      = container.querySelector<HTMLButtonElement>('#begin-btn')!;
  const simulateBtn   = container.querySelector<HTMLButtonElement>('#simulate-btn')!;
  const playerStat    = container.querySelector<HTMLElement>('#player-stat-block')!;
  const aiStat        = container.querySelector<HTMLElement>('#ai-stat-block')!;

  const updateBeginBtn = () => {
    const ready = Boolean(playerSelect.value && aiSelect.value);
    beginBtn.disabled    = !ready;
    simulateBtn.disabled = !ready;
  };

  /**
   * Rebuild both character dropdowns for the given filter, preserving any
   * currently selected characters that still appear in the filtered list.
   */
  const refreshSelects = (filter: CharacterFilter) => {
    const prevPlayer = playerSelect.value;
    const prevAi     = aiSelect.value;
    const placeholder = '<option value="">— Select a character —</option>';
    const opts = buildCharacterOptions(filter);

    playerSelect.innerHTML = placeholder + opts;
    aiSelect.innerHTML     = placeholder + opts;

    // Restore player selection if it survived the filter
    if (prevPlayer) {
      playerSelect.value = prevPlayer;
      if (playerSelect.value !== prevPlayer) {
        // Character filtered out — clear derived UI
        weaponSection.hidden = true;
        playerStat.innerHTML = '';
      }
    }

    // Restore AI selection if it survived the filter
    if (prevAi) {
      aiSelect.value = prevAi;
      if (aiSelect.value !== prevAi) {
        aiStat.innerHTML = '';
      }
    }

    updateBeginBtn();
  };

  // Populate the selects on first mount
  refreshSelects('all');

  // Filter radio buttons
  container.querySelectorAll<HTMLInputElement>('input[name="char-filter"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) refreshSelects(radio.value as CharacterFilter);
    });
  });

  playerSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === playerSelect.value);
    if (char) {
      populateWeaponSelect(char, weaponSelect, weaponSection);
      playerStat.innerHTML = renderStatBlock(char);
    } else {
      weaponSection.hidden = true;
      playerStat.innerHTML = '';
    }
    updateBeginBtn();
  });

  aiSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === aiSelect.value);
    aiStat.innerHTML = char ? renderStatBlock(char) : '';
    updateBeginBtn();
  });

  const buildResult = (): SelectionResult => {
    const [wIdx, pIdx] = parseWeaponValue(weaponSelect.value);
    return {
      playerCharId: playerSelect.value,
      aiCharId: aiSelect.value,
      playerWeaponIndex: wIdx,
      playerProfileIndex: pIdx,
    };
  };

  beginBtn.addEventListener('click', () => {
    if (playerSelect.value && aiSelect.value) onBegin(buildResult());
  });

  simulateBtn.addEventListener('click', () => {
    if (playerSelect.value && aiSelect.value) onSimulate(buildResult());
  });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Populate the weapon dropdown from a character's melee weapons.
 * Shows the section when the character has options; auto-selects the first.
 */
function populateWeaponSelect(
  char: Character,
  selectEl: HTMLSelectElement,
  sectionEl: HTMLElement,
): void {
  const options: string[] = [];

  char.weapons.forEach((weapon, wIdx) => {
    if (weapon.type !== 'melee') return;
    weapon.profiles.forEach((profile, pIdx) => {
      const sStr = resolveStrength(char.stats.S, profile.strengthModifier);
      const apStr = profile.ap !== null ? `AP${profile.ap}` : 'AP-';
      options.push(
        `<option value="${wIdx}-${pIdx}">${profile.profileName} — S${sStr} ${apStr} D${profile.damage}</option>`,
      );
    });
  });

  selectEl.innerHTML = options.join('');
  selectEl.disabled  = options.length <= 1;
  sectionEl.hidden   = false;
}

function resolveStrength(baseS: number, mod: CharModifier): number {
  if (mod.kind === 'none')  return baseS;
  if (mod.kind === 'add')   return baseS + mod.value;
  if (mod.kind === 'mult')  return baseS * mod.value;
  return mod.value;
}

/** Parse a "wIdx-pIdx" option value, defaulting to [0, 0] on failure. */
function parseWeaponValue(value: string): [number, number] {
  const parts = value.split('-').map(Number);
  return [parts[0] ?? 0, parts[1] ?? 0];
}
