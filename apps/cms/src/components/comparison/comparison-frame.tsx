import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface ComparisonFrameProps {
  contentUrl: string;
  title: string;
  caption: string;
}

export function ComparisonFrame({
  contentUrl,
  title,
  caption,
}: ComparisonFrameProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: content,
    isLoading,
    error,
  } = useQuery<string, Error>({
    queryKey: ["fetchContent-A"],
    queryFn: async () => {
      const response = await fetch(contentUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    },
  });

  useEffect(() => {
    if (!content) return;

    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30); // Adjust typing speed here (in milliseconds)

      return () => clearTimeout(timeout);
    }
  }, [content, currentIndex]);

  if (isLoading) return <div className="spinner">Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col gap-4 max-2xl:w-full border rounded-lg p-6 bg-card/80">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground text-center">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground text-center">{caption}</p>
      </div>
      <article className="prose dark:prose-invert whitespace-pre-wrap">
        {displayedContent}
        <span className="animate-pulse">▋</span>
      </article>
    </div>
  );
}
