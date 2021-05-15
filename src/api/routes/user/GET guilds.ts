import { AppReqHandler } from "src/api";
import { ErrorCode } from "src/api/errors";
import { Unauthorized } from "src/api/responses";
import { GuildPremiumModel } from "src/models/GuildPremium";
import { SwagClanGuild } from "../guilds/$guildid/GET index";

import { canManage } from "../guilds/$guildid/middleware";

export default (async (req, res) => {
    const guilds = await req.session?.getGuilds();

    if (!guilds)
        throw new Unauthorized(ErrorCode.NotLoggedIn);

    const managable = guilds.filter(canManage);

    const docs = await GuildPremiumModel.find({
        $or: managable
            .map(guild => {
                return {
                    guild_id: guild.id
                };
            })
    });

    res.status(200).json(
        managable.map(guild => {
            const premium = docs.find(premium => premium.guild_id === guild.id);

            if (!premium)
                return guild;

            return {
                ...guild,
                premium: {
                    started_at: premium.started_at,
                    expires_at: premium.expires_at,
                    user_id: premium.user_id
                }
            };
        })
    );
}) as AppReqHandler<void, SwagClanGuild[]>;
