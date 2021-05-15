import express from "express";
import http from "http";
import fs from "fs/promises";
import util from "util";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";

import { SwagclanApp } from "src/application";
import { HttpError, HttpResponse } from "./responses";
import { Session } from "./Session";

const rename = {
    index: "",
    "404": "*"
};
type RenamePath = keyof typeof rename;

const verbs = ["GET", "POST", "PUT", "PATCH", "DELETE", "ALL"] as const;
type HttpVerb = typeof verbs[number];

export interface RequestInfo<ReqType> extends express.Request {
    body: ReqType;
    session?: Session;
}

export interface ResponseInfo<ResType> extends express.Response {
    json(body: ResType): this;
}

export type AppReqHandler<ReqType, ResType> = (
    req: RequestInfo<ReqType>,
    res: ResponseInfo<ResType>,
    next?: express.NextFunction
) => Promise<HttpError | any>;

export interface ParsedEndpoint {
    route: string;
    method: HttpVerb;
    handler: AppReqHandler<any, any>;
    middleware: AppReqHandler<any, any>[];
}

export async function parseFileTree(
    app: ApiApplication,
    base: string,
    dir: string
) {
    const files = await fs.readdir(dir);

    const filenames = files.map((file) => path.resolve(dir, file));

    const dirs: { filename: string; route: string }[] = [];
    const middleware: AppReqHandler<any, any>[] = [];
    const endpoints: ParsedEndpoint[] = [];

    for (const filename of filenames) {
        const stat = await fs.stat(filename);
        const basename = path.basename(filename, ".ts");
        const is_dir = stat.isDirectory();

        if (is_dir) {
            const route = rename[basename as RenamePath] ?? basename;
            dirs.push({ filename, route });
        } else {
            if (basename === "middleware") {
                const { default: md } = await import(filename);

                middleware.push(...md);
            } else {
                const parts = basename.split(" ");
                const verb = parts[0] as HttpVerb;
                const rest = parts.slice(1).join(" ");
                const route = rename[rest as RenamePath] ?? rest;

                if (!verbs.includes(verb)) continue;

                const { default: handler, middleware: md } = await import(
                    filename
                );

                if (rest === "404") {
                    endpoints.push({
                        middleware: md || [],
                        method: verb,
                        route,
                        handler
                    });
                } else {
                    endpoints.unshift({
                        middleware: md || [],
                        method: verb,
                        route,
                        handler
                    });
                }
            }
        }
    }

    for (const md of middleware) {
        app.server.use(base.replace(/\$/g, ":"), async (req, res, next) => {
            try {
                await md(req, res);
            } catch (e) {
                if (e instanceof HttpResponse) {
                    return res.status(e.code).json(e);
                }

                throw e;
            }

            next();
        });
    }

    for (const dir of dirs) {
        await parseFileTree(app, base + "/" + dir.route, dir.filename);
    }

    for (const ep of endpoints) {
        const replaced = (base + "/" + ep.route).replace(/\$/g, ":");

        for (const md of ep.middleware) {
            app.server.use(replaced, async (req, res, next) => {
                if (req.method !== ep.method) return next();

                try {
                    await md(req, res);
                } catch (e) {
                    if (e instanceof HttpResponse) {
                        return res.status(e.code).json(e);
                    }

                    throw e;
                }

                next();
            });
        }

        app.server[
            ep.method.toLowerCase() as
                | "get"
                | "post"
                | "put"
                | "patch"
                | "delete"
                | "all"
        ](replaced, async (req: express.Request, res: express.Response) => {
            try {
                await ep.handler(req, res);
            } catch (e) {
                if (e instanceof HttpError) {
                    return res.status(e.code).json(e);
                }

                throw e;
            }
        });
    }
}

export class ApiApplication extends SwagclanApp {
    server!: express.Express;
    http!: http.Server;

    constructor() {
        super("api");
    }

    async start() {
        await super.start();

        this.server = express();
        this.server.use(
            cors({
                origin: this.config.base_web,
                credentials: true
            })
        );
        this.server.use(express.json());
        this.server.use(cookieParser());
        await parseFileTree(this, "", path.resolve(__dirname, "./routes"));

        this.http = this.server.listen(this.config.api.port, () => {
            this.logger.success("Listening on *:" + this.config.api.port);
        });
    }

    async shutdown() {
        await super.shutdown();

        await util.promisify(this.http.close.bind(this.http))();

        this.logger.info("Closed HTTP server.");
    }
}

const app = new ApiApplication;

(async () => {
    await app.start();
})();

export { app };
