import ora from "ora";
import chalk from "chalk";
import gradient from "gradient-string";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function runBootSequence() {
  console.clear();

  console.log(gradient.instagram("\nInitializing Fused Gaming MCP...\n"));

  const steps = [
    "Loading core systems",
    "Initializing skill registry",
    "Connecting SyncPulse",
    "Hydrating cache state",
    "Starting orchestration engine",
  ];

  for (const step of steps) {
    const spinner = ora({ text: chalk.cyan(step), spinner: "dots" }).start();
    await sleep(500 + Math.random() * 500);
    spinner.succeed(chalk.green(step));
  }

  console.log(gradient.pastel("\n✔ System Ready\n"));
}
