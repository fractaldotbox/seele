import { describe, expect, it } from "vitest";
import { buildEthFactBank } from "../polymarket";
import { fetchOptimisticPriceRequests } from "../queries";

describe("Polymarket", () => {
	it("should fetch polymarket oracles", async () => {
		const results = await buildEthFactBank(300);
		console.log(results);

		expect(results.length).toBeGreaterThan(0);
	}, 60_000);
});
