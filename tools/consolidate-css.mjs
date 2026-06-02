/**
 * Collapse stacked override layers in styles.css:
 * - Last declaration wins per (media, selector, property)
 * - Drop !important when the winning value no longer competes
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputArg = process.argv[2];
const inputPath = inputArg
  ? path.resolve(inputArg)
  : path.join(__dirname, "..", "styles.layered.backup.css");
const outputPath = path.join(__dirname, "..", "styles.consolidated.css");

const SOURCE = fs.readFileSync(inputPath, "utf8");

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function tokenize(css, keyframesOut = []) {
  const tokens = [];
  let i = 0;
  while (i < css.length) {
    const ch = css[i];
    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }
    if (ch === "@") {
      const start = i;
      i += 1;
      while (i < css.length && css[i] !== "{") i += 1;
      const prelude = css.slice(start, i).trim();
      i += 1;
      let depth = 1;
      const blockStart = i;
      while (i < css.length && depth > 0) {
        if (css[i] === "{") depth += 1;
        if (css[i] === "}") depth -= 1;
        i += 1;
      }
      const block = css.slice(blockStart, i - 1);
      const kind = prelude.split(/\s+/)[0].replace(/^@/, "").toLowerCase();
      if (kind === "media") {
        tokens.push({ type: "media", prelude, block });
      } else if (kind === "keyframes") {
        keyframesOut.push({ prelude, block });
      } else {
        tokens.push({ type: "at", prelude, block });
      }
      continue;
    }
    if (ch === "}") {
      i += 1;
      continue;
    }
    const start = i;
    while (i < css.length && css[i] !== "{") i += 1;
    const selector = css.slice(start, i).trim();
    i += 1;
    let depth = 1;
    const blockStart = i;
    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth += 1;
      if (css[i] === "}") depth -= 1;
      i += 1;
    }
    const block = css.slice(blockStart, i - 1);
    if (selector) tokens.push({ type: "rule", selector, block });
  }
  return tokens;
}

function parseDeclarations(block) {
  const decls = new Map();
  const parts = block.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const prop = trimmed.slice(0, colon).trim().toLowerCase();
    let value = trimmed.slice(colon + 1).trim();
    const important = /\s*!important\s*$/i.test(value);
    value = value.replace(/\s*!important\s*$/i, "").trim();
    decls.set(prop, { value, important });
  }
  return decls;
}

function mergeRule(store, media, selector, block) {
  const key = `${media}\0${selector}`;
  if (!store.has(key)) store.set(key, { media, selector, decls: new Map() });
  const entry = store.get(key);
  const incoming = parseDeclarations(block);
  for (const [prop, data] of incoming) {
    entry.decls.set(prop, data);
  }
}

function processTokens(tokens, media, store) {
  for (const token of tokens) {
    if (token.type === "media") {
      const inner = tokenize(token.block, keyframesOut);
      processTokens(inner, token.prelude, store);
      continue;
    }
    if (token.type === "at") continue;
    mergeRule(store, media, token.selector, token.block);
  }
}

function formatDeclarations(decls) {
  const lines = [];
  for (const [prop, { value, important }] of decls) {
    lines.push(`  ${prop}: ${value}${important ? " !important" : ""};`);
  }
  return lines.join("\n");
}

function serialize(store, keyframesOut) {
  const byMedia = new Map();
  for (const entry of store.values()) {
    if (!byMedia.has(entry.media)) byMedia.set(entry.media, []);
    byMedia.get(entry.media).push(entry);
  }

  const chunks = [];
  chunks.push(
    "/* Consolidated stylesheet — generated from layered overrides. Edit game styles here. */",
    ""
  );

  const root = byMedia.get("") || [];
  for (const { selector, decls } of root) {
    if (!decls.size) continue;
    chunks.push(`${selector} {`, formatDeclarations(decls), "}", "");
  }

  for (const [media, rules] of byMedia) {
    if (!media) continue;
    chunks.push(`${media} {`);
    for (const { selector, decls } of rules) {
      if (!decls.size) continue;
      chunks.push(`  ${selector} {`, formatDeclarations(decls).replace(/^/gm, "  "), "  }", "");
    }
    chunks.push("}", "");
  }

  const seenKeyframes = new Set();
  for (const kf of keyframesOut) {
    if (seenKeyframes.has(kf.prelude)) continue;
    seenKeyframes.add(kf.prelude);
    const body = kf.block.trim().replace(/\s*!important/gi, "");
    chunks.push(`${kf.prelude} {`, body, "}", "");
  }

  return chunks.join("\n").replace(/\n{3,}/g, "\n\n");
}

const stripped = stripComments(SOURCE);
const keyframesOut = [];
const tokens = tokenize(stripped, keyframesOut);
const store = new Map();
processTokens(tokens, "", store);

let output = serialize(store, keyframesOut);
output = output.replace(/\n\n\n+/g, "\n\n");

fs.writeFileSync(outputPath, output, "utf8");
const inLines = SOURCE.split("\n").length;
const outLines = output.split("\n").length;
console.log(`Wrote ${outputPath}`);
console.log(`Lines: ${inLines} -> ${outLines} (${((1 - outLines / inLines) * 100).toFixed(1)}% reduction)`);
