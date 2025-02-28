import { openai } from "@ai-sdk/openai";
import type { Agent } from "@statelyai/agent";
import { generateText } from "ai";
import type z from "zod";
import { persistWithDirectory } from "../storage";
import type { ResearchResult } from "./researcher";
import { createWalletClient, custom, http } from 'viem'
import { sepolia } from 'viem/chains'


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

export const walletClient = createWalletClient({
	chain: sepolia,
	transport: http(),
})



export const submitArticle = async () => {
	const privateKeyEditor = '0xbd6d633b89d6cca1c1d4e67316d073cf8a508d544a5fc496270862f015d2ee0f';
	const editorAddress = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';

	const [account] = await walletClient.getAddresses()

	console.log('acount', account)
	// const hash = await walletClient.sendTransaction({
	// 	account,
	// 	to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
	// 	value: 1000000000000000000n
	// })
}