import { createAgent } from "@statelyai/agent";
import { generateObject } from "ai";
import { describe, it } from "vitest";
import { generateObjectWithAgent } from "../utils";
import {
	agentParamsResearcher,
	crawlWeb,
	createResearchWebsearchParams,
	researchWithWeb,
} from "./researcher";

describe(
	"ResearcherAgent",
	() => {
		let storage: Storage;

		const fixture = {
			topic:
				"Trump mints $31 billion with new official $TRUMP crypto meme coin",
			citationGap:
				"The article lacks detailed analysis on the market impact and regulatory responses to the launch of $TRUMP.",
			followUpQuery:
				"What has been the market and regulatory response to the launch of the $TRUMP meme coin?",
			editorialDirection:
				"Explore the initial market reaction, potential regulatory challenges, and compare the launch of $TRUMP to other political figures' cryptocurrencies. Include expert opinions on its long-term viability and impact on the crypto market.",
		};
		const params = {
			topic: fixture.topic,
			citationGap: fixture.citationGap,
			followUpQuery: fixture.followUpQuery,
			editorialDirection: fixture.editorialDirection,
		};

		it.skip("search the web", async () => {
			const queries = ["What Trump did on Feb20"];

			const webSearchResults = await crawlWeb(queries);

			console.log("results", webSearchResults);
		});

		it("#researchWithWeb", async () => {
			const agent = createAgent(agentParamsResearcher);
			const researchWithWebResults = await researchWithWeb(agent)(params);

			console.log("researchWithWebResults", researchWithWebResults);
		});
	},
	5 * 60 * 1000,
);
