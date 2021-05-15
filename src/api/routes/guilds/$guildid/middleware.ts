import { PermissionFlag } from "@wilsonjs/constants";
import { BasicGuild } from "@wilsonjs/models";

import { Forbidden, InternalServerError } from "src/api/responses";
import { AppReqHandler } from "src/api";
import { ErrorCode } from "src/api/errors";

export function canManage(guild?: BasicGuild) {
    if (!guild)
        return false;

    if (!guild.permissions)
        return false;

    const permissions = parseInt(guild.permissions || "0");

    if (
        !(permissions & PermissionFlag.ManageGuild) &&
        !(permissions & PermissionFlag.Administrator) &&
        !guild.owner
    )
        return false;

    return true;
}

export default [
    (async (req) => {
        const guilds = await req.session?.getGuilds();

        if (!guilds)
            throw new InternalServerError(ErrorCode.NotLoggedIn);

        const guild = guilds.find((guild) => guild.id === req.params.guildid);

        if (!canManage(guild))
            throw new Forbidden(ErrorCode.CannotManageGuild);
    }) as AppReqHandler<any, any>
];
