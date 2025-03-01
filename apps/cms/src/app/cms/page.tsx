"use client";

import { ReviewersCard } from "@/app/cms/_components/ReviewersCard";
import { TokenGateCard } from "@/app/controls/_components/TokenGateCard";
import { TopicsCard } from "@/app/cms/_components/TopicsCard";
import { getCMSWhitelistedAddresses } from "@seele/data-fetch/eas";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";

const CMSPage = () => {
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
        <p className="text-xl">Please connect your wallet to access the CMS</p>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
          <p className="text-lg">
            You need to be authorized to access the CMS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <h1 className="text-2xl font-bold">Content Management System</h1>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full">
          <div className="md:col-span-2 lg:col-span-1">
            <TopicsCard />
          </div>
          <div className="lg:row-span-2">
            <ReviewersCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CMSPage;
