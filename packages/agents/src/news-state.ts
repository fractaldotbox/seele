import { createMachine } from "xstate";


const logPlan = (plan) => {
    const { goal, nextEvent } = plan;
    console.log(goal);
    console.log(JSON.stringify(nextEvent, null, 4))
}

const logEvent = (event) => {
    console.log(JSON.stringify(event, null, 4))
}


export const newsMachine = createMachine({
    initial: 'idle',
    states: {
        idle: {
            on: {
                'news.createPlan': {
                    actions: ({ event }) => console.log(event.text),
                    target: 'createNewsPlan',
                },
            },
            entry: () => {
                console.log('idle')
            }
        },
        createNewsPlan: {
            on: {
                'news.planCreated': 'idle',
            },
            entry: ({ event }) => {
                console.log('generate news plan')
                logEvent(event);


            }
        },
    }

})

