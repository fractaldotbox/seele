import crypto from "node:crypto";
import { openai } from "@ai-sdk/openai";
import {
	EAS,
	NO_EXPIRATION,
	SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { getEasDataByChain } from "@seele/access-gate/lib/eas/utils";
import { getTransactionsWithAddress } from "@seele/data-fetch/blockscout/index";
import type { Agent } from "@statelyai/agent";
import { ethers } from "ethers";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { baseSepolia } from "viem/chains";
import { z } from "zod";
import { generateObjectWithAgent } from "../utils";

const privateKeyEditor = process.env.PRIVATE_KEY_EDITOR!;
const schemaId =
	process.env.EDITOR_SCHEMA_ID ||
	"0x2d187b5ddc9e62760d5af49d942ad67f3879d975fbd6f026a78bf971d075d3d6";

export const EASContractAddress = "0x4200000000000000000000000000000000000021"; // base sepolia
//  sepolia
// export const EASContractAddress = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';

export type NewsFeedItem = {
	title: string;
	url: string;
	content: string;
	score: number;
	publishedDate: string;
};

function generateHash(content: string, algorithm = "sha256") {
	const hash = crypto.createHash(algorithm);
	hash.update(content);
	return hash.digest("hex");
}

const alchemyApiKey = process.env.ALCHEMY_API_KEY || "";

const createPromptEditArticle = (article: string, reviews: string[]) => `

Base on the reviews below, achieve the goal

<GOAL>
1. Rewrite the article base on the reviews with around same number of words, do not comment on the original article
2. write a footnote to mention modifications you made, acknowledge and summarize reviews from the reviewers
</GOAL>

<Article>
${article}
</Article>

<Reviews>
${reviews}
</Reviews>

<EXAMPLE>
Example output:
{{
    "article": "Ether's price experienced a significant decline, dropping over 5% to $2,375 on Tuesday. This downturn coincides with a critical technical pattern, as Ether's 50-day simple moving average (SMA) is poised to cross below its 200-day SMA, signaling a potential "death cross." This pattern suggests that short-term momentum may soon underperform the long-term average, possibly leading to a pronounced bearish trend. While this indicator has a mixed track record in forecasting price movements, it often prompts momentum traders to anticipate further declines."            
    "footnote": "This article revision incorporates a more detailed analysis of the market dynamics surrounding Ether and other major cryptocurrencies, addressing the lack of depth noted in the initial review. The modifications include a clearer explanation of the technical indicators and their implications for market trends. Acknowledgment to vitalik.eth for the constructive feedback which guided these enhancements."    


}}
</EXAMPLE>



`;

const createPromptArticlePlanCreate = (news: string[]) => `
Today's date is ${new Date().toLocaleDateString("en-GB")}

Base on the news below, achieve the goal

<NEWS>
${news}
</NEWS>

<GOAL>
1. Summarize 5 most import news topic for this time period.
2. For each topic, Generate a follow-up question that would help expand your understanding
3. Plan for a report with multiple articles that cover each of the news topic.
Create a description to debrief what to research for each article, which another author will write on that  

</GOAL>

<REQUIREMENTS>
Ensure the follow-up question is self-contained and includes necessary context for web search.
</REQUIREMENTS>

<FORMAT>
Format your response as a JSON object with these exact keys:
- citationGap: Describe what information is missing or requires citation
- followUpQuery: Write a specific question to address this gap
- editorialDirection: Provides high level direction to an author who is writing an article to cover the topic and bring insights to reader
</FORMAT>

<EXAMPLE>
Example output:
{{
"articles":[
{
    "Topic: "Trump mints $31 billion with new official $TRUMP crypto meme coin"
    "citationGap": "The summary lacks citation and market trend data",
    "followUpQuery": "What are typical questions we need to search the internet to evaluate the situation?"            
    "editorialDirection": "Write an article that discuss how the memecoin impact the market and what is the historical significance"
}
    
]


}}
</EXAMPLE>

Provide your analysis in JSON format:


 `;

export const ArticlePlan = z.object({
	articlePlans: z
		.array(
			z.object({
				topic: z.string(),
				citationGap: z.string(),
				followUpQuery: z.string(),
				editorialDirection: z.string(),
			}),
		)
		.describe("Plan of News articles to write"),
});
export const EditArticleResult = z.object({
	article: z.string().describe("Edited article"),
	footnote: z
		.string()
		.describe(
			"Footnote to mention modifications made, acknowledge and summarize reviews from the reviewers",
		),
});

export const agentParamsEditor = {
	name: "planner",
	model: openai("gpt-4-turbo"),
	events: {
		"news.planCreated": ArticlePlan,
		// 'news.createPlan': NewsCreatePlan
	},
};

// Prompt inspired https://github.com/langchain-ai/ollama-deep-researcher/blob/main/src/assistant/prompts.py

const systemPrompt =
	() => `You are an expert news editor in the cryptocurrency and technology industries.

When look for citiatwions, prioritize information available on polymarket, twitter and credible sources

`;

export const createPlannerAgentParams = (newsItems: NewsFeedItem[]) => {
	const news = newsItems.map((news) => news.content).join("\n");

	const prompt = createPromptArticlePlanCreate(news);
	return {
		system: systemPrompt,
		schema: ArticlePlan,
		prompt,
	};
};

export const planNewsDirection =
	(agent: Agent<any, any>) => async (news: NewsFeedItem[]) => {
		const results = await generateObjectWithAgent(
			agent,
			createPlannerAgentParams(news),
		);

		return results;
	};

export const editArticleWithFootnote =
	(agent: Agent<any, any>) => async (article: string, reviews: string[]) => {
		const prompt = createPromptEditArticle(article, reviews);

		const results = await generateObjectWithAgent(agent, {
			schema: EditArticleResult,
			prompt,
		});

		return results;
	};

export const createEditParams = (article: string, reviews: string[]) => {
	const prompt = createPromptEditArticle(article, reviews);
	return {
		system: systemPrompt,
		schema: ArticlePlan,
		prompt,
	};
};

export const createAttestation = async (content: string) => {
	const provider = new ethers.AlchemyProvider("base-sepolia", alchemyApiKey);

	const eas = new EAS(EASContractAddress);
	const signer = new ethers.Wallet(privateKeyEditor, provider);

	eas.connect(signer);
	const offchain = await eas.getOffchain();

	const directoryAddress = "0x649318865AF1A2aE6EE1C5dE9aD6cF6162e28E22";

	// attest to manager

	const contentHash = generateHash(content);

	const schemaEncoder = new SchemaEncoder(
		"address directory,string key,string contenthash",
	);
	const encodedData = schemaEncoder.encodeData([
		{ name: "directory", value: directoryAddress, type: "address" },
		{ name: "key", value: "article1.md", type: "string" },
		{ name: "contenthash", value: contentHash, type: "string" },
	]);
	const tx = await eas.attest({
		schema: schemaId,
		data: {
			recipient: "0x0000000000000000000000000000000000000000",
			expirationTime: 0n,
			revocable: true, // Be aware that if your schema is not revocable, this MUST be false
			data: encodedData,
		},
	});

	console.log("tx", tx);

	await tx.wait();

	const txHash = tx.receipt?.hash;
	// const offchainAttestation = await offchain.signOffchainAttestation(
	// 	{
	// 		recipient: '0xFbea411E02117CEda511f8760e349bC2547Ccb9D',
	// 		expirationTime: NO_EXPIRATION, // Unix timestamp of when attestation expires (0 for no expiration)
	// 		time: BigInt(Math.floor(Date.now() / 1000)), // Unix timestamp of current time
	// 		revocable: true, // Be aware that if your schema is not revocable, this MUST be false
	// 		schema: schemaId,
	// 		refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
	// 		data: encodedData
	// 	},
	// 	signer
	// );

	return {
		txHash,
		tx,
	};
};

export const checkSubmissions = async () => {
	const results = await getTransactionsWithAddress(
		"0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
		baseSepolia.id,
	);
};
