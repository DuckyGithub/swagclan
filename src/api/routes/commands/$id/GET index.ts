import {
    CustomCommandId,
    CustomCommandIdModel
} from "src/models/CustomCommandId";
import { AppReqHandler } from "src/api";

import { ResourceNotFound } from "src/api/responses";
import { ErrorCode } from "src/api/errors";

export default (async (req, res) => {
    const doc = await CustomCommandIdModel.findOne({ id: req.params.id });

    if (!doc)
        throw new ResourceNotFound(ErrorCode.CommandNotFound);

    if (req.session?.id !== doc.author_id) {
        doc.draft_guild_id = undefined;
    }

    res.status(200).json({
        id: doc.id,
        draft_guild_id: doc.draft_guild_id,
        name: doc.name,
        summary: doc.summary,
        tags: doc.tags,
        thumbnail: doc.thumbnail,
        author_id: doc.author_id,
        private: doc.private,
        deleted: doc.deleted,
        versions: doc.versions,
        latest: doc.latest,
        first: doc.first,
        guild_count: doc.guild_count
    });
}) as AppReqHandler<void, CustomCommandId>;
