import { v4 as uuidv4 } from "uuid";

import {
    CustomCommandId,
    CustomCommandIdModel
} from "src/models/CustomCommandId";
import {
    CustomCommandRequest,
    CustomCommandRequestSchema
} from "src/api/schema/CustomCommandId";
import { AppReqHandler } from "src/api";

import { validateSchema } from "../../middleware/validate";
import { Unauthorized } from "src/api/responses";
import { ErrorCode } from "src/api/errors";

export const middleware = [validateSchema(CustomCommandRequestSchema)];

export default (async (req, res) => {
    const user = await req.session?.getUser();

    if (!user)
        throw new Unauthorized(ErrorCode.NotLoggedIn);

    const doc = await CustomCommandIdModel.create({
        ...req.body,
        id: uuidv4(),
        author: user.id,
        versions: {},
        latest: null,
        first: null,
        deleted: false,
        guild_count: 0
    });

    res.status(200).json({
        id: doc.id,
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
}) as AppReqHandler<CustomCommandRequest, CustomCommandId>;
