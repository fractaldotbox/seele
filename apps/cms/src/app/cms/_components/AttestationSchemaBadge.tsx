import { Badge } from "@/components/ui/badge";
import { getEasscanSchemaUrl } from "./easscan";

export const AttestationSchemaBadge = ({
    chainId,
    schemaId,
    schemaIndex,
}: { chainId: number; schemaId: string; schemaIndex: string }) => {
    return (
        <a href={getEasscanSchemaUrl(chainId, schemaId)} target="_blank">
            <Badge>#{schemaIndex}</Badge>
        </a>
    );
};
