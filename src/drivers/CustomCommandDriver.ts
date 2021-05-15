import Emittery from "emittery";

import {
    ApplicationCommandInteractionDataOption,
    BasicApplicationCommandOption,
    BasicChannel,
    BasicGuild,
    BasicGuildMember,
    BasicMessage,
    BasicRole,
    CreateGlobalApplicationCommandRequest
} from "@wilsonjs/models";

import { ApplicationCommandOptionType } from "@wilsonjs/constants";
import { TextChannel, RichEmbed, Guild } from "@wilsonjs/client";


import { CustomCommandId } from "src/models/CustomCommandId";
import { CustomCommandAction, CustomCommandVersion } from "src/models/CustomCommandVersion";
import { CustomCommandDriverErrorReason, GuildCommand } from "src/models/GuildCommand";
/*
import {
    CustomCommandBooleanType,
    CustomCommandNumberType,
    CustomCommandStringType,
    CustomCommandTypeLike,
    CustomCommandMemberType,
    CustomCommandChannelType,
    CustomCommandRoleType,
    CustomCommandType
} from "./types";

export type Sendable = string|RichEmbed;

export interface CustomCommandDriverEvents {
    error: {
        position: CustomCommandAction;
        reason: CustomCommandDriverErrorReason;
    };
    sendMessage: {
        channel: TextChannel;
        content: Sendable;
    };
}

export class ActionError {
    constructor(position: CustomCommandAction, reason: CustomCommandDriverErrorReason) {

    }
}

export class CustomCommandAdaptor<T = {}> extends Emittery<T> {
    errors: ActionError[];

    constructor(public readonly driver: CustomCommandDriver) {
        super();

        this.driver.on("error", ({ position, reason }) => {

        });

        this.errors = [];
    }
}

export class DiscordCustomCommandAdaptor extends CustomCommandAdaptor {
    constructor(driver: CustomCommandDriver, interaction: any, guild: Guild, channel: TextChannel) {
        super(driver);

        this.driver.on("sendMessage", ({ channel, content }) => {
            if (typeof content === "string") {
                interaction.reply(content);
            } else {
                interaction.reply({ embed: content });
            }
        });
    }
}

export interface DummyAdaptorEvents {
    messageCreate: {

    }
}

export class DummyCustomCommandAdaptor extends CustomCommandAdaptor<DummyAdaptorEvents> {
    messages: BasicMessage[];

    constructor(driver: CustomCommandDriver, public readonly guild: BasicGuild, public readonly channel: BasicChannel, public readonly channels: BasicChannel[], public readonly roles: BasicRole[], public readonly members: BasicGuildMember[]) {
        super(driver);

        this.messages = [];
    }
}

export interface CustomCommandContext {
    variables: Record<string, CustomCommandType>;
    args: Record<string, CustomCommandType>;
    config: Record<string, CustomCommandType>;
}

export enum CustomCommandTypeName {
    String = "string",
    Boolean = "boolean",
    Number = "number",
    Member = "member",
    Channel = "channel",
    Role = "role"
}*/

export class CustomCommandDriver/* extends Emittery<CustomCommandDriverEvents> */{
    static createDiscordInteraction(
        id: CustomCommandId,
        version: CustomCommandVersion
    ): CreateGlobalApplicationCommandRequest {
        return {
            name: version.trigger,
            description: id.summary.slice(0, 100),
            options: version.params.map((param) => {
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
    /*
    static types: Record<CustomCommandTypeName, CustomCommandTypeLike> = {
        [CustomCommandTypeName.String]: CustomCommandStringType,
        [CustomCommandTypeName.Boolean]: CustomCommandBooleanType,
        [CustomCommandTypeName.Number]: CustomCommandNumberType,
        [CustomCommandTypeName.Member]: CustomCommandMemberType,
        [CustomCommandTypeName.Channel]: CustomCommandChannelType,
        [CustomCommandTypeName.Role]: CustomCommandRoleType
    } as const;

    ctx: CustomCommandContext;
*/
    constructor(public readonly guild: Guild, public readonly channel: TextChannel, args: ApplicationCommandInteractionDataOption[], public readonly cmdv: CustomCommandVersion, public readonly gcmd: GuildCommand) {
        /*super();

        this.ctx = this.createContext(args);*/
    }
/*
    private _createContext(): CustomCommandContext {
        return {
            config: {},
            variables: {},
            args: {}
        };
    }

    createContext(args: ApplicationCommandInteractionDataOption[]): CustomCommandContext {
        const ctx = this._createContext();

        const configEntries = Object.entries(this.cmdv.config);
        const variableEntries = Object.entries(this.cmdv.variables);

        for (const [ key, decl ] of configEntries) {
            const type = CustomCommandDriver.types[decl.type];
            const value = this.gcmd.config[key];

            if (!type)
                continue;

            if (typeof value === "undefined") {
                const parsed = type.parse(this, type.initial) as any;

                if (!parsed)
                    throw new TypeError("");

                ctx.config[key] = parsed;
                continue;
            }

            // ctx.config[key] = type.parse(this, value);
        }

        for (const [ key, decl ] of variableEntries) {
            ctx.variables[key] = CustomCommandDriver.types[decl.type].initial;
        }

        for (const arg of args) {
            arg.name;
            const param = this.cmdv.params.find(param => param.name === arg.name);

            if (!param)
                continue;

            const type = CustomCommandDriver.types[param.type];

            if (!type)
                continue;

            // ctx.args[param.name] = type.parse(this, arg.value);
        }

        return ctx;
    }


    createSnapshot() {
        const newContext = this._createContext();

        const configEntries = Object.entries(this.ctx.config);
        const variableEntries = Object.entries(this.ctx.variables);
        const argsEntries = Object.entries(this.ctx.args);

        for (const [ key, val ] of configEntries) {
            /*const decl =

            const type = CustomCommandDriver.types[val];
            const value = this.gcmd.config[key];

            if (!type)
                continue;

            if (typeof value === "undefined") {
                ctx.config[key] = type.parse(this, type.initial);
                continue;
            }

            ctx.config[key] = type.parse(this, value);/
        }
    }

    getTop() {
        return this.cmdv.actions[this.cmdv.first];
    }

    checkIfWillReply() {

    }
    */
}
