import OpenAI from "openai";
import { z } from "zod";
import { Agent, createAgent } from "@statelyai/agent";
import { createActor, createMachine, fromPromise, waitFor } from 'xstate';
import { openai } from '@ai-sdk/openai';
import { send } from "process";
import { agentParams, createPlanResearchAgentParams, NewsPlan } from "./planner";
import { initStorage } from "./storage";
import { crawlNewsWithTopic, findAll } from "./agenda-agent";

import { generateObject } from 'ai';
import { generateObjectWithAgent } from "./utils";



const mountObservability = (agent) => {
    agent.onMessage((message: string) => {
        console.log('=== Agent messages === ')

        console.log('message', JSON.stringify(message));
        console.log('message', JSON.stringify(message?.result?.response?.messages))
    });
}


export const baristaMachine = createMachine({
    initial: 'idle',
    states: {
        idle: {
            on: {
                'barista.makeDrink': {
                    actions: ({ event }) => console.log(event.text),
                    target: 'makingDrink',
                },
            },

            entry: () => {
                console.log('idle')
            }
        },
        makingDrink: {
            on: {
                'barista.drinkMade': 'idle',
            },
            entry: ({ event }) => {
                console.log('!!! makingDrink now', event)
            }
        },
    },
});



export const start = async () => {

    const TOPICS_ETH = [
        'Ethereum Research',
        'Ethereum Community news',
        'Devconnect',
        'pre-confirmations'
    ]

    const agent = createAgent(agentParams);
    mountObservability(agent);
    const newsActor = createActor(newsMachine);
    newsActor.start();

    // Go manual, do not interact until spawn news actor

    const storage = initStorage();
    await crawlNewsWithTopic(TOPICS_ETH, storage)

    const keys = await storage.getKeys()

    console.log('keys', keys)
    const items = await storage.getItems(keys)
    console.log('items', items);

    const news = items.map(({ value }) => value);

    newsActor.send({
        type: 'news.createPlan',
        news: items.map(({ value }) => value)
    })

    const results = await generateObjectWithAgent(agent, createPlanResearchAgentParams(news));


    const articles = results?.articles || [];


    console.log('results', results)

    //@ts-ignore
    // agent.interact(newsActor, (observed) => {
    //     console.log('observed')
    //     console.log(observed.state.value)


    //     // const { nextEvent } = plan!;

    //     console.log(agent.getPlans())


    //     // set goal not nextEvent

    //     // default do nothing
    //     return {
    //         // goal: 'make a latte',
    //         goal: 'create news plan'
    //     }
    // });



    return {
        agent,
        actor: newsActor
    }
}


export const startBarista = async () => {


    const agent = createAgent({
        name: 'barista',
        model: openai('gpt-4-turbo'),
        events: {
            'barista.makeDrink': z
                .object({
                    drink: z.enum(['espresso', 'latte', 'cappuccino']),
                })
                .describe('Makes a drink'),
        },
    });


    mountObservability(agent);


    const observations = await agent.getObservations();

    console.log('observations', observations

    )

    const actor = createActor(baristaMachine);



    //@ts-ignore
    agent.interact(actor, (observed) => {
        console.log('observed')
        console.log(observed.state.value)
        // const plan = await handleOrder('I want a latte please', { value: 'idle' });


        // const { nextEvent } = plan!;

        console.log(agent.getPlans())


        // set goal not nextEvent

        // default do nothing
        return {
            goal: 'make a latte'
        }
    });



    actor.start();


    return {
        agent,
        actor
    }

    // delegate

}
