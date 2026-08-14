/**
 * Behavioral Test Suite Runner
 * Measures CORE, REGRESSION, FUNCTIONALITY, and ERROR test pass rates
 */

import { TestResult, TestSuiteResult, ConfidenceInterval } from './types.js';

export class BehavioralTester {
  private results: TestSuiteResult[] = [];

  async runTestSuite(
    category: 'CORE' | 'REGRESSION' | 'FUNCTIONALITY' | 'ERROR',
    tests: Array<{
      name: string;
      fn: () => Promise<void>;
    }>,
    options?: { timeout?: number }
  ): Promise<TestSuiteResult> {
    const timeout = options?.timeout || 30000;
    const testResults: TestResult[] = [];

    for (const test of tests) {
      const startTime = performance.now();
      let timeoutHandle: NodeJS.Timeout | null = null;

      try {
        await Promise.race([
          test.fn(),
          new Promise<never>((_, reject) => {
            timeoutHandle = setTimeout(() => reject(new Error('Test timeout')), timeout);
          }),
        ]);

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
    const passRate = totalCount > 0 ? (passCount / totalCount) * 100 : 0;

    const suiteResult: TestSuiteResult = {
      category,
      passCount,
      totalCount,
      passRate,
      confidenceInterval: this.calculateConfidenceInterval(passRate, totalCount),
      results: testResults,
    };

    this.results.push(suiteResult);
    return suiteResult;
  }

  private calculateConfidenceInterval(
    passRate: number,
    sampleSize: number,
    confidence = 0.95
  ): ConfidenceInterval {
    const p = passRate / 100;
    const z = confidence === 0.95 ? 1.96 : 2.576; // Z-score for 95% and 99% CI

    const standardError = Math.sqrt((p * (1 - p)) / sampleSize);
    const margin = z * standardError;

    return {
      lowerBound: Math.max(0, (p - margin) * 100),
      upperBound: Math.min(100, (p + margin) * 100),
      standardError: standardError * 100,
      confidence,
    };
  }

  getResults(): TestSuiteResult[] {
    return this.results;
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

    // Aggregate multiple suites in the same category
    const categoryAggregates: Record<string, { passCount: number; totalCount: number }> = {};

    for (const suite of this.results) {
      summary.totalTests += suite.totalCount;
      summary.totalPassed += suite.passCount;

      // Combine suites in the same category
      if (!categoryAggregates[suite.category]) {
        categoryAggregates[suite.category] = { passCount: 0, totalCount: 0 };
      }
      categoryAggregates[suite.category].passCount += suite.passCount;
      categoryAggregates[suite.category].totalCount += suite.totalCount;
    }

    // Calculate category pass rates from aggregated counts
    for (const [category, aggregate] of Object.entries(categoryAggregates)) {
      const passRate = aggregate.totalCount > 0 ? (aggregate.passCount / aggregate.totalCount) * 100 : 0;

      // Determine if category passed based on DoD thresholds
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
