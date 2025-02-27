import { persistWithDirectory } from "../storage";

const privateKeyManager = process.env.PRIVATE_KEY_MANAGER!;

const directoryAddress = process.env.DIRECTORY_ADDRESS_MANAGER!;

export const deployArticles = async (articles: string[]) => {

    for (let i = 0; i < articles.length; i++) {

        await persistWithDirectory({
            privateKey: privateKeyManager,
            directoryAddress
        }, {
            namespace: "community1",
            contentKey: `article${i + 1}.md`,
            content: articles[i]!
        })
    }
}