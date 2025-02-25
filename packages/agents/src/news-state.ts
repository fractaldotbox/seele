import { createMachine, spawnChild } from "xstate";

const logPlan = (plan) => {
	const { goal, nextEvent } = plan;
	console.log(goal);
	console.log(JSON.stringify(nextEvent, null, 4));
};

const logEvent = (event) => {
	console.log(JSON.stringify(event, null, 4));
};

export const reviewerMachine = createMachine({
	initial: "idle",
	states: {
		idle: {
			on: {
				"article.review": {
					actions: ({ event }) => console.log(event.text),
					target: "reviewArticle",
				},
			},
			entry: () => {
				console.log("idle");
			},
		},
		reviewArticle: {
			entry: ({ event }) => {
				console.log("review article");
				logEvent(event);
			},
		},
	},
});

export const newsAgencyMachine = createMachine({
	initial: "idle",
	entry: [
		spawnChild(reviewerMachine, { id: "reviewer-1" }),
		spawnChild(reviewerMachine, { id: "reviewer-2" }),
	],
	states: {
		idle: {
			on: {
				"news.createPlan": {
					actions: ({ event }) => console.log(event.text),
					target: "createArticlePlan",
				},
			},
			entry: () => {
				console.log("idle");
			},
		},
		createArticlePlan: {
			on: {
				"news.planCreated": "idle",
			},
			entry: ({ event }) => {
				console.log("generate news plan");
				logEvent(event);

				// reviwer
			},
		},
	},
});
