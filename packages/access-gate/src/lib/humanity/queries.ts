import dotenv from "dotenv";
dotenv.config();

const HUMANITY_API_KEY = process.env.HUMANITY_API_KEY as string;

export const issueCredentials = async (
	address: string,
	claims: Record<string, unknown>,
) => {
	const response = await fetch(
		"https://issuer.humanity.org/credentials/issue",
		{
			method: "POST",
			headers: {
				"X-API-Token": HUMANITY_API_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				subject_address: address,
				claims,
			}),
		},
	);

	const data = await response.json();

	return data;
};

export const verifyCredentials = async (credential: object) => {
	const response = await fetch(
		"https://issuer.humanity.org/credentials/verify",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-API-Token": HUMANITY_API_KEY,
			},
			body: JSON.stringify({
				credential,
			}),
		},
	);

	const data = await response.text();

	return data;
};

export const listCredentials = async (address: string) => {
	const response = await fetch(
		`https://issuer.humanity.org/credentials/list?holderDid=did:ethr:${address}`,
		{
			method: "GET",
			headers: {
				"X-API-Token": HUMANITY_API_KEY,
			},
		},
	);

	const data = await response.json();

	console.log(data);

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	return (data.credentials.data as any[]) || [];
};
