import { openai } from "@ai-sdk/openai";
import type { Agent } from "@statelyai/agent";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { generateObjectWithAgent } from "../utils";

export type NewsFeedItem = {
	title: string;
	url: string;
	content: string;
	score: number;
	publishedDate: string;
};

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

// export const NewsCreatePlan = z.object({
//     news: z.array(
//         z.string()
//     ).describe('news of today'),

// });

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

When look for citiations, prioritize information available on polymarket, twitter and then credible sources

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
