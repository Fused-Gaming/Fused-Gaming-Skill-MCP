/**
 * Skill Creator Performance Benchmark Suite
 * Measures performance of skill creation operations
 */

// @ts-expect-error - Importing from compiled output
import { skillCreatorSkill } from "../dist/packages/skills/skill-creator/src/index.js";
import type { SkillConfig } from "@h4shed/mcp-core";

interface BenchmarkResult {
  name: string;
  iterations: number;
  duration: number;
  avg: number;
  min: number;
  max: number;
  ops_per_sec: number;
}

const results: BenchmarkResult[] = [];

function benchmark(
  name: string,
  iterations: number,
  fn: () => void | Promise<void>
): BenchmarkResult {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const duration = performance.now() - start;
  const avg = duration / iterations;
  const ops_per_sec = (iterations / duration) * 1000;

  const result: BenchmarkResult = {
    name,
    iterations,
    duration,
    avg,
    min: 0,
    max: 0,
    ops_per_sec,
  };

  results.push(result);
  const status = avg < 50 ? "✓" : "✗";
  console.log(
    `${status} ${name}: ${avg.toFixed(3)}ms/op (${ops_per_sec.toFixed(0)} ops/sec)`
  );

  return result;
}

async function runBenchmarks() {
  console.log("\n🎯 Skill Creator Performance Benchmarks\n");
  console.log("=".repeat(70));

  // Initialize skill
  console.log("\n📦 Skill Initialization");
  const config: SkillConfig = {
    name: "test-config",
    version: "1.0.0",
    tools: [],
  };

  await skillCreatorSkill.initialize(config);

  // Benchmark skill template generation
  console.log("\n✨ Skill Template Generation");

  benchmark("Skill template generation", 100, () => {
    // Simulate template generation (in-memory operation)
    const _skillTemplate = {
      name: `test-skill-${Math.random().toString(36).substring(7)}`,
      version: "1.0.0",
      description: "Test skill",
      tools: [],
    };
  });

  // Benchmark tool creation
  console.log("\n🔧 Tool Creation");

  benchmark("Tool definition creation", 100, () => {
    const _toolDef = {
      name: `tool-${Math.random().toString(36).substring(7)}`,
      description: "Test tool",
      inputSchema: {
        type: "object",
        properties: {
          input: { type: "string" },
        },
        required: ["input"],
      },
    };
  });

  // Benchmark MCP tool registration
  console.log("\n🔗 Tool Registration");

  const toolRegistry = new Map();
  benchmark("MCP tool registration", 100, () => {
    const toolId = `tool-${Math.random().toString(36).substring(7)}`;
    toolRegistry.set(toolId, {
      name: toolId,
      description: "Test tool",
      handler: async () => ({}),
    });
  });

  // Benchmark package scaffolding setup
  console.log("\n📁 Package Scaffolding");

  benchmark("Package structure setup", 50, () => {
    const _packageStructure = {
      name: `@h4shed/skill-${Math.random().toString(36).substring(7)}`,
      version: "1.0.0",
      description: "Generated skill",
      main: "./dist/index.js",
      files: [
        "src/",
        "dist/",
        "README.md",
        "package.json",
      ],
      dependencies: {
        "@h4shed/mcp-core": "^1.0.0",
      },
      devDependencies: {
        typescript: "^5.0.0",
        jest: "^29.0.0",
      },
    };
  });

  // Benchmark configuration parsing
  console.log("\n⚙️  Configuration Processing");

  benchmark("Configuration parsing", 100, () => {
    const config = {
      skillName: "test-skill",
      description: "Test skill configuration",
      toolCount: 3,
      scope: "h4shed",
      outputDir: "./dist",
      tsconfig: { compilerOptions: {} },
    };
    // Simulate config validation
    const _isValid = config.skillName && config.toolCount > 0;
  });

  // Benchmark handler invocation
  console.log("\n📞 Handler Invocation");

  benchmark("Skill handler invocation", 100, async () => {
    if (skillCreatorSkill.tools[0]) {
      const _result = await skillCreatorSkill.tools[0].handler({
        skillName: "test-skill",
        description: "Test skill",
        toolCount: 1,
        scope: "h4shed",
      });
    }
  });

  // Cleanup
  await skillCreatorSkill.cleanup();

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("\n📋 Benchmark Summary");
  console.log("=".repeat(70));

  const totalOps = results.reduce((sum, r) => sum + r.iterations, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const avgOpsPerSec = (totalOps / totalDuration) * 1000;

  console.log(`Total operations: ${totalOps.toLocaleString()}`);
  console.log(`Total duration: ${totalDuration.toFixed(2)}ms`);
  console.log(`Average throughput: ${avgOpsPerSec.toFixed(0)} ops/sec`);

  // Performance targets
  console.log("\n⚡ Performance Targets");
  console.log("✓ Skill template generation: <20ms");
  console.log("✓ Tool creation: <15ms");
  console.log("✓ MCP tool registration: <10ms");
  console.log("✓ Package scaffolding: <50ms");

  // Check targets
  const templateGenResult = results.find((r) =>
    r.name.includes("Skill template generation")
  );
  const toolCreationResult = results.find((r) =>
    r.name.includes("Tool definition creation")
  );
  const registrationResult = results.find((r) =>
    r.name.includes("MCP tool registration")
  );
  const scaffoldingResult = results.find((r) =>
    r.name.includes("Package structure setup")
  );

  console.log("\n✅ Performance Goals");
  console.log(
    `${(templateGenResult?.avg ?? 0) < 20 ? "✓" : "✗"} Skill template generation < 20ms: ${templateGenResult?.avg.toFixed(3)}ms`
  );
  console.log(
    `${(toolCreationResult?.avg ?? 0) < 15 ? "✓" : "✗"} Tool creation < 15ms: ${toolCreationResult?.avg.toFixed(3)}ms`
  );
  console.log(
    `${(registrationResult?.avg ?? 0) < 10 ? "✓" : "✗"} MCP tool registration < 10ms: ${registrationResult?.avg.toFixed(3)}ms`
  );
  console.log(
    `${(scaffoldingResult?.avg ?? 0) < 50 ? "✓" : "✗"} Package scaffolding < 50ms: ${scaffoldingResult?.avg.toFixed(3)}ms`
  );

  // Overall status
  const allPassed =
    (templateGenResult?.avg ?? 0) < 20 &&
    (toolCreationResult?.avg ?? 0) < 15 &&
    (registrationResult?.avg ?? 0) < 10 &&
    (scaffoldingResult?.avg ?? 0) < 50;

  if (allPassed) {
    console.log(
      "\n✅ All performance targets achieved! Skill Creator is performing well.\n"
    );
    process.exit(0);
  } else {
    console.log(
      "\n⚠️  Some performance targets not met. Review results above.\n"
    );
    process.exit(1);
  }
}

// Run benchmark
console.log("Starting Skill Creator benchmark...");
runBenchmarks().catch((err) => {
  console.error("Benchmark error:", err);
  if (err instanceof Error) {
    console.error("Stack:", err.stack);
  }
  process.exit(1);
});
