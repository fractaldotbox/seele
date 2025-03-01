export const verifyHumanity = async (address: string, proof: unknown) => {
	const response = await fetch("/api/humanity-gate/verify", {
		method: "POST",
		body: JSON.stringify({ address, credential: proof }),
		headers: {
			"Content-Type": "application/json",
		},
	});
	const data = await response.json();
	return data.isValid;
};
