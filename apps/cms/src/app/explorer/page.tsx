"use client";

import { ReviewersCard } from "@/app/cms/_components/ReviewersCard";
import { getCMSWhitelistedAddresses } from "@seele/data-fetch/eas";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";

const ExplorerPage = () => {
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

    return (
        <div className="grid grid-rows-[20px_1fr_20px] min-h-screen pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
                <h1 className="text-2xl font-bold">Proof of Site</h1>
                <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full">
                    <div className="lg:row-span-2">
                        <ReviewersCard />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExplorerPage;
