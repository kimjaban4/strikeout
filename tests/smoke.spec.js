import { test, expect } from "@playwright/test";

async function chooseFirstPitcher(page) {
  await page.goto("/");
  await page.locator(".pitcher-choice-card").first().click();
  await expect(page.locator("#pitcherSelectOverlay")).toBeHidden();
}

test("모듈 로드 후 선발 선택 화면", async ({ page }) => {
  await page.goto("/");
  const mp = await page.evaluate(() => ({
    hasState: Boolean(window.MountPsycho?.state),
    hasEls: Boolean(window.MountPsycho?.els),
    choices: window.MountPsycho?.state?.pitcherChoices?.length ?? 0
  }));
  expect(mp.hasState).toBe(true);
  expect(mp.hasEls).toBe(true);
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

test("스테이지 테마는 적용되지만 상시 카드는 노출하지 않음", async ({ page }) => {
  await chooseFirstPitcher(page);
  const theme = await page.evaluate(() => ({
    id: window.MountPsycho?.state?.stageThemeId,
    stageLines: document.querySelectorAll("#stageThemePanel .stage-theme-line").length
  }));
  expect(theme.id).toBeTruthy();
  expect(theme.stageLines).toBe(4);
  await expect(page.locator("#stageThemeBadge")).toHaveCount(0);
  await expect(page.locator("#stageThemeCard")).toHaveCount(0);
  await expect(page.locator("#stageThemeDetailOverlay")).toHaveCount(0);
});

test("구종 목록은 기본 2열, 짧은 목록과 좁은 화면은 1열", async ({ page }) => {
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
  const narrow = await page.evaluate(() => getComputedStyle(document.querySelector("#pitchButtons")).gridTemplateColumns.split(" ").length);
  expect(narrow).toBe(1);
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
  await page.locator(".zone-button.strike-zone-target").first().click();
  await expect(page.locator("#logList .log-item").first()).toBeVisible({ timeout: 8000 });
  const phase = await page.evaluate(() => window.MountPsycho?.state?.screenPhase);
  expect(["pitching", "transition"]).toContain(phase);
});
