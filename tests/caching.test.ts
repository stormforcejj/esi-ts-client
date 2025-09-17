import { describe, expect, jest, test } from "@jest/globals";
import jwt from 'jsonwebtoken'
import { generateCacheHeaderHash, initCache } from "../src/lib/caching";
import Keyv from "keyv";
import KeyvRedis from "@keyv/redis";
import { EsiClient } from "../src";
import { assertEsiResponse } from "./utils/assertEsiResponse";

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

            expect(cache.store).toBeInstanceOf(KeyvRedis)

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
    })
})