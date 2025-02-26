import { openai } from "@ai-sdk/openai";
import { Agent } from "@statelyai/agent";
import { generateText } from "ai";

const createSystemPrompt = (soul: { personality: string, name: string }) => `
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
    (agent: Agent<any, any>) =>
        async (article: string, soul: any) => {
            const result = await generateText({
                model: agent.model,
                system: createSystemPrompt(soul),
                prompt: `Review the article and sign off with your name
                    
                    <Article>
                    ${article}
                    </Article>
                    `,
            });

            return result;

        }