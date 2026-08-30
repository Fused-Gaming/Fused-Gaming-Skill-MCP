#!/usr/bin/env node
/**
 * Collects real code-quality metrics for @h4shed/mcp-core and writes
 * .quality-metrics.json for src/benchmark.ts to consume.
 *
 * This intentionally does NOT fabricate numbers: coverage comes from an
 * actual jest --coverage run, and complexity/duplication come from a real
 * (if simple, regex-based rather than AST-based) static scan of src/**\/*.ts.
 * The maintainability index is a documented approximation derived from the
 * other three measured values, not an independent measurement or a
 * hardcoded constant.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const srcDir = join(packageRoot, 'src');

function listSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...listSourceFiles(full));
    } else if (entry.endsWith('.ts') && !entry.endsWith('.d.ts')) {
      files.push(full);
    }
  }
  return files;
}

function measureCoverage() {
  try {
    execFileSync(
      'npx',
      ['jest', '--coverage', '--coverageReporters=json-summary', '--silent'],
      { cwd: packageRoot, stdio: 'inherit' }
    );
  } catch {
    // jest exits non-zero when the configured coverage threshold isn't met,
    // or when a suite fails — the coverage-summary.json is still written in
    // either case. Only the missing-file case below is fatal; a failing
    // threshold just means we honestly report the lower measured number.
  }
  const summary = JSON.parse(
    readFileSync(join(packageRoot, 'coverage', 'coverage-summary.json'), 'utf8')
  );
  return summary.total.statements.pct;
}

// Deliberately excludes bare `?` — in TypeScript it's overwhelmingly optional
// properties/parameters (`name?:`) and optional chaining (`?.`), not ternary
// branches, and including it produced wildly inflated false-positive counts.
const DECISION_POINT_PATTERN = /\b(if|for|while|case|catch)\b|&&|\|\|/g;

function measureComplexity(files) {
  const perFile = files.map((file) => {
    const source = readFileSync(file, 'utf8');
    const matches = source.match(DECISION_POINT_PATTERN) || [];
    // Cyclomatic complexity approximation: one path plus one per decision point.
    return 1 + matches.length;
  });
  const mean = perFile.reduce((a, b) => a + b, 0) / perFile.length;
  const max = Math.max(...perFile);
  return { mean, max };
}

// Boilerplate punctuation lines (`}`, `};`, `],`, ...) are near-universal and
// count as "duplicate" under any naive line-frequency check without being
// meaningful copy-paste duplication. Requiring a minimum line length keeps
// this a real (if still simple, line-based rather than block-based) signal.
const MIN_DUPLICATE_LINE_LENGTH = 20;

function measureDuplication(files) {
  const lineCounts = new Map();
  let totalLines = 0;
  for (const file of files) {
    const lines = readFileSync(file, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter(
        (l) => l.length >= MIN_DUPLICATE_LINE_LENGTH && !l.startsWith('//') && !l.startsWith('*')
      );
    for (const line of lines) {
      totalLines++;
      lineCounts.set(line, (lineCounts.get(line) || 0) + 1);
    }
  }
  let duplicateLines = 0;
  for (const count of lineCounts.values()) {
    if (count > 1) duplicateLines += count - 1;
  }
  return totalLines > 0 ? (duplicateLines / totalLines) * 100 : 0;
}

function approximateMaintainability(complexityMean, duplicationPercent, coveragePercent) {
  // Not a real Halstead-based Maintainability Index — a documented, honestly
  // derived approximation from the metrics we do measure: penalize high
  // complexity and duplication, reward measured test coverage.
  const raw = 100 - complexityMean * 4 - duplicationPercent * 2 + (coveragePercent - 70) * 0.2;
  return Math.max(0, Math.min(100, raw));
}

const files = listSourceFiles(srcDir);
const coverage = measureCoverage();
const complexity = measureComplexity(files);
const duplication = measureDuplication(files);
const maintainability = approximateMaintainability(complexity.mean, duplication, coverage);

const metrics = {
  complexity: { mean: Number(complexity.mean.toFixed(2)), max: complexity.max },
  duplication: Number(duplication.toFixed(2)),
  coverage: Number(coverage.toFixed(2)),
  maintainability: Number(maintainability.toFixed(2)),
  provenance: {
    source: 'packages/core/scripts/collect-quality-metrics.mjs (jest coverage + regex-based complexity/duplication scan)',
    measured: true,
  },
};

writeFileSync(join(packageRoot, '.quality-metrics.json'), JSON.stringify(metrics, null, 2));
console.log('Quality metrics written to .quality-metrics.json:');
console.log(JSON.stringify(metrics, null, 2));
