import { CustomCommandDriver, CustomCommandTypeName } from "../CustomCommandDriver";
import { CustomCommandType } from "./Base";

export class CustomCommandBooleanType extends CustomCommandType<boolean> {
    static TRUES = ["true", "yes", "on"];
    static FALSES = ["false", "no", "off"];

    static typeName = CustomCommandTypeName.Boolean;
    typeName = CustomCommandTypeName.Boolean;

    static parse(driver: CustomCommandDriver, input: string) {
        if (this.TRUES.includes(input))
            return new CustomCommandBooleanType(true);

        if (this.FALSES.includes(input))
            return new CustomCommandBooleanType(false);

        return null;
    }
}
