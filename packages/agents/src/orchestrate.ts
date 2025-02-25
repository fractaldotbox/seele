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
import { initStorage } from "./storage";

import { generateObject } from "ai";
import { writeArticle } from "./agents/author";
import { factCheckWithRAG } from "./agents/fact-checker";
import {
	type ResearchResult,
	agentParamsResearcher,
	researchWithWeb,
} from "./agents/researcher";
import { newsAgencyMachine } from "./news-state";
import { generateObjectWithAgent } from "./utils";

const mountObservability = (agent) => {
	agent.onMessage((message: string) => {
		console.log("=== Agent messages === ");

		console.log("message", JSON.stringify(message));
		console.log("message", JSON.stringify(message?.result?.response?.messages));
	});
};

export const baristaMachine = createMachine({
	initial: "idle",
	states: {
		idle: {
			on: {
				"barista.makeDrink": {
					actions: ({ event }) => console.log(event.text),
					target: "makingDrink",
				},
			},

			entry: () => {
				console.log("idle");
			},
		},
		makingDrink: {
			on: {
				"barista.drinkMade": "idle",
			},
			entry: ({ event }) => {
				console.log("!!! makingDrink now", event);
			},
		},
	},
});

/**
 * Put the dependency inside state machine whenever possible
 * While agent action are functional for composability and testability
 */

export const start = async () => {
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

	const agentFactChecker = createAgent(agentParamsFactChecker);

	mountObservability(agentCurator);
	mountObservability(agentEditor);
	mountObservability(agentResearcher);
	mountObservability(agentFactChecker);

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

	const planResults = await planNewsDirection(agentEditor)(news);

	/**
	 * Given the plan, researcher research the internet
	 */

	for (const articlePlan of planResults?.articlePlans) {
		console.log("articlePlan", articlePlan);

		const researchResult: z.infer<typeof ResearchResult> =
			await researchWithWeb(agentResearcher)({
				...articlePlan,
			});

		console.log("researchResult", researchResult);

		const article = await writeArticle(agentAuthor)({
			topic: articlePlan.topic,
			editorialDirection: articlePlan.editorialDirection,
			researchContext: researchResult,
		});

		const factCheckResults = await factCheckWithRAG(agentFactChecker)(
			article,
			storage,
		);

		// TODO into state machine

		// factCheckWithRAG(agentFactChecker)()
	}

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
	//         // goal: 'make a latte',
	//         goal: 'create news plan'
	//     }
	// });

	// return {
	//     agent,
	//     actor: newsActor
	// }
};
