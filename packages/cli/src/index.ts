#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import type { Argv, Arguments } from "yargs";

import { init } from "./init.js";
import { list } from "./list.js";
import { add } from "./add.js";
import { remove } from "./remove.js";

import { runBootSequence } from "./ui/boot.js";
import { showMainMenu } from "./ui/menu.js";
import { showSyncPulseDashboard } from "./ui/syncpulse.js";

async function runInteractive() {
  await runBootSequence();

  let running = true;

  while (running) {
    const action = await showMainMenu();

    switch (action) {
      case "🚀 Launch Server":
        console.log("Launching MCP server...");
        break;

      case "🧠 Manage Skills":
        await list();
        break;

      case "📊 SyncPulse Dashboard":
        showSyncPulseDashboard();
        break;

      case "❌ Exit":
        running = false;
        break;
    }

    if (running) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  console.log("👋 Goodbye");
}

async function launchSyncPulsePanel() {
  await runBootSequence();
  showSyncPulseDashboard();
}

// If no command provided → launch UI
if (hideBin(process.argv).length === 0) {
  runInteractive();
} else {
  yargs(hideBin(process.argv))
    .command("init", "Generate config", {}, async () => {
      await init();
    })
    .command("list", "List skills", {}, async () => {
      await list();
    })
    .command(
      "add <skill>",
      "Enable a skill",
      (yargs: Argv) =>
        yargs.positional("skill", {
          describe: "Skill name",
          type: "string",
        }),
      async (argv: Arguments) => {
        await add(argv.skill as string);
      }
    )
    .command(
      "panel",
      "Launch the SyncPulse panel directly",
      {},
      async () => {
        await launchSyncPulsePanel();
      }
    )
    .command(
      "syncpulse",
      "Alias for launching the SyncPulse panel",
      {},
      async () => {
        await launchSyncPulsePanel();
      }
    )
    .command(
      "remove <skill>",
      "Disable a skill",
      (yargs: Argv) =>
        yargs.positional("skill", {
          describe: "Skill name",
          type: "string",
        }),
      async (argv: Arguments) => {
        await remove(argv.skill as string);
      }
    )
    .parse();
}
