export type ArticleMeta = {
	key: string;
	directoryAddress: string;
};

export const createEthstorageArticleUrl = (
	directoryAddress: string,
	key: string,
) => {
	return `https://${directoryAddress}.3337.w3link.io/${key}`;
};

export const loadArticles = async (articleMetas: ArticleMeta[]) => {
	const articles = [];

	for (let i = 0; i < articleMetas.length; i++) {
		const meta = articleMetas[i]!;

		const url = createEthstorageArticleUrl(meta.directoryAddress, meta.key);
		const content = await fetch(url).then((response) => response.text());

		console.log("content", content);

		articles.push({
			key: meta.key,
			content,
		});
	}

	return articles;
};
