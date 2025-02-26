"use client";

import { ReviewersCard } from "@/app/cms/_components/ReviewersCard";
import { TopicsCard } from "@/app/cms/_components/TopicsCard";
import { useEffect, useState } from "react";

const CMSPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <h1>Content Management System</h1>
        <div className="flex gap-3">
          <TopicsCard />
          <ReviewersCard />
        </div>
      </main>
    </div>
  );
};

export default CMSPage;
