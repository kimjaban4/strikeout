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
  await expect(page.locator("#mobileDuelReadRisk")).toHaveText(/\d+%/);
  await expect(page.locator("#mobileReleasePanel")).toBeHidden();

  await chooseMobilePitchAndZone(page);
  await expect(page.locator("#mobileReleasePanel")).toBeVisible();
});

test("mobile throw records a log entry", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);
  await chooseMobilePitchAndZone(page);

  await page.locator("#mobileReleasePanel").dispatchEvent("pointerdown");
  await expect(page.locator("#mobileRecentLog .mobile-recent-log-row").first()).toBeVisible({ timeout: 8000 });
  await expect(page.locator("#mobileRecentLog .mobile-recent-log-row").first()).not.toHaveClass(/is-batter-marker/);
  await expect(page.locator("#mobileRecentLog")).toContainText("최근 3구");
  await expect(page.locator("#mobileRecentLog")).toContainText("타석 해석");
  await page.locator("#mobileRecentLogMore").click();
  await expect(page.locator("#mobileInfoPanel")).toBeVisible();
  await expect(page.locator("#mobileInfoPanelBody .mobile-pitch-detail-row").first()).toBeVisible({ timeout: 8000 });
});

test("mobile player tags open detail modal with tag text", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await chooseFirstPitcher(page);

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
