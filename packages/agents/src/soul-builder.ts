// per chunk of 10 tweets, summarize personality of the author

import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { TweetItem } from "./soul-builder.test";

export const summarizePersonality = async (
	tweets: TweetItem[],
	chunkSize = 20,
) => {
	console.log("summarize tweets:", tweets.length);

	const summaries = [];
	for (let i = 0; i < tweets.length; i += chunkSize) {
		const chunk = tweets.slice(i, i + chunkSize);

		console.log(`Processing chunk: ${i / chunkSize + 1}  size ${chunkSize}`);
		const result = await generateText({
			model: openai("gpt-4-turbo"),
			prompt: `Summarize personality of the author based on the following tweets
                
                <Tweets>
                ${chunk.map((tweet) => tweet.text).join("\n")}
                </Tweets>
                `,
		});

		summaries.push(result?.text);

		console.log("results", JSON.stringify(result));
	}

	return summaries;
};

// base on these 10 summary of personality of a person, summarize that into 3 lines

export const buildSoul = async (summaries: string[]) => {
	const result = await generateText({
		model: openai("gpt-4-turbo"),
		prompt: `Summarize personality of the author based on the following summaries 
            and suggest potential viewpoints if the author is taking a reviewer role for articles on newspaper.

            Do not mention "Base on the tweets" or "Base on the summaries" in the response.
            
            <Summaries>
            ${summaries.join("\n")}
            </Summaries>
            `,
	});
	return result?.text;
};
