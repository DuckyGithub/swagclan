import { CustomCommandDriver, CustomCommandTypeName } from "../CustomCommandDriver";
import { CustomCommandType } from "./Base";

export class CustomCommandStringType extends CustomCommandType<string> {
    static typeName = CustomCommandTypeName.String;
    typeName = CustomCommandTypeName.String;

    static initial = "" as const;

    static parse(driver: CustomCommandDriver, input: string) {
        return new CustomCommandStringType(input);
    }

    serialize() {
        return this.value;
    }
}
