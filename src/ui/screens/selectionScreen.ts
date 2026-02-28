/**
 * Selection Screen — character picker for both sides.
 *
 * Layout: [Player side col-12 col-md-5] [VS col-md-2] [AI side col-12 col-md-5]
 *
 * Character filter bar (above the row) lets the user narrow both dropdowns to:
 *   All | Primarchs only | Legion Astartes only
 */
import type { Character, PsychicDiscipline, WargearId } from '../../models/character.js';
import type { CharModifier } from '../../models/weapon.js';
import type { Weapon } from '../../models/weapon.js';
import {
  ALL_CHARACTERS,
  getFactionLabel,
  getCharactersByFaction,
  LEGION_SUBFACTION_IDS,
} from '../../data/factions/index.js';
import { DISCIPLINE_CONFIGS } from '../../data/psychicDisciplines.js';
import { WARGEAR_CONFIGS, SUBFACTION_WARGEAR } from '../../data/wargear.js';
import { CALIBANITE_WARBLADE, TERRANIC_GREATSWORD, POWER_GLAIVE, FROST_AXE, FROST_SWORD, FROST_CLAW, GREAT_FROST_BLADE, BLADE_OF_PERDITION, AXE_OF_PERDITION, MAUL_OF_PERDITION, SPEAR_OF_PERDITION, LEGATINE_AXE, RAVENS_TALON, PAIR_OF_RAVENS_TALONS, PHOENIX_POWER_SPEAR, PHOENIX_RAPIER, GRAVITON_MACE, CHAINGLAIVE, HEADSMANS_AXE, POWER_SCYTHE, ACHEA_PATTERN_FORCE_SWORD, CARSORAN_POWER_AXE, CARSORAN_POWER_TABAR, POWER_DAGGER } from '../../data/weapons/legionChampions.js';
import { SOLARITE_POWER_GAUNTLET, ARTIFICER_POWER_AXE } from '../../data/weapons/namedCharacters.js';
import { renderStatBlock } from '../components/statBlock.js';

export interface SelectionResult {
  playerCharId: string;
  aiCharId: string;
  playerWeaponIndex: number;
  playerProfileIndex: number;
  /** Active filter at the time this result was captured. */
  filter: CharacterFilter;
  /** Selected Psychic Discipline (only for Librarian characters). */
  playerDiscipline?: string;
  /** Selected wargear item (only for characters with availableWargear). */
  playerWargear?: WargearId;
  /** Selected sub-faction (only for generic 'legion-astartes' characters). */
  playerSubFaction?: string;
  /** Selected sub-faction for the AI (only for generic 'legion-astartes' characters). */
  aiSubFaction?: string;
}

// ── Filter types ──────────────────────────────────────────────────────────────

export type CharacterFilter = 'all' | 'primarchs' | 'legion-astartes';

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

/** Build the <option> HTML for the sub-faction picker (all 18 legions). */
function buildSubfactionOptions(): string {
  return LEGION_SUBFACTION_IDS.map(
    id => `<option value="${id}">${getFactionLabel(id)}</option>`,
  ).join('');
}

// ── Mount ─────────────────────────────────────────────────────────────────────

/** Inject the selection screen HTML into the #app container. */
export function mountSelectionScreen(
  container: HTMLElement,
  onBegin: (result: SelectionResult) => void,
  onSimulate: (result: SelectionResult) => void,
  onAbout: (snapshot: SelectionResult) => void,
  initialState?: SelectionResult,
): void {
  container.innerHTML = buildHTML();
  attachListeners(container, onBegin, onSimulate, onAbout, initialState);
}

function buildHTML(): string {
  const subfactionOpts = buildSubfactionOptions();
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
              <div id="player-subfaction-section" hidden>
                <label class="form-label small text-muted">Legion Sub-faction:</label>
                <select id="player-subfaction-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-2">
                  <option value="">— No Sub-faction —</option>
                  ${subfactionOpts}
                </select>
              </div>
              <div id="player-discipline-section" hidden>
                <label class="form-label small text-muted">Psychic Discipline:</label>
                <select id="player-discipline-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-2">
                  <option value="">— No Discipline —</option>
                </select>
              </div>
              <div id="player-wargear-section" hidden>
                <label class="form-label small text-muted">Optional Wargear:</label>
                <select id="player-wargear-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-2">
                  <option value="">— No Shield —</option>
                </select>
              </div>
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
              <select id="ai-char-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-2">
                <option value="">— Select a character —</option>
              </select>
              <div id="ai-subfaction-section" hidden>
                <label class="form-label small text-muted">Legion Sub-faction:</label>
                <select id="ai-subfaction-select" class="form-select form-select-sm bg-dark text-white border-secondary mb-2">
                  <option value="">— No Sub-faction —</option>
                  ${subfactionOpts}
                </select>
              </div>
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
        <button id="about-btn" class="btn btn-link btn-sm text-muted p-0">ℹ About &amp; How to Play</button>
      </div>
    </div>
  `;
}

function attachListeners(
  container: HTMLElement,
  onBegin: (result: SelectionResult) => void,
  onSimulate: (result: SelectionResult) => void,
  onAbout: (snapshot: SelectionResult) => void,
  initialState?: SelectionResult,
): void {
  const playerSelect          = container.querySelector<HTMLSelectElement>('#player-char-select')!;
  const playerSubfactionSection = container.querySelector<HTMLElement>('#player-subfaction-section')!;
  const playerSubfactionSelect  = container.querySelector<HTMLSelectElement>('#player-subfaction-select')!;
  const disciplineSection     = container.querySelector<HTMLElement>('#player-discipline-section')!;
  const disciplineSelect      = container.querySelector<HTMLSelectElement>('#player-discipline-select')!;
  const wargearSection        = container.querySelector<HTMLElement>('#player-wargear-section')!;
  const wargearSelect         = container.querySelector<HTMLSelectElement>('#player-wargear-select')!;
  const weaponSection         = container.querySelector<HTMLElement>('#player-weapon-section')!;
  const weaponSelect          = container.querySelector<HTMLSelectElement>('#player-weapon-select')!;
  const aiSelect              = container.querySelector<HTMLSelectElement>('#ai-char-select')!;
  const aiSubfactionSection   = container.querySelector<HTMLElement>('#ai-subfaction-section')!;
  const aiSubfactionSelect    = container.querySelector<HTMLSelectElement>('#ai-subfaction-select')!;
  const beginBtn              = container.querySelector<HTMLButtonElement>('#begin-btn')!;
  const simulateBtn           = container.querySelector<HTMLButtonElement>('#simulate-btn')!;
  const playerStat            = container.querySelector<HTMLElement>('#player-stat-block')!;
  const aiStat                = container.querySelector<HTMLElement>('#ai-stat-block')!;

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
        playerSubfactionSection.hidden = true;
        playerSubfactionSelect.value   = '';
        wargearSection.hidden = true;
        wargearSelect.value   = '';
        weaponSection.hidden = true;
        playerStat.innerHTML = '';
      }
    }

    // Restore AI selection if it survived the filter
    if (prevAi) {
      aiSelect.value = prevAi;
      if (aiSelect.value !== prevAi) {
        aiSubfactionSection.hidden = true;
        aiSubfactionSelect.value   = '';
        aiStat.innerHTML = '';
      }
    }

    updateBeginBtn();
  };

  // Populate the selects — restore previous state if available, otherwise use defaults
  if (initialState) {
    // Re-check the saved filter radio (radio buttons in the same group auto-deselect each other)
    const savedRadio = container.querySelector<HTMLInputElement>(
      `input[name="char-filter"][value="${initialState.filter}"]`,
    );
    if (savedRadio) savedRadio.checked = true;

    refreshSelects(initialState.filter);

    // Restore player character, sub-faction, discipline, and weapon
    playerSelect.value = initialState.playerCharId;
    const savedPlayerChar = ALL_CHARACTERS.find(c => c.id === initialState.playerCharId);
    if (savedPlayerChar) {
      // Show sub-faction section if applicable
      if (savedPlayerChar.faction === 'legion-astartes') {
        playerSubfactionSection.hidden = false;
        if (initialState.playerSubFaction) {
          playerSubfactionSelect.value = initialState.playerSubFaction;
        }
      }
      // Show discipline section if the character supports it
      if (savedPlayerChar.availablePsychicDisciplines) {
        populateDisciplineSelect(savedPlayerChar.availablePsychicDisciplines, disciplineSelect);
        if (initialState.playerDiscipline) {
          disciplineSelect.value = initialState.playerDiscipline;
        }
        disciplineSection.hidden = false;
      }
      // Show wargear section if the character supports it (including subfaction extras)
      const savedWargearOpts = getWargearOptions(savedPlayerChar, initialState.playerSubFaction ?? '');
      if (savedWargearOpts.length > 0) {
        populateWargearSelect(savedWargearOpts, wargearSelect);
        if (initialState.playerWargear) {
          wargearSelect.value = initialState.playerWargear;
        }
        wargearSection.hidden = false;
      }
      // Populate weapons — include subfaction and discipline extras if selected
      const savedExtras = getPlayerExtraWeapons(
        savedPlayerChar,
        initialState.playerSubFaction ?? '',
        initialState.playerDiscipline ?? '',
      );
      populateWeaponSelect(savedPlayerChar, weaponSelect, weaponSection, savedExtras);
      weaponSelect.value = `${initialState.playerWeaponIndex}-${initialState.playerProfileIndex}`;
      playerStat.innerHTML = renderStatBlock(savedPlayerChar);
    }

    // Restore AI character and sub-faction
    aiSelect.value = initialState.aiCharId;
    const savedAiChar = ALL_CHARACTERS.find(c => c.id === initialState.aiCharId);
    if (savedAiChar) {
      if (savedAiChar.faction === 'legion-astartes') {
        aiSubfactionSection.hidden = false;
        if (initialState.aiSubFaction) {
          aiSubfactionSelect.value = initialState.aiSubFaction;
        }
      }
      aiStat.innerHTML = renderStatBlock(savedAiChar);
    }

    updateBeginBtn();
  } else {
    refreshSelects('all');
  }

  // Filter radio buttons
  container.querySelectorAll<HTMLInputElement>('input[name="char-filter"]').forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) refreshSelects(radio.value as CharacterFilter);
    });
  });

  playerSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === playerSelect.value);
    if (char) {
      // Show/hide sub-faction section
      if (char.faction === 'legion-astartes') {
        playerSubfactionSection.hidden = false;
        playerSubfactionSelect.value   = ''; // reset on character change
      } else {
        playerSubfactionSection.hidden = true;
        playerSubfactionSelect.value   = '';
      }
      // Show/hide discipline section and populate with character-specific options
      if (char.availablePsychicDisciplines) {
        populateDisciplineSelect(char.availablePsychicDisciplines, disciplineSelect);
        disciplineSelect.value = ''; // reset discipline on character change
        disciplineSection.hidden = false;
      } else {
        disciplineSection.hidden = true;
        disciplineSelect.value = '';
      }
      // Show/hide wargear section; subfaction resets on char change so pass ''
      const wargearOpts = getWargearOptions(char, '');
      if (wargearOpts.length > 0) {
        populateWargearSelect(wargearOpts, wargearSelect);
        wargearSelect.value = ''; // reset wargear on character change
        wargearSection.hidden = false;
      } else {
        wargearSection.hidden = true;
        wargearSelect.value = '';
      }
      // Populate base weapons only (no discipline selected yet after a character change)
      populateWeaponSelect(char, weaponSelect, weaponSection);
      playerStat.innerHTML = renderStatBlock(char);
    } else {
      playerSubfactionSection.hidden = true;
      playerSubfactionSelect.value   = '';
      disciplineSection.hidden = true;
      wargearSection.hidden = true;
      wargearSelect.value = '';
      weaponSection.hidden = true;
      playerStat.innerHTML = '';
    }
    updateBeginBtn();
  });

  // Sub-faction dropdown: repopulate weapon list and wargear options
  playerSubfactionSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === playerSelect.value);
    if (char) {
      const extras = getPlayerExtraWeapons(char, playerSubfactionSelect.value, disciplineSelect.value);
      populateWeaponSelect(char, weaponSelect, weaponSection, extras);
      // Refresh wargear: some options (e.g. Vigil Pattern Storm Shield) are subfaction-gated
      const wargearOpts = getWargearOptions(char, playerSubfactionSelect.value);
      if (wargearOpts.length > 0) {
        populateWargearSelect(wargearOpts, wargearSelect);
        wargearSection.hidden = false;
      } else {
        wargearSection.hidden = true;
        wargearSelect.value = '';
      }
    }
  });

  // Discipline dropdown: repopulate weapon list when a discipline is selected
  disciplineSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === playerSelect.value);
    if (char) {
      const extras = getPlayerExtraWeapons(char, playerSubfactionSelect.value, disciplineSelect.value);
      populateWeaponSelect(char, weaponSelect, weaponSection, extras);
    }
  });

  aiSelect.addEventListener('change', () => {
    const char = ALL_CHARACTERS.find(c => c.id === aiSelect.value);
    if (char) {
      if (char.faction === 'legion-astartes') {
        aiSubfactionSection.hidden = false;
        aiSubfactionSelect.value   = ''; // reset on character change
      } else {
        aiSubfactionSection.hidden = true;
        aiSubfactionSelect.value   = '';
      }
      aiStat.innerHTML = renderStatBlock(char);
    } else {
      aiSubfactionSection.hidden = true;
      aiSubfactionSelect.value   = '';
      aiStat.innerHTML = '';
    }
    updateBeginBtn();
  });

  const buildResult = (): SelectionResult => {
    const [wIdx, pIdx] = parseWeaponValue(weaponSelect.value);
    const checkedFilter = container.querySelector<HTMLInputElement>('input[name="char-filter"]:checked');
    return {
      playerCharId: playerSelect.value,
      aiCharId: aiSelect.value,
      playerWeaponIndex: wIdx,
      playerProfileIndex: pIdx,
      filter: (checkedFilter?.value ?? 'all') as CharacterFilter,
      playerDiscipline: disciplineSelect.value || undefined,
      playerWargear: (wargearSelect.value || undefined) as WargearId | undefined,
      playerSubFaction: playerSubfactionSelect.value || undefined,
      aiSubFaction: aiSubfactionSelect.value || undefined,
    };
  };

  beginBtn.addEventListener('click', () => {
    if (playerSelect.value && aiSelect.value) onBegin(buildResult());
  });

  simulateBtn.addEventListener('click', () => {
    if (playerSelect.value && aiSelect.value) onSimulate(buildResult());
  });

  container.querySelector('#about-btn')!.addEventListener('click', () => onAbout(buildResult()));
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Populate the discipline <select> with only the options supported by the
 * given character. Preserves the current selection if it remains valid;
 * otherwise resets to the blank "— No Discipline —" option.
 */
function populateDisciplineSelect(
  disciplines: PsychicDiscipline[],
  selectEl: HTMLSelectElement,
): void {
  const current = selectEl.value;
  selectEl.innerHTML = '<option value="">— No Discipline —</option>';
  for (const disc of disciplines) {
    const opt = document.createElement('option');
    opt.value = disc;
    opt.textContent = DISCIPLINE_CONFIGS[disc].label;
    selectEl.appendChild(opt);
  }
  // Restore previous selection only if it is still available
  if (disciplines.includes(current as PsychicDiscipline)) {
    selectEl.value = current;
  }
}

/**
 * Compute the full set of wargear options available to a character, merging
 * the character's own availableWargear list with any subfaction-granted wargear.
 *
 * Imperial Fists Command/Champion sub-type models gain access to the Vigil
 * Pattern Storm Shield when the imperial-fists subfaction is selected, even
 * if it is not listed in their availableWargear (e.g. generic Chosen Champion).
 */
function getWargearOptions(char: Character, subfaction: string): WargearId[] {
  const base: WargearId[] = [...(char.availableWargear ?? [])];
  const sfWargear = SUBFACTION_WARGEAR[subfaction] ?? [];
  for (const id of sfWargear) {
    if (
      !base.includes(id) &&
      (char.subTypes.includes('Command') || char.subTypes.includes('Champion'))
    ) {
      base.push(id);
    }
  }
  return base;
}

/**
 * Populate the wargear <select> with only the options supported by the
 * given character. Preserves the current selection if it remains valid;
 * otherwise resets to the blank "— No Shield —" option.
 */
function populateWargearSelect(
  wargearIds: WargearId[],
  selectEl: HTMLSelectElement,
): void {
  const current = selectEl.value;
  selectEl.innerHTML = '<option value="">— No Shield —</option>';
  for (const id of wargearIds) {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = WARGEAR_CONFIGS[id].label;
    selectEl.appendChild(opt);
  }
  // Restore previous selection only if it is still available
  if (wargearIds.includes(current as WargearId)) {
    selectEl.value = current;
  }
}

/**
 * Collect extra weapons to append after a character's base weapons in the
 * weapon dropdown, in the order they will be indexed:
 *   1. Dark Angels subfaction extras (Calibanite Warblade, Terranic Greatsword)
 *      — only when subfaction is 'dark-angels' and the character has a Power Sword.
 *   2. Psychic discipline weapon (appended last, matching applyDiscipline order).
 */
function getPlayerExtraWeapons(char: Character, subfaction: string, discipline: string): Weapon[] {
  const extras: Weapon[] = [];
  if (subfaction === 'dark-angels' && char.weapons.some(w => w.name === 'Power Sword')) {
    extras.push(CALIBANITE_WARBLADE, TERRANIC_GREATSWORD);
  }
  if (subfaction === 'white-scars') {
    extras.push(POWER_GLAIVE);
  }
  if (subfaction === 'space-wolves') {
    extras.push(FROST_AXE, FROST_SWORD, FROST_CLAW, GREAT_FROST_BLADE);
  }
  if (subfaction === 'imperial-fists') {
    extras.push(SOLARITE_POWER_GAUNTLET);
  }
  if (subfaction === 'blood-angels') {
    extras.push(BLADE_OF_PERDITION, AXE_OF_PERDITION, MAUL_OF_PERDITION, SPEAR_OF_PERDITION);
  }
  if (subfaction === 'iron-hands') {
    extras.push(ARTIFICER_POWER_AXE);
  }
  if (subfaction === 'ultramarines') {
    extras.push(LEGATINE_AXE);
  }
  if (subfaction === 'raven-guard') {
    extras.push(RAVENS_TALON, PAIR_OF_RAVENS_TALONS);
  }
  if (subfaction === 'emperors-children') {
    extras.push(PHOENIX_POWER_SPEAR, PHOENIX_RAPIER);
  }
  if (subfaction === 'iron-warriors') {
    extras.push(GRAVITON_MACE);
  }
  if (subfaction === 'night-lords') {
    extras.push(CHAINGLAIVE, HEADSMANS_AXE);
  }
  if (subfaction === 'death-guard') {
    extras.push(POWER_SCYTHE);
  }
  if (subfaction === 'thousand-sons') {
    extras.push(ACHEA_PATTERN_FORCE_SWORD);
  }
  if (subfaction === 'sons-of-horus') {
    extras.push(CARSORAN_POWER_AXE, CARSORAN_POWER_TABAR);
  }
  if (subfaction === 'alpha-legion') {
    extras.push(POWER_DAGGER);
  }
  if (discipline) {
    const discWeapon = DISCIPLINE_CONFIGS[discipline as PsychicDiscipline]?.meleeWeapon;
    if (discWeapon) extras.push(discWeapon);
  }
  return extras;
}

/**
 * Populate the weapon dropdown from a character's melee weapons plus any
 * extra weapons (subfaction or discipline). Extra weapons are indexed starting
 * at char.weapons.length so they align with how app.ts appends them to the
 * character before passing it to the engine.
 */
function populateWeaponSelect(
  char: Character,
  selectEl: HTMLSelectElement,
  sectionEl: HTMLElement,
  extraWeapons: Weapon[] = [],
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

  // Extra weapons appended at indices char.weapons.length, +1, +2, …
  extraWeapons.forEach((weapon, i) => {
    if (weapon.type !== 'melee') return;
    const extraWIdx = char.weapons.length + i;
    weapon.profiles.forEach((profile, pIdx) => {
      const sStr = resolveStrength(char.stats.S, profile.strengthModifier);
      const apStr = profile.ap !== null ? `AP${profile.ap}` : 'AP-';
      options.push(
        `<option value="${extraWIdx}-${pIdx}">${profile.profileName} — S${sStr} ${apStr} D${profile.damage}</option>`,
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
