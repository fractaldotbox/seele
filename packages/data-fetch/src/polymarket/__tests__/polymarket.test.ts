import { describe, expect, it } from "vitest";
import { buildEthFactBank } from "../polymarket";
import { fetchOptimisticPriceRequests } from "../queries";

describe("Polymarket", () => {
	it("should fetch optimistic price requests", async () => {
		const result = await buildEthFactBank(300);
		console.log(result);
	}, 60_000);
});
