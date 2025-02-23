export interface IVerifier {
  /**
   * Verifies if an address meets the required criteria
   * @param address The Ethereum address to verify
   * @param data Optional additional data needed for verification
   * @returns Promise that resolves to true if verification passes, false otherwise
   */
  verify(address: string, data?: any): Promise<boolean>;

  /**
   * The name of the verifier
   */
  name: string;
}
