/**
 * Dice abstraction layer.
 *
 * All engine functions receive a DiceRoller instance rather than calling
 * Math.random() directly.  This makes the engine 100 % deterministic in
 * tests by substituting FakeDiceRoller with a pre-seeded sequence.
 */
export interface DiceRoller {
  /** Roll one six-sided die, returning 1–6. */
  rollD6(): number;
  /** Roll one three-sided die, returning 1–3. */
  rollD3(): number;
  /** Roll N six-sided dice, returning each result as an array. */
  rollNd6(n: number): number[];
}

/** Production implementation that uses the JavaScript PRNG. */
export class RealDiceRoller implements DiceRoller {
  rollD6(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
  rollD3(): number {
    return Math.floor(Math.random() * 3) + 1;
  }
  rollNd6(n: number): number[] {
    return Array.from({ length: n }, () => this.rollD6());
  }
}

/**
 * Test-only implementation that replays a fixed sequence of numbers.
 * Throws if the sequence is exhausted before the test completes.
 */
export class FakeDiceRoller implements DiceRoller {
  private sequence: number[];
  private index = 0;

  constructor(sequence: number[]) {
    this.sequence = sequence;
  }

  /** Consume and return the next value in the sequence. */
  private next(): number {
    if (this.index >= this.sequence.length) {
      throw new Error(
        `FakeDiceRoller: sequence exhausted at index ${this.index}. ` +
        `Provide a longer sequence.`
      );
    }
    return this.sequence[this.index++];
  }

  rollD6(): number {
    return this.next();
  }

  rollD3(): number {
    // Map the raw value to a 1-3 range the same way a real D3 works.
    const raw = this.next();
    return Math.min(3, Math.ceil(raw / 2));
  }

  rollNd6(n: number): number[] {
    return Array.from({ length: n }, () => this.next());
  }

  /** How many values remain in the sequence. */
  get remaining(): number {
    return this.sequence.length - this.index;
  }
}
