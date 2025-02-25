import { describe, it, expect } from "vitest";
import { fetchOptimisticPriceRequests } from "../queries";
import { buildEthFactBank } from "../polymarket";

describe("Polymarket", () => {
  it("should fetch optimistic price requests", async () => {
    const result = await buildEthFactBank(300);
    console.log(result);
  }, 60_000);
});
