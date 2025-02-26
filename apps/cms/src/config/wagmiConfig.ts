import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { baseSepolia, mainnet, sepolia } from "wagmi/chains";

// Create Wagmi config
export const config = createConfig({
	chains: [mainnet, sepolia, baseSepolia],
	transports: {
		[mainnet.id]: http(),
		[sepolia.id]: http(),
		[baseSepolia.id]: http(),
	},
});
