import type { Permissions } from "./constants";

export type SupportedChains = "sepolia" | "baseSepolia" | "optimismSepolia";

export interface EASAttestedByMemberVerifierMetadata {
  /**
   * The chain on which the attestation was made
   */
  chain: SupportedChains;
  /**
   * The address of the DAO member who attested the address
   */
  byMember: string;
  /**
   * The scope of the attestation
   */
  scope: Permissions[];
}

export interface Attestation {
  id: string;
  attester: string;
  recipient: string;
  revoked: boolean;
  timeCreated: string;
  data: string;
}

export type EasData = {
  eas: string;
  easAttestedByMemberSchema: string;
  gqlBaseUrl: string;
  baseUrl: string;
};
