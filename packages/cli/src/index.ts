#!/usr/bin/env node

/**
 * Fused Gaming MCP CLI
 * Command-line interface for skill management
 */

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { init } from "./init.js";
import { list } from "./list.js";
import { add } from "./add.js";
import { remove } from "./remove.js";

yargs(hideBin(process.argv))
  .command(
    "init",
    "Generate .fused-gaming-mcp.json config file",
    {},
    async () => {
      await init();
    }
  )
  .command(
    "list",
    "List available and enabled skills",
    {},
    async () => {
      await list();
    }
  )
  .command(
    "add <skill>",
    "Enable a skill in the configuration",
    (yargs) =>
      yargs.positional("skill", {
        describe: "Skill name to enable",
        type: "string",
      }),
    async (argv) => {
      await add(argv.skill as string);
    }
  )
  .command(
    "remove <skill>",
    "Disable a skill in the configuration",
    (yargs) =>
      yargs.positional("skill", {
        describe: "Skill name to disable",
        type: "string",
      }),
    async (argv) => {
      await remove(argv.skill as string);
    }
  )
  .alias("h", "help")
  .alias("v", "version")
  .strictCommands()
  .demandCommand(1, "Please provide a command")
  .wrap(yargs.terminalWidth())
  .parse();
