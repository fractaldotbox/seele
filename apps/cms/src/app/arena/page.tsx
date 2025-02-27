"use client";

import { VotingForm } from "@/components/attestations/voting-form";
import { ComparisonFrame } from "@/components/comparison/comparison-frame";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import type { Account, Address } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount, useWalletClient } from "wagmi";
import { useAttestation } from "../../hooks/use-attestation";

export default function Home() {
	const [mounted, setMounted] = useState(false);
	const [isVerified, setIsVerified] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const { address } = useAccount();
	const { ready: isReady } = usePrivy();
	const { data: walletClient } = useWalletClient();

	const { signAttestation } = useAttestation({
		account: walletClient ? walletClient.account : ({ address } as Account),
		chain: baseSepolia,
		isOffchain: false,
		schemaId:
			"0xd8c63320a5a3d4ee26fe3d9534eada663e361b5dabb0917be97cd476106142d5",
		schemaString: "string voteFor",
	});

	// Token gate verification
	useEffect(() => {
		const verifyAccess = async () => {
			if (!address) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch(`/api/token-gate/verify`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						address,
					}),
				});
				const data = await response.json();
				setIsVerified(data.verified);
			} catch (err) {
				console.error("[verifyAccess] Failed to verify token access:", err);
				setIsVerified(false);
			}
			setIsLoading(false);
		};

		verifyAccess();
	}, [address]);

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

	if (!isVerified) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center space-y-4">
					<h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
					<p className="text-lg">
						You need to be part of the DAO to access the Arena.
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
						title="Version A"
						caption="More chill version"
						content={`
            # Base Website
            Base is a low-cost, developer-friendly home for Ethereum apps.
            `}
					/>
					<ComparisonFrame
						title="Version B"
						caption="More serious version"
						content={`
            # Ethereum Website
            Ethereum is a global, open-source platform for decentralized applications.
            `}
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
							recipient: address as Address,
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
