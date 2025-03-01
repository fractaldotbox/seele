import { EthStorage, FlatDirectory } from "ethstorage-sdk";
import { beforeAll, describe, expect, it } from "vitest";
import { getBlob } from "../blockscout/blockscout";
import {
	FileType,
	createDirectory,
	createEthStorage,
	downloadBlob,
	downloadFileFromDirectoryAsync,
	readBlob,
	uploadBlob,
	uploadBlobs,
	uploadFileToDirectory,
} from "./ethstorage";

describe(
	"EthStorage",
	() => {
		const privateKeyStorage = process.env.PRIVATE_KEY_STORAGE!;
		// 0xFbea411E02117CEda511f8760e349bC2547Ccb9D
		const privateKeyAgent = process.env.PRIVATE_KEY_AGENT!;

		// it('#readBlob', async () => {
		//     const results = await readBlob();
		//     console.log('results', results);
		// });

		it.skip("#createDirectory for new", async () => {
			const { directoryAddress } = await createDirectory("", undefined);
			console.log("directoryAddress", directoryAddress);

			// expect(directoryAddress).toEqual(existingAddress);
		});
		it("#createDirectory for existing", async () => {
			const existingAddress = "0x73b6443fF19E7EA934Ae8E4B0dDcf3D899580BE8";
			const { directoryAddress } = await createDirectory(
				privateKeyStorage,
				existingAddress,
			);

			expect(directoryAddress).toEqual(existingAddress);
		});

		it("#uploadFileToDirectory with new directory", async () => {
			const ethStorage = await createEthStorage(privateKeyStorage);
			const existingAddress = "";
			const { flatDirectory, directoryAddress } = await createDirectory(
				privateKeyAgent,
				existingAddress,
			);

			const request = {
				key: "abc.txt",
				content: Buffer.from("big data 2200"),
				type: FileType.Blob,
			};

			const uploadResults = await uploadFileToDirectory(
				privateKeyStorage,
				directoryAddress,
				request,
			);

			const hashes = await flatDirectory.fetchHashes([request.key]);
			console.log("upload results", uploadResults, hashes);

			// blob hashes
			console.log("download", directoryAddress);
			const results = await downloadFileFromDirectoryAsync(
				flatDirectory,
				request.key,
			);
			console.log("download results", results.toString("utf-8"));
			expect(results.toString("utf-8")).toEqual("big data 2200");
		});

		// it('#uploadBlobs', async () => {
		//     const ethStorage = await createEthStorage(privateKeyStorage);
		//     // const ethStorageAgent = await createEthStorage(privateKeyAgent);
		//     const keys = ["key1", "key2"];
		//     const data = ["data1", "data2"];
		//     await uploadBlobs(ethStorage, keys, data.map((d) => Buffer.from(d)));
		//     const results = await ethStorage.read(keys[0]);
		//     // const results = await readBlob(ethStorage, keys[0]);
		//     console.log('results', results);

		// });

		it.skip("getBlob", async () => {
			// not working, error  "Params 'module' and 'action' are required parameters",
			const results = await getBlob(
				"0x0ac0ebcebb0872499f10e1d2cd84f0a9bb2bfd17c43ef80af296f460edfeaac2",
				3337,
			);
			console.log("results", results);
		});

		it("#uploadBlob", async () => {
			const ethStorage = await createEthStorage(privateKeyStorage);
			const key = "test.txt";
			const data = "test data";
			await uploadBlob(ethStorage, key, Buffer.from(data));
			const results = await readBlob(ethStorage, key);

			expect(results.toString("utf-8")).toEqual(data);
		});
	},
	5 * 60 * 1000,
);
