import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { deployDirectories, deployFiles } from "./deploy-file-list.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(__dirname, "..");
const deployRoot = path.join(sourceRoot, "..", "web-deploy", "mount-psycho-baseball");
const staleDeployFiles = ["styles-pitcher-card-v2-guard.css"];
const javascriptFiles = deployFiles.filter((relativePath) => path.extname(relativePath) === ".js");

function copyFile(relativePath) {
  const sourcePath = path.join(sourceRoot, relativePath);
  const deployPath = path.join(deployRoot, relativePath);
  fs.mkdirSync(path.dirname(deployPath), { recursive: true });
  fs.copyFileSync(sourcePath, deployPath);
}

function copyDirectory(relativeDir) {
  const sourceDir = path.join(sourceRoot, relativeDir);
  if (!fs.existsSync(sourceDir)) return;
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) copyDirectory(relativePath);
    else copyFile(relativePath);
  }
}

function removeStaleDeployFile(relativePath) {
  const deployPath = path.resolve(deployRoot, relativePath);
  const deployPrefix = `${path.resolve(deployRoot)}${path.sep}`;
  if (!deployPath.startsWith(deployPrefix)) throw new Error(`Refusing to remove path outside deploy root: ${deployPath}`);
  if (fs.existsSync(deployPath)) fs.rmSync(deployPath);
}

execFileSync(process.execPath, [path.join(__dirname, "check-project-structure.mjs")], {
  cwd: sourceRoot,
  stdio: "inherit"
});

execFileSync(process.execPath, [path.join(__dirname, "split-game-modules.mjs")], {
  cwd: sourceRoot,
  stdio: "inherit"
});

for (const relativePath of javascriptFiles) {
  execFileSync(process.execPath, ["--check", path.join(sourceRoot, relativePath)], {
    cwd: sourceRoot,
    stdio: "inherit"
  });
}

fs.mkdirSync(deployRoot, { recursive: true });
staleDeployFiles.forEach(removeStaleDeployFile);
deployFiles.forEach(copyFile);
deployDirectories.forEach(copyDirectory);

execFileSync(process.execPath, [path.join(__dirname, "check-deploy-sync.mjs")], {
  cwd: sourceRoot,
  stdio: "inherit"
});

console.log(`Deploy build complete: ${deployRoot}`);
