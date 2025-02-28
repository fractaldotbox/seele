import type { TokenSelector } from "@/lib/domain/token/token";
import { useConfig } from "wagmi";
import { useGetChartWithMultipleTokens } from "@/hooks/data/use-defillama";
import { useTokenInfoBulk } from "@/components/token/token";
import { TokenPriceChartWithFeed } from "./token-price-chart-with-feed";

// Consider adding reactive component with ws price feed

export const TokenPriceChart = ({
  chainId,
  tokens,
}: {
  chainId: number;
  tokens: TokenSelector[];
}) => {
  const {
    data: tokenPriceFeedByTokenId,
    isLoading,
    isSuccess,
    error,
  } = useGetChartWithMultipleTokens(tokens);

  const config = useConfig();

  const { data: tokenInfoByTokenId = {} } = useTokenInfoBulk({
    chainId: chainId,
    tokens,
    config,
  });

  console.log({ tokenPriceFeedByTokenId });

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <TokenPriceChartWithFeed
      tokenPriceFeedByTokenId={tokenPriceFeedByTokenId || {}}
      tokenInfoByTokenId={tokenInfoByTokenId}
    />
  );
};
