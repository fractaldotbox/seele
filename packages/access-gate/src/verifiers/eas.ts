import { rawRequest } from "graphql-request";
import type { IVerifier } from "../interfaces/verifier";
import type { Permissions } from "../lib/eas/constants";
import { GetAttestationByParams } from "../lib/eas/queries";
import { getEasDataByChain } from "../lib/eas/utils";
import type { SupportedChains } from "../lib/eas/utils";
// interfaces
interface EASAttestedByMemberVerifierMetadata {
	/**
	 * The chain on which the attestation was made
	 */
	chain: SupportedChains;
	/**
	 * The address of the DAO member who attested the address
	 */
	byMember: string;
	/**
	 * The scope of the attestation
	 */
	scope: Permissions[];
}

interface Attestation {
	id: string;
	attester: string;
	recipient: string;
	revoked: boolean;
	timeCreated: string;
	data: string;
}

/**
 * Verifies if an address has been attested by a DAO member using EAS (Ethereum Attestation Service)
 * @implements {IVerifier}
 * @description This verifier checks if the given address has received an attestation from a DAO member
 * using the specified EAS schema. The attestation serves as proof of membership or approval.
 */
export class EASAttestedByMemberVerifier implements IVerifier {
	name = "eas-attested-by-member";

	/**
	 * Verifies if an address has received an attestation from the specified DAO member
	 * @param address The Ethereum address to verify
	 * @param data Additional metadata containing the member address to check attestations from
	 * @returns Promise that resolves to true if a valid attestation exists, false otherwise
	 */
	async verify(
		address: string,
		{ chain, byMember, scope }: EASAttestedByMemberVerifierMetadata,
	): Promise<boolean> {
		try {
			const attestation = await this._searchAttestationsByParams(address, {
				chain,
				byMember,
				scope,
			});

			if (!attestation) return false;

			// Check if attestation is not revoked
			if (attestation.revoked) return false;

			// Check if attester matches the specified member
			if (attestation.attester.toLowerCase() !== byMember.toLowerCase()) {
				return false;
			}

			// Check if all requested scopes are included in the attestation
			const decodedData = JSON.parse(attestation.data);
			const attestationScopes = decodedData[0].value.value;
			return scope.every((s) => attestationScopes.includes(s));
		} catch (error) {
			console.error("EAS verification error:", error);
			return false;
		}
	}

	private async _searchAttestationsByParams(
		address: string,
		{ chain, byMember }: EASAttestedByMemberVerifierMetadata,
	): Promise<Attestation | null> {
		const { easAttestedByMemberSchema, gqlBaseUrl } = getEasDataByChain(chain);

		const variables = {
			where: {
				attester: {
					equals: byMember,
				},
				recipient: {
					equals: address,
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

			return data.attestations[0] || null;
		} catch (error) {
			console.error("GraphQL query error:", error);
			return null;
		}
	}
}
