import {
    CustomCommandVersion,
    CustomCommandVersionModel
} from "src/models/CustomCommandVersion";

import {
    CustomCommandVersionRequest,
    CustomCommandVersionRequestSchema
} from "src/api/schema/CustomCommandVersion";

import { AppReqHandler } from "src/api";

import { validateSchema } from "../../../../middleware/validate";
import { Conflict, Forbidden, Unauthorized } from "src/api/responses";
import { CustomCommandIdModel } from "src/models/CustomCommandId";
import { ErrorCode } from "src/api/errors";

export const middleware = [validateSchema(CustomCommandVersionRequestSchema)];

export default (async (req, res) => {
    const user = await req.session?.getUser();

    if (!user)
        throw new Unauthorized(ErrorCode.NotLoggedIn);

    const command = await CustomCommandIdModel.findOne({
        id: req.params.id,
        author_id: user.id
    });

    if (!command)
        throw new Forbidden(ErrorCode.NotCommandAuthor);

    if (command.versions[req.body.version] && req.body.version !== "draft")
        throw new Conflict(ErrorCode.CannotOverwriteVersion);

    if (!command.first) {
        command.first = req.body.version;
    }

    if (command.latest) {
        command.versions[command.latest].after = req.body.version;
    }

    command.versions[req.body.version] = {
        id: req.body.version,
        created_at: new Date().toISOString(),
        before: command.latest,
        after: null
    };

    command.latest = req.body.version;

    const doc = await CustomCommandVersionModel.findOneAndUpdate(
        { command_id: req.params.id, version: req.body.version },
        {
            ...req.body,
            command_id: req.params.id
        },
        { upsert: true, new: true }
    ); // Update & upsert in case the version is "draft"

    command.markModified("versions");
    await command.save();

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
}) as AppReqHandler<CustomCommandVersionRequest, CustomCommandVersion>;
