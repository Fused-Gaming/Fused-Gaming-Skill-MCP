import figlet from "figlet";
import gradient from "gradient-string";
import inquirer from "inquirer";
import chalk from "chalk";

export async function showMainMenu() {
  console.clear();

  const logo = figlet.textSync("FUSED MCP", { horizontalLayout: "full" });
  console.log(gradient.retro.multiline(logo));

  console.log(chalk.gray("AI-Powered Skill Operating System\n"));

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Select an option:",
      choices: [
        "🚀 Launch Server",
        "🧠 Manage Skills",
        "📊 SyncPulse Dashboard",
        "❌ Exit",
      ],
    },
  ]);

  return action;
}
