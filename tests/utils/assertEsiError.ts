import { expect } from "@jest/globals";
import { EsiError } from "../../src";

export function assertEsiError(obj : any): asserts obj is EsiError {
    expect(obj).toHaveProperty("error");
    expect(obj).toHaveProperty("response");
    expect(obj).toHaveProperty("status");
}