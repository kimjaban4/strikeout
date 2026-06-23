import { execFileSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(__dirname, "..");

execFileSync(process.execPath, [path.join(__dirname, "build-deploy.mjs")], {
  cwd: sourceRoot,
  stdio: "inherit",
  env: { ...process.env, DEPLOY_ROOT: "_site" }
});
