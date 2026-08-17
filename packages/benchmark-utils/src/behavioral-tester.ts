/**
 * Behavioral Test Suite Runner
 * Measures CORE, REGRESSION, FUNCTIONALITY, and ERROR test pass rates
 */

import { TestCategory, TestResult, TestSuiteResult } from './types.js';
import { wilsonInterval } from './statistics.js';

export class BehavioralTester {
  private results: TestSuiteResult[] = [];

  async runTestSuite(
    category: TestCategory,
    tests: Array<{
      name: string;
      fn: () => Promise<void> | void;
    }>,
    options?: { timeout?: number; minimumSamples?: number }
  ): Promise<TestSuiteResult> {
    const timeout = options?.timeout ?? 30000;
    const minimumSamples = options?.minimumSamples ?? 1;

    if (!Number.isFinite(timeout) || timeout <= 0) {
      throw new Error(`timeout must be a positive finite number, got ${timeout}`);
    }
    if (!Number.isInteger(minimumSamples) || minimumSamples < 1) {
      throw new Error(`minimumSamples must be a positive integer, got ${minimumSamples}`);
    }
    // Reject empty/undersized suites before any CI math runs on them — an
    // empty suite has no statistical meaning and must not silently score 0%.
    if (tests.length < minimumSamples) {
      throw new Error(
        `${category} requires at least ${minimumSamples} tests; received ${tests.length}`
      );
    }

    const testResults: TestResult[] = [];

    for (const test of tests) {
      const startTime = performance.now();
      let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

      try {
        const result = await Promise.race([
          Promise.resolve(test.fn()),
          new Promise<never>((_, reject) => {
            timeoutHandle = setTimeout(() => reject(new Error('Test timeout')), timeout);
          }),
        ]);

        // Tests must assert by throwing and resolve to undefined. A test
        // that returns `false` or any other truthy/falsy value instead of
        // throwing must not be able to silently register as a pass.
        if (result !== undefined) {
          throw new Error(
            'Behavioral tests must assert by throwing and return void; ' +
              `non-void return values are rejected (got ${JSON.stringify(result)})`
          );
        }

        testResults.push({
          name: test.name,
          passed: true,
          duration: performance.now() - startTime,
        });
      } catch (error) {
        testResults.push({
          name: test.name,
          passed: false,
          duration: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle);
      }
    }

    const passCount = testResults.filter((r) => r.passed).length;
    const totalCount = testResults.length;
    const passRate = (passCount / totalCount) * 100;

    const suiteResult: TestSuiteResult = {
      category,
      passCount,
      totalCount,
      passRate,
      confidenceInterval: wilsonInterval(passCount, totalCount),
      results: testResults,
      provenance: { source: 'BehavioralTester', schemaVersion: 1 },
    };

    this.results.push(suiteResult);
    return suiteResult;
  }

  getResults(): TestSuiteResult[] {
    return structuredClone(this.results);
  }

  getSummary(): {
    totalTests: number;
    totalPassed: number;
    overallPassRate: number;
    byCategory: Record<
      string,
      {
        passCount: number;
        totalCount: number;
        passRate: number;
        passed: boolean;
      }
    >;
  } {
    const summary = {
      totalTests: 0,
      totalPassed: 0,
      overallPassRate: 0,
      byCategory: {} as Record<
        string,
        {
          passCount: number;
          totalCount: number;
          passRate: number;
          passed: boolean;
        }
      >,
    };

    const categoryAggregates: Record<string, { passCount: number; totalCount: number }> = {};

    for (const suite of this.results) {
      summary.totalTests += suite.totalCount;
      summary.totalPassed += suite.passCount;

      if (!categoryAggregates[suite.category]) {
        categoryAggregates[suite.category] = { passCount: 0, totalCount: 0 };
      }
      categoryAggregates[suite.category].passCount += suite.passCount;
      categoryAggregates[suite.category].totalCount += suite.totalCount;
    }

    for (const [category, aggregate] of Object.entries(categoryAggregates)) {
      const passRate = aggregate.totalCount > 0 ? (aggregate.passCount / aggregate.totalCount) * 100 : 0;

      let threshold = 90;
      if (category === 'CORE') threshold = 95;
      if (category === 'REGRESSION') threshold = 100;
      if (category === 'FUNCTIONALITY') threshold = 80;
      if (category === 'ERROR') threshold = 90;

      summary.byCategory[category] = {
        passCount: aggregate.passCount,
        totalCount: aggregate.totalCount,
        passRate,
        passed: passRate >= threshold,
      };
    }

    summary.overallPassRate =
      summary.totalTests > 0 ? (summary.totalPassed / summary.totalTests) * 100 : 0;

    return summary;
  }
}
