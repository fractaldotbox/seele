export type EasData = {
	eas: string;
	easAttestedByMemberSchema: string;
	easAttestedByEditorSchema: string;
	gqlBaseUrl: string;
	baseUrl: string;
};

export type SupportedChains = "sepolia" | "baseSepolia" | "optimismSepolia";

export function getEasDataByChain(
	chain: SupportedChains = "baseSepolia",
): EasData {
	const chainData = {
		sepolia: {
			eas: "0x0000000000000000000000000000000000000000",
			easAttestedByMemberSchema: "0x0000000000000000000000000000000000000000",
			easAttestedByEditorSchema: "0x0000000000000000000000000000000000000000",
			gqlBaseUrl: "https://sepolia.easscan.org/graphql",
			baseUrl: "https://sepolia.easscan.org",
		},
		baseSepolia: {
			eas: "0x4200000000000000000000000000000000000021",
			easAttestedByMemberSchema:
				"0xb289765ce7c34a78028312dcd0e25792d258d66cb86a1c924352df646f6c0f8d",
			easAttestedByEditorSchema:
				"0x2d187b5ddc9e62760d5af49d942ad67f3879d975fbd6f026a78bf971d075d3d6",
			gqlBaseUrl: "https://base-sepolia.easscan.org/graphql",
			baseUrl: "https://base-sepolia.easscan.org",
		},
		optimismSepolia: {
			eas: "0x0000000000000000000000000000000000000000",
			easAttestedByMemberSchema: "0x0000000000000000000000000000000000000000",
			easAttestedByEditorSchema: "0x0000000000000000000000000000000000000000",
			gqlBaseUrl: "https://optimism-sepolia.easscan.org/graphql",
			baseUrl: "https://optimism-sepolia.easscan.org",
		},
	};

	if (!(chain in chainData)) {
		throw new Error(`Unsupported chain: ${chain}`);
	}

	return chainData[chain];
}
