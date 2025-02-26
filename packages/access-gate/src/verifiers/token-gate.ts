import type { IVerifier } from "../interfaces/verifier";
import { erc20Abi } from "../lib/token-gate/abis/erc20";
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
    const chain = SUPPORTED_CHAINS[criteria.chainId];
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

    // Get token balance for the address
    const balance = await publicClient.readContract({
      address: criteria.contractAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    });

    // Compare against minimum required balance
    return Number(balance) >= Number(criteria.minBalance);
  }
}
