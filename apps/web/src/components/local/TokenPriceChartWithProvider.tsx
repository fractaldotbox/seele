import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { TokenPriceChart } from "@/components/token/token-price-chart";
import { config } from "@/config/wagmi";
import { queryClient } from "@/config/react-query";

export const TokenPriceChartWithProvider = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TokenPriceChart
          chainId={1}
          tokens={[
            {
              chainId: 1,
              address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
            },
            {
              chainId: 1,
              address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
            },
          ]}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
};
