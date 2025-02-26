import { openai } from "@ai-sdk/openai";
import { createAgent } from "@statelyai/agent";
import { describe, expect, it, vi } from "vitest";
import { NEWS_FEED } from "../fixture";
import { generateObjectWithAgent } from "../utils";
import {
	ArticlePlan,
	NewsFeedItem,
	agentParamsEditor,
	createPlannerAgentParams,
	editArticleWithFootnote,
} from "./editor";

describe(
	"EditorAgent",
	() => {
		it("should ", async () => {
			const agent = createAgent(agentParamsEditor);

			const article = `Top-level Ethereum 
 Foundation researchers responded to questions about scaling, Layer 1 revenue and security, in their latest semi-annual Reddit “AMA” (Ask Me Anything) session. The session comes amid a shift for the organization as former EF Executive Director Aya Miyaguchi announced she is "stepping up" as the organization’s president, following months of community backlash. 

Perhaps most notably in the high-level discussion, the Ethereum researchers helped shed light on the upcoming Pectra upgrade, which will represent the largest technological advancement for the blockchain since the Dencun fork last year and shift to proof-of-stake before that.

The first step of the two-phase Pectra update is expected to begin rolling out "in the coming months," top EF researcher Justin Drake said in a Reddit comment. Last week, the foundation’s security team opened up a $2 million bug bounty competition to stress test the hard fork that will run until March 24.

It was also a moment for some of Ethereum’s most involved researchers to reclaim ground for the base layer network, which in recent years has seemingly lost mindshare to the Layer 2s meant to scale it. In particular, the EF researchers — including founder Vitalik Buterin — seem determined to improve the network’s economic position by reclaiming revenue from L2s and pushing for "native rollups."

"The goal is neutrality of Ethereum, not neutrality of the Ethereum Foundation — often, the two align, but sometimes they misalign, and when that happens we should go for the former," Buterin said in response to a question about a potential "corporate takeover" of Ethereum. "Big risks that I see right now are at the L2 and wallet layer as well as staking and custody providers. The EF has recently started to step into the former two areas by pushing for adoption of interoperability standards."

Blobs, data availability and revenue
Notably, Pectra will double the number of "blob" transactions per block from three to six, which Drake said will "crush the blob fee market," currently one of the ways value accrues to the Ethereum network and ETH as a commodity. Blobs, introduced in the Dencun update, temporarily store transaction data to reduce costs for Layer 2s rolling down data to the mainchain.

While there have been some calls among the Ethereum community to raise the blob "base fee," the Ethereum Foundation researchers generally seem to think this is shortsighted idea. (That said, there is a current Ethereum Improvement Proposal, EIP-7762, that is considering raising the fee.)

"I find these arguments very short-sighted, first because they require the network to have an opinion regarding what is the right level of this tax (i.e., something like a fiscal policy), and second because I believe more value will accrue the more we grow the Ethereum economy," EF researcher Barnabé Monnot wrote. 

Drake, along with fellow researcher Dankrad Feist, argued that the Ethereum base layer should scale its native "data availability" though don’t see "altDA," in likes of restaking platform EigenLayer, as much of a threat. That’s in part because the as the whole pie grows, there will be opportunities for different forms for data availability from blobs to EigenDA. 

"We should maximize the opportunities where there is a chance evenutally charge some fees," Feist said. 

It’s a point echoed by Drake, who noted that in the long term, DA demand will likely outpace supply, if only because "humans always find creative ways to consume more bandwidth."

"In ~10 years I expect Ethereum to settle 10M TPS (roughly 100 transactions per day per human) and even at little as $0.001/transaction is $1B/day of revenue :)," Drake said, somewhat optimistically. Additionally, future scaling initiatives like danksharding will balance DA supply and demand while ensuring sustained L1 revenue.

Ethereum's 'endgame'
Indeed, while the future of Ethereum scaling can still take multiple paths, the EF researchers are growing more comfortable with discussing the possible "endgame." 

"Ideally we can separate the parts that can ossify from the parts that need to keep evolving," Buterin said. "I think there is a 'light at the end of the tunnel' for many of these tech questions, because the pace of research really is slower than it was ~5 years ago, and the recent emphasis is much more on incremental improvement."

One aspect relatively new to the "endgame" of Ethereum scaling is the idea of native rollups, which was the focus of the first question answered. While not yet formally defined, the general idea is that it would be a way to scale Ethereum’s core, rather than add-ons like contemporary L2s like Optimism or Arbitrum, which process transactions off the base layer and post summaries back to Ethereum for security.

"The discussion around native rollups is quite nascent," Drake, who is a leading researcher in the field, said. "Having said that, from my experience it is remarkably easy to sell the concept of native rollups to EVM-equivalent rollups. If a rollup has the option to become native, then why not? It's a strict improvement that is provided essentially free by the L1."

Drake noted that there has already been interest from "top rollups" including Arbitrum, Base, Optimism and Scroll in "becoming native."

Nonetheless, the EF’s Ansgar Dietrichs noted that the rollup-centric roadmap Ethereum has been going down for years spawned a massive amount of technological innovation from competing teams researching areas like zero-knowledge proof and interoperability.

"Looking back, I'm pretty certain that on our own, we would have never been able to make this much progress in such a timeframe," Dietrichs said. "The parallel exploration of the design space by multiple teams has been enormously beneficial. It is easy to forget about that when focusing on the (real!) challenges this approach created (e.g. around interoperability and fractured UX)."

`;
			const results = await editArticleWithFootnote(agent)(article, [
				"This article lacks detailed analysis on the market impact and regulatory responses to the launch of $TRUMP. Reviewed by vitalik.eth",
				"This article is great as it mentioned the long-term potential of Ethereum. Reviewed by cz",
			]);

			expect(results.footnote).toBeDefined();

			console.log("rewrite results", results);
		});
	},
	60 * 1000,
);
