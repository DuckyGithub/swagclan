export interface MongoCredentials {
    host: string;
    username?: string;
    password?: string;
    database: string;
}

export interface RedisCredentials {
    host: string;
    port: number;
    password: string;
}

export interface APIConfig {
    port: number;
}

export interface OAuthConfig {
    scopes: string[];
    permissions: string;
}

export interface GlobalConfig {
    mongo: MongoCredentials;
    redis: RedisCredentials;
    api: APIConfig;
    base_api: string;
    base_web: string;
    oauth: OAuthConfig;
    dev_guild: string;
}
