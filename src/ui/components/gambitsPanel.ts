/**
 * GambitsPanel component — button grid for gambit selection.
 *
 * Buttons are disabled when outside the faceOff phase.
 * The selected gambit (if any) is highlighted.
 */
import type { Gambit, GambitId } from '../../models/gambit.js';
import type { ChallengePhase } from '../../models/combatState.js';

/**
 * @param gambits         - available gambits for this character
 * @param phase           - current phase (buttons active only in faceOff)
 * @param selectedGambit  - currently selected gambit (if any)
 * @param bannedGambit    - gambit banned by Feint and Riposte
 * @param usedOnce        - set of once-per-challenge gambits already used
 * @param isFirstMover    - whether this player is the first mover (needed for F&R)
 */
export function renderGambitsPanel(
  gambits: Gambit[],
  phase: ChallengePhase,
  selectedGambit: GambitId | null,
  bannedGambit: GambitId | null,
  usedOnce: Set<GambitId>,
  isFirstMover: boolean,
): string {
  const active = phase === 'faceOff';

  const buttons = gambits.map(g => {
    const isBanned    = g.id === bannedGambit;
    const isUsed      = g.oncePerChallenge && usedOnce.has(g.id);
    const needFirst   = g.firstMoverOnly && !isFirstMover;
    const isSelected  = g.id === selectedGambit;
    const disabled    = !active || isBanned || isUsed || needFirst;

    let btnClass = 'btn btn-sm gambit-btn ';
    if (isSelected)       btnClass += 'btn-primary';
    else if (isBanned)    btnClass += 'btn-outline-danger';
    else if (isUsed)      btnClass += 'btn-outline-secondary';
    else if (disabled)    btnClass += 'btn-outline-secondary';
    else                  btnClass += 'btn-outline-light';

    const title = [
      g.description,
      isBanned  ? '⛔ Banned by Feint and Riposte' : '',
      isUsed    ? '✓ Already used this Challenge'  : '',
      needFirst ? '🔒 First-mover only'             : '',
    ].filter(Boolean).join('\n');

    return `
      <div class="col-6 col-sm-4 col-lg-3 mb-2">
        <button
          class="${btnClass} w-100 text-start"
          data-gambit-id="${g.id}"
          ${disabled ? 'disabled' : ''}
          title="${escapeAttr(title)}"
        >
          <span class="gambit-name fw-semibold">${g.name}</span>
          <div class="gambit-desc small text-muted d-none d-sm-block">
            ${g.description.substring(0, 60)}${g.description.length > 60 ? '…' : ''}
          </div>
        </button>
      </div>
    `;
  }).join('');

  return `
    <div class="gambits-panel">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">Select Gambit</h6>
        <small class="text-muted">${active ? 'Choose your gambit for this round' : 'Gambits locked — awaiting phase'}</small>
      </div>
      <div class="row g-1">
        ${buttons}
      </div>
    </div>
  `;
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, '&quot;').replace(/\n/g, '&#10;');
}
