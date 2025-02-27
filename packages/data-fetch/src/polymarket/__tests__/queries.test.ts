import { describe, expect, it } from "vitest";
import { fetchOptimisticPriceRequests } from "../queries";

describe("Polymarket Queries", () => {
	it("should fetch optimistic price requests", async () => {
		const result = await fetchOptimisticPriceRequests();
		// console.log(result);
	}, 60_000);
});
