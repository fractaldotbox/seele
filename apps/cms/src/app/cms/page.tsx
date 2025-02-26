"use client";

import { ReviewersCard } from "@/app/cms/_components/ReviewersCard";
import { TokenGateCard } from "@/app/cms/_components/TokenGateCard";
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
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <h1 className="text-2xl font-bold">Content Management System</h1>
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6 w-full">
          <div className="md:col-span-2 lg:col-span-2 lg:row-span-2">
            <TokenGateCard />
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <TopicsCard />
          </div>
          <div className="lg:row-span-2">
            <ReviewersCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CMSPage;
