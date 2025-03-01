import { defineCollection } from "astro:content";
const DIRECTORY_ADDRESS =
	process.env.DIRECTORY_ADDRESS_MANAGER ||
	"0x649318865af1a2ae6ee1c5de9ad6cf6162e28e22";

const getUrl = (key: string) =>
	`https://${DIRECTORY_ADDRESS}.3337.w3link.io/${key}`;

const articles = defineCollection({
	loader: async () => {
		const keys = [
			"article1.md",
			"article2.md",
			"article3.md",
			"article4.md",
			"article5.md",
		];
		// .map((key) => `/${key}`);

		const results = await Promise.all(
			keys
				.map((key) => getUrl(key))
				.map((url) => fetch(url).then((res) => res.text())),
		);

		console.log("results", results);

		// https://docs.astro.build/en/guides/markdown-content/
		return results.map((content, i) => ({
			content,
			id: keys[i],
		}));
	},
});

export const collections = { articles };
