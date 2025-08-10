import { EsiClient } from "./esi-client";
import { AllianceApi, CharacterApi, ContractsApi, GetAlliancesRequest, ResponseError } from "./generated";
import { EsiResponse } from "./types/responses";


async function test() {
    const esi = new EsiClient({userAgent: "Test"});

    const alliance = new CharacterApi()
    await alliance.withMiddleware().getCharacter({corporationId: 1},"").
}