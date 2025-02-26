import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { X } from "lucide-react";
import { useState } from "react";
import { AddItemInput } from "../../../components/AddItemInput";

interface TokenGate {
  contractAddress: string;
  chainId: number;
  minBalance: string;
}

export const TokenGateCard = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenGates, setTokenGates] = useState<TokenGate[]>([]);
  const [chainId, setChainId] = useState<number>(1); // Default to Ethereum Mainnet
  const [minBalance, setMinBalance] = useState<string>("1"); // Default minimum balance

  const handleAddTokenGate = () => {
    if (contractAddress.trim()) {
      const newTokenGate: TokenGate = {
        contractAddress: contractAddress.trim(),
        chainId,
        minBalance,
      };

      setTokenGates((prev) => [...prev, newTokenGate]);
      setContractAddress("");
    }
  };

  const handleDeleteTokenGate = (contractAddress: string) => {
    setTokenGates((prev) =>
      prev.filter((gate) => gate.contractAddress !== contractAddress),
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Token Gates</CardTitle>
        <CardDescription>
          Add token contracts for access control.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <AddItemInput
            placeholder="Enter token contract address"
            value={contractAddress}
            onChange={setContractAddress}
            onAdd={handleAddTokenGate}
          />
          <div className="flex gap-2">
            <select
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              value={chainId}
              onChange={(e) => setChainId(Number(e.target.value))}
            >
              <option value={1}>Ethereum</option>
              <option value={137}>Polygon</option>
              <option value={10}>Optimism</option>
              <option value={42161}>Arbitrum</option>
              <option value={8453}>Base</option>
            </select>
            <input
              type="text"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Min balance"
              value={minBalance}
              onChange={(e) => setMinBalance(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {tokenGates.map((gate) => (
            <div
              key={gate.contractAddress}
              className="flex items-center justify-between p-2 bg-secondary rounded-md"
            >
              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate text-sm font-medium">
                  {gate.contractAddress}
                </span>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Chain: {getChainName(gate.chainId)}</span>
                  <span>Min: {gate.minBalance}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2 hover:bg-destructive/20"
                onClick={() => handleDeleteTokenGate(gate.contractAddress)}
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

// Helper function to get chain name from ID
function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: "Ethereum",
    137: "Polygon",
    10: "Optimism",
    42161: "Arbitrum",
    8453: "Base",
  };

  return chains[chainId] || `Chain ${chainId}`;
}
