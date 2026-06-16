import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const DEFAULTS = {
  input: "balance-reports/runs",
  outDir: "balance-reports"
};

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const readValue = () => {
      const value = argv[index + 1];
      index += 1;
      return value;
    };
    if (arg === "--input") options.input = readValue() || DEFAULTS.input;
    else if (arg === "--out-dir") options.outDir = readValue() || DEFAULTS.outDir;
    else if (arg.startsWith("--input=")) options.input = arg.slice("--input=".length);
  }
  return options;
}

function percent(value, total) {
  if (!total) return "0%";
  return `${Math.round((value / total) * 1000) / 10}%`;
}

function tally(items, key) {
  return items.reduce((out, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    if (value == null || value === "") return out;
    out[value] = (out[value] || 0) + 1;
    return out;
  }, {});
}

function average(values) {
  const nums = values.filter((value) => Number.isFinite(value));
  return nums.length ? nums.reduce((sum, value) => sum + value, 0) / nums.length : 0;
}

function loadRuns(inputPath) {
  const resolved = path.isAbsolute(inputPath) ? inputPath : path.join(root, inputPath);
  if (!fs.existsSync(resolved)) throw new Error(`입력 경로 없음: ${resolved}`);

  if (fs.statSync(resolved).isFile()) {
    const payload = JSON.parse(fs.readFileSync(resolved, "utf8"));
    if (Array.isArray(payload.runSummaries)) return payload.runSummaries;
    if (Array.isArray(payload.games)) return payload.games.map((game) => game.balanceRun || game).filter(Boolean);
    if (payload.outcome) return [payload];
    throw new Error("지원하지 않는 JSON 형식입니다.");
  }

  return fs
    .readdirSync(resolved)
    .filter((name) => name.startsWith("run-") && name.endsWith(".json"))
    .sort()
    .map((name) => JSON.parse(fs.readFileSync(path.join(resolved, name), "utf8")));
}

function aggregateRuns(runs) {
  const total = runs.length;
  const clears = runs.filter((run) => run.outcome === "clear" || run.won);
  const failures = runs.filter((run) => run.outcome === "failed" || run.won === false);
  const stageReached = tally(runs, (run) => run.stageReached);
  const diedAtStage = tally(
    failures.map((run) => ({ stage: run.diedAtStage || run.stageReached })),
    "stage"
  );
  const fatalResults = tally(
    failures.filter((run) => run.loss?.fatalResult).map((run) => ({ result: run.loss.fatalResult })),
    "result"
  );
  const lossByStageName = tally(
    failures.filter((run) => run.loss?.stageName).map((run) => ({ name: run.loss.stageName })),
    "name"
  );
  const avgPitches = average(runs.map((run) => run.pitches || run.pitchCount || 0));
  const avgStrikeouts = average(runs.map((run) => run.runStats?.strikeouts || run.stats?.strikeouts || 0));
  const avgWalks = average(runs.map((run) => run.runStats?.walks || run.stats?.walks || 0));
  const avgHits = average(runs.map((run) => run.runStats?.hits || run.stats?.hits || 0));
  const avgHomeruns = average(runs.map((run) => run.runStats?.homeruns || run.stats?.homeruns || 0));

  return {
    total,
    clearCount: clears.length,
    failedCount: failures.length,
    clearRate: clears.length / total,
    failedRate: failures.length / total,
    stageReached,
    diedAtStage,
    fatalResults,
    lossByStageName,
    avgPitches: Math.round(avgPitches * 10) / 10,
    avgStrikeouts: Math.round(avgStrikeouts * 10) / 10,
    avgWalks: Math.round(avgWalks * 10) / 10,
    avgHits: Math.round(avgHits * 10) / 10,
    avgHomeruns: Math.round(avgHomeruns * 10) / 10
  };
}

function markdownReport(summary) {
  const lines = [];
  lines.push("# 마운드 심리전 밸런스 집계 리포트");
  lines.push("");
  lines.push(`- 총 판수: ${summary.total}`);
  lines.push(`- 클리어: ${summary.clearCount} (${percent(summary.clearCount, summary.total)})`);
  lines.push(`- 패배: ${summary.failedCount} (${percent(summary.failedCount, summary.total)})`);
  lines.push(`- 평균 투구 수: ${summary.avgPitches}`);
  lines.push(`- 평균 삼진/볼넷/피안타/홈런: ${summary.avgStrikeouts} / ${summary.avgWalks} / ${summary.avgHits} / ${summary.avgHomeruns}`);
  lines.push("");
  lines.push("## 스테이지 도달 분포");
  Object.entries(summary.stageReached)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([stage, count]) => lines.push(`- Stage ${stage}: ${count}판 (${percent(count, summary.total)})`));
  lines.push("");
  lines.push("## 패배 스테이지");
  Object.entries(summary.diedAtStage)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([stage, count]) => lines.push(`- Stage ${stage} 탈락: ${count}판 (${percent(count, summary.failedCount)})`));
  lines.push("");
  lines.push("## 패배 직전 결과");
  Object.entries(summary.fatalResults)
    .sort((a, b) => b[1] - a[1])
    .forEach(([result, count]) => lines.push(`- ${result}: ${count}판 (${percent(count, summary.failedCount)})`));
  lines.push("");
  lines.push("## 패배 스테이지명");
  Object.entries(summary.lossByStageName)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => lines.push(`- ${name}: ${count}판 (${percent(count, summary.failedCount)})`));
  return `${lines.join("\n")}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const runs = loadRuns(options.input);
  if (!runs.length) throw new Error("집계할 판 기록이 없습니다.");

  const summary = aggregateRuns(runs);
  const outDir = path.join(root, options.outDir);
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(outDir, `aggregate-${stamp}.json`);
  const mdPath = path.join(outDir, `aggregate-${stamp}.md`);
  fs.writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), input: options.input, summary }, null, 2), "utf8");
  fs.writeFileSync(mdPath, markdownReport(summary), "utf8");

  console.log(`판수: ${summary.total}`);
  console.log(`클리어: ${summary.clearCount} (${percent(summary.clearCount, summary.total)})`);
  console.log(`패배: ${summary.failedCount} (${percent(summary.failedCount, summary.total)})`);
  console.log(`JSON: ${jsonPath}`);
  console.log(`MD: ${mdPath}`);
}

main();
