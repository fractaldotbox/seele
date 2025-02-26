import { describe, expect, it } from "vitest";
import { Permissions } from "../../lib/eas/constants";
import { EASAttestedByMemberVerifier } from "../eas";

describe.skip("EASAttestedByMemberVerifier", () => {
	const verifier = new EASAttestedByMemberVerifier();

	it("should verify an address - true", async () => {
		const result = await verifier.verify(
			"0x6e3eAffd3643dB8FfBE5973A4Ccf64F2F9AA9cfd",
			{
				chain: "baseSepolia",
				byMember: "0x8fe013539a6c07Ac87F6d8171a103f7423ba183d",
				scope: [Permissions.ProvideInfo],
			},
		);
		expect(result).toBe(true);
	}, 60000);

	it("should verify an address - false", async () => {
		const result = await verifier.verify(
			"0x6e3eAffd3643dB8FfBE5973A4Ccf64F2F9AA9cfd",
			{
				chain: "baseSepolia",
				byMember: "0x8fe013539a6c07Ac87F6d8171a103f7423ba183d",
				scope: [Permissions.Vote],
			},
		);
		expect(result).toBe(false);
	}, 60000);

	it("should verify an address - false - revoked", async () => {
		const result = await verifier.verify(
			"0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
			{
				chain: "baseSepolia",
				byMember: "0x8fe013539a6c07Ac87F6d8171a103f7423ba183d",
				scope: [Permissions.Vote],
			},
		);
		expect(result).toBe(false);
	}, 60000);
});
