import { gql } from "graphql-request";

export const GetAttestationByParams = gql`
  query AttestationByParameters($where: AttestationWhereInput) {
    attestations(where: $where) {
      attester
      recipient
      revoked
      schemaId
      id
      data: decodedDataJson
    }
  }
`;
