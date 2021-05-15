import { Channel } from "@wilsonjs/client";
import { CustomCommandDriver, CustomCommandTypeName } from "../CustomCommandDriver";
import { CustomCommandType } from "./Base";

export class CustomCommandChannelType extends CustomCommandType<Channel> {
    static typeName = CustomCommandTypeName.Channel;
    typeName = CustomCommandTypeName.Channel;

    static parse(driver: CustomCommandDriver, input: string) {
        const id = /^(<&)?(?<channelId>\d+)>?$/.exec(input);

        if (!id || !id.groups)
            return null;

        const channel = driver.guild.channels.resolve(id.groups.channelId);

        if (!channel)
            return null;

        return new CustomCommandChannelType(channel);
    }

    serialize() {
        return "<#" + this.value + ">";
    }
}
