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
        describe('get character assets', () => {
            test("should return asset information for a valid character id", async () => {
                const response = await esi.assetsApi.getCharacterAssets(
                    {
                        characterId: 90000001,
                    },
                    "token"
                );

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
                            characterId: Number('a'),
                        },
                        "token"
                    );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    console.log(err)
                    assertEsiError(err);
                    expect(err.status).toBe(400);
                }
            });

            test("should return 400 when providing a page that is not a number", async () => {
                try {
                    const response = await esi.assetsApi.getCharacterAssets(
                        {
                            characterId: 90000001,
                            page: Number("a"),
                        },
                        "token"
                    );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(400);
                }
            });

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
                            page: 0,
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
                    assertEsiError(err);
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
        })

        describe('post character asset names', () => {
            test("should return asset names for a valid character id and body", async () => {
                const response = await esi.assetsApi.postCharacterAssetsNames(
                    {
                        characterId: 90000001,
                        requestBody: new Set([1])
                    },
                    "token"
                );

                assertEsiResponse(response);

                expect(response.status).toBe(200);
                expect(response.data).toEqual([
                    {
                        itemId: 0,
                        name: "string"
                    },
                ]);
            });

            test("should return 400 when providing a character ID that is not a number", async () => {
                try {
                    const response =
                        await esi.assetsApi.postCharacterAssetsNames(
                            {
                                characterId: Number('a'),
                                requestBody: new Set([1]),
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(400);
                }
            });

            test("should return 400 when providing a body that is not an integer set", async () => {
                try {
                    const response =
                        await esi.assetsApi.postCharacterAssetsNames(
                            {
                                characterId: 90000001,
                                requestBody: new Set([Number('a')]),
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(400);
                }
            });

            test("should return 404 for an character ID that does not exist", async () => {
                try {
                    const response =
                        await esi.assetsApi.postCharacterAssetsNames(
                            {
                                characterId: 90000002,
                                requestBody: new Set([1]),
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(404);
                }
            });

            test("should return 404 for an body not containing id 1", async () => {
                try {
                    const response =
                        await esi.assetsApi.postCharacterAssetsNames(
                            {
                                characterId: 90000001,
                                requestBody: new Set([2]),
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
                    const response =
                        await esi.assetsApi.postCharacterAssetsNames(
                            {
                                characterId: 90000001,
                                requestBody: new Set([1]),
                            },
                            undefined!
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(401);
                }
            });

            test('should return 403 if token is not not "valid"', async () => {
                try {
                    const response = await esi.assetsApi.postCharacterAssetsNames(
                    {
                        characterId: 90000001,
                        requestBody: new Set([1])
                    },
                    "e"
                );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(403);
                }
            });
        })
        
    });

    describe("Calendar API", () => {
        describe("get event", () => {
            test("should return an event for a valid event id", async () => {
                const response = await esi.calendarApi.getCharacterCalendarEvent(
                    {
                        characterId: 90000001,
                        eventId: 0
                    },
                    "token"
                );

                assertEsiResponse(response);

                expect(response.status).toBe(200);
                expect(response.data).toEqual(
                    {
                        date: new Date("2019-08-24T14:15:22Z"),
                        duration: 0,
                        eventId: 0,
                        importance: 0,
                        ownerId: 0,
                        ownerName: "string",
                        ownerType: "eve_server",
                        response: "string",
                        text: "string",
                        title: "string",
                    },
                );
            });

            test("should return 400 when providing a character ID that is not a number", async () => {
                try {
                    const response =
                        await esi.calendarApi.getCharacterCalendarEvent(
                            {
                                characterId: Number('a'),
                                eventId: 0,
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    console.log(err);
                    assertEsiError(err);
                    expect(err.status).toBe(400);
                }
            });

            test("should return 400 when providing an event ID that is not a number", async () => {
                try {
                    const response =
                        await esi.calendarApi.getCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: Number('a'),
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(400);
                }
            });

            test("should return 404 for an character ID that does not exist", async () => {
                try {
                    const response =
                        await esi.calendarApi.getCharacterCalendarEvent(
                            {
                                characterId: 0,
                                eventId: 0,
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(404);
                }
            });

            test("should return 404 for an event ID that does not exist", async () => {
                try {
                    const response =
                        await esi.calendarApi.getCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: -1,
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
                    const response =
                        await esi.calendarApi.getCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: 0,
                            },
                            undefined!
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(401);
                }
            });

            test('should return 403 if token is not not "valid"', async () => {
                try {
                    const response =
                        await esi.calendarApi.getCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: 0,
                            },
                            "e"
                        );
                    expect(response.status).not.toBe(200);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(403);
                }
            });
        })

        describe("put event", () => {
            test("should return 204 for a valid event response", async () => {
                const response =
                    await esi.calendarApi.putCharacterCalendarEvent(
                        {
                            characterId: 90000001,
                            eventId: 0,
                            putCharacterCalendarEventRequest: {
                                response: "accepted"
                            }
                        },
                        "token"
                    );

                assertEsiResponse(response);

                expect(response.status).toBe(204);
            });

            test("should return 400 when providing an invalid response", async () => {
                try {
                    const response =
                        await esi.calendarApi.putCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: 0,
                                putCharacterCalendarEventRequest: {
                                    response: undefined!
                                },
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(204);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(400);
                }
            });

            test("should return 404 for an character ID that does not exist", async () => {
                try {
                    const response =
                        await esi.calendarApi.putCharacterCalendarEvent(
                            {
                                characterId: 0,
                                eventId: 0,
                                putCharacterCalendarEventRequest: {
                                    response: "accepted",
                                },
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(204);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(404);
                }
            });

            test("should return 404 for an event ID that does not exist", async () => {
                try {
                    const response =
                        await esi.calendarApi.putCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: 1,
                                putCharacterCalendarEventRequest: {
                                    response: "accepted",
                                },
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(204);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(404);
                }
            });

            test("should return 404 for an response that is not accepted", async () => {
                try {
                    const response =
                        await esi.calendarApi.putCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: 1,
                                putCharacterCalendarEventRequest: {
                                    response: "declined",
                                },
                            },
                            "token"
                        );
                    expect(response.status).not.toBe(204);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(404);
                }
            });

            test("should return 401 if no token", async () => {
                try {
                    const response =
                        await esi.calendarApi.putCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: 0,
                                putCharacterCalendarEventRequest: {
                                    response: "accepted",
                                },
                            },
                            undefined!
                        );
                    expect(response.status).not.toBe(204);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(401);
                }
            });

            test('should return 403 if token is not not "valid"', async () => {
                try {
                    const response =
                        await esi.calendarApi.putCharacterCalendarEvent(
                            {
                                characterId: 90000001,
                                eventId: 0,
                                putCharacterCalendarEventRequest: {
                                    response: "accepted",
                                },
                            },
                            "e"
                        );
                    expect(response.status).not.toBe(204);
                } catch (err) {
                    assertEsiError(err);
                    expect(err.status).toBe(403);
                }
            });
        });
    });

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

    describe("Market API", () => {
        test("should return market history for a region id", async () => {
            const response = await esi.marketApi.getMarketsRegionHistory({
                regionId: 1,
                typeId: 2
            });

            assertEsiResponse(response);

            expect(response.status).toBe(200);
            expect(response.data).toEqual([{
                average: 0,
                date: new Date("2019-08-24"),
                highest: 0,
                lowest: 0,
                orderCount: 0,
                volume: 0
            }]);
        });

        test("should return 400 when providing an region ID that is not a number", async () => {
            try {
                const response = await esi.marketApi.getMarketsRegionHistory({
                    regionId: Number('a'),
                    typeId: 2,
                });
                expect(response.status).not.toBe(200);
            } catch (err) {
                assertEsiError(err);
                expect(err.status).toBe(400);
            }
        });
    });

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