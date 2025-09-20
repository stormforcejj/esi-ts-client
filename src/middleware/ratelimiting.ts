import Bottleneck from "bottleneck";
import { ErrorContext, FetchParams, Middleware, RequestContext, ResponseContext } from "../generated";
import { generateCacheHeaderHash } from "../lib/caching";

interface RetryRequestInit extends RequestInit {
    retries?: number;
}

export function ratelimitingMiddleware(maxRetries = 3) : Middleware {
    const limiters : Record<string, Bottleneck> = {}

    let errorLimitResetTime : number | null = null;

    return {
        pre: async (context: RequestContext) : Promise<FetchParams> => {
            if (errorLimitResetTime) {
                const now = Date.now();
                if (now < errorLimitResetTime) {
                    await new Promise(resolve => setTimeout(resolve, errorLimitResetTime! - now));
                }
                errorLimitResetTime = null;
            }

            const urlPath = new URL(context.url).pathname

            let limiter = limiters[urlPath]

            if(!limiter) {
                if(urlPath.includes('history')) {
                    limiter = new Bottleneck({
                        maxConcurrent: 1,
                        minTime: 200
                    });
                } else {
                    limiter = new Bottleneck({
                        maxConcurrent: 1,
                        minTime: 10
                    });
                }

                limiters[urlPath] = limiter
            }
            
            const init = context.init as RetryRequestInit;
            if (init.retries === undefined) {
                init.retries = 0;
            }
            context.init = init;
            
            await limiter.schedule(() => Promise.resolve())

            return { url: context.url, init: init}
        },
        post: async (context: ResponseContext): Promise<Response> => {
            const response = context.response

            const remaining = parseInt(response.headers.get("X-ESI-Error-Limit-Remain") || "1", 10);
            const resetSec = parseInt(response.headers.get("X-ESI-Error-Limit-Reset") || "0", 10);

            if (remaining <= 0 && resetSec > 0) {
                errorLimitResetTime = Date.now() + resetSec * 1000;
            }

            const status = response.status;

            if (status === 429 || (status && status >= 500 && status < 600)) {
                const init = context.init as RetryRequestInit;
                init.retries = (init.retries || 0) + 1;

                if (init.retries > maxRetries) {
                    return response;
                }

                const delay = Math.min(1000 * Math.pow(2, init.retries), 10000);

                await new Promise((r) => setTimeout(r, delay));

                return context.fetch(context.url, init);
            }

            return response;
        }
    }
}