export type EasData = {
  eas: string;
  easAttestedByMemberSchema: string;
  gqlBaseUrl: string;
};

export type SupportedChains = "sepolia" | "baseSepolia" | "optimismSepolia";

export function getEasDataByChain(
  chain: SupportedChains = "baseSepolia",
): EasData {
  const chainData = {
    sepolia: {
      eas: "0x0000000000000000000000000000000000000000",
      easAttestedByMemberSchema: "0x0000000000000000000000000000000000000000",
      gqlBaseUrl: "https://sepolia.easscan.org/graphql",
    },
    baseSepolia: {
      eas: "0x4200000000000000000000000000000000000021",
      easAttestedByMemberSchema:
        "0xb289765ce7c34a78028312dcd0e25792d258d66cb86a1c924352df646f6c0f8d",
      gqlBaseUrl: "https://base-sepolia.easscan.org/graphql",
    },
    optimismSepolia: {
      eas: "0x0000000000000000000000000000000000000000",
      easAttestedByMemberSchema: "0x0000000000000000000000000000000000000000",
      gqlBaseUrl: "https://optimism-sepolia.easscan.org/graphql",
    },
  };

  if (!(chain in chainData)) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  return chainData[chain];
}
