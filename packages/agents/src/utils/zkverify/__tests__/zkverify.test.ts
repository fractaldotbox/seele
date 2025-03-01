import { describe, it } from "vitest";
import {
  addPrefix,
  createProofOfSqlExt,
  startSesssion,
  verifyProofOfSql,
} from "../zkverify";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import fs from "node:fs";

// First, let's add some logging to debug the paths
const PROOFS_DIR = join(__dirname, "../proofs");

describe("zkverify", () => {
  it("should verify a proof of sql", async () => {
    const session = await startSesssion();

    console.log("Current directory:", __dirname);
    console.log("Proofs directory:", PROOFS_DIR);

    const vk = readFileSync(join(PROOFS_DIR, "VALID_PUBS_MAX_NU_4.bin"), "hex");
    const proof = readFileSync(
      join(PROOFS_DIR, "VALID_PROOF_MAX_NU_4.bin"),
      "hex",
    );
    const publicSignals = readFileSync(
      join(PROOFS_DIR, "VALID_PUBS_MAX_NU_4.bin"),
      "hex",
    );

    const proofObj = {
      vk: addPrefix(vk),
      proof: addPrefix(proof),
      publicSignals: addPrefix(publicSignals),
    };

    // Save proof data as JSON for debug
    const proofJson = JSON.stringify(proofObj, null, 2);
    const outputPath = join(PROOFS_DIR, "generated_proof.json");
    fs.writeFileSync(outputPath, proofJson);
    console.log("Proof data saved to:", outputPath);

    const result = await verifyProofOfSql(session, {
      vk: proofObj.vk,
      proof: proofObj.proof,
      publicSignals: proofObj.publicSignals,
    });

    console.log("Result:", result);
  }, 1_000_000);
});
