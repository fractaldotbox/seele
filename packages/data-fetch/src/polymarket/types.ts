export type EthFact = {
  statement: string; // description from polymarket, decoded from ancillary data hex
  yesOrNo: "yes" | "no"; // known from polymarket results by proposedPrice / settlementPrice
};
