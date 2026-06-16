import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imageRoot = path.join(path.dirname(root), "이미지");

const DEFAULTS = {
  games: 12,
  maxPitches: 260,
  seed: 20260607,
  outDir: "balance-reports",
  runsDir: "balance-reports/runs",
  fullLog: false,
  bot: "player"
};

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav"
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

    if (arg === "--games") options.games = Math.max(1, Number(readValue()) || DEFAULTS.games);
    else if (arg === "--max-pitches") options.maxPitches = Math.max(40, Number(readValue()) || DEFAULTS.maxPitches);
    else if (arg === "--seed") options.seed = Number(readValue()) || DEFAULTS.seed;
    else if (arg === "--out-dir") options.outDir = readValue() || DEFAULTS.outDir;
    else if (arg === "--runs-dir") options.runsDir = readValue() || DEFAULTS.runsDir;
    else if (arg === "--full-log") options.fullLog = true;
    else if (arg === "--bot") options.bot = readValue() === "oracle" ? "oracle" : "player";
    else if (arg === "--oracle") options.bot = "oracle";
    else if (arg === "--quick") {
      options.games = 3;
      options.maxPitches = 140;
    }
  }
  return options;
}

function isInside(base, target) {
  const relative = path.relative(base, target);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function resolveStaticPath(requestPath) {
  const normalized = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const safePath = path.normalize(normalized).replace(/^(\.\.[/\\])+/, "");

  if (safePath === "이미지" || safePath.startsWith(`이미지${path.sep}`)) {
    const imagePath = path.join(imageRoot, safePath.replace(/^이미지[/\\]?/, ""));
    return isInside(imageRoot, imagePath) ? imagePath : null;
  }

  const filePath = path.join(root, safePath);
  return isInside(root, filePath) ? filePath : null;
}

function startServer() {
  const server = http.createServer((req, res) => {
    let requestPath = "/";
    try {
      requestPath = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    } catch {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Bad request");
      return;
    }

    const filePath = resolveStaticPath(requestPath);
    if (!filePath) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function average(values) {
  const nums = values.filter((value) => Number.isFinite(value));
  return nums.length ? nums.reduce((sum, value) => sum + value, 0) / nums.length : 0;
}

function percent(value) {
  return `${Math.round((Number(value) || 0) * 1000) / 10}%`;
}

function round(value, digits = 2) {
  const scale = 10 ** digits;
  return Math.round((Number(value) || 0) * scale) / scale;
}

function tally(items, key) {
  return items.reduce((out, item) => {
    const value = typeof key === "function" ? key(item) : item[key];
    if (!value) return out;
    out[value] = (out[value] || 0) + 1;
    return out;
  }, {});
}

async function installSeededRandom(page, seed) {
  await page.addInitScript((seedValue) => {
    let value = seedValue >>> 0;
    Math.random = () => {
      value = (value * 1664525 + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }, seed);
}

async function preparePage(browser, baseUrl, gameSeed, pitcherIndex, botProfile = "player") {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "ko-KR" });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await installSeededRandom(page, gameSeed);
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.MountPsycho?.debugReady);
  await page.evaluate(({ index, gameSeed, bot }) => {
    const MP = window.MountPsycho;
    Object.keys(MP.GAME_TIMING || {}).forEach((key) => {
      if (typeof MP.GAME_TIMING[key] === "number") MP.GAME_TIMING[key] = 1;
    });
    if (MP.audioState) MP.audioState.muted = true;
    MP.enableBalancePlayLog(true);
    MP.setBalancePlayLogMeta({
      seed: gameSeed,
      simIndex: index + 1,
      botProfile: bot,
      botConcept: bot === "player" ? "psych-command-anti-longball" : "oracle"
    });
    const choices = MP.state.pitcherChoices || [];
    MP.debug.beginGameWithPitcher(choices[index % choices.length] || choices[0]);
  }, { index: pitcherIndex, gameSeed, bot: botProfile });
  await settlePage(page);
  return { page, errors };
}

async function settlePage(page, botProfile = "player") {
  const actions = [];
  for (let guard = 0; guard < 100; guard += 1) {
    await page.waitForTimeout(5);
    const action = await page.evaluate((bot) => {
      const MP = window.MountPsycho;
      const state = MP?.state;
      const debug = MP?.debug;
      if (!MP?.debugReady || !state || !debug) return { kind: "booting" };
      if (state.pendingGameOver) return { kind: "wait", phase: "pendingGameOver" };
      if (state.gameOver) return { kind: "ready", phase: "gameOver" };
      const pickRewardIndex = (choices, rewardKind) => {
        if (bot === "oracle") {
          if (rewardKind === "normal") {
            const pitchUpgrade = choices.findIndex((reward) => reward.type === "pitch" || reward.type === "newPitch");
            const commandStat = choices.findIndex(
              (reward) => reward.type === "stat" && ["제구", "예측", "멘탈"].includes(reward.stat)
            );
            return pitchUpgrade >= 0 ? pitchUpgrade : commandStat >= 0 ? commandStat : 0;
          }
          return 0;
        }
        return debug.pickPlayerBotChoice?.("reward", choices, { rewardKind }) ?? 0;
      };

      if (state.rewardPending && state.rewardChoices?.length) {
        const choices = state.rewardChoices;
        const rewardIndex = pickRewardIndex(choices, state.rewardKind || "normal");
        const reward = choices[rewardIndex] || choices[0];
        debug.applyReward(rewardIndex);
        return {
          kind: "reward",
          rewardKind: state.rewardKind || "",
          rewardType: reward?.type || "",
          cardId: reward?.cardId || "",
          title: reward?.title || ""
        };
      }
      if (state.awaitingThemeSelection && state.pendingThemeChoices?.length) {
        const themes = state.pendingThemeChoices;
        const themeIndex = bot === "oracle" ? 0 : debug.pickPlayerBotChoice?.("theme", themes) ?? 0;
        const theme = themes[themeIndex] || themes[0];
        debug.confirmStageTheme(theme.id);
        return { kind: "theme", title: theme.name || theme.id };
      }
      if (state.awaitingStageStart) {
        debug.startStageFromOverlay();
        return { kind: "stageStart" };
      }
      if (state.dugoutPending && state.pendingDugoutChoices?.length) {
        const choices = state.pendingDugoutChoices;
        const dugoutIndex = bot === "oracle" ? 0 : debug.pickPlayerBotChoice?.("dugout", choices) ?? 0;
        const choice = choices[dugoutIndex];
        debug.confirmDugoutChoice(dugoutIndex);
        return { kind: "dugout", title: choice?.title || "" };
      }
      if (state.waitingNextBatter) {
        debug.nextBatter();
        return { kind: "nextBatter" };
      }
      if (!state.atBat && !state.rewardPending && !state.dugoutPending && !state.awaitingThemeSelection && !state.awaitingStageStart) {
        debug.startAtBat();
        return { kind: "startAtBat" };
      }
      return { kind: "ready", phase: state.screenPhase };
    }, botProfile);

    actions.push(action);
    if (action.kind === "ready") return actions;
  }
  return actions;
}

async function throwAutoPitch(page, botProfile = "player") {
  return page.evaluate((bot) => {
    const MP = window.MountPsycho;
    const state = MP.state;
    const debug = MP.debug;
    if (
      state.gameOver ||
      state.pendingGameOver ||
      state.rewardPending ||
      state.dugoutPending ||
      state.awaitingThemeSelection ||
      state.awaitingStageStart ||
      state.waitingNextBatter ||
      !state.atBat
    ) {
      return null;
    }

    const repertoire = state.pitcher.repertoire || [];
    if (!repertoire.length) return null;

    const history = state.atBat.choiceHistory || [];
    const last = history[history.length - 1];
    const recent = history.slice(-2);
    const playerCtx = bot === "player" ? debug.getPlayerVisiblePitchContext?.() || null : null;
    const impressionId =
      bot === "player"
        ? playerCtx?.impressionHint || null
        : state.atBat.batterMind?.lastImpression?.id || null;
    const target = bot === "player" ? playerCtx?.guessedTarget || "fast" : state.atBat.target;
    const recommendedCategory = playerCtx?.recommendation?.recommendedCategory || null;
    const suspicion = playerCtx?.suspicion ?? Math.round(state.atBat?.suspicion || 0);
    const byCategory = (category) => repertoire.filter((pitch) => pitch.category === category);
    const notRecent = (pitch) => !recent.some((entry) => entry.pitchId === pitch.id);
    const bestControl = (pool) =>
      [...(pool.length ? pool : repertoire)].sort((a, b) => (b.control || 0) - (a.control || 0))[0] || repertoire[0];
    const firstUsable = (pool) => pool.find(notRecent) || pool[0] || repertoire.find(notRecent) || repertoire[0];

    let pitch = null;
    let zone = 9;
    let intent = "strike";
    let targetRow = null;
    let targetCol = null;
    let ballPlan = "";

    if (state.balls >= 3) {
      pitch = bestControl(repertoire);
      zone = [1, 3, 7, 9][Math.floor(Math.random() * 4)];
    } else if (impressionId === "fast_timing") {
      pitch = firstUsable([...byCategory("offspeed"), ...byCategory("breaking")]);
      zone = 9;
    } else if (impressionId === "inside_fast") {
      pitch = firstUsable([...byCategory("breaking"), ...byCategory("offspeed")]);
      zone = 9;
      if (state.strikes >= 2 && state.balls <= 2) {
        intent = "ball";
        targetRow = 3;
        targetCol = 2;
        ballPlan = "fishing";
      }
    } else if (impressionId === "high_fast") {
      pitch = firstUsable([...byCategory("breaking"), ...byCategory("offspeed")]);
      zone = 9;
    } else if (impressionId === "low_slow" || impressionId === "outside_slow") {
      pitch = firstUsable(byCategory("fast"));
      zone = impressionId === "low_slow" ? 1 : 4;
    } else if (suspicion >= 60 && recommendedCategory) {
      pitch = firstUsable(byCategory(recommendedCategory));
      zone = recommendedCategory === "fast" ? 3 : 9;
    } else if (state.strikes >= 2 && state.balls <= 2) {
      pitch = firstUsable([...byCategory("breaking"), ...byCategory("offspeed"), ...byCategory("fast")]);
      if (Math.random() < 0.55) {
        intent = "ball";
        zone = 9;
        targetRow = 3;
        targetCol = 2;
        ballPlan = "fishing";
      } else {
        zone = pitch.category === "fast" ? 1 : 9;
      }
    } else if (state.balls >= 2) {
      pitch = bestControl(repertoire.filter(notRecent));
      zone = [1, 3, 7, 9][Math.floor(Math.random() * 4)];
    } else if (target === "fast") {
      pitch = firstUsable([...byCategory("breaking"), ...byCategory("offspeed"), ...byCategory("fast")]);
      zone = pitch.category === "fast" ? 1 : 9;
    } else if (target === "breaking" || target === "offspeed") {
      pitch = firstUsable([...byCategory("fast"), ...byCategory(target === "breaking" ? "offspeed" : "breaking")]);
      zone = pitch.category === "fast" ? 3 : 7;
    } else {
      pitch = firstUsable(repertoire);
      zone = pitch.category === "fast" ? (Math.random() < 0.5 ? 1 : 3) : 9;
    }

    if (last?.pitchId === pitch?.id && repertoire.length > 1) {
      pitch = firstUsable(repertoire.filter((item) => item.id !== last.pitchId));
    }
    if (!pitch) return null;

    const cardKey = (entry) => `${entry?.cardName || ""}::${entry?.text || ""}`;
    const beforeCard = (state.cardTriggerLog || [])[0];
    const beforeCardHead = beforeCard ? cardKey(beforeCard) : "";
    const beforeRuns = state.runs;
    const beforeRunStats = { ...(state.runStats || {}) };
    const countBefore = `${state.balls}-${state.strikes}`;

    state.pitchIntent = intent;
    state.pitchBallPlan = ballPlan;
    const plannedCourse = {
      zone: Number(zone) || 5,
      intent,
      ballPlan,
      targetRow: Number.isFinite(Number(targetRow)) ? Number(targetRow) : null,
      targetCol: Number.isFinite(Number(targetCol)) ? Number(targetCol) : null
    };
    const release = debug.modelReleaseForBot?.(pitch, plannedCourse, bot);
    const result = debug.throwPitch(pitch.id, zone, targetRow, targetCol, release);
    if (!result) return null;

    const afterRunStats = { ...(state.runStats || {}) };
    const afterCardLog = state.cardTriggerLog || [];
    const previousHeadIndex = beforeCardHead ? afterCardLog.findIndex((entry) => cardKey(entry) === beforeCardHead) : -1;
    const cardTriggers = beforeCardHead
      ? previousHeadIndex >= 0
        ? afterCardLog.slice(0, previousHeadIndex)
        : []
      : afterCardLog.slice();

    return {
      stageIndex: state.stageIndex,
      inning: state.inning,
      countBefore,
      balls: state.balls,
      strikes: state.strikes,
      outs: state.outs,
      runs: state.runs,
      runsScored: Math.max(0, state.runs - beforeRuns),
      pitchId: pitch.id,
      pitchName: pitch.name,
      category: pitch.category,
      zone,
      intent,
      result: result.result,
      targetMatch: !!result.targetMatch,
      inZone: !!result.inZone,
      timingLabel: result.timingLabel || "",
      contactQuality: result.contactQuality || 0,
      isRival: !!result.batter?.isRival,
      isBoss: !!result.batter?.isBoss,
      suspicion: Math.round(state.atBat?.suspicion || result.pattern?.suspicion || 0),
      patternExposed: !!result.pattern?.exposed,
      reverseRead: !!result.pattern?.reverseRead,
      ballIntent: result.pattern?.ballIntent || null,
      weaknessSuccess: (afterRunStats.weaknessPitchSuccesses || 0) - (beforeRunStats.weaknessPitchSuccesses || 0),
      statDelta: Object.fromEntries(
        Object.keys(afterRunStats).map((key) => [key, (afterRunStats[key] || 0) - (beforeRunStats[key] || 0)])
      ),
      cardTriggers: cardTriggers.map((entry) => entry.cardName),
      botProfile: bot
    };
  }, botProfile);
}

function stripPitchEvents(runSummary) {
  if (!runSummary) return null;
  const { pitchEvents, ...rest } = runSummary;
  return rest;
}

function summarizeGame(index, seed, events, finalState, errors, transitions = [], balanceRun = null) {
  const runStats = balanceRun?.runStats || finalState.runStats || {};
  const stageResult = finalState.currentStageResult || {};
  const resultCounts = tally(events, "result");
  const cardTriggers = tally(events.flatMap((event) => event.cardTriggers || []).map((name) => ({ name })), "name");
  const pitchCategoryUse = tally(events, "category");
  const samePitchRepeats = events.filter((event, idx) => idx > 0 && event.pitchId === events[idx - 1].pitchId).length;
  const sameCategoryRepeats = events.filter((event, idx) => idx > 0 && event.category === events[idx - 1].category).length;
  const completed = balanceRun ? balanceRun.outcome === "clear" : finalState.gameOver && finalState.resultTitle === "클리어";
  const rewardActions = transitions.filter((action) => action.kind === "reward");

  return {
    index,
    seed,
    completed,
    failed: balanceRun ? balanceRun.outcome === "failed" : finalState.gameOver && !completed,
    stopped: !finalState.gameOver,
    gameOver: finalState.gameOver,
    resultTitle: balanceRun?.resultTitle || finalState.resultTitle,
    outcome: balanceRun?.outcome || (completed ? "clear" : finalState.gameOver ? "failed" : "stopped"),
    stageReached: balanceRun?.stageReached || finalState.stageNumber,
    diedAtStage: balanceRun?.diedAtStage ?? null,
    maxStageCleared: balanceRun?.maxStageCleared ?? null,
    stageIndex: finalState.stageIndex,
    inning: finalState.inning,
    runs: finalState.runs,
    runsAllowed: events.reduce((sum, event) => sum + (event.runsScored || 0), 0),
    pitches: balanceRun?.pitches ?? events.length,
    resultCounts,
    runStats,
    stageStars: stageResult.stars || 0,
    suspicionAverage: stageResult.suspicionAverage || 0,
    rival: finalState.rival,
    ownedCards: balanceRun?.ownedCards || finalState.ownedCards || [],
    rewardActions,
    pitchCategoryUse,
    samePitchRepeats,
    sameCategoryRepeats,
    targetMatches: events.filter((event) => event.targetMatch).length,
    patternExposures: events.filter((event) => event.patternExposed).length,
    reverseReads: events.filter((event) => event.reverseRead).length,
    weaknessSuccesses: events.reduce((sum, event) => sum + (event.weaknessSuccess || 0), 0),
    cardTriggers,
    loss: balanceRun?.loss || null,
    stageClears: balanceRun?.stageClears || [],
    fatalPitch: balanceRun?.fatalPitch || null,
    balanceRun,
    errors
  };
}

async function runGame(browser, baseUrl, options, gameIndex) {
  const gameSeed = options.seed + gameIndex * 7919;
  const { page, errors } = await preparePage(browser, baseUrl, gameSeed, gameIndex, options.bot);
  const events = [];
  const transitions = [];
  const rememberActions = (actions) => {
    transitions.push(
      ...actions.filter((action) => !["ready", "wait", "booting"].includes(action.kind))
    );
  };

  for (let pitchIndex = 0; pitchIndex < options.maxPitches; pitchIndex += 1) {
    rememberActions(await settlePage(page, options.bot));
    const finalCheck = await page.evaluate(() => ({
      gameOver: window.MountPsycho.state.gameOver,
      phase: window.MountPsycho.state.screenPhase
    }));
    if (finalCheck.gameOver) break;

    const event = await throwAutoPitch(page, options.bot);
    if (event) events.push(event);
    await page.waitForTimeout(6);
  }

  rememberActions(await settlePage(page, options.bot));
  const finalState = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const state = MP.state;
    const result = MP.debug.calculateStageResult();
    const balanceRun = MP.getBalanceRunSummary?.() || MP.debug.getBalanceRunSummary?.() || null;
    return {
      gameOver: state.gameOver,
      pendingRunComplete: state.pendingRunComplete,
      stageIndex: state.stageIndex,
      stageNumber: MP.debug.currentStageNumber(),
      inning: state.inning,
      runs: state.runs,
      resultTitle: state.gameOver ? MP.debug.els.resultTitle?.textContent || "" : "",
      runStats: { ...(state.runStats || {}) },
      currentStageResult: result,
      rival: {
        ...(result?.rivalGoalMet != null ? { goalMet: result.rivalGoalMet } : {}),
        ...(state.stageRun?.rival || {})
      },
      ownedCards: MP.debug.ownedRewardCardEntries().map((entry) => ({
        id: entry.card.id,
        name: entry.card.name,
        rarity: entry.card.rarity,
        stack: entry.stack
      })),
      balanceRun
    };
  });

  await page.close();
  return summarizeGame(gameIndex + 1, gameSeed, events, finalState, errors, transitions, finalState.balanceRun);
}

function summarizeRun(options, games) {
  const completeCount = games.filter((game) => game.completed).length;
  const failedCount = games.filter((game) => game.failed).length;
  const stoppedCount = games.filter((game) => game.stopped).length;
  const diedAtStageDistribution = tally(
    games.filter((game) => game.failed).map((game) => ({ stage: game.diedAtStage || game.stageReached })),
    "stage"
  );
  const fatalResultDistribution = tally(
    games
      .filter((game) => game.failed && game.loss?.fatalResult)
      .map((game) => ({ result: game.loss.fatalResult })),
    "result"
  );
  const lossStageDistribution = tally(
    games
      .filter((game) => game.failed && game.loss?.stageName)
      .map((game) => ({ stageName: game.loss.stageName })),
    "stageName"
  );
  const totalPitches = games.reduce((sum, game) => sum + game.pitches, 0);
  const totalStrikeouts = games.reduce((sum, game) => sum + (game.runStats.strikeouts || 0), 0);
  const totalWalks = games.reduce((sum, game) => sum + (game.runStats.walks || 0), 0);
  const totalHits = games.reduce((sum, game) => sum + (game.runStats.hits || 0), 0);
  const totalLongHits = games.reduce((sum, game) => sum + (game.runStats.doubles || 0) + (game.runStats.homeruns || 0), 0);
  const allCardTriggers = games.reduce((items, game) => {
    Object.entries(game.cardTriggers || {}).forEach(([name, count]) => {
      for (let i = 0; i < count; i += 1) items.push({ name });
    });
    return items;
  }, []);
  const allOwnedCards = games.flatMap((game) => game.ownedCards || []).map((card) => ({ name: card.name || card.id }));
  const allRewardActions = games.flatMap((game) => game.rewardActions || []);

  return {
    options,
    games: games.length,
    completeRate: completeCount / games.length,
    failedRate: failedCount / games.length,
    stoppedRate: stoppedCount / games.length,
    stageReachDistribution: tally(games, "stageReached"),
    avgStageReached: average(games.map((game) => game.stageReached)),
    avgPitches: average(games.map((game) => game.pitches)),
    avgRunsAllowed: average(games.map((game) => game.runsAllowed)),
    totalPitches,
    strikeoutRate: totalPitches ? totalStrikeouts / totalPitches : 0,
    walkRate: totalPitches ? totalWalks / totalPitches : 0,
    hitRate: totalPitches ? totalHits / totalPitches : 0,
    longHitRate: totalPitches ? totalLongHits / totalPitches : 0,
    avgStrikeouts: average(games.map((game) => game.runStats.strikeouts || 0)),
    avgWalks: average(games.map((game) => game.runStats.walks || 0)),
    avgHits: average(games.map((game) => game.runStats.hits || 0)),
    avgLongHits: average(games.map((game) => (game.runStats.doubles || 0) + (game.runStats.homeruns || 0))),
    avgPatternExposures: average(games.map((game) => game.patternExposures)),
    avgWeaknessSuccesses: average(games.map((game) => game.weaknessSuccesses)),
    avgOwnedCards: average(games.map((game) => (game.ownedCards || []).reduce((sum, card) => sum + (card.stack || 1), 0))),
    rewardActionKinds: tally(allRewardActions, "rewardKind"),
    totalOwnedCards: tally(allOwnedCards, "name"),
    totalCardTriggers: tally(allCardTriggers, "name"),
    diedAtStageDistribution,
    fatalResultDistribution,
    lossStageDistribution
  };
}

function tuningFlags(summary) {
  const flags = [];
  if (summary.stoppedRate > 0.25) flags.push("최대 투구 수에서 멈춘 판이 많습니다. 판당 최대 투구 수를 늘려 최종 흐름을 다시 확인하세요.");
  else {
    if (summary.completeRate < 0.25) flags.push("클리어율이 낮습니다. 후반 스테이지의 타자 읽기/장타 보정이 과한지 확인하세요.");
    if (summary.completeRate > 0.75) flags.push("클리어율이 높습니다. 보상 누적이나 약점 성공 보정이 너무 강할 수 있습니다.");
    if (summary.failedRate > 0.55) flags.push("초중반 탈락이 많습니다. 루키타선 목표 실점과 초반 보상 효율을 같이 봐야 합니다.");
  }
  if (summary.walkRate > 0.12) flags.push("볼넷 비율이 높습니다. 유인구 성공률 또는 존 밖 판정 부담을 낮출 필요가 있습니다.");
  if (summary.longHitRate > 0.045) flags.push("장타 비율이 높습니다. 반복 패턴, 몰림, 실투 보정이 한꺼번에 세게 들어가는지 확인하세요.");
  if (summary.avgPatternExposures > 18) flags.push("패턴 노출이 많습니다. 같은 구종/같은 코스 판정 기준이 너무 민감할 수 있습니다.");
  if (Object.keys(summary.totalOwnedCards).length === 0) flags.push("보유 카드가 없습니다. 스테이지 보상까지 도달하지 못하거나 보상 처리가 끊겼을 수 있습니다.");
  else if (Object.keys(summary.totalCardTriggers).length === 0) flags.push("카드는 보유했지만 발동 기록이 없습니다. 카드 조건이 너무 좁거나 자동 투구가 조건을 거의 만들지 못한 상태입니다.");
  return flags;
}

function markdownReport(summary, games) {
  const lines = [];
  lines.push("# 마운드 심리전 밸런스 시뮬레이션 리포트");
  lines.push("");
  lines.push(`- 판수: ${summary.games}`);
  lines.push(`- 봇 프로필: ${summary.options.bot || "player"}`);
  lines.push(`- 시드: ${summary.options.seed}`);
  lines.push(`- 판당 최대 투구 수: ${summary.options.maxPitches}`);
  lines.push(`- 최종 클리어율: ${percent(summary.completeRate)}`);
  lines.push(`- 실패율: ${percent(summary.failedRate)}`);
  lines.push(`- 최대 투구 중단율: ${percent(summary.stoppedRate)}`);
  lines.push(`- 평균 도달 스테이지: ${round(summary.avgStageReached, 2)}`);
  lines.push(`- 평균 투구 수: ${round(summary.avgPitches, 1)}`);
  lines.push(`- 평균 총 실점: ${round(summary.avgRunsAllowed, 2)}`);
  lines.push(
    `- 삼진/볼넷/피안타/장타 비율: ${percent(summary.strikeoutRate)} / ${percent(summary.walkRate)} / ${percent(summary.hitRate)} / ${percent(summary.longHitRate)}`
  );
  lines.push(`- 평균 패턴 노출: ${round(summary.avgPatternExposures, 2)}`);
  lines.push(`- 평균 약점 공략 성공: ${round(summary.avgWeaknessSuccesses, 2)}`);
  lines.push(`- 평균 보유 카드: ${round(summary.avgOwnedCards, 2)}`);
  lines.push("");
  lines.push("## 스테이지 도달");
  Object.entries(summary.stageReachDistribution)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([stage, count]) => lines.push(`- Stage ${stage}: ${count}판`));
  lines.push("");
  lines.push("## 패배 스테이지");
  const diedRows = Object.entries(summary.diedAtStageDistribution || {}).sort((a, b) => Number(a[0]) - Number(b[0]));
  if (!diedRows.length) lines.push("- 패배 기록 없음");
  else diedRows.forEach(([stage, count]) => lines.push(`- Stage ${stage}에서 탈락: ${count}판`));
  lines.push("");
  lines.push("## 패배 직전 결과 (fatalResult)");
  const fatalRows = Object.entries(summary.fatalResultDistribution || {}).sort((a, b) => b[1] - a[1]);
  if (!fatalRows.length) lines.push("- 기록 없음");
  else fatalRows.forEach(([result, count]) => lines.push(`- ${result}: ${count}판`));
  lines.push("");
  lines.push("## 패배 스테이지명");
  const lossStageRows = Object.entries(summary.lossStageDistribution || {}).sort((a, b) => b[1] - a[1]);
  if (!lossStageRows.length) lines.push("- 기록 없음");
  else lossStageRows.forEach(([name, count]) => lines.push(`- ${name}: ${count}판`));
  lines.push("");
  lines.push("## 카드 발동");
  const cardRows = Object.entries(summary.totalCardTriggers).sort((a, b) => b[1] - a[1]);
  if (!cardRows.length) lines.push("- 발동 기록 없음");
  else cardRows.forEach(([name, count]) => lines.push(`- ${name}: ${count}`));
  lines.push("");
  lines.push("## 보유 카드");
  const ownedRows = Object.entries(summary.totalOwnedCards).sort((a, b) => b[1] - a[1]);
  if (!ownedRows.length) lines.push("- 보유 카드 없음");
  else ownedRows.forEach(([name, count]) => lines.push(`- ${name}: ${count}`));
  lines.push("");
  lines.push("## 보상 처리");
  const rewardKindRows = Object.entries(summary.rewardActionKinds).sort((a, b) => b[1] - a[1]);
  if (!rewardKindRows.length) lines.push("- 보상 처리 기록 없음");
  else rewardKindRows.forEach(([kind, count]) => lines.push(`- ${kind || "unknown"}: ${count}`));
  lines.push("");
  lines.push("## 개별 판 요약");
  games.forEach((game) => {
    const lossHint = game.loss?.fatalResult ? `, 패배=${game.loss.fatalResult}` : "";
    lines.push(
      `- #${game.index}: ${game.resultTitle || "진행 종료"} · Stage ${game.stageReached}, ${game.pitches}구, 총 실점 ${game.runsAllowed}, 삼진 ${game.runStats.strikeouts || 0}, 볼넷 ${game.runStats.walks || 0}, 피안타 ${game.runStats.hits || 0}, 장타 ${(game.runStats.doubles || 0) + (game.runStats.homeruns || 0)}, 패턴 노출 ${game.patternExposures}${lossHint}`
    );
  });
  lines.push("");
  lines.push("## 조정 체크");
  const flags = tuningFlags(summary);
  if (!flags.length) lines.push("- 큰 이상 신호는 없습니다. 판수를 늘려 다시 확인하세요.");
  else flags.forEach((flag) => lines.push(`- ${flag}`));
  return `${lines.join("\n")}\n`;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const server = await startServer();
  const baseUrl = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true });
  const games = [];

  try {
    for (let index = 0; index < options.games; index += 1) {
      const game = await runGame(browser, baseUrl, options, index);
      games.push(game);
      console.log(
        `#${game.index} Stage ${game.stageReached} / ${game.pitches}구 / 삼진 ${game.runStats.strikeouts || 0} / 볼넷 ${game.runStats.walks || 0} / 피안타 ${game.runStats.hits || 0}`
      );
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const summary = summarizeRun(options, games);
  const reportDir = path.join(root, options.outDir);
  const runsDir = path.join(root, options.runsDir);
  fs.mkdirSync(reportDir, { recursive: true });
  fs.mkdirSync(runsDir, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jsonPath = path.join(reportDir, `balance-${stamp}.json`);
  const mdPath = path.join(reportDir, `balance-${stamp}.md`);
  const runSummaries = games.map((game) => {
    const payload = options.fullLog ? game.balanceRun : stripPitchEvents(game.balanceRun);
    const runPath = path.join(runsDir, `run-${String(game.index).padStart(5, "0")}.json`);
    if (payload) fs.writeFileSync(runPath, JSON.stringify(payload, null, 2), "utf8");
    return payload;
  });
  const gamesForReport = games.map((game) => {
    const { balanceRun, ...rest } = game;
    return rest;
  });
  fs.writeFileSync(
    jsonPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), summary, games: gamesForReport, runSummaries: runSummaries.filter(Boolean) }, null, 2),
    "utf8"
  );
  fs.writeFileSync(mdPath, markdownReport(summary, gamesForReport), "utf8");
  fs.writeFileSync(
    path.join(runsDir, "_manifest.json"),
    JSON.stringify(
      { generatedAt: new Date().toISOString(), stamp, games: options.games, seed: options.seed, bot: options.bot, fullLog: options.fullLog },
      null,
      2
    ),
    "utf8"
  );

  console.log("");
  console.log(`JSON: ${jsonPath}`);
  console.log(`MD: ${mdPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
