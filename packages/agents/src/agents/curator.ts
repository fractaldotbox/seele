import { openai } from "@ai-sdk/openai";
import _ from "lodash";
import type { Storage } from "unstorage";
import { createTavilyClient } from "../adapters/tavily";
import { initStorage } from "../storage";

const getKey = ({ topic, title }: { topic: string; title: string }) => {
	return [_.kebabCase(topic), _.kebabCase(title)].join(":");
};

export const agentParamsCurator = {
	name: "curator",
	model: openai("gpt-4-turbo"),
	events: {},
};

export const findNews = async (topic: string) => {
	const client = createTavilyClient();

	const result = await client.search(
		`What are most important news regarding ${topic} during this week`,
		{
			topic: "news",
			timeRange: "week",
		},
	);

	return result;
};

export const crawlNewsWithTopic = async (
	topics: string[],
	storage: Storage,
) => {
	const results = await Promise.all(topics.map((topic) => findNews(topic)));

	const byTopic = _.zipObject(topics, results);

	// TODO more transform
	const byTopicWithId = _.mapValues(
		byTopic,
		({ results }: { results: any[] }, topic: string) => {
			return results.map((result) => {
				return {
					...result,
					key: getKey({
						title: result.title,
						topic: topic,
					}),
				};
			});
		},
	);

	for (const [topic, results] of Object.entries(byTopicWithId)) {
		for (const result of results) {
			storage.setItem(result.key, result);
		}
	}

	return storage;
};
