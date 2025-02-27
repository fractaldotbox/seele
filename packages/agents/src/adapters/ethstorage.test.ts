import { beforeAll, describe, expect, it } from "vitest";
import { create, createDirectory, downloadBlob, downloadFileFromDirectoryAsync, FileType, readBlob, uploadBlob, uploadFileToDirectory } from "./ethstorage";
import { EthStorage, FlatDirectory } from "ethstorage-sdk";


describe(
    "EthStorage",
    () => {
        it('#readBlob', async () => {
            await readBlob();
        });

        it.skip('#createDirectory for existing', async () => {
            const existingAddress = '0x73b6443fF19E7EA934Ae8E4B0dDcf3D899580BE8';
            const { directoryAddress } = await createDirectory(existingAddress);

            expect(directoryAddress).toEqual(existingAddress);
        });

        it.only("#uploadFileToDirectory", async () => {
            const ethStorage = await create();
            const directoryAddress = '0x73b6443fF19E7EA934Ae8E4B0dDcf3D899580BE8';

            const { flatDirectory } = await createDirectory(directoryAddress);

            const request = {
                key: "a",
                content: Buffer.from("big data 1648"),
                type: FileType.Blob
            }


            const uploadResults = await uploadFileToDirectory(directoryAddress, request);

            const hashes = await flatDirectory.fetchHashes([request.key])
            console.log('upload results', uploadResults, hashes);

            // blob hashes
            console.log('download', directoryAddress)
            // const results = await downloadFileFromDirectoryAsync(flatDirectory, "a.txt");

            // console.log('download results', results);
        });

        it('#uploadBlob', async () => {
            const ethStorage = await create();
            await uploadBlob(ethStorage, "test.txt");

        });
    },
    5 * 60 * 1000,
);
