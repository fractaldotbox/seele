"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect } from "react";
import { createEthstorageArticleUrl } from "../utils";
import { ReviewCard } from "./ReviewCard";
import { ReviewTabs } from "./ReviewTabs";

export const DIRECTORY_ADDRESS_MANAGER =
	"0x649318865AF1A2aE6EE1C5dE9aD6cF6162e28E22";

export const DIRECTORY_ADDRESS_EDITOR =
	"0xF8C27D74473A2eE89c52fb594Aef8b239a0b7194";

// DIRECTORY_ADDRESS_TEMPLATE = '0xcf4dc300ab2ea01151945d5b06bd281da27dc943';

export const ArticleDrawer = ({
	articleKey = "",
	isReview,
}: { articleKey?: string; isReview: boolean }) => {
	const reviewers = ["vitalik-eth", "cz"];
	const [currentReviewerIndex, setCurrentReviewerIndex] = React.useState(0);
	const [reviews, setReviews] = React.useState<string[]>([]);
	const [factcheckResult, setFactcheckResult] = React.useState<any>({});

	const reviewUrls = React.useMemo(() => {
		return reviewers.map((reviewer) =>
			createEthstorageArticleUrl(
				DIRECTORY_ADDRESS_EDITOR,
				`review-${reviewer}/${articleKey}`,
			),
		);
	}, [articleKey]);

	const factCheckUrl = React.useMemo(() => {
		return createEthstorageArticleUrl(
			DIRECTORY_ADDRESS_EDITOR,
			`factcheck/${articleKey.replace(".md", ".json")}`,
		);
	}, [articleKey]);

	useEffect(() => {
		console.log("factCheckUrl", factCheckUrl);
		fetch(factCheckUrl).then(async (res) => {
			const results = await res.json();
			console.log("factcheck results", results);
			setFactcheckResult(results);
		});

		Promise.all(
			reviewUrls.map((reviewUrl: string) => {
				console.log("reviewUrl", reviewUrl);
				return fetch(reviewUrl).then(async (res) => res.text());
			}),
		).then((results) => {
			console.log("results", results);

			setReviews(results);
		});
	}, [articleKey, reviewUrls, factCheckUrl]);

	return (
		<DrawerContent>
			<div className="mx-auto w-full max-w-[600px]">
				<DrawerHeader>
					<DrawerTitle>{articleKey}</DrawerTitle>
					<DrawerDescription>
						{isReview
							? "Reviews by AI review agents"
							: "Fact Check by AI agent base on Polymarket and trusted domains"}
					</DrawerDescription>
				</DrawerHeader>
				<div className="p-4 pb-0">
					{isReview ? (
						<ReviewTabs
							reviewers={reviewers}
							reviews={reviews}
							reviewUrls={reviewUrls}
						/>
					) : (
						<div>
							<div>Claim: {factcheckResult.claim}</div>
							<div>{factcheckResult.is_true ? "✅True" : "False"}</div>
							<div>Confidence Level: {factcheckResult.confidence_level}</div>
							<div>Citations: {factcheckResult.citations}</div>
							<div>Explanation: {factcheckResult.explanation}</div>
							<div>
								<a
									className="underline"
									href={factCheckUrl}
									target="_blank"
									rel="noreferrer"
								>
									on-chain record
								</a>
							</div>
						</div>
					)}

					{/* <Badge>{currentReviewer}</Badge>
					<div className="flex p-0 items-center justify-center space-x-2 overflow-y-hidden">
						<ReviewCard reviewer="" comment={reviews[0]} />
					</div> */}
					{/* <div className="mt-3 h-[120px]">test</div> */}
				</div>
				<DrawerFooter>
					{/* <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose> */}
				</DrawerFooter>
			</div>
		</DrawerContent>
	);
};
