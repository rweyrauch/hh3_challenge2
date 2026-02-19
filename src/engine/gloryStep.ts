/**
 * Glory Step resolution.
 *
 * Determines the winner and calculates Combat Resolution Points.
 *
 * CRP rules (HH3):
 *  - Winner by casualty: CRP = base Wounds of slain model (+1 if Paragon/Command)
 *  - Winner by most wounds inflicted (no casualty): CRP = wounds inflicted
 *  - Draw (both dead, both alive with equal wounds, or 0 wounds each): 0 CRP
 *
 * Taunt and Bait: winner gains +1 CRP per use.
 *
 * Rules reference: HH3 Challenge Sub-Phase, Step 5 (Glory).
 */
import type { CombatState } from '../models/combatState.js';
import type { Character } from '../models/character.js';
import { getTauntAndBaitCRPBonus, canWithdrawFromChallenge } from './gambitEffects.js';

/** Result of the Glory Step. */
export interface GloryStepResult {
  winner: 'player' | 'ai' | 'draw';
  playerCRP: number;
  aiCRP: number;
  /**
   * True if the Withdraw gambit was used by the winning/surviving side and
   * they chose to end the Challenge with 0 CRP scored by either side.
   */
  withdrawUsed: boolean;
  log: string[];
}

/**
 * Resolve the Glory Step.
 *
 * @param state       - combat state after the Strike step
 * @param playerChar  - full player character (for Paragon/Command check)
 * @param aiChar      - full AI character
 * @param playerChoosesWithdraw - player explicitly chose to use Withdraw option
 */
export function resolveGloryStep(
  state: CombatState,
  playerChar: Character,
  aiChar: Character,
  playerChoosesWithdraw = false,
): GloryStepResult {
  const log: string[] = [];
  const { player, ai } = state;

  // ── Withdraw check ───────────────────────────────────────────────────────
  // Withdraw can only be used if:
  //  - The player selected the Withdraw gambit
  //  - The player's model is still alive
  //  - The player explicitly activated the option (playerChoosesWithdraw)
  if (
    playerChoosesWithdraw &&
    canWithdrawFromChallenge(player.selectedGambit, player.isCasualty)
  ) {
    log.push('Player uses Withdraw — Challenge ends with 0 CRP for both sides.');
    return { winner: 'draw', playerCRP: 0, aiCRP: 0, withdrawUsed: true, log };
  }

  // ── Determine winner ─────────────────────────────────────────────────────
  const playerDead = player.isCasualty;
  const aiDead     = ai.isCasualty;
  const bothDead   = playerDead && aiDead;

  let winner: 'player' | 'ai' | 'draw';
  let rawPlayerCRP = 0;
  let rawAiCRP     = 0;

  if (bothDead) {
    // Both removed as casualties → draw
    winner = 'draw';
    log.push('Both models removed as casualties — Draw!');
  } else if (playerDead) {
    // CRP = base Wounds of the SLAIN model (the player's character)
    winner = 'ai';
    rawAiCRP = playerChar.stats.W;
    if (playerChar.subTypes.includes('Paragon') || playerChar.subTypes.includes('Command')) {
      rawAiCRP += 1;
    }
    log.push(`Player is a casualty — AI wins ${rawAiCRP} CRP (base W${playerChar.stats.W}).`);
  } else if (aiDead) {
    // CRP = base Wounds of the SLAIN model (the AI's character)
    winner = 'player';
    rawPlayerCRP = aiChar.stats.W;
    if (aiChar.subTypes.includes('Paragon') || aiChar.subTypes.includes('Command')) {
      rawPlayerCRP += 1;
    }
    log.push(`AI is a casualty — Player wins ${rawPlayerCRP} CRP (base W${aiChar.stats.W}).`);
  } else {
    // Neither dead — compare wounds inflicted this round
    const playerWounds = player.woundsInflictedThisChallenge;
    const aiWounds     = ai.woundsInflictedThisChallenge;

    if (playerWounds > aiWounds) {
      winner = 'player';
      rawPlayerCRP = playerWounds;
      log.push(`Player inflicted more wounds (${playerWounds} vs ${aiWounds}) — Player wins ${rawPlayerCRP} CRP.`);
    } else if (aiWounds > playerWounds) {
      winner = 'ai';
      rawAiCRP = aiWounds;
      log.push(`AI inflicted more wounds (${aiWounds} vs ${playerWounds}) — AI wins ${rawAiCRP} CRP.`);
    } else {
      winner = 'draw';
      log.push(`Equal wounds inflicted (${playerWounds}) — Draw!`);
    }
  }

  // ── Taunt and Bait bonus ─────────────────────────────────────────────────
  const playerTauntBonus = getTauntAndBaitCRPBonus(player.tauntAndBaitCount, winner === 'player');
  const aiTauntBonus     = getTauntAndBaitCRPBonus(ai.tauntAndBaitCount, winner === 'ai');

  if (playerTauntBonus > 0) {
    log.push(`Taunt and Bait bonus: Player +${playerTauntBonus} CRP.`);
  }
  if (aiTauntBonus > 0) {
    log.push(`Taunt and Bait bonus: AI +${aiTauntBonus} CRP.`);
  }

  return {
    winner,
    playerCRP: state.playerCRP + rawPlayerCRP + playerTauntBonus,
    aiCRP:     state.aiCRP     + rawAiCRP     + aiTauntBonus,
    withdrawUsed: false,
    log,
  };
}
