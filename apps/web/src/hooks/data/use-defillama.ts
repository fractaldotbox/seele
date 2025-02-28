import type { TokenSelector } from "@/lib/domain/token/token";
import type { TokenPriceEntry } from "@/lib/domain/token/token-price-entry";
import { useQuery } from "@tanstack/react-query";
import { getChart, getPrices, getProtocolFees } from "@/lib/defillama/api";

export const CACHE_KEY = "defillama";

export const useGetChartWithMultipleTokens = (tokens: TokenSelector[]) => {
  return useQuery<{ [tokenId: string]: TokenPriceEntry[] }>({
    queryKey: [`${CACHE_KEY}.chart`, tokens],
    queryFn: async () => {
      const priceDataByTokenId = await getChart(tokens);
      return priceDataByTokenId;
    },
  });
};

export const useGetPriceWithMultipleTokenIds = (tokens: TokenSelector[]) => {
  return useQuery<{ [tokenId: string]: TokenPriceEntry[] }>({
    queryKey: [`${CACHE_KEY}.price`, tokens],
    queryFn: async () => {
      const priceDataByTokenId = await getPrices(tokens);
      return priceDataByTokenId;
    },
  });
};

export const useGetProtocolRevenue = (
  protocolSlug: string,
  dataType = "dailyFees",
) => {
  return useQuery({
    queryKey: [`${CACHE_KEY}.protocol.revenue`, protocolSlug, dataType],
    queryFn: async () => {
      const results = await getProtocolFees(protocolSlug, dataType);

      const { totalDataChart } = results;
      return {
        ...results,
        totalDataChart,
      };
    },
  });
};
