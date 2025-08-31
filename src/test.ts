import { EsiClient, GetCharacterBlueprintsRequest } from "./index";
import { EsiError, EsiResponse } from "./types/responses";

async function test() {
    
    let x = 10;

    const start = Date.now()

    const esi = new EsiClient({userAgent: ""})

    while (x > 0) {
        const res = await esi.statusApi.getStatus();
        console.log(res.status)
        x = x-1;
    }

    const elapsed = Date.now() - start;
    console.log(elapsed)
}

test()