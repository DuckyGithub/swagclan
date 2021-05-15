import {
    CustomCommandId,
    CustomCommandIdModel
} from "src/models/CustomCommandId";
import { CustomCommandSearchRequest } from "src/api/schema/CustomCommandSearch";
import { AppReqHandler } from "src/api";
import { Unauthorized } from "../../responses";
import { ErrorCode } from "src/api/errors";

export default (async (req, res) => {
    const user = await req.session?.getUser();

    if (!user)
        throw new Unauthorized(ErrorCode.NotLoggedIn);

    const docs = await CustomCommandIdModel.find({
        author_id: user.id
    })
        .sort({ guild_count: -1 })
        .exec();

    res.status(200).json(
        docs.map((doc) => ({
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
        }))
    );
}) as AppReqHandler<CustomCommandSearchRequest, CustomCommandId[]>;
