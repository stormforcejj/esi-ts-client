import { describe, expect, test } from "@jest/globals";
import jwt from 'jsonwebtoken'
import { generateCacheHeaderHash, initCache } from "../src/lib/caching";
import Keyv from "keyv";
import { EsiClient } from "../src";
import { assertEsiResponse } from "./utils/assertEsiResponse";
import { assertEsiError } from "./utils/assertEsiError"

import KeyvRedis from "@keyv/redis";

jest.mock("@keyv/redis", () => {
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(() => {
            return {
                store: {},
                on: jest.fn(),
                get: jest.fn(),
                set: jest.fn(),
                delete: jest.fn(),
                clear: jest.fn(),
            };
        }),
    };
});

const KeyvRedisMock = KeyvRedis as jest.Mock;

let envBackup: NodeJS.ProcessEnv;

beforeEach(() => {
    envBackup = { ...process.env };

    jest.clearAllMocks();
});

afterEach(() => {
    process.env = envBackup;
});

describe("Caching", () => {
    describe("headers hashing", () => {
        test("should generate the same header hash even if two tokens are different (but have the same sub)", () => {
            const headers1: HeadersInit = [
                ["Authorization", jwt.sign({ sub: "test" }, "secret")],
                ["Accept-Language", "en"],
            ];

            const headers2: HeadersInit = [
                ["Authorization", jwt.sign({ sub: "test" }, "secret2")],
                ["Accept-Language", "en"],
            ];

            const hash1 = generateCacheHeaderHash({headers: headers1})
            const hash2 = generateCacheHeaderHash({headers: headers2})

            expect(hash1).toBe(hash2)
        });

        test("should generate the different hashes if languages are different", () => {
            const headers1: HeadersInit = [
                ["Authorization", jwt.sign({ sub: "test" }, "secret")],
                ["Accept-Language", "en"],
            ];

            const headers2: HeadersInit = [
                ["Authorization", jwt.sign({ sub: "test" }, "secret")],
                ["Accept-Language", "fr"],
            ];

            const hash1 = generateCacheHeaderHash({ headers: headers1 });
            const hash2 = generateCacheHeaderHash({ headers: headers2 });

            expect(hash1).not.toBe(hash2);
        });
    })
    
    describe("init caching", () => {
        test("should be able to generate a memory cache", () => {
            const env = process.env.ESI_CACHE_STRATEGY;
            process.env.ESI_CACHE_STRATEGY = "memory"

            const cache = initCache()

            expect(cache).toBeInstanceOf(Keyv)

            process.env.ESI_CACHE_STRATEGY = env
        })

        test("should be able to generate a redis cache", async () => {
            const strat = process.env.ESI_CACHE_STRATEGY;
            const host = process.env.ESI_REDIS_HOST;
            process.env.ESI_CACHE_STRATEGY = "redis";
            process.env.ESI_REDIS_HOST = "127.0.0.1";

            const cache = initCache();

            expect(cache).toBeInstanceOf(Keyv)
            expect(KeyvRedisMock).toHaveBeenCalled();

            process.env.ESI_CACHE_STRATEGY = strat
            process.env.ESI_REDIS_HOST = host
        });
    })
    
    describe("middleware", () => {
        test('should return cached response from middleware on second call', async () => {
            const esi = new EsiClient()

            const fetchSpy = jest.spyOn(global, 'fetch');

            const res1 = await esi.statusApi.getStatus();

            assertEsiResponse(res1);
            expect(res1.status).toBe(200);
            expect(res1.data).toEqual({
                players: 0,
                serverVersion: "string",
                startTime: new Date("2019-08-24T14:15:22Z"),
                vip: true,
            });
            expect(fetchSpy).toHaveBeenCalledTimes(1)

            const res2 = await esi.statusApi.getStatus();

            assertEsiResponse(res2);
            expect(res2.status).toBe(200);
            expect(res2.data).toEqual({
                players: 0,
                serverVersion: "string",
                startTime: new Date("2019-08-24T14:15:22Z"),
                vip: true,
            });
            expect(fetchSpy).toHaveBeenCalledTimes(1);
            
            fetchSpy.mockRestore()
        })

        test("should not cache on bad response code", async () => {
            const esi = new EsiClient({userAgentOverride: "500", retries: 0});

            const fetchSpy = jest.spyOn(global, "fetch");

            try {
                const res1 = await esi.statusApi.getStatus();
            } catch(err) {
                assertEsiError(err);
            }
            
            expect(fetchSpy).toHaveBeenCalledTimes(1);

            try {
                const res2 = await esi.statusApi.getStatus();
            } catch(err) {
                assertEsiError(err)
            }

            expect(fetchSpy).toHaveBeenCalledTimes(2);

            fetchSpy.mockRestore();
        });

        test("should not cache a non GET request", async () => {
            const esi = new EsiClient();

            const fetchSpy = jest.spyOn(global, "fetch");

            const res1 = await esi.assetsApi.postCharacterAssetsNames(
                {
                    characterId: 90000001,
                    requestBody: new Set([1]),
                },
                "token"
            );

            assertEsiResponse(res1);
            expect(res1.status).toBe(200);
            expect(res1.data).toEqual([
                    {
                        itemId: 0,
                        name: "string"
                    },
            ]);
            expect(fetchSpy).toHaveBeenCalledTimes(1);

            const res2 = await await esi.assetsApi.postCharacterAssetsNames(
                {
                    characterId: 90000001,
                    requestBody: new Set([1]),
                },
                "token"
            );

            assertEsiResponse(res2);
            expect(res2.status).toBe(200);
            expect(res2.data).toEqual([
                {
                    itemId: 0,
                    name: "string",
                },
            ]);
            expect(fetchSpy).toHaveBeenCalledTimes(2);

            fetchSpy.mockRestore();
        })
    })

    describe("redis", () => {
        test('throws if host is missing from env', () => {
            process.env.ESI_CACHE_STRATEGY = "redis";
            delete process.env.ESI_REDIS_HOST;

            expect(() => initCache()).toThrow("ESI Client: Redis host must be specified")
        })

        test('uses redis protocol when tls is false', () => {
            process.env.ESI_CACHE_STRATEGY = "redis";
            process.env.ESI_REDIS_HOST = "localhost";
            process.env.ESI_REDIS_TLS = "false";

            initCache()

            expect(KeyvRedisMock).toHaveBeenCalledWith(
                "redis://localhost:6379"
            );
        })

        test("uses rediss protocol when tls is true", () => {
            process.env.ESI_CACHE_STRATEGY = "redis";
            process.env.ESI_REDIS_HOST = "localhost";
            process.env.ESI_REDIS_TLS = "true";

            initCache();

            expect(KeyvRedisMock).toHaveBeenCalledWith(
                "rediss://localhost:6379"
            );
        });

        test("includes user and password in the URL", () => {
            process.env.ESI_CACHE_STRATEGY = "redis";
            process.env.ESI_REDIS_HOST = "localhost";
            process.env.ESI_REDIS_USER = "user";
            process.env.ESI_REDIS_PASSWORD = "password";

            initCache();

            expect(KeyvRedisMock).toHaveBeenCalledWith(
                "redis://user:password@localhost:6379"
            );
        });

        test("includes only password in the URL if no user", () => {
            process.env.ESI_CACHE_STRATEGY = "redis";
            process.env.ESI_REDIS_HOST = "localhost";
            delete process.env.ESI_REDIS_USER;
            process.env.ESI_REDIS_PASSWORD = "password";

            initCache();

            expect(KeyvRedisMock).toHaveBeenCalledWith(
                "redis://password@localhost:6379"
            );
        });
    })
})