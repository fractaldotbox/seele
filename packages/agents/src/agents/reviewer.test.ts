import { createAgent } from "@statelyai/agent";
import { beforeAll, describe, it } from "vitest";
import { agentParamsReviewer, reviewArticle } from "./reviewer";

describe(
	"ReviwerAgent",
	() => {
		let storage: Storage;
		const soulByName: Record<string, string> = {};

		beforeAll(async () => {
			const soulDataVitalik = await import(`../fixture/soul/vitalik.eth.json`);
			const soulDataCz = await import(`../fixture/soul/cz_binance.json`);
			soulByName["vitalik.eth"] = soulDataVitalik?.default;
			soulByName["cz_binance"] = soulDataCz?.default;
		});

		it("#reviewArticle", async () => {
			const article = `
According to BlockBeats, the U.S. Securities and Exchange Commission (SEC) has confirmed the receipt of an application to permit the staking of Grayscale's spot Ethereum ETF. This development marks a significant step in the evolving landscape of cryptocurrency investment products.
            `;

			const agent = createAgent(agentParamsReviewer);
			const soul = soulByName["cz_binance"];
			const reviewResults = await reviewArticle(agent)(article, soul);

			console.log("reviewResults", reviewResults, soul);
		});
	},
	5 * 60 * 1000,
);
