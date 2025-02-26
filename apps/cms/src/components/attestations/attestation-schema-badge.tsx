import { Badge } from "@/components/ui/badge";
import { getEasscanSchemaUrl } from "@/lib/eas/easscan";

export const AttestationSchemaBadge = ({
	chainId,
	schemaId,
	schemaIndex,
}: {
	chainId: number;
	schemaId: string;
	schemaIndex: string;
}) => {
	return (
		<a
			href={getEasscanSchemaUrl(chainId, schemaId)}
			target="_blank"
			rel="noreferrer"
		>
			<Badge>#{schemaIndex}</Badge>
		</a>
	);
};
