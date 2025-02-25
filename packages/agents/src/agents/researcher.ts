import { openai } from "@ai-sdk/openai";
import { type Agent, createAgent } from "@statelyai/agent";
import z from "zod";
import { createTavilyClient } from "../adapters/tavily";
import { generateObjectWithAgent } from "../utils";

export const agentParamsResearcher = {
	model: openai("o1"),
};

export const WebSearchQuery = z
	.object({
		queries: z.array(z.string()),
	})
	.describe("Result for research");

export const ResearchResult = z
	.object({
		analysis: z.string(),
		facts: z.string(),
		citations: z.array(z.string()),
		citationUrls: z.array(z.string()),
	})
	.describe("Result for research");

const system = `You are a researcher experienced in the blockchain industries. 
Your sole purpose is to research from the internet for factual materials supporting author to write aan news article. 
For any url, only use correct url retrieved from results

`;

const createPromptBase = (params: ResearchPromptParams) => `

Research for the topic below.
Follow Editor Direction, address the question in <FollowUpQuery> and fill in the gaps in <CitationsGap>


<Topic>
${params.topic}

</Topic>
    
<editorialDirection>
${params.editorialDirection}

</editorialDirection>

        
<FollowUpQuery>
${params.followUpQuery}

</FollowUpQuery>


<CitationsGap>
${params.citationGap}
</CitationsGap>

`;

export type ResearchPromptParams = {
	topic: string;
	editorialDirection: string;
	citationGap: string;
	followUpQuery: string;
};

export const createResearchWebsearchParams = ({
	topic,
	editorialDirection,
	citationGap,
	followUpQuery,
}: ResearchPromptParams) => {
	const promptBase = createPromptBase({
		topic,
		editorialDirection,
		citationGap,
		followUpQuery,
	});
	return {
		system,
		schema: WebSearchQuery,
		prompt: `
        Suggest 3 and only 3 queries to search on Search Engine for the research. 

        ${promptBase}
        
        `,
	};
};

export const createResearchWithContextParams = (
	params: ResearchPromptParams,
	contexts: any[],
) => {
	const promptBase = createPromptBase(params);

	const prompt = `
    ${promptBase}

    
    <Context>
    ${contexts.map(
			(context) =>
				`
            Title:${context.title}
            Url: ${context.url}
            content: ${context.rawContent}
        `,
		)}
    </Context>

    
    Come up with citations, facts and analysis given the Context find on the web. 
    `;

	return {
		system,
		schema: ResearchResult,
		prompt,
	};
};

const researchForTopic =
	(agent: Agent<any, any>) =>
	async (params: ResearchPromptParams, contexts: any[]) => {
		const researchResults = await generateObjectWithAgent(
			agent,
			createResearchWithContextParams(params, contexts),
		);

		console.log("final research results", researchResults);

		return researchResults;
	};

export const crawlWeb = async (queries: string[]) => {
	const client = createTavilyClient();

	const results = [];
	for (const query of queries) {
		const searchResult = await client.search(query, {
			topic: "general",
			maxResults: 3,
			includeRawContent: true,
		});
		results.push(searchResult?.results);
	}

	return results;
};

export const researchWithWeb =
	(agent: Agent<any, any>) => async (params: ResearchPromptParams) => {
		console.log("Web Search:", params.topic);

		const queriesResults = await generateObjectWithAgent(
			agent,
			createResearchWebsearchParams(params),
		);

		const queries = queriesResults.queries;

		const webSearchResults = await crawlWeb(queries);

		console.log("Web Search completed, Summarize Research");

		return await researchForTopic(agent)(params, webSearchResults);
	};
