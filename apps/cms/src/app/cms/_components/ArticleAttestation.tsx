import { Label } from "@radix-ui/react-label";
import { useMemo } from "react";
import type { Address, Hex } from "viem";
import { mainnet } from "viem/chains";
import { useChainId } from "wagmi";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AttestationSchemaBadge } from "./AttestationSchemaBadge";
import { useGetAttestationWithUid } from "../hooks/eas/use-get-attestation-with-uid";
// import { getShortHex } from "#lib/utils/hex";
// import { AttestationSchemaBadge } from "./attestation-schema-badge";
// import { type AttestationMeta, asAttestationMeta } from "./attestations";


export type AttestationMeta = {
    id: string;
    schemaId: string;
    schemaIndex: string;
    schemaName: string;
    from: Address;
    to: Address;
    time: number;
    isOffchain: boolean;
    ageDisplayed: string;
    txid: string;
};


const AttestationCardContent = ({
    chainId,
    attestation,
}: { chainId: number; attestation: AttestationMeta }) => {
    const { from, to, schemaId, schemaName, schemaIndex } = attestation;
    if (!attestation) {
        return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
    }
    return (
        <CardContent>
            <div className="flex w-full items-center gap-2">
                <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-xs text-muted-foreground">Schema</div>
                    <div className="flex items-center gap-1 text-2xl font-bold tabular-nums leading-none">
                        <AttestationSchemaBadge
                            chainId={chainId}
                            schemaId={schemaId}
                            schemaIndex={schemaIndex}
                        />
                        <div className="flex flex-col">
                            <div className="text-sm font-normal text-muted-foreground">
                                <span className="text-sm font-normal">{schemaName}</span>
                            </div>
                            <span className="text-sm font-normal text-muted-foreground">
                                {/* {getShortHex(schemaId as Hex)} */}
                            </span>
                        </div>
                    </div>
                </div>
                <Separator orientation="vertical" className="mx-2 h-10 w-px" />
                <div className="grid flex-1 auto-rows-min gap-0.5">
                    <div className="text-xs text-muted-foreground">From</div>
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        <span className="text-sm font-normal">{from}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">To</div>
                    <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                        <span className="text-sm font-normal">{to}</span>
                    </div>
                </div>
            </div>

        </CardContent>
    );
};

export const AttestationCardWithMeta = ({
    isOffchain,
    chainId,
    attestation,
}: {
    isOffchain: boolean;
    chainId: number;
    attestation: AttestationMeta | null;
}) => {
    const title = `${isOffchain ? "Offchain " : "Onchain"} Attestation`;

    return (
        <Card>
            {attestation ? (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        <div className="flex flex-col">
                            <div className="flex items-baseline ">
                                <span className="text-xs font-normal">UID:</span>
                            </div>

                            <div className="text-xs text-muted-foreground">
                                {attestation.id}
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-xs font-normal">TIMESTAMPS:</span>
                        </div>
                        {/* <div className="text-xs text-muted-foreground">
                            Created:{" "}
                            {format(new Date(attestation.time * 1000), "yyyy/MM/dd HH:MM:ss")}
                        </div> */}
                    </CardDescription>
                </CardHeader>
            ) : (
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
            )}
            <CardContent>
                {attestation && (
                    <AttestationCardContent chainId={chainId} attestation={attestation} />
                )}
            </CardContent>
            {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
            <CardFooter></CardFooter>
        </Card>
    );
};


export const asAttestationMeta = (attestation: any) => {
    const {
        id,
        attester,
        recipient,
        schemaId,
        schema,
        txid,
        isOffchain,
        time: _time,
    } = attestation;
    const schemaName = schema?.schemaNames?.[0]?.name;
    const time = _time || new Date().getTime();
    // TODO component take control of format/locales
    // const ageDisplayed = formatDistance(new Date(time * 1000), new Date());
    return {
        id,
        schemaId,
        schemaIndex: schema?.index,
        schemaName,
        from: attester as Address,
        to: recipient as Address,
        isOffchain,
        txid,
        time,
        ageDisplayed: '',
    };
};


// some key fields from https://easscan.org/offchain/attestation/view/0x49dff46654fe740241026c1a717ace9ec439abe26124cd925b0ba1df296433c5
export const AttestationCard = ({
    isOffchain,
    chainId,
    attestationUid,
}: {
    isOffchain: boolean;
    chainId: number;
    attestationUid: string;
}) => {
    const { data, isSuccess } = useGetAttestationWithUid({
        chainId,
        uid: attestationUid,
    });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const attestation = useMemo(() => {
        if (!data) {
            return null;
        }
        return asAttestationMeta(data?.data?.attestation);
    }, [isSuccess]);

    return (
        <AttestationCardWithMeta
            isOffchain={isOffchain}
            chainId={chainId}
            attestation={attestation}
        />
    );
};
