import type { Address } from "viem";
import { baseSepolia, mainnet, optimism, sepolia } from "viem/chains";

export const EAS_CONFIG_BY_CHAIN_ID = {
	[mainnet.id]: {
		eas: "0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587",
		graphqlEndpoint: "https://easscan.org/graphql",
		easscanUrl: "https://easscan.org",
	},
	[sepolia.id]: {
		eas: "0xC2679fBD37d54388Ce493F1DB75320D236e1815e",
		graphqlEndpoint: "https://sepolia.easscan.org/graphql",
		easscanUrl: "https://sepolia.easscan.org",
	},
	[optimism.id]: {
		eas: "0xE132c2E90274B44FfD8090b58399D04ddc060AE1",
		graphqlEndpoint: "https://optimism.easscan.org/graphql",
		easscanUrl: "https://optimism.easscan.org",
	},
	[baseSepolia.id]: {
		eas: "0xF095fE4b23958b08D38e52d5d5674bBF0C03cbF6",
		graphqlEndpoint: "https://base.easscan.org/graphql",
		easscanUrl: "https://base.easscan.org",
	},
} as Record<
	number,
	{
		eas: string;
		graphqlEndpoint: string;
		easscanUrl: string;
	}
>;

export const getEasscanEndpoint = (chainId: number) => {
	return EAS_CONFIG_BY_CHAIN_ID[chainId]?.easscanUrl;
};

export const getEasscanAttestationUrl = (
	chainId: number,
	uid: string,
	isOffchain: boolean,
) => {
	if (isOffchain) {
		return `${getEasscanEndpoint(chainId)}/offchain/attestation/view/${uid}`;
	}
	return `${getEasscanEndpoint(chainId)}`;
};

export const getEasscanAddressUrl = (chainId: number, address: Address) => {
	return `${getEasscanEndpoint(chainId)}/address/${address}`;
};

export const getEasscanSchemaUrl = (chainId: number, schemaId: string) => {
	return `${getEasscanEndpoint(chainId)}/schema/view/${schemaId}`;
};
