export enum EsiCacheStrategy {
    NONE = "none",
    MEMORY = "memory",
    REDIS = "redis"
}

export interface EsiClientConfig {
    bypassCache?: boolean
}