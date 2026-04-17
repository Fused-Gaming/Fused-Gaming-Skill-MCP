import chalk from "chalk";
import boxen from "boxen";

export function showSyncPulseDashboard() {
  const content = `
${chalk.cyan("Session ID:")} 174839292
${chalk.green("Status:")} active
${chalk.yellow("Tasks:")} 5 (2 running)

${chalk.magenta("Cache Entries:")} 12
${chalk.red("Expiring Soon:")} 3
`;

  console.log(
    boxen(content, {
      padding: 1,
      borderColor: "cyan",
      borderStyle: "round",
    })
  );
}
