import { Role } from "@wilsonjs/client";
import { CustomCommandDriver, CustomCommandTypeName } from "../CustomCommandDriver";
import { CustomCommandType } from "./Base";

export class CustomCommandRoleType extends CustomCommandType<Role> {
    static typeName = CustomCommandTypeName.Role;
    typeName = CustomCommandTypeName.Role;

    static parse(driver: CustomCommandDriver, input: string) {
        const id = /^(<&)?(?<roleId>\d+)>?$/.exec(input);

        if (!id || !id.groups)
            return null;

        const role = driver.guild.roles.resolve(id.groups.roleId);

        if (!role)
            return null;

        return new CustomCommandRoleType(role);
    }

    serialize() {
        return "<&" + this.value.id + ">";
    }
}
