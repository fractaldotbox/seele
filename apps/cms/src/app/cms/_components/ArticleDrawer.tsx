"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

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
import { ReviewCard } from "./ReviewCard";
import { useEffect } from "react";
import { createEthstorageArticleUrl } from "../utils";
import { Badge } from "@/components/ui/badge";
import { ReviewTabs } from "./ReviewTabs";



export const DIRECTORY_ADDRESS_MANAGER = "0x649318865AF1A2aE6EE1C5dE9aD6cF6162e28E22";

export const DIRECTORY_ADDRESS_EDITOR = "0xF8C27D74473A2eE89c52fb594Aef8b239a0b7194";

// DIRECTORY_ADDRESS_TEMPLATE = '0xcf4dc300ab2ea01151945d5b06bd281da27dc943';



export const ArticleDrawer = ({ articleKey = "" }: { articleKey?: string }) => {
	const [goal, setGoal] = React.useState(350);
	const reviewers = ['vitalik-eth', 'cz'];
	const [currentReviewerIndex, setCurrentReviewerIndex] = React.useState(0);
	const [reviews, setReviews] = React.useState<string[]>([]);
	function onClick(adjustment: number) {
		setGoal(Math.max(200, Math.min(400, goal + adjustment)));
	}

	useEffect(() => {
		const factCheckUrl = createEthstorageArticleUrl(DIRECTORY_ADDRESS_EDITOR, `factcheck/${articleKey.replace('.md', '.json')}`);
		console.log('factCheckUrl', factCheckUrl);
		fetch(factCheckUrl)
			.then(async (res) => {
				const results = await res.json();
				console.log('results', results)
			})



		Promise.all(
			reviewers.map((reviewer) => {
				const reviewUrl = createEthstorageArticleUrl(DIRECTORY_ADDRESS_EDITOR, `review-${reviewer}/${articleKey}`);
				console.log('reviewUrl', reviewUrl);
				return fetch(reviewUrl)
					.then(async (res) => res.text())
				// .then(async (res) => {
				// 	const results = await res.text();
				// 	console.log('reviewUrl results', results)
				// })
			})
		)
			.then((results) => {
				console.log('results', results)

				setReviews(results);
			});
		// // Promise.all()
		// const reviewUrl = createEthstorageArticleUrl(DIRECTORY_ADDRESS_EDITOR, `review-${reviewer}/${articleKey}`);
		// console.log('reviewUrl', reviewUrl);
		// fetch(reviewUrl)
		// 	.then(async (res) => {
		// 		const results = await res.text();
		// 		console.log('reviewUrl results', results)
		// 	})
	}, [articleKey])


	return (
		<DrawerContent>
			<div className="mx-auto w-full max-w-[600px]">
				<DrawerHeader>
					<DrawerTitle>{articleKey}</DrawerTitle>
					<DrawerDescription>Reviews by AI review agents</DrawerDescription>
				</DrawerHeader>
				<div className="p-4 pb-0">
					<ReviewTabs reviewers={reviewers} reviews={reviews} />
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
