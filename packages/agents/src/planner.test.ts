import { describe, it, expect, vi } from "vitest";
import { agentParamsPlanner, createPlanResearchAgentParams, NewsFeedItem, NewsPlan, planResearch } from "./planner";
import { generateObjectWithAgent } from "./utils";
import { createAgent } from "@statelyai/agent";
import { openai } from "@ai-sdk/openai";
import { truncateSync } from "fs";


const NEWS_FEED = [
    {
        "title": "Girlfriend who allegedly stole $800K of TrumpCoin from her beau in ICE custody, faces deportation - New York Post",
        "url": "https://nypost.com/2025/02/21/us-news/woman-who-allegedly-stole-800k-of-trumpcoin-from-ex-boyfriend-in-ice-custody/",
        "content": "Woman who allegedly stole $800K of TrumpCoin from ex-boyfriend in ICE custody Trump fires Air Force Gen. CQ Brown as chairman of the Joint Chiefs of Staff Girlfriend who allegedly stole $800K of TrumpCoin from her boyfriend now in ICE custody, faces deportation Anthony Bravo and 22-year-old native-Tunisian Maissa Jebali had been dating for six months when the couple had a verbal argument on Bravo’s yacht in South Florida, NBC6 reported. Maissa Jebali (left) allegedly stole $800,000 dollars worth of TrumpCoin from her boyfriend Anthony Bravo (right). Days later at the county jail, Jebali was taken into the custody of Immigration and Customs Enforcement — though Bravo doesn’t want to see her deported just yet. Maissa Jebali (left) allegedly stole $800,000 dollars worth of TrumpCoin from her boyfriend Anthony Bravo (right).",
        "score": 0.38894346,
        "publishedDate": "Sat, 22 Feb 2025 01:58:00 GMT"
    },
    {
        "title": "Trump mints $31 billion with new official $TRUMP crypto meme coin - AOL",
        "url": "https://www.aol.com/trump-mints-31-billion-official-181944125.html",
        "content": "Trump mints $31 billion with new official $TRUMP crypto meme coin Just days before his second inauguration, President-elect Donald Trump issued a cryptocurrency meme coin memorializing his response to the July 2024 assassination attempt. The new $TRUMP meme coin – a type of cryptocurrency – launched Friday night with posts on Trump's Truth Social social media platform and on X, the social network previously known as Twitter. How much is the new Trump meme coin? President-elect Donald Trump just launched his own meme coin, $TRUMP 🤯The token now sits at $10.3 BILLION FDV.Track $TRUMP: https://t.co/nD6buADmRp pic.twitter.com/oZP5oroCOJ This article originally appeared on USA TODAY: Trump meme coin price: Crypto coin nets $31 billion overnight",
        "score": 0.38685668,
        "publishedDate": "Sun, 23 Feb 2025 14:39:49 GMT"
    },
    {
        "title": "Trump's Russian rapprochement, Mars musing and DOGE dividends. And is the gold gone? It's Week 5 - The Washington Post",
        "url": "https://www.washingtonpost.com/politics/2025/02/23/trump-russia-musk-inflation-fort-knox-ukraine/1ff5191e-f1e4-11ef-acb5-08900d482a27_story.html",
        "content": "President Donald Trump’s week included rewriting U.S. policy toward Russia and firing the country’s senior military officer WASHINGTON — President Donald Trump's fifth week in office included a dramatic shift in U.S. policy toward Russia, firing the country’s senior military officer, sitting for a chummy interview alongside bureaucracy-buster Elon Musk and seeking greater authority over independent regulatory agencies. Yet the White House suggested in a court filing that Musk wasn't heading DOGE , a notion undercut by Trump himself, who said he had “put a man named Elon Musk in charge.” Last week, the president ordered his administration to take a closer look at Fort Knox , the United States Bullion Depository, “to make sure the gold is there.” That directive came after Musk posted about the site, which has stored precious metal bullion reserves for the U.S. since 1937, potentially having been emptied of gold.",
        "score": 0.35723165,
        "publishedDate": "Sun, 23 Feb 2025 17:28:39 GMT"
    }
] as NewsFeedItem[];

describe("research", () => {

    it("should research for topics", async () => {

        const agent = createAgent(agentParamsPlanner);
        const results = await generateObjectWithAgent(agent, createPlanResearchAgentParams(NEWS_FEED));

        expect(results.articles.length > 0).toBe(true);
        expect(results.articles[0].topic.includes('Trump')).toBe(true);

    });
}, 60 * 1000);