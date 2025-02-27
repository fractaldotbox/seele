export type TokenGateCriteria = {
  chainId: number;
  contractAddress: string;
  minBalance: string;
  tokenType: "ERC20" | "ERC721";
};
