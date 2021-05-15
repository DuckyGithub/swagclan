import { GuildCommand } from "src/models/GuildCommand";
import { AppReqHandler } from "src/api";

export default (async (req, res) => {
    if (req.session) {
        await req.session.destroy();
        res.cookie("session_id", 0, { maxAge: 0 });
    }

    res.status(204).end("");
}) as AppReqHandler<void, GuildCommand>;
