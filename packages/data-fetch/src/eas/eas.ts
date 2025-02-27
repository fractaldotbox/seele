import { rawRequest } from "graphql-request";
import type { Attestation, EASAttestedByMemberVerifierMetadata } from "./types";
import { getChainNameFromId, getEasDataByChain } from "./utils";
import { GetAttestationByParams } from "./queries";
import { Permissions } from "./constants";

async function _searchAttestationsByParams(
  chainId: number,
): Promise<Attestation[]> {
  const chainName = getChainNameFromId(chainId);
  const { easAttestedByMemberSchema, gqlBaseUrl } =
    getEasDataByChain(chainName);

  const variables = {
    where: {
      revoked: {
        equals: false,
      },
      decodedDataJson: {
        equals: JSON.stringify([
          {
            name: "scope",
            type: "string[]",
            signature: "string[] scope",
            value: {
              name: "scope",
              type: "string[]",
              value: [Permissions.ProvideInfo],
            },
          },
        ]),
      },
      schemaId: {
        equals: easAttestedByMemberSchema,
      },
    },
  };

  try {
    const { data } = await rawRequest<{
      attestations: Attestation[];
    }>(gqlBaseUrl, GetAttestationByParams, variables);

    return data.attestations;
  } catch (error) {
    console.error("GraphQL query error:", error);
    return [];
  }
}

export async function getCMSWhitelistedAddresses(chainId: number) {
  const attestations = await _searchAttestationsByParams(chainId);

  const whitelistedAddresses = attestations.map((attestation) => {
    return attestation.recipient;
  });

  console.log("whitelistedAddresses", whitelistedAddresses);
  return whitelistedAddresses;
}
