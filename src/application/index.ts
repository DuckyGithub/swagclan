import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs/promises";

import { GlobalConfig } from "./GlobalConfig";
import { AppLogger } from "../util/logger";
import { Tedis } from "tedis";

import fetch, { Request } from "node-fetch";

import {
    HttpMethod,
    HttpRequestOptions,
    formatEndpoint,
    stringifyQuery
} from "@wilsonjs/client";

import { BaseUrls } from "@wilsonjs/constants";

export class SwagclanApp {
    config!: GlobalConfig;
    db!: mongoose.Mongoose;
    redis!: Tedis;
    logger: AppLogger;

    constructor(public readonly namespace: string) {
        this.logger = new AppLogger(this);
    }

    async make<T = any>(
        method: HttpMethod,
        path: string,
        options: HttpRequestOptions = {},
        ...params: any[]
    ): Promise<T> {
        const formatted = formatEndpoint(path, ...params);
        const query = options.query ? "?" + stringifyQuery(options.query) : "";

        const request_init = new Request(
            (formatted[0] === "/"
                ? "https://" + BaseUrls.API + "/v8" + formatted
                : formatted) + query,
            {
                method,
                ...options,
                headers: {
                    ...(process.env.BOT_TOKEN
                        ? {
                            Authorization: "Bot " + process.env.BOT_TOKEN
                        }
                        : {}),
                    ...options.headers
                }
            }
        );

        const res = await fetch(request_init);

        if (res.status >= 200 && res.status < 300) {
            if (res.status === 204) {
                return "" as any;
            }

            if (res.headers.get("Content-Type") === "application/json") {
                return (await res.json()) as T;
            } else if (res.headers.get("Content-Type") === "text/plain") {
                return (await res.text()) as any;
            }

            return (await res.blob()) as any;
        } else {
            try {
                const json = await res.json();

                throw new Error(
                    "JSON Error (" + json.code + "): " + json.message
                );
            } catch (e) {
                throw res.status;
            }
        }
    }

    async start() {
        this.logger.info("Starting " + this.namespace + " service..");

        dotenv.config();

        this.logger.info("Loaded environment variables.");

        const data = await fs.readFile(".config.json", "utf8");
        this.config = JSON.parse(data);

        this.logger.info("Loaded configuration.");

        this.db = await mongoose.connect(
            `mongodb+srv://${this.config.mongo.username}:${this.config.mongo.password}@${this.config.mongo.host}/${this.config.mongo.database}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            }
        );

        this.logger.success("Successfully connected to MongoDB node.");

        this.redis = new Tedis(this.config.redis);

        this.logger.success("Redis connection instantiated.");

        process.on("SIGINT", async () => {
            this.logger.info("Shutting app down gracefully..");
            await this.shutdown();
            process.exit(0);
        });
    }

    async shutdown() {
        await Promise.all([this.db.disconnect(), this.redis.close()]);
        this.logger.info(
            "Closed MongoDB node connection and Redis connection."
        );
    }
}
