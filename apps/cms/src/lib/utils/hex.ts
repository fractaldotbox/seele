import type { Hex } from "viem";

export type GetShortAddressReturnType = string | null;

export const getShortHex = (
	hex: Hex,
	sectionLength = 4,
): GetShortAddressReturnType => {
	return [hex.slice(0, sectionLength + 2), hex.slice(-sectionLength)].join(
		"...",
	);
};

// TODO
export const truncate = (stringToTruncate: string, threshold = 15) => {
	if (stringToTruncate.length <= threshold) {
		return stringToTruncate;
	}
	return stringToTruncate.slice(-threshold).concat("...");
};
