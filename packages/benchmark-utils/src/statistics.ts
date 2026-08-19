/**
 * Statistical helpers shared by BehavioralTester and DoDScorer.
 */

import type { ConfidenceInterval } from './types.js';

/**
 * Wilson score interval for a binomial proportion.
 *
 * Replaces the Wald interval previously used throughout this package. Wald
 * intervals are known to be overconfident at small sample sizes and at
 * proportions near 0% or 100% (e.g. 1/1 passing tests would previously
 * report a 100% lower bound, which is not a defensible claim). Wilson
 * intervals do not have this failure mode.
 */
export function wilsonInterval(
  successes: number,
  trials: number,
  confidence: 0.95 | 0.99 = 0.95
): ConfidenceInterval {
  if (
    !Number.isInteger(successes) ||
    !Number.isInteger(trials) ||
    successes < 0 ||
    trials <= 0 ||
    successes > trials
  ) {
    throw new Error(
      `Invalid binomial sample: successes=${successes}, trials=${trials}. ` +
        `Both must be non-negative integers with successes <= trials and trials > 0.`
    );
  }

  const z = confidence === 0.99 ? 2.576 : 1.96;
  const p = successes / trials;
  const z2 = z * z;
  const denom = 1 + z2 / trials;
  const center = (p + z2 / (2 * trials)) / denom;
  const half =
    (z / denom) * Math.sqrt((p * (1 - p)) / trials + z2 / (4 * trials * trials));
  const standardError = Math.sqrt((p * (1 - p)) / trials);

  return {
    lowerBound: Math.max(0, (center - half) * 100),
    upperBound: Math.min(100, (center + half) * 100),
    standardError: standardError * 100,
    confidence,
    method: 'wilson',
  };
}
