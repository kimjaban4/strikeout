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
    await expect(page.locator("#dugoutOverlay")).toBeHidden();
  }
}

test("스테이지 안내의 스타트 버튼을 눌러야 투구 가능", async ({ page }) => {
  await startFromTitle(page);
  await page.locator(".pitcher-choice-card").first().click();
  await expect(page.locator("#stageOverlay")).toBeVisible();
  await expect(page.locator("#stageStartButton")).toBeVisible();
  await expect(page.locator("#pitchButtons button").first()).toBeDisabled();
  await page.locator("#stageStartButton").click();
  await expect(page.locator("#stageOverlay")).toBeHidden();
  if (await page.locator("#dugoutOverlay").isVisible()) {
    await page.locator(".dugout-choice-card").first().click();
    await expect(page.locator("#dugoutOverlay")).toBeHidden();
  }
  await expect(page.locator("#pitchButtons button").first()).toBeEnabled();
});

test("모듈 로드 후 메인 타이틀과 선발 선택 화면", async ({ page }) => {
  await page.goto("/");
  const mpBoot = await page.evaluate(() => ({
    hasState: Boolean(window.MountPsycho?.state),
    hasEls: Boolean(window.MountPsycho?.els),
    screenPhase: window.MountPsycho?.state?.screenPhase ?? ""
  }));
  expect(mpBoot.hasState).toBe(true);
  expect(mpBoot.hasEls).toBe(true);
  expect(mpBoot.screenPhase).toBe("title");
  await expect(page.locator("#titleOverlay")).toBeVisible();
  await page.locator("#titleStartButton").click();
  const mp = await page.evaluate(() => ({
    choices: window.MountPsycho?.state?.pitcherChoices?.length ?? 0
  }));
  expect(mp.choices).toBe(3);
  await expect(page.locator("#pitcherSelectOverlay")).toBeVisible();
  await expect(page.locator(".pitcher-choice-card")).toHaveCount(3);
});

test("선발 선택 후 투수 카드 태그·스탯 겹침 없음", async ({ page }) => {
  await chooseFirstPitcher(page);
  const layout = await page.evaluate(() => window.MountPsycho?.debug?.assertPitcherCardLayout?.());
  expect(layout?.ok).toBe(true);
  expect(layout?.skipped).toBeFalsy();
  expect((layout?.gapPx ?? 0)).toBeGreaterThanOrEqual(0);
});

test("스테이지 테마는 상단 요약 박스로 계속 확인 가능", async ({ page }) => {
  await chooseFirstPitcher(page);
  const theme = await page.evaluate(() => ({
    id: window.MountPsycho?.state?.stageThemeId,
    stageSummary: document.querySelector("#stageThemePanel .stage-theme-summary strong")?.textContent?.trim() ?? ""
  }));
  expect(theme.id).toBeTruthy();
  expect(theme.stageSummary.length).toBeGreaterThan(0);
  await expect(page.locator("#stageThemeBadge")).toBeVisible();
  await expect(page.locator("#stageThemeBadge strong")).not.toHaveText("");
  await expect(page.locator("#stageThemeCard")).toHaveCount(0);
  await expect(page.locator("#stageThemeDetailOverlay")).toBeHidden();
});

test("상단 스테이지 테마 박스 클릭 시 상세 팝업", async ({ page }) => {
  await chooseFirstPitcher(page);
  await page.locator("#stageThemeBadge").click();
  await expect(page.locator("#stageThemeDetailOverlay")).toBeVisible();
  await expect(page.locator("#stageThemeDetailBody .stage-theme-detail-row")).toHaveCount(4);
  await page.locator("#stageThemeDetailClose").click();
  await expect(page.locator("#stageThemeDetailOverlay")).toBeHidden();
});

test("구종 목록은 PC 2열, 모바일 세로 4열, 짧은 목록 1열", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await chooseFirstPitcher(page);
  const desktop = await page.evaluate(() => getComputedStyle(document.querySelector("#pitchButtons")).gridTemplateColumns.split(" ").length);
  expect(desktop).toBe(2);

  const shortList = await page.evaluate(() => {
    const state = window.MountPsycho.state;
    const original = state.pitcher.repertoire;
    state.pitcher.repertoire = original.slice(0, 2);
    window.MountPsycho.debug.render();
    const columns = getComputedStyle(document.querySelector("#pitchButtons")).gridTemplateColumns.split(" ").length;
    state.pitcher.repertoire = original;
    window.MountPsycho.debug.render();
    return columns;
  });
  expect(shortList).toBe(1);

  await page.setViewportSize({ width: 520, height: 900 });
  const narrowPortrait = await page.evaluate(() => getComputedStyle(document.querySelector("#mobilePitchButtons")).gridTemplateColumns.split(" ").length);
  expect(narrowPortrait).toBe(4);

  await page.setViewportSize({ width: 520, height: 400 });
  const narrowLandscape = await page.evaluate(() => getComputedStyle(document.querySelector("#pitchButtons")).gridTemplateColumns.split(" ").length);
  expect(narrowLandscape).toBe(1);
});

test("구종 번호는 아이콘 왼쪽 위에 겹쳐 표시됨", async ({ page }) => {
  await chooseFirstPitcher(page);
  await expect(page.locator("#pitchButtons .pitch-button").first()).toBeVisible();
  const layout = await page.evaluate(() => {
    return [...document.querySelectorAll(".pitch-button")].every((button) => {
      const icon = button.querySelector(".pitch-icon");
      const number = button.querySelector("kbd");
      if (!icon || !number) return false;
      const ir = icon.getBoundingClientRect();
      const nr = number.getBoundingClientRect();
      return (
        getComputedStyle(number).position === "absolute" &&
        nr.left <= ir.left + 4 &&
        nr.top <= ir.top + 4 &&
        nr.right > ir.left &&
        nr.bottom > ir.top
      );
    });
  });
  expect(layout).toBe(true);
});

test("구종 카드 설명과 부담 힌트는 말줄임 없이 표시됨", async ({ page }) => {
  await chooseFirstPitcher(page);
  await expect(page.locator("#pitchButtons .pitch-button").first()).toBeVisible();
  const cards = await page.evaluate(() => {
    return [...document.querySelectorAll(".pitch-button")].map((button) => {
      const texts = [...button.querySelectorAll(".pitch-name, .pitch-meta, .pitch-role, .pitch-burden-hint")];
      return {
        iconWidth: button.querySelector(".pitch-icon")?.getBoundingClientRect().width ?? 0,
        hint: button.querySelector(".pitch-burden-hint")?.textContent?.trim() ?? "",
        readable: texts.every((text) => {
          const style = getComputedStyle(text);
          return style.textOverflow !== "ellipsis" && style.whiteSpace === "normal" && text.scrollWidth <= text.clientWidth + 1;
        })
      };
    });
  });
  expect(cards.length).toBeGreaterThan(0);
  expect(cards.every((card) => card.iconWidth <= 44)).toBe(true);
  expect(cards.every((card) => card.hint.length > 0)).toBe(true);
  expect(cards.every((card) => card.readable)).toBe(true);
});

test("선발 선택 후 투구·승부 기록", async ({ page }) => {
  await chooseFirstPitcher(page);
  await page.locator("#pitchButtons button").first().click();
  await page.locator(".zone-button.strike-zone-target").first().click({ force: true });
  await page.locator("#releaseTimingButton").click({ force: true });
  await expect(page.locator("#logList .log-item").first()).toBeVisible({ timeout: 8000 });
  const phase = await page.evaluate(() => window.MountPsycho?.state?.screenPhase);
  expect(["pitching", "transition"]).toContain(phase);
});

test("모바일 세로 화면은 독립 UI로 겹침 없이 투구 가능", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

  await expect(page.locator("body")).toHaveClass(/mobile-portrait/);
  await expect(page.locator("body > .app-shell")).toBeHidden();
  await expect(page.locator("#mobileGameShell")).toBeVisible();
  await expect(page.locator("#mobileMissionCard")).toBeVisible();
  await expect(page.locator(".mobile-pitcher-summary")).toBeVisible();
  await expect(page.locator(".mobile-batter-summary")).toBeVisible();
  await expect(page.locator("#mobileStrikeZone")).toBeVisible();
  const mobilePitchCount = await page.evaluate(() => Math.min(4, window.MountPsycho.state.pitcher.repertoire.length));
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button")).toHaveCount(mobilePitchCount);
  await expect(page.locator("#mobileThrowButton")).toBeDisabled();

  const layout = await page.evaluate(() => {
    const selectors = [".mobile-game-header", "#mobileMissionCard", ".mobile-field-scene", ".mobile-control-panel"];
    const rects = selectors.map((selector) => document.querySelector(selector).getBoundingClientRect());
    return {
      fits: rects.every((rect) => rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight + 1),
      ordered: rects.every((rect, index) => index === 0 || rect.top >= rects[index - 1].bottom - 1),
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight
    };
  });
  expect(layout.fits).toBe(true);
  expect(layout.ordered).toBe(true);
  expect(layout.scrollHeight).toBeLessThanOrEqual(layout.innerHeight + 1);

  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  await page.locator("#mobileStrikeZone .mobile-zone-button.is-strike").first().click();
  await expect(page.locator("#mobileThrowButton")).toBeEnabled();
  await page.locator("#mobileThrowButton").click();
  await page.locator("#mobileLogTab").click();
  await expect(page.locator("#mobileInfoPanel")).toBeVisible();
  await expect(page.locator("#mobileInfoPanelBody .log-item").first()).toBeVisible({ timeout: 8000 });
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
  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  await page.locator("#mobileStrikeZone .mobile-zone-button.is-strike").first().click();
  await expect(page.locator("#mobileThrowButton")).toBeEnabled();

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
