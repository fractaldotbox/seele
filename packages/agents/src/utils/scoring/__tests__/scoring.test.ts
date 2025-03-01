import { describe, it, expect } from "vitest";
import { computeScoreByAddress } from "../scoring";
import type { Address } from "viem";

describe("computeScoreByAddress", () => {
  it("should return the score for a given address", async () => {
    const mockAddress: Address = "0x6e3eAffd3643dB8FfBE5973A4Ccf64F2F9AA9cfd"; // Arbitrary address

    // Assuming the actual GraphQL endpoint is accessible and returns valid data
    const score = await computeScoreByAddress(mockAddress);

    console.log(score);

    expect(score).toBeGreaterThanOrEqual(0); // Expecting the score to be a non-negative number
  });
});
