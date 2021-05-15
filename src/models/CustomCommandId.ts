import {
    prop,
    getModelForClass,
    ModelOptions,
    Severity
} from "@typegoose/typegoose";

export interface CommandVersionId {
    id: string;
    created_at: string;
    before: string | null;
    after: string | null;
}

@ModelOptions({
    schemaOptions: {
        collection: "commands",
        minimize: false
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class CustomCommandId {
    @prop()
    id!: string;

    @prop()
    draft_guild_id?: string;

    @prop()
    name!: string;

    @prop()
    summary!: string;

    @prop({ type: () => [String] })
    tags!: string[];

    @prop()
    thumbnail!: string;

    @prop()
    author_id!: string;

    @prop()
    private!: boolean;

    @prop()
    deleted!: boolean;

    @prop()
    versions!: Record<string, CommandVersionId>;

    @prop()
    latest!: string;

    @prop()
    first!: string;

    @prop()
    guild_count!: number;
}

export const CustomCommandIdModel = getModelForClass(CustomCommandId);
