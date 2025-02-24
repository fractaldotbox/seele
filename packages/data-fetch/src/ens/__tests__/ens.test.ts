import { describe, it, expect } from "vitest";
import { getSocialsFromEns } from "../ens";

describe("ENS Social Records", () => {
  it("should fetch social records for a valid ENS name", async () => {
    const ensName = "vitalik.eth";
    const socialMediaRecords = await getSocialsFromEns(ensName);

    expect(socialMediaRecords).toEqual({
      twitter: "VitalikButerin",
      github: "vbuterin",
    });
  });
});
