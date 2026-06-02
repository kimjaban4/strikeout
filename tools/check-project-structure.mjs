import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assertOrdered(actual, expected, label) {
  const normalized = actual.map((value) => value.split("?")[0]);
  if (JSON.stringify(normalized) !== JSON.stringify(expected)) {
    throw new Error(`${label} order mismatch:\n- expected: ${expected.join(", ")}\n- actual: ${normalized.join(", ")}`);
  }
}

const indexHtml = read("index.html");
const stylesheets = [...indexHtml.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g)].map((match) => match[1]);
const scripts = [...indexHtml.matchAll(/<script\s+src="([^"]+)"/g)].map((match) => match[1]);

assertOrdered(
  stylesheets,
  ["styles.css", "css/05-card-layout.css", "css/10-pitcher-card.css", "css/20-pitch-selection.css"],
  "stylesheet"
);
assertOrdered(
  scripts,
  ["js/00-constants.js", "js/01-state.js", "js/03-pitch-progression.js", "js/04-stage-theme.js", "js/02-game-core.js"],
  "runtime script"
);

const gameSource = read("game.js");
const splitMarkers = [
  "// @runtime-split state:start",
  "// @runtime-split constants:resume",
  "// @runtime-split core:start"
];
let previousIndex = -1;
for (const marker of splitMarkers) {
  const index = gameSource.indexOf(marker);
  if (index < 0) throw new Error(`game.js is missing runtime split marker: ${marker}`);
  if (index <= previousIndex) throw new Error(`game.js runtime split marker is out of order: ${marker}`);
  previousIndex = index;
}

const cardLayoutMarker = "/* === Pitcher card: canonical grid (fixes post-merge layout conflicts) === */";
if (read("styles.css").includes(cardLayoutMarker)) {
  throw new Error("styles.css still contains the extracted card layout block");
}
if (!read("css/05-card-layout.css").includes(cardLayoutMarker)) {
  throw new Error("css/05-card-layout.css is missing the card layout block");
}

console.log("Project structure check passed.");
