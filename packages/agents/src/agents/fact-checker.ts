import { openai } from "@ai-sdk/openai";
import { cosineSimilarity, embedMany, generateText } from 'ai';
import { Storage } from "unstorage";
import { createEmbeddings, generateObjectWithAgent, queryWithEmbeddings } from "../utils";
import z, { string } from "zod";
import _ from 'lodash'
import { NewsFeedItem } from "../planner";
import { createAgent } from "@statelyai/agent";
/**
 * Base on data (from polymarket)
 * Detect false information in the article and provide suggestions
 */

export const agentParamsFactChecker = {
    name: 'fact-checker',
    model: openai('gpt-4-turbo'),
    events: {
    },

}


export const createFactCheckPromptParams = (query, facts: string[]) => {

    const newsContext = facts.join('\n');

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
        prompt

    }

}

export const FactCheckResult = z.object({
    is_true: z.boolean(),
    confidence_level: z.number(),
    citations: z.string(),
    citation_url: z.string(),
    explanation: z.string(),
}).describe('Result of fact checking if statement is true');


export const factCheckWithRAG = async (query: string, storage: Storage) => {

    const result = await generateText(
        {
            model: openai('gpt-4-turbo'),
            prompt: createRAGPrompt(query),
        }
    )

    const agent = createAgent(agentParamsFactChecker);

    const keywordsQuery = result.text;

    console.log('keywordsQuery:', keywordsQuery)
    const relevantNews = await findRelevantInfo(keywordsQuery, storage);


    const params = createFactCheckPromptParams(query, relevantNews.map(({ item }) => item.value.content));

    console.log('===fact check agent===');

    console.log(params.prompt);
    const results = await generateObjectWithAgent(agent, params);


    console.log('fact check results', results)
}


// TODO polymarket data
// canonical data format



export const findRelevantInfo = async (query: string, storage: Storage, k: number = 10) => {

    const keys = await storage.getKeys()
    const items = await storage.getItems(keys)

    // TODO type
    const embeddings = await createEmbeddings(items.map((item) => item.value.title));
    const queryEmbeddings = await createEmbeddings([query]);

    const results = await queryWithEmbeddings(embeddings, queryEmbeddings);

    return _.take(results, k).map((result) => {
        const { index, score } = result;
        const item = items[index];


        return {
            item,
            score
        }

    })

}

export const createRAGPrompt = (query: string) => {


    return `
    identify 1-3 keywords in the query "${query}, delimited by "," Example: "Trump,Biden,election"
    `


}


// export const 