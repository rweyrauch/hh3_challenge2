# Horus Heresy 3rd Edition Challenge Phase Simulator

## Overview

Create a web-based application that simulates the 'Challenge Sub-Phase' of the Horus Heresy 3rd Edition.  Complete rules for the Horus Heresy are located in the 'reference' directory.

The 'Challenge Sub-Phase' is a battle between two character units.  In this simulation, one player is controlled via the user interface.  The second player is controlled by an AI.

The core 'Challenge Sub-Phase' rules are located in reference/hh3_rules.md.  Units are described in the other documents in the reference directory.  Units belong to different 'Factions'.  Each of these factions may have their own 'Gambits' and 'Special Rules'.

The general work flow is:

1. Select and configure each character unit.
2. Start the simulation.
3. The player selects the 'Gambit' they wish to employ during that round of combat.
4. Execute the combat sequence.
5. The combat ends if a unit is defeated.  Otherwise, the player selects a new 'Gambit' and combat repeats until there is a winner.

## Requirements

1. Web-based.  Develop using Typescript and Bootstrap.
2. The web application must be deployable on Github.
3. Application must render correctly on desktop and mobile devices.
4. The Typescript code must be testable.  Write unit tests for key algorithms.
5. Provide a reasonable level of comments in the source code so that others maintain and understand the code.
6. Use npm to manage packages.
