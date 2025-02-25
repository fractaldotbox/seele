import { tavily } from "@tavily/core";

export const createTavilyClient = () => {
	const tavilyApiKey = process.env.TAVILY_API_KEY;

	const client = tavily({ apiKey: tavilyApiKey });

	return client;
};
