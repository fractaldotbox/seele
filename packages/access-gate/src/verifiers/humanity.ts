import type { IVerifier } from "../interfaces/verifier";

// verify that the person is a KYC-ed human according to humanity protocol
export class HumanityProtocolKYCVerifier implements IVerifier {
  name = "humanity-protocol-is-human";
  issuerBaseUrl;

  async verify(address: string, data?: unknown): Promise<boolean> {
    // verify self-issued-vc

    return true;
  }
}
