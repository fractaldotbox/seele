import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { verifyHumanity } from "@/lib/humanity";
import type { HumanityVerification } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useAccount } from "wagmi";

interface VerifyHumanityModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

// Add interface for the storage type
export const VerifyHumanityModal = ({
	isOpen,
	onOpenChange,
}: VerifyHumanityModalProps) => {
	const [proof, setProof] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { address } = useAccount();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_humanityVerification, setHumanityVerification] =
		useLocalStorage<HumanityVerification>("humanityVerification", {
			isHuman: false,
			address: "",
			proof: "",
		});

	const handleProofSubmit = async () => {
		try {
			setIsVerifying(true);
			setError(null);

			let credential: unknown;
			try {
				credential = JSON.parse(proof);
			} catch (error: unknown) {
				console.error("Error parsing proof:", error);
				setError("Invalid JSON format");
				return;
			}

			console.log({ credentialFromModal: credential });

			const isValid = await verifyHumanity(address as string, credential);

			console.log({ isValid });

			if (isValid) {
				// Save verification state to localStorage
				setHumanityVerification({
					isHuman: true,
					address: address as string,
					proof: JSON.stringify(credential),
				});
				onOpenChange(false);
			} else {
				setError("Invalid proof");
			}
		} catch (error) {
			setError(error instanceof Error ? error.message : "Verification failed");
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px] transition-all duration-300 ease-in-out dialog-content">
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
					<div className="relative">
						<TabsContent
							value="tab1"
							className="space-y-4 py-4 transition-all duration-300 ease-in-out"
						>
							<div>Coming Soon!</div>
						</TabsContent>
						<TabsContent
							value="tab2"
							className="space-y-4 py-4 transition-all duration-300 ease-in-out"
						>
							<div className="space-y-4">
								<Textarea
									placeholder="Paste your proof here..."
									value={proof}
									onChange={(e) => setProof(e.target.value)}
									className="min-h-[100px] font-mono"
								/>
								{error && <p className="text-sm text-red-500">{error}</p>}
								<Button
									className="w-full"
									onClick={handleProofSubmit}
									disabled={!proof.trim() || isVerifying}
								>
									{isVerifying ? "Verifying..." : "Verify Proof"}
								</Button>
							</div>
						</TabsContent>
					</div>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
};
