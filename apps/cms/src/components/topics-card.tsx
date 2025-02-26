import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { AddItemInput } from "./add-item-input";

export const TopicsCard = () => {
	const [topicName, setTopicName] = useState("");
	const [topics, setTopics] = useState<string[]>([]);

	const handleAddTopic = () => {
		if (topicName.trim()) {
			setTopics((prev) => [...prev, topicName.trim()]);
			setTopicName("");
		}
	};

	return (
		<Card className="w-[300px]">
			<CardHeader>
				<CardTitle>Topics</CardTitle>
				<CardDescription>
					Range of topics that AI will create content about.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<AddItemInput
					placeholder="Enter topic name"
					value={topicName}
					onChange={setTopicName}
					onAdd={handleAddTopic}
				/>
				<div className="flex flex-col gap-2">
					{topics.map((topic, index) => (
						<div
							key={index}
							className="flex items-center justify-between p-2 bg-secondary rounded-md"
						>
							<span>{topic}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
