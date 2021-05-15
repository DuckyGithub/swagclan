import { v4 as uuidv4 } from "uuid";

import { GuildCommand } from "src/models/GuildCommand";
import { app, AppReqHandler } from "src/api";
import { Session } from "../Session";

export default (async (req, res) => {
    if (!req.query.code)
        return res.redirect(app.config.base_web);

    if (!req.session) {
        req.session = new Session(uuidv4());
        res.cookie("session_id", req.session.id, { httpOnly: true });
    }

    const auth = await req.session.exchangeCode("" + req.query.code, req.ip, req.header("User-Agent") || ""); // Querystring parameters are not always strings.

    if (auth) {
        res.redirect(app.config.base_web);
    } else {
        res.redirect(app.config.base_web + "?login_fail=true");
    }
}) as AppReqHandler<void, GuildCommand>;
