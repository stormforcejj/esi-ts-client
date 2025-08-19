import { EsiClient, GetCharacterBlueprintsRequest } from "./index";
import { EsiError, EsiResponse } from "./types/responses";

const esi = new EsiClient({ userAgent: "Test" });


async function test() {
    
    const params : GetCharacterBlueprintsRequest = {
        characterId: 0
    }

    try {
        const alliance = await esi.contractsApi.getCorporationContracts(params, "")
        alliance.data[0].acceptorId
    } catch (err : EsiError) {
        
    } catch (err : any) {

    }    
    
}