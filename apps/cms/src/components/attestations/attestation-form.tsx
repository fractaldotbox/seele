import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Address } from "viem";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { getEasscanAttestationUrl } from "@/lib/eas/easscan";
import { getShortHex } from "@/lib/utils/hex";
import { AttestationSchemaBadge } from "@/components/attestations/attestation-schema-badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TODO dynamic enough to generate fields
// now focus on sdk part

export interface AttestationFormParams {
  chainId: number;
  schemaId: string;
  schemaIndex?: string;
  isOffchain: boolean;
  signAttestation: (data: string) => Promise<any>;
}

// TODO dynamic schema. For now, hardcode the MetIRL
// https://github.com/fractaldotbox/geist-dapp-kit/issues/56
export const AttestationForm = ({
  chainId,
  schemaId,
  schemaIndex,
  isOffchain,
  signAttestation,
}: AttestationFormParams) => {
  const formSchema = z.object({
    voteFor: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voteFor: "openai_gpt4",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    signAttestation(values.voteFor).then(({ uids, txnReceipt }: any) => {
      const [uid] = uids;
      const url = getEasscanAttestationUrl(chainId, uid, isOffchain);

      const description = isOffchain
        ? getShortHex(uid)
        : `attested ${txnReceipt?.transactionHash}`;

      toast({
        title: "Attestation success",
        description,
        action: (
          <ToastAction altText="View on EASSCAN">
            <a target="_blank" href={url}>
              View on EASSCAN
            </a>
          </ToastAction>
        ),
      });
    });
  }

  return (
    <Card className="pt-8">
      <CardContent>
        <Form {...form}>
          {/* HARDCODED */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="voteFor"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2 pt-4">
                    <AttestationSchemaBadge
                      chainId={chainId}
                      schemaId={schemaId}
                      schemaIndex={schemaIndex || ""}
                    />
                    Vote
                  </div>
                  <FormLabel>Cast Your Vote</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai_gpt4">GPT-4</SelectItem>
                        <SelectItem value="anthropic_claude3">
                          Claude 3
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Vote for your favourite AI model
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
