const { tavily } = require('@tavily/core');
import { initStorage } from './storage'
import type { Storage } from "unstorage";
import _ from 'lodash';
import crypto from "crypto";

const getKey = ({ topic, title }: { topic: string, title: string }) => {

    return [
        _.kebabCase(topic),
        _.kebabCase(title)

    ].join(':')

}
const tavilyApiKey = process.env.TAVILY_API_KEY;

const client = tavily({ apiKey: tavilyApiKey });


export const findNews = async (topic: string) => {

    const result = await client.search(`What are most important news regarding ${topic} during this week`, {
        topic: "news",
        timeRange: "week"
    })


    return result;


}


export const crawlNewsWithTopic = async (topics: string[], storage: Storage) => {


    const results = await Promise.all(
        topics.map(topic => findNews(topic))
    )

    const byTopic = _.zipObject(topics, results)




    // TODO more transform
    const byTopicWithId = _.mapValues(byTopic, ({ results }: { results: any[] }, topic: string) => {
        return results.map((result) => {
            return ({
                ...result,
                key: getKey({
                    title: result.title,
                    topic: topic
                })

            })
        })
    })



    for (const [topic, results] of Object.entries(byTopicWithId)) {
        for (const result of results) {
            storage.setItem(result.key, result)
        }
    }

    return storage;


}