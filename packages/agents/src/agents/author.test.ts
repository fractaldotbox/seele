import { createAgent } from "@statelyai/agent";
import { beforeAll, describe, expect, it } from "vitest";
import { agentParamsAuthor, writeAndPersist, writeArticle } from "./author";

describe(
	"AuthorAgent",
	() => {
		let storage: Storage;

		beforeAll(async () => {});
		const context = {
			topic: "security of dApps in Ethereum",
			editorialDirection: "Be Detailed",
			researchContext: "$10k is loss last week",
		};

		it("#writeArticle", async () => {
			const agent = createAgent(agentParamsAuthor);

			const article = await writeArticle(agent)(context);
			console.log("article", article);
		});

		it.only("#writeArticle and persist", async () => {
			const agent = createAgent(agentParamsAuthor);

			const contentKey = "article1.md";

			const results = await writeAndPersist(agent)(contentKey, context);

			console.log("results", results);
		});
	},
	300 * 1000,
);
