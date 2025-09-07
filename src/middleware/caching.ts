import Keyv from "keyv";
import { FetchParams, Middleware, RequestContext, ResponseContext } from "../generated";
import { expiryToTTL, generateCacheHeaderHash } from "../lib/caching";

export function cachingMiddleware(cache: Keyv<any>): Middleware {
    return {
        pre: async (context: RequestContext): Promise<FetchParams> => {
            if (context.init.method === "GET") {
                const headerHash = generateCacheHeaderHash(context.init);

                const cacheKey = `GET:${context.url}:${headerHash}`;

                const cachedString = await cache.get(cacheKey);

                if (cachedString) {
                    const cachedData = JSON.parse(cachedString);

                    const headers = new Headers(cachedData.headers);
                    const response = new Response(
                        JSON.stringify(cachedData.body),
                        {
                            status: cachedData.status,
                            statusText: cachedData.statusText,
                            headers: headers,
                        }
                    );
                    return {
                        url: context.url,
                        init: context.init,
                        cachedResponse: response,
                    };
                }
            }

            return { url: context.url, init: context.init };
        },
        post: async (context: ResponseContext): Promise<Response> => {
            const response = context.response.clone();

            if (context.init.method !== "GET") {
                return response;
            }

            const expiryHeader = response.headers.get("expires");
            const expiry = expiryHeader
                ? new Date(expiryHeader)
                : new Date(Date.now() + 60 * 1000);

            const headerHash = generateCacheHeaderHash(context.init);

            const cacheKey = `GET:${context.url}:${headerHash}`;

            const headers: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                headers[key] = value;
            });

            const cachedResponse = {
                status: response.status,
                statusText: response.statusText,
                headers: headers,
                body: await response.clone().json(),
            };

            cache.set(
                cacheKey,
                JSON.stringify(cachedResponse),
                expiryToTTL(expiry)
            );

            return response;
        },
    };
}