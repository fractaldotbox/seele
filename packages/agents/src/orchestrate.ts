import { openai } from "@ai-sdk/openai";
import { Agent, createAgent } from "@statelyai/agent";
import OpenAI from "openai";
import { createActor, createMachine, fromPromise, waitFor } from "xstate";
import type { z } from "zod";
import { agentParamsCurator, crawlNewsWithTopic } from "./agents/curator";
import {
	ArticlePlan,
	type NewsFeedItem,
	agentParamsEditor,
	createPlannerAgentParams,
	planNewsDirection,
} from "./agents/editor";
import { initStorage, persistWithDirectory } from "./storage";

import { generateObject } from "ai";
import { directoryAddressAuthor } from "./agents/address-book";
import {
	agentParamsAuthor,
	writeAndPersist,
	writeArticle,
} from "./agents/author";
import {
	agentParamsFactChecker,
	factCheckAndPersist,
	factCheckWithRAG,
} from "./agents/fact-checker";
import { agentParamsManager } from "./agents/manager";
import { pullAttestations, verifyAndDeploy } from "./agents/manager.js";
import {
	type ResearchResult,
	agentParamsResearcher,
	researchWithWeb,
} from "./agents/researcher";
import {
	agentParamsReviewer,
	reviewArticlesAndPersist,
} from "./agents/reviewer";
import { newsAgencyMachine } from "./news-state";
import { ARTICLE_METAS, generateObjectWithAgent } from "./utils";

const mountObservability = (agent) => {
	agent.onMessage((message: string) => {
		console.log("=== Agent messages === ");

		console.log("message", JSON.stringify(message));
		console.log("message", JSON.stringify(message?.result?.response?.messages));
	});
};

/**
 * Put the dependency inside state machine whenever possible
 * While agent action are functional for composability and testability
 */

export const planAndWrite = async () => {
	const TOPICS_ETH = [
		"Ethereum Research",
		"Ethereum Community news",
		"Devconnect",
		"pre-confirmations",
	];

	const agentCurator = createAgent(agentParamsCurator);
	const agentEditor = createAgent(agentParamsEditor);

	const agentResearcher = createAgent(agentParamsResearcher);
	const agentAuthor = createAgent(agentParamsAuthor);

	mountObservability(agentCurator);
	mountObservability(agentEditor);
	mountObservability(agentResearcher);

	const newsActor = createActor(newsAgencyMachine);
	newsActor.start();

	// Go manual, do not interact until spawn news actor

	const storage = initStorage();
	await crawlNewsWithTopic(TOPICS_ETH, storage);

	const keys = await storage.getKeys();

	console.log("keys", keys);
	const items = await storage.getItems<NewsFeedItem>(keys);
	console.log("items", items);

	const news = items.map(({ value }) => value);

	newsActor.send({
		type: "news.createPlan",
		news: items.map(({ value }) => value),
	});

	const planResult = await planNewsDirection(agentEditor)(news);

	/**
	 * Given the plan, researcher research the internet
	 */

	console.log("research internet and write articles");

	await Promise.all(
		planResult?.articlePlans.map(async (articlePlan: any, i: number) => {
			console.log("articlePlan", articlePlan);

			const researchResult: z.infer<typeof ResearchResult> =
				await researchWithWeb(agentResearcher)({
					...articlePlan,
				});

			console.log("researchResult", researchResult);

			console.log("writing articles");
			await writeAndPersist(agentAuthor)(`article${i + 1}.md`, {
				topic: articlePlan.topic,
				editorialDirection: articlePlan.editorialDirection,
				researchContext: researchResult,
			});
		}),
	);

	return planResult?.articlePlans.map((articlePlan: any, i: number) => {
		return {
			articlePlan,
			key: `article${i + 1}.md`,
		};
	});

	// persist first, decoupled

	// fact check

	// council review

	//@ts-ignore
	// agent.interact(newsActor, (observed) => {
	//     console.log('observed')
	//     console.log(observed.state.value)

	//     // const { nextEvent } = plan!;

	//     console.log(agent.getPlans())

	//     // set goal not nextEvent

	//     // default do nothing
	//     return {
	//         goal: 'create news plan'
	//     }
	// });

	// return {
	//     agent,
	//     actor: newsActor
	// }
};

export const reviewAndDeploy = async (soulByName: Record<string, any>) => {
	const agentFactChecker = createAgent(agentParamsFactChecker);
	const agentReviewer = createAgent(agentParamsReviewer);
	const agentEditor = createAgent(agentParamsEditor);
	const agentManager = createAgent(agentParamsManager);

	mountObservability(agentFactChecker);
	mountObservability(agentEditor);
	mountObservability(agentReviewer);
	mountObservability(agentManager);

	await Promise.all(
		Object.keys(soulByName).map(async (soulName) => {
			const soul = soulByName[soulName];
			// review articles
			await reviewArticlesAndPersist(agentReviewer)(ARTICLE_METAS, soul);
		}),
	);

	await Promise.all(
		Object.keys(soulByName).map(async (soulName) => {
			const soul = soulByName[soulName];
			// review articles
			await factCheckAndPersist(agentFactChecker)(ARTICLE_METAS, soul);
		}),
	);

	const attestations = (await pullAttestations()) || [];
	await verifyAndDeploy(attestations, ARTICLE_METAS);
	// const factCheckResults = await factCheckWithRAG(agentFactChecker)(
	// 	article,
	// 	storage,
	// );
};
