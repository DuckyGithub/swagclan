import { ResourceNotFound } from "src/api/responses";

import { GuildCommand, GuildCommandModel } from "src/models/GuildCommand";
import { GuildCommandRegisterRequest } from "src/api/schema/GuildCommand";
import { AppReqHandler } from "src/api";
import { ErrorCode } from "src/api/errors";

export default (async (req, res) => {
    const doc = await GuildCommandModel.findOne({
        guild_id: req.params.guildid,
        command_id: req.params.id
    });

    if (!doc)
        throw new ResourceNotFound(ErrorCode.CommandNotInGuild);

    res.status(200).json({
        application_command_id: doc.application_command_id,
        guild_id: doc.guild_id,
        command_id: doc.command_id,
        command_version: doc.command_version,
        enabled: doc.enabled,
        timeout: doc.timeout,
        config: doc.config,
        permissions: doc.permissions,
        logs: doc.logs
    });
}) as AppReqHandler<GuildCommandRegisterRequest, GuildCommand>;
