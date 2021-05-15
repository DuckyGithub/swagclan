import { CustomCommandDriver, CustomCommandTypeName } from "../CustomCommandDriver";

export interface Stringifyable {
    toString(): string;
}

export abstract class CustomCommandType<T extends Stringifyable = any> {
    static typeName: CustomCommandTypeName;
    typeName: CustomCommandTypeName = CustomCommandTypeName.String;

    static parse(driver: CustomCommandDriver, input: string): CustomCommandType|null { return null; }
    static initial: any;

    constructor(public value: T) {}

    toString() {
        return this.toJSON();
    }

    serialize() {
        return this.value.toString();
    }

    toJSON() {
        return {
            typeName: this.typeName,
            value: this.serialize()
        };
    }
}

export interface CustomCommandTypeLike {
    typeName: string;
    initial: any;

    new(value: any): CustomCommandType;

    parse(driver: CustomCommandDriver, input: string): CustomCommandType|null;
}
