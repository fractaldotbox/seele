import { createAgent } from "@statelyai/agent";
import type { Storage } from "unstorage";
import { beforeAll, describe, expect, it } from "vitest";
import { waitFor } from "xstate";
import { TOPICS_ETH } from "../fixture";

import { directoryAddressAuthor } from "./address-book";
import { deployArticles, verifyAndDeploy, verifyAttestation } from "./manager";

describe(
	"ManagerAgent",
	() => {
		it("deploy", async () => {
			const articles = ["article content 1", "article content 2"];
			await deployArticles(articles);
		});

		it("verify article attested by editor", async () => {
			const results = await verifyAttestation(
				directoryAddressAuthor,
				"article1.md",
			);
			expect(results).toEqual(true);
		});

		it("verify article not attested by editor", async () => {
			const results = await verifyAttestation(
				directoryAddressAuthor,
				"article3.md",
			);
			expect(results).toEqual(false);
		});

		it.only("verify and deploy artilces", async () => {
			const articleMetas = [
				{
					key: "article1.md",
					directoryAddress: directoryAddressAuthor,
				},
				{
					key: "article2.md",
					directoryAddress: directoryAddressAuthor,
				},
				// {
				// 	key: "article3.md",
				// 	directoryAddress: directoryAddressAuthor,
				// },
			];
			await verifyAndDeploy(articleMetas);
		});
	},
	60 * 1000,
);
