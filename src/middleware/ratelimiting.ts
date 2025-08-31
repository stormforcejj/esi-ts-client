import Bottleneck from "bottleneck";
import { ErrorContext, FetchParams, Middleware, RequestContext, ResponseContext } from "../generated";

interface RetryRequestInit extends RequestInit {
    retries?: number;
}

export function ratelimitingMiddleware() : Middleware {
    const standardLimiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 1000
    });

    const specialLimiter = new Bottleneck({
        maxConcurrent: 1,
        minTime: 200
    });

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

            const init = context.init as RetryRequestInit;
            if (init.retries === undefined) {
                init.retries = 0;
            }
            context.init = init;
            
            if(context.url.includes("history")) {
                await specialLimiter.schedule(() => Promise.resolve())
            } else {
                await standardLimiter.schedule(() => Promise.resolve())
            }

            return { url: context.url, init: init}
        },
        post: async (context: ResponseContext): Promise<Response> => {
            const response = context.response

            const remaining = parseInt(response.headers.get("X-ESI-Error-Limit-Remain") || "1", 10);
            const resetSec = parseInt(response.headers.get("X-ESI-Error-Limit-Reset") || "0", 10);

            if (remaining <= 0 && resetSec > 0) {
                errorLimitResetTime = Date.now() + resetSec * 1000;
            }

            return response;
        },
        onError(context: ErrorContext) : Promise<Response> {
            if(context.response) {
                const response = context.response;
                const status = response.status;

                const remaining = parseInt(response.headers.get("X-ESI-Error-Limit-Remain") || "1", 10);
                const resetSec = parseInt(response.headers.get("X-ESI-Error-Limit-Reset") || "0", 10);

                if (remaining <= 0 && resetSec > 0) {
                    errorLimitResetTime = Date.now() + resetSec * 1000;
                }

                if (status === 429 || (status && status >= 500 && status < 600)) {
                    const init = context.init as RetryRequestInit;

                    if(init.retries! >= 3) {
                        throw context.error;
                    }
                    init.retries!++;
                    return context.fetch(context.url, init);
                }
            }

            throw context.error;
        },
    }
}