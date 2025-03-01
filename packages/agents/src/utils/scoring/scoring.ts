import { rawRequest } from "graphql-request";
import type { Address } from "viem";
import { EAS_SCORING_SCHEMA_ID, GQL_BASE_URL } from "./scoring.constants";
import { GetAttestationByParams } from "./scoring.queries";

async function getAttestationsByAddress(address: Address) {
	const attestations = await rawRequest(GQL_BASE_URL, GetAttestationByParams, {
		where: {
			schemaId: {
				equals: EAS_SCORING_SCHEMA_ID,
			},
			recipient: {
				equals: address,
			},
		},
	});

	return attestations;
}

export const computeScoreByAddress = async (address: Address) => {
	try {
		const attestations = (await getAttestationsByAddress(address)) as any;
		console.log(attestations);
		return attestations.data.attestations.length;
	} catch (error) {
		console.error(
			"[computeScoreByAddress] Error fetching attestations:",
			error,
		);
		throw error; // Re-throwing the error for further handling
	}
};
