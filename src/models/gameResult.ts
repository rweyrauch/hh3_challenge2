/**
 * The outcome once a Challenge has been fully resolved (phase = 'ended').
 */
export interface GameResult {
  winner: 'player' | 'ai' | 'draw';
  playerCRP: number;
  aiCRP: number;
  rounds: number;
  /** Human-readable summary line, e.g. "Player wins with 6 CRP!" */
  summary: string;
}
