"use client";

import { VotingForm } from "@/components/attestations/voting-form";
import { ComparisonFrame } from "@/components/comparison/comparison-frame";
import type { HumanityVerification } from "@/lib/types";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import type { Account, Address } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { useAttestation } from "../../hooks/use-attestation";

export default function Home() {
	const [mounted, setMounted] = useState(false);
	const [isTokenVerified, setIsTokenVerified] = useState(false);
	const [isHumanVerified, setIsHumanVerified] = useState(true); // Default to true in case humanity check is disabled
	const [isHumanityRequired, setIsHumanityRequired] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { address } = useAccount();
	const { ready: isReady } = usePrivy();
	const { data: walletClient } = useWalletClient();
	const [humanityVerification] = useLocalStorage<HumanityVerification>(
		"humanityVerification",
		{
			isHuman: false,
			address: "",
			proof: "",
		},
	);

	const { signAttestation } = useAttestation({
		account: walletClient ? walletClient.account : ({ address } as Account),
		chain: baseSepolia,
		isOffchain: false,
		schemaId:
			"0xd8c63320a5a3d4ee26fe3d9534eada663e361b5dabb0917be97cd476106142d5",
		schemaString: "string voteFor",
	});

	// Check if humanity verification is required
	useEffect(() => {
		const checkHumanityGate = async () => {
			try {
				const response = await fetch("/api/humanity-gate");
				const data = await response.json();
				setIsHumanityRequired(data.isEnabled);

				// If humanity check is not required, we can consider it verified
				if (!data.isEnabled) {
					setIsHumanVerified(true);
				}
			} catch (err) {
				console.error(
					"[checkHumanityGate] Failed to check humanity gate:",
					err,
				);
				setIsHumanityRequired(false);
				setIsHumanVerified(true);
			}
		};

		checkHumanityGate();
	}, []);

	// Combined verification effect
	useEffect(() => {
		const verifyAccess = async () => {
			if (!address) {
				setIsLoading(false);
				return;
			}

			try {
				// Token gate verification
				const tokenResponse = await fetch(`/api/token-gate/verify`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						address,
					}),
				});
				const tokenData = await tokenResponse.json();
				setIsTokenVerified(tokenData.verified);

				// Humanity verification if required
				if (isHumanityRequired) {
					const humanityResponse = await fetch(`/api/humanity-gate/verify`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							address,
							credential: JSON.parse(humanityVerification.proof),
						}),
					});
					const humanityData = await humanityResponse.json();
					setIsHumanVerified(humanityData.isValid);
				}
			} catch (err) {
				console.error("[verifyAccess] Failed to verify access:", err);
				setIsTokenVerified(false);
				if (isHumanityRequired) {
					setIsHumanVerified(false);
				}
			}
			setIsLoading(false);
		};

		verifyAccess();
	}, [address, isHumanityRequired, humanityVerification.proof]);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted || isLoading) {
		return null;
	}

	if (!isReady) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-xl">Connecting wallet...</p>
			</div>
		);
	}

	if (!address) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-xl">
					Please connect your wallet to access the Arena
				</p>
			</div>
		);
	}

	// Combined verification check
	if (!isTokenVerified || (isHumanityRequired && !isHumanVerified)) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
					<p className="text-lg">
						{!isTokenVerified
							? "You need to be part of the DAO to access the Arena."
							: "Human verification required to access the Arena."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
				<h1 className="text-2xl font-bold">Arena</h1>
				{/* comparison section */}
				<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
					<ComparisonFrame
						title="Agent A"
						caption="0x6E287E62C9399d31E8DB86D8842aCb72842990D7"
						contentUrl={
							"https://0x649318865AF1A2aE6EE1C5dE9aD6cF6162e28E22.3337.w3link.io/article1.md"
						}
					/>
					<ComparisonFrame
						title="Agent B"
						caption="0x6E287E62C9399d31E8DB86D8842aCb72842990D7"
						contentUrl={
							"https://0xE338F7ab3b45a6266312366F634820684fE17CB8.3337.w3link.io/article1.md"
						}
					/>
				</div>

				<VotingForm
					chainId={baseSepolia.id}
					isOffchain={false}
					isDisabled={!walletClient || !address}
					signAttestation={async (
						data: string,
					): Promise<{
						uids: Address[];
						txnReceipt: {
							transactionHash: `0x${string}`;
						};
					}> => {
						const result = await signAttestation({
							// THIS WILL BE AGENT ADDRESS
							recipient: data as Address,
							data: [
								{
									name: "voteFor",
									type: "string",
									value: data,
								},
							],
							time: BigInt(Date.now()),
							salt: "0x",
							revocable: false,
							value: BigInt(0),
						});

						return result as {
							uids: Address[];
							txnReceipt: {
								transactionHash: `0x${string}`;
							};
						};
					}}
				/>
			</main>
		</div>
	);
}
