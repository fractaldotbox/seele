// import viem from 'viem';
import { EthStorage, FlatDirectory } from "ethstorage-sdk";
import { getTransactionsWithAddress, getTxnsByFilter } from "./blockscout";
import { sepolia } from "viem/chains";

// const ethStorageRpc = 'http://mainnet.l2.ethstorage.io:9540';
const ethStorageRpc = "http://testnet.ethstorage.io:9540";
// const ethStorageRpc = 'http://devnet.l2.ethstorage.io:9540';

// const ethStorageRpc = 'https://rpc.testnet.l2.quarkchain.io:8545';
const privateKey = process.env.PRIVATE_KEY_STORAGE;


const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const rpc = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
// const rpc = ethStorageRpc

// const ethStorageRpc = rpc;
const getExplorerUrl = (txHash: string) => {
    return `https://sepolia.etherscan.io/tx/${txHash}`
}


export const createDirectory = async (existingAddress?: string) => {
    let address = existingAddress;
    const params = {
        rpc: rpc,
        ethStorageRpc,
        privateKey: privateKey,
        address
    }
    const flatDirectory = await FlatDirectory.create(params);

    if (!existingAddress) {
        address = await flatDirectory.deploy();

    }

    return {
        flatDirectory,
        directoryAddress: address
    };
}


export const downloadFileFromDirectoryAsync = (flatDirectory: FlatDirectory, key: string) => {
    return new Promise((resolve, reject) => {

        const callback = {
            onProgress: function (progress, count, isChange) {
                console.log('progress', progress)
            },
            onFail: function (err) {
                console.log('error', err)
                reject(err);
            },
            onFinish: function () {
                console.log('download completed')
                resolve()
            }
        };

        flatDirectory.download(key, callback);
    })

}

const uploadFileToDirectoryAsync = (flatDirectory, request) => {

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


export const uploadFileToDirectory = async (directoryAddress: string, request: any) => {


    const flatDirectory = await FlatDirectory.create({
        rpc: rpc,
        ethStorageRpc,
        privateKey: privateKey,
        address: directoryAddress,
    });



    return await uploadFileToDirectoryAsync(flatDirectory, request);
}

export const uploadBlob = async (ethStorage: EthStorage, key: string) => {
    const data = Buffer.from("test data");
    await ethStorage.write(key, data);

}

export const downloadBlob = async (ethStorage: EthStorage, key: string) => {
    return await ethStorage.read(key);

}

export const create = async () => {



    return await EthStorage.create({
        rpc,
        ethStorageRpc: ethStorageRpc,
        privateKey: privateKey,
    });


}


export const readBlob = async () => {

    // const results = await getTxnsByFilter({
    //     filter: 'from=0x2D10A168b8aaB0C6f55F48617475Afe0980dE86D',
    //     chainId: sepolia.id
    // });

    const address = '0x2D10A168b8aaB0C6f55F48617475Afe0980dE86D';
    const transactions = await getTransactionsWithAddress(address, sepolia.id)

    console.log('xxx', transactions?.[0])
    // TODO
    // read last txn hash, check the blob
}