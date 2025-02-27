import { beforeAll, describe, expect, it } from "vitest";
import { createDirectory, createEthStorage, downloadBlob, downloadFileFromDirectoryAsync, FileType, readBlob, uploadBlob, uploadBlobs, uploadFileToDirectory } from "./ethstorage";
import { EthStorage, FlatDirectory } from "ethstorage-sdk";
import { getBlob } from "../blockscout/blockscout";


describe(
    "EthStorage",
    () => {
        const privateKeyStorage = process.env.PRIVATE_KEY_STORAGE!;
        const privateKeyAgent = process.env.PRIVATE_KEY_AGENT!;

        // it('#readBlob', async () => {
        //     const results = await readBlob();
        //     console.log('results', results);
        // });

        it('#createDirectory for existing', async () => {
            const existingAddress = '0x73b6443fF19E7EA934Ae8E4B0dDcf3D899580BE8';
            const { directoryAddress } = await createDirectory(privateKeyStorage, existingAddress);

            expect(directoryAddress).toEqual(existingAddress);
        });

        it.only("#uploadFileToDirectory with new directory", async () => {
            const ethStorage = await createEthStorage(privateKeyStorage);
            const existingAddress = '';
            const { flatDirectory, directoryAddress } = await createDirectory(privateKeyStorage, existingAddress);

            const request = {
                key: "a.txt",
                content: Buffer.from("big data 2200"),
                type: FileType.Blob
            }


            const uploadResults = await uploadFileToDirectory(privateKeyStorage, directoryAddress, request);

            const hashes = await flatDirectory.fetchHashes([request.key])
            console.log('upload results', uploadResults, hashes);

            // blob hashes
            console.log('download', directoryAddress)
            const results = await downloadFileFromDirectoryAsync(flatDirectory, request.key);
            console.log('download results', results.toString('utf-8'));
            expect(results.toString('utf-8')).toEqual("big data 2200");

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

        it.skip('getBlob', async () => {
            // not working, error  "Params 'module' and 'action' are required parameters",
            const results = await getBlob('0x0ac0ebcebb0872499f10e1d2cd84f0a9bb2bfd17c43ef80af296f460edfeaac2', 3337)
            console.log('results', results);
        });

        it('#uploadBlob', async () => {
            const ethStorage = await createEthStorage(privateKeyStorage);
            const key = "test.txt";
            const data = 'test data';
            await uploadBlob(ethStorage, key, Buffer.from(data));
            const results = await readBlob(ethStorage, key);

            expect(results.toString('utf-8')).toEqual(data);

        });
    },
    60 * 1000,
);
