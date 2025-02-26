import { describe, expect, it } from "vitest";
import { HumanityProtocolVerifier } from "../humanity";

const sampleCredential = {
	message: "Credential issued successfully",
	credential: {
		"@context": ["https://www.w3.org/ns/credentials/v2"],
		type: ["VerifiableCredential"],
		issuer:
			"did:key:zUC72jLAC7CFjxk9FDM4fBwx5fYDdesDSn3dT8i38ZEcq6iGdBRGFcBUGczVjbHQbEHvY9rhSBpAuvjjqrze9o7cxtpbJ7Vbi4eDdjyGFMCaexgpeRABVX1uDUoxrkeQjN14k2C",
		validFrom: "2025-02-24T18:01:56.176Z",
		validUntil: "",
		credentialSubject: {
			id: "did:ethr:0x0fa4adf7830a048c285e981ba5d57c51604c917f",
			kyc: "passed",
			age: 22,
			nationality: "US",
		},
		id: "urn:uuid:4875f1c7-ec6e-44e5-a185-22dd11b6358f",
		credentialStatus: {
			type: "T3RevocationRegistry",
			chain_id: "1942999413",
			revocation_registry_contract_address:
				"0xB7676D6881f3642b27dF77a4f2e2060F4CBa2594",
			did_registry_contract_address:
				"0x9ec4D6B69926e80316Bf9c1E0A2b2Ae4b8bde707",
		},
		proof: {
			type: "DataIntegrityProof",
			cryptosuite: "bbs-2023",
			created: "2025-02-24T18:01:56.748Z",
			verificationMethod:
				"did:key:zUC72jLAC7CFjxk9FDM4fBwx5fYDdesDSn3dT8i38ZEcq6iGdBRGFcBUGczVjbHQbEHvY9rhSBpAuvjjqrze9o7cxtpbJ7Vbi4eDdjyGFMCaexgpeRABVX1uDUoxrkeQjN14k2C",
			proofPurpose: "assertionMethod",
			proofValue:
				"2V0ChVhwl9SfxFjLP7CHWsTHHUeHGfeDinxyU3vnNDOC68QDB42cOuI9QBzJWFhxqfeoUtgVMKVg9X44OT7IyqxonIH7xLuNJjBkG7KYma9urLMBCo4x5JoTWPaG1p7URXapIpy1ng-avITVXJin9XQoxPxyNFhAPswI0puMB7ZGscyQSJD3av5XgKW4KyMRHo3b0h58zYyUkjB6UB_PdZkz-XfYAW7Kr8x817nUXpKhWlIuVqDuGFhghTmtt-ysKbIxRPmJgCUDX1gMWH_XKd3fwgY5NXXNlwIDTo8qcnQ5Wsa_Hl6u4UuQE_srwQGxP8M3k9_M1zFrw39muVsXXuaFQM2hTTOoSUehu9biK4SnJqdgkYj606DpWCAYAlTuVFQsdp73v1KzQ-v6DeLzvC1Al2p8OuEM3grHAYZJL0Bjb250ZXh0Qy9pZEdvaXNzdWVyRS90eXBlSi92YWxpZEZyb21LL3ZhbGlkVW50aWw",
		},
	},
};

describe("Humanity Protocol Human + Age Verification", () => {
	it("should verify that the person is a KYC-ed human according to humanity protocol", async () => {
		const verifier = new HumanityProtocolVerifier();

		const isValid = await verifier.verify(
			"0x0fa4adf7830a048c285e981ba5d57c51604c917f",
		);

		expect(isValid).toBe(true);
	}, 120_000);

	it("should verify that the person is not a KYC-ed human according to humanity protocol", async () => {
		const verifier = new HumanityProtocolVerifier();

		const isValid = await verifier.verify(
			"0x0b63a6E23eE003A5A1B7a7334FFA12C61CC2Aa9b",
		);

		expect(isValid).toBe(false);
	}, 120_000);
});
