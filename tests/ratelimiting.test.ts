import { describe, expect, test } from "@jest/globals";
import { EsiClient } from "../src";
import { assertEsiError } from "./utils/assertEsiError";

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

describe('Error Limits', () => {
    const esi = new EsiClient({bypassCache: true})

    test('should have the second request wait longer until error limit resets', async () => {
        const start = Date.now();

        try {
            await esi.marketApi.getMarketsRegionHistory({regionId: 0, typeId: 5})
        } catch (err) {
            assertEsiError(err);
        }
        await esi.marketApi.getMarketsRegionHistory({ regionId: 1, typeId: 2 });

        const elapsed = Date.now() - start;

        expect(elapsed).toBeGreaterThanOrEqual(5000);
    }, 200000)

    test("should apply globally across the client", async () => {
        const start = Date.now();

        try {
            await esi.marketApi.getMarketsRegionHistory({
                regionId: 0,
                typeId: 5,
            });
        } catch (err) {
            assertEsiError(err);
        }
        await esi.statusApi.getStatus();

        const elapsed = Date.now() - start;

        expect(elapsed).toBeGreaterThanOrEqual(5000);
    }, 200000);
})

describe('Error retries', () => {
    

    test('retries failed 5xx errors automatically', async () => {
        const esi = new EsiClient({
            bypassCache: true,
            userAgentOverride: "500",
        });

        const fetchSpy = jest.spyOn(esi.statusApi as any, 'fetchApi');

        const start = Date.now()

        try {
            const response = await esi.statusApi.getStatus()
        } catch (err) {
            assertEsiError(err)
            expect(err.status).toBe(500)
        }

        const elapsed = Date.now() - start;

        expect(fetchSpy).toHaveBeenCalledTimes(4);
        expect(elapsed).toBeGreaterThan(14000)

        fetchSpy.mockRestore();
    }, 20000)

    test("override retries setting to be respected", async () => {
        const esi = new EsiClient({
            bypassCache: true,
            userAgentOverride: "500",
            retries: 1
        });

        const fetchSpy = jest.spyOn(esi.statusApi as any, "fetchApi");

        const start = Date.now();

        try {
            const response = await esi.statusApi.getStatus();
        } catch (err) {
            assertEsiError(err);
            expect(err.status).toBe(500);
        }

        const elapsed = Date.now() - start;

        expect(fetchSpy).toHaveBeenCalledTimes(2);
        expect(elapsed).toBeGreaterThan(2000);

        fetchSpy.mockRestore();
    }, 20000);
})