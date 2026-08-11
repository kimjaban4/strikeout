import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";
import { deployDirectories, deployFiles } from "./deploy-file-list.mjs";

const sourceRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = path.join(sourceRoot, "_android_web");
const trackedAssets = execFileSync("git", ["-c", "core.quotepath=false", "ls-files", "--", ...deployDirectories], {
  cwd: sourceRoot,
  encoding: "utf8"
}).split(/\r?\n/).filter(Boolean);
const files = [...deployFiles, ...trackedAssets];

execFileSync(process.execPath, [path.join(sourceRoot, "tools", "check-project-structure.mjs")], {
  cwd: sourceRoot,
  stdio: "inherit"
});
execFileSync(process.execPath, [path.join(sourceRoot, "tools", "split-game-modules.mjs")], {
  cwd: sourceRoot,
  stdio: "inherit"
});

for (const relativePath of files) {
  const source = path.join(sourceRoot, relativePath);
  const target = path.join(outputRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

// ponytail: generated directory is not cleared; tracked asset removals are rare and avoiding deletion protects local work.
console.log(`Android web build complete: ${files.length} tracked files -> ${outputRoot}`);
