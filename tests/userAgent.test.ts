import { EsiClient } from "../src";
import { describe, expect, jest, test } from "@jest/globals";

describe("User Agent", () => {
    test("should be added to all requests", async () => {
        const uA = process.env.ESI_USER_AGENT;
        process.env.ESI_USER_AGENT = "testing";
        
        const esi = new EsiClient({bypassCache: true});

        const fetchSpy = jest.spyOn(global, 'fetch');

        await esi.statusApi.getStatus()

        expect(fetchSpy).toHaveBeenCalledTimes(1)
        const [url, init] = fetchSpy.mock.calls[0];
        expect(url).toContain('/status')

        const headers = new Headers(init?.headers)
        expect(headers.get("X-User-Agent")).toContain("testing");

        process.env.ESI_USER_AGENT = uA;
        fetchSpy.mockRestore()
    });

    test('should not expect an empty string', async () => {
        const uA = process.env.ESI_USER_AGENT;
        process.env.ESI_USER_AGENT = "";

        const t = () => {
            const esi = new EsiClient();
        }

        expect(t).toThrow()

        process.env.ESI_USER_AGENT = uA;
    })
});
