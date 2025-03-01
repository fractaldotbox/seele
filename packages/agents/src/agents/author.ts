import { openai } from "@ai-sdk/openai";
import type { Agent } from "@statelyai/agent";
import { generateText } from "ai";
import { http, type Hex, createWalletClient, custom, stringToHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia, sepolia } from "viem/chains";
import type z from "zod";
import { persistWithDirectory } from "../storage";
import { addressEditor } from "./address-book";
import type { ResearchResult } from "./researcher";

// TODO use different directory per namespace
const directoryAddress = "0x30B00979c33F826BCF7e182545A3353aD97e1C42";

const privateKeyAuthor = process.env.PRIVATE_KEY_AUTHOR! as Hex;

export const agentParamsAuthor = {
  name: "author",
  model: openai("o1"),
  events: {},
};

export const writeArticle =
  (agent: Agent<any, any>) =>
  async ({
    topic,
    editorialDirection,
    researchContext,
    wordCount = 600,
  }: {
    topic: string;
    editorialDirection: string;
    researchContext: z.infer<typeof ResearchResult>;
    wordCount?: number;
  }) => {
    const result = await generateText({
      model: agent.model,
      prompt: `Write an article base on news of below topic and context

        <Topic>
        ${topic}
        </Topic>


		<EditorialDirection>
		${editorialDirection}
		</EditorialDirection>

        <Context>
        ${researchContext}
        </Context>

        
        Write in around ${wordCount} words.
        `,
    });

    return result?.text;
  };

// const agent = createAgent(agentParamsAuthor);
// mountObservability(agent);

export const writeAndPersist =
  (agent: Agent<any, any>) => async (contentKey: string, context: any) => {
    const article = await writeArticle(agent)(context);

    await persistWithDirectory(
      {
        privateKey: privateKeyAuthor,
        directoryAddress,
      },
      {
        // namespace: "community1",
        contentKey,
        content: article,
      },
    );

    const url = createArticleUrl(directoryAddress, contentKey);
    return url;
  };

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(),
});

const createArticleUrl = (directoryAddress: string, key: string) => {
  return `https://${directoryAddress}.3337.w3link.io/${key}`;
};

export const submitArticle = async (key: string) => {
  const account = privateKeyToAccount(privateKeyAuthor);

  const url = createArticleUrl(directoryAddress, key);
  const hash = await walletClient.sendTransaction({
    account,
    to: addressEditor as Hex,
    value: 10n,
    data: stringToHex([url].join(";")),
  });
  return {
    hash,
    url,
  };
};
