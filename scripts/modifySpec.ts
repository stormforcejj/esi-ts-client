import * as fs from "fs";
import path from "path";

const XCOMPAT_TARGET = { $ref: "#/components/parameters/CompatibilityDate" };

function isXCompat(obj: any): boolean {
    return (
        obj &&
        typeof obj === "object" &&
        Object.keys(obj).length === 1 &&
        obj["$ref"] === XCOMPAT_TARGET["$ref"]
    );
}

function removeRef(obj: any): any {
    if (isXCompat(obj)) {
        return null;
    }

    if (Array.isArray(obj)) {
        // Filter out nulls after recursive cleanup
        return obj.map(removeRef).filter((item) => item !== null);
    }

    if (obj !== null && typeof obj === "object") {
        const result: any = {};
        for (const key of Object.keys(obj)) {
            const cleanedValue = removeRef(obj[key]);
            if (cleanedValue !== null) {
                result[key] = cleanedValue;
            }
        }
        return result;
    }

    return obj;
}

export async function modifySpec() {
    const inputJson = fs.readFileSync(path.resolve(__dirname, "../esi.json"), "utf-8");
    const data = JSON.parse(inputJson);

    // Clean JSON
    const cleaned = removeRef(data);

    // Write cleaned JSON
    fs.writeFileSync(
        path.resolve(__dirname, "../esi.json"),
        JSON.stringify(cleaned, null, 2)
    );
}

modifySpec();
