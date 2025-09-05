import { getEsiClient } from ".";
import { EsiClient, GetCharacterBlueprintsRequest, GetCharacterRequest, GetStatusRequest } from "./generated/esi-client";
import { getCache } from "./lib/caching";


async function test() {
    const esi = getEsiClient()

    const params: GetCharacterBlueprintsRequest = {
        characterId: 2116858020,
    };

    try {
        await esi.universeApi.getUniverseRaces();
        console.log(await esi.universeApi.getUniverseRaces());
    } catch (err) {
        console.error(err)
    }
    
}

test()