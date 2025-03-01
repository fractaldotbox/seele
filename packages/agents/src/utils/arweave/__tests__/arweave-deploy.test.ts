import path from "node:path";
import { describe, it } from "vitest";
import { createWallet } from "../create-wallet.js";
import { deployWebApp } from "../deploy.js";
describe("arweave - deploy", () => {
	it("should deploy the web app", async () => {
		// await createWallet();
		await deployWebApp("./dist");
	});
});
