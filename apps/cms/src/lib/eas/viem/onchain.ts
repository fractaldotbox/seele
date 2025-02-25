// Model as action
// https://github.com/wevm/viem/blob/main/src/actions/ens/getEnsName.ts

import {
  http,
  type Hex,
  type ReadContractParameters,
  type WalletClient,
  createPublicClient,
  encodeAbiParameters,
} from "viem";
import {
  simulateContract,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import { EAS_ABI, EAS_CONTRACT_ADDRESS } from "@/lib/eas/abi";
import { getUIDsFromAttestReceipt } from "@/lib/eas/events";
import type { RevocationRequest } from "@/lib/eas/request";
import type { SchemaItem } from "@/lib/eas/sdk/eas";

// TODO align on offchain
export interface AttestationRequestData {
  recipient: string;
  data: SchemaItem[];
  expirationTime?: bigint;
  revocable?: boolean;
  refUID?: string;
  value?: bigint;
  time: bigint;
  salt: Hex;
}

export interface AttestationRequest {
  schema: string;
  data: AttestationRequestData;
}

// strategy action pattern by signature type
export const makeOnchainAttestation = async (
  client: WalletClient,
  request: AttestationRequest,
) => {
  // TODO defaults

  try {
    const { request: writeRequest } = await simulateContract(client, {
      account: client.account,
      address: EAS_CONTRACT_ADDRESS as `0x${string}`,
      abi: EAS_ABI,
      functionName: "attest",
      args: [
        {
          schema: request.schema.toString() as `0x${string}`,
          data: {
            recipient: request.data.recipient.toString() as `0x${string}`,
            expirationTime: BigInt(request.data.expirationTime || 0),
            revocable: request.data.revocable ?? true,
            refUID: (request.data.refUID?.toString() ||
              "0x0000000000000000000000000000000000000000000000000000000000000000") as `0x${string}`,
            // Properly encode the data field
            data:
              request.data.data instanceof Uint8Array
                ? request.data.data
                : encodeAbiParameters(
                    request.data.data || [],
                    request.data.data instanceof Array
                      ? request.data.data
                      : [request.data.data],
                  ),
            value: BigInt(request.data.value || 0),
          },
        },
      ],
    });

    const hash = await writeContract(client, writeRequest);

    const txnReceipt = await waitForTransactionReceipt(client, {
      hash,
    });

    console.log("txn results", txnReceipt);

    const uids = getUIDsFromAttestReceipt(txnReceipt);
    return {
      uids,
      txnReceipt,
    };
  } catch (error) {
    console.error("EAS Attestation Error:", {
      error,
      params: {
        schema: request.schema,
        data: request.data,
      },
    });
    throw error;
  }
};

export type RevokeParameters = Pick<
  ReadContractParameters,
  "blockNumber" | "blockTag"
> &
  RevocationRequest;

// TODO type error at write request with generics  WalletClient<Transport, chain, account>  <chain extends Chain | undefined, account extends Account

export const revoke = async (
  client: WalletClient,
  request: RevocationRequest,
) => {
  const {
    schema,
    data: { uid, value = BigInt(0) },
  } = request;

  const publicClient = createPublicClient({
    chain: client.chain,
    transport: http(),
  });

  const { request: writeRequest } = await simulateContract(publicClient, {
    account: client.account,
    address: EAS_CONTRACT_ADDRESS,
    abi: EAS_ABI,
    functionName: "revoke",
    args: [{ schema, data: { uid, value } }],
  });

  // type error to fix
  return client.writeContract(writeRequest);
};

export const getAttestation = () => {};
