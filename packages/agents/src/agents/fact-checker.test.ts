import { beforeAll, describe, expect, it } from "vitest";
import { start, startBarista } from "../orchestrate";
import { waitFor } from "xstate";
import { newsMachine } from "../news-state";
import { createEmbeddings, queryWithEmbeddings } from "../utils";
import { factCheckWithRAG, findRelevantInfo } from "./fact-checker";
import { crawlNewsWithTopic } from "../agenda-agent";
import { TOPICS_ETH } from "../fixture";
import { initStorage } from "../storage";
import { Storage } from "unstorage";


describe("FactCheckingAgent", () => {
    let storage: Storage;


    beforeAll(async () => {
        storage = await initStorage();
        await crawlNewsWithTopic(TOPICS_ETH, storage);
    })
    it('#createEmbedding', async () => {
        const embeddings = await createEmbeddings(['text1', 'text2', 'abc']);

        expect(embeddings.length).toEqual(3);

    });

    it('#queryWithEmbeddings', async () => {
        const embeddings = await createEmbeddings(['Elon Musk', 'Donlad Trump',]);
        const queryEmbeddings = await createEmbeddings(['Trumpcoin']);

        const queryResult = queryWithEmbeddings(embeddings, queryEmbeddings);

        console.log('queryResult', queryResult);

        expect(queryResult[0].index).toEqual(1);

    });




    it('#findRelevantInfo', async () => {

        await findRelevantInfo('North Korea', storage);

        // TODO mock the crawl results
    });

    it.only('#factCheckWithRAG obvious', async () => {

        const query = 'North Korea is involved in the bybit hack';
        await factCheckWithRAG(query, storage);


    })


    it.only('#factCheckWithRAG indirect', async () => {

        const query = 'Biden is current president';
        await factCheckWithRAG(query, storage);


    })



}, 5 * 60 * 1000);  