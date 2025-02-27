import { openai } from "@ai-sdk/openai";
import type { Agent } from "@statelyai/agent";
import { generateText } from "ai";
import type z from "zod";
import { persistWithDirectory } from "../storage";
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
			prompt: `Write an article base on news of below topic and context

        <Topic>
        ${topic}
        </Topic>


		<EditorialDirection>
		${editorialDirection}
		</EditorialDirection>

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

export const writeAndPersist =
	(agent: Agent<any, any>) => async (contentKey: string, context: any) => {
		const privateKeyAgent = process.env.PRIVATE_KEY_AGENT!;

		const article = await writeArticle(agent)(context);

		await persistWithDirectory(
			{
				privateKey: privateKeyAgent,
				directoryAddress: "0x73b6443ff19e7ea934ae8e4b0ddcf3d899580be8",
			},
			{
				namespace: "community1",
				contentKey,
				content: article,
			},
		);
	};
