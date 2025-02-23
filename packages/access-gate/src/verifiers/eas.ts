import { IVerifier } from "../interfaces/verifier";

export class EASVerifier implements IVerifier {
  name = "eas";

  verify(address: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
