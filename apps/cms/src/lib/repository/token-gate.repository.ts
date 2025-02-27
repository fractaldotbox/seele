import type { TokenGateCriteria } from "@seele/access-gate/lib/token-gate/types";

let criteria: TokenGateCriteria[] = [
	// {
	//   contractAddress: "0xd369B2b99CC98FC25aF686e132fB10dE5C7349a6",
	//   tokenType: "ERC20",
	//   chainId: 84532,
	//   minBalance: "1",
	// },
];

export class TokenGateRepository {
	/**
	 * Adds a new token gate to the repository
	 * @param tokenGateData - The token gate data to be added
	 * @returns The created token gate entity
	 */
	async add(tokenGateCriteria: TokenGateCriteria[]): Promise<boolean> {
		try {
			criteria.push(...tokenGateCriteria);
			return true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			throw new Error(`[add] Failed to add token gate: ${err.message}`);
		}
	}

	/**
	 * Deletes a token gate by its ID
	 * @param id - The ID of the token gate to delete
	 * @returns boolean indicating if the deletion was successful
	 */
	async delete(contractAddress: string): Promise<boolean> {
		try {
			criteria = criteria.filter(
				(token) => token.contractAddress !== contractAddress,
			);
			return true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			throw new Error(`[delete] Failed to delete token gate: ${err.message}`);
		}
	}

	async getAll(): Promise<TokenGateCriteria[]> {
		return criteria;
	}
}
