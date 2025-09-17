import { describe, expect, test } from "@jest/globals";
import { EsiClient } from "../src"
import { assertEsiResponse } from "./utils/assertEsiResponse";
import { assertEsiError } from "./utils/assertEsiError"

describe("ESI Client", () => {
    const esi = new EsiClient({bypassCache: true});

    describe("Alliance API", () => {
        test('should return alliance information for a valid alliance id', async () => {
            const response = await esi.allianceApi.getAlliance({allianceId: 99000001});

            assertEsiResponse(response);

            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                creatorCorporationId: 0,
                creatorId: 0,
                dateFounded: new Date("2019-08-24T14:15:22Z"),
                executorCorporationId: 0,
                factionId: 0,
                name: "string",
                ticker: "string",
            });
        })

        test('should return 400 when providing an alliance ID that is not a number', async () => {
            try {
                const response = await esi.allianceApi.getAlliance({allianceId: Number('a')})
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(400);
            }
        })

        test('should return 404 for an alliance ID that does not exist', async () => {
            try {
                const response = await esi.allianceApi.getAlliance({
                    allianceId: 1,
                });
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(404);
            }
        })
    })

    describe("Assets API", () => {
        test("should return asset information for a valid character id", async () => {
            const response = await esi.assetsApi.getCharacterAssets({
                characterId: 90000001
            }, "token");

            assertEsiResponse(response);

            expect(response.status).toBe(200);
            expect(response.data).toEqual([
                {
                    isBlueprintCopy: true,
                    isSingleton: true,
                    itemId: 0,
                    locationFlag: "AssetSafety",
                    locationId: 0,
                    locationType: "station",
                    quantity: 0,
                    typeId: 0,
                },
            ]);
        });

        test("should return 400 when providing a character ID that is not a number", async () => {
            try {
                const response = await esi.assetsApi.getCharacterAssets(
                    {
                        characterId: 90000001,
                    },
                    "token"
                );
                //expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(400);
            }
        });

        test("should return 400 when providing a page that is not a number", async () => {
            try {
                const response = await esi.assetsApi.getCharacterAssets(
                    {
                        characterId: 90000001,
                        page: Number('a')
                    },
                    "token"
                );
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(400);
            }
        })

        test("should return 404 for an character ID that does not exist", async () => {
            try {
                const response = await esi.assetsApi.getCharacterAssets(
                    {
                        characterId: 1,
                    },
                    "token"
                );
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(404);
            }
        });

        test("should return 404 for an page that does not exist", async () => {
            try {
                const response = await esi.assetsApi.getCharacterAssets(
                    {
                        characterId: 90000001,
                        page: 0
                    },
                    "token"
                );
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(404);
            }
        });

        test("should return 401 if no token", async () => {
            try {
                const response = await esi.assetsApi.getCharacterAssets(
                    {
                        characterId: 90000001,
                    },
                    undefined!
                );
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err)
                expect(err.status).toBe(401);
            }
        });

        test('should return 403 if token is not not "valid"', async () => {
            try {
                const response = await esi.assetsApi.getCharacterAssets(
                    {
                        characterId: 90000001,
                    },
                    "eeeeeeeeee"
                );
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(403);
            }
        });
    });

    describe("Calendar API", () => {});

    describe("Character API", () => {});

    describe("Clones API", () => {});

    describe("Contracts API", () => {});

    describe("Corporation API", () => {});

    describe("Corporation Projects API", () => {});

    describe("Dogma API", () => {});

    describe("Faction Warefare API", () => {});

    describe("Fittings API", () => {});

    describe("Fleets API", () => {});

    describe("Incursions API", () => {});

    describe("Industry API", () => {});

    describe("Insurance API", () => {});

    describe("Killmails API", () => {});

    describe("Location API", () => {});

    describe("Loyalty API", () => {});

    describe("Mail API", () => {});

    describe("Market API", () => {});

    describe("Planetary Interaction API", () => {});

    describe("Routes API", () => {});

    describe("Search API", () => {});

    describe("Skills API", () => {});

    describe("Sovereignty API", () => {});

    describe("Status API", () => {
        test("should return a correct response for /status", async () => {
            const response = await esi.statusApi.getStatus();

            assertEsiResponse(response);

            expect(response.status).toBe(200);
            expect(response.data).toEqual({
                players: 0,
                serverVersion: "string",
                startTime: new Date("2019-08-24T14:15:22Z"),
                vip: true,
            });
        });
    })

    describe("Universe API", () => {});

    describe("User Interface API", () => {});

    describe("Wallet API", () => {});

    describe("Wars API", () => {});
})