export function getAddressFromPayload(payload: { voteFor: string }) {
	return payload.voteFor;
}
