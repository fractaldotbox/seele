import fs from "node:fs";
import path from "node:path";
import * as TurboSdk from "@ardrive/turbo-sdk";
import mimeTypes from "mime-types";
console.log("Deploying website...");
function getAllFiles(dir, allFiles = []) {
	// biome-ignore lint/complexity/noForEach: <explanation>
	fs.readdirSync(dir).forEach((file) => {
		const filePath = path.join(dir, file);
		if (!fs.statSync(filePath).isDirectory()) return allFiles.push(filePath);
		getAllFiles(filePath, allFiles);
	});
	return allFiles;
}

const file = fs.readFileSync("key.json", { encoding: "utf-8" });

const privateKey = JSON.parse(file);
const turbo = TurboSdk.TurboFactory.authenticated({
	privateKey,
});
const uploadResults = [];
for (const filePath of getAllFiles("dist")) {
	console.log(`- ${filePath}`);
	const result = await turbo.uploadFile({
		fileStreamFactory: () => fs.createReadStream(filePath),
		fileSizeFactory: () => fs.statSync(filePath).size,
		dataItemOpts: {
			tags: [{ name: "Content-Type", value: mimeTypes.lookup(filePath) }],
		},
	});
	uploadResults.push({
		path: filePath
			.replaceAll(path.sep, "/")
			.replace("dist/", "")
			.replace("/index.html", "/"),
		txId: result.id,
	});
}
console.log("- manifest.json");
const pathManifest = {
	manifest: "arweave/paths",
	version: "0.2.0",
	index: { path: "index.html" },
	paths: uploadResults.reduce(
		(paths, file) => ({ ...paths, [file.path]: { id: file.txId } }),
		{},
	),
};
fs.writeFileSync("manifest.json", JSON.stringify(pathManifest));
const result = await turbo.uploadFile({
	fileStreamFactory: () => fs.createReadStream("manifest.json"),
	fileSizeFactory: () => fs.statSync("manifest.json").size,
	dataItemOpts: {
		tags: [
			{ name: "Content-Type", value: "application/x.arweave-manifest+json" },
		],
	},
});
fs.writeFileSync("deployment-id", result.id);
console.log(`https://arweave.net/${result.id}`);
