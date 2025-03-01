import fs from "node:fs";
import path from "node:path";
import mimeTypes from "mime-types";
import * as TurboSdk from "@ardrive/turbo-sdk";

console.log("Deploying website...");
function getAllFiles(dir: string): string[] {
  const allFiles: string[] = [];
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    if (!fs.statSync(filePath).isDirectory()) allFiles.push(filePath);
    else allFiles.push(...getAllFiles(filePath));
  }
  return allFiles;
}

export async function deployWebApp(distDir: string) {
  const turbo = TurboSdk.TurboFactory.authenticated({
    privateKey: JSON.parse(fs.readFileSync("key.json", { encoding: "utf-8" })),
  });
  const uploadResults = [];
  for (const filePath of getAllFiles(distDir)) {
    console.log(`- ${filePath}`);
    const result = await turbo.uploadFile({
      fileStreamFactory: () => fs.createReadStream(filePath),
      fileSizeFactory: () => fs.statSync(filePath).size,
      dataItemOpts: {
        tags: [
          { name: "Content-Type", value: mimeTypes.lookup(filePath) || "" },
        ],
      },
    });
    uploadResults.push({
      path: filePath
        .replaceAll(path.sep, "/")
        .replace(distDir, "")
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
      (paths, file) => Object.assign(paths, { [file.path]: { id: file.txId } }),
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
}

if (require.main === module) {
  deployWebApp("dist");
}
