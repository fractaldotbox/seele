import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSocialsFromEns } from "@repo/data-fetch/ens";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { AddItemInput } from "../../../components/AddItemInput";

interface Reviewer {
  ens: string;
  twitter: string | null;
}

export const ReviewersCard = () => {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const findTwitterHandle = async (ens: string): Promise<string | null> => {
    try {
      const socials = await getSocialsFromEns(ens);
      return socials.twitter;
    } catch (error) {
      console.error(`[findTwitterHandle] Error fetching ENS data:`, error);
      return null;
    }
  };

  const handleAddReviewer = async () => {
    if (reviewerName.trim()) {
      setIsLoading(true);
      try {
        const twitter = await findTwitterHandle(reviewerName.trim());
        setReviewers((prev) => [
          ...prev,
          {
            ens: reviewerName.trim(),
            twitter,
          },
        ]);
        setReviewerName("");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteReviewer = (index: number) => {
    setReviewers((prev) => prev.filter((_, i) => i !== index));
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
          disabled={isLoading}
          icon={
            isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined
          }
        />
        <div className="flex flex-col gap-2">
          {reviewers.map((reviewer, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="truncate">{reviewer.ens}</span>
                {reviewer.twitter ? (
                  <span className="text-green-500 text-sm truncate">
                    {reviewer.twitter}
                  </span>
                ) : (
                  <span className="text-red-500">✕</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2 hover:bg-destructive/20"
                onClick={() => handleDeleteReviewer(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
