import { Middleware } from "../generated";

export enum EsiCacheStrategy {
    NONE = "none",
    MEMORY = "memory",
    REDIS = "redis"
}

export interface EsiClientConfig {
    bypassCache?: boolean,
    middleware?: Middleware[]
    userAgentOverride?: string,
    retries?: number,
}