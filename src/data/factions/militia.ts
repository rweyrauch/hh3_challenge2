/**
 * Imperialis Militia characters.
 *
 * Only challenge-eligible models are included — those with the Command
 * Sub-Type.  No Militia model has the Champion or Paragon Sub-Type; the
 * Rogue Psyker uses the Sergeant Sub-Type and cannot issue or accept
 * Challenges.  Cavalry (Mounted) variants are included where the base
 * character also has an Infantry (Command) entry.
 *
 * Faction gambits: no Militia-specific Challenge gambits are defined in the
 * Imperialis Militia Army List.  All models use core gambits only.
 *
 * Weapon notes:
 *  - The Force Commander's default Wargear is a charnabal weapon (player
 *    chooses sabre or tabar) and a militia pistol.  Common upgrades are the
 *    paragon blade, power sword, and power fist (all from the Militia Officer
 *    Weapons list or separate options).  Both charnabal variants and the
 *    upgrade weapons are offered as selectable profiles.
 *  - The Discipline Master and Militia Lieutenant carry only a militia pistol
 *    by default (treated as a close combat weapon in melee).  A power sword
 *    or power fist represents the typical officer upgrade.
 *  - The Militia Lancemaster (Cavalry Command) is armed the same way as the
 *    Discipline Master and Lieutenant; its militia lance (AM=0, Impact only)
 *    has no useful melee output in a challenge and is omitted.
 *  - Mounted characters gain Bulky(2) per the army list, which can affect
 *    the Custodes 'Angelic Descent' gambit.
 *
 * Stat sources: Imperialis Militia Army List (reference/militia.md).
 */
import type { Character } from '../../models/character.js';
import {
  MILITIA_CCW,
  CHARNABAL_SABRE,
  CHARNABAL_TABAR,
  MILITIA_PARAGON_BLADE,
  MILITIA_POWER_SWORD,
  MILITIA_POWER_AXE,
  MILITIA_POWER_FIST,
} from '../weapons/militia.js';

// ════════════════════════════════════════════════════════════════
// FORCE COMMANDER
// Infantry (Command) — High Command
// ════════════════════════════════════════════════════════════════

const MILITIA_FORCE_COMMANDER: Character = {
  id: 'militia-force-commander',
  name: 'Force Commander',
  faction: 'imperialis-militia',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 4, BS: 4, S: 3, T: 3, W: 3,
    I: 3, A: 3, LD: 9, CL: 8, WP: 7, IN: 7,
    Sv: 3, Inv: 5,
  },
  weapons: [
    CHARNABAL_SABRE,
    CHARNABAL_TABAR,
    MILITIA_PARAGON_BLADE,
    MILITIA_POWER_SWORD,
    MILITIA_POWER_AXE,
    MILITIA_POWER_FIST,
  ],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// MOUNTED FORCE COMMANDER
// Cavalry (Command) — High Command
// Gains Bulky(2) per mounted upgrade rules.
// ════════════════════════════════════════════════════════════════

const MILITIA_FORCE_COMMANDER_MOUNTED: Character = {
  id: 'militia-force-commander-mounted',
  name: 'Force Commander (Mounted)',
  faction: 'imperialis-militia',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 4, BS: 4, S: 3, T: 3, W: 4,
    I: 3, A: 3, LD: 9, CL: 8, WP: 7, IN: 7,
    Sv: 3, Inv: 5,
  },
  weapons: [
    CHARNABAL_SABRE,
    CHARNABAL_TABAR,
    MILITIA_PARAGON_BLADE,
    MILITIA_POWER_SWORD,
    MILITIA_POWER_AXE,
    MILITIA_POWER_FIST,
  ],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ════════════════════════════════════════════════════════════════
// DISCIPLINE MASTER
// Infantry (Command) — Command
// ════════════════════════════════════════════════════════════════

const MILITIA_DISCIPLINE_MASTER: Character = {
  id: 'militia-discipline-master',
  name: 'Discipline Master',
  faction: 'imperialis-militia',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 4, BS: 3, S: 3, T: 3, W: 2,
    I: 3, A: 2, LD: 8, CL: 8, WP: 7, IN: 6,
    Sv: 5, Inv: 5,
  },
  weapons: [
    MILITIA_CCW,
    MILITIA_POWER_SWORD,
    MILITIA_POWER_AXE,
    MILITIA_POWER_FIST,
  ],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// MOUNTED DISCIPLINE MASTER
// Cavalry (Command) — Command
// Gains Bulky(2) per mounted upgrade rules.
// ════════════════════════════════════════════════════════════════

const MILITIA_DISCIPLINE_MASTER_MOUNTED: Character = {
  id: 'militia-discipline-master-mounted',
  name: 'Discipline Master (Mounted)',
  faction: 'imperialis-militia',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 4, BS: 3, S: 3, T: 3, W: 2,
    I: 3, A: 2, LD: 8, CL: 8, WP: 7, IN: 6,
    Sv: 5, Inv: 5,
  },
  weapons: [
    MILITIA_CCW,
    MILITIA_POWER_SWORD,
    MILITIA_POWER_AXE,
    MILITIA_POWER_FIST,
  ],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ════════════════════════════════════════════════════════════════
// MILITIA LIEUTENANT
// Infantry (Command) — part of Command Troop
// ════════════════════════════════════════════════════════════════

const MILITIA_LIEUTENANT: Character = {
  id: 'militia-lieutenant',
  name: 'Militia Lieutenant',
  faction: 'imperialis-militia',
  type: 'infantry',
  subTypes: ['Command'],
  stats: {
    M: 6, WS: 4, BS: 4, S: 3, T: 3, W: 2,
    I: 3, A: 3, LD: 7, CL: 7, WP: 6, IN: 5,
    Sv: 4, Inv: null,
  },
  weapons: [
    MILITIA_CCW,
    CHARNABAL_SABRE,
    CHARNABAL_TABAR,
    MILITIA_POWER_SWORD,
    MILITIA_POWER_AXE,
    MILITIA_POWER_FIST,
  ],
  factionGambitIds: [],
  specialRules: [],
};

// ════════════════════════════════════════════════════════════════
// MILITIA LANCEMASTER
// Cavalry (Command) — part of Mounted Command Troop
// Gains Bulky(2).  Militia lance (AM=0, Impact only) omitted — no
// output in Challenge Sub-Phase.
// ════════════════════════════════════════════════════════════════

const MILITIA_LANCEMASTER: Character = {
  id: 'militia-lancemaster',
  name: 'Militia Lancemaster',
  faction: 'imperialis-militia',
  type: 'cavalry',
  subTypes: ['Command'],
  stats: {
    M: 12, WS: 4, BS: 3, S: 3, T: 3, W: 3,
    I: 3, A: 2, LD: 7, CL: 7, WP: 5, IN: 5,
    Sv: 5, Inv: null,
  },
  weapons: [
    MILITIA_CCW,
    MILITIA_POWER_SWORD,
    MILITIA_POWER_AXE,
    MILITIA_POWER_FIST,
  ],
  factionGambitIds: [],
  specialRules: [
    { name: 'Bulky', value: 2 },
  ],
};

// ── Combined export ───────────────────────────────────────────────────────────

export const MILITIA_CHARACTERS: Character[] = [
  // Infantry commanders
  MILITIA_FORCE_COMMANDER,
  MILITIA_DISCIPLINE_MASTER,
  MILITIA_LIEUTENANT,
  // Cavalry (mounted) variants
  MILITIA_FORCE_COMMANDER_MOUNTED,
  MILITIA_DISCIPLINE_MASTER_MOUNTED,
  MILITIA_LANCEMASTER,
];
