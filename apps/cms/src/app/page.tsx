"use client";

import { useEffect, useState } from "react";
import { ComparisonFrame } from "@/components/comparison/comparison-frame";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Seele Protocol
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Giving DAOs a soul through AI-powered content generation and
            representation
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-12">
          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">AI Voice</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Autonomous content generation aligned with DAO values and
                objectives
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">DAO Representation</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Authentic digital presence reflecting the collective identity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-xl font-semibold">Web3 Integration</h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Seamless blockchain integration for transparent governance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Button size="lg">Start Empowering Your DAO</Button>
        </div>
      </main>
    </div>
  );
}
