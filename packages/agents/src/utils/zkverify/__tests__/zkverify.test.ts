import { describe, it } from "vitest";
import {
  addPrefix,
  createProofOfSqlExt,
  SEED_PHRASE,
  startSesssion,
  verifyProofOfSql,
} from "../zkverify";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import fs from "node:fs";
import { zkVerifySession } from "zkverifyjs";

// First, let's add some logging to debug the paths
const PROOFS_DIR = join(__dirname, "../proofs");

describe("zkverify", () => {
  it("should verify a proof of sql", async () => {
    const session = await startSesssion();

    console.log("Current directory:", __dirname);
    console.log("Proofs directory:", PROOFS_DIR);

    // Read the proof files
    const vk = `0x${readFileSync(join(PROOFS_DIR, "VALID_VK_MAX_NU_4.bin"), "hex")}`;
    const proof = `0x${readFileSync(join(PROOFS_DIR, "VALID_PROOF_MAX_NU_4.bin"), "hex")}`;
    const publicSignals = `0x${readFileSync(join(PROOFS_DIR, "VALID_PUBS_MAX_NU_4.bin"), "hex")}`;

    const proofObj = {
      vk,
      proof,
      publicSignals,
    };

    // Save proof data as JSON for debug
    const proofJson = JSON.stringify(proofObj, null, 2);
    const outputPath = join(PROOFS_DIR, "generated_proof.json");
    fs.writeFileSync(outputPath, proofJson);
    console.log("Proof data saved to:", outputPath);

    const result = await verifyProofOfSql(session, proofObj);

    console.log("Result:", result);
  }, 1_000_000);

  it("should verify a proof directly with zkVerifySession", async () => {
    // Initialize the verification session
    const session = await zkVerifySession
      .start()
      .Testnet() // Preconfigured network selection
      .withAccount(SEED_PHRASE as string); // Full session with a single active account

    console.log("Current directory:", __dirname);
    console.log("Proofs directory:", PROOFS_DIR);

    // Read the proof files
    const vk = `0x${readFileSync(join(PROOFS_DIR, "VALID_PUBS_MAX_NU_4.bin"), "hex")}`;
    const proof = `0x${readFileSync(join(PROOFS_DIR, "VALID_PROOF_MAX_NU_4.bin"), "hex")}`;
    const publicSignals = `0x${readFileSync(join(PROOFS_DIR, "VALID_PUBS_MAX_NU_4.bin"), "hex")}`;

    const proofObj = { vk, proof, publicSignals };

    // Save proof data as JSON for debug
    const proofJson = JSON.stringify(proofObj, null, 2);
    const outputPath = join(PROOFS_DIR, "generated_proof.json");
    fs.writeFileSync(outputPath, proofJson);
    console.log("Proof data saved to:", outputPath);

    const { events, transactionResult } = await session
      .verify() // Optionally provide account address to verify("myaddress") if connected with multple accounts
      .proofofsql() // Select the proof type (e.g., fflonk)
      // .nonce(1)
      .waitForPublishedAttestation() // Wait for the attestation to be published (optional)
      // .withRegisteredVk() // Indicate that the verification key is already registered (optional)
      .execute({
        proofData: proofObj,
      }); // Execute the verification with the provided proof data

    console.log("Result:", { events, transactionResult });
  }, 1_000_000);
});
