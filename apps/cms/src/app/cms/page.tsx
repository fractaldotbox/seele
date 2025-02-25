"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const CMSPage = () => {
  const [mounted, setMounted] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewers, setReviewers] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddTopic = () => {
    if (topicName.trim()) {
      setTopics((prev) => [...prev, topicName.trim()]);
      setTopicName("");
    }
  };

  const handleAddReviewer = () => {
    if (reviewerName.trim()) {
      setReviewers((prev) => [...prev, reviewerName.trim()]);
      setReviewerName("");
    }
  };

  if (!mounted) {
    return null; // or a loading skeleton that matches server-side render
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <h1>Content Management System</h1>
        <div className="flex gap-3">
          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>Topics</CardTitle>
              <CardDescription>
                Range of topics that AI will create content about.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  placeholder="Enter topic name"
                  className="w-full"
                  onChange={(e) => setTopicName(e.target.value)}
                  value={topicName}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddTopic}
                  disabled={!topicName.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
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

          <Card className="w-[300px]">
            <CardHeader>
              <CardTitle>Reviewers</CardTitle>
              <CardDescription>
                People / Agentic Representatives based on ENS name.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  placeholder="Enter ENS name"
                  className="w-full"
                  onChange={(e) => setReviewerName(e.target.value)}
                  value={reviewerName}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddReviewer}
                  disabled={!reviewerName.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
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
        </div>
      </main>
    </div>
  );
};

export default CMSPage;
