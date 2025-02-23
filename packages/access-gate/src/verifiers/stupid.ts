import { IVerifier } from "../interfaces/verifier";

/**
 * A simple verifier that returns true if data is truthy for integration testing purposes
 * @implements {IVerifier}
 */
export class StupidVerifier implements IVerifier {
  name = "stupid";

  async verify(address: string, data?: any): Promise<boolean> {
    return !!data;
  }
}
