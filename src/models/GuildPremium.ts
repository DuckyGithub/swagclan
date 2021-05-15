import {
    prop,
    getModelForClass,
    ModelOptions,
    Severity
} from "@typegoose/typegoose";

@ModelOptions({
    schemaOptions: {
        collection: "guild_premium",
        minimize: false
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class GuildPremium {
    @prop()
    guild_id!: string;

    @prop()
    started_at!: number;

    @prop()
    expires_at!: number;

    @prop()
    user_id!: string;
}

export const GuildPremiumModel = getModelForClass(GuildPremium);
