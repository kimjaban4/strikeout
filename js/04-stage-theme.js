/* stage theme system — 마운드 심리전 (수동 모듈) */
window.MountPsycho = window.MountPsycho || {};
(function (MP) {
  const REWARD_BIAS_FAMILIES = {
    groundball: ["땅볼계"],
    soft_contact: ["멘탈/운영계"],
    control: ["제구계"],
    strikeout: ["삼진계"],
    psych: ["심리계"],
    first_pitch: ["제구계"],
    operation: ["멘탈/운영계"],
    rare: ["삼진계", "심리계", "멘탈/운영계"]
  };

  const AFFINITY_SCALE = { strong: 1, medium: 0.6, weak: 0.25, exception: -0.55 };

  MP.stageThemeCatalog = {
    contact: {
      id: "contact",
      name: "끈질긴 컨택 타선",
      shortDesc: "쉽게 삼진당하지 않고 파울로 버팁니다.",
      dangerText: "2스트 이후 승부가 길어지고 투구 수가 늘어납니다.",
      counterText: "낮은 공과 정타 억제로 약한 타구를 만들어야 합니다.",
      rewardHint: "땅볼계, 정타 억제 계열 보상에 유리합니다.",
      rewardBias: ["groundball", "soft_contact"],
      stage1Eligible: true,
      riskTier: "stable",
      effects: { contactBonus: 0.05, twoStrikeFoulBonus: 0.08, whiffPenalty: -0.04, powerPenalty: -0.03 },
      lineup: { contact: 5, power: -3, eye: 2 },
      bossSynergy: ["cutMaster"],
      bossCounter: ["sluggerKing"],
      strongTendencyId: "twoStrike",
      exceptionTendencyId: "firstPitchAggro"
    },
    power: {
      id: "power",
      name: "장타 타선",
      shortDesc: "노린 공이 오면 크게 받아칩니다.",
      dangerText: "실투와 읽힌 패턴이 바로 장타로 이어집니다.",
      counterText: "낮은 공, 패턴 변화, 볼 유도를 섞어 정타를 피하세요.",
      rewardHint: "장타 억제, 희귀 보조태그 보상에 유리합니다.",
      rewardBias: ["rare", "groundball"],
      stage1Eligible: false,
      riskTier: "risky",
      effects: { targetMatchPowerBonus: 0.06, centerMistakeHomerun: 0.06, powerBonus: 0.04, whiffBonus: 0.03 },
      lineup: { power: 6, contact: -2, guess: 2 },
      bossSynergy: ["sluggerKing"],
      bossCounter: ["walkMonster"],
      strongTendencyId: "slugger",
      exceptionTendencyId: "walkHunter"
    },
    eye: {
      id: "eye",
      name: "선구안 타선",
      shortDesc: "존 밖 공을 잘 참습니다.",
      dangerText: "볼넷 위험이 커지고 유인구 효율이 떨어집니다.",
      counterText: "초구 스트라이크, 코너 제구, 루킹 승부가 필요합니다.",
      rewardHint: "제구계, 볼넷 억제 보상에 유리합니다.",
      rewardBias: ["control", "strikeout"],
      stage1Eligible: true,
      riskTier: "stable",
      effects: { chasePenalty: -0.06, eyeBonus: 0.05, walkPressure: 0.04, lookingStrikeBonus: 0.03 },
      lineup: { eye: 6, contact: 1, power: -2 },
      bossSynergy: ["walkMonster"],
      bossCounter: ["sluggerKing"],
      strongTendencyId: "walkHunter",
      exceptionTendencyId: "firstPitchAggro"
    },
    tricky: {
      id: "tricky",
      name: "반응 숨김 타선",
      shortDesc: "반응을 그대로 믿기 어렵습니다.",
      dangerText: "거짓 단서와 역노림이 늘어납니다.",
      counterText: "한 공 반응보다 3구 이상 흐름을 보고 판단하세요.",
      rewardHint: "심리계, 추천 보완 보상에 유리합니다.",
      rewardBias: ["psych"],
      stage1Eligible: false,
      riskTier: "risky",
      effects: { falseClueBonus: 0.06, readPenalty: 0.08, reverseReadBonus: 0.04 },
      lineup: { guess: 5, contact: 2 },
      bossSynergy: ["geniusEye"],
      bossCounter: ["cutMaster"],
      strongMindId: "tricky",
      exceptionMindId: "honest",
      strongTendencyId: "reactive",
      exceptionTendencyId: "firstPitchAggro"
    },
    first_pitch: {
      id: "first_pitch",
      name: "초구 공격 타선",
      shortDesc: "초구부터 적극적으로 배트를 냅니다.",
      dangerText: "초구 실투 시 장타 위험이 큽니다.",
      counterText: "초구의 목적을 정하고 낮은 코스나 바깥 볼 확인을 섞으세요.",
      rewardHint: "초구, 강속구 계열 보상에 유리합니다.",
      rewardBias: ["first_pitch", "strikeout"],
      stage1Eligible: true,
      riskTier: "risky",
      effects: { firstPitchSwingBonus: 0.07, firstPitchContactBonus: 0.05, firstPitchMistakeHomerun: 0.05 },
      lineup: { contact: 3, power: 2, guess: 2 },
      bossSynergy: ["sluggerKing"],
      bossCounter: ["walkMonster"],
      strongTendencyId: "firstPitchAggro",
      exceptionTendencyId: "firstPitchWatch"
    },
    patience: {
      id: "patience",
      name: "참는 타선",
      shortDesc: "공을 오래 보고 불리한 공은 참습니다.",
      dangerText: "유인구 효율이 떨어지고 볼넷 위험이 늘어납니다.",
      counterText: "초구와 1스트를 먼저 잡고 코너 스트라이크로 압박하세요.",
      rewardHint: "제구, 풀카운트 계열 보상에 유리합니다.",
      rewardBias: ["control", "operation"],
      stage1Eligible: true,
      riskTier: "stable",
      effects: { earlySwingPenalty: -0.06, lateCountEyeBonus: 0.05, chasePenalty: -0.04, earlyStrikeWeakness: 0.04 },
      lineup: { eye: 4, contact: 2, power: -1 },
      bossSynergy: ["walkMonster"],
      bossCounter: ["sluggerKing"],
      strongTendencyId: "firstPitchWatch",
      exceptionTendencyId: "firstPitchAggro"
    },
    bottom_revolt: {
      id: "bottom_revolt",
      name: "하위 반란 타선",
      shortDesc: "하위타선도 쉽게 물러나지 않습니다.",
      dangerText: "6번 이후 방심하면 흐름이 넘어갑니다.",
      counterText: "하위타선에도 안정 제구와 부담 관리가 필요합니다.",
      rewardHint: "운영계, 보상 선택 강화에 유리합니다.",
      rewardBias: ["operation", "rare"],
      stage1Eligible: false,
      riskTier: "risky",
      effects: { bottomSlotBonus: 0.06, twoOutBottomBonus: 0.05 },
      lineup: { contact: 3, guess: 2 },
      bossSynergy: ["clutch"],
      bossCounter: ["geniusEye"],
      bottomBossWeight: true,
      strongTendencyId: "twoStrike",
      exceptionTendencyId: "slugger"
    }
  };

  MP.stageThemeStrengthFor = function stageThemeStrengthFor(stageIndex) {
    const scales = [0.7, 1, 1.2];
    return scales[stageIndex] ?? scales[scales.length - 1];
  };

  MP.getStageTheme = function getStageTheme(id) {
    return id ? MP.stageThemeCatalog[id] || null : null;
  };

  MP.themeRewardFamilies = function themeRewardFamilies(theme) {
    if (!theme?.rewardBias?.length) return [];
    const set = new Set();
    theme.rewardBias.forEach((key) => {
      (REWARD_BIAS_FAMILIES[key] || []).forEach((family) => set.add(family));
    });
    return [...set];
  };

  MP.assignThemeAffinities = function assignThemeAffinities() {
    const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = slots.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }
    const map = {};
    slots.forEach((slot, index) => {
      if (index < 3) map[slot] = "strong";
      else if (index < 6) map[slot] = "medium";
      else if (index < 8) map[slot] = "weak";
      else map[slot] = "exception";
    });
    return map;
  };

  function scaleEffect(value, affinity, stageIndex) {
    if (!value) return 0;
    const strength = MP.stageThemeStrengthFor(stageIndex);
    const affinityScale = AFFINITY_SCALE[affinity] ?? 0.25;
    return value * strength * Math.abs(affinityScale) * (affinityScale < 0 ? -1 : 1);
  }

  MP.applyThemeToBatterStats = function applyThemeToBatterStats(stats, theme, affinity, stageIndex) {
    if (!theme?.lineup || affinity === "weak") return stats;
    const next = { ...stats };
    Object.entries(theme.lineup).forEach(([key, delta]) => {
      const statKey = key === "contact" ? "컨택" : key === "power" ? "파워" : key === "eye" ? "선구" : key === "guess" ? "예측" : null;
      if (!statKey) return;
      const scaled = Math.round(scaleEffect(delta, affinity, stageIndex));
      next[statKey] = Math.max(20, Math.min(99, (next[statKey] || 0) + scaled));
    });
    return next;
  };

  MP.applyThemeToWeights = function applyThemeToWeights(weights, theme, affinity, stageIndex) {
    const next = { ...weights };
    if (!theme) return next;
    const fx = theme.effects || {};
    if (theme.id === "power" && affinity !== "exception") {
      next.fast = (next.fast || 0) + scaleEffect(1.2, affinity, stageIndex);
    }
    if (theme.id === "eye" && affinity !== "exception") {
      next.breaking = (next.breaking || 0) + scaleEffect(0.8, affinity, stageIndex);
      next.offspeed = (next.offspeed || 0) + scaleEffect(0.6, affinity, stageIndex);
    }
    if (theme.id === "first_pitch" && affinity !== "exception") {
      next.fast = (next.fast || 0) + scaleEffect(1.5, affinity, stageIndex);
    }
    if (affinity === "exception") {
      next.fast = (next.fast || 0) + 1.5;
      next.breaking = (next.breaking || 0) + 0.5;
    }
    if (fx.powerPenalty && affinity !== "exception") {
      next.fast = Math.max(1, (next.fast || 0) - scaleEffect(0.4, affinity, stageIndex));
    }
    return next;
  };

  MP.pickBossGimmickForTheme = function pickBossGimmickForTheme(theme, bossGimmicks, pickFn, chanceFn) {
    if (!theme || !bossGimmicks?.length) return pickFn(bossGimmicks);
    const synergyIds = theme.bossSynergy || [];
    const counterIds = theme.bossCounter || [];
    const synergy = bossGimmicks.filter((item) => synergyIds.includes(item.id));
    const counter = bossGimmicks.filter((item) => counterIds.includes(item.id));
    if (chanceFn(0.7) && synergy.length) return pickFn(synergy);
    if (counter.length) return pickFn(counter);
    return pickFn(bossGimmicks);
  };

  const BUILD_SYNERGY = {
    contact: {
      synergy: ["core_groundball_architect", "core_cutter_softcontact"],
      counter: ["core_high_fastballer"]
    },
    power: {
      synergy: ["core_high_fastballer", "core_finisher_collector"],
      counter: ["core_groundball_architect", "core_cutter_softcontact"]
    },
    eye: {
      synergy: ["core_corner_artist", "core_first_pitch_pressure"],
      counter: ["core_bait_designer"]
    },
    tricky: {
      synergy: ["core_counter_pitcher", "core_breaking_maestro"],
      counter: ["core_game_manager"]
    },
    first_pitch: {
      synergy: ["core_first_pitch_pressure", "core_high_fastballer"],
      counter: ["core_corner_artist", "core_bait_designer"]
    },
    patience: {
      synergy: ["core_corner_artist", "core_clutch_pitcher", "core_game_manager"],
      counter: ["core_first_pitch_pressure", "core_bait_designer"]
    },
    bottom_revolt: {
      synergy: ["core_game_manager", "core_clutch_pitcher"],
      counter: ["core_finisher_collector"]
    }
  };

  function themeChoiceWeight(theme, pitcher) {
    const map = BUILD_SYNERGY[theme.id] || {};
    let weight = 1;
    const coreId = pitcher?.coreTagId;
    if (coreId && map.synergy?.includes(coreId)) weight += 0.9;
    if (coreId && map.counter?.includes(coreId)) weight = Math.max(0.45, weight - 0.55);
    if (theme.riskTier === "risky") weight += 0.15;
    return weight;
  }

  function pickWeightedTheme(pool, pitcher, excludeIds = []) {
    const candidates = pool.filter((theme) => !excludeIds.includes(theme.id));
    if (!candidates.length) return null;
    const weighted = candidates.map((theme) => ({ theme, weight: themeChoiceWeight(theme, pitcher) }));
    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    for (const item of weighted) {
      roll -= item.weight;
      if (roll <= 0) return item.theme;
    }
    return weighted[weighted.length - 1].theme;
  }

  MP.scoreThemeForPitcher = function scoreThemeForPitcher(theme, pitcher) {
    return themeChoiceWeight(theme, pitcher);
  };

  MP.themeFitLabel = function themeFitLabel(theme, pitcher) {
    const score = themeChoiceWeight(theme, pitcher);
    if (score >= 1.75) return { text: "내 빌드와 궁합 양호", tone: "good" };
    if (score <= 0.75) return { text: "내 빌드에 불리할 수 있음", tone: "warn" };
    return { text: "표준 난이도", tone: "neutral" };
  };

  MP.pickStage1Theme = function pickStage1Theme() {
    const pool = Object.values(MP.stageThemeCatalog).filter((theme) => theme.stage1Eligible);
    return pool[Math.floor(Math.random() * pool.length)]?.id || "contact";
  };

  MP.rollThemeChoices = function rollThemeChoices(nextStageIndex, pitcher) {
    const all = Object.values(MP.stageThemeCatalog);
    const count = nextStageIndex >= 2 ? 3 : 2;
    if (count === 2) {
      const stable = all.filter((t) => t.riskTier === "stable");
      const risky = all.filter((t) => t.riskTier === "risky");
      const a = pickWeightedTheme(stable.length ? stable : all, pitcher) || all[0];
      const b =
        pickWeightedTheme(risky.length ? risky : all, pitcher, [a.id]) ||
        all.find((t) => t.id !== a.id) ||
        a;
      return [a, b];
    }
    const picked = [];
    const pickedIds = [];
    while (picked.length < 3 && picked.length < all.length) {
      const theme = pickWeightedTheme(all, pitcher, pickedIds);
      if (!theme) break;
      picked.push(theme);
      pickedIds.push(theme.id);
    }
    return picked;
  };

  MP.stageThemePitchEffect = function stageThemePitchEffect(themeId, batter, context) {
    const theme = MP.getStageTheme(themeId);
    if (!theme?.effects) return {};
    const affinity = batter?.themeAffinity || "medium";
    const stageIndex = context.stageIndex ?? 0;
    const scale = (value) => scaleEffect(value, affinity, stageIndex);
    const fx = theme.effects;
    const out = {
      swing: 0,
      chase: 0,
      contact: 0,
      foul: 0,
      contactQuality: 0,
      homerunBonus: 0,
      falseClueBonus: 0,
      readPenalty: 0
    };
    const balls = context.balls ?? 0;
    const strikes = context.strikes ?? 0;
    const isFirstPitch = balls === 0 && strikes === 0;
    const isTwoStrike = strikes === 2;
    const isBehind = balls >= 3;
    const slot = batter?.slot ?? 1;
    const isBottom = slot >= 7;
    const twoOut = (context.outs ?? 0) >= 2;
    const isLow = context.height === "low";
    const isEdge = context.side === "inside" || context.side === "outside";
    const isSlow = context.pitchCategory === "breaking" || context.pitchCategory === "offspeed";
    const switched = context.categorySwitch || context.sideSwitch;

    if (fx.contactBonus) out.contact += scale(fx.contactBonus);
    if (theme.id === "contact" && fx.contactBonus) out.contactQuality -= scale(fx.contactBonus) * 6;
    if (fx.whiffPenalty) out.swing += scale(fx.whiffPenalty);
    if (fx.twoStrikeFoulBonus && isTwoStrike) out.foul += scale(fx.twoStrikeFoulBonus);
    if (fx.powerPenalty) out.contactQuality -= scale(fx.powerPenalty) * 8;
    if (fx.chasePenalty && !context.inZone) out.chase += scale(fx.chasePenalty);
    if (fx.eyeBonus) out.chase += scale(-fx.eyeBonus * 0.5);
    if (fx.walkPressure && !context.inZone) out.chase += scale(-fx.walkPressure * 0.4);
    if (fx.lookingStrikeBonus && context.inZone && context.calledStrikeBias) out.swing += scale(-fx.lookingStrikeBonus);
    if (fx.firstPitchSwingBonus && isFirstPitch) out.swing += scale(fx.firstPitchSwingBonus);
    if (fx.firstPitchContactBonus && isFirstPitch && context.inZone) out.contact += scale(fx.firstPitchContactBonus);
    if (fx.firstPitchMistakeHomerun && isFirstPitch && context.centerMistake) out.homerunBonus += scale(fx.firstPitchMistakeHomerun);
    if (fx.earlySwingPenalty && balls <= 1 && strikes <= 1) out.swing += scale(fx.earlySwingPenalty);
    if (fx.lateCountEyeBonus && isBehind) out.chase += scale(-fx.lateCountEyeBonus);
    if (fx.earlyStrikeWeakness && balls <= 1 && context.inZone) out.swing += scale(-fx.earlyStrikeWeakness);
    if (fx.targetMatchPowerBonus && context.targetMatch) {
      out.contactQuality += scale(fx.targetMatchPowerBonus) * 10;
      out.homerunBonus += scale(fx.targetMatchPowerBonus);
    }
    if (fx.centerMistakeHomerun && context.centerMistake) out.homerunBonus += scale(fx.centerMistakeHomerun);
    if (fx.powerBonus) out.contactQuality += scale(fx.powerBonus) * 8;
    if (fx.whiffBonus) out.swing += scale(fx.whiffBonus);
    if (fx.falseClueBonus) out.falseClueBonus += scale(fx.falseClueBonus);
    if (fx.readPenalty) out.readPenalty += scale(fx.readPenalty);
    if (fx.bottomSlotBonus && isBottom) {
      out.contact += scale(fx.bottomSlotBonus);
      out.contactQuality += scale(fx.bottomSlotBonus) * 6;
    }
    if (fx.twoOutBottomBonus && isBottom && twoOut) {
      out.contact += scale(fx.twoOutBottomBonus);
    }
    const counter = (value) => Math.abs(scale(value));
    if (theme.id === "contact" && isLow && isSlow) {
      out.contact -= counter(0.03);
      out.contactQuality -= counter(0.5) * 8;
    }
    if (theme.id === "power" && (isLow || isEdge) && !context.centerMistake) {
      out.contactQuality -= counter(0.55) * 9;
      out.homerunBonus -= counter(0.03);
    }
    if ((theme.id === "eye" || theme.id === "patience") && context.inZone && (isEdge || isFirstPitch)) {
      out.swing -= counter(0.03);
      out.contactQuality -= counter(0.3) * 5;
    }
    if (theme.id === "tricky" && switched) {
      out.falseClueBonus -= counter(0.03);
      out.contactQuality -= counter(0.35) * 6;
    }
    if (theme.id === "first_pitch" && isFirstPitch && (isLow || isEdge)) {
      out.contact -= counter(0.02);
      out.contactQuality -= counter(0.5) * 7;
    }
    if (theme.id === "bottom_revolt" && isBottom && context.inZone && (isLow || isEdge)) {
      out.contactQuality -= counter(0.45) * 7;
    }
    return out;
  };

  MP.applyThemeIdentity = function applyThemeIdentity(theme, affinity, mind, tendency, mindTypes, tendencies) {
    if (!theme || affinity === "weak") return { mind, tendency };
    let nextMind = mind;
    let nextTendency = tendency;
    const tendencyId =
      affinity === "exception" ? theme.exceptionTendencyId : affinity === "strong" ? theme.strongTendencyId : null;
    const mindId = affinity === "exception" ? theme.exceptionMindId : affinity === "strong" ? theme.strongMindId : null;
    if (tendencyId && tendencies?.length) {
      const found = tendencies.find((item) => item.id === tendencyId);
      if (found) nextTendency = { ...found };
    }
    if (mindId && mindTypes?.length) {
      const found = mindTypes.find((item) => item.id === mindId);
      if (found) nextMind = { ...found };
    }
    return { mind: nextMind, tendency: nextTendency };
  };

  MP.themeReverseReadEase = function themeReverseReadEase(themeId, batter, stageIndex) {
    const theme = MP.getStageTheme(themeId);
    if (!theme?.effects?.reverseReadBonus) return 0;
    return scaleEffect(theme.effects.reverseReadBonus, batter?.themeAffinity || "medium", stageIndex);
  };

  MP.themeRecommendationPenalty = function themeRecommendationPenalty(themeId, stageIndex) {
    const theme = MP.getStageTheme(themeId);
    if (!theme?.effects?.readPenalty) return 0;
    return MP.stageThemeStrengthFor(stageIndex) * theme.effects.readPenalty * 0.45;
  };

  MP.buildThemeAtBatRewardEntries = function buildThemeAtBatRewardEntries(theme) {
    if (!theme?.rewardBias?.length) return [];
    const entries = [];
    const pushStat = (stat, title, desc) => entries.push({ type: "stat", stat, amount: 2, title, desc, themeReward: true });
    if (theme.rewardBias.includes("groundball")) {
      pushStat("변화", "땅볼 유도 감각", "투수 능력치 '변화'가 +2 오릅니다.");
    }
    if (theme.rewardBias.includes("control") || theme.rewardBias.includes("first_pitch")) {
      pushStat("제구", "코너 제구 강화", "투수 능력치 '제구'가 +2 오릅니다.");
    }
    if (theme.rewardBias.includes("psych")) {
      pushStat("예측", "심리전 분석", "투수 능력치 '예측'이 +2 오릅니다.");
    }
    if (theme.rewardBias.includes("strikeout")) {
      pushStat("멘탈", "루킹 운영", "투수 능력치 '멘탈'이 +2 오릅니다.");
    }
    if (theme.rewardBias.includes("operation") || theme.rewardBias.includes("soft_contact")) {
      pushStat("멘탈", "경기 운영", "투수 능력치 '멘탈'이 +2 오릅니다.");
    }
    if (theme.rewardBias.includes("rare")) {
      pushStat("예측", "희귀 분석 데이터", "투수 능력치 '예측'이 +2 오릅니다.");
    }
    return entries.slice(0, 2);
  };

  MP.themeSupportTagWeight = function themeSupportTagWeight(tag, theme, baseWeight) {
    const families = MP.themeRewardFamilies(theme);
    if (!families.length) return baseWeight;
    const family = tag.family || "";
    if (families.includes(family)) return baseWeight * 2.2;
    return baseWeight;
  };
})(window.MountPsycho);
