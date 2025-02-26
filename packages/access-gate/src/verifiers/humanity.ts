import type { IVerifier } from "../interfaces/verifier";
import { listCredentials, verifyCredentials } from "../lib/humanity/queries";

// verify that the person is a KYC-ed human according to humanity protocol
export class HumanityProtocolVerifier implements IVerifier {
	name = "humanity-protocol-is-human";
	issuerBaseUrl;

	async verify(address: string, data?: unknown): Promise<boolean> {
		// list credentials for address / did
		const credentials = await listCredentials(address);

		if (credentials.length === 0) {
			return false;
		}

		// verify credentials
		const isValid = credentials.every((credential) => {
			return verifyCredentials(credential);
		});

		return isValid;
	}
}
