import { test, expect } from "@playwright/test";

async function startFromTitle(page) {
  await page.goto("/");
  await expect(page.locator("#titleOverlay")).toBeVisible();
  await expect(page.locator("#titleStartButton")).toContainText("새 RUN");
  await expect(page.locator(".title-privacy-link")).toHaveAttribute("href", "docs/privacy-policy.html");
  await expect(page.locator(".title-screen-actions > button").first()).toHaveAttribute("id", "titleStartButton");
  await page.locator("#titleStartButton").click();
  await expect(page.locator("#titleOverlay")).toBeHidden();
  await expect(page.locator("#pitcherSelectOverlay")).toBeVisible();
}

async function chooseFirstPitcher(page) {
  await startFromTitle(page);
  await page.locator(".pitcher-choice-card").first().click();
  await page.locator("#pitcherChoiceConfirm").click();
  await expect(page.locator("#pitcherSelectOverlay")).toBeHidden();
  await expect(page.locator("#stageOverlay")).toBeVisible();
  await page.locator("#stageStartButton").click();
  await expect(page.locator("#stageOverlay")).toBeHidden();
  if (await page.locator("#dugoutOverlay").isVisible()) {
    await page.locator(".dugout-choice-card").first().click();
    if (await page.locator("[data-dugout-continue]").isVisible()) {
      await page.locator("[data-dugout-continue]").click();
    }
    await expect(page.locator("#dugoutOverlay")).toBeHidden();
  }
}

async function chooseMobilePitchAndZone(page) {
  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  const zone = page.locator("#mobileStrikeZone");
  const box = await zone.boundingBox();
  await zone.click({ position: { x: box.width * 0.56, y: box.height * 0.44 } });
  await expect(zone.locator(".release-aim-target.show")).toBeVisible();
  await expect(page.locator("#mobileReleasePanel")).toBeHidden();
}

test("boots to title and pitcher select", async ({ page }) => {
  await page.goto("/");
  const boot = await page.evaluate(() => ({
    hasState: Boolean(window.MountPsycho?.state),
    hasEls: Boolean(window.MountPsycho?.els),
    screenPhase: window.MountPsycho?.state?.screenPhase ?? ""
  }));
  expect(boot).toEqual({ hasState: true, hasEls: true, screenPhase: "title" });

  await startFromTitle(page);
  await expect(page.locator(".pitcher-choice-card")).toHaveCount(3);
  await expect(page.locator("#pitcherSelectOverlay")).toContainText("선발 투수 선택");
  const landscapePitcherUi = await page.evaluate(() => ({
    width: document.querySelector(".pitcher-select-box").getBoundingClientRect().width,
    columns: getComputedStyle(document.querySelector(".pitcher-choice-list")).gridTemplateColumns.split(" ").length,
    cardRadius: getComputedStyle(document.querySelector(".pitcher-choice-card")).borderRadius
  }));
  expect(landscapePitcherUi.width).toBeGreaterThan(380);
  expect(landscapePitcherUi.columns).toBe(1);
  expect(landscapePitcherUi.cardRadius).toBe("0px");
  await expect(page.locator("#pitcherChoiceConfirm")).toBeDisabled();
  await page.locator(".pitcher-choice-card").first().click();
  await expect(page.locator(".pitcher-choice-card").first()).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#pitcherChoiceConfirm")).toBeEnabled();
});

test("ball edge touching the zone is a strike while a clear miss is a ball", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const check = window.MountPsycho.debug.isStrikeZonePoint;
    return {
      inside: check(0.5, 0.5),
      edge: check(0.065, 0.5),
      outside: check(0.06, 0.5),
      cornerMiss: check(0.075, 0.075)
    };
  });
  expect(result).toEqual({ inside: true, edge: true, outside: false, cornerMiss: false });
});

test("title tutorial explains the four core rules", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#titleTutorialButton").click();
  await expect(page.locator("#tutorialOverlay")).toBeVisible();
  await expect(page.locator("#tutorialProgress")).toHaveText("1 / 4");
  for (let index = 0; index < 3; index += 1) await page.locator("#tutorialNextButton").click();
  await expect(page.locator("#tutorialProgress")).toHaveText("4 / 4");
  await expect(page.locator("#tutorialTitle")).toContainText("승부기록은 다음 공의 힌트");
  await expect(page.locator("#tutorialNextButton")).toHaveText("튜토리얼 완료");
});

test("android back closes transient screens before exiting", async ({ page }) => {
  await page.goto("/");
  expect(await page.evaluate(() => window.MountPsycho.handleAndroidBack())).toBe(false);

  await page.locator("#titleTutorialButton").click();
  expect(await page.evaluate(() => window.MountPsycho.handleAndroidBack())).toBe(true);
  await expect(page.locator("#tutorialOverlay")).toBeHidden();
  await expect(page.locator("#titleOverlay")).toBeVisible();

  await page.locator("#titleClubhouseButton").click();
  await expect(page.locator("#clubhouseOverlay")).toBeVisible();
  expect(await page.evaluate(() => window.MountPsycho.handleAndroidBack())).toBe(true);
  await expect(page.locator("#clubhouseOverlay")).toBeHidden();

  await startFromTitle(page);
  expect(await page.evaluate(() => window.MountPsycho.handleAndroidBack())).toBe(true);
  await expect(page.locator("#pitcherSelectOverlay")).toBeHidden();
  await expect(page.locator("#titleOverlay")).toBeVisible();
});

test("game flow runs at 1.3x while pitch result toasts stay at three seconds", async ({ page }) => {
  await page.goto("/");
  const timing = await page.evaluate(() => window.MountPsycho.GAME_TIMING);
  expect(timing.autoAdvanceDefault).toBe(Math.round(650 / 1.3));
  expect(timing.inningChangeOverlay).toBe(Math.round(1700 / 1.3));
  expect(timing.pitchResultToast).toBe(3000);
});

test("title screen uses the retro comic background and pitcher cards stay readable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await expect(page.locator("#titleOverlay")).toBeVisible();

  const title = await page.evaluate(() => {
    const inner = getComputedStyle(document.querySelector(".title-screen-inner"));
    const actions = getComputedStyle(document.querySelector(".title-screen-actions"));
    const rect = document.querySelector(".title-screen-inner").getBoundingClientRect();
    return {
      backgroundImage: inner.backgroundImage,
      actionDirection: actions.flexDirection,
      coversViewport:
        rect.left <= 1 &&
        rect.top <= 1 &&
        rect.right >= window.innerWidth - 1 &&
        rect.bottom >= window.innerHeight - 1
    };
  });
  expect(title.backgroundImage).toContain("main-title-background-v2.png");
  expect(title.actionDirection).toBe("column");
  expect(title.coversViewport).toBe(true);

  await page.locator("#titleStartButton").click();
  await expect(page.locator("#pitcherSelectOverlay")).toBeVisible();
  const pitcherSelect = await page.locator(".pitcher-choice-card").first().evaluate((card) => {
    const color = getComputedStyle(card).color.match(/\d+/g).map(Number);
    return {
      lightText: color.slice(0, 3).reduce((sum, value) => sum + value, 0) > 560,
      stats: [...card.querySelectorAll(".choice-stat")].map((row) => row.textContent.trim()),
      statBars: card.querySelectorAll(".choice-stat i").length,
      pitchBadges: card.querySelectorAll(".choice-pitch").length
    };
  });
  expect(pitcherSelect.lightText).toBe(false);
  expect(pitcherSelect.stats).toHaveLength(3);
  expect(pitcherSelect.stats.every((stat) => /\d+/.test(stat))).toBe(true);
  expect(pitcherSelect.statBars).toBe(0);
  expect(pitcherSelect.pitchBadges).toBeGreaterThanOrEqual(2);
  await expect(page.locator("#pitcherSelectOverlay")).not.toHaveClass(/is-revealing/);
  const wrapping = await page.locator(".pitcher-choice-card").first().evaluate((card) => ({
    label: card.querySelector(".choice-number").getBoundingClientRect().width,
    name: card.querySelector("strong").getBoundingClientRect().width,
    style: card.querySelector(".choice-style").getBoundingClientRect().width
  }));
  expect(wrapping.label).toBeGreaterThan(50);
  expect(wrapping.name).toBeGreaterThan(40);
  expect(wrapping.style).toBeGreaterThan(50);
});

test("stage intro presents the briefing before its primary start button", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await startFromTitle(page);
  await page.locator(".pitcher-choice-card").first().click();
  await page.locator("#pitcherChoiceConfirm").click();

  await expect(page.locator("#stageOverlay")).toHaveClass(/is-stage-intro/);
  await expect(page.locator("#stageTitle")).toContainText("STAGE 1");
  await expect(page.locator("#stageThemePanel")).toContainText(/타선 성향|라이벌|경기 브리핑|목표|주의/);
  const layout = await page.evaluate(() => {
    const box = document.querySelector(".stage-overlay-box").getBoundingClientRect();
    const briefing = document.querySelector(".stage-briefing").getBoundingClientRect();
    const button = document.querySelector("#stageStartButton").getBoundingClientRect();
    return {
      fits: box.left >= 0 && box.right <= innerWidth && box.bottom <= innerHeight,
      buttonGap: Math.round(button.top - briefing.bottom),
      buttonWidth: Math.round(button.width),
      boxWidth: Math.round(box.width)
    };
  });
  expect(layout.fits).toBe(true);
  expect(layout.buttonGap).toBeLessThanOrEqual(24);
  expect(layout.buttonWidth).toBeGreaterThan(layout.boxWidth * 0.85);
});

test("mobile header separates count strip from mission and opens menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  const header = await page.evaluate(() => {
    const count = document.querySelector(".mobile-count-strip").getBoundingClientRect();
    const mission = document.querySelector("#mobileMissionCard").getBoundingClientRect();
    return {
      missionBelowCount: mission.top >= count.bottom - 1,
      countVisible: count.width > 0 && count.height > 0,
      missionVisible: mission.width > 0 && mission.height > 0
    };
  });
  expect(header).toEqual({ missionBelowCount: false, countVisible: true, missionVisible: true });

  await page.locator("#mobileNewGameButton").click();
  await expect(page.locator("#mobileMenuPanel")).toBeVisible();
  const sfxButton = page.locator("[data-mobile-menu-sfx]");
  const bgmButton = page.locator("[data-mobile-menu-bgm]");
  await expect(bgmButton).toHaveText("BGM 끄기");
  await bgmButton.click();
  await expect(bgmButton).toHaveText("BGM 켜기");
  await expect(bgmButton).toHaveAttribute("aria-pressed", "false");
  await bgmButton.click();
  await expect(bgmButton).toHaveText("BGM 끄기");
  await expect(bgmButton).toHaveAttribute("aria-pressed", "true");
  await expect(sfxButton).toHaveText("효과음 끄기");
  await sfxButton.click();
  await expect(sfxButton).toHaveText("효과음 켜기");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mount-psycho-audio-v1")).sfxMuted)).toBe(true);
  await sfxButton.click();
  await expect(page.locator("[data-mobile-menu-new-game]")).toContainText("새게임 시작");

  page.once("dialog", (dialog) => dialog.accept());
  await page.locator("[data-mobile-menu-new-game]").click();
  await expect(page.locator("#mobileMenuPanel")).toBeHidden();
  await expect(page.locator("#pitcherSelectOverlay")).toBeVisible();
});

test("audio variants avoid immediate repeats and edited files replace originals", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const { audioPaths, pickEffectPath } = window.MountPsycho.debug;
    const ball = Array.from({ length: 12 }, () => pickEffectPath("ball"));
    return {
      ball,
      edited: {
        course: audioPaths.courseSelect,
        release: audioPaths.release,
        offspeed: audioPaths.offspeed,
        breaking: audioPaths.breaking
      }
    };
  });

  expect(result.ball.every((path, index) => index === 0 || path !== result.ball[index - 1])).toBe(true);
  expect(result.edited).toEqual({
    course: "assets/audio/코스선택_편집.mp3",
    release: "assets/audio/릴리즈_편집.mp3",
    offspeed: "assets/audio/느린공_편집.mp3",
    breaking: "assets/audio/변화구_편집.mp3"
  });

});
test("stage missions stay inside playable innings", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    return Array.from({ length: 12 }, (_, stageIndex) => {
      const config = MP.debug.stageConfig(stageIndex);
      return {
        name: config.name,
        innings: config.innings,
        missionInnings: config.missions.map((mission) => mission.inning)
      };
    });
  });

  for (const stage of result) {
    expect(stage.missionInnings.every((inning) => inning >= 1 && inning <= stage.innings)).toBe(true);
  }
});

test("12 stages map to four three-inning games and the planned reward schedule", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const debug = window.MountPsycho.debug;
    return Array.from({ length: 12 }, (_, stageIndex) => {
      window.MountPsycho.state.stageIndex = stageIndex;
      return {
        stage: debug.currentStageNumber(),
        game: debug.currentGameNumber(),
        inning: debug.currentGameInning(),
        reward: debug.stageRewardKind(stageIndex)
      };
    });
  });

  expect(result.map(({ game, inning }) => `${game}-${inning}`)).toEqual([
    "1-1", "1-2", "1-3",
    "2-1", "2-2", "2-3",
    "3-1", "3-2", "3-3",
    "4-1", "4-2", "4-3"
  ]);
  expect(result.map(({ reward }) => reward)).toEqual([
    "stageCard", "stageCard", "stageCard",
    "stageCard", "stageCard", "stageCard",
    "stageCard", "stageCard", "stageCard",
    "stageCard", "stageCard", "settlement"
  ]);
});

test("planned tag rewards contain 36 explicit evolutions and 24 core-centered cards", async ({ page }) => {
  await page.goto("/");
  const catalog = await page.evaluate(() => {
    const debug = window.MountPsycho.debug;
    return {
      evolutionCount: debug.plannedCoreEvolutionCatalog.length,
      evolutionNames: debug.plannedCoreEvolutionCatalog.map((item) => item.name),
      evolutionGroups: Object.fromEntries([...new Set(debug.plannedCoreEvolutionCatalog.map((item) => item.coreTagId))].map((id) => [id, debug.plannedCoreEvolutionCatalog.filter((item) => item.coreTagId === id).length])),
      rewardCount: debug.tagRewardCardCatalog.length,
      commonCount: debug.tagRewardCardCatalog.filter((item) => item.rarity === "common").length,
      comboCount: debug.tagRewardCardCatalog.filter((item) => item.combo).length,
      effectful: debug.plannedCoreEvolutionCatalog.every((item) => Object.keys(item.effects || {}).length > 0)
    };
  });
  expect(catalog.evolutionCount).toBe(36);
  expect(new Set(catalog.evolutionNames).size).toBe(36);
  expect(Object.values(catalog.evolutionGroups).every((count) => count === 3)).toBe(true);
  expect(catalog.rewardCount).toBe(24);
  expect(catalog.commonCount).toBe(12);
  expect(catalog.comboCount).toBe(12);
  expect(catalog.effectful).toBe(true);
});

test("stage transitions preserve game state and game transitions reset it", async ({ page }) => {
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const firstLineup = MP.state.lineup.map((batter) => batter.name);
    MP.state.runs = 2;
    MP.state.batterIndex = 4;
    MP.state.patternMemory.pitches = [{ category: "fast", memoryWeight: 1 }];
    MP.debug.advanceStage(MP.state.stageThemeId);
    const sameGame = {
      game: MP.debug.currentGameNumber(),
      inning: MP.state.inning,
      runs: MP.state.runs,
      batterIndex: MP.state.batterIndex,
      lineup: MP.state.lineup.map((batter) => batter.name),
      memory: MP.state.patternMemory.pitches.length
    };
    MP.debug.advanceStage(MP.state.stageThemeId);
    MP.debug.advanceStage(MP.state.stageThemeId);
    return {
      firstLineup,
      sameGame,
      newGame: {
        game: MP.debug.currentGameNumber(),
        inning: MP.state.inning,
        runs: MP.state.runs,
        batterIndex: MP.state.batterIndex,
        lineup: MP.state.lineup.map((batter) => batter.name),
        memory: MP.state.patternMemory.pitches.length
      }
    };
  });

  expect(result.sameGame).toMatchObject({ game: 1, inning: 2, runs: 2, batterIndex: 5, memory: 1 });
  expect(result.sameGame.lineup).toEqual(result.firstLineup);
  expect(result.newGame).toMatchObject({ game: 2, inning: 1, runs: 0, batterIndex: 0, memory: 0 });
  expect(result.newGame.lineup).not.toEqual(result.firstLineup);
});

test("natural S1 reward continues to S2 without resetting game state", async ({ page }) => {
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.runs = 2;
    MP.state.batterIndex = 4;
    MP.state.outs = 2;
    MP.debug.addOut();
    MP.debug.finishAtBat("STRIKE OUT!", "S1 종료");
  });
  await expect(page.locator("#rewardOverlay")).toBeVisible({ timeout: 3000 });
  await page.waitForTimeout(1300);
  const rewardCard = page.locator("#rewardChoiceList .reward-choice-card").first();
  await rewardCard.click();
  await expect(rewardCard).toHaveClass(/is-selected/);
  await expect(page.locator("#rewardChoiceConfirm")).toBeEnabled();
  await expect(page.locator("#rewardOverlay")).toBeVisible();
  await page.locator("#rewardChoiceConfirm").click();
  await expect(page.locator("#stageOverlay")).toBeVisible({ timeout: 3000 });
  const state = await page.evaluate(() => ({
    stageIndex: window.MountPsycho.state.stageIndex,
    game: window.MountPsycho.debug.currentGameNumber(),
    inning: window.MountPsycho.state.inning,
    runs: window.MountPsycho.state.runs,
    batterIndex: window.MountPsycho.state.batterIndex,
    hasAtBat: !!window.MountPsycho.state.atBat
  }));
  expect(state).toEqual({ stageIndex: 1, game: 1, inning: 2, runs: 2, batterIndex: 5, hasAtBat: false });

  await page.locator("#stageStartButton").click();
  await expect(page.locator("#dugoutOverlay")).toBeVisible();
  await page.waitForTimeout(1300);
  await page.locator("[data-dugout-index='0']").click();
  await page.locator("[data-dugout-continue]").click();
  const resumed = await page.evaluate(() => ({
    batterIndex: window.MountPsycho.state.batterIndex,
    atBatBatterIndex: window.MountPsycho.state.currentAtBatMeta?.batterIndex
  }));
  expect(resumed).toEqual({ batterIndex: 5, atBatBatterIndex: 5 });
});

test("stage checkpoint resumes with the same generated reward choices", async ({ page }) => {
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.runs = 2;
    MP.state.outs = 2;
    MP.debug.addOut();
    MP.debug.finishAtBat("STRIKE OUT!", "체크포인트 테스트");
  });
  await expect(page.locator("#rewardOverlay")).toBeVisible({ timeout: 3000 });
  const beforeReload = await page.evaluate(() => ({
    stageIndex: window.MountPsycho.state.stageIndex,
    rewards: window.MountPsycho.state.rewardChoices.map((reward) => reward.title)
  }));

  await page.reload();
  await expect(page.locator("#titleContinueButton")).toBeVisible();
  await page.locator("#titleContinueButton").click();
  await expect(page.locator("#rewardOverlay")).toBeVisible();
  const afterReload = await page.evaluate(() => ({
    stageIndex: window.MountPsycho.state.stageIndex,
    rewards: window.MountPsycho.state.rewardChoices.map((reward) => reward.title)
  }));
  expect(afterReload).toEqual(beforeReload);
});

test("CP settlement follows the four game milestone table", async ({ page }) => {
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const values = [
      [2, true, false],
      [5, true, false],
      [8, true, false],
      [11, true, true]
    ].map(([stageIndex, completed, won]) => {
      MP.state.stageIndex = stageIndex;
      MP.state.stageRun.stageIndex = stageIndex;
      MP.state.stageRun.completed = completed;
      return MP.debug.calculateRunCp(won);
    });
    MP.state.stageIndex = 2;
    MP.state.stageRun.stageIndex = 2;
    MP.state.stageRun.completed = true;
    MP.state.runCpAwarded = 0;
    MP.debug.writeClubhouseProfile({ cp: 0, owned: [], equipped: [], equipmentLimit: 5 });
    MP.debug.settleRunCp(false);
    MP.debug.settleRunCp(false);
    return { values, savedCp: MP.debug.readClubhouseProfile().cp };
  });
  expect(result).toEqual({ values: [4, 9, 15, 26], savedCp: 4 });
});

test("run result uses live stats and the last recorded pitch", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.runs = 1;
    MP.state.runStats.strikeouts = 4;
    MP.state.runStats.hits = 2;
    MP.state.runStats.rewards = 3;
    MP.state.mobilePitchRecords.unshift({
      no: 7,
      pitch: "커터",
      zone: "몸쪽 낮게",
      outcome: "삼진",
      result: "swingingStrike"
    });
    MP.debug.endGame(true, "테스트 승리.");
  });
  await expect(page.locator("#resultOverlay")).toBeVisible();
  await expect(page.locator("#resultOverlay")).toHaveClass(/is-win/);
  await expect(page.locator("#resultTitle")).toHaveText("승리!");
  await expect(page.locator("#resultMessage .result-summary > span")).toHaveCount(4);
  await expect(page.locator("#resultMessage .result-last-pitch")).toContainText(/커터|몸쪽 낮게|삼진/);
  await expect(page.locator("#resultMessage .result-earned")).toContainText(/획득 보상|선택한 보상|CP/);
});

test("clubhouse sells and equips the 30-item catalog with CP", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => window.MountPsycho.debug.writeClubhouseProfile({ cp: 4, owned: [], equipped: { mound: null, tactical: null } }));
  await page.locator("#titleClubhouseButton").click();
  await expect(page.locator("#clubhouseOverlay")).toBeVisible();
  await expect(page.locator("#clubhouseCatalog .clubhouse-bingo-cell")).toHaveCount(30);
  await expect(page.locator('[data-clubhouse-item="sequence_board"] strong')).toHaveText("피치 시퀀스 보드");
  const clippedEquipmentNames = await page.locator(".clubhouse-bingo-cell strong").evaluateAll((names) =>
    names.filter((name) => name.scrollHeight > name.clientHeight + 1).map((name) => name.textContent?.trim()),
  );
  expect(clippedEquipmentNames).toEqual([]);
  await expect(page.locator("#clubhouseCatalog .clubhouse-item-detail")).toHaveCount(0);
  await expect(page.locator("#clubhouseCatalog .clubhouse-equipment-icon").first()).toHaveCSS("background-image", /equipment-icons-sheet-v3/);
  await expect(page.locator("#clubhouseCatalog .clubhouse-equipment-icon").first()).toHaveCSS("background-size", "500% 600%");
  const bingoColumns = await page.locator(".clubhouse-bingo-grid").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length);
  expect(bingoColumns).toBe(3);
  const firstCardSize = await page.locator(".clubhouse-bingo-cell").first().boundingBox();
  expect(Math.abs(firstCardSize.width - firstCardSize.height)).toBeLessThan(1);
  await expect(page.locator("#clubhouseCp")).toContainText("4 CP");
  await expect(page.locator(".clubhouse-bingo-cell.is-selected")).toHaveCount(0);
  await expect(page.locator(".clubhouse-item-empty")).toBeVisible();
  await page.locator('[data-clubhouse-item="rosin_bag"]').click();
  await expect(page.locator("#clubhouseCatalog .clubhouse-item-detail")).toHaveCount(1);
  await page.locator('[data-equipment-id="rosin_bag"]').click();
  await expect(page.locator("#clubhouseCp")).toContainText("1 CP");
  await expect(page.locator('[data-equipment-id="rosin_bag"]')).toContainText("장착 해제");
  await expect(page.locator('[data-clubhouse-item="rosin_bag"]')).toHaveCSS("background-color", "rgb(220, 235, 215)");
  expect(await page.locator('[data-clubhouse-item="rosin_bag"]').evaluate((cell) => getComputedStyle(cell, "::after").content)).toBe('"장착중"');
  await page.locator("#clubhouseClose").click();
  await page.locator("#titleStartButton").click();
  await page.locator(".pitcher-choice-card").first().click();
  await page.locator("#pitcherChoiceConfirm").click();
  const state = await page.evaluate(() => ({
    cp: window.MountPsycho.debug.readClubhouseProfile().cp,
    equipment: window.MountPsycho.state.runEquipment
  }));
  expect(state).toEqual({ cp: 1, equipment: ["rosin_bag"] });
});

test("clubhouse enforces equipment CP and mutually exclusive shifts", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const debug = window.MountPsycho.debug;
    debug.writeClubhouseProfile({ cp: 0, owned: ["infield_shift", "outfield_position"], equipped: [], equipmentLimit: 9 });
    debug.openClubhouse();
  });
  await page.locator('[data-clubhouse-item="infield_shift"]').click();
  await page.locator('[data-equipment-id="infield_shift"]').click();
  await page.locator('[data-clubhouse-item="outfield_position"]').click();
  await expect(page.locator('[data-equipment-id="outfield_position"]')).toBeDisabled();
  await expect(page.locator('[data-equipment-id="outfield_position"]')).toContainText("상충 장비 장착 중");

  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.debug.writeClubhouseProfile({ cp: 0, owned: ["rosin_bag", "pitching_spikes"], equipped: ["rosin_bag"], equipmentLimit: 5 });
    MP.debug.openClubhouse();
  });
  await page.locator('[data-clubhouse-item="pitching_spikes"]').click();
  await expect(page.locator('[data-equipment-id="pitching_spikes"]')).toBeDisabled();
  await expect(page.locator('[data-equipment-id="pitching_spikes"]')).toContainText("장착 한도 부족");

  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.runEquipment = ["rosin_bag"];
    const unlocked = MP.debug.unlockEquipmentLimitForGame(1);
    return {
      unlocked,
      limit: MP.debug.readClubhouseProfile().equipmentLimit,
      runEquipment: MP.state.runEquipment
    };
  });
  expect(result).toEqual({ unlocked: 9, limit: 9, runEquipment: ["rosin_bag"] });
  await page.evaluate(() => window.MountPsycho.debug.openClubhouse());
  await page.locator('[data-clubhouse-item="pitching_spikes"]').click();
  await page.locator('[data-equipment-id="pitching_spikes"]').click();
  await expect(page.locator("#clubhouseEquipped")).toContainText("7 / 9 CP");
});

test("defensive positioning equipment converts qualifying hits half the time", async ({ page }) => {
  await chooseFirstPitcher(page);
  const results = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const base = {
      contactQuality: 60,
      batter: {},
      pitch: { id: "four", category: "fast" },
      location: { row: 2, col: 1, centerMistake: false },
      special: {},
      timingLabel: "정타",
      timingValue: 0.5
    };
    MP.state.runEquipment = ["infield_shift"];
    const originalRandom = Math.random;
    Math.random = () => 0.49;
    const converted = MP.debug.makeBallInPlayResult(base).result;
    Math.random = () => 0.51;
    const normal = MP.debug.makeBallInPlayResult(base).result;
    Math.random = originalRandom;
    return { converted, normal };
  });
  expect(results).toEqual({ converted: "inPlayOut", normal: "single" });
});

test("multiple setup equipment is configured in sequence before the run", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.MountPsycho.debug.writeClubhouseProfile({
    cp: 0,
    owned: ["sequence_board", "dugout_tactics"],
    equipped: ["sequence_board", "dugout_tactics"],
    equipmentLimit: 13
  }));
  await page.locator("#titleStartButton").click();
  await page.locator(".pitcher-choice-card").first().click();
  await page.locator("#pitcherChoiceConfirm").click();

  await expect(page.locator("#equipmentSetupTitle")).toHaveText("피치 시퀀스 보드");
  await page.locator("#equipmentSetupConfirm").click();
  await expect(page.locator("#equipmentSetupTitle")).toHaveText("더그아웃 전술 보드");
  await page.locator("#equipmentSetupConfirm").click();
  await expect(page.locator("#equipmentSetupOverlay")).toBeHidden();
  await expect(page.locator("#stageOverlay")).toBeVisible();
});

test("equipment intel stays visible and tied recovery lets the player choose", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.runEquipment = ["lineup_card", "massage_gun"];
    MP.state.pitcher.repertoire.forEach((pitch, index) => { pitch.burden = index < 2 ? 50 : 20; });
    MP.debug.render();
    return {
      intel: MP.debug.equipmentIntelSummary(),
    };
  });
  expect(result.intel.title).toBe("라인업");
  await expect(page.locator("#mobileEquipmentIntel")).toBeVisible();
  const choices = await page.evaluate(() => {
    window.MountPsycho.debug.applyEquipmentRecovery("massage", { amount: 12 });
    return [...document.querySelectorAll('#equipmentSetupControls select option')].map((option) => option.value);
  });
  expect(choices).toHaveLength(2);
  await expect(page.locator("#equipmentSetupOverlay")).toBeVisible();
  await page.locator('#equipmentSetupControls select').selectOption(choices[1]);
  await page.locator('#equipmentSetupConfirm').click();
  const burdens = await page.evaluate(() => window.MountPsycho.state.pitcher.repertoire.slice(0, 2).map((pitch) => pitch.burden));
  expect(burdens).toEqual([50, 38]);
});

test("release target can resume the previous cursor direction", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const debug = window.MountPsycho.debug;
    const challenge = { startedAt: 0, duration: 1000, startReverse: true };
    return {
      position: debug.releaseCursorPosition(challenge, 100),
      direction: debug.releaseCursorDirection(challenge, 100)
    };
  });
  expect(result.position).toBeCloseTo(0.8, 5);
  expect(result.direction).toBe("reverse");
});

test("missing fine target keeps the selected strike-zone course", async ({ page }) => {
  await page.goto("/");
  const course = await page.evaluate(() => window.MountPsycho.debug.intendedCourse(5, "strike", null, null, null, null));
  expect(course).toMatchObject({ row: 1, col: 1, x: 0.5, y: 0.5 });
});

test("uses mobile shell as the main game screen on wide and narrow viewports", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1280, height: 800 }
  ]) {
    await page.setViewportSize(viewport);
    await chooseFirstPitcher(page);

    await expect(page.locator("body")).toHaveClass(/mobile-portrait/);
    await expect(page.locator("body > .app-shell")).toBeHidden();
    await expect(page.locator("#mobileGameShell")).toBeVisible();
    await expect(page.locator("#mobileMissionCard")).toBeVisible();
    await expect(page.locator("#mobileStrikeZone")).toBeVisible();

    const strikeZoneRatio = await page.locator("#mobileStrikeZone").evaluate((zone) => {
      const rect = zone.getBoundingClientRect();
      return rect.width / rect.height;
    });
    expect(strikeZoneRatio).toBeCloseTo(1, 1);

    const layout = await page.evaluate(() => {
      const shell = document.querySelector("#mobileGameShell").getBoundingClientRect();
      const parts = [".mobile-game-header", ".mobile-field-scene", ".mobile-mid-panel"]
        .map((selector) => document.querySelector(selector).getBoundingClientRect());
      const log = document.querySelector(".mobile-recent-log-card").getBoundingClientRect();
      const playerCard = document.querySelector(".mobile-player-card").getBoundingClientRect();
      return {
        shellVisible: shell.width > 0 && shell.height > 0,
        shellFits: shell.left >= 0 && shell.right <= innerWidth && shell.top >= 0 && shell.bottom <= innerHeight,
        shellWidth: Math.round(shell.width),
        centered: Math.abs(shell.left + shell.width / 2 - innerWidth / 2) <= 1,
        logHeight: Math.round(log.height),
        playerCardHeight: Math.round(playerCard.height),
        ordered: parts.every((rect, index) => index === 0 || rect.top >= parts[index - 1].bottom - 1)
      };
    });
    expect(layout.shellVisible).toBe(true);
    expect(layout.shellFits).toBe(true);
    expect(layout.centered).toBe(true);
    expect(layout.shellWidth).toBe(viewport.width > 760 ? 430 : viewport.width);
    expect(layout.logHeight).toBeGreaterThan(100);
    expect(layout.playerCardHeight).toBe(77);
    expect(layout.ordered).toBe(true);
  }
});

test("mobile pitch controls start circular release timing at the touched course", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  const mobilePitchCount = await page.evaluate(() => Math.min(5, window.MountPsycho.state.pitcher.repertoire.length));
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button")).toHaveCount(mobilePitchCount);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button > b")).toHaveCount(0);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button").first()).toHaveAttribute("data-burden", /stable|warn|danger/);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-category")).toHaveCount(mobilePitchCount);
  const pitchCategories = await page.locator("#mobilePitchButtons .mobile-pitch-category").allTextContents();
  expect(pitchCategories.every((label) => ["강속구", "변화구", "느린공"].includes(label))).toBe(true);
  await expect(page.locator(".mobile-suspicion-row")).toHaveCount(0);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button[data-pitch-category]")).toHaveCount(mobilePitchCount);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-category").first()).toBeVisible();
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button > small")).toHaveCount(0);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-fatigue")).toHaveCount(mobilePitchCount);

  await expect(page.locator(".mobile-duel-read-card")).not.toContainText(/추천|예측/);
  await expect(page.locator("#mobileDuelReadRisk")).toHaveText(/안정|경계|위험/);
  await expect(page.locator("#mobileReleasePanel")).toBeHidden();
  await expect(page.locator("#mobileStrikeZone .zone-grid-cell")).toHaveCount(0);
  await expect(page.locator("#mobileStrikeZone .strike-zone-boundary")).toHaveCount(1);
  await expect(page.locator("#mobileStrikeZone")).toHaveCSS("border-top-width", "3px");
  const zoneGuide = await page.locator("#mobileStrikeZone").evaluate((zone) => {
    const boundary = zone.querySelector(".strike-zone-boundary");
    return {
      ratio: boundary.getBoundingClientRect().width / zone.getBoundingClientRect().width,
      gradients: (getComputedStyle(boundary).backgroundImage.match(/linear-gradient/g) || []).length
    };
  });
  expect(zoneGuide.ratio).toBeCloseTo(0.7, 1);
  expect(zoneGuide.gradients).toBe(2);

  await page.evaluate(() => {
    window.MountPsycho.state.pitcher.stats.제구 = 40;
  });

  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  await expect(page.locator("#mobileStrikeZone .release-aim-target.show")).toHaveCount(0);
  await chooseMobilePitchAndZone(page);
  const target = await page.locator("#mobileStrikeZone .release-aim-target.show").evaluate((element) => ({
    x: element.style.getPropertyValue("--aim-x"),
    y: element.style.getPropertyValue("--aim-y"),
    shake: parseFloat(element.style.getPropertyValue("--aim-shake")),
    targetAnimation: getComputedStyle(element).animationName,
    ringAnimation: getComputedStyle(element.querySelector(".release-aim-ring")).animationName,
    ringScale: parseFloat(element.querySelector(".release-aim-ring").style.getPropertyValue("--release-ring-scale"))
  }));
  expect(parseFloat(target.x)).toBeGreaterThan(50);
  expect(parseFloat(target.y)).toBeLessThan(50);
  expect(target.shake).toBeGreaterThanOrEqual(1);
  expect(target.targetAnimation).toBe("releaseAimShake");
  expect(target.ringAnimation).toBe("none");
  expect(target.ringScale).toBeGreaterThanOrEqual(0.5);
  expect(target.ringScale).toBeLessThanOrEqual(1.4);
});

test("both visible strike-zone edges keep the correct inside and outside labels", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    window.MountPsycho.debug.currentBatter().bats = "R";
    Math.random = () => 0;
  });
  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  const zone = page.locator("#mobileStrikeZone");
  const box = await zone.boundingBox();
  await zone.click({ position: { x: box.width * 0.85, y: box.height * 0.5 } });
  const inside = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.releaseTiming.startedAt = Date.now() - MP.state.releaseTiming.duration / 4;
    MP.debug.finishReleaseTiming(true);
    return { inZone: MP.state.lastLocation.inZone, label: MP.state.lastLocation.actualLabel };
  });
  expect(inside).toEqual({ inZone: true, label: "몸쪽" });

  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  await zone.click({ position: { x: box.width * 0.15, y: box.height * 0.5 } });
  const outside = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.releaseTiming.startedAt = Date.now() - MP.state.releaseTiming.duration / 4;
    MP.debug.finishReleaseTiming(true);
    return { inZone: MP.state.lastLocation.inZone, label: MP.state.lastLocation.actualLabel };
  });
  expect(outside).toEqual({ inZone: true, label: "바깥쪽" });
});

test("handedness flips course meaning, matchup weight, release side, and UI labels", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const pitcher = MP.state.pitcher;
    const batter = MP.debug.currentBatter();
    const pitch = pitcher.repertoire[0];
    const sprite = MP.debug.els.mobileBallSprite;
    const combinations = [
      ["R", "R"],
      ["R", "L"],
      ["L", "L"],
      ["L", "R"]
    ].map(([throws, bats]) => ({ key: throws + bats, ...MP.debug.handednessMatchupEffect({ throws }, { bats }) }));

    pitcher.throws = "R";
    batter.bats = "R";
    MP.debug.animatePitch({ row: 1, col: 1, x: 0.5, y: 0.5 }, pitch);
    const rightStart = parseFloat(sprite.style.getPropertyValue("--ball-start-x"));
    const rightEnd = parseFloat(sprite.style.getPropertyValue("--ball-end-x"));

    pitcher.throws = "L";
    batter.bats = "L";
    MP.debug.animatePitch({ row: 1, col: 1, x: 0.5, y: 0.5 }, pitch);
    const leftStart = parseFloat(sprite.style.getPropertyValue("--ball-start-x"));
    const leftEnd = parseFloat(sprite.style.getPropertyValue("--ball-end-x"));
    MP.debug.render();

    return {
      generated: [pitcher.throws, ...MP.state.lineup.map((item) => item.bats)].every((hand) => hand === "R" || hand === "L"),
      lineupHasBoth: new Set(MP.state.lineup.map((item) => item.bats)).size === 2,
      right: [MP.debug.horizontalCourseSide(0, { bats: "R" }), MP.debug.horizontalCourseSide(2, { bats: "R" })],
      left: [MP.debug.horizontalCourseSide(0, { bats: "L" }), MP.debug.horizontalCourseSide(2, { bats: "L" })],
      legacy: [MP.debug.pitcherThrows({}), MP.debug.batterBats({})],
      combinations,
      rightStart,
      leftStart,
      rightEnd,
      leftEnd,
      pitcherLabel: MP.debug.els.mobilePitcherName.textContent,
      batterLabel: MP.debug.els.mobileBattingSlot.textContent
    };
  });

  expect(result.generated).toBe(true);
  expect(result.lineupHasBoth).toBe(true);
  expect(result.right).toEqual(["outside", "inside"]);
  expect(result.left).toEqual(["inside", "outside"]);
  expect(result.legacy).toEqual(["R", "R"]);
  expect(result.combinations).toEqual([
    { key: "RR", contact: -0.015, contactQuality: -2, chase: 0.005 },
    { key: "RL", contact: 0.02, contactQuality: 2, chase: -0.005 },
    { key: "LL", contact: -0.035, contactQuality: -4, chase: 0.015 },
    { key: "LR", contact: 0.005, contactQuality: 1, chase: 0 }
  ]);
  expect(result.leftStart).toBeLessThan(result.rightStart);
  expect(result.leftEnd).toBeCloseTo(result.rightEnd, 4);
  expect(result.pitcherLabel).toContain("좌투");
  expect(result.batterLabel).toContain("좌타");
});

test("near balls invite swings while far balls are easy takes", async ({ page }) => {
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const pitch = MP.state.pitcher.repertoire[0];
    const batter = MP.debug.currentBatter();
    const random = Math.random;
    Math.random = () => 0;
    const near = MP.debug.buildPitchResolutionContext(pitch, batter, {
      zone: 4,
      intent: "ball",
      targetX: 0.04,
      targetY: 0.5
    });
    const far = MP.debug.buildPitchResolutionContext(pitch, batter, {
      zone: 4,
      intent: "ball",
      targetX: 0.01,
      targetY: 0.5
    });
    const answer = {
      nearTier: near.location.ballDistanceTier,
      farTier: far.location.ballDistanceTier,
      nearDistance: near.location.ballDistance,
      farDistance: far.location.ballDistance,
      swingGap: MP.debug.pitchSwingProbability(near) - MP.debug.pitchSwingProbability(far),
      zone: MP.debug.ballDistanceEffect(0.5, 0.5)
    };
    Math.random = random;
    return answer;
  });

  expect(result.nearTier).toBe("near");
  expect(result.farTier).toBe("far");
  expect(result.nearDistance).toBeLessThan(result.farDistance);
  expect(result.swingGap).toBeGreaterThan(0.15);
  expect(result.zone).toEqual({ tier: "zone", distance: 0, swing: 0 });
});

test("starter stats are capped and release shake combines command with mental", async ({ page }) => {
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const limits = {
      power: { 구속: [64, 78], 제구: [44, 62], 변화: [32, 48], 멘탈: [42, 66], 예측: [34, 56] },
      breaking: { 구속: [42, 60], 제구: [46, 64], 변화: [64, 78], 멘탈: [42, 68], 예측: [38, 60] },
      command: { 구속: [44, 62], 제구: [64, 78], 변화: [44, 62], 멘탈: [46, 70], 예측: [40, 62] },
      balanced: { 구속: [52, 66], 제구: [52, 66], 변화: [52, 66], 멘탈: [44, 68], 예측: [38, 58] }
    };
    const statsInRange = Array.from({ length: 200 }, () => MP.debug.generatePitcher()).every((pitcher) =>
      Object.entries(limits[pitcher.profileId]).every(([stat, [min, max]]) =>
        pitcher.stats[stat] >= min && pitcher.stats[stat] <= max
      )
    );

    const pitch = MP.state.pitcher.repertoire[0];
    const course = { zone: 5, intent: "strike", targetX: 0.5, targetY: 0.5 };
    MP.state.bases = [false, false, false];
    MP.state.pitcher.stats.제구 = 56;
    MP.state.pitcher.stats.멘탈 = 40;
    const lowMental = MP.debug.buildReleaseTimingChallenge(pitch, course);
    MP.state.pitcher.stats.멘탈 = 80;
    const highMental = MP.debug.buildReleaseTimingChallenge(pitch, course);

    return { statsInRange, lowMental, highMental };
  });

  expect(result.statsInRange).toBe(true);
  expect(result.lowMental.stability).toBeLessThan(result.highMental.stability);
  expect(result.lowMental.shakeAmount).toBeGreaterThan(result.highMental.shakeAmount);
  expect(result.lowMental.shakeDuration).toBeLessThan(result.highMental.shakeDuration);
});

test("event banners auto-hide after their configured duration", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  await page.evaluate(() => window.MountPsycho.debug.showEventBanner("이닝 미션", "reward", 600));
  await expect(page.locator("#mobileInningBanner")).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.locator("#mobileInningBanner")).toBeHidden();
});
test("weakness reveals stay in the log without opening a toast", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  const revealed = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.tutorialSeen = { ...(MP.state.tutorialSeen || {}) };
    delete MP.state.tutorialSeen.weakness;
    [MP.debug.els.inningBanner, MP.debug.els.mobileInningBanner].filter(Boolean).forEach((banner) => {
      banner.hidden = true;
      banner.classList.remove("show");
    });
    return Boolean(MP.debug.revealBatterWeakness(MP.debug.currentBatter()));
  });

  expect(revealed).toBe(true);
  await expect(page.locator("#inningBanner")).toBeHidden();
  await expect(page.locator("#mobileInningBanner")).toBeHidden();
});


test("pitch result toasts auto-hide after three seconds", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  await page.evaluate(() => window.MountPsycho.debug.setTiming("STRIKE", "warn"));
  await expect(page.locator("#mobileTimingBadge")).toHaveClass(/show/);
  await expect(page.locator('#mobileTimingBadge.image-toast img[src*="toast-strike-aligned-v2.png"]')).toBeVisible();
  await expect(page.locator("#mobileTimingBadge")).toHaveClass(/toast-positive/);
  await expect.poll(() => page.locator("#mobileTimingBadge img").evaluate((image) => getComputedStyle(image).filter)).toContain("drop-shadow");
  await page.evaluate(() => window.MountPsycho.debug.setTiming("BALL", "good"));
  await expect(page.locator("#mobileTimingBadge")).toHaveClass(/toast-neutral/);
  await page.waitForTimeout(2500);
  await expect(page.locator("#mobileTimingBadge")).toHaveClass(/show/);
  await expect(page.locator("#mobileTimingBadge")).not.toHaveClass(/show/, { timeout: 1000 });
});

test("mobile throw records a log entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await expect(page.locator('#mobileRecentLog [data-record-kind="batter"]')).toHaveCount(0);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.batterIndex = (MP.state.batterIndex + 1) % MP.state.lineup.length;
    MP.debug.startAtBat();
    MP.debug.render();
  });
  await expect(page.locator('#mobileRecentLog [data-record-kind="batter"]')).toContainText(/교체\s*2번/);
  await expect(page.locator('#mobileRecentLog [data-record-kind="batter"]')).not.toContainText("새 타자");
  await expect(page.locator(".mobile-suspicion-card")).toBeHidden();
  await chooseMobilePitchAndZone(page);

  const zone = page.locator("#mobileStrikeZone");
  const box = await zone.boundingBox();
  await zone.click({ position: { x: box.width * 0.56, y: box.height * 0.44 } });
  const duringFlight = await page.evaluate(() => ({
    inFlight: window.MountPsycho.state.pitchInFlight,
    resultRows: document.querySelectorAll("#mobileRecentLog .mobile-pitch-compact-row[data-result]").length
  }));
  expect(duringFlight).toEqual({ inFlight: true, resultRows: 0 });
  await expect(page.locator("#mobileRecentLog .mobile-pitch-compact-row[data-result]")).toBeVisible({ timeout: 8000 });
  await expect.poll(async () => page.evaluate(() =>
    document.querySelector("#mobileTimingBadge")?.classList.contains("show")
    || document.querySelector("#mobileInningBanner")?.classList.contains("show")
  ), { timeout: 1000 }).toBe(true);
  await expect(page.locator('#mobileRecentLog [data-record-kind="batter"]')).toContainText(/\d번/);
  await expect(page.locator('#mobileRecentLog [data-record-kind="pitch"]').first()).toContainText(/구/);
  await expect(page.locator('#mobileRecentLog [data-record-kind="pitch"]').first().locator(".mobile-pitch-zone")).toHaveText(/바깥|몸쪽|중앙|높게|낮게/);
  await expect(page.locator('#mobileRecentLog [data-record-kind="pitch"] small').first()).not.toHaveText("");
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    const pitch = MP.state.pitcher.repertoire[0];
    MP.state.strikes = 3;
    MP.debug.finishAtBat("STRIKE OUT!", "테스트 삼진", {
      result: {
        result: "swingingStrike",
        pitch,
        batter: MP.debug.currentBatter(),
        location: { row: 1, col: 1, actualLabel: "중앙" }
      }
    });
    MP.debug.render();
  });
  await expect(page.locator('#mobileRecentLog [data-record-kind="result"]').filter({ hasText: "삼진!" }).first()).toHaveText("삼진!");
  await page.locator("#mobileRecentLogMore").click();
  await expect(page.locator("#mobileInfoPanel")).toBeVisible();
  await expect(page.locator("#mobileInfoPanelTitle")).toContainText("현재 타석");
  const logPopup = await page.locator("#mobileInfoPanel").evaluate((panel) => {
    const rect = panel.getBoundingClientRect();
    return { width: rect.width, height: rect.height, viewportWidth: innerWidth, viewportHeight: innerHeight };
  });
  expect(logPopup.width).toBeLessThan(logPopup.viewportWidth);
  expect(logPopup.height).toBeLessThan(logPopup.viewportHeight);
  await expect(page.locator("#mobileInfoPanelBody .mobile-log-counts")).toContainText(/S\s*\d\s*B\s*\d\s*투구수\s*1\s*최신순/);
  await expect(page.locator("#mobileInfoPanelBody .mobile-pitch-detail-row").first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator("#mobileInfoPanelBody .mobile-pitch-detail-row").first()).toContainText(/타자가|같은|흐름|다음 공|다음은|빠른 공|코스|스윙|배트|계열|높이|정타|범타/);
  await expect(page.locator("#mobileInfoPanelBody .mobile-log-at-bat-start:not(.mobile-log-at-bat-result)")).toHaveCount(2);
  await expect(page.locator("#mobileInfoPanelBody .mobile-log-at-bat-result").filter({ hasText: "삼진!" }).first()).toContainText("삼진!");
});

test("stage card reward assigns performance tokens to cards", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    Math.random = () => 0.99;
    const run = MP.state.stageRun;
    MP.state.pitcher.rewardHistory.conditionTypesByStage = ["pitchUpgrade", "weaknessMitigation", "bonusTag"].map((type) => ({
      stageIndex: MP.state.stageIndex,
      type
    }));
    run.rewardBoost.absorbed = 3;
    run.rewardBoost.performanceScore = 40;
    run.stagePerformanceEvents = [
      { key: "strikeout", label: "설계 삼진", score: 3, source: "삼진" },
      { key: "doublePlay", label: "병살 유도", score: 4, source: "병살" }
    ];
    MP.state.lastStageResult = MP.debug.calculateStageResult();
    MP.debug.openRewardDraft("스테이지 보상", null, "stageCard");
  });
  const rewardCardLefts = await page.locator("#rewardChoiceList .reward-choice-card").evaluateAll((cards) => cards.map((card) => Math.round(card.getBoundingClientRect().left)));
  expect(new Set(rewardCardLefts).size).toBe(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("#rewardAbsorbList")).toBeVisible();
  const rewardScrollLayout = await page.locator('#rewardOverlay[data-kind="stageCard"]').evaluate((overlay) => {
    const box = overlay.querySelector(".reward-box");
    overlay.scrollTop = overlay.scrollHeight;
    const layout = {
      scrollsOutside: overlay.scrollTop > 0,
      boxOwnScrollDisabled: getComputedStyle(box).overflowY === "visible" && box.scrollTop === 0,
      boxCoversContent: box.clientHeight >= box.scrollHeight
    };
    overlay.scrollTop = 0;
    return layout;
  });
  expect(rewardScrollLayout).toEqual({ scrollsOutside: true, boxOwnScrollDisabled: true, boxCoversContent: true });

  await expect(page.locator("#rewardAbsorbList .reward-performance-pill")).toHaveCount(2);
  await expect(page.locator("#rewardAbsorbList .reward-performance-pill").filter({ hasText: /설계 삼진/ })).toHaveCount(1);
  await expect(page.locator("#rewardAbsorbList .reward-performance-pill").filter({ hasText: /→ [123]번/ })).toHaveCount(2);
  await expect(page.locator("#rewardChoiceList .reward-rarity-badge--common")).toHaveCount(3);
  const animatingCard = page.locator("#rewardChoiceList .is-rarity-upgrade-animating").first();
  await expect(animatingCard).toBeVisible({ timeout: 6000 });
  await expect.poll(() => animatingCard.evaluate((card) =>
    card.getAnimations().some((animation) => animation.playState === "running")
  )).toBe(true);
  await expect(page.locator("#rewardChoiceList .reward-rarity-badge--core")).toHaveCount(1, { timeout: 9000 });
  await expect(page.locator("#rewardChoiceList .reward-rarity-badge--rare")).toHaveCount(2, { timeout: 9000 });
  await expect(page.locator("#rewardChoiceList .reward-choice-card--core .core-evo-name")).toHaveCSS("color", "rgb(255, 203, 66)");
  const rewardMotion = await page.locator("#rewardChoiceList .reward-choice-card").evaluateAll((cards) => cards.map((card) => ({
    upgraded: card.classList.contains("is-upgraded-by-performance"),
    animated: card.dataset.upgradeAnimated === "true"
  })));
  await expect(page.locator("#rewardChoiceList .reward-card-upgrade-text")).toHaveCount(0);
  expect(rewardMotion.filter((card) => !card.upgraded).every((card) => !card.animated)).toBe(true);
  expect(rewardMotion.filter((card) => card.upgraded).every((card) => card.animated)).toBe(true);
  await expect(page.locator("#rewardReason")).toContainText("태그 중심 보상 3장 중 하나를 선택합니다.");
});

test("stage rewards stay still when no performance upgrade occurred", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    Math.random = () => 0.99;
    MP.state.stageRun.rewardBoost = { absorbed: 0, performanceScore: 0, coreBonus: 0, rareBonus: 0, coreChoiceBonus: 0, guaranteedRare: 0 };
    MP.state.stageRun.stagePerformanceEvents = [];
    MP.state.lastStageResult = MP.debug.calculateStageResult();
    MP.debug.openRewardDraft("스테이지 보상", null, "stageCard");
  });

  await expect(page.locator("#rewardAbsorbList")).toBeHidden();
  await expect(page.locator("#rewardChoiceList .is-upgraded-by-performance")).toHaveCount(0);
  const animationNames = await page.locator("#rewardChoiceList .reward-choice-card").evaluateAll((cards) => cards.map((card) => getComputedStyle(card).animationName));
  expect(animationNames.every((name) => name === "none")).toBe(true);
});

test("reward card rarity changes the card frame treatment", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const fixture = document.createElement("div");
    fixture.innerHTML = `
      <button id="rarityCommon" class="reward-choice-card reward-choice-card--common">일반</button>
      <button id="rarityRare" class="reward-choice-card reward-choice-card--rare">희귀</button>
      <button id="rarityCore" class="reward-choice-card reward-choice-card--core">핵심</button>
    `;
    document.body.appendChild(fixture);
  });

  const stylesByRarity = await page.evaluate(() =>
    Object.fromEntries(
      ["common", "rare", "core"].map((rarity) => {
        const id = `rarity${rarity[0].toUpperCase()}${rarity.slice(1)}`;
        const styles = getComputedStyle(document.querySelector(`#${id}`));
        return [rarity, { borderColor: styles.borderTopColor, boxShadow: styles.boxShadow }];
      })
    )
  );

  expect(stylesByRarity.common.borderColor).not.toBe(stylesByRarity.rare.borderColor);
  expect(stylesByRarity.rare.borderColor).not.toBe(stylesByRarity.core.borderColor);
  expect(stylesByRarity.core.boxShadow).not.toBe(stylesByRarity.common.boxShadow);
});

test("stage reward card pool excludes dugout-only planning cards", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.ownedRewardCards = ["R007", "R008", "R014", "R016"];
    MP.state.lastStageResult = MP.debug.calculateStageResult();
    const stageChoices = MP.debug.generateStageCardChoices().map((choice) => choice.title);
    const ownedCards = MP.debug.ownedRewardCardEntries().map((entry) => entry.card.name);
    return { stageChoices, ownedCards };
  });

  expect(result.stageChoices).not.toContain("라이벌 사전 분석");
  expect(result.stageChoices).not.toContain("첫 타자 반응 체크");
  expect(result.stageChoices).not.toContain("덕아웃 플랜");
  expect(result.ownedCards).toEqual(["반응 데이터 축적"]);
});

test("psych reward cards feed batter impressions", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.debug.currentBatter().bats = "R";
    MP.state.ownedRewardCards = ["C010", "C011", "C015", "C015"];
    const fast = MP.debug.pitchById("four");
    const slider = MP.debug.pitchById("slider");
    const change = MP.debug.pitchById("change");
    const inside = MP.debug.impressionFromResult({
      result: "calledStrike",
      pitch: fast,
      location: { row: 1, col: 2, inZone: true }
    })?.id;
    const outside = MP.debug.impressionFromResult({
      result: "calledStrike",
      pitch: slider,
      location: { row: 1, col: 0, inZone: true }
    })?.id;
    MP.state.atBat.batterMind.lastImpression = { id: "fast_timing", label: "빠른 공 의식", age: 0 };
    const withSameRelease = MP.debug.currentImpressionEffect(change, { row: 1, col: 1, inZone: true }).contactQuality;
    MP.state.ownedRewardCards = [];
    const withoutSameRelease = MP.debug.currentImpressionEffect(change, { row: 1, col: 1, inZone: true }).contactQuality;
    return { inside, outside, withSameRelease, withoutSameRelease };
  });

  expect(result.inside).toBe("inside_fast");
  expect(result.outside).toBe("outside_slow");
  expect(result.withSameRelease).toBeLessThan(result.withoutSameRelease);
});

test("stage themes and rivals affect pitch resolution hooks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const batter = MP.debug.currentBatter();
    const themeFx = MP.stageThemePitchEffect("power", batter, {
      stageIndex: 2,
      balls: 0,
      strikes: 0,
      outs: 0,
      inZone: true,
      pitchCategory: "breaking",
      side: "outside",
      height: "low",
      targetMatch: false,
      centerMistake: false
    });
    batter.rivalPatternId = "patternReader";
    MP.state.atBat.choiceHistory = [{ pitchId: "four", category: "fast", side: "inside" }];
    const rivalFx = MP.debug.rivalPitchEffect(MP.debug.pitchById("four"), batter, {
      row: 1,
      col: 2,
      inZone: true,
      centerMistake: false
    });
    return { themeContactQuality: themeFx.contactQuality, rivalContactQuality: rivalFx.contactQuality };
  });

  expect(result.themeContactQuality).toBeLessThan(0);
  expect(result.rivalContactQuality).toBeGreaterThan(0);
});

test("count pressure and foul timing expose pitch intent reads", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const fast = MP.debug.pitchById("four");
    const breaking = MP.debug.pitchById("slider");
    const expectedStrike = MP.debug.countIntentReadEffect(
      fast,
      { intent: "strike" },
      { row: 1, col: 1, inZone: true },
      { count: "2-0" }
    );
    const counterPitch = MP.debug.countIntentReadEffect(
      breaking,
      { intent: "strike" },
      { row: 2, col: 0, inZone: true },
      { count: "2-0" }
    );
    const lateFoul = MP.debug.foulTimingRead({ pitch: fast, pattern: { count: "1-1" } }, 0.38);
    const protectFoul = MP.debug.foulTimingRead({ pitch: breaking, pattern: { count: "1-2" } }, 0.58);
    return {
      expectedStrikeQuality: expectedStrike.contactQuality,
      counterPitchQuality: counterPitch.contactQuality,
      lateFoul: lateFoul.id,
      protectFoul: protectFoul.id
    };
  });

  expect(result.expectedStrikeQuality).toBeGreaterThan(0);
  expect(result.counterPitchQuality).toBeLessThan(0);
  expect(result.lateFoul).toBe("late");
  expect(result.protectFoul).toBe("protect");
});

test("dugout choice reveals applied effect before advancing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.pendingDugoutChoices = [
      {
        id: "test_dugout",
        dugoutEventId: "test",
        category: "판단",
        title: "강속구로 먼저 압박한다",
        desc: "테스트 덕아웃 판단",
        hint: "관찰 0-0 스트라이크",
        resultText: "코치의 사인이 맞았습니다.\n강속구 구위 상승",
        correct: true,
        effects: { fastControl: 6, firstStrikePressure: 1 },
        rarity: "common"
      }
    ];
    MP.state.dugoutPending = true;
    MP.state.dugoutBeforeAtBat = true;
    MP.state.dugoutAdvanceBatterOnConfirm = false;
    MP.debug.openDugoutChoiceOverlay();
  });
  await page.waitForTimeout(1300);
  await page.locator("[data-dugout-index='0']").click();
  await expect(page.locator("#dugoutTitle")).toContainText(/판단/);
  await expect(page.locator(".dugout-result-card")).toContainText("판단 성공");
  await expect(page.locator("#dugoutReason")).toContainText("판단에 성공했습니다");
  await expect(page.locator(".dugout-result-card")).toContainText(/강속구 제구/);
  await expect(page.locator(".dugout-result-card")).toContainText(/성과 흡수/);
  await page.locator("[data-dugout-continue]").click();
  await expect(page.locator("#dugoutOverlay")).toBeHidden();

  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.pendingDugoutChoices = [{
      id: "test_dugout_fail", dugoutEventId: "test", category: "판단", title: "무리하게 승부한다",
      desc: "테스트 실패 판단", resultText: "사인이 빗나갔습니다.\n장타 위험 상승", correct: false,
      effects: { singleRisk: 0.08 }, rarity: "common"
    }];
    MP.state.dugoutPending = true;
    MP.debug.openDugoutChoiceOverlay();
  });
  await page.waitForTimeout(1300);
  await page.locator("[data-dugout-index='0']").click();
  await expect(page.locator(".dugout-result-card")).toContainText("판단 실패");
  await expect(page.locator("#dugoutReason")).toContainText("판단에 실패했습니다");
  await expect(page.locator(".dugout-result-card")).toHaveClass(/dugout-result-card--failure/);
});

test("dugout event pool uses 20 baseball plans and 5 weird events", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const events = MP.debug.dugoutEventCatalog();
    const choices = MP.debug.generateDugoutChoices({ force: true });
    return {
      total: events.length,
      weird: events.filter((event) => event.pool === "weird").length,
      hasOldLiveRead: events.some((event) => ["read_fast_late", "read_swing_early", "read_hard_contact"].includes(event.id)),
      choiceCount: choices.length,
      choiceEventId: choices[0]?.dugoutEventId || "",
      choiceTitle: choices[0]?.title || "",
      choiceDesc: choices[0]?.desc || ""
    };
  });

  expect(result.total).toBe(25);
  expect(result.weird).toBe(5);
  expect(result.hasOldLiveRead).toBe(false);
  expect(result.choiceCount).toBe(2);
  expect(result.choiceEventId).toBeTruthy();
  expect(result.choiceTitle).toBeTruthy();
  expect(result.choiceDesc).not.toContain("관찰:");
});

test("dugout effects change release, contact, and handedness", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const pitch = MP.state.pitcher.repertoire[0];
    const course = { zone: 5, intent: "strike", targetRow: 1, targetCol: 1, targetX: 0.5, targetY: 0.5 };
    const setEffects = (effects) => {
      MP.state.activeDugoutEffects = [{ effects, expiresInning: MP.state.inning }];
    };

    setEffects({});
    const baseRelease = MP.debug.buildReleaseTimingChallenge(pitch, course);
    const baseSame = MP.debug.handednessMatchupEffect({ throws: "R" }, { bats: "R" });
    const baseOpposite = MP.debug.handednessMatchupEffect({ throws: "R" }, { bats: "L" });

    setEffects({ mentalStability: 8, burdenControl: 0.85 });
    const stableRelease = MP.debug.buildReleaseTimingChallenge(pitch, course);

    setEffects({ singleRisk: 0.08, lowGroundBall: 1 });
    const contact = MP.debug.rewardCardPitchEffect(
      pitch,
      { row: 2, col: 1, inZone: true },
      course,
      {},
      { isRival: false }
    );

    setEffects({ sameHandEdge: 1 });
    const boostedSame = MP.debug.handednessMatchupEffect({ throws: "R" }, { bats: "R" });
    setEffects({ oppositeHandGuard: 1 });
    const guardedOpposite = MP.debug.handednessMatchupEffect({ throws: "R" }, { bats: "L" });
    return { baseRelease, stableRelease, contact, baseSame, boostedSame, baseOpposite, guardedOpposite };
  });

  expect(result.stableRelease.mental).toBe(result.baseRelease.mental + 8);
  expect(result.stableRelease.pressure).toBeLessThanOrEqual(result.baseRelease.pressure);
  expect(result.contact.contact).toBeGreaterThanOrEqual(0.08);
  expect(result.contact.doublePlayBonus).toBeGreaterThanOrEqual(0.06);
  expect(result.boostedSame.contactQuality).toBeLessThan(result.baseSame.contactQuality);
  expect(result.guardedOpposite.contactQuality).toBeLessThan(result.baseOpposite.contactQuality);
});

test("dugout batting-order warning uses the actual upcoming hitters", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const desc = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.batterIndex = 4;
    MP.state.dugoutBeforeAtBat = true;
    MP.state.dugoutAdvanceBatterOnConfirm = false;
    return MP.debug.dugoutEventDescription({ id: "cleanup_warning" });
  });
  expect(desc).toContain("5·6·7번");
  expect(desc).not.toContain("3-4-5번");
});

test("at-bat results no longer grant automatic growth", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  const growth = await page.evaluate(() => {
    const MP = window.MountPsycho;
    const pitch = MP.state.pitcher.repertoire[0];
    const before = { coreXp: MP.state.pitcher.coreXp, pitchXp: MP.state.pitcher.pitchMastery[pitch.id].xp };
    MP.debug.finishAtBat("GROUND OUT!", "테스트 아웃", {
      result: { result: "inPlayOut", pitch, batter: MP.debug.currentBatter(), location: { row: 1, col: 1 } }
    });
    return { before, after: { coreXp: MP.state.pitcher.coreXp, pitchXp: MP.state.pitcher.pitchMastery[pitch.id].xp } };
  });
  expect(growth.after).toEqual(growth.before);
});

test("scheduled stage reward appears after inning transition overlay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.pendingTransitionBanner = { text: "INNING CHANGE · 4 INNING", tone: "inning", duration: 500 };
    MP.state.pendingStageTransition = true;
    MP.state.pendingStageRewardKind = "normal";
    MP.debug.finishAtBat("GROUND OUT!", "테스트 스테이지 종료");
  });
  await expect(page.locator("#stageOverlay")).toBeVisible();
  await expect(page.locator("#stageOverlay")).toBeHidden({ timeout: 3000 });
  await expect(page.locator("#rewardOverlay")).toBeVisible({ timeout: 3000 });
  await expect(page.locator("#rewardChoiceList .reward-choice-card")).toHaveCount(3);
});

test("stage reward selection routes to theme select, then stage-start dugout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.pendingCoreEvolutionReward = false;
    MP.state.awaitingThemeSelection = true;
    MP.state.stageBreakDugoutDone = false;
    MP.state.pendingThemeChoices = MP.rollThemeChoices
      ? MP.rollThemeChoices(MP.state.stageIndex + 1, MP.state.pitcher)
      : [];
    MP.debug.openStageTagReward();
  });
  await expect(page.locator("#rewardOverlay")).toBeVisible({ timeout: 3000 });
  await page.waitForTimeout(1300);
  await page.locator("#rewardChoiceList .reward-choice-card").first().click();
  await page.locator("#rewardChoiceConfirm").click();
  await expect(page.locator("#themeSelectOverlay")).toBeVisible({ timeout: 3000 });
  await page.locator("#themeChoiceList .theme-choice-card").first().click();
  await expect(page.locator("#stageOverlay")).toBeVisible({ timeout: 3000 });
  await page.locator("#stageStartButton").click();
  await expect(page.locator("#dugoutOverlay")).toBeVisible({ timeout: 3000 });
  await expect(page.locator("#dugoutTitle")).toContainText("덕아웃 판단");
  await page.waitForTimeout(1300);
  await page.locator("[data-dugout-index='0']").click();
  await expect(page.locator(".dugout-result-card")).toBeVisible();
  await expect(page.locator("[data-dugout-continue]")).toContainText("첫 타자 상대");
  await page.locator("[data-dugout-continue]").click();
  await expect(page.locator("#dugoutOverlay")).toBeHidden();
  await expect(page.locator("#mobileGameShell")).toBeVisible();
});

test("natural stage final out opens its scheduled reward", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.inning = MP.debug.currentStageInnings();
    MP.state.outs = 2;
    MP.debug.addOut();
    MP.debug.finishAtBat("STRIKE OUT!", "테스트 스테이지 종료", { rewardReason: "삼진" });
  });
  await expect(page.locator("#rewardOverlay")).toBeVisible({ timeout: 3000 });
  await expect(page.locator("#rewardTitle")).toContainText("스테이지 보상");
  await expect(page.locator("#rewardChoiceList .reward-choice-card")).toHaveCount(3);
});

test("stage debug page can force stage reward flow", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto("/stage-debug.html");
  await page.locator('[data-action="stageReward"]').click();
  const frame = page.frameLocator("#gameFrame");
  await expect(frame.locator("#rewardOverlay")).toBeVisible({ timeout: 5000 });
  await expect(frame.locator("#rewardTitle")).toContainText("스테이지 보상");
  await expect(frame.locator("#rewardChoiceList .reward-choice-card")).toHaveCount(3);
  await expect(frame.locator("#rewardAbsorbList .reward-performance-pill")).toHaveCount(8);
  await expect(frame.locator("#rewardChoiceList .reward-card-upgrade-badge")).toHaveCount(3);
  await expect(frame.locator("#rewardChoiceList .reward-rarity-badge--core")).toHaveCount(1, { timeout: 15000 });
  await expect(frame.locator("#rewardChoiceList .reward-rarity-badge--rare")).toHaveCount(2, { timeout: 15000 });
  await expect(frame.locator("#rewardOverlay")).not.toHaveClass(/is-revealing/, { timeout: 15000 });
  await frame.locator("#rewardChoiceList .reward-choice-card:has(.reward-rarity-badge--core)").click();
  await frame.locator("#rewardChoiceConfirm").click();
  await expect(frame.locator("#ownedCardSummary")).toContainText("태그·진화 1");
  await expect(frame.locator("#ownedCardSummary")).not.toContainText("보유 보상 없음");
});

test("stage debug page opens the title, core-tag, and opponent checks", async ({ page }) => {
  await page.goto("/stage-debug.html");
  await page.getByRole("button", { name: "시작 화면 확인", exact: true }).click();
  const game = page.frameLocator("#gameFrame");
  await expect(game.locator("#titleStartButton")).toContainText("새 RUN");
  await page.getByRole("button", { name: "핵심태그 선택 확인", exact: true }).click();
  await expect(game.locator("#pitcherSelectOverlay")).toBeVisible();
  await expect(game.locator(".choice-number").first()).not.toBeEmpty();
  await page.getByRole("button", { name: "상대 타선 선택 확인", exact: true }).click();
  await expect(game.locator("#themeSelectOverlay")).toBeVisible();
  await expect(game.locator(".theme-choice-card")).toHaveCount(3);
  await page.getByRole("button", { name: "게임 준비", exact: true }).click();
  await expect(game.locator("#mobileStrikeZone")).toBeVisible();
});

test("stage debug page jumps directly to any of the 12 stages", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto("/stage-debug.html");
  await page.selectOption("#stageSelect", "11");
  await page.locator('[data-action="openStage"]').click();
  await expect(page.locator("#status")).toContainText("STAGE 12을 바로 시작했습니다.", { timeout: 10000 });
  await expect(page.locator("#status")).toContainText("GAME 4 · STAGE 12 · 3회");
});

test("stage debug page opens a forced dugout event after game preparation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/stage-debug.html");
  await page.locator('[data-action="prepare"]').click();
  await expect(page.locator("#status")).toContainText("게임 준비 완료", { timeout: 10000 });
  await page.locator('[data-action="dugout"]').click();
  const frame = page.frameLocator("#gameFrame");
  await expect(frame.locator("#dugoutOverlay")).toBeVisible({ timeout: 5000 });
  expect(await frame.locator("#dugoutChoiceList .dugout-choice-card").count()).toBeGreaterThan(0);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("QA control room applies state, simulates pitches, and opens a selected dugout event", async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto("/stage-debug.html");
  await page.locator('[data-action="prepare"]').click();
  await expect(page.locator("#qaDugoutEvent option")).toHaveCount(25, { timeout: 10000 });
  expect(await page.locator("#qaPitch option").count()).toBeGreaterThan(0);

  await page.selectOption("#qaBalls", "3");
  await page.selectOption("#qaStrikes", "2");
  await page.selectOption("#qaOuts", "1");
  await page.selectOption("#qaPitcherHand", "L");
  await page.selectOption("#qaBatterHand", "R");
  await page.locator("#qaBase1").check();
  await page.locator('[data-action="applyState"]').click();
  const frame = page.frameLocator("#gameFrame");
  const applied = await page.locator("#gameFrame").evaluate((iframe) => {
    const state = iframe.contentWindow.MountPsycho.state;
    return { balls: state.balls, strikes: state.strikes, outs: state.outs, runner: !!state.bases[0], throws: state.pitcher.throws };
  });
  expect(applied).toEqual({ balls: 3, strikes: 2, outs: 1, runner: true, throws: "L" });
  await expect(page.locator("#status")).toContainText("3B 2S 1O");

  await page.selectOption("#qaTrials", "100");
  await page.locator('[data-action="simulatePitch"]').click();
  await expect(page.locator("#qaSimulationResult")).toContainText("100회");
  await expect(page.locator("#qaSimulationResult")).toContainText("투구 품질");

  await page.selectOption("#qaDugoutEvent", "rival_plan");
  await page.locator('[data-action="dugoutSelected"]').click();
  await expect(frame.locator("#dugoutOverlay")).toBeVisible();
  await expect(frame.locator("#dugoutChoiceList")).toContainText("코스 전환으로 묶는다");
});

test("mobile player tags open detail modal with tag text", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    const batter = MP.debug.currentBatter();
    batter.revealedWeaknessTagIds = (batter.weaknessTags || []).slice();
    MP.debug.render();
  });

  await expect(page.locator("#mobileBatterTags [data-mobile-batter-tag]")).toHaveCount(2);
  await expect(page.locator("#mobileBatterTags [data-role='weakness']").first()).toBeVisible();
  await expect(page.locator("#mobileBatterTags [data-role='weakness']").first()).not.toHaveAttribute("data-tier", "danger");

  const tagText = (await page.locator("[data-mobile-batter-tag]").first().textContent()).trim();
  await page.locator("[data-mobile-batter-tag]").first().click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeVisible();
  await expect(page.locator("#mobilePlayerDetailPanel")).toHaveAttribute("data-view", "tag");
  await expect(page.locator("#mobilePlayerDetailPanel .mobile-tag-hero h2")).toContainText(tagText);
  await page.locator("[data-mobile-detail-back]").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toHaveAttribute("data-view", "player");
  await expect(page.locator("#mobileInfoPanel")).toBeHidden();
});

test("mobile player cards open centered detail modal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  await expect(page.locator("#mobileBattingSlot")).toContainText("번");
  await expect(page.locator("#mobileBatterTags button").first()).toHaveAttribute("data-tier", /bronze|silver|gold|platinum/);

  await page.locator(".mobile-pitcher-summary").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeVisible();
  await expect(page.locator(".mobile-pitcher-summary")).toHaveClass(/is-selected/);
  await expect(page.locator("#mobilePanelBackdrop")).toBeVisible();
  await expect(page.locator("#mobilePlayerDetailPanel")).toContainText("주요 능력");
  await expect(page.locator("#mobilePlayerDetailPanel")).toContainText("핵심");
  await expect(page.locator('#mobilePlayerDetailPanel [data-mobile-modal-tag-section="core"]').first()).toHaveAttribute("data-tier", "bronze");
  if (await page.locator('#mobilePlayerDetailPanel [data-mobile-modal-tag-section="support"]').count()) {
    await page.locator('#mobilePlayerDetailPanel [data-mobile-modal-tag-section="support"]').first().click();
    await expect(page.locator("#mobilePlayerDetailPanel")).toHaveAttribute("data-view", "tag");
    await page.locator("[data-mobile-detail-back]").click();
  }
  await expect(page.locator("#mobilePlayerDetailPanel")).not.toContainText("구종 정보");

  for (const viewport of [{ width: 320, height: 800 }, { width: 375, height: 667 }, { width: 414, height: 896 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    const detailFits = await page.locator("#mobilePlayerDetailPanel").evaluate((panel) => {
      const rect = panel.getBoundingClientRect();
      return document.documentElement.scrollWidth <= document.documentElement.clientWidth && panel.scrollWidth <= panel.clientWidth && rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight;
    });
    expect(detailFits).toBe(true);
  }

  await page.locator("[data-mobile-detail-close]").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeHidden();

  await page.locator(".mobile-batter-summary").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeVisible();
  await expect(page.locator(".mobile-batter-summary")).toHaveClass(/is-selected/);

  await page.locator("[data-mobile-detail-close]").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeHidden();
});

test("mobile pitcher choices stay inside narrow cards", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await startFromTitle(page);

  for (const viewport of [{ width: 268, height: 844 }, { width: 320, height: 800 }, { width: 375, height: 667 }, { width: 414, height: 896 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize(viewport);
    const layout = await page.evaluate(() => ({
      rootFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      confirmFits: document.querySelector("#pitcherChoiceConfirm").scrollWidth <= document.querySelector("#pitcherChoiceConfirm").clientWidth,
      cards: [...document.querySelectorAll(".pitcher-choice-card")].map((card) => {
        const rect = card.getBoundingClientRect();
        return card.scrollWidth <= card.clientWidth + 1 && rect.left >= 0 && rect.right <= innerWidth;
      })
    }));
    expect(layout.rootFits && layout.confirmFits).toBe(true);
    expect(layout.cards).toHaveLength(3);
    expect(layout.cards.every(Boolean)).toBe(true);
    if (viewport.width <= 430) {
      await expect(page.locator(".pitcher-select-box")).toHaveCSS("width", `${viewport.width}px`);
    }
  }

  await expect(page.locator(".pitcher-choice-card .choice-number").first()).toHaveCSS("font-size", "28px");
  await expect(page.locator(".pitcher-choice-card .choice-stat b").first()).toBeVisible();
  await expect(page.locator(".pitcher-choice-card .choice-pitch").first()).toBeVisible();
  await page.setViewportSize({ width: 320, height: 800 });
  const statSpacing = await page.locator(".pitcher-choice-card").first().evaluate((card) =>
    [...card.querySelectorAll(".choice-stat")].map((stat) => ({
      gap: getComputedStyle(stat).columnGap,
      wrap: getComputedStyle(stat).whiteSpace
    }))
  );
  expect(statSpacing.every((stat) => stat.gap === "4px" && stat.wrap === "nowrap")).toBe(true);
  const scrollLayout = await page.locator("#pitcherSelectOverlay").evaluate((overlay) => {
    overlay.scrollTop = overlay.scrollHeight;
    const box = overlay.querySelector(".pitcher-select-box");
    return {
      scrollsOutside: overlay.scrollTop > 0,
      boxOwnScrollDisabled: getComputedStyle(box).overflowY === "visible" && box.scrollTop === 0,
      boxCoversContent: box.clientHeight >= box.scrollHeight
    };
  });
  expect(scrollLayout).toEqual({ scrollsOutside: true, boxOwnScrollDisabled: true, boxCoversContent: true });
});

test("pitch types expose visibly different flight paths", async ({ page }) => {
  await page.goto("/");
  const profiles = await page.evaluate(() => Object.fromEntries(
    ["four", "sinker", "slider", "curve", "splitter"].map((id) => [id, window.MountPsycho.debug.pitchFlightProfile({ id })])
  ));

  expect(Object.values(profiles).every((profile) => profile.c1y >= 0 && profile.c1y <= profile.c2y && profile.c2y <= 1)).toBe(true);
  expect(profiles.curve.c2y).toBeLessThan(profiles.four.c2y);
  expect(Math.abs(profiles.curve.c2x)).toBeLessThan(20);
  expect(profiles.curve.c2y).toBeLessThan(0.2);
  expect(profiles.curve.duration).toBeGreaterThan(profiles.slider.duration);
  expect(profiles.sinker.c2y).toBeLessThan(profiles.four.c2y);
  expect(profiles.slider.c2x).toBeGreaterThan(profiles.four.c2x);
  expect(profiles.splitter.c2y).toBeLessThan(profiles.sinker.c2y);
});

test("mobile release cursor follows the grading clock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await chooseMobilePitchAndZone(page);

  for (let sample = 0; sample < 4; sample += 1) {
    await page.waitForTimeout(90);
    const positions = await page.evaluate(() => {
      const challenge = window.MountPsycho.state.releaseTiming;
      const cursor = document.querySelector("#mobileReleaseCursor");
      const elapsed = Date.now() - challenge.startedAt;
      const phase = ((elapsed % challenge.duration) + challenge.duration) % challenge.duration;
      const progress = phase / challenge.duration;
      const expected = progress <= 0.5 ? progress * 2 : 2 - progress * 2;
      const actual = Number.parseFloat(cursor.style.getPropertyValue("--cursor-x")) / 100;
      return { expected, actual };
    });
    expect(Math.abs(positions.actual - positions.expected)).toBeLessThan(0.08);
  }
});
