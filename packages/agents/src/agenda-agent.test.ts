import { describe, it, expect, vi } from "vitest";
import { crawlNewsWithTopic, findNews } from "./agenda-agent";
import { initStorage } from "./storage";
import { TOPICS_MEMECOIN } from "./fixture";



describe("agendaAgent", () => {

    it("should research for topics", async () => {
        await findNews('Ethereum')
    });


    it('#crawlNewsWithTopic', async () => {
        const storage = initStorage();
        await crawlNewsWithTopic(TOPICS_MEMECOIN, storage)

        const keys = await storage.getKeys()


    })

}, 30 * 1000);  