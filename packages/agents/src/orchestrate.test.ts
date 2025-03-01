import { createAgent } from "@statelyai/agent";
import { result } from "lodash";
import { FineTuningJobCheckpointsPage } from "openai/resources/fine-tuning/jobs/checkpoints.mjs";
import { beforeAll, describe, it } from "vitest";
import { waitFor } from "xstate";
import {
	ArticlePlan,
	agentParamsEditor,
	createPlannerAgentParams,
} from "./agents/editor";
import { NEWS_FEED } from "./fixture";
import { planAndWrite, reviewAndDeploy, start } from "./orchestrate";
import { generateObjectWithAgent } from "./utils";

describe(
	"orchestrate",
	() => {
		const soulByName: Record<string, string> = {};

		beforeAll(async () => {
			const soulDataVitalik = await import(`./fixture/soul/vitalik.eth.json`);
			const soulDataCz = await import(`./fixture/soul/cz_binance.json`);
			soulByName["vitalik.eth"] = soulDataVitalik?.default;
			soulByName["cz_binance"] = soulDataCz?.default;
		});

		// it.skip("#start", async () => {
		// 	const { agent, actor } = await start();

		// 	await waitFor(actor, (s) => s.matches("end of world"));
		// });

		it("plan and delegate author agents to write", async () => {
			await planAndWrite();

			// await submitArticle()
		});

		it.only("#reviewAndDeploy", async () => {
			await reviewAndDeploy(soulByName);
		});
	},
	10 * 30 * 1000,
);
