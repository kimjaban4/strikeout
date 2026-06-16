import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { deployDirectories, deployFiles } from "./deploy-file-list.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(__dirname, "..");
const deployRoot = process.env.DEPLOY_ROOT
  ? path.resolve(sourceRoot, process.env.DEPLOY_ROOT)
  : path.join(sourceRoot, "..", "web-deploy", "mount-psycho-baseball");

function listFiles(root, relativeDir) {
  const absoluteDir = path.join(root, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];
  return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name);
    return entry.isDirectory() ? listFiles(root, relativePath) : [relativePath];
  });
}

function fileHash(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

const files = [...deployFiles, ...deployDirectories.flatMap((dir) => listFiles(sourceRoot, dir))];
const errors = [];

for (const relativePath of files) {
  const sourcePath = path.join(sourceRoot, relativePath);
  const deployPath = path.join(deployRoot, relativePath);
  if (!fs.existsSync(sourcePath)) {
    errors.push(`${relativePath}: source missing`);
    continue;
  }
  if (!fs.existsSync(deployPath)) {
    errors.push(`${relativePath}: deploy missing`);
    continue;
  }
  if (fileHash(sourcePath) !== fileHash(deployPath)) errors.push(`${relativePath}: hash mismatch`);
}

if (errors.length) {
  console.error("Deploy sync check failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Deploy sync check passed (${files.length} files).`);
}
