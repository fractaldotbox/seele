import { rawRequest } from "graphql-request";
import { Permissions } from "./constants";
import { GetAttestationByParams } from "./queries";
import type { Attestation, EASAttestedByMemberVerifierMetadata } from "./types";
import { getChainNameFromId, getEasDataByChain } from "./utils";

async function _searchAttestationsByParams(
  chainId: number,
): Promise<Attestation[]> {
  const chainName = getChainNameFromId(chainId);
  const { easAttestedByMemberSchema, gqlBaseUrl } =
    getEasDataByChain(chainName);

  const variables1 = {
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

  const variables2 = {
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
              value: [Permissions.ProvideInfo, Permissions.Vote],
            },
          },
        ]),
      },
      schemaId: {
        equals: easAttestedByMemberSchema,
      },
    },
  };

  const variables3 = {
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
              value: [Permissions.Vote, Permissions.ProvideInfo],
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
    const { data: data1 } = await rawRequest<{
      attestations: Attestation[];
    }>(gqlBaseUrl, GetAttestationByParams, variables1);

    const { data: data2 } = await rawRequest<{
      attestations: Attestation[];
    }>(gqlBaseUrl, GetAttestationByParams, variables2);

    const { data: data3 } = await rawRequest<{
      attestations: Attestation[];
    }>(gqlBaseUrl, GetAttestationByParams, variables3);

    return [
      ...data1.attestations,
      ...data2.attestations,
      ...data3.attestations,
    ];
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
