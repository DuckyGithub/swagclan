import fs from "fs/promises";
import path from "path";

import { ApiEndpoints } from "@wilsonjs/constants";

import {
    BulkOverwriteGlobalApplicationCommandsResponse,
    BulkOverwriteGuildApplicationCommandsResponse
} from "@wilsonjs/models";

import { SwagclanApp } from "../application";

import { BotCommand } from "../client/Command";

export class SpawnApplication extends SwagclanApp {
    constructor() {
        super("spawner");
    }

    async getCommands() {
        const cmdFiles = await fs.readdir(path.resolve(__dirname, "./commands"));
        const commands: BotCommand[] = [];

        for (const cmdFile of cmdFiles) {
            const { default: command } = await import(path.resolve(__dirname, "./commands", cmdFile)) as { default: BotCommand };

            commands.push(command);
        }

        return commands;
    }

    async start() {
        await super.start();

        this.logger.info("Fetching registered application commands..");

        const local_cmds = await this.getCommands();

        if (this.config.dev_guild) {
            const commands = await this.make<BulkOverwriteGuildApplicationCommandsResponse>(
                "PUT",
                ApiEndpoints.BulkOverwriteGuildApplicationCommands,
                {
                    body: JSON.stringify(
                        local_cmds.map(cmd => cmd.createDiscordApplicationCommand())
                    ),
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                process.env.CLIENT_ID,
                this.config.dev_guild
            );

            this.logger.info(commands + " command" + (commands.length === 1 ? "" : "s") + " were registered to guild with ID " + this.config.dev_guild + ".");
        } else {
            const commands = await this.make<BulkOverwriteGlobalApplicationCommandsResponse>(
                "PUT",
                ApiEndpoints.BulkOverwriteGlobalApplicationCommands,
                {
                    body: JSON.stringify(
                        local_cmds.map(cmd => cmd.createDiscordApplicationCommand())
                    ),
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                process.env.CLIENT_ID
            );

            this.logger.info(commands + " command" + (commands.length === 1 ? "" : "s") + " were registered.");
        }
    }
}
