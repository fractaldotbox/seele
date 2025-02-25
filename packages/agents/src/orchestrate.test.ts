import { describe, it } from "vitest";
import { start, startBarista } from "./orchestrate";
import { waitFor } from "xstate";
import { generateObjectWithAgent } from "./utils";
import { NewsPlan } from "./planner";

describe("agendaAgent", () => {

    it("#start", async () => {
        const { agent, actor } = await start();

        await waitFor(actor, (s) => s.matches('end of world'));


    });


    it.skip("#startBarista", async () => {
        const { agent, actor } = await startBarista();


        await waitFor(actor, (s) => s.matches('end of world'));


    });


}, 30 * 1000);  