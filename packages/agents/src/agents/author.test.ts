import { createAgent } from "@statelyai/agent";
import { beforeAll, describe, expect, it } from "vitest";
import {
	agentParamsAuthor,
	submitArticle,
	writeAndPersist,
	writeArticle,
} from "./author";

describe(
	"AuthorAgent",
	() => {
		let storage: Storage;
		const context = {
			topic: "security of dApps in Ethereum",
			editorialDirection: "Be Detailed",
			researchContext: "$10k is loss last week",
		};

		beforeAll(async () => {});

		it("#writeArticle", async () => {
			const agent = createAgent(agentParamsAuthor);

			const article = await writeArticle(agent)(context);
			console.log("article", article);
		});

		it("#writeArticle and persist", async () => {
			const agent = createAgent(agentParamsAuthor);

			const contentKey = "article1.md";

			const results = await writeAndPersist(agent)(contentKey, context);

			console.log("results", results);
		});

		it("#submitArticle", async () => {
			await submitArticle("article1.md");
		});

		it.only("write and submmit", async () => {
			const contentKey = "article1.md";
			const agent = createAgent(agentParamsAuthor);
			const url = await writeAndPersist(agent)(contentKey, context);
			const results = await submitArticle(contentKey);

			console.log(results);
		});
	},
	300 * 1000,
);
