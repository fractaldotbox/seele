import { describe, it } from "vitest";
import { deployWebApp } from "../deploy.js";
import { createWallet } from "../create-wallet.js";
import path from "node:path";
describe("arweave - deploy", () => {
  it("should deploy the web app", async () => {
    // await createWallet();
    await deployWebApp("./dist");
  });
});
