import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AddItemInput } from "./add-item-input";

export const ReviewersCard = () => {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewers, setReviewers] = useState<string[]>([]);

  const handleAddReviewer = () => {
    if (reviewerName.trim()) {
      setReviewers((prev) => [...prev, reviewerName.trim()]);
      setReviewerName("");
    }
  };

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle>Reviewers</CardTitle>
        <CardDescription>
          People / Agentic Representatives based on ENS name.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <AddItemInput
          placeholder="Enter ENS name"
          value={reviewerName}
          onChange={setReviewerName}
          onAdd={handleAddReviewer}
        />
        <div className="flex flex-col gap-2">
          {reviewers.map((reviewer, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <span>{reviewer}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
