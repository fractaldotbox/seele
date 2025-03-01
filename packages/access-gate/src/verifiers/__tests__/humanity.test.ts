import { describe, expect, it } from "vitest";
import { sampleCredential } from "../../lib/humanity/fixtures";
import { issueCredentials } from "../../lib/humanity/queries";
import { HumanityProtocolVerifier } from "../humanity";

describe("Humanity Protocol Human + Age Verification", () => {
	// biome-ignore lint/suspicious/noFocusedTests: <explanation>
	it.skip("issue some creentials", async () => {
		const verifier = new HumanityProtocolVerifier();

		const credentials = await issueCredentials(
			"0x6e3eAffd3643dB8FfBE5973A4Ccf64F2F9AA9cfd",
			{
				isHuman: true,
			},
		);

		console.log(credentials);
	}, 120_000);

	it("should verify that the person is a KYC-ed human according to humanity protocol", async () => {
		const verifier = new HumanityProtocolVerifier();

		const isValid = await verifier.verify(
			"0x6e3eaffd3643db8ffbe5973a4ccf64f2f9aa9cfd",
			{
				credential: sampleCredential,
			},
		);

		expect(isValid).toBe(true);
	}, 120_000);

	it("should verify that the person is not a KYC-ed human according to humanity protocol", async () => {
		const verifier = new HumanityProtocolVerifier();

		const isValid = await verifier.verify(
			"0x6e3eaffd3643db8ffbe5973a4ccf64f2f9aa9cfd",
			{
				credential: {
					...sampleCredential,
					credentialSubject: {
						...sampleCredential.credentialSubject,
						isHuman: false,
					},
				},
			},
		);

		expect(isValid).toBe(false);
	}, 120_000);

	it("invalid proof", async () => {
		const verifier = new HumanityProtocolVerifier();

		const isValid = await verifier.verify(
			"0x6e3eaffd3643db8ffbe5973a4ccf64f2f9aa9cfd",
			{
				credential: {
					...sampleCredential,
					proof: {
						...sampleCredential.proof,
						proofValue: "invalid",
					},
				},
			},
		);

		expect(isValid).toBe(false);
	}, 120_000);
});
