import fs from "node:fs";
import Arweave from "arweave";

export const createWallet = async (): Promise<void> => {
	const wallet = await new Arweave({}).wallets.generate();
	fs.writeFileSync("key.json", JSON.stringify(wallet));
};

if (require.main === module) {
	createWallet();
}
