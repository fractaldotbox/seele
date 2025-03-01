import { createConfig } from "@privy-io/wagmi";
import { http } from "viem";
import { baseSepolia } from "wagmi/chains";

// Create Wagmi config
export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});
