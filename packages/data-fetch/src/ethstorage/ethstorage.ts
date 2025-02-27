// import viem from 'viem';
import { EthStorage, FlatDirectory } from "ethstorage-sdk";
import { sepolia } from "viem/chains";


//3335
const rpc = 'https://rpc.beta.testnet.l2.quarkchain.io:8545';
//3337

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
// const rpc = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;


const ethStorageRpc = 'https://rpc.beta.testnet.l2.ethstorage.io:9596';
const privateKeyStorage = process.env.PRIVATE_KEY_STORAGE;



// const ethStorageRpc = rpc;
const getExplorerUrl = (txHash: string) => {
    return `https://explorer.beta.testnet.l2.quarkchain.io/tx/${txHash}`
}


export const createDirectory = async (privateKey: string, existingAddress?: string) => {
    let address = existingAddress;
    const params = {
        rpc: rpc,
        ethStorageRpc,
        privateKey,
        address
    }
    const flatDirectory = await FlatDirectory.create(params);

    if (!existingAddress) {
        address = await flatDirectory.deploy();
        console.log('deployed', address)
    }

    return {
        flatDirectory,
        directoryAddress: address!
    };
}

// ignore overflow
export const downloadFileFromDirectoryAsync = async (flatDirectory: FlatDirectory, key: string) => {

    const buffers: Buffer[] = [];

    const callback = {
        onProgress: function (index, blobCount, data) {
            console.log('progress', index, blobCount);
            buffers.push(data);
        },
        onFail: function (err) {
            console.log('download error', err)
        },
        onFinish: function () {
            console.log('download completed');
        }
    };

    await flatDirectory.download(key, callback);


    return Buffer.concat(buffers);
}

export const uploadFileToDirectoryAsync = (flatDirectory, request) => {

    return new Promise((resolve, reject) => {

        const callback = {
            onProgress: function (progress, count, isChange) {
                console.log('progress', progress)
            },
            onFail: function (err) {
                reject(err);
            },
            onFinish: function (totalUploadChunks, totalUploadSize, totalStorageCost) {
                console.log('totalUploadChunks', totalUploadSize, totalUploadChunks);
                if (totalUploadSize === 0) {
                    console.log('File unchanged')
                }
                resolve({
                    totalUploadSize
                })
            }
        };


        console.log('uploading', request.key, request.content);
        flatDirectory.upload({
            ...request,
            type: 2, // 1 for calldata and 2 for blob
            callback
        });
    })


}

export enum FileType {
    Calldata = 1,
    Blob = 2
}


export const uploadFileToDirectory = async (privateKey: string, directoryAddress: string, request: any) => {


    const flatDirectory = await FlatDirectory.create({
        rpc: rpc,
        ethStorageRpc,
        privateKey,
        address: directoryAddress,
    });



    return await uploadFileToDirectoryAsync(flatDirectory, request);
}

export const uploadBlob = async (ethStorage: EthStorage, key: string, dataBlob: Buffer) => {
    const status = await ethStorage.write(key, dataBlob);

    console.log('uploadBlob status', status);

    return status;
}

export const uploadBlobs = async (ethStorage: EthStorage, keys: string[], dataBlobs: Buffer[]) => {
    // TODO txn hashes
    const status = await ethStorage.writeBlobs(keys, dataBlobs);

    console.log('uploadBlobs status', status);

    return status;
}

export const downloadBlob = async (ethStorage: EthStorage, key: string) => {
    return await ethStorage.read(key);

}

export const createEthStorage = async (privateKey: string) => {

    return await EthStorage.create({
        rpc,
        ethStorageRpc: ethStorageRpc,
        privateKey,
    });


}


export const readBlob = async (ethStorage: EthStorage, key: string) => {

    const results = await ethStorage.read(key);



    return Buffer.from(results);

}