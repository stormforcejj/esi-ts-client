import { EsiClient } from "./esi-client";
import { AllianceApi, ContractsApi } from "./generated";


async function test() {
    const esi = new EsiClient({userAgent: "Test"});

    const alliance = new AllianceApi();
    (await alliance.getAlliancesAllianceIdCorporationsRaw({})).raw.
}