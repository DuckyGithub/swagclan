import {
    prop,
    getModelForClass,
    ModelOptions,
    Severity
} from "@typegoose/typegoose";

export interface GuildCommandIdentifier {
    id: string;
    version: string;
}

export interface CustomCommandPermission {
    type: string;
    id: string;
    disallow: boolean;
}

export enum CustomCommandDriverErrorReason {

}

export interface CustomCommandRunError {
    version: string;
    position: string;
    reason: CustomCommandDriverErrorReason;
    snapshot: /*CustomCommandContext*/any;
}

@ModelOptions({
    schemaOptions: {
        collection: "guild_commands",
        minimize: false
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class GuildCommand {
    @prop()
    application_command_id!: string;

    @prop()
    guild_id!: string;

    @prop()
    command_id!: string;

    @prop()
    command_version!: string;

    @prop()
    enabled!: boolean;

    @prop()
    timeout!: number;

    @prop()
    config!: Record<string, any>;

    @prop()
    permissions!: CustomCommandPermission[];

    @prop()
    logs!: CustomCommandRunError[];
}

export const GuildCommandModel = getModelForClass(GuildCommand);
