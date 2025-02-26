import { createAgent } from "@statelyai/agent";
import { result } from "lodash";
import { FineTuningJobCheckpointsPage } from "openai/resources/fine-tuning/jobs/checkpoints.mjs";
import { describe, it } from "vitest";
import { waitFor } from "xstate";
import {
	ArticlePlan,
	agentParamsEditor,
	createPlannerAgentParams,
} from "./agents/editor";
import { NEWS_FEED } from "./fixture";
import { start } from "./orchestrate";
import { generateObjectWithAgent } from "./utils";

describe(
	"orchestrate",
	() => {
		it.skip("#start", async () => {
			const { agent, actor } = await start();

			await waitFor(actor, (s) => s.matches("end of world"));
		});

		it("plan and delegate author agents to write", async () => {
			const agent = createAgent(agentParamsEditor);
			const results = await generateObjectWithAgent(
				agent,
				createPlannerAgentParams(NEWS_FEED),
			);

			const article = results?.articles[0];

			console.log("article");
			console.log(article);
		});
	},
	30 * 1000,
);
