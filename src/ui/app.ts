/**
 * Top-level application router.
 *
 * Manages transitions between:
 *   selection → combat → result
 *
 * The router holds the canonical CombatState and delegates rendering to the
 * appropriate screen.
 */
import type { Character } from '../models/character.js';
import type { CombatState } from '../models/combatState.js';
import type { GambitId } from '../models/gambit.js';
import { getCharacterById } from '../data/factions/index.js';
import { ChallengeEngine, buildInitialState } from '../engine/challengeEngine.js';
import { RealDiceRoller } from '../engine/dice.js';
import { mountSelectionScreen } from './screens/selectionScreen.js';
import { mountCombatScreen, updateCombatScreen } from './screens/combatScreen.js';
import { mountResultScreen } from './screens/resultScreen.js';
import { mountSimulationScreen } from './screens/simulationScreen.js';

type AppScreen = 'selection' | 'combat' | 'result' | 'simulation';

interface AppState {
  screen: AppScreen;
  playerChar: Character | null;
  aiChar:     Character | null;
  engine:     ChallengeEngine | null;
  combatState: CombatState | null;
  playerWeaponIndex:   number;
  playerProfileIndex:  number;
  recommendedOpeningGambit: GambitId | null;
}

/** Boot the application. */
export function startApp(container: HTMLElement): void {
  const app: AppState = {
    screen: 'selection',
    playerChar: null,
    aiChar:     null,
    engine:     null,
    combatState: null,
    playerWeaponIndex:        0,
    playerProfileIndex:       0,
    recommendedOpeningGambit: null,
  };

  function goToSelection(): void {
    app.screen                   = 'selection';
    app.playerChar               = null;
    app.aiChar                   = null;
    app.engine                   = null;
    app.combatState              = null;
    app.recommendedOpeningGambit = null;
    mountSelectionScreen(
      container,
      ({ playerCharId, aiCharId, playerWeaponIndex, playerProfileIndex }) => {
        app.playerChar          = getCharacterById(playerCharId) ?? null;
        app.aiChar              = getCharacterById(aiCharId) ?? null;
        app.playerWeaponIndex   = playerWeaponIndex;
        app.playerProfileIndex  = playerProfileIndex;
        if (app.playerChar && app.aiChar) goToCombat();
      },
      ({ playerCharId, aiCharId, playerWeaponIndex, playerProfileIndex }) => {
        app.playerChar          = getCharacterById(playerCharId) ?? null;
        app.aiChar              = getCharacterById(aiCharId) ?? null;
        app.playerWeaponIndex   = playerWeaponIndex;
        app.playerProfileIndex  = playerProfileIndex;
        if (app.playerChar && app.aiChar) goToSimulation();
      },
    );
  }

  function goToSimulation(): void {
    if (!app.playerChar || !app.aiChar) { goToSelection(); return; }
    app.screen = 'simulation';
    mountSimulationScreen(
      container,
      app.playerChar,
      app.aiChar,
      app.playerWeaponIndex,
      app.playerProfileIndex,
      () => goToSelection(),
      (gambitId) => {
        app.recommendedOpeningGambit = gambitId;
        goToCombat();
      },
    );
  }

  function goToCombat(reuseSameChars = false): void {
    if (!app.playerChar || !app.aiChar) { goToSelection(); return; }

    const dice   = new RealDiceRoller();
    const engine = new ChallengeEngine(app.playerChar, app.aiChar, dice);
    let   state  = buildInitialState(app.playerChar, app.aiChar);

    // Pre-select the player's weapon chosen on the selection screen so the
    // engine never pauses to ask for weapon input during the Focus phase.
    const preSelected = app.playerChar.weapons[app.playerWeaponIndex]
      ?.profiles[app.playerProfileIndex];
    if (preSelected) {
      state = { ...state, player: { ...state.player, selectedWeaponProfile: preSelected } };
    }

    app.screen      = 'combat';
    app.engine      = engine;
    app.combatState = state;

    const callbacks = {
      onGambitSelected(id: GambitId) {
        advanceWith({ selectedGambit: id });
      },
      onWeaponSelected(weaponIdx: number, profileIdx: number) {
        advanceWith({ selectedWeaponIndex: weaponIdx, selectedProfileIndex: profileIdx });
      },
      onContinue() {
        advanceWith({ continueChallenge: true });
      },
      onEnd() {
        advanceWith({ continueChallenge: false });
      },
      onWithdraw() {
        advanceWith({ useWithdraw: true });
      },
      onAbandon() {
        goToSelection();
      },
    };

    mountCombatScreen(
      container, state, app.playerChar, app.aiChar, callbacks,
      app.recommendedOpeningGambit,
    );

    // Kick off first advance (AI has no input needed until faceOff)
    // The engine will wait for player input at faceOff.
  }

  function advanceWith(input?: Parameters<ChallengeEngine['advance']>[1]): void {
    if (!app.engine || !app.combatState || !app.playerChar || !app.aiChar) return;

    let result = app.engine.advance(app.combatState, input);
    app.combatState = result.state;

    // Keep auto-advancing while the engine doesn't need player input
    while (!result.waitingForInput && result.state.phase !== 'ended') {
      result = app.engine.advance(result.state);
      app.combatState = result.state;
    }

    if (result.state.phase === 'ended') {
      goToResult();
      return;
    }

    updateCombatScreen(
      container,
      app.combatState,
      app.playerChar,
      app.aiChar,
      {
        onGambitSelected: (id) => advanceWith({ selectedGambit: id }),
        onWeaponSelected: (wIdx, pIdx) => advanceWith({ selectedWeaponIndex: wIdx, selectedProfileIndex: pIdx }),
        onContinue:  () => advanceWith({ continueChallenge: true }),
        onEnd:       () => advanceWith({ continueChallenge: false }),
        onWithdraw:  () => advanceWith({ useWithdraw: true }),
        onAbandon:   () => goToSelection(),
      },
      app.combatState.round === 1 ? app.recommendedOpeningGambit : null,
    );
  }

  function goToResult(): void {
    if (!app.combatState || !app.playerChar || !app.aiChar) return;
    app.screen = 'result';
    mountResultScreen(
      container,
      app.combatState,
      app.playerChar,
      app.aiChar,
      () => goToCombat(true),  // Rematch: same characters
      () => goToSelection(),   // New characters
    );
  }

  // Boot
  goToSelection();
}
