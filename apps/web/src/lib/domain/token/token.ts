import type { Address } from "viem";

export type Token = {
  chainId?: number;
  address?: Address;
  imageUrl?: string;
  decimals: number;
  name: string;
  symbol: string;
  type?: string;
};

export type TokenSelector = {
  chainId: number;
  address: string;
};
