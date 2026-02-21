/**
 * About Screen — usage guide and project information.
 */

export function mountAboutScreen(
  container: HTMLElement,
  onBack: () => void,
): void {
  container.innerHTML = buildHTML();
  container.querySelectorAll('#about-back-btn').forEach(btn =>
    btn.addEventListener('click', onBack),
  );
}

function buildHTML(): string {
  return `
    <div class="container py-4" style="max-width: 800px;">

      <div class="d-flex align-items-center mb-4 gap-3">
        <button id="about-back-btn" class="btn btn-outline-secondary btn-sm">← Back</button>
        <h1 class="display-6 fw-bold mb-0">⚔ About &amp; How to Play</h1>
      </div>

      <!-- What is this? -->
      <div class="card bg-dark border-secondary mb-4">
        <div class="card-header fw-bold text-warning">What is this?</div>
        <div class="card-body">
          <p>
            This is a browser-based simulator for the <strong>Challenge Sub-Phase</strong>
            from <em>Warhammer: The Horus Heresy — Age of Darkness</em> (3rd Edition).
            It lets you pit two characters against each other in a 1v1 duel, with a
            heuristic AI controlling your opponent.
          </p>
          <p class="mb-0">
            Over 50 characters are available across nine Space Marine Legions (loyalist
            and traitor), the Legio Custodes, Divisio Assassinorum, Mechanicum, Daemons
            of the Ruinstorm, Imperialis Militia, and Orks.
          </p>
        </div>
      </div>

      <!-- How to play -->
      <div class="card bg-dark border-secondary mb-4">
        <div class="card-header fw-bold text-info">How to Play</div>
        <div class="card-body">

          <h6 class="text-warning mb-2">1 — Select Characters</h6>
          <p>
            Use the <strong>filter bar</strong> to narrow the roster
            (<em>All</em>, <em>Primarchs only</em>, or <em>Legion Astartes only</em>),
            then choose your warrior and the AI's warrior from the dropdowns.
            Select the starting weapon for your warrior if more than one is available.
          </p>

          <h6 class="text-warning mb-2">2 — Begin or Simulate</h6>
          <p>
            <strong>⚔ Begin Challenge</strong> starts a live match immediately.<br>
            <strong>📊 Simulate</strong> runs 500 automated challenges for every
            opening Gambit available to your warrior, then shows a ranked table of
            results. Click <em>Play with best Gambit</em> to start a real match with
            the top-ranked Gambit pre-highlighted.
          </p>

          <h6 class="text-warning mb-2">3 — Face-Off (every round)</h6>
          <p>
            Choose a <strong>Gambit</strong> from the button grid. Each Gambit modifies
            how the round plays out — some improve your Focus roll, others add attacks,
            grant defensive bonuses, or generate extra Combat Resolution Points (CRP).
            The AI picks its Gambit automatically. Hover any button to read the full
            Gambit description.
          </p>

          <h6 class="text-warning mb-2">4 — Focus (automatic)</h6>
          <p>
            Both sides roll for <strong>Challenge Advantage</strong> — the holder
            attacks first. Your weapon was chosen at the start; the AI picks its own.
            Gambits such as <em>Seize the Initiative</em>, <em>Test the Foe</em>, and
            <em>Guard Up</em> apply here.
          </p>

          <h6 class="text-warning mb-2">5 — Strike (automatic)</h6>
          <p>
            Attacks are resolved in full: Hit → Wound → Armour/Invulnerable Save →
            Damage. The Advantage holder strikes first. Special rules (Rending,
            Poisoned, Feel No Pain, Eternal Warrior, etc.) are applied automatically.
            Watch the <strong>combat log</strong> at the bottom for a blow-by-blow
            account of every roll.
          </p>

          <h6 class="text-warning mb-2">6 — Glory</h6>
          <p>
            CRP are awarded based on wounds inflicted, casualties, and active Gambits.
            If both warriors survive you can choose to <strong>Continue</strong> into
            the next round or <strong>End</strong> the Challenge. A warrior with the
            <em>Withdraw</em> Gambit may also exit at zero CRP cost.
          </p>

          <h6 class="text-warning mb-2">7 — Result</h6>
          <p class="mb-0">
            The Challenge ends when a warrior is slain or the players end it. The side
            with the higher CRP total wins. From the result screen you can
            <strong>Rematch</strong> with the same characters or pick new ones.
          </p>
        </div>
      </div>

      <!-- Gambits quick reference -->
      <div class="card bg-dark border-secondary mb-4">
        <div class="card-header fw-bold text-info">Core Gambits — Quick Reference</div>
        <div class="card-body p-0">
          <table class="table table-dark table-sm mb-0">
            <thead class="table-secondary">
              <tr><th>Gambit</th><th>Effect summary</th></tr>
            </thead>
            <tbody>
              <tr><td>Seize the Initiative</td><td>Bonus to your Focus roll</td></tr>
              <tr><td>Flurry of Blows</td><td>Extra attacks in the Strike phase</td></tr>
              <tr><td>Test the Foe</td><td>Carry your Focus advantage into the next round</td></tr>
              <tr><td>Guard Up</td><td>Missed attacks convert to a Focus bonus next round</td></tr>
              <tr><td>Taunt and Bait</td><td>Bonus CRP if you win, penalty if you lose</td></tr>
              <tr><td>Grandstand</td><td>CRP bonus from observers — negligible in a 1v1 duel</td></tr>
              <tr><td>Feint and Riposte</td><td>First-mover only: ban one enemy Gambit for this round</td></tr>
              <tr><td>Withdraw</td><td>Exit the Challenge at the end of this round with 0 CRP penalty</td></tr>
              <tr><td>Finishing Blow</td><td>Bonus CRP if you slay the opponent this round</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Source & links -->
      <div class="card bg-dark border-secondary mb-4">
        <div class="card-header fw-bold text-info">Source Code</div>
        <div class="card-body">
          <p class="mb-1">
            This project is open source. View the code, report issues, or contribute on GitHub:
          </p>
          <a href="https://github.com/rweyrauch/hh3_challenge2"
             target="_blank" rel="noopener noreferrer"
             class="btn btn-outline-light btn-sm">
            github.com/rweyrauch/hh3_challenge2
          </a>
        </div>
      </div>

      <!-- Disclaimer -->
      <div class="text-muted small text-center mt-2">
        <p class="mb-0">
          Fan-made simulator for personal and educational use.
          <em>Warhammer: The Horus Heresy</em> and all related names are trademarks of
          Games Workshop Ltd. This project is not affiliated with or endorsed by
          Games Workshop.
        </p>
      </div>

      <div class="text-center mt-4">
        <button id="about-back-btn" class="btn btn-outline-secondary">← Back to Selection</button>
      </div>
    </div>
  `;
}
