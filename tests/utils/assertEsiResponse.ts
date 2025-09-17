import { expect } from "@jest/globals";
import { EsiResponse } from "../../src";

export function assertEsiResponse(obj : any): asserts obj is EsiResponse<unknown> {
    expect(obj).toHaveProperty("data");
    expect(obj).toHaveProperty("headers");
    expect(obj).toHaveProperty("status");
}