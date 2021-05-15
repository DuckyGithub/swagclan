import { ApiEndpoints } from "@wilsonjs/constants";
import { BasicGuild } from "@wilsonjs/models";

import { app, AppReqHandler } from "src/api";
import { Forbidden, ResourceNotFound, Unauthorized } from "src/api/responses";
import { GuildPremiumModel } from "src/models/GuildPremium";
import { ErrorCode } from "../../../errors";
import { canManage } from "./middleware";

export interface GuildPremiumResponse {
    started_at: number;
    expires_at: number;
    user_id: string;
}

export interface SwagClanGuild extends BasicGuild {
    premium?: GuildPremiumResponse;
}

async function getGuild(guildid: string): Promise<BasicGuild|null> {
    const redisCached = app.redis.get("guild." + guildid);

    if (redisCached && typeof redisCached === "string") {
        return JSON.parse(redisCached) as BasicGuild;
    }

    try {
        const guild = await app.make<BasicGuild>(
            "GET",
            ApiEndpoints.GetGuild,
            { query: { with_counts: "true" } },
            /* Guild ID */ guildid
        );

        await app.redis.set("guild." + guildid, JSON.stringify(guild));
        await app.redis.expire("guild." + guildid, 90);

        return guild;
    } catch (e) {
        return null;
    }
}

export default (async (req, res) => {
    const guilds = await req.session?.getGuilds();

    if (!guilds)
        throw new Unauthorized(ErrorCode.NotLoggedIn);

    const as_user = guilds.find(g => g?.id === req.params.guildid);

    if (!as_user)
        throw new Forbidden(ErrorCode.UserNotInGuild);

    const guild = await getGuild(req.params.guildid);

    if (!guild)
        throw new ResourceNotFound(ErrorCode.BotNotInGuild);

    if (!canManage(as_user))
        throw new Forbidden(ErrorCode.CannotManageGuild);

    const doc = await GuildPremiumModel.findOne({
        guild_id: req.params.guildid
    });

    if (!doc) {
        return res.status(200).json(guild);
    }

    res.status(200).json({
        ...guild,
        premium: {
            started_at: doc.started_at,
            expires_at: doc.expires_at,
            user_id: doc.user_id
        }
    });
}) as AppReqHandler<void, SwagClanGuild>;
