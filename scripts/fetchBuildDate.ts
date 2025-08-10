import { readFileSync } from "fs";
import path from "path";
import fs from "fs";

function loadEsiSpec() {
    try {
        const raw = readFileSync(path.resolve(__dirname, "../esi.json"), "utf-8");
        const spec = JSON.parse(raw);
        return spec;
    } catch (err) {
        console.error("Error loading ESI spec from ./esi.json:", err);
        return null;
    }
}

export async function setBuildDate() {
    try {
        const esiSpec = loadEsiSpec();
        if (esiSpec) {
            const compatDate = esiSpec.info.version || "2020-01-01"
            const filePath = path.join(__dirname, "../src/config/latestCompatDate.ts")
            const fileContent = `export const BUILD_COMPATABILITY_DATE = "${compatDate}";\n`;
            fs.writeFileSync(filePath, fileContent);
            console.log("Latest compatability date saved:", compatDate);
        } else {
            throw Error("Failed to fetch ESI Spec")
        }
    } catch(e : any) {
        console.error("Failed to fetch latest compatibility date:", e)
        process.exit(1);
    }
}

setBuildDate();