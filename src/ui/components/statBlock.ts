/**
 * StatBlock component — renders a WS/S/T/W/I/A/Sv/Inv table for a character.
 */
import type { Character } from '../../models/character.js';
import type { CombatantState } from '../../models/combatState.js';

/**
 * Render a stat block table.
 *
 * @param char    - character definition
 * @param combat  - optional combatant state for live wound display
 * @returns HTML string
 */
export function renderStatBlock(char: Character, combat?: CombatantState): string {
  const s = char.stats;
  const currentW = combat ? combat.currentWounds : s.W;
  const wClass = currentW < s.W ? 'text-warning fw-bold' : '';
  const inv = s.Inv !== null ? `${s.Inv}+` : '—';

  return `
    <div class="stat-block card bg-dark border-secondary mb-2">
      <div class="card-header py-1 text-center fw-semibold">${char.name}</div>
      <div class="card-body p-1">
        <table class="table table-sm table-dark table-bordered mb-0 stat-table">
          <thead>
            <tr>
              <th>WS</th><th>S</th><th>T</th>
              <th>W</th><th>I</th><th>A</th>
              <th>Sv</th><th>Inv</th><th>LD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${s.WS}</td>
              <td>${s.S}</td>
              <td>${s.T}</td>
              <td class="${wClass}">${currentW}/${s.W}</td>
              <td>${s.I}</td>
              <td>${s.A}</td>
              <td>${s.Sv}+</td>
              <td>${inv}</td>
              <td>${s.LD}</td>
            </tr>
          </tbody>
        </table>
        <div class="small text-muted text-center mt-1">
          Faction: <strong>${char.faction}</strong>
          ${char.subFaction ? `| Clan: <strong>${char.subFaction}</strong>` : ''}
        </div>
      </div>
    </div>
  `;
}
