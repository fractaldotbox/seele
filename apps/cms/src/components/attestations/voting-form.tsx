import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/hooks/use-toast";
import { getEasscanAttestationUrl } from "@/lib/eas/easscan";
import { getShortHex } from "@/lib/utils/hex";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TODO dynamic enough to generate fields
// now focus on sdk part

export interface VotingFormParams {
  chainId: number;
  isOffchain: boolean;
  signAttestation: (data: string) => Promise<any>;
}

// TODO dynamic schema. For now, hardcode the MetIRL
// https://github.com/fractaldotbox/geist-dapp-kit/issues/56
export const VotingForm = ({
  chainId,
  isOffchain,
  signAttestation,
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
    signAttestation(values.voteFor).then(({ uids, txnReceipt }: any) => {
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
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Vote for your ideal version</FormDescription>
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
