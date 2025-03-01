import { buildEthFactBank } from "@seele/data-fetch/polymarket/polymarket";
import { createAgent } from "@statelyai/agent";
import type { Storage } from "unstorage";
import { beforeAll, describe, expect, it } from "vitest";
import { waitFor } from "xstate";
import { TOPICS_ETH } from "../fixture";
import { initStorage } from "../storage";
import { ARTICLE_METAS, createEmbeddings, queryWithEmbeddings } from "../utils";
import { crawlNewsWithTopic } from "./curator";
import {
	agentParamsFactChecker,
	factCheckAndPersist,
	factCheckWithRAG,
	findRelevantInfo,
} from "./fact-checker";

describe(
	"FactCheckingAgent",
	() => {
		let storage: Storage;

		const agent = createAgent(agentParamsFactChecker);

		beforeAll(async () => {
			storage = await initStorage();
			await crawlNewsWithTopic(TOPICS_ETH, storage);
		});
		it("#createEmbedding", async () => {
			const embeddings = await createEmbeddings(["text1", "text2", "abc"]);

			expect(embeddings.length).toEqual(3);
		});

		it("#queryWithEmbeddings", async () => {
			const embeddings = await createEmbeddings(["Elon Musk", "Donlad Trump"]);
			const queryEmbeddings = await createEmbeddings(["Trumpcoin"]);

			const queryResult = queryWithEmbeddings(embeddings, queryEmbeddings);

			console.log("queryResult", queryResult);

			expect(queryResult[0].index).toEqual(1);
		});

		it("#findRelevantInfo", async () => {
			await findRelevantInfo("North Korea", storage);

			// TODO mock the crawl results
		});

		it("#factCheckWithRAG obvious", async () => {
			const article = "North Korea is involved in the bybit hack";

			const factCheckResults = await factCheckWithRAG(agent)(article, storage);

			console.log("factCheckResults", factCheckResults);
		});

		it("#factCheckWithRAG indirect", async () => {
			const query = "Biden is current president";
			await factCheckWithRAG(agent)(query, storage);
		});

		it.only("#factcheck and persist", async () => {
			const facts = await buildEthFactBank(300);
			// TODO clean data

			await storage.setItems(
				facts.map((fact: any) => ({
					key: `polymarket:${fact.id}`,
					value: {
						title: fact.statement,
						content: `
						<Statment>
						${fact.statement}
						</Statment>
						<Result>
						 ${fact.yesOrNo}
						</Result>
						`,
					},
				})),
			);

			await factCheckAndPersist(agent)(ARTICLE_METAS, storage);
		});
	},
	5 * 60 * 1000,
);
