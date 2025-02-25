import { describe, expect, it } from "vitest";
import {
	getInfluentialEnsTwitters,
	getSocialsFromEns,
	getTop200EnsSocials,
} from "../ens";

describe("ENS Social Records", () => {
	it("should fetch social records for a valid ENS name", async () => {
		const ensName = "vitalik.eth";
		const socialMediaRecords = await getSocialsFromEns(ensName);

		expect(socialMediaRecords).toEqual({
			twitter: "VitalikButerin",
			github: "vbuterin",
		});
	});

	it("should fetch social records for the top 200 ENS names", async () => {
		const data = await getTop200EnsSocials();
		console.log(data);
	});

	it("should fetch social records for the influential ENS names", async () => {
		const data = await getInfluentialEnsTwitters();
		console.log(data);
	});
});
