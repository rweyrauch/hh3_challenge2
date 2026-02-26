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
import type { PsychicDiscipline } from '../models/character.js';
import { getCharacterById, getFactionLabel, getLegionAlignment } from '../data/factions/index.js';
import { applyDiscipline } from '../data/psychicDisciplines.js';
import { CALIBANITE_WARBLADE, TERRANIC_GREATSWORD, POWER_GLAIVE, FROST_AXE, FROST_SWORD, FROST_CLAW, GREAT_FROST_BLADE, BLADE_OF_PERDITION, AXE_OF_PERDITION, MAUL_OF_PERDITION, SPEAR_OF_PERDITION, LEGATINE_AXE, RAVENS_TALON, PAIR_OF_RAVENS_TALONS, PHOENIX_POWER_SPEAR, PHOENIX_RAPIER, GRAVITON_MACE, CHAINGLAIVE, HEADSMANS_AXE, POWER_SCYTHE, ACHEA_PATTERN_FORCE_SWORD, CARSORAN_POWER_AXE, CARSORAN_POWER_TABAR, POWER_DAGGER } from '../data/weapons/legionChampions.js';
import { SOLARITE_POWER_GAUNTLET, ARTIFICER_POWER_AXE } from '../data/weapons/namedCharacters.js';
import { ChallengeEngine, buildInitialState } from '../engine/challengeEngine.js';
import { RealDiceRoller } from '../engine/dice.js';
import { mountSelectionScreen, type SelectionResult } from './screens/selectionScreen.js';
import { mountCombatScreen, updateCombatScreen } from './screens/combatScreen.js';
import { mountResultScreen } from './screens/resultScreen.js';
import { mountSimulationScreen } from './screens/simulationScreen.js';
import { mountAboutScreen } from './screens/aboutScreen.js';

type AppScreen = 'selection' | 'combat' | 'result' | 'simulation' | 'about';

interface AppState {
  screen: AppScreen;
  playerChar: Character | null;
  aiChar:     Character | null;
  engine:     ChallengeEngine | null;
  combatState: CombatState | null;
  playerWeaponIndex:   number;
  playerProfileIndex:  number;
  recommendedOpeningGambit: GambitId | null;
  /** Persisted selection-screen state, restored when returning to selection. */
  selectionSnapshot: SelectionResult | null;
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
    selectionSnapshot:        null,
  };

  function goToSelection(): void {
    app.screen                   = 'selection';
    app.playerChar               = null;
    app.aiChar                   = null;
    app.engine                   = null;
    app.combatState              = null;
    app.recommendedOpeningGambit = null;
    // app.selectionSnapshot is intentionally preserved so the user's picks are restored.
    mountSelectionScreen(
      container,
      (result) => {
        app.selectionSnapshot   = result;
        let playerChar = getCharacterById(result.playerCharId) ?? null;
        if (result.playerSubFaction && playerChar) {
          playerChar = applySubFaction(playerChar, result.playerSubFaction);
        }
        if (result.playerDiscipline && playerChar) {
          playerChar = applyDiscipline(playerChar, result.playerDiscipline as PsychicDiscipline);
        }
        app.playerChar          = playerChar;
        let aiChar = getCharacterById(result.aiCharId) ?? null;
        if (result.aiSubFaction && aiChar) {
          aiChar = applySubFaction(aiChar, result.aiSubFaction);
        }
        app.aiChar              = aiChar;
        app.playerWeaponIndex   = result.playerWeaponIndex;
        app.playerProfileIndex  = result.playerProfileIndex;
        if (app.playerChar && app.aiChar) goToCombat();
      },
      (result) => {
        app.selectionSnapshot   = result;
        let playerChar = getCharacterById(result.playerCharId) ?? null;
        if (result.playerSubFaction && playerChar) {
          playerChar = applySubFaction(playerChar, result.playerSubFaction);
        }
        if (result.playerDiscipline && playerChar) {
          playerChar = applyDiscipline(playerChar, result.playerDiscipline as PsychicDiscipline);
        }
        app.playerChar          = playerChar;
        let aiChar = getCharacterById(result.aiCharId) ?? null;
        if (result.aiSubFaction && aiChar) {
          aiChar = applySubFaction(aiChar, result.aiSubFaction);
        }
        app.aiChar              = aiChar;
        app.playerWeaponIndex   = result.playerWeaponIndex;
        app.playerProfileIndex  = result.playerProfileIndex;
        if (app.playerChar && app.aiChar) goToSimulation();
      },
      (snapshot) => {
        app.selectionSnapshot = snapshot;
        goToAbout();
      },
      app.selectionSnapshot ?? undefined,
    );
  }

  function goToAbout(): void {
    app.screen = 'about';
    mountAboutScreen(container, () => goToSelection());
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

/**
 * Return a shallow-cloned Character with subFaction set, traits appended
 * (legion name + 'Loyalist'/'Traitor'), and any subfaction-specific weapons
 * appended to the weapons array so engine indices match the selection screen.
 *
 * Dark Angels: adds Calibanite Warblade and Terranic Greatsword when the
 * character already has a Power Sword.
 */
function applySubFaction(char: Character, subFaction: string): Character {
  const legionName = getFactionLabel(subFaction);
  const alignment  = getLegionAlignment(subFaction);
  const addedTraits: string[] = alignment ? [legionName, alignment] : [legionName];

  const extraWeapons = [
    ...(subFaction === 'dark-angels' && char.weapons.some(w => w.name === 'Power Sword')
      ? [CALIBANITE_WARBLADE, TERRANIC_GREATSWORD]
      : []),
    ...(subFaction === 'white-scars' ? [POWER_GLAIVE] : []),
    ...(subFaction === 'space-wolves' ? [FROST_AXE, FROST_SWORD, FROST_CLAW, GREAT_FROST_BLADE] : []),
    ...(subFaction === 'imperial-fists' ? [SOLARITE_POWER_GAUNTLET] : []),
    ...(subFaction === 'blood-angels' ? [BLADE_OF_PERDITION, AXE_OF_PERDITION, MAUL_OF_PERDITION, SPEAR_OF_PERDITION] : []),
    ...(subFaction === 'iron-hands' ? [ARTIFICER_POWER_AXE] : []),
    ...(subFaction === 'ultramarines' ? [LEGATINE_AXE] : []),
    ...(subFaction === 'raven-guard' ? [RAVENS_TALON, PAIR_OF_RAVENS_TALONS] : []),
    ...(subFaction === 'emperors-children' ? [PHOENIX_POWER_SPEAR, PHOENIX_RAPIER] : []),
    ...(subFaction === 'iron-warriors' ? [GRAVITON_MACE] : []),
    ...(subFaction === 'night-lords' ? [CHAINGLAIVE, HEADSMANS_AXE] : []),
    ...(subFaction === 'death-guard' ? [POWER_SCYTHE] : []),
    ...(subFaction === 'thousand-sons' ? [ACHEA_PATTERN_FORCE_SWORD] : []),
    ...(subFaction === 'sons-of-horus' ? [CARSORAN_POWER_AXE, CARSORAN_POWER_TABAR] : []),
    ...(subFaction === 'alpha-legion' ? [POWER_DAGGER] : []),
  ];

  return {
    ...char,
    subFaction,
    traits:   [...(char.traits ?? []), ...addedTraits],
    weapons:  extraWeapons.length > 0 ? [...char.weapons, ...extraWeapons] : char.weapons,
  };
}
