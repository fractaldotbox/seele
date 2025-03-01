import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// Could use radix 16
export const stringifyWithBigInt = (obj: any) =>
	JSON.stringify(obj, (_, value) =>
		typeof value === "bigint" ? value.toString() : value,
	);

// replace with native Object.groupBy once bump to es2024
export const groupBy = <K extends string, V>(
	iter: any[],
	by: (v: any) => any,
) => {
	return iter.reduce((r, v) => {
		const k = by(v);
		if (!r[k]) r[k] = [];
		r[k].push(v);
		return r;
	}, {}) as Record<K, V>;
};
