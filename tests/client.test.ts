import { describe } from '@jest/globals'

jest.mock("../src/generated/esi-client", () => {
    return {
        EsiClient: jest.fn(),
    };
});

import { getEsiClient, EsiClient } from "../src";

describe('Obtaining client', () => {
    beforeEach(() => {
        (EsiClient as jest.Mock).mockClear();
    });

    test('getEsiClient should generate a new client if none exists or return the existing client', () => {
        const c1 = getEsiClient();
        const c2 = getEsiClient();
        const c3 = getEsiClient();

        const MockedEsiClient = EsiClient as jest.MockedClass<typeof EsiClient>;

        expect(MockedEsiClient).toHaveBeenCalledTimes(1);
        expect(c1).toBeInstanceOf(EsiClient)
        expect(c1).toBe(c2)
        expect(c2).toBe(c3)
    })
})