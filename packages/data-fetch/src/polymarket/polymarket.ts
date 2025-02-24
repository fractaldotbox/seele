import { fetchOptimisticPriceRequests } from "./queries";
import type { EthFact } from "./types";

// polymarket data
export async function buildEthFactBank(qty = 5): Promise<EthFact[]> {
  // query eth related predictions
  const optimisticPriceRequests = await fetchOptimisticPriceRequests(qty);

  // parse data and statement
  const ethFacts = await optimisticPriceRequests.map((request): EthFact => {
    const { ancillaryData, settlementPrice } = request;

    return {
      statement: Buffer.from(ancillaryData.slice(2), "hex").toString("utf8"),
      yesOrNo: settlementPrice > 0 ? "yes" : "no",
    };
  });

  return ethFacts;
}
