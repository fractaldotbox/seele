"use client";

import { TokenGateCard } from "./_components/TokenGateCard";
import { getCMSWhitelistedAddresses } from "@seele/data-fetch/eas";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";

export default function ControlsPage() {
  const [mounted, setMounted] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (!address) return;
      const whitelistedAddresses = await getCMSWhitelistedAddresses(chainId);
      setIsAuthorized(whitelistedAddresses.includes(address));
    };

    checkAccess();
  }, [address, chainId]);

  if (!mounted) return null;

  if (!address) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">
          Please connect your wallet to access the controls
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="text-lg">
            You need to be authorized to access the controls.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 mt-20">
      <TokenGateCard />
    </div>
  );
}
