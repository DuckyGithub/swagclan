import {
    prop,
    getModelForClass,
    ModelOptions,
    Severity
} from "@typegoose/typegoose";

export const CustomCommandFieldTypes = ["ctx", "action_ref", "input"] as const;

export interface CustomCommandParam {
    name: string;
    description: string;
    type: string;
    required: boolean;
}

export interface CustomCommandVariable {
    name: string;
    type: string;
}

export interface CustomCommandField {
    type: string;
    id: string;
}

export interface CustomCommandAction {
    type: string;
    rule: string;
    parent?: string;
    next?: string;
    fields: Record<string, CustomCommandField>;
}

export interface CustomCommandConfigDeclaration {
    name: string;
    description: string;
    type: string;
    initial?: any;
}

@ModelOptions({
    schemaOptions: {
        collection: "versions",
        minimize: false
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class CustomCommandVersion {
    @prop()
    command_id!: string;

    @prop()
    version!: string;

    @prop()
    trigger!: string;

    @prop()
    config!: Record<string, CustomCommandConfigDeclaration>;

    @prop()
    params!: CustomCommandParam[];

    @prop()
    variables!: Record<string, CustomCommandVariable>;

    @prop()
    actions!: Record<string, CustomCommandAction>;

    @prop()
    first!: string;
}

export const CustomCommandVersionModel = getModelForClass(CustomCommandVersion);
