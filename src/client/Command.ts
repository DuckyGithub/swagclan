import crypto from "crypto";

import { ApplicationCommandOptionType } from "@wilsonjs/constants";
import {
    BasicApplicationCommandOption,
    CreateGlobalApplicationCommandRequest
} from "@wilsonjs/models";

export class CommandReplyInterface {

}

export interface BotCommandParams {
    name: string;
    description: string;
    required: boolean;
}

export interface BotCommandOptions {
    name: string;
    trigger: string;
    description: string;
    params: BotCommandParams[];

    exec(this: CommandReplyInterface): Promise<void>;
}

export class BotCommand {
    name: string;
    trigger: string;
    description: string;
    params: BotCommandParams[];

    static createHash<T extends CreateGlobalApplicationCommandRequest>(command: T) {
        const json = JSON.stringify({
            name: command.name || "",
            description: command.description || "",
            options: command.options || []
        });

        return crypto.createHash("md5").update(json).digest("hex");
    }

    constructor(info: BotCommandOptions) {
        this.name = info.name;
        this.trigger = info.trigger;
        this.description = info.description;
        this.params = info.params;
    }

    createDiscordApplicationCommand(): CreateGlobalApplicationCommandRequest {
        return {
            name: this.trigger,
            description: this.description.slice(0, 100),
            options: this.params.map((param) => {
                const option: BasicApplicationCommandOption = {
                    name: param.name,
                    description: param.description,
                    required: param.required,
                    type: ApplicationCommandOptionType.String
                };

                return option;
            })
        };
    }

    createHash() {
        return BotCommand.createHash(this.createDiscordApplicationCommand());
    }
}
