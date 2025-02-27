import { TokenGateRepository } from "@/lib/repository/token-gate.repository";
import type { TokenGateCriteria } from "@seele/access-gate/lib/token-gate/types";
import { NextResponse } from "next/server";

interface TokenGatePostRequestDto {
	criteria: TokenGateCriteria[];
}

interface TokenGateDeleteRequestDto {
	contractAddress: string;
}

export async function GET() {
	const tokenGateRepository = await TokenGateRepository.create();
	const criteria = await tokenGateRepository.getAll();
	return NextResponse.json({ criteria });
}

export async function POST(request: Request) {
	const tokenGateRepository = await TokenGateRepository.create();

	const body: TokenGatePostRequestDto = await request.json();
	const { criteria } = body;

	const success = await tokenGateRepository.add(criteria);

	return NextResponse.json({ success });
}

export async function DELETE(request: Request) {
	const tokenGateRepository = await TokenGateRepository.create();

	const body: TokenGateDeleteRequestDto = await request.json();
	const { contractAddress } = body;

	const success = await tokenGateRepository.delete(contractAddress);

	return NextResponse.json({ success });
}
