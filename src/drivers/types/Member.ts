import { GuildMember } from "@wilsonjs/client";
import { CustomCommandDriver, CustomCommandTypeName } from "../CustomCommandDriver";
import { CustomCommandType } from "./Base";

export class CustomCommandMemberType extends CustomCommandType<GuildMember> {
    static typeName = CustomCommandTypeName.Member;
    typeName = CustomCommandTypeName.Member;

    static parse(driver: CustomCommandDriver, input: string) {
        const id = /^(<&)?(?<memberId>\d+)>?$/.exec(input);

        if (!id || !id.groups)
            return null;

        const member = driver.guild.members.resolve(id.groups.memberId);

        if (!member)
            return null;

        return new CustomCommandMemberType(member);
    }

    serialize() {
        return "<@" + this.value + ">";
    }
}
