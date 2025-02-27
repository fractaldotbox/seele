import type { TokenGateCriteria } from "@seele/access-gate/lib/token-gate/types";
import {
	FileType,
	createDirectory,
	downloadFileFromDirectoryAsync,
	uploadFileToDirectory,
} from "@seele/data-fetch/ethstorage";
import type { FlatDirectory } from "ethstorage-sdk";

export class TokenGateRepository {
	private directory: {
		flatDirectory: FlatDirectory;
		directoryAddress: string;
	};

	constructor(flatDirectory: FlatDirectory, directoryAddress: string) {
		this.directory = {
			flatDirectory: flatDirectory,
			directoryAddress: directoryAddress,
		};
	}

	static async create() {
		console.log(
			"process.env.PRIVATE_KEY_STORAGE",
			process.env.PRIVATE_KEY_STORAGE,
		);
		console.log(
			"process.env.DIRECTORY_ADDRESS_MANAGER",
			process.env.DIRECTORY_ADDRESS_MANAGER,
		);

		const _directory = await createDirectory(
			process.env.PRIVATE_KEY_STORAGE!,
			process.env.DIRECTORY_ADDRESS_MANAGER!,
		);

		return new TokenGateRepository(
			_directory.flatDirectory,
			_directory.directoryAddress,
		);
	}

	/**
	 * Adds a new token gate to the repository
	 * @param tokenGateData - The token gate data to be added
	 * @returns The created token gate entity
	 */
	async add(tokenGateCriteria: TokenGateCriteria[]): Promise<boolean> {
		try {
			const existingCriteria = (await this.getAll()) || [];

			const request = {
				key: "abc.json",
				content: Buffer.from(
					JSON.stringify([...existingCriteria, ...tokenGateCriteria]),
				),
				type: FileType.Blob,
			};

			await uploadFileToDirectory(
				process.env.PRIVATE_KEY_STORAGE!,
				this.directory.directoryAddress,
				request,
			);

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
			const existingCriteria = (await this.getAll()) || [];
			const updatedCriteria = existingCriteria.filter(
				(token) => token.contractAddress !== contractAddress,
			);

			const request = {
				key: "abc.json",
				content: Buffer.from(JSON.stringify(updatedCriteria)),
				type: FileType.Blob,
			};

			await uploadFileToDirectory(
				process.env.PRIVATE_KEY_STORAGE!,
				this.directory.directoryAddress,
				request,
			);

			return true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			throw new Error(`[delete] Failed to delete token gate: ${err.message}`);
		}
	}

	async getAll(): Promise<TokenGateCriteria[]> {
		const results = await downloadFileFromDirectoryAsync(
			this.directory.flatDirectory,
			"abc.json",
		);

		const resultsInString = JSON.parse(results.toString("utf-8"));

		return resultsInString;
	}
}
