import { createAgent } from "@statelyai/agent";
import type { Storage } from "unstorage";
import { beforeAll, describe, expect, it } from "vitest";
import { waitFor } from "xstate";
import { TOPICS_ETH } from "../fixture";

import { ARTICLE_METAS } from "../utils";
import {
	directoryAddressAuthor,
	directoryAddressManager,
} from "./address-book";
import {
	deployArticles,
	pullAttestations,
	verifyAndDeploy,
	verifyAttestation,
} from "./manager";

describe(
	"ManagerAgent",
	() => {
		it("deploy", async () => {
			const articles = ["article content 1", "article content 2"];
			await deployArticles(articles);
		});

		it("verify article attested by editor", async () => {
			const attestations = await pullAttestations();
			const results = await verifyAttestation(
				attestations?.[0]!,
				directoryAddressAuthor,
				"article1.md",
			);
			expect(results).toEqual(true);
		});

		it("verify article not attested by editor", async () => {
			const attestations = await pullAttestations();
			const results = await verifyAttestation(
				attestations?.[0]!,
				directoryAddressAuthor,
				"article3.md",
			);
			expect(results).toEqual(false);
		});

		it.only("verify and deploy artilces", async () => {
			const attestations = await pullAttestations();

			await verifyAndDeploy(attestations!, ARTICLE_METAS);
		});
	},
	60 * 1000,
);
