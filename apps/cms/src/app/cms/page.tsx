"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const CMSPage = () => {
  const [mounted, setMounted] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topics, setTopics] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddTopic = () => {
    if (topicName.trim()) {
      setTopics((prev) => [...prev, topicName.trim()]);
      setTopicName("");
    }
  };

  if (!mounted) {
    return null; // or a loading skeleton that matches server-side render
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <h1>Content Management System</h1>
        <div className="flex flex-col gap-4 mt-8 w-[300px]">
          <div>
            <h2 className="text-2xl font-semibold">
              What do you want your topics to be?
            </h2>
            <p className="text-muted-foreground mt-2">
              Create topics that your AI will generate content about. These
              topics will help guide the AI in creating relevant and focused
              content.
            </p>
          </div>
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
        </div>
        <div className="flex flex-col gap-2 w-[300px]">
          {topics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CMSPage;
