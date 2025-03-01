import { ProofType, zkVerifySession } from "zkverifyjs";

export const SEED_PHRASE = process.env.ZKVERIFY_WALLET_SEED_PHRASE;

export const addPrefix = (value: string) => `0x${value}`;

export const startSesssion = async () => {
  if (!SEED_PHRASE) {
    throw new Error("ZKVERIFY_WALLET_SEED_PHRASE is not set");
  }

  return await zkVerifySession
    .start()
    .Testnet() // Preconfigured network selection
    .withAccount(SEED_PHRASE); // Full session with a single active account
};

export const createProofOfSqlExt = async (
  session: Awaited<ReturnType<typeof startSesssion>>,
  input: {
    vk: unknown;
    proof: unknown;
    publicSignals: unknown;
  },
): Promise<any> => {
  const params = await session.format(
    {
      proofType: ProofType.proofofsql,
    },
    input.proof,
    input.publicSignals,
    input.vk,
  );

  const extrinsic = await session.createSubmitProofExtrinsic(
    ProofType.proofofsql,
    params,
  );

  return extrinsic;
};

export const verifyProofOfSql = async (
  session: Awaited<ReturnType<typeof startSesssion>>,
  proofData: {
    vk: any;
    proof: any;
    publicSignals: any;
  },
) => {
  const { events, transactionResult } = await session
    .verify() // Optionally provide account address to verify("myaddress") if connected with multple accounts
    .proofofsql() // Select the proof type (e.g., fflonk)
    // .nonce(1)
    .waitForPublishedAttestation() // Wait for the attestation to be published (optional)
    // .withRegisteredVk() // Indicate that the verification key is already registered (optional)
    .execute({
      proofData,
    }); // Execute the verification with the provided proof data

  events.on("includedInBlock", (eventData) => {
    console.log("Transaction included in block:", eventData);
  });

  events.on("finalized", (eventData) => {
    console.log("Transaction finalized:", eventData);
  });

  events.on("attestationConfirmed", (eventData) => {
    console.log("Attestation Event Raised:", eventData);
  });

  events.on("error", (error) => {
    console.error("An error occurred during the transaction:", error);
  });

  console.log("transactionResult", await transactionResult);
};
