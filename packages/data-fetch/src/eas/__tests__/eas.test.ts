import { describe, expect, it } from "vitest";
import { getCMSWhitelistedAddresses } from "../eas";

describe("getCMSWhitelistedAddresses", () => {
	it("should return an empty array", async () => {
		const addresses = await getCMSWhitelistedAddresses(11155111);
		expect(addresses).toEqual([]);
	});

	it("should return a non empty array", async () => {
		const addresses = await getCMSWhitelistedAddresses(84532);
		expect(addresses.length).toBeGreaterThan(0);
	});
});
