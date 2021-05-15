import querystring from "querystring";

import { ApiEndpoints } from "@wilsonjs/constants";
import {
    AccessTokenResponse,
    GetCurrentUserGuildsResponse,
    GetCurrentUserResponse
} from "@wilsonjs/models";

import { app } from ".";

export interface SessionId {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    scope: string;
    ip: string;
    userAgent: string;
}

export class Session implements SessionId {
    access_token!: string;
    refresh_token!: string;
    expires_at!: number;
    scope!: string;
    ip!: string;
    userAgent!: string;

    constructor(public readonly id: string) {}

    async check() {
        const cached = await app.redis.get("session." + this.id);

        if (cached && typeof cached === "string") {
            const session = JSON.parse(cached) as SessionId;

            this.access_token = session.access_token;
            this.refresh_token = session.refresh_token;
            this.expires_at = session.expires_at;
            this.scope = session.scope;
            this.ip = session.ip;
            this.userAgent = session.userAgent;
        } else {
            await this.save();
        }
    }

    async save() {
        await app.redis.set("session." + this.id, JSON.stringify({
            access_token: this.access_token,
            refresh_token: this.refresh_token,
            expires_at: this.expires_at,
            scope: this.scope,
            ip: this.ip,
            userAgent: this.userAgent
        }));
    }

    async destroy() {
        await app.redis.del("session." + this.id);
    }

    async exchangeCode(code: string, ip: string, userAgent: string) {
        await this.destroy();

        try {
            const exch = await app.make<AccessTokenResponse>(
                "POST",
                "/oauth2/token",
                {
                    body: querystring.stringify({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        grant_type: "authorization_code",
                        code: code,
                        redirect_uri: app.config.base_api + "/exchange",
                        scope: app.config.oauth.scopes.join(" ")
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            const session: SessionId = {
                access_token: exch.access_token,
                refresh_token: exch.refresh_token,
                expires_at: Date.now() + exch.expires_in,
                scope: exch.scope,
                ip,
                userAgent
            };

            await app.redis.set("session." + this.id, JSON.stringify(session));

            return session;
        } catch (e) {
            return null;
        }
    }

    async getAccessToken() {
        const cached = await app.redis.get("session." + this.id);

        if (cached && typeof cached === "string") {
            const session = JSON.parse(cached) as SessionId;

            if (session.expires_at <= Date.now()) {
                try {
                    const exch = await app.make<AccessTokenResponse>(
                        "POST",
                        "/oauth2/token",
                        {
                            body: querystring.stringify({
                                client_id: process.env.CLIENT_ID,
                                client_secret: process.env.CLIENT_SECRET,
                                grant_type: "refresh_token",
                                refresh_token: session.refresh_token,
                                redirect_uri: app.config.base_api + "/exchange",
                                scope: app.config.oauth.scopes.join(" ")
                            }),
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        }
                    );

                    session.access_token = exch.access_token;
                    session.refresh_token = exch.refresh_token;
                    session.expires_at = Date.now() + exch.expires_in;
                } catch (e) {
                    return null;
                }

                await app.redis.set(
                    "session." + this.id,
                    JSON.stringify(session)
                );
            }

            return session.access_token;
        }

        return null;
    }

    async getUser(): Promise<GetCurrentUserResponse|null> {
        const cached = await app.redis.get("user." + this.id);

        if (cached && typeof cached === "string") {
            // tedis can return a number
            return JSON.parse(cached);
        }

        const access_token = await this.getAccessToken();

        try {
            const user = await app.make<GetCurrentUserResponse>(
                "GET",
                ApiEndpoints.GetCurrentUser,
                {
                    headers: {
                        Authorization: "Bearer " + access_token
                    }
                }
            );

            await app.redis.set("user." + this.id, JSON.stringify(user));
            await app.redis.expire("user." + this.id, 30);

            return user;
        } catch (e) {
            return null;
        }
    }

    async getGuilds(): Promise<GetCurrentUserGuildsResponse|null> {
        const cached = await app.redis.get("guilds." + this.id);

        if (cached && typeof cached === "string") {
            // tedis can return a number
            return JSON.parse(cached) as GetCurrentUserGuildsResponse;
        }

        const access_token = await this.getAccessToken();

        try {
            const guilds = await app.make<GetCurrentUserGuildsResponse>(
                "GET",
                ApiEndpoints.GetCurrentUserGuilds,
                {
                    headers: {
                        Authorization: "Bearer " + access_token
                    }
                }
            );

            await app.redis.set("guilds." + this.id, JSON.stringify(guilds));
            await app.redis.expire("guilds." + this.id, 90);

            return guilds;
        } catch (e) {
            return null;
        }
    }
}
