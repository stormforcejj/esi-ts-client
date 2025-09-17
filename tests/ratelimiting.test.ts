import { describe, expect, test } from "@jest/globals";
import { EsiClient } from "../src";

describe("Ratelimiting", () => {
    const esi = new EsiClient({bypassCache: true});

    test('should limit tests to 100 per second', async () => {
        const start = Date.now()

        await Promise.all([
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
            esi.statusApi.getStatus(),
        ]);

        const elapsed = Date.now() - start;

        expect(elapsed).toBeGreaterThanOrEqual(100)
    })
})