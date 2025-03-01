import { openai } from "@ai-sdk/openai";
import type { Agent } from "@statelyai/agent";
import { generateText } from "ai";
import { type ArticleMeta, loadArticles } from "../adapters/utils";
import { persistWithDirectory } from "../storage";
import { EditArticleResult } from "./editor";

const directoryAddress = process.env.DIRECTORY_ADDRESS_EDITOR!;
const privateKeyEditor = process.env.PRIVATE_KEY_EDITOR!;

const createSystemPrompt = (soul: { personality: string; name: string }) => `
You are a newspaper writing reviewer familiar with the blockchain industries.

Your name is ${soul.name}

Your personality according to your tweets.

<Personality>
${soul?.personality}
</Personality>
Your sole purpose is to provide short feedback on a written 
article so the editor will know what to fix.\n 
`;

export const agentParamsReviewer = {
	model: openai("o1"),
};

export const reviewArticle =
	(agent: Agent<any, any>) => async (article: string, soul: any) => {
		const result = await generateText({
			model: agent.model,
			system: createSystemPrompt(soul),
			prompt: `Review the article and sign off with your name
                    
                    <Article>
                    ${article}
                    </Article>
					
					Write in 100 words or less.
                    `,
		});

		return result?.text;
	};

export const loadAgentReputaitons = () => {
	// load agent reputations base on EAS
};

// load soul
// use directory of editor
export const reviewArticlesAndPersist =
	(agent: Agent<any, any>) =>
		async (articleMetas: ArticleMeta[], soul: any) => {
			const articles = await loadArticles(articleMetas);

			return await Promise.all(
				articles.map(async (article, index) => {
					const key = article.key;
					console.log("review with:", soul.name, key);
					const reviewed = await reviewArticle(agent)(article.content, soul);
					console.log("reviewed", reviewed);
					await persistWithDirectory(
						{
							privateKey: privateKeyEditor,
							directoryAddress,
						},
						{
							namespace: `review-${soul.name.replace('.', '-')}`,
							contentKey: article.key,
							content: reviewed,
						},
					);
				}),
			);
		};
