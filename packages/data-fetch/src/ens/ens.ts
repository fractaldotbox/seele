import { createEnsPublicClient } from "@ensdomains/ensjs";
import { baseSepolia, mainnet, sepolia } from "viem/chains";
import { createPublicClient, http } from "viem";
import { normalize } from "viem/ens";

// Create the client
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export const getSocialsFromEns = async (
  ensName: string,
): Promise<{ twitter: string | null; github: string | null }> => {
  const twitter = await publicClient.getEnsText({
    name: normalize(ensName),
    key: "com.twitter",
  });

  const github = await publicClient.getEnsText({
    name: normalize(ensName),
    key: "com.github",
  });

  return {
    twitter: twitter ?? null,
    github: github ?? null,
  };
};
