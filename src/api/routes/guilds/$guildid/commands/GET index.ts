import { GuildCommand, GuildCommandModel } from "src/models/GuildCommand";
import { GuildCommandRegisterRequest } from "src/api/schema/GuildCommand";
import { AppReqHandler } from "src/api";

export default (async (req, res) => {
    const docs = await GuildCommandModel.find({
        guild_id: req.params.guildid
    });

    res.status(200).json(
        docs.map((doc) => ({
            application_command_id: doc.application_command_id,
            guild_id: doc.guild_id,
            command_id: doc.command_id,
            command_version: doc.command_version,
            enabled: doc.enabled,
            timeout: doc.timeout,
            config: doc.config,
            permissions: doc.permissions,
            logs: doc.logs
        }))
    );
}) as AppReqHandler<GuildCommandRegisterRequest, GuildCommand[]>;
