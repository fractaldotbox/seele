"use client";

import { ReviewersCard } from "@/app/cms/_components/ReviewersCard";
import { getCMSWhitelistedAddresses } from "@seele/data-fetch/eas";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";
import { ArticleList } from "../cms/_components/ArticleList";
import { createEthstorageArticleUrl } from "../cms/utils";

const directoryAddressManager = "0x649318865AF1A2aE6EE1C5dE9aD6cF6162e28E22";
const directoryAddressAuthor = "0x30B00979c33F826BCF7e182545A3353aD97e1C42";

const articleMetas = [1, 2, 3, 4, 5].map((key) => ({
	key: `article${key}.md`,
	status: "approved",
}));

const articles = articleMetas.map((article) => ({
	...article,

	status: "approved",
	author: "0x30B00979c33F826BCF7e182545A3353aD97e1C42",
}));

const ExplorerPage = () => {
	const [mounted, setMounted] = useState(false);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const { address } = useAccount();
	const chainId = useChainId();

	const ensName = "thisweekin.eth";

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

	return (
		<div className="grid grid-rows-[20px_1fr_20px] min-h-screen pb-20 gap-16 sm:p-2">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
				<h1 className="text-2xl font-bold">Proof of Site</h1>
				<div className="grid grid-cols-1  gap-6 w-full">
					<div className="lg:row-span-2">
						<div>
							<div>w3link.io: https://thisweekin.eth.1.w3link.io/</div>
							ENS:{" "}
							<a
								href={`https://app.ens.domains/${ensName}?tab=records`}
								target="_blank"
								rel="noreferrer"
							>
								<span>{ensName}</span>
							</a>
							<ArticleList
								articles={articles}
								directoryAddress={directoryAddressManager}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ExplorerPage;
