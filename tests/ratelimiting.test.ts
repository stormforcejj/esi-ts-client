import { describe, expect, test } from "@jest/globals";
import { EsiClient } from "../src";

describe("Ratelimiting", () => {
    const esi = new EsiClient({bypassCache: true});

    test('should limit requests to a single endpoint to 100 per second', async () => {
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

        expect(elapsed).toBeGreaterThanOrEqual(90)
    }, 20000)

    test("should limit requests to multiple endpoints to 100 per second per endpoint", async () => {
        const start = Date.now();

        await Promise.all([
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
            esi.statusApi.getStatus(),
            await esi.allianceApi.getAlliance({ allianceId: 99000001 }),
        ]);

        const elapsed = Date.now() - start;

        expect(elapsed).toBeGreaterThanOrEqual(90);
    }, 20000);

    test("should limit requests to a single endpoint to 100 per second", async () => {
        const start = Date.now();

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

        expect(elapsed).toBeGreaterThanOrEqual(90);
    }, 200000);

    test("should limit requests to a single history endpoint to 5 per second", async () => {
        const start = Date.now();

        await Promise.all([
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
            esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2,
            }),
        ]);

        const elapsed = Date.now() - start;

        expect(elapsed).toBeGreaterThanOrEqual(1800);
    }, 200000);
})