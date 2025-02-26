import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { getEasscanAttestationUrl } from "@/lib/eas/easscan";
import { getShortHex } from "@/lib/utils/hex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { z } from "zod";

// TODO dynamic enough to generate fields
// now focus on sdk part

export interface VotingFormParams {
	chainId: number;
	isOffchain: boolean;
	signAttestation: (data: string) => Promise<{
		uids: Address[];
		txnReceipt: { transactionHash: `0x${string}` };
	}>;
	isDisabled?: boolean;
}

// TODO dynamic schema. For now, hardcode the MetIRL
// https://github.com/fractaldotbox/geist-dapp-kit/issues/56
export const VotingForm = ({
	chainId,
	isOffchain,
	signAttestation,
	isDisabled,
}: VotingFormParams) => {
	const formSchema = z.object({
		voteFor: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			voteFor: "left",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		signAttestation(values.voteFor).then(
			({
				uids,
				txnReceipt,
			}: {
				uids: Address[];
				txnReceipt: { transactionHash: `0x${string}` };
			}) => {
				const [uid] = uids;
				const url = getEasscanAttestationUrl(chainId, uid, isOffchain);

				const description = isOffchain
					? getShortHex(uid)
					: `attested ${txnReceipt?.transactionHash}`;

				toast({
					title: "Voting success",
					description,
					action: (
						<ToastAction altText="View on EASSCAN">
							<a target="_blank" href={url} rel="noreferrer">
								View on EASSCAN
							</a>
						</ToastAction>
					),
				});
			},
		);
	}

	return (
		<Card className="pt-8 w-full">
			<CardContent>
				<Form {...form}>
					{/* HARDCODED */}
					<form className="space-y-8">
						<FormField
							control={form.control}
							name="voteFor"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Cast Your Vote</FormLabel>
									<FormControl>
										<div className="flex gap-4 w-full">
											<Button
												type="button"
												onClick={() => {
													field.onChange("left");
													form.handleSubmit(onSubmit)();
												}}
												className="flex-1"
												disabled={isDisabled}
											>
												Version A ⬅️
											</Button>
											<Button
												type="button"
												onClick={() => {
													field.onChange("right");
													form.handleSubmit(onSubmit)();
												}}
												className="flex-1"
												disabled={isDisabled}
											>
												Version B ➡️
											</Button>
										</div>
									</FormControl>
									<FormDescription>Vote for your ideal version</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
