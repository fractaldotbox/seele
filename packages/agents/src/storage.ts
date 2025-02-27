// TODO update with EthStorage
// https://docs.ethstorage.io/dapp-developer-guide/tutorials/use-ethstorage-sdk-to-upload-and-download-files

import { createStorage } from "unstorage";
import { uploadBlob, createEthStorage, uploadFileToDirectory, FileType } from '@repo/data-fetch'

export const initStorage = () => {
	const storage = createStorage(/* opts */);

	return storage;
};

export const persist = async (privateKey: string, data: {
	namespace: string, contentKey: string, content: string
}) => {
	const { namespace, contentKey, content } = data;

	const key = `${namespace}/${contentKey}`;
	const dataBlob = Buffer.from(content);

	const ethStorage = await createEthStorage(privateKey);
	await uploadBlob(ethStorage, key, dataBlob);
}


export const persistWithDirectory = async (directoryParams: {
	privateKey: string,
	directoryAddress: string,
}, data: {
	namespace: string, contentKey: string, content: string
}) => {
	const { namespace, contentKey, content } = data;

	const { privateKey, directoryAddress } = directoryParams;

	const key = `${namespace}/${contentKey}`;

	console.log('upload: key', key, 'content', content);
	const dataBlob = Buffer.from(content);


	const request = {
		key,
		content: Buffer.from(content),
		type: FileType.Blob
	}

	const uploadResults = await uploadFileToDirectory(privateKey, directoryAddress, request);


	console.log('uploadResults', uploadResults);

}
