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
  await page.locator("#mobileStrikeZone .mobile-zone-button.is-strike").first().click();
  await expect(page.locator("#mobileReleasePanel")).toBeVisible();
  await expect(page.locator("#mobileReleasePanel")).toHaveClass(/is-active/);
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
      return {
        shellVisible: shell.width > 0 && shell.height > 0,
        shellFits: shell.left >= 0 && shell.right <= innerWidth && shell.top >= 0 && shell.bottom <= innerHeight,
        ordered: parts.every((rect, index) => index === 0 || rect.top >= parts[index - 1].bottom - 1)
      };
    });
    expect(layout).toEqual({ shellVisible: true, shellFits: true, ordered: true });
  }
});

test("mobile pitch controls render and unlock throw after choosing a zone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  const mobilePitchCount = await page.evaluate(() => Math.min(5, window.MountPsycho.state.pitcher.repertoire.length));
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button")).toHaveCount(mobilePitchCount);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button > b")).toHaveCount(0);
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button").first()).toHaveAttribute("data-burden", /stable|warn|danger/);
  await expect(page.locator(".mobile-duel-read-card")).not.toContainText(/추천|예측/);
  await expect(page.locator("#mobileDuelReadRisk")).toHaveText(/안정|경계|위험/);
  await expect(page.locator("#mobileReleasePanel")).toBeHidden();
  await expect(page.locator('#mobileStrikeZone [data-target-col="0"][data-target-row="1"]')).toHaveAttribute("aria-label", "바깥쪽");
  await expect(page.locator('#mobileStrikeZone [data-target-col="2"][data-target-row="1"]')).toHaveAttribute("aria-label", "몸쪽");

  await chooseMobilePitchAndZone(page);
  await expect(page.locator("#mobileReleasePanel")).toBeVisible();
});

test("mobile throw records a log entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await expect(page.locator("#mobileRecentLog .is-batter-marker").first()).toContainText(/번 타자/);
  await expect(page.locator(".mobile-suspicion-card")).toBeVisible();
  await page.locator(".mobile-suspicion-card").click();
  await expect(page.locator("#mobileInfoPanel")).toBeVisible();
  await expect(page.locator("#mobileInfoPanelTitle")).toHaveText("타자 의심도");
  await page.locator("#mobileInfoPanelClose").click();
  await chooseMobilePitchAndZone(page);

  await page.locator("#mobileReleasePanel").dispatchEvent("pointerdown");
  await expect(page.locator("#mobileRecentLog .mobile-recent-log-row").first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator("#mobileRecentLog .is-batter-marker").first()).toContainText(/번 타자/);
  await expect(page.locator("#mobileRecentLog .mobile-pitch-compact-row").first()).toContainText(/구/);
  await expect(page.locator("#mobileRecentLog .mobile-pitch-compact-row").first().locator(".mobile-pitch-zone")).toHaveText(/바깥|몸쪽|중앙|높게|낮게/);
  await expect(page.locator("#mobileRecentLog .mobile-pitch-compact-row small").first()).toBeVisible();
  await page.locator("#mobileRecentLogMore").click();
  await expect(page.locator("#mobileInfoPanel")).toBeVisible();
  await expect(page.locator("#mobileInfoPanelBody .mobile-pitch-detail-row").first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator("#mobileInfoPanelBody .mobile-pitch-detail-row").first()).toContainText(/타자가|같은|흐름|다음 공|빠른 공|코스|스윙/);
});

test("stage card reward assigns performance tokens to cards", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    Math.random = () => 0.99;
    const run = MP.state.stageRun;
    run.rewardBoost.absorbed = 3;
    run.rewardBoost.performanceScore = 19;
    run.stagePerformanceEvents = [
      { key: "strikeout", label: "설계 삼진", score: 3, source: "삼진" },
      { key: "doublePlay", label: "병살 유도", score: 4, source: "병살" }
    ];
    MP.state.lastStageResult = MP.debug.calculateStageResult();
    MP.debug.openRewardDraft("스테이지 보상", null, "stageCard");
  });
  await expect(page.locator("#rewardAbsorbList")).toBeHidden();
  await expect(page.locator("#rewardChoiceList .reward-card-upgrade-token")).toHaveCount(2);
  await expect(page.locator("#rewardChoiceList .reward-card-upgrade-token").filter({ hasText: /설계 삼진/ })).toHaveCount(1);
  await expect(page.locator("#rewardChoiceList .reward-rarity-badge--core")).toHaveCount(1);
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
        resultText: "판단 적중\n강속구 구위 상승",
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
  await expect(page.locator(".dugout-result-card")).toContainText(/강속구 제구/);
  await expect(page.locator(".dugout-result-card")).toContainText(/최종 카드 보상 성과/);
  await page.locator("[data-dugout-continue]").click();
  await expect(page.locator("#dugoutOverlay")).toBeHidden();
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
  await expect(page.locator("body")).not.toHaveClass(/game-overlay-open/);
  await expect(page.locator("#mobileGameShell")).toBeVisible();
  await expect(page.locator("#rewardOverlay")).toBeVisible({ timeout: 3000 });
  await expect(page.locator("#rewardChoiceList .reward-choice-card")).toHaveCount(3);
});

test("natural stage final out opens stage reward cards", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await page.evaluate(() => {
    const MP = window.MountPsycho;
    MP.state.inning = MP.debug.currentStageInnings();
    MP.state.outs = 2;
    MP.debug.addOut();
    MP.debug.finishAtBat("GROUND OUT!", "테스트 스테이지 종료");
  });
  await expect(page.locator("#rewardOverlay")).toBeVisible({ timeout: 3000 });
  await expect(page.locator("#rewardTitle")).toContainText("스테이지 보상");
  await expect(page.locator("#rewardChoiceList .reward-choice-card")).toHaveCount(3);
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
