import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "game.js");
const outDir = path.join(root, "js");

const lines = fs.readFileSync(sourcePath, "utf8").split(/\r?\n/);
const stateLine = lines.findIndex((line) => line.startsWith("const state = "));
const elsLine = lines.findIndex((line) => line.startsWith("const els = "));
const courseZonesLine = lines.findIndex((line) => line.startsWith("const courseZones = "));
const coreLine = lines.findIndex((line) => line.startsWith("function clamp("));

if ([stateLine, elsLine, courseZonesLine, coreLine].some((index) => index < 0)) {
  throw new Error("split-game-modules: could not locate state/els/courseZones/core markers in game.js");
}

const sections = {
  constants: [...lines.slice(0, stateLine), ...lines.slice(courseZonesLine, coreLine)],
  state: lines.slice(stateLine, courseZonesLine),
  core: lines.slice(coreLine)
};

const timerNames = [
  "timingTimer",
  "autoAdvanceTimer",
  "courseFlashTimer",
  "inningBannerTimer",
  "pitchFlightFrame",
  "rewardTimer",
  "gameOverTimer",
  "uiEventsBound"
];

function transformConstants(body) {
  return body
    .map((line) => {
      if (/^const\s+([A-Za-z_$][\w$]*)\s*=/.test(line)) {
        return line.replace(/^const\s+/, "MP.");
      }
      return line;
    })
    .join("\n");
}

function transformState(body) {
  const joined = body.join("\n");
  return joined
    .replace(/^const state = /m, "MP.state = ")
    .replace(/^const els = /m, "MP.els = ")
    .replace(
      /^let (timingTimer|autoAdvanceTimer|courseFlashTimer|inningBannerTimer|pitchFlightFrame|rewardTimer|gameOverTimer|uiEventsBound) = /gm,
      "MP.$1 = "
    );
}

function extractMpKeys(constantsBody) {
  const keys = [];
  for (const line of constantsBody) {
    const match = line.match(/^MP\.([A-Za-z_$][\w$]*)\s*=/);
    if (match) keys.push(match[1]);
  }
  keys.push("state", "els");
  timerNames.forEach((name) => keys.push(name));
  return keys;
}

function buildAliasBlock(keys) {
  const block = ["  const {"];
  keys.forEach((key, index) => {
    block.push(`    ${key}${index === keys.length - 1 ? "" : ","}`);
  });
  block.push("  } = MP;");
  return block.join("\n");
}

function transformTimers(text) {
  let out = text;
  for (const name of timerNames) {
    const re = new RegExp(`(?<![\\w$.])${name}(?![\\w$])`, "g");
    out = out.replace(re, `MP.${name}`);
  }
  return out;
}

function wrapConstants(body) {
  return [
    "/* constants — 마운드 심리전 */",
    "window.MountPsycho = window.MountPsycho || {};",
    "(function (MP) {",
    body,
    "})(window.MountPsycho);",
    ""
  ].join("\n");
}

function wrapState(body) {
  return [
    "/* state / DOM refs — 마운드 심리전 */",
    "window.MountPsycho = window.MountPsycho || {};",
    "(function (MP) {",
    body,
    "})(window.MountPsycho);",
    ""
  ].join("\n");
}

function wrapCore(body, aliasKeys) {
  const chunk = transformTimers(body.join("\n"));
  return [
    "/* game core (logic + UI + bootstrap) — 마운드 심리전 */",
    "window.MountPsycho = window.MountPsycho || {};",
    "(function (MP) {",
    buildAliasBlock(aliasKeys),
    "",
    chunk,
    "})(window.MountPsycho);",
    ""
  ].join("\n");
}

function verifySplitOutput() {
  const stateFile = path.join(outDir, "01-state.js");
  const stateText = fs.readFileSync(stateFile, "utf8");
  const errors = [];

  if (!stateText.includes("MP.state =")) errors.push("01-state.js: MP.state missing");
  if (!stateText.includes("MP.els =")) errors.push("01-state.js: MP.els missing");
  for (const file of ["00-constants.js", "01-state.js", "02-game-core.js"]) {
    try {
      execSync(`node --check "${path.join(outDir, file)}"`, { stdio: "pipe" });
    } catch {
      errors.push(`${file}: syntax check failed`);
    }
  }

  if (errors.length) {
    throw new Error(`split verification failed:\n- ${errors.join("\n- ")}`);
  }
}

fs.mkdirSync(outDir, { recursive: true });

const constantsTransformed = transformConstants(sections.constants);
const constantsKeys = extractMpKeys(sections.constants.map((line) => line.replace(/^const\s+/, "MP.")));

fs.writeFileSync(path.join(outDir, "00-constants.js"), wrapConstants(constantsTransformed));
fs.writeFileSync(path.join(outDir, "01-state.js"), wrapState(transformState(sections.state)));
fs.writeFileSync(path.join(outDir, "02-game-core.js"), wrapCore(sections.core, constantsKeys));

verifySplitOutput();
console.log("Split complete:", outDir);
