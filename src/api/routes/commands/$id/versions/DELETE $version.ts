import {
    CustomCommandVersion,
    CustomCommandVersionModel
} from "src/models/CustomCommandVersion";
import { AppReqHandler } from "src/api";

import {
    BadRequest,
    Forbidden,
    ResourceNotFound,
    Unauthorized
} from "src/api/responses";
import { GuildCommandModel } from "src/models/GuildCommand";
import { CustomCommandIdModel } from "src/models/CustomCommandId";
import { ErrorCode } from "src/api/errors";

export default (async (req, res) => {
    const user = await req.session?.getUser();

    if (!user)
        throw new Unauthorized(ErrorCode.NotLoggedIn);

    if (req.params.version === "draft")
        throw new BadRequest(ErrorCode.CannotDeleteCommandDraft);

    const command_id = await CustomCommandIdModel.findOne({
        id: req.params.id,
        author_id: user.id
    });

    if (!command_id)
        throw new Forbidden(ErrorCode.NotCommandAuthor);

    const doc = await CustomCommandVersionModel.findOne({
        command_id: req.params.id,
        version: req.params.version
    }).exec();

    if (!doc)
        throw new ResourceNotFound(ErrorCode.CommandVersionNotFound);

    const guilds = await GuildCommandModel.count({
        command_id: req.params.id,
        command_version: req.params.version2
    });

    if (guilds)
        throw new Forbidden(ErrorCode.CommandVersionUsed);

    res.status(200).json({
        command_id: doc.command_id,
        version: doc.version,
        trigger: doc.trigger,
        config: doc.config,
        params: doc.params,
        variables: doc.variables,
        actions: doc.actions,
        first: doc.first
    });
}) as AppReqHandler<void, CustomCommandVersion>;
