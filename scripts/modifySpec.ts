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

function improveOperationId(operationId : string): string {
    const parts: string[] = []
    let current = ''

    for(const char of operationId) {
        if(char >= 'A' && char <= 'Z' && current.length > 0) {
            parts.push(current)
            current = char;
        } else {
            current = current + char;
        }
    }
    if(current.length > 0) {
        parts.push(current)
    }

    for (let i = 0; i < parts.length - 2; i++) {
        const plural = parts[i]
        const singular = parts[i+1]
        const id = parts[i+2]
        
        if(plural.endsWith('s') && singular === plural.substring(0, plural.length-1) && id === 'Id') {
            parts.splice(i,3,singular);
            i--;
        }
    }

    for (let i = 0; i < parts.length; i++) {
        if(parts[i] === 'Id') {
            parts.splice(i,1)
        }
    }

    if (
        parts.length >= 2 &&
        parts[parts.length - 2] === "Contract" &&
        parts[parts.length - 1] === "Id"
    ) {
        parts.splice(parts.length - 2, 2);
    }

    return parts.join('')
}

function replaceOperationIds(obj: any): void {
    if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj)) {
            if (key === "operationId" && typeof obj[key] === "string") {
                obj[key] = improveOperationId(obj[key]);
            } 
            
            if (key === "schemas" && typeof obj[key] === "object") {
                const newSchemas: Record<string, any> = {};
                for (const schemaKey of Object.keys(obj[key])) {
                    const improvedKey = improveOperationId(schemaKey);
                    newSchemas[improvedKey] = obj[key][schemaKey];
                }
                obj[key] = newSchemas;
            } 
            
            if (key === "$ref" && typeof obj[key] === "string") {
                const match = obj[key].match(/#\/components\/schemas\/(.+)$/);
                if (match) {
                    const refName = match[1];
                    const improvedRef = improveOperationId(refName);
                    obj[key] = `#/components/schemas/${improvedRef}`;
                }
            } 
            
            if (typeof obj[key] === "object") {
                replaceOperationIds(obj[key]);
            }
        }
    }
}

export async function modifySpec() {
    const inputJson = fs.readFileSync(path.resolve(__dirname, "../esi.json"), "utf-8");
    const data = JSON.parse(inputJson);

    replaceOperationIds(data)

    // Clean JSON
    const cleaned = removeRef(data);

    // Write cleaned JSON
    fs.writeFileSync(
        path.resolve(__dirname, "../esi.json"),
        JSON.stringify(cleaned, null, 2)
    );
}