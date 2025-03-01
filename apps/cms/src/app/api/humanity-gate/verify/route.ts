import type { sampleCredential } from "@seele/access-gate/lib/humanity/fixtures";
import { HumanityProtocolVerifier } from "@seele/access-gate/verifiers/humanity";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		// Parse request body
		const body = await request.json();

		// Validate request body

		const { address, credential } = body;

		// Initialize verifier
		const verifier = new HumanityProtocolVerifier();

		// we assert some stuff here
		credential.credentialSubject.id = `did:ethr:${address.toLowerCase()}`;
		credential.issuer = `did:key:zUC72jLAC7CFjxk9FDM4fBwx5fYDdesDSn3dT8i38ZEcq6iGdBRGFcBUGczVjbHQbEHvY9rhSBpAuvjjqrze9o7cxtpbJ7Vbi4eDdjyGFMCaexgpeRABVX1uDUoxrkeQjN14k2C`;
		credential.credentialSubject.isHuman = true;

		// Verify the credential
		const isValid = await verifier.verify(address.toLowerCase(), {
			credential: credential as unknown as typeof sampleCredential,
		});

		return NextResponse.json({ isValid });
	} catch (error) {
		console.error("[POST /api/humanity-gate/verify] Error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
