import { openai } from "@ai-sdk/openai";
import type { Agent } from "@statelyai/agent";
import { generateText } from "ai";
import type z from "zod";
import type { ResearchResult } from "./researcher";

export const agentParamsAuthor = {
	name: "author",
	model: openai("o1"),
	events: {},
};

export const writeArticle =
	(agent: Agent<any, any>) =>
	async ({
		topic,
		editorialDirection,
		researchContext,
		wordCount = 600,
	}: {
		topic: string;
		editorialDirection: string;
		researchContext: z.infer<typeof ResearchResult>;
		wordCount?: number;
	}) => {
		const result = await generateText({
			model: agent.model,
			prompt: `Write an article base on news of below topic and context about the future of AI.

        <Topic>
        ${topic}
        </Topic>


        <Context>

        ${researchContext}
        </Context>

        
        Write in around ${wordCount} words.
        `,
		});

		return result?.text;
	};

// const agent = createAgent(agentParamsAuthor);
// mountObservability(agent);
