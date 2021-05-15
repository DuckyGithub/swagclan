import { CreateGuildApplicationCommandResponse } from "@wilsonjs/models";
import { ApiEndpoints } from "@wilsonjs/constants";

import { ResourceNotFound } from "src/api/responses";

import { CustomCommandIdModel } from "src/models/CustomCommandId";
import { CustomCommandVersionModel } from "src/models/CustomCommandVersion";
import { GuildCommand, GuildCommandModel } from "src/models/GuildCommand";
import { CustomCommandDriver } from "src/drivers/CustomCommandDriver";
import { app, AppReqHandler } from "src/api";
import { ErrorCode } from "src/api/errors";

export default (async (req, res) => {
    const command_id = await CustomCommandIdModel.findOne({
        id: req.params.id
    });

    if (!command_id)
        throw new ResourceNotFound(ErrorCode.CommandNotFound);

    const doc = await GuildCommandModel.findOne({
        guild_id: req.params.guildid,
        command_id: req.params.id
    });

    if (!doc)
        throw new ResourceNotFound(ErrorCode.CommandNotInGuild);

    const command_version = await CustomCommandVersionModel.findOne({
        command_id: req.params.id,
        version: doc.command_version
    });

    if (!command_version)
        throw new ResourceNotFound(ErrorCode.CommandVersionNotFound);

    try {
        await app.make<CreateGuildApplicationCommandResponse>(
            "DELETE",
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
    } catch (e) {
        app.logger.warn("An error occurred while deleting a command:", e);
    }

    await doc.deleteOne();

    await command_id.updateOne({
        $inc: {
            guild_count: -1
        },
        ...(command_id.draft_guild_id
            ? {
                $unset: {
                    draft_guild_id: 1
                }
            }
            : {}
        )
    });

    if (command_version === "draft") {
        command_id.draft_guild_id = undefined;
        command_id.markModified("draft_guild_id");
        await command_id.update();
    }

    res.status(204).end("");
}) as AppReqHandler<void, GuildCommand>;
