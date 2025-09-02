import { writeFileSync } from "fs";
import path from "path";

export async function fetchEsiSpec() {
    const date = new Date(Date.now() - (11 * 60 * 60 * 1000));

    const year = date.getFullYear()
    const month = (date.getMonth()+1).toLocaleString(undefined, {minimumIntegerDigits: 2})
    const day = date.getDate().toLocaleString(undefined, {minimumIntegerDigits: 2})

    const compatDate = `${year}-${month}-${day}`

    const url = `https://esi.evetech.net/meta/openapi.json?compatibility_date=${compatDate}`;

    try {
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        const data = await res.json();
        writeFileSync(path.resolve(__dirname, "../esi.json"), JSON.stringify(data, null, 2));
        console.log("ESI spec saved to esi.json");
    } catch (error) {
        console.error("Error fetching ESI spec:", error);
    }
}

fetchEsiSpec();