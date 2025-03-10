// TODO update with EthStorage
// https://docs.ethstorage.io/dapp-developer-guide/tutorials/use-ethstorage-sdk-to-upload-and-download-files

import {
	FileType,
	createEthStorage,
	uploadBlob,
	uploadFileToDirectory,
} from "@seele/data-fetch/ethstorage/index";
import { createStorage } from "unstorage";

export const initStorage = () => {
	const storage = createStorage(/* opts */);

	return storage;
};

export const persist = async (
	privateKey: string,
	data: {
		namespace: string;
		contentKey: string;
		content: string;
	},
) => {
	const { namespace, contentKey, content } = data;

	const key = `${namespace}/${contentKey}`;
	const dataBlob = Buffer.from(content);

	const ethStorage = await createEthStorage(privateKey);
	await uploadBlob(ethStorage, key, dataBlob);
};

export const persistWithDirectory = async (
	directoryParams: {
		privateKey: string;
		directoryAddress: string;
	},
	data: {
		namespace?: string;
		contentKey: string;
		content: string | Uint8Array;
	},
) => {
	const { namespace, contentKey, content } = data;

	const { privateKey, directoryAddress } = directoryParams;

	const key = [namespace, contentKey].filter(Boolean).join("/");

	console.log("upload: key", key, "content", content);
	// const dataBlob = Buffer.from(content);

	const request = {
		key,
		content: typeof content === "string" ? Buffer.from(content) : content,
		type: FileType.Blob,
	};

	const uploadResults = await uploadFileToDirectory(
		privateKey,
		directoryAddress,
		request,
	);

	console.log("uploadResults", uploadResults);
	return uploadResults;
};
