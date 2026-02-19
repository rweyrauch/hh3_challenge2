/**
 * CombatLog component — renders the scrollable event log.
 *
 * Log entries are colour-coded by severity:
 *   info    → muted
 *   success → green
 *   warning → yellow
 *   danger  → red
 */
import type { LogEntry } from '../../models/combatState.js';

const SEVERITY_CLASS: Record<LogEntry['severity'], string> = {
  info:    'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger:  'text-danger',
};

/**
 * Render all log entries as a scrollable list.
 * The log is always scrolled to the bottom in the mounted handler.
 */
export function renderCombatLog(entries: LogEntry[]): string {
  const lines = entries
    .map(e => {
      const cls  = SEVERITY_CLASS[e.severity];
      const tag  = `[R${e.round} ${e.phase}]`;
      return `<div class="${cls} log-entry"><span class="log-tag text-muted small">${tag}</span> ${escapeHtml(e.message)}</div>`;
    })
    .join('');

  return `
    <div id="combat-log" class="combat-log bg-dark border border-secondary rounded p-2"
         style="height:220px; overflow-y:auto; font-size:0.8rem;">
      ${lines || '<div class="text-muted">Combat log will appear here...</div>'}
    </div>
  `;
}

/** Scroll the combat log element to the bottom. */
export function scrollLogToBottom(): void {
  const el = document.getElementById('combat-log');
  if (el) el.scrollTop = el.scrollHeight;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
