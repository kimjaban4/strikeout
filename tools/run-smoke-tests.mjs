import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const url = `http://127.0.0.1:${port}`;
let serverProcess = null;

function pingServer() {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await pingServer()) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Smoke test server did not start at ${url}`);
}

function stopServer() {
  if (!serverProcess || serverProcess.killed) return;
  serverProcess.kill("SIGTERM");
  setTimeout(() => {
    if (serverProcess && !serverProcess.killed) serverProcess.kill("SIGKILL");
  }, 1000).unref();
}

function runPlaywright() {
  const args = [path.join(root, "node_modules", "playwright", "cli.js"), "test", ...process.argv.slice(2)];
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: root, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

try {
  if (!(await pingServer())) {
    serverProcess = spawn(process.execPath, ["server.js"], { cwd: root, stdio: "ignore" });
    await waitForServer();
  }
  process.exitCode = await runPlaywright();
} finally {
  stopServer();
}
