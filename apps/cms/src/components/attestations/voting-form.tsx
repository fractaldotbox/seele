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
import {
  getEasscanAddressUrl,
  getEasscanAttestationUrl,
} from "@/lib/eas/easscan";
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
        console.log("uids", uids);

        const [uid] = uids;
        const url = getEasscanAttestationUrl(chainId, uid, isOffchain);

        toast({
          title: "Voting success",
          description: `attested ${txnReceipt?.transactionHash}`,
          action: (
            <ToastAction altText="View on EASSCAN">
              <a
                target={`_blank`}
                href={url}
                rel="noreferrer"
                className="text-blue-500 cursor-pointer hover:underline"
              >
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
                          field.onChange(
                            // TODO: change address to agent address
                            "0x30B00979c33F826BCF7e182545A3353aD97e1C42",
                          );
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
                          field.onChange(
                            // TODO: change address to agent address
                            "0xAaB311758eD38909734a14a4c19ae4BE3b700E61",
                          );
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
