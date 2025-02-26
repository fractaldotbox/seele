import { useMemo } from "react";
import {
  type Account,
  type Chain,
  type Hex,
  type TransactionReceipt,
  type WalletClient,
  stringToHex,
  zeroHash,
} from "viem";
import { NO_EXPIRATION } from "@/lib/eas/request";
import { SchemaEncoder } from "@/lib/eas/schema-encoder";
import { OffchainAttestationVersion } from "@/lib/eas/sdk/offchain/offchain";
import { signOffchainAttestation } from "@/lib/eas/viem/offchain";
import {
  type AttestationRequestData,
  makeOnchainAttestation,
} from "@/lib/eas/viem/onchain";
import { useWalletClient } from "wagmi";

export type UseAttestationParams = {
  account: Account;
  chain: Chain;
  isOffchain: boolean;
  schemaId: string;
  schemaString: string;
};

export type UseAttestationReturnType = {
  uids: string[];
  txnReceipt?: TransactionReceipt;
};

export const useAttestation = (params: UseAttestationParams) => {
  const { account, chain, isOffchain, schemaId, schemaString } = params;
  const { data: walletClient } = useWalletClient({ account });

  const schemaEncoder = useMemo(() => {
    if (!schemaString) {
      return;
    }
    return new SchemaEncoder(schemaString);
  }, [schemaString]);

  const signAttestation = async (requestParams: AttestationRequestData) => {
    if (!schemaString) {
      throw new Error("schemaString is required");
    }

    if (!schemaEncoder) {
      throw new Error("schemaEncoder is required");
    }

    console.log("requestParams", requestParams);
    const encodedData = schemaEncoder.encodeData(requestParams.data);
    console.log("signing onchain attestation");

    const request = {
      schema: schemaId,
      expirationTime: NO_EXPIRATION,
      ...requestParams,
    };

    if (isOffchain) {
      console.log("signing offchain attestation");

      const version = OffchainAttestationVersion.Version2;

      const salt = stringToHex("SALT", { size: 32 }) as Hex;

      const attestation = await signOffchainAttestation(
        {
          revocable: false,
          refUID: zeroHash,
          ...request,
          version,
          data: encodedData,
          salt,
        },
        {
          chain,
          account,
        },
      );

      const { uid } = attestation;
      return {
        uids: [uid],
      };
    }

    const { uids, txnReceipt } = await makeOnchainAttestation(
      walletClient as WalletClient,
      {
        schema: schemaId.toString(),
        data: request,
      },
    );

    return {
      uids,
      txnReceipt,
    };
  };
  return {
    signAttestation,
  };
};
