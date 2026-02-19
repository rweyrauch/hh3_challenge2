/**
 * Combat Screen — main battle view.
 *
 * Layout:
 *   Top row:    two stat blocks + wound trackers (col-6 each)
 *   Middle:     phase header + gambit button grid
 *   Bottom:     scrollable combat log
 *   Modal:      weapon selection (Bootstrap modal)
 *   Buttons:    Continue / End (glory phase) + Withdraw (if available)
 */
import type { CombatState } from '../../models/combatState.js';
import type { Character } from '../../models/character.js';
import type { GambitId } from '../../models/gambit.js';
import type { WeaponProfile } from '../../models/weapon.js';
import { renderStatBlock } from '../components/statBlock.js';
import { renderWoundTracker } from '../components/woundTracker.js';
import { renderGambitsPanel } from '../components/gambitsPanel.js';
import { renderCombatLog, scrollLogToBottom } from '../components/combatLog.js';
import { getFactionGambits } from '../../data/factions/index.js';

export interface CombatScreenCallbacks {
  onGambitSelected: (id: GambitId) => void;
  onWeaponSelected: (weaponIdx: number, profileIdx: number) => void;
  onContinue: () => void;
  onEnd: () => void;
  onWithdraw: () => void;
}

/** Mount the combat screen and render the initial state. */
export function mountCombatScreen(
  container: HTMLElement,
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
  callbacks: CombatScreenCallbacks,
): void {
  container.innerHTML = buildShell(playerChar, aiChar);
  updateCombatScreen(container, state, playerChar, aiChar, callbacks);
}

/** Re-render only the dynamic portions of the combat screen. */
export function updateCombatScreen(
  container: HTMLElement,
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
  callbacks: CombatScreenCallbacks,
): void {
  // ── Stat blocks ──────────────────────────────────────────────────────────
  const playerStatEl = container.querySelector<HTMLElement>('#cs-player-stat');
  const aiStatEl     = container.querySelector<HTMLElement>('#cs-ai-stat');
  if (playerStatEl) playerStatEl.innerHTML = renderStatBlock(playerChar, state.player);
  if (aiStatEl)     aiStatEl.innerHTML     = renderStatBlock(aiChar,     state.ai);

  // ── Wound trackers ───────────────────────────────────────────────────────
  const playerWoundEl = container.querySelector<HTMLElement>('#cs-player-wounds');
  const aiWoundEl     = container.querySelector<HTMLElement>('#cs-ai-wounds');
  if (playerWoundEl) playerWoundEl.innerHTML = renderWoundTracker(playerChar, state.player, 'player');
  if (aiWoundEl)     aiWoundEl.innerHTML     = renderWoundTracker(aiChar,     state.ai,     'ai');

  // ── Phase header ─────────────────────────────────────────────────────────
  const phaseEl = container.querySelector<HTMLElement>('#cs-phase');
  if (phaseEl) {
    phaseEl.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span class="badge bg-secondary">Round ${state.round}</span>
        <span class="fw-bold">${phaseLabel(state.phase)}</span>
        <span class="badge ${state.challengeAdvantage === 'player' ? 'bg-info' : state.challengeAdvantage === 'ai' ? 'bg-warning text-dark' : 'bg-secondary'}">
          ${state.challengeAdvantage ? `Advantage: ${state.challengeAdvantage === 'player' ? 'Player' : 'AI'}` : 'No Advantage'}
        </span>
      </div>
    `;
  }

  // ── Gambits panel ─────────────────────────────────────────────────────────
  const gambitsEl = container.querySelector<HTMLElement>('#cs-gambits');
  if (gambitsEl) {
    const gambits = getFactionGambits(playerChar);
    const isFirstMover =
      state.challengeAdvantage === 'player' ||
      (state.round === 1 && state.challengeAdvantage === null);
    const usedOnce = new Set<GambitId>();
    if (state.player.usedBrutalButKunnin) {
      usedOnce.add('brutal-but-kunnin');
      usedOnce.add('kunnin-but-brutal');
    }
    const bannedGambit = state.player.feintAndRiposteBan ?? state.ai.feintAndRiposteBan;

    gambitsEl.innerHTML = renderGambitsPanel(
      gambits, state.phase,
      state.player.selectedGambit,
      bannedGambit, usedOnce, isFirstMover,
    );

    // Attach gambit click listeners
    gambitsEl.querySelectorAll<HTMLButtonElement>('[data-gambit-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.gambitId as GambitId;
        callbacks.onGambitSelected(id);
      });
    });
  }

  // ── Combat log ────────────────────────────────────────────────────────────
  const logEl = container.querySelector<HTMLElement>('#cs-log');
  if (logEl) {
    logEl.innerHTML = renderCombatLog(state.log);
    scrollLogToBottom();
  }

  // ── Action buttons (glory phase) ──────────────────────────────────────────
  updateActionButtons(container, state, callbacks);

  // ── Weapon selection modal ────────────────────────────────────────────────
  if (state.phase === 'focus' && state.player.selectedWeaponProfile === null) {
    showWeaponModal(container, playerChar, callbacks.onWeaponSelected);
  }
}

/** Build the outer HTML shell (static structure). */
function buildShell(playerChar: Character, aiChar: Character): string {
  return `
    <div class="container-fluid py-2">
      <div class="row g-2 mb-2">
        <!-- Player stat block -->
        <div class="col-6">
          <div id="cs-player-stat"></div>
          <div id="cs-player-wounds"></div>
        </div>
        <!-- AI stat block -->
        <div class="col-6">
          <div id="cs-ai-stat"></div>
          <div id="cs-ai-wounds"></div>
        </div>
      </div>

      <!-- Phase header -->
      <div id="cs-phase" class="alert alert-dark p-2 mb-2"></div>

      <!-- Gambits panel -->
      <div id="cs-gambits" class="mb-2"></div>

      <!-- Action buttons (appear in glory phase) -->
      <div id="cs-actions" class="mb-2 text-center"></div>

      <!-- Combat log -->
      <div id="cs-log" class="mb-2"></div>
    </div>

    <!-- Weapon selection modal -->
    <div class="modal fade" id="weapon-modal" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-sm">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">Select Your Weapon</h5>
          </div>
          <div class="modal-body" id="weapon-modal-body"></div>
        </div>
      </div>
    </div>
  `;
}

/** Show/hide the Continue/End/Withdraw buttons. */
function updateActionButtons(
  container: HTMLElement,
  state: CombatState,
  callbacks: CombatScreenCallbacks,
): void {
  const actionsEl = container.querySelector<HTMLElement>('#cs-actions');
  if (!actionsEl) return;

  const isGlory        = state.phase === 'glory';
  const canWithdraw    = state.player.selectedGambit === 'withdraw' && !state.player.isCasualty;
  const bothAlive      = !state.player.isCasualty && !state.ai.isCasualty;
  const showActions    = isGlory;

  if (!showActions) {
    actionsEl.innerHTML = '';
    return;
  }

  const continueBtn = bothAlive
    ? `<button id="btn-continue" class="btn btn-outline-info me-2">▶ Continue Challenge</button>`
    : '';
  const endBtn =
    `<button id="btn-end" class="btn btn-outline-warning me-2">✓ End Challenge</button>`;
  const withdrawBtn = canWithdraw
    ? `<button id="btn-withdraw" class="btn btn-outline-secondary">🏃 Withdraw (0 CRP)</button>`
    : '';

  actionsEl.innerHTML = `
    <div class="d-flex justify-content-center flex-wrap gap-2">
      ${continueBtn}${endBtn}${withdrawBtn}
    </div>
  `;

  container.querySelector('#btn-continue')?.addEventListener('click', callbacks.onContinue);
  container.querySelector('#btn-end')?.addEventListener('click', callbacks.onEnd);
  container.querySelector('#btn-withdraw')?.addEventListener('click', callbacks.onWithdraw);
}

/** Show the weapon selection Bootstrap modal. */
function showWeaponModal(
  container: HTMLElement,
  playerChar: Character,
  onSelect: (weaponIdx: number, profileIdx: number) => void,
): void {
  const body = container.querySelector<HTMLElement>('#weapon-modal-body');
  if (!body) return;

  const buttons: string[] = [];
  playerChar.weapons.forEach((weapon, wIdx) => {
    if (weapon.type !== 'melee') return;
    weapon.profiles.forEach((profile, pIdx) => {
      const smText = formatModifier(profile.strengthModifier, 'S');
      const imText = formatModifier(profile.initiativeModifier, 'I');
      const amText = formatModifier(profile.attacksModifier, 'A');
      const apText = profile.ap !== null ? `AP${profile.ap}` : 'AP-';
      const deRule = profile.specialRules.find(r => r.name === 'DuellistsEdge');
      const deText = deRule ? ` DE+${deRule.value}` : '';

      buttons.push(`
        <button class="btn btn-outline-light btn-sm w-100 mb-2 text-start weapon-btn"
                data-w="${wIdx}" data-p="${pIdx}">
          <strong>${profile.profileName}</strong><br>
          <small class="text-muted">${imText} | ${amText} | ${smText} | ${apText} | D${profile.damage}${deText}</small>
        </button>
      `);
    });
  });

  body.innerHTML = buttons.join('');

  // Attach listeners
  body.querySelectorAll<HTMLButtonElement>('.weapon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wIdx = parseInt(btn.dataset.w!, 10);
      const pIdx = parseInt(btn.dataset.p!, 10);
      // Hide modal
      const modalEl = container.querySelector<HTMLElement>('#weapon-modal');
      if (modalEl) {
        // Use Bootstrap modal hide if available, otherwise just hide
        modalEl.classList.remove('show');
        modalEl.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        backdrop?.remove();
      }
      onSelect(wIdx, pIdx);
    });
  });

  // Show the modal via Bootstrap
  const modalEl = container.querySelector<HTMLElement>('#weapon-modal');
  if (modalEl) {
    modalEl.classList.add('show');
    modalEl.style.display = 'block';
    document.body.classList.add('modal-open');
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
  }
}

function phaseLabel(phase: string): string {
  const labels: Record<string, string> = {
    setup:          '⚙ Setup',
    faceOff:        '🎲 Face-Off — Select Gambit',
    focus:          '🎯 Focus — Roll for Initiative',
    'strike-player': '⚔ Strike — Player Attacks',
    'strike-ai':    '⚔ Strike — AI Attacks',
    glory:          '🏆 Glory — Determine Winner',
    ended:          '✓ Challenge Ended',
  };
  return labels[phase] ?? phase;
}

function formatModifier(mod: WeaponProfile['strengthModifier'], baseChar: string): string {
  switch (mod.kind) {
    case 'none':  return baseChar;
    case 'add':   return `${baseChar}${mod.value >= 0 ? '+' : ''}${mod.value}`;
    case 'fixed': return `${mod.value}`;
  }
}
