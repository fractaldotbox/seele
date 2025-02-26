import { beforeAll, describe, expect, it } from "vitest";
import { writeArticle } from "./author";

describe(
	"AuthorAgent",
	() => {
		let storage: Storage;

		beforeAll(async () => {});

		it("#writeArticle", async () => {
			const context = {
				editorialDirection: "future of AI",
			};
			const article = await writeArticle("future of AI", context);
			console.log("article", article);
		});
	},
	300 * 1000,
);
