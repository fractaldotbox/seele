import { describe, expect, it, vi } from "vitest";
import { TOPICS_MEMECOIN } from "../fixture";
import { initStorage } from "../storage";
import { crawlNewsWithTopic, findNews } from "./curator";

describe(
	"agendaAgent",
	() => {
		it("should research for topics", async () => {
			await findNews("Ethereum");
		});

		it("#crawlNewsWithTopic", async () => {
			const storage = initStorage();
			await crawlNewsWithTopic(TOPICS_MEMECOIN, storage);

			const keys = await storage.getKeys();
		});
	},
	30 * 1000,
);
