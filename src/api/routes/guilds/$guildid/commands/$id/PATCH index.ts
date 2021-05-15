import { CreateGuildApplicationCommandResponse } from "@wilsonjs/models";
import { ApiEndpoints } from "@wilsonjs/constants";

import { ResourceNotFound } from "src/api/responses";
import { CustomCommandVersionModel } from "src/models/CustomCommandVersion";
import { GuildCommand, GuildCommandModel } from "src/models/GuildCommand";
import { CustomCommandIdModel } from "src/models/CustomCommandId";

import {
    GuildCommandUpdateRequest,
    GuildCommandUpdateRequestSchema
} from "src/api/schema/GuildCommand";

import { app, AppReqHandler } from "src/api";

import { validateSchema } from "src/api/middleware/validate";
import { CustomCommandDriver } from "src/drivers/CustomCommandDriver";
import { ErrorCode } from "src/api/errors";

export const middleware = [
    validateSchema(GuildCommandUpdateRequestSchema.partial())
];

export default (async (req, res) => {
    const command_id = await CustomCommandIdModel.findOne({
        id: req.params.id
    });

    if (!command_id)
        throw new ResourceNotFound(ErrorCode.CommandNotFound);

    const command_version = await CustomCommandVersionModel.findOne({
        command_id: req.params.id,
        version: req.body.command_version
    });

    if (!command_version)
        throw new ResourceNotFound(ErrorCode.CommandVersionNotFound);

    const doc = await GuildCommandModel.findOneAndUpdate(
        { guild_id: req.params.guildid, command_id: req.params.id },
        {
            $set: req.body
        },
        { new: true }
    );

    if (!doc)
        throw new ResourceNotFound(ErrorCode.CommandNotInGuild);

    const app_command = await app.make<CreateGuildApplicationCommandResponse>(
        "PATCH",
        ApiEndpoints.EditGuildApplicationCommand,
        {
            body: JSON.stringify(
                CustomCommandDriver.createDiscordInteraction(
                    command_id,
                    command_version
                )
            ),
            headers: {
                "Content-Type": "application/json"
            }
        },
        /* Application ID */ process.env.CLIENT_ID,
        /*       Guild ID */ req.params.guildid,
        /*     Command ID */ doc.application_command_id
    );

    res.status(200).json({
        application_command_id: app_command.id,
        guild_id: doc.guild_id,
        command_id: doc.command_id,
        command_version: doc.command_version,
        enabled: doc.enabled,
        timeout: doc.timeout,
        config: doc.config,
        permissions: doc.permissions,
        logs: doc.logs
    });
}) as AppReqHandler<GuildCommandUpdateRequest, GuildCommand>;
