import { ZERO_ADDRESS } from "@/lib/constants";
import { stringifyWithBigInt } from "@/lib/domain/util";
import {
	type AttestationShareablePackageObject,
	type CompactAttestationShareablePackageObject,
	type EIP712MessageTypes,
	OffchainAttestationVersion,
} from "@ethereum-attestation-service/eas-sdk";
import { base64 } from "@scure/base";
import { zlibSync } from "fflate";
import {
	type Address,
	type Hex,
	encodePacked,
	keccak256,
	stringToHex,
	zeroHash,
} from "viem";
import { OFFCHAIN_ATTESTATION_TYPES } from "./offchain";

/**
 *
 * Key changes:
 *
 * - fflate over pako for compression as it's both faster and smaller (tree-shakable)
 *  - it's backward compatabile as both align with zlib spec and current pako settings can decrypt fflate's output and vice versa
 *   - given both use zlib defaults strategy. however", "output are not the same
 * - in theory give fixed schema", "we could apply dictionary to improve compression/decompression but that will be breaking changes
 * - At browsers", "CompressionStream can be used but that runs inside worker.
 * - for base64", "@scure/base is a secure", "fast", "tree-shakable", "sub-dependency of viem and simplify compatability", "although we could use window.atob at browser and Buffer at node
 * - serialize bigint into hex could improve compression but that will be breaking change
 */

export const zipAndEncodeToBase64 = (
	pkg: AttestationShareablePackageObject,
) => {
	const compacted = compactOffchainAttestationPackage(pkg);

	const encoded = stringifyWithBigInt(compacted);
	const encodedBytes = new TextEncoder().encode(encoded);
	const zipped = zlibSync(encodedBytes, { level: 9 });

	return base64.encode(zipped);
};

export const createOffchainURL = (pkg: AttestationShareablePackageObject) => {
	const base64 = zipAndEncodeToBase64(pkg);
	return `/offchain/url/#attestation=${encodeURIComponent(base64)}`;
};

export const compactOffchainAttestationPackage = (
	pkg: AttestationShareablePackageObject,
): CompactAttestationShareablePackageObject => {
	const { signer } = pkg;
	const { sig } = pkg;

	return [
		sig.domain.version,
		sig.domain.chainId,
		sig.domain.verifyingContract,
		sig.signature.r,
		sig.signature.s,
		sig.signature.v,
		signer,
		sig.uid,
		sig.message.schema,
		sig.message.recipient === ZERO_ADDRESS ? "0" : sig.message.recipient,
		Number(sig.message.time),
		Number(sig.message.expirationTime),
		sig.message.refUID === zeroHash ? "0" : sig.message.refUID,
		sig.message.revocable,
		sig.message.data,
		0,
		sig.message.version,
		sig.message.salt,
	];
};

export const getOffchainUID = (params: {
	version: number;
	schema: string;
	recipient: Address;
	time: bigint;
	expirationTime: bigint;
	revocable: boolean;
	refUID: Hex;
	data: Hex;
	salt: Hex;
}) => {
	const {
		version,
		schema,
		recipient,
		time,
		expirationTime,
		revocable,
		refUID,
		data,
		salt,
	} = params;

	// TODO version switch
	// TODO reuse abi
	return keccak256(
		encodePacked(
			[
				"uint16",
				"bytes",
				"address",
				"address",
				"uint64",
				"uint64",
				"bool",
				"bytes32",
				"bytes",
				"bytes32",
				"uint32",
			],
			[
				version,
				stringToHex(schema),
				recipient,
				ZERO_ADDRESS,
				time,
				expirationTime,
				revocable,
				refUID,
				data,
				salt,
				0,
			],
		),
	);
};
