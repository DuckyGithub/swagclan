import {
    CustomCommandId,
    CustomCommandIdModel
} from "src/models/CustomCommandId";
import {
    CustomCommandRequest,
    CustomCommandRequestSchema
} from "src/api/schema/CustomCommandId";
import { AppReqHandler } from "src/api";

import { validateSchema } from "../../../middleware/validate";
import { Forbidden, Unauthorized } from "src/api/responses";
import { ErrorCode } from "src/api/errors";

export const middleware = [
    validateSchema(CustomCommandRequestSchema.partial())
];

export default (async (req, res) => {
    const user = await req.session?.getUser();

    if (!user)
        throw new Unauthorized(ErrorCode.NotLoggedIn);

    const doc = await CustomCommandIdModel.findOneAndUpdate(
        {
            id: req.params.id,
            author_id: user.id
        },
        { $set: req.body },
        { new: true }
    );

    if (!doc)
        throw new Forbidden(ErrorCode.NotCommandAuthor);

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
}) as AppReqHandler<Partial<CustomCommandRequest>, CustomCommandId>;
