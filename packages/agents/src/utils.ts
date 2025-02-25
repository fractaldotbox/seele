import { Agent } from "@statelyai/agent";
import { cosineSimilarity, Embedding, embedMany, generateObject } from 'ai';
import z from "zod";
import { openai } from "@ai-sdk/openai";

// align latest xstate agent versoin
export const generateObjectWithAgent = async (agent: Agent<any, any>, {
    schema, prompt
}: {
    schema: z.Schema
    prompt: string
}) => {

    const result = await generateObject({
        model: agent.model,
        schema,
        prompt
    });
    // agent.addObservation(result.object)

    return result.object;

}

/**
 * Naive in-memory RAG
 */

export const queryWithEmbeddings = (embeddings: Embedding[], queryEmbeddings: Embedding[], threshold = 0.1) => {

    const withScore = embeddings.map((embedding, index) => {
        return {
            index,
            score: cosineSimilarity(embedding, queryEmbeddings[0]!)
        }
    })
        .sort((a, b) => b.score - a.score)
        .filter((item) => item.score > threshold);

    return withScore;
}

export const createEmbeddings = async (texts: string[]) => {
    const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-large'),
        values: texts
    });

    return embeddings;

}



// export const generateTextWithAgent = ()=>{
//  // for (const msg of await result.response) {
//     //     agent.addMessage(msg);
//     // }

// }
