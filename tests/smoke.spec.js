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

async function chooseMobilePitchAndZone(page) {
  await page.locator("#mobilePitchButtons .mobile-pitch-button").first().click();
  await page.locator("#mobileStrikeZone .mobile-zone-button.is-strike").first().click();
  await expect(page.locator("#mobileThrowButton")).toBeEnabled();
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
      const parts = [".mobile-game-header", "#mobileMissionCard", ".mobile-field-scene", ".mobile-control-panel"]
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

  const mobilePitchCount = await page.evaluate(() => Math.min(4, window.MountPsycho.state.pitcher.repertoire.length));
  await expect(page.locator("#mobilePitchButtons .mobile-pitch-button")).toHaveCount(mobilePitchCount);
  await expect(page.locator("#mobileThrowButton")).toBeDisabled();

  await chooseMobilePitchAndZone(page);
});

test("mobile throw records a log entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await chooseMobilePitchAndZone(page);

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
