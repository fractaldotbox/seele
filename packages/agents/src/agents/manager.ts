import { openai } from "@ai-sdk/openai";
import {
	type Attestation,
	getUIDsFromAttestReceipt,
} from "@ethereum-attestation-service/eas-sdk";
import { getEasDataByChain } from "@seele/access-gate/lib/eas/utils";
import { experimental_generateImage as generateImage, generateText } from "ai";
import { gql, rawRequest } from "graphql-request";
import _ from "lodash";
import type { Address } from "viem";
import { baseSepolia } from "viem/chains";
import {
	type ArticleMeta,
	createEthstorageArticleUrl,
	loadArticles,
} from "../adapters/utils";
import { persistWithDirectory } from "../storage";
import { addressEditor, directoryAddressManager } from "./address-book";

const privateKeyManager = process.env.PRIVATE_KEY_MANAGER!;

export const agentParamsManager = {
	name: "manager",
	model: openai("gpt-4-turbo"),
	events: {},
};

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

export const searchAttestationsWithParams = async (
	addressEditor: Address,
	{ chain }: { chain: any },
): Promise<Attestation[] | null> => {
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

		return data.attestations || null;
	} catch (error) {
		console.error("GraphQL query error:", error);
		return null;
	}
};

export const deployArticles = async (articleMetas: ArticleMeta[]) => {
	const articles = await loadArticles(articleMetas);
	console.log("deploying articles", articles.length);
	for (let i = 0; i < articles.length; i++) {
		const article = articles[i]!;

		let imageResults;

		const titleResults = await generateText({
			model: agentParamsManager.model,
			prompt: `Summarize title for the article, do not include the word title in it.

			<Article>
			${article.content}
			</Article>
			

			Example:
			New Ethereum Research Breakthrough
			
                `,
		});

		if (i === 0) {
			imageResults = await generateImage({
				model: openai.image("dall-e-3"),
				prompt: `
				No Text, No Caption.
				News cover image for this title:
				${titleResults?.text}
				`,
				// size: '512x512'
			});
		}

		await persistWithDirectory(
			{
				privateKey: privateKeyManager,
				directoryAddress: directoryAddressManager,
			},
			{
				// namespace: "article",
				contentKey: article.key,
				content: article.content,
			},
		);

		await persistWithDirectory(
			{
				privateKey: privateKeyManager,
				directoryAddress: directoryAddressManager,
			},
			{
				// namespace: "article",
				contentKey: article.key.replace(".md", ".json"),
				content: JSON.stringify({
					title: titleResults?.text,
					// image: imageResults?.image?.base64,
				}),
			},
		);

		if (imageResults) {
			await persistWithDirectory(
				{
					privateKey: privateKeyManager,
					directoryAddress: directoryAddressManager,
				},
				{
					// namespace: "article",
					contentKey: article.key.replace(".md", ".png"),
					content: imageResults?.image?.uint8Array,
				},
			);
		}
	}
};

export const pullAttestations = async () => {
	const attestations = await searchAttestationsWithParams(
		addressEditor as Address,
		{
			chain: "baseSepolia",
		},
	);

	console.log("attestations", attestations);

	return attestations;
};

export const verifyAttestation = async (
	attestation: Attestation | null,
	directoryAddress: string,
	key: string,
) => {
	try {
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

export const verifyAndDeploy = async (
	attestations: Attestation[],
	articlesMeta: ArticleMeta[],
) => {
	// original author directory address
	for (let i = 0; i < articlesMeta.length; i++) {
		const { key, directoryAddress } = articlesMeta[i]!;

		// find corr. attestaitons.
		// TODO receipent author for easier indexing
		const attestation = attestations.find((attestation) => {
			const parsed = JSON.parse(attestation.data);

			const contentKey = parsed?.find((item: any) => item.name === "key")?.value
				?.value;
			return contentKey === key;
		});

		// _.findIndex(attestations, (attestation: any) => {});

		// const isEditorApproved = true;

		const isEditorApproved = verifyAttestation(
			attestation!,
			directoryAddress,
			key,
		);
		if (!isEditorApproved) {
			console.error("Invalid attestation", key, directoryAddress);
			return false;
		}
	}

	console.log("verified, deploying...");
	await deployArticles(articlesMeta);
};

export const validateProof = () => {};
