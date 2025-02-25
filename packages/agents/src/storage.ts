// TODO update with EthStorage
// https://docs.ethstorage.io/dapp-developer-guide/tutorials/use-ethstorage-sdk-to-upload-and-download-files

import { createStorage } from "unstorage";


export const initStorage = () => {
    const storage = createStorage(/* opts */);

    return storage;
}