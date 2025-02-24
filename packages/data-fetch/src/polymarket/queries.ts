import { gql, request } from "graphql-request";
import dotenv from "dotenv";

dotenv.config();

const THE_GRAPH_API_KEY = process.env.THE_GRAPH_API_KEY as string;

export const fetchOptimisticPriceRequests = async (qty = 5) => {
  const endpoint = `https://gateway.thegraph.com/api/${THE_GRAPH_API_KEY}/subgraphs/id/BpK8AdxzBUVnFN3ZCt2u3PgnKRNnS4WbM6MUETZ6b3yK`;

  const query = gql`
    {
      optimisticPriceRequests(
        first: ${qty}
        where: { identifier_contains: "YES_OR_NO" }
      ) {
        id
        identifier
        ancillaryData
        time
        settlementPrice
        proposedPrice
        settlementTimestamp
      }
    }
  `;

  const data = (await request(endpoint, query)) as {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    optimisticPriceRequests: any[];
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return data.optimisticPriceRequests as any[];
};
