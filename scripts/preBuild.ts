import { setBuildDate } from "./fetchBuildDate";
import { fetchEsiSpec } from "./fetchEsiSpec";
import { modifySpec } from "./modifySpec";

async function main() {
    await fetchEsiSpec();
    await setBuildDate();
    await modifySpec();
}

main();