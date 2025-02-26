import { openai } from "@ai-sdk/openai";
import { type Agent, createAgent } from "@statelyai/agent";
import { cosineSimilarity, embedMany, generateText } from "ai";
import _ from "lodash";
import type { Storage } from "unstorage";
import { an } from "vitest/dist/chunks/reporters.DTtkbAtP.js";
import z, { string } from "zod";
import {
	createEmbeddings,
	generateObjectWithAgent,
	queryWithEmbeddings,
} from "../utils";
import { NewsFeedItem } from "./editor";
/**
 * Base on data (from polymarket)
 * Detect false information in the article and provide suggestions
 */

export const agentParamsFactChecker = {
	name: "fact-checker",
	model: openai("gpt-4-turbo"),
	events: {},
};

export const createFactCheckPromptParams = (query: string, facts: string[]) => {
	const newsContext = facts.join("\n");

	const prompt = `
    Facts are provided in the context. 
  <Context>
  
    ${newsContext}
  </Context>

  Fact-check the following statement:

  ${query}


  `;

	return {
		system: `You are a fact-checking expert.
        Use the provided context to thoroughly analyze and fact-check the prompt.
        Be factual and not to be creative
        
        Provide explanation and state what you can really confirm.
        
        Provide citations on context you used to fact-check the statement and put the citation URL at citation_url

        Provide confidence_level from 0-1 on how confident you are on the fact-checking result.

        <EXAMPLE>
        Example output:
        {{
        
        {
            "is_true": false,
            "confidence_level": 0.8
            "explanation": "Biden did not serve 2nd term of president"            
            "citations": "According to Polymarket market "2024 Election winner" , Biden served as president from 2021-2025 and loss the last election in 2025",
            "citation_url: "https://www.forbes.com/sites/digital-assets/2024/12/10/leak-reveals-russias-bid-for-bitcoin-reserve-amid-huge-2025-price-predictions/"
        }
            
        ]
        
        }}
        </EXAMPLE>
        
        
        "`,
		schema: FactCheckResult,
		prompt,
	};
};

export const FactCheckQuery = z
	.object({
		claim: z.string(),
		keywords: z.array(z.string()),
	})
	.describe("Claim to be fact-check");

export const FactCheckResult = z
	.object({
		is_true: z.boolean(),
		confidence_level: z.number(),
		citations: z.string(),
		citation_url: z.string(),
		explanation: z.string(),
	})
	.describe("Result of fact checking if statement is true");

export const identifyClaimWithKeywords =
	(agent: Agent<any, any>) => async (query: string) => {
		const result = await generateObjectWithAgent(agent, {
			schema: FactCheckQuery,
			prompt: createRAGPrompt(query),
		});

		return result;
	};

export const factCheckWithRAG =
	(agent: Agent<any, any>) => async (article: string, storage: Storage) => {
		const claimWithKeywords = await identifyClaimWithKeywords(agent)(article);

		console.log("claimWithKeywords:", claimWithKeywords);
		const relevantNews = await findRelevantInfo(
			claimWithKeywords?.keywords,
			storage,
		);

		const params = createFactCheckPromptParams(
			article,
			relevantNews.map(({ item }) => item.value.content),
		);

		console.log("===fact check===");

		console.log(params.prompt);
		const results = await generateObjectWithAgent(agent, params);

		console.log("fact check results", results);

		return results;
	};

// TODO polymarket data
// canonical data format

export const findRelevantInfo = async (
	keywords: string[],
	storage: Storage,
	k = 10,
) => {
	const keys = await storage.getKeys();
	const items = await storage.getItems(keys);

	// TODO type
	const embeddings = await createEmbeddings(
		items.map((item) => item.value.title),
	);
	const queryEmbeddings = await createEmbeddings([keywords.join(",")]);

	const results = await queryWithEmbeddings(embeddings, queryEmbeddings);

	return _.take(results, k).map((result) => {
		const { index, score } = result;
		const item = items[index];

		return {
			item,
			score,
		};
	});
};

export const createRAGPrompt = (query: string) => {
	return `
    identify 1-3 keywords in the query "${query}, delimited by "," Example: "Trump,Biden,election"
    `;
};

// export const
