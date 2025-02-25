import { openai } from "@ai-sdk/openai";
import { createAgent } from "@statelyai/agent";
import { describe, expect, it, vi } from "vitest";
import { NEWS_FEED } from "../fixture";
import { generateObjectWithAgent } from "../utils";
import {
	ArticlePlan,
	NewsFeedItem,
	agentParamsEditor,
	createPlannerAgentParams,
} from "./editor";

describe(
	"PlannerAgent",
	() => {
		it("should research for topics", async () => {
			const agent = createAgent(agentParamsEditor);
			const results = await generateObjectWithAgent(
				agent,
				createPlannerAgentParams(NEWS_FEED),
			);

			expect(results.articles.length > 0).toBe(true);
			expect(results.articles[0].topic.includes("Trump")).toBe(true);
		});
	},
	60 * 1000,
);
