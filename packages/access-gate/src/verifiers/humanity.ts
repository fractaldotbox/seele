import type { IVerifier } from "../interfaces/verifier";
import type { sampleCredential } from "../lib/humanity/fixtures";
import { verifyCredentials } from "../lib/humanity/queries";

// humanity flow would be a bring-your-own-credential flow
// we can issue credetials from within the CMS / admin page

// verify that the person is a KYC-ed human according to humanity protocol
export class HumanityProtocolVerifier implements IVerifier {
  name = "humanity-protocol-is-human";
  issuerBaseUrl;

  async verify(
    address: string,
    data: {
      credential: typeof sampleCredential;
    },
  ): Promise<boolean> {
    if (!data) {
      console.error("[HumanityProtocolVerifier.verify] No data provided");
      return false;
    }

    if (!data.credential) {
      console.error("[HumanityProtocolVerifier.verify] No credential provided");
      return false;
    }

    // verify claims
    if (data.credential.credentialSubject.id !== `did:ethr:${address}`) {
      console.error(
        "[HumanityProtocolVerifier.verify] Incorrect credential subject",
      );
      return false;
    }

    if (!data.credential.credentialSubject.isHuman) {
      console.error(
        "[HumanityProtocolVerifier.verify] Invalid credential - not human",
      );
      return false;
    }

    // verify credibility
    try {
      const integrity = await verifyCredentials(data.credential);
      if (integrity.error) {
        console.error(
          "[HumanityProtocolVerifier.verify] Invalid credential - integrity check failed",
        );
        return false;
      }
      return integrity.isValid;
    } catch (error) {
      console.error(
        "[HumanityProtocolVerifier.verify] Error verifying credentials:",
        error,
      );
      return false;
    }
  }
}
