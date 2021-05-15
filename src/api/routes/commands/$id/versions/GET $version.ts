import {
    CustomCommandVersion,
    CustomCommandVersionModel
} from "src/models/CustomCommandVersion";
import { AppReqHandler } from "src/api";
import { ResourceNotFound } from "src/api/responses";
import { ErrorCode } from "src/api/errors";

export default (async (req, res) => {
    const doc = await CustomCommandVersionModel.findOne({
        command_id: req.params.id,
        version: req.params.version
    });

    if (!doc)
        throw new ResourceNotFound(ErrorCode.CommandNotFound);

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
