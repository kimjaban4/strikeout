import { test, expect } from "@playwright/test";

async function startFromTitle(page) {
  await page.goto("/");
  await expect(page.locator("#titleOverlay")).toBeVisible();
  await page.locator("#titleStartButton").click();
  await expect(page.locator("#titleOverlay")).toBeHidden();
  await expect(page.locator("#pitcherSelectOverlay")).toBeVisible();
}

async function chooseFirstPitcher(page) {
  await startFromTitle(page);
  await page.locator(".pitcher-choice-card").first().click();
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
});

test("game flow runs at 1.3x while pitch result toasts stay at three seconds", async ({ page }) => {
  await page.goto("/");
  const timing = await page.evaluate(() => window.MountPsycho.GAME_TIMING);
  expect(timing.autoAdvanceDefault).toBe(Math.round(650 / 1.3));
  expect(timing.inningChangeOverlay).toBe(Math.round(1700 / 1.3));
  expect(timing.pitchResultToast).toBe(3000);
});

test("title screen uses the stable black logo stage and pitcher select stays dark", async ({ page }) => {
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
  expect(title.backgroundImage).toBe("none");
  expect(title.actionDirection).toBe("row");
  expect(title.coversViewport).toBe(true);

  await page.locator("#titleStartButton").click();
  await expect(page.locator("#pitcherSelectOverlay")).toBeVisible();
  const pitcherSelect = await page.locator(".pitcher-choice-card").first().evaluate((card) => {
    const color = getComputedStyle(card).color.match(/\d+/g).map(Number);
    return {
      lightText: color.slice(0, 3).reduce((sum, value) => sum + value, 0) > 560,
      statBars: card.querySelectorAll(".choice-stat").length,
      pitchBadges: card.querySelectorAll(".choice-pitch").length
    };
  });
  expect(pitcherSelect.lightText).toBe(true);
  expect(pitcherSelect.statBars).toBe(5);
  expect(pitcherSelect.pitchBadges).toBeGreaterThanOrEqual(2);
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
  expect(header).toEqual({ missionBelowCount: true, countVisible: true, missionVisible: true });

  await page.locator("#mobileNewGameButton").click();
  await expect(page.locator("#mobileMenuPanel")).toBeVisible();
  await expect(page.locator("[data-mobile-menu-new-game]")).toContainText("새게임 시작");

  await page.locator("[data-mobile-menu-new-game]").click();
  await expect(page.locator("#mobileMenuPanel")).toBeHidden();
  await expect(page.locator("#pitcherSelectOverlay")).toBeVisible();
});

test("stage missions stay inside playable innings", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => {
    const MP = window.MountPsycho;
    return [0, 1, 2].map((stageIndex) => {
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

    const layout = await page.evaluate(() => {
      const shell = document.querySelector("#mobileGameShell").getBoundingClientRect();
      const parts = [".mobile-game-header", ".mobile-field-scene", ".mobile-mid-panel", ".mobile-control-panel"]
        .map((selector) => document.querySelector(selector).getBoundingClientRect());
      const log = document.querySelector(".mobile-recent-log-card").getBoundingClientRect();
      return {
        shellVisible: shell.width > 0 && shell.height > 0,
        shellFits: shell.left >= 0 && shell.right <= innerWidth && shell.top >= 0 && shell.bottom <= innerHeight,
        shellWidth: Math.round(shell.width),
        centered: Math.abs(shell.left + shell.width / 2 - innerWidth / 2) <= 1,
        logHeight: Math.round(log.height),
        ordered: parts.every((rect, index) => index === 0 || rect.top >= parts[index - 1].bottom - 1)
      };
    });
    expect(layout.shellVisible).toBe(true);
    expect(layout.shellFits).toBe(true);
    expect(layout.centered).toBe(true);
    expect(layout.shellWidth).toBe(viewport.width > 760 ? 430 : viewport.width);
    expect(layout.logHeight).toBeGreaterThan(100);
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
  await expect(page.locator(".mobile-duel-read-card")).not.toContainText(/추천|예측/);
  await expect(page.locator("#mobileDuelReadRisk")).toHaveText(/안정|경계|위험/);
  await expect(page.locator("#mobileReleasePanel")).toBeHidden();
  await expect(page.locator("#mobileStrikeZone .zone-grid-cell")).toHaveCount(0);
  await expect(page.locator("#mobileStrikeZone .strike-zone-boundary")).toHaveCount(1);
  await expect(page.locator("#mobileStrikeZone")).toHaveCSS("border-top-width", "0px");
  const zoneGuide = await page.locator("#mobileStrikeZone").evaluate((zone) => {
    const boundary = zone.querySelector(".strike-zone-boundary");
    return {
      ratio: boundary.getBoundingClientRect().width / zone.getBoundingClientRect().width,
      gradients: (getComputedStyle(boundary).backgroundImage.match(/linear-gradient/g) || []).length
    };
  });
  expect(zoneGuide.ratio).toBeCloseTo(0.75, 1);
  expect(zoneGuide.gradients).toBe(2);

  await page.evaluate(() => {
    window.MountPsycho.state.pitcher.stats.제구 = 40;
  });

  await chooseMobilePitchAndZone(page);
  const target = await page.locator("#mobileStrikeZone .release-aim-target.show").evaluate((element) => ({
    x: element.style.getPropertyValue("--aim-x"),
    y: element.style.getPropertyValue("--aim-y"),
    shake: parseFloat(element.style.getPropertyValue("--aim-shake")),
    animation: getComputedStyle(element).animationName
  }));
  expect(parseFloat(target.x)).toBeGreaterThan(50);
  expect(parseFloat(target.y)).toBeLessThan(50);
  expect(target.shake).toBeGreaterThanOrEqual(8);
  expect(target.animation).toBe("releaseAimShake");
});

test("both visible strike-zone edges keep the correct inside and outside labels", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    Math.random = () => 0;
  });
  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  const zone = page.locator("#mobileStrikeZone");
  const box = await zone.boundingBox();
  await zone.click({ position: { x: box.width * 0.85, y: box.height * 0.5 } });
  const inside = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.releaseTiming.startedAt = Date.now() - MP.state.releaseTiming.duration / 4;
    MP.debug.finishReleaseTiming();
    return { inZone: MP.state.lastLocation.inZone, label: MP.state.lastLocation.actualLabel };
  });
  expect(inside).toEqual({ inZone: true, label: "몸쪽" });

  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  await zone.click({ position: { x: box.width * 0.15, y: box.height * 0.5 } });
  const outside = await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.releaseTiming.startedAt = Date.now() - MP.state.releaseTiming.duration / 4;
    MP.debug.finishReleaseTiming();
    return { inZone: MP.state.lastLocation.inZone, label: MP.state.lastLocation.actualLabel };
  });
  expect(outside).toEqual({ inZone: true, label: "바깥쪽" });
});

test("event banners auto-hide after their configured duration", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  await page.evaluate(() => window.MountPsycho.debug.nextBatter());
  await expect(page.locator("#mobileInningBanner")).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(page.locator("#mobileInningBanner")).toBeHidden();
});

test("pitch result toasts auto-hide after three seconds", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  await page.evaluate(() => window.MountPsycho.debug.setTiming("STRIKE", "warn"));
  await expect(page.locator("#mobileTimingBadge")).toHaveClass(/show/);
  await page.waitForTimeout(2500);
  await expect(page.locator("#mobileTimingBadge")).toHaveClass(/show/);
  await expect(page.locator("#mobileTimingBadge")).not.toHaveClass(/show/, { timeout: 1000 });
});

test("mobile throw records a log entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await expect(page.locator("#mobileRecentLog .is-batter-marker").first()).toContainText(/번 타자/);
  await expect(page.locator(".mobile-suspicion-card")).toBeHidden();
  await chooseMobilePitchAndZone(page);

  const zone = page.locator("#mobileStrikeZone");
  const box = await zone.boundingBox();
  await zone.click({ position: { x: box.width * 0.56, y: box.height * 0.44 } });
  await expect(page.locator("#mobileRecentLog .mobile-recent-log-row").first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator("#mobileRecentLog .is-batter-marker").first()).toContainText(/번 타자/);
  await expect(page.locator("#mobileRecentLog .mobile-pitch-compact-row").first()).toContainText(/구/);
  await expect(page.locator("#mobileRecentLog .mobile-pitch-compact-row").first().locator(".mobile-pitch-zone")).toHaveText(/바깥|몸쪽|중앙|높게|낮게/);
  await expect(page.locator("#mobileRecentLog .mobile-pitch-compact-row small").first()).toHaveText(
    /끝까지 보고 골랐습니다|그대로 지켜봤습니다|배트가 먼저 나왔습니다|배트가 늦게 나왔습니다|배트가 공을 놓쳤습니다|가까스로 걷어냈습니다|배트에 걸렸습니다|땅볼을 쳤습니다|뜬공을 쳤습니다|약한 타구를 쳤습니다|타구를 정확히 맞혔습니다|강하게 받아쳤습니다|완벽하게 받아쳤습니다|수비가 처리하지 못했습니다/
  );
  await page.locator("#mobileRecentLogMore").click();
  await expect(page.locator("#mobileInfoPanel")).toBeVisible();
  await expect(page.locator("#mobileInfoPanelBody .mobile-pitch-detail-row").first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator("#mobileInfoPanelBody .mobile-pitch-detail-row").first()).toContainText(/타자가|같은|흐름|다음 공|다음은|빠른 공|코스|스윙|계열|높이/);
});

test("stage card reward assigns performance tokens to cards", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
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
    run.rewardBoost.performanceScore = 19;
    run.stagePerformanceEvents = [
      { key: "strikeout", label: "설계 삼진", score: 3, source: "삼진" },
      { key: "doublePlay", label: "병살 유도", score: 4, source: "병살" }
    ];
    MP.state.lastStageResult = MP.debug.calculateStageResult();
    MP.debug.openRewardDraft("스테이지 보상", null, "stageCard");
  });
  await expect(page.locator("#rewardAbsorbList")).toBeVisible();
  await expect(page.locator("#rewardAbsorbList .reward-performance-pill")).toHaveCount(2);
  await expect(page.locator("#rewardAbsorbList .reward-performance-pill").filter({ hasText: /설계 삼진/ })).toHaveCount(1);
  await expect(page.locator("#rewardChoiceList .reward-rarity-badge--core")).toHaveCount(1);
  await expect(page.locator("#rewardChoiceList .reward-rarity-badge--rare")).toHaveCount(1);
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
  await expect(page.locator(".dugout-result-card")).not.toContainText(/판단 적중|판단 빗나감/);
  await expect(page.locator(".dugout-result-card")).toContainText(/강속구 제구/);
  await expect(page.locator(".dugout-result-card")).toContainText(/성과 흡수/);
  await page.locator("[data-dugout-continue]").click();
  await expect(page.locator("#dugoutOverlay")).toBeHidden();
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

test("stage clear reward cards appear after inning transition overlay", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.pendingTransitionBanner = { text: "INNING CHANGE · 4 INNING", tone: "inning", duration: 500 };
    MP.state.pendingCoreEvolutionReward = true;
    MP.state.awaitingThemeSelection = true;
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

test("natural stage final out opens stage reward cards", async ({ page }) => {
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
  await expect(frame.locator("#rewardChoiceList .reward-card-upgrade-badge")).toHaveCount(2);
  await expect(frame.locator("#rewardChoiceList .reward-rarity-badge--core")).toHaveCount(1);
  await expect(frame.locator("#rewardChoiceList .reward-rarity-badge--rare")).toHaveCount(1);
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
  await expect(page.locator("#mobilePlayerDetailPanel .mobile-detail-tag-text")).toBeVisible();
  await expect(page.locator("#mobilePlayerDetailPanel .mobile-detail-tags button").first()).toHaveAttribute("data-tier", /bronze|silver|gold|platinum/);
  await page.locator("#mobilePlayerDetailPanel [data-mobile-modal-tag]").filter({ hasText: tagText }).first().click();
  await expect(page.locator("#mobilePlayerDetailPanel .mobile-detail-tag-text").first()).toBeHidden();
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
  await expect(page.locator("#mobilePlayerDetailPanel")).toContainText("핵심태그");
  await expect(page.locator('#mobilePlayerDetailPanel [data-mobile-modal-tag-section="core"]').first()).toHaveAttribute("data-tier", "bronze");
  if (await page.locator('#mobilePlayerDetailPanel [data-mobile-modal-tag-section="support"]').count()) {
    await page.locator('#mobilePlayerDetailPanel [data-mobile-modal-tag-section="support"]').first().click();
    await expect(page.locator('#mobilePlayerDetailPanel [data-mobile-detail-tag-text="support"]')).toBeVisible();
    await expect(page.locator('#mobilePlayerDetailPanel [data-mobile-detail-tag-text="core"]')).toBeHidden();
  }
  await expect(page.locator("#mobilePlayerDetailPanel")).not.toContainText("구종 정보");

  await page.locator("[data-mobile-detail-close]").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeHidden();

  await page.locator(".mobile-batter-summary").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeVisible();
  await expect(page.locator(".mobile-batter-summary")).toHaveClass(/is-selected/);

  await page.locator("[data-mobile-detail-close]").click();
  await expect(page.locator("#mobilePlayerDetailPanel")).toBeHidden();
});

test("mobile pitcher choices stay inside narrow cards", async ({ page }) => {
  await page.setViewportSize({ width: 268, height: 844 });
  await startFromTitle(page);

  const cards = await page.locator(".pitcher-choice-card").evaluateAll((items) =>
    items.map((card) => {
      const cardRect = card.getBoundingClientRect();
      const children = [card.querySelector(".choice-number"), card.querySelector("strong"), card.querySelector("em"), card.querySelector(".choice-portrait")];
      return {
        noHorizontalScroll: card.scrollWidth <= card.clientWidth + 1,
        childrenFit: children.every((child) => {
          if (!child) return false;
          const rect = child.getBoundingClientRect();
          return rect.left >= cardRect.left - 1 && rect.right <= cardRect.right + 1;
        })
      };
    })
  );

  expect(cards).toHaveLength(3);
  expect(cards.every((card) => card.noHorizontalScroll && card.childrenFit)).toBe(true);
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
