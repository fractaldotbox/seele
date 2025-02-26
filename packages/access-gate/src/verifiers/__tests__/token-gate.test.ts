import { TokenGateVerifier } from "../token-gate";
import { describe, it, expect } from "vitest";

describe("TokenGateVerifier", () => {
  it("should verify token balance", async () => {
    const verifier = new TokenGateVerifier();
    const result = await verifier.verify(
      "0x8fe013539a6c07Ac87F6d8171a103f7423ba183d",
      [
        {
          contractAddress: "0xA0c70ec36c010B55E3C434D6c6EbEEC50c705794",
          chainId: 84532,
          minBalance: "1",
        },
      ],
    );
    expect(result).toBe(true);
  });
});
