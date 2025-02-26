// remove utils from from ethers and replcae with micro-eth-signer

import { ZERO_ADDRESS } from "@/lib/constants";
import { getOffchainUID } from "@/lib/eas/sdk/offchain/offchain-utils";
import type { OffchainAttestationType } from "@ethereum-attestation-service/eas-sdk";
import { type Address, verifyTypedData } from "viem";
import {
	InvalidAddress,
	InvalidPrimaryType,
	InvalidTypes,
} from "./typed-data-handler";

export type EIP712Params = {
	nonce?: bigint;
};

export enum OffchainAttestationVersion {
	Legacy = 0,
	Version1 = 1,
	Version2 = 2,
}
export type OffchainAttestationParams = {
	schema: string;
	recipient: string;
	time: bigint;
	expirationTime: bigint;
	revocable: boolean;
	refUID: string;
	data: string;
	salt?: string;
} & Partial<EIP712Params>;

export type OffchainAttestationTypedData = OffchainAttestationParams & {
	version: OffchainAttestationVersion;
};

export const OFFCHAIN_ATTESTATION_TYPES: Record<
	OffchainAttestationVersion,
	OffchainAttestationType[]
> = {
	[OffchainAttestationVersion.Legacy]: [
		{
			domain: "EAS Attestation",
			primaryType: "Attestation",
			types: {
				Attestation: [
					{ name: "schema", type: "bytes32" },
					{ name: "recipient", type: "address" },
					{ name: "time", type: "uint64" },
					{ name: "expirationTime", type: "uint64" },
					{ name: "revocable", type: "bool" },
					{ name: "refUID", type: "bytes32" },
					{ name: "data", type: "bytes" },
				],
			},
		},
		{
			domain: "EAS Attestation",
			primaryType: "Attestation",
			types: {
				Attest: [
					{ name: "schema", type: "bytes32" },
					{ name: "recipient", type: "address" },
					{ name: "time", type: "uint64" },
					{ name: "expirationTime", type: "uint64" },
					{ name: "revocable", type: "bool" },
					{ name: "refUID", type: "bytes32" },
					{ name: "data", type: "bytes" },
				],
			},
		},
		{
			domain: "EAS Attestation",
			primaryType: "Attest",
			types: {
				Attest: [
					{ name: "schema", type: "bytes32" },
					{ name: "recipient", type: "address" },
					{ name: "time", type: "uint64" },
					{ name: "expirationTime", type: "uint64" },
					{ name: "revocable", type: "bool" },
					{ name: "refUID", type: "bytes32" },
					{ name: "data", type: "bytes" },
				],
			},
		},
	],
	[OffchainAttestationVersion.Version1]: [
		{
			domain: "EAS Attestation",
			primaryType: "Attest",
			types: {
				Attest: [
					{ name: "version", type: "uint16" },
					{ name: "schema", type: "bytes32" },
					{ name: "recipient", type: "address" },
					{ name: "time", type: "uint64" },
					{ name: "expirationTime", type: "uint64" },
					{ name: "revocable", type: "bool" },
					{ name: "refUID", type: "bytes32" },
					{ name: "data", type: "bytes" },
				],
			},
		},
	],
	[OffchainAttestationVersion.Version2]: [
		{
			domain: "EAS Attestation",
			primaryType: "Attest",
			types: {
				Attest: [
					{ name: "version", type: "uint16" },
					{ name: "schema", type: "bytes32" },
					{ name: "recipient", type: "address" },
					{ name: "time", type: "uint64" },
					{ name: "expirationTime", type: "uint64" },
					{ name: "revocable", type: "bool" },
					{ name: "refUID", type: "bytes32" },
					{ name: "data", type: "bytes" },
					{ name: "salt", type: "bytes32" },
				],
			},
		},
	],
};

/**
 * Deep equality comparison for objects
 * @param obj1 First object to compare
 * @param obj2 Second object to compare
 * @returns boolean indicating if objects are deeply equal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isDeepEqual(obj1: any, obj2: any): boolean {
	// Handle primitive types and null
	if (obj1 === obj2) return true;
	if (obj1 === null || obj2 === null) return false;
	if (typeof obj1 !== "object" || typeof obj2 !== "object") return false;

	// Handle arrays
	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		if (obj1.length !== obj2.length) return false;
		return obj1.every((item, index) => isDeepEqual(item, obj2[index]));
	}

	// Handle objects
	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) return false;

	return keys1.every((key) => {
		if (!Object.prototype.hasOwnProperty.call(obj2, key)) return false;
		return isDeepEqual(obj1[key], obj2[key]);
	});
}

/**
 * async call instead compare to sdk
 */
export const verifyOffchainAttestationSignature = async (
	attesterAddress: Address,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	attestation: any,
): Promise<boolean> => {
	const { uid, message, version } = attestation;

	if (uid !== getOffchainUID(message)) {
		return false;
	}

	const verificationTypes =
		OFFCHAIN_ATTESTATION_TYPES[version as OffchainAttestationVersion];

	const results = await Promise.all(
		verificationTypes.map(async (type) => {
			const { types, primaryType } = type;

			if (attestation.primaryType !== primaryType) {
				throw new InvalidPrimaryType();
			}

			if (!isDeepEqual(attestation.types, types)) {
				throw new InvalidTypes();
			}

			if (attesterAddress === ZERO_ADDRESS) {
				throw new InvalidAddress();
			}
			return verifyTypedData({
				...attestation,
				address: attesterAddress,
			});
		}),
	);

	return results.every((isValid) => isValid);
};
