"use client";

import { injected, useAccount, useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { baseSepolia } from "viem/chains";
import { useAttestation } from "../../hooks/use-attestation";
import type { Account } from "viem";
import { VotingForm } from "@/components/attestations/voting-form";
import { ComparisonFrame } from "@/components/comparison/comparison-frame";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const { signAttestation } = useAttestation({
    account: walletClient ? walletClient.account : ({ address } as Account),
    chain: baseSepolia,
    isOffchain: false,
    schemaId:
      "0xd8c63320a5a3d4ee26fe3d9534eada663e361b5dabb0917be97cd476106142d5",
    schemaString: "string voteFor",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // or a loading skeleton that matches server-side render
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
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
          signAttestation={async (data: string) => {
            if (!walletClient || !address) {
              console.error("No wallet client found");
              return;
            }

            console.log({ data });

            await signAttestation({
              recipient: address,
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
          }}
        />
      </main>
    </div>
  );
}
