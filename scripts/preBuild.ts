import { setBuildDate } from "./fetchBuildDate";
import { fetchEsiSpec } from "./fetchEsiSpec";
import { modifySpec } from "./modifySpec";

async function main() {
    try {
        await fetchEsiSpec();
    } catch {
        console.error("Failed to fetch ESI Spec")
        return;
    }
    
    await setBuildDate();
    await modifySpec();
}

main();