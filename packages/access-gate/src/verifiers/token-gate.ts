import type { IVerifier } from "../interfaces/verifier";
import { erc20Abi } from "../lib/token-gate/abis/erc20";
import { erc721Abi } from "../lib/token-gate/abis/erc721";
import type { TokenGateCriteria } from "../lib/token-gate/types";
import { createPublicClient, http, type PublicClient } from "viem";
import { sepolia, baseSepolia } from "viem/chains";

const SUPPORTED_CHAINS = {
  11155111: sepolia, // Sepolia testnet
  84532: baseSepolia, // Base Sepolia testnet
} as const;

export class TokenGateVerifier implements IVerifier {
  name = "token-gate";

  async verify(
    address: string,
    tokenGatesCriteria: TokenGateCriteria[],
  ): Promise<boolean> {
    // If no criteria provided, default to true
    if (!tokenGatesCriteria.length) return true;

    try {
      // Check each criteria - all must pass (AND condition)
      for (const criteria of tokenGatesCriteria) {
        const hasBalance = await this.checkTokenBalance(address, criteria);
        if (!hasBalance) return false;
      }

      return true;
    } catch (err) {
      console.error(`[verify] Error verifying token gate: ${err}`);
      return false;
    }
  }

  private async checkTokenBalance(
    address: string,
    criteria: TokenGateCriteria,
  ): Promise<boolean> {
    const chain =
      SUPPORTED_CHAINS[criteria.chainId as keyof typeof SUPPORTED_CHAINS];
    if (!chain) {
      console.error(
        `[checkTokenBalance] Unsupported chain ID: ${criteria.chainId}`,
      );
      return false;
    }

    const publicClient = createPublicClient({
      chain,
      transport: http(),
    });

    console.log(`[checkTokenBalance] Checking balance for:`, {
      userAddress: address,
      contractAddress: criteria.contractAddress,
      chain: chain.name,
      tokenType: criteria.tokenType,
    });

    try {
      // First verify if the contract exists and has code
      const code = await publicClient.getCode({
        address: criteria.contractAddress as `0x${string}`,
      });

      if (code === "0x") {
        console.error(
          `[checkTokenBalance] No contract found at address: ${criteria.contractAddress}`,
        );
        return false;
      }

      if (criteria.tokenType === "ERC721") {
        // Get NFT balance
        const balance = await publicClient.readContract({
          address: criteria.contractAddress as `0x${string}`,
          abi: erc721Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });

        console.log(`[checkTokenBalance] Retrieved NFT balance:`, {
          balance: balance.toString(),
        });

        return Number(balance) > 0;
      }

      // Default to ERC20 handling
      const decimals = await publicClient.readContract({
        address: criteria.contractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "decimals",
      });

      const balance = await publicClient.readContract({
        address: criteria.contractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      });

      console.log(`[checkTokenBalance] Retrieved ERC20 balance:`, {
        rawBalance: balance.toString(),
        decimals: decimals,
      });

      return (
        Number(balance) / 10 ** Number(decimals) >= Number(criteria.minBalance)
      );
    } catch (err: any) {
      console.error(`[checkTokenBalance] Error reading contract: ${err}`);
      return false;
    }
  }
}
