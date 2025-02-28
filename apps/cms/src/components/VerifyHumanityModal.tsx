import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface VerifyHumanityModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VerifyHumanityModal = ({
  isOpen,
  onOpenChange,
}: VerifyHumanityModalProps) => {
  const [proof, setProof] = useState("");

  const handleProofSubmit = async () => {
    try {
      // TODO: Implement proof verification logic
      console.log("Submitting proof:", proof);
    } catch (error) {
      console.error("Error verifying proof:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Humanity</DialogTitle>
          <p className="text-sm text-gray-500">
            Humanity verification powered by{" "}
            <Link
              href="https://www.humanity.org/"
              target="_blank"
              className="text-blue-500"
            >
              Humanity Protocol{" "}
            </Link>
          </p>
        </DialogHeader>

        <Tabs defaultValue="tab1" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tab1">QR Verification</TabsTrigger>
            <TabsTrigger value="tab2">Copy-paste Verification</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <div className="space-y-4 py-4">Coming Soon!</div>
          </TabsContent>
          <TabsContent value="tab2">
            <div className="space-y-4 py-4">
              <Textarea
                placeholder="Paste your issued credential here..."
                value={proof}
                onChange={(e) => setProof(e.target.value)}
                className="min-h-[100px] font-mono"
              />
              <Button
                className="w-full"
                onClick={handleProofSubmit}
                disabled={!proof.trim()}
              >
                Verify Proof
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
