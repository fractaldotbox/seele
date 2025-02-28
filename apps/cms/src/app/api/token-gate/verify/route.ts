import { TokenGateRepository } from "@/lib/repository/token-gate.repository";
import { TokenGateVerifier } from "@seele/access-gate/verifiers/token-gate";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Missing address parameter" },
        { status: 400 },
      );
    }

    const tokenGateRepository = await TokenGateRepository.create();
    const tokenGates = await tokenGateRepository.getAll();

    console.log("tokenGates", tokenGates);

    const verifier = new TokenGateVerifier();
    const result = await verifier.verify(address, tokenGates);

    return NextResponse.json({ verified: result });
  } catch (err) {
    console.error(`[POST] Error verifying token gate: ${err}`);
    return NextResponse.json(
      { error: "Failed to verify token gate" },
      { status: 500 },
    );
  }
}
