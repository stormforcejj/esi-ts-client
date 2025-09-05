export * from "./generated/esi-client";
export * from "./types/responses"
export * from "./types/config"

import { EsiClient } from "./generated/esi-client";

let _esiClient: EsiClient | null = null;

export const getEsiClient = (): EsiClient => {
    if (!_esiClient) {
        _esiClient = new EsiClient();
    }
    return _esiClient;
};