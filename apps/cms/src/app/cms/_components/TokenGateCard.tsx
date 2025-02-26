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
import { Permissions } from "@repo/access-gate/lib/eas/constants";

interface TokenGate {
  contractAddress: string;
  chainId: number;
  minBalance: string;
}

interface Attestation {
  attesterAddress: string;
  chainId: number;
  scope: Permissions[];
}

interface TokenGateCardProps {
  existingTokenGates?: TokenGate[];
  existingAttestations?: Attestation[];
  onChange?: (tokenGates: TokenGate[]) => void;
  onAttestationChange?: (attestations: Attestation[]) => void;
  readOnly?: boolean;
}

export const TokenGateCard = ({
  existingTokenGates = [],
  existingAttestations = [],
  onChange,
  onAttestationChange,
  readOnly = false,
}: TokenGateCardProps) => {
  // Token gate states
  const [contractAddress, setContractAddress] = useState("");
  const [tokenGates, setTokenGates] = useState<TokenGate[]>(existingTokenGates);
  const [chainId, setChainId] = useState<number>(1); // Default to Ethereum Mainnet
  const [minBalance, setMinBalance] = useState<string>("1"); // Default minimum balance

  // Attestation states
  const [attesterAddress, setAttesterAddress] = useState("");
  const [attestations, setAttestations] =
    useState<Attestation[]>(existingAttestations);
  const [attestationChainId, setAttestationChainId] = useState<number>(1);
  const [selectedPermissions, setSelectedPermissions] = useState<Permissions[]>(
    [],
  );

  // Update parent component when token gates change
  const updateTokenGates = (newTokenGates: TokenGate[]) => {
    setTokenGates(newTokenGates);
    if (onChange) {
      onChange(newTokenGates);
    }
  };

  // Update parent component when attestations change
  const updateAttestations = (newAttestations: Attestation[]) => {
    setAttestations(newAttestations);
    if (onAttestationChange) {
      onAttestationChange(newAttestations);
    }
  };

  const handleAddTokenGate = () => {
    if (contractAddress.trim()) {
      const newTokenGate: TokenGate = {
        contractAddress: contractAddress.trim(),
        chainId,
        minBalance,
      };

      updateTokenGates([...tokenGates, newTokenGate]);
      setContractAddress("");
    }
  };

  const handleAddAttestation = () => {
    if (attesterAddress.trim() && selectedPermissions.length > 0) {
      const newAttestation: Attestation = {
        attesterAddress: attesterAddress.trim(),
        chainId: attestationChainId,
        scope: [...selectedPermissions],
      };

      updateAttestations([...attestations, newAttestation]);
      setAttesterAddress("");
      setSelectedPermissions([]);
    }
  };

  const handleDeleteTokenGate = (contractAddress: string) => {
    updateTokenGates(
      tokenGates.filter((gate) => gate.contractAddress !== contractAddress),
    );
  };

  const handleDeleteAttestation = (attesterAddress: string) => {
    updateAttestations(
      attestations.filter((att) => att.attesterAddress !== attesterAddress),
    );
  };

  const togglePermission = (permission: Permissions) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(
        selectedPermissions.filter((p) => p !== permission),
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Access Control</CardTitle>
        <CardDescription>
          {readOnly
            ? "Token contracts and attestations required for access."
            : "Add token contracts or attestations for access control."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Token Gates Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Token Gates</h3>
            {!readOnly && (
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
                    <option value={11155111}>Ethereum Sepolia</option>
                    <option value={84532}>Base Sepolia</option>
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
            )}
            <div className="flex flex-col gap-2">
              {tokenGates.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  No token gates configured
                </div>
              ) : (
                tokenGates.map((gate) => (
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
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2 hover:bg-destructive/20"
                        onClick={() =>
                          handleDeleteTokenGate(gate.contractAddress)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Attestations Section */}
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Attestations</h3>
            {!readOnly && (
              <div className="flex flex-col gap-2">
                <AddItemInput
                  placeholder="Enter attester member address"
                  value={attesterAddress}
                  onChange={setAttesterAddress}
                  onAdd={handleAddAttestation}
                />
                <div className="flex gap-2">
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={attestationChainId}
                    onChange={(e) =>
                      setAttestationChainId(Number(e.target.value))
                    }
                  >
                    <option value={11155111}>Ethereum Sepolia</option>
                    <option value={84532}>Base Sepolia</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Object.values(Permissions).map((permission) => (
                    <Button
                      key={permission}
                      type="button"
                      variant={
                        selectedPermissions.includes(permission)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => togglePermission(permission)}
                      className="text-xs"
                    >
                      {permission}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {attestations.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  No attestations configured
                </div>
              ) : (
                attestations.map((attestation) => (
                  <div
                    key={attestation.attesterAddress}
                    className="flex items-center justify-between p-2 bg-secondary rounded-md"
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="truncate text-sm font-medium">
                        {attestation.attesterAddress}
                      </span>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>Chain: {getChainName(attestation.chainId)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {attestation.scope.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                    {!readOnly && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2 hover:bg-destructive/20"
                        onClick={() =>
                          handleDeleteAttestation(attestation.attesterAddress)
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
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
    11155111: "Ethereum Sepolia",
    84532: "Base Sepolia",
  };

  return chains[chainId] || `Chain ${chainId}`;
}
