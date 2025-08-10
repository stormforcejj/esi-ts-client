import { BaseAPI, Configuration, ConfigurationParameters } from "./generated";
import { headersConfigMiddleware } from "./middleware/userAgent";

export interface EsiClientConfig {
    userAgent: string;
}

export class EsiClient extends BaseAPI {
    constructor(config: EsiClientConfig) {
        var packageJson = require("./package.json");
        const fullUserAgent =
            config.userAgent +
            ` using stormforcejj/esi-ts-client/${
                packageJson.version || "X.X.X"
            } (+https://github.com/stormforcejj/esi-ts-client discord:stormforcejj esi-client@stormforcejj.co.uk)`;

        const configuration = new Configuration({
            middleware: [headersConfigMiddleware(fullUserAgent)],
        });

        super(configuration);
    }
}
