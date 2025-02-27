import type { EasData, SupportedChains } from "./types";

export function getEasDataByChain(
	chain: SupportedChains = "baseSepolia",
): EasData {
	const chainData = {
		sepolia: {
			eas: "0x0000000000000000000000000000000000000000",
			easAttestedByMemberSchema: "0x0000000000000000000000000000000000000000",
			gqlBaseUrl: "https://sepolia.easscan.org/graphql",
			baseUrl: "https://sepolia.easscan.org",
		},
		baseSepolia: {
			eas: "0x4200000000000000000000000000000000000021",
			easAttestedByMemberSchema:
				"0xb289765ce7c34a78028312dcd0e25792d258d66cb86a1c924352df646f6c0f8d",
			gqlBaseUrl: "https://base-sepolia.easscan.org/graphql",
			baseUrl: "https://base-sepolia.easscan.org",
		},
		optimismSepolia: {
			eas: "0x0000000000000000000000000000000000000000",
			easAttestedByMemberSchema: "0x0000000000000000000000000000000000000000",
			gqlBaseUrl: "https://optimism-sepolia.easscan.org/graphql",
			baseUrl: "https://optimism-sepolia.easscan.org",
		},
	};

	if (!(chain in chainData)) {
		throw new Error(`Unsupported chain: ${chain}`);
	}

	return chainData[chain];
}

export function getChainNameFromId(chainId: number): SupportedChains {
	const chainIdMap: Record<number, SupportedChains> = {
		11155111: "sepolia",
		84532: "baseSepolia",
		11155420: "optimismSepolia",
	};

	const chainName = chainIdMap[chainId];
	if (!chainName) {
		throw new Error(`Unsupported chain ID: ${chainId}`);
	}

	return chainName;
}
