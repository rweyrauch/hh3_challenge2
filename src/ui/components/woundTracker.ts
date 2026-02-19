/**
 * WoundTracker component — renders depleting wound pip display.
 *
 * Each wound is shown as a badge; lost wounds are shown in red.
 * A CSS shake animation is applied when damage is taken.
 */
import type { CombatantState } from '../../models/combatState.js';
import type { Character } from '../../models/character.js';

/**
 * @param char    - character record (for base wounds)
 * @param combat  - current combatant state
 * @param side    - 'player' or 'ai' (used for element ID)
 */
export function renderWoundTracker(
  char: Character,
  combat: CombatantState,
  side: 'player' | 'ai',
): string {
  const base    = combat.baseWounds;
  const current = combat.currentWounds;
  const pips: string[] = [];

  for (let i = 1; i <= base; i++) {
    const active = i <= current;
    const cls = active
      ? 'badge bg-success wound-pip me-1'
      : 'badge bg-danger wound-pip me-1';
    pips.push(`<span class="${cls}">W</span>`);
  }

  const shakeClass = combat.isCasualty ? 'wound-tracker shake' : 'wound-tracker';

  return `
    <div id="wound-${side}" class="${shakeClass} text-center mb-1">
      <div class="small text-muted mb-1">${char.name} — Wounds</div>
      <div class="d-flex flex-wrap justify-content-center gap-1">
        ${pips.join('')}
      </div>
      ${combat.isCasualty ? '<div class="text-danger small mt-1">⚠ CASUALTY</div>' : ''}
    </div>
  `;
}
