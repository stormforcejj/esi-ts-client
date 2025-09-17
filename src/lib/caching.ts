import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { EsiCacheStrategy } from "../types/config";
import crypto from 'crypto'
import { jwtDecode } from "jwt-decode";

// let cacheInstance: Keyv<any> | null = null;

function createMemoryCache() {
    return new Keyv({ ttl: 60000 })
}

function createRedisCache() {
    const host = process.env.ESI_REDIS_HOST;
    const user = process.env.ESI_REDIS_USER;
    const password = process.env.ESI_REDIS_PASSWORD;
    const port = process.env.ESI_REDIS_PORT || 6379;
    const useTls = process.env.ESI_REDIS_TLS === "true";

    let auth = "";

    if(user && user !== "" && password && password !== "") {
        auth = `${user}:${password}@`;
    } else if (password && password !== "") {
        auth = `${password}@`
    }

    const protocol = useTls ? "rediss" : "redis";

    if(!host) {
        throw new Error("ESI Client: Redis host must be specified in .env to use the redis strategy")
    }

    const redisUrl = `${protocol}://${auth}@${host}:${port}`

    const store = new KeyvRedis(redisUrl);
    const cache = new Keyv({ store, ttl: 60000 });

    store.on("error", (err) => {
        throw err;
    });

    cache.on("error", (err) => {
        throw err;
    });

    return cache;
}

export function initCache() {
    // if (cacheInstance) return cacheInstance;

    const strategy = (process.env.ESI_CACHE_STRATEGY as EsiCacheStrategy) || EsiCacheStrategy.MEMORY
    
    switch (strategy) {
        case EsiCacheStrategy.REDIS:
            return createRedisCache()
        default:
            return createMemoryCache();
    }
}

// export function getCache() {
//     if(!cacheInstance) initCache();
//     return cacheInstance!;
// }

export function expiryToTTL(expiry : Date) {
    const ttl = expiry.getTime() - Date.now();
    
    return ttl > 0 ? ttl : 0;
}

export function generateCacheHeaderHash(context: RequestInit) {
    if (context.headers) {
        const headers: Record<string, string> = {};

        if (context.headers instanceof Headers) {
            context.headers.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(context.headers)) {
            context.headers.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else if (
            typeof context.headers === "object" &&
            context.headers !== null
        ) {
            Object.assign(headers, context.headers);
        }

        let sub = ""

        try {
            const authHeader = headers["Authorization"] ?? "";

            const rawToken = authHeader.startsWith("Bearer ")
                ? authHeader.slice(7)
                : authHeader;

            const decodedToken = jwtDecode(rawToken);
            sub = decodedToken.sub || ""
        } catch {}
        
        const relevantHeaders = {
            "Accept-Language": headers["Accept-Language"] ?? "",
            Authorization: sub,
        };

        const headerString = JSON.stringify(relevantHeaders);

        return crypto
            .createHash("sha256")
            .update(headerString)
            .digest("base64");
    }

    return "";
}