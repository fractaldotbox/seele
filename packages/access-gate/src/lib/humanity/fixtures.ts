export const sampleCredential = {
	"@context": ["https://www.w3.org/ns/credentials/v2"],
	type: ["VerifiableCredential"],
	issuer:
		"did:key:zUC72jLAC7CFjxk9FDM4fBwx5fYDdesDSn3dT8i38ZEcq6iGdBRGFcBUGczVjbHQbEHvY9rhSBpAuvjjqrze9o7cxtpbJ7Vbi4eDdjyGFMCaexgpeRABVX1uDUoxrkeQjN14k2C",
	validFrom: "2025-02-28T20:48:41.370Z",
	validUntil: "",
	credentialSubject: {
		id: "did:ethr:0x6e3eaffd3643db8ffbe5973a4ccf64f2f9aa9cfd",
		isHuman: true,
	},
	id: "urn:uuid:d2848014-6eb5-4b15-9a49-524e88776b4c",
	credentialStatus: {
		type: "T3RevocationRegistry",
		chain_id: "1942999413",
		revocation_registry_contract_address:
			"0xB7676D6881f3642b27dF77a4f2e2060F4CBa2594",
		did_registry_contract_address: "0x9ec4D6B69926e80316Bf9c1E0A2b2Ae4b8bde707",
	},
	proof: {
		type: "DataIntegrityProof",
		cryptosuite: "bbs-2023",
		created: "2025-02-28T20:48:41.944Z",
		verificationMethod:
			"did:key:zUC72jLAC7CFjxk9FDM4fBwx5fYDdesDSn3dT8i38ZEcq6iGdBRGFcBUGczVjbHQbEHvY9rhSBpAuvjjqrze9o7cxtpbJ7Vbi4eDdjyGFMCaexgpeRABVX1uDUoxrkeQjN14k2C",
		proofPurpose: "assertionMethod",
		proofValue:
			"2V0ChVhwsUvsMSGa1kAnkFYy33hXEcGMaQ5iBnQKWEfdneVuamje01Ww4MfT6wQK04j2QdKsYUHlKfzccE4m7waZyoLEkBLFiK2g54Q2i-CdtYBgDdkUDsoULSBMcH1MwGHwdjfXpldFNFrHFx_IAvLVniyeMVhAe553IWz-pCx_5O__8HI3EPyjzEdyluRgLQtESrjaBHW0mqTAgzc1i9bu8a4--rGoYU9t7jarLcflwoCCpFgBUVhghTmtt-ysKbIxRPmJgCUDX1gMWH_XKd3fwgY5NXXNlwIDTo8qcnQ5Wsa_Hl6u4UuQE_srwQGxP8M3k9_M1zFrw39muVsXXuaFQM2hTTOoSUehu9biK4SnJqdgkYj606DpWCBcJTsM008IVP-ulYYCPq-8ndUlntikUZ9lt2lkJZ9vhYZJL0Bjb250ZXh0Qy9pZEcvaXNzdWVyRS90eXBlSi92YWxpZEZyb21LL3ZhbGlkVW50aWw",
	},
};
