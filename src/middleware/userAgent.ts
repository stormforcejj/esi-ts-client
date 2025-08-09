import { BUILD_COMPATABILITY_DATE } from "../config/latestCompatDate";
import { RequestContext, FetchParams } from "../generated";

export function headersConfigMiddleware(userAgent: string) {
    return {
        pre: async (context: RequestContext): Promise<FetchParams> => {
            // Normalize headers to a plain object so we can assign keys
            const headers: Record<string, string> = {};

            if (context.init.headers instanceof Headers) {
                context.init.headers.forEach((value, key) => {
                    headers[key] = value;
                });
            } else if (Array.isArray(context.init.headers)) {
                context.init.headers.forEach(([key, value]) => {
                    headers[key] = value;
                });
            } else if (
                typeof context.init.headers === "object" &&
                context.init.headers !== null
            ) {
                Object.assign(headers, context.init.headers);
            }

            // Set or override the user agent header
            headers["X-User-Agent"] = userAgent;
            headers["X-Compatibility-Date"] = BUILD_COMPATABILITY_DATE || "2020-01-01";

            // Assign normalized headers back to init
            context.init.headers = headers;

            return { url: context.url, init: context.init };
        },
    };
}
