import { createAgent } from "@statelyai/agent";
import type { Storage } from "unstorage";
import { beforeAll, describe, expect, it } from "vitest";
import { waitFor } from "xstate";
import { TOPICS_ETH } from "../fixture";
import { newsAgencyMachine } from "../news-state";
import { initStorage } from "../storage";
import { createEmbeddings, queryWithEmbeddings } from "../utils";
import { crawlNewsWithTopic } from "./curator";
import { deployArticles } from "./manager";

describe(
	"ManagerAgent",
	() => {
		it("deploy", async () => {
			const articles = ["article content 1", "article content 2"];
			await deployArticles(articles);
		});
	},
	60 * 1000,
);
