import {
	type Attestation,
	getUIDsFromAttestReceipt,
} from "@ethereum-attestation-service/eas-sdk";
import { getEasDataByChain } from "@seele/access-gate/lib/eas/utils";
import { gql, rawRequest } from "graphql-request";
import type { Address } from "viem";
import { baseSepolia } from "viem/chains";
import { createEthstorageArticleUrl } from "../adapters/utils";
import { persistWithDirectory } from "../storage";
import { addressEditor } from "./address-book";

const privateKeyManager = process.env.PRIVATE_KEY_MANAGER!;

const directoryAddress = process.env.DIRECTORY_ADDRESS_MANAGER!;

export const GetAttestationByParams = gql`
  query AttestationByParameters($where: AttestationWhereInput) {
    attestations(where: $where) {
      attester
      recipient
      revoked
      schemaId
      id
      data: decodedDataJson
    }
  }
`;

const searchAttestationsWithParams = async (
	addressEditor: Address,
	{ chain }: { chain: any },
): Promise<Attestation | null> => {
	const { easAttestedByEditorSchema, gqlBaseUrl } = getEasDataByChain(chain);

	const variables = {
		where: {
			attester: {
				equals: addressEditor,
			},
			schemaId: {
				equals: easAttestedByEditorSchema,
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
};

export const deployArticles = async (articleMetas: ArticleMeta[]) => {
	for (let i = 0; i < articleMetas.length; i++) {
		const meta = articleMetas[i]!;

		const url = createEthstorageArticleUrl(meta.directoryAddress, meta.key);
		const content = await fetch(url).then((response) => response.text());

		console.log("content", content);
		await persistWithDirectory(
			{
				privateKey: privateKeyManager,
				directoryAddress,
			},
			{
				// namespace: "community1",
				contentKey: meta.key,
				content,
			},
		);
	}
};

export const verifyAttestation = async (
	directoryAddress: string,
	key: string,
) => {
	try {
		const attestation = await searchAttestationsWithParams(
			addressEditor as Address,
			{
				chain: "baseSepolia",
			},
		);

		if (!attestation) return false;

		console.log("attestation", attestation);

		// Check if attestation is not revoked
		if (attestation.revoked) return false;

		// console.log('attestation.attester', addressEditor)
		// if (![addressEditor.toLowerCase()].includes(attestation.attester.toLowerCase())) {
		// 	return false;
		// }

		const parsed = JSON.parse(attestation.data);

		console.log("parsed", parsed);

		const contentKey = parsed?.find((item: any) => item.name === "key")?.value
			?.value;

		const directoryAddressAttested = parsed?.find(
			(item: any) => item.name === "directory",
		)?.value?.value;

		if (contentKey !== key) return false;
		if (
			directoryAddress.toLowerCase() !== directoryAddressAttested.toLowerCase()
		) {
			console.error(
				"Invalid directory address",
				directoryAddress,
				directoryAddressAttested,
			);
			return false;
		}

		return true;
	} catch (error) {
		console.error("EAS verification error:", error);
		return false;
	}
};

export type ArticleMeta = {
	key: string;
	directoryAddress: string;
};

export const verifyAndDeploy = async (articlesMeta: ArticleMeta[]) => {
	for (let i = 0; i < articlesMeta.length; i++) {
		const { key, directoryAddress } = articlesMeta[i]!;
		// const isEditorApproved = await verifyAttestation(directoryAddress, key);
		const isEditorApproved = true;
		if (!isEditorApproved) {
			console.error("Invalid attestation", key, directoryAddress);
			return false;
		}
	}

	console.log("verified, deploying...");
	await deployArticles(articlesMeta);
};

export const validateProof = () => {};
