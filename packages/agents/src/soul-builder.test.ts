import _ from "lodash";
import type { Storage } from "unstorage";
import { beforeAll, describe, expect, it } from "vitest";
import { buildSoul, summarizePersonality } from "./soul-builder";
import { initStorage } from "./storage";

export type TweetItem = any;

const getKey = (tweet: any) => {
	return ["x", tweet?.author?.userName, tweet?.id].join(":").toLowerCase();
};

export const loadTweets = async (storage: Storage) => {
	const fixtures = await import.meta.glob(`./fixture/twitter/*.json`);

	for (const path in fixtures) {
		const data = (await fixtures[path]())?.default;

		await storage.setItems(
			data.map((tweet: any) => ({
				key: getKey(tweet),
				value: tweet,
			})),
		);
	}

	const keys = await storage.getKeys();

	return storage;
};

describe(
	"SoulBuilding",
	() => {
		let storage: Storage;

		beforeAll(async () => {
			storage = await initStorage();
			const tweets = await loadTweets(storage);
		});

		it.skip("test load tweets", async () => {
			const keys = await storage.getKeys("x:benbybit");
			expect(keys.length).toEqual(1136);
		});

		it("#buildSoul", async () => {
			const keys = await storage.getKeys("x:cz_binance");
			// const keys = await storage.getKeys("x:vitalikbuterin");

			const items = await storage.getItems(
				keys.map((key: string) => ({ key })),
			);

			const trainingItems = _.take(
				items.map(({ value }) => value),
				20,
			);

			const summaries = await summarizePersonality(trainingItems);

			const soul = await buildSoul(summaries);

			console.log("=====soul=====");

			console.log(soul);
		});
	},
	60 * 1000,
);
