import { CustomCommandDriver, CustomCommandTypeName } from "../CustomCommandDriver";
import { CustomCommandType } from "./Base";

export class CustomCommandNumberType extends CustomCommandType<number> {
    static typeName = CustomCommandTypeName.Number;
    typeName = CustomCommandTypeName.Number;

    static parse(driver: CustomCommandDriver, input: string) {
        const num = +input;

        if (isNaN(num) || !isFinite(num))
            return null;

        return new CustomCommandNumberType(num || 0);
    }
}
