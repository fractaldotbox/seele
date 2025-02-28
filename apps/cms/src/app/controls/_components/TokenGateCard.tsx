import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Permissions } from "@seele/access-gate/lib/eas/constants";
import { getEasDataByChain } from "@seele/access-gate/lib/eas/utils";
import type { TokenGateCriteria as TokenGate } from "@seele/access-gate/lib/token-gate/types";
import { getCMSWhitelistedAddresses } from "@seele/data-fetch/eas/";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { AddItemInput } from "../../../components/AddItemInput";

interface Attestation {
  attesterAddress: string;
  chainId: number;
  scope: Permissions[];
}

interface TokenGateCardProps {
  existingTokenGates?: TokenGate[];
  existingAttestations?: Attestation[];
  existingWhitelist?: string[];
  requireHumanCredentials?: boolean;
  onChange?: (tokenGates: TokenGate[]) => void;
  onAttestationChange?: (attestations: Attestation[]) => void;
  onWhitelistChange?: (whitelist: string[]) => void;
  onHumanCredentialsChange?: (required: boolean) => void;
  readOnly?: boolean;
}

export const TokenGateCard = ({
  existingTokenGates = [],
  existingAttestations = [],
  existingWhitelist = [],
  requireHumanCredentials = false,
  onChange,
  onAttestationChange,
  onHumanCredentialsChange,
  readOnly = false,
}: TokenGateCardProps) => {
  // Token gate states
  const [contractAddress, setContractAddress] = useState("");
  const [tokenGates, setTokenGates] = useState<TokenGate[]>(existingTokenGates);
  const [chainId, setChainId] = useState<number>(1); // Default to Ethereum Mainnet
  const [minBalance, setMinBalance] = useState<string>("1"); // Default minimum balance
  const [tokenType, setTokenType] = useState<"ERC20" | "ERC721">("ERC20");

  // Attestation states
  const [attesterAddress, setAttesterAddress] = useState("");
  const [attestations, setAttestations] =
    useState<Attestation[]>(existingAttestations);
  const [attestationChainId, setAttestationChainId] = useState<number>(84532);
  const [selectedPermissions, setSelectedPermissions] = useState<Permissions[]>(
    [],
  );

  // Whitelist states
  const [whitelist, setWhitelist] = useState<string[]>(existingWhitelist);
  const [isWhitelistLoading, setIsWhitelistLoading] = useState<boolean>(false);

  // Add loading state
  const [isAddingTokenGate, setIsAddingTokenGate] = useState(false);

  const [isHumanRequired, setIsHumanRequired] = useState(
    requireHumanCredentials,
  );

  useEffect(() => {
    const fetchWhitelist = async () => {
      setIsWhitelistLoading(true);
      const whitelist = await getCMSWhitelistedAddresses(attestationChainId);
      setWhitelist(whitelist);
      setIsWhitelistLoading(false);
    };

    fetchWhitelist();
  }, [attestationChainId]);

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
        tokenType,
      };

      const addTokenGate = async () => {
        setIsAddingTokenGate(true);
        try {
          const response = await fetch("/api/token-gate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              criteria: [newTokenGate],
            }),
          });
          if (!response.ok) {
            throw new Error(`Failed to add token gate: ${response.statusText}`);
          }
          const data = await response.json();
          if (!data) {
            throw new Error("No data returned from server");
          }
          if (!data.success) {
            throw new Error(`Failed to add token gate: ${data.error}`);
          }

          // get all from token gate repository
          const tokenGateResponse = await fetch("/api/token-gate");
          if (!tokenGateResponse.ok) {
            throw new Error(
              `Failed to get token gates: ${tokenGateResponse.statusText}`,
            );
          }
          const tokenGateData = await tokenGateResponse.json();
          if (!tokenGateData) {
            throw new Error("No data returned from server");
          }
          if (!tokenGateData.criteria) {
            throw new Error("No criteria returned from server");
          }
          const newTokenGates = tokenGateData.criteria;

          updateTokenGates([...newTokenGates]);
          setContractAddress("");
        } catch (error) {
          console.error(`[addTokenGate] Error adding token gate:`, error);
        } finally {
          setIsAddingTokenGate(false);
        }
      };
      addTokenGate();

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

  const handleHumanCredentialsChange = (checked: boolean) => {
    setIsHumanRequired(checked);
    if (onHumanCredentialsChange) {
      onHumanCredentialsChange(checked);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 w-full">
      {/* Token Gates Card */}
      <Card>
        <CardHeader>
          <CardTitle>Token Gates</CardTitle>
          <CardDescription>
            Add token contracts to control access to the Arena.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!readOnly && (
            <div className="flex flex-col gap-2">
              <AddItemInput
                placeholder="Enter token contract address"
                value={contractAddress}
                onChange={setContractAddress}
                onAdd={handleAddTokenGate}
                disabled={isAddingTokenGate}
              />
              <div className="flex gap-2">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={tokenType}
                  onChange={(e) =>
                    setTokenType(e.target.value as "ERC20" | "ERC721")
                  }
                  disabled={isAddingTokenGate}
                >
                  <option value="ERC20">ERC20</option>
                  <option value="ERC721">ERC721</option>
                </select>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={chainId}
                  onChange={(e) => setChainId(Number(e.target.value))}
                  disabled={isAddingTokenGate}
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
                  disabled={isAddingTokenGate}
                />
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 mt-4">
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
                      {`${gate.contractAddress.slice(0, 6)}...${gate.contractAddress.slice(-4)}`}
                    </span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{gate.tokenType}</span>
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
        </CardContent>
      </Card>

      {/* Attestations Card */}
      <Card>
        <CardHeader>
          <CardTitle>EAS Attestations</CardTitle>
          <CardDescription>
            EAS attestations are used to control access to the Arena.
            Attestation Schema Id:{" "}
            <a
              href={`${getEasDataByChain("baseSepolia").baseUrl}/schema/view/${
                getEasDataByChain("baseSepolia").easAttestedByMemberSchema
              }`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500"
            >
              {`${getEasDataByChain("baseSepolia").easAttestedByMemberSchema.slice(0, 10)}...${getEasDataByChain("baseSepolia").easAttestedByMemberSchema.slice(-8)}`}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
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
          <div className="flex flex-col gap-2 mt-4">
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
        </CardContent>
      </Card>

      {/* Whitelist Card */}
      <Card>
        <CardHeader>
          <CardTitle>Whitelisted Admins</CardTitle>
          <CardDescription>
            Addresses that have been EAS-attested with admin permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {isWhitelistLoading ? (
              <div className="text-sm text-muted-foreground italic">
                Loading whitelisted admins...
              </div>
            ) : whitelist.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">
                No whitelisted admins
              </div>
            ) : (
              whitelist.map((address) => (
                <div
                  key={address}
                  className="flex items-center justify-between p-2 bg-secondary rounded-md"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate text-sm font-medium">
                      {`${address.slice(0, 6)}...${address.slice(-4)}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Human Credentials Card */}
      <Card>
        <CardHeader>
          <CardTitle>Human Verification</CardTitle>
          <CardDescription>
            Require Humanity Protocol™ human verification for access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="human-credentials"
              checked={isHumanRequired}
              onChange={(e) => handleHumanCredentialsChange(e.target.checked)}
              disabled={readOnly}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label
              htmlFor="human-credentials"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Require Human Credentials
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
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
