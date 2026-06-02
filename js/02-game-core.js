/* Generated from game.js by tools/split-game-modules.mjs. Do not edit directly. */
/* game core (logic + UI + bootstrap) — 마운드 심리전 */
window.MountPsycho = window.MountPsycho || {};
(function (MP) {
  const {
    pitchLibrary,
    categoryNames,
    stageInnings,
    stageRunLimits,
    GAME_TIMING,
    SCREEN_PHASE,
    batterPortraits,
    pitcherPortraits,
    pitcherStatOrder,
    requiredFastballIds,
    pitchVelocityAdjust,
    audioPaths,
    audioState,
    pitcherProfiles,
    pitcherTagCatalog,
    coreTagCatalog,
    supportTagMeta,
    coreEvolutionPatternSets,
    coreEvolutionCatalog,
    batterTagCatalog,
    firstNames,
    lastNames,
    catcherTypes,
    batterMindTypes,
    hiddenTendencies,
    memoryGrades,
    bossGimmicks,
    ballIntentPlans,
    pitchBurdenConfig,
    pitchMasteryConfig,
    pitchLevelNames,
    courseZones,
    state,
    els,
    timingTimer,
    autoAdvanceTimer,
    courseFlashTimer,
    inningBannerTimer,
    pitchFlightFrame,
    rewardTimer,
    gameOverTimer,
    uiEventsBound
  } = MP;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getAudio(name) {
  if (typeof Audio === "undefined") return null;
  if (name === "bgm") {
    if (!audioState.bgm) {
      audioState.bgm = new Audio(audioPaths.bgm);
      audioState.bgm.loop = false;
      audioState.bgm.volume = 0.26;
      audioState.bgm.preload = "auto";
      audioState.bgm.addEventListener("ended", () => {
        audioState.bgm.currentTime = 0;
        audioState.bgm.play().catch(() => {});
      });
    }
    return audioState.bgm;
  }
  if (!audioState.effects[name]) {
    const audio = new Audio(audioPaths[name]);
    audio.volume = name === "homerun" ? 0.62 : 0.48;
    audio.preload = "auto";
    audioState.effects[name] = audio;
  }
  return audioState.effects[name];
}

function unlockAudio() {
  audioState.unlocked = true;
  startBgm();
}

function startBgm() {
  const bgm = getAudio("bgm");
  if (!bgm || !audioState.unlocked || audioState.muted) return;
  bgm.muted = false;
  bgm.play().catch(() => {});
  if (!audioState.bgmTimer) {
    audioState.bgmTimer = window.setInterval(() => {
      if (!audioState.bgm || !Number.isFinite(audioState.bgm.duration) || audioState.bgm.duration <= 0) return;
      if (audioState.bgm.paused || audioState.muted) return;
      if (audioState.bgm.duration - audioState.bgm.currentTime <= 0.42) {
        audioState.bgm.currentTime = 0.03;
        audioState.bgm.play().catch(() => {});
      }
    }, 80);
  }
}

function updateBgmToggle() {
  if (!els.bgmToggle) return;
  els.bgmToggle.classList.toggle("off", audioState.muted);
  els.bgmToggle.setAttribute("aria-pressed", String(audioState.muted));
  els.bgmToggle.textContent = audioState.muted ? "BGM OFF" : "BGM";
  els.bgmToggle.title = audioState.muted ? "BGM 켜기" : "BGM 끄기";
}

function toggleBgm() {
  audioState.muted = !audioState.muted;
  const bgm = getAudio("bgm");
  if (bgm) {
    bgm.muted = audioState.muted;
    if (audioState.muted) bgm.pause();
    else {
      audioState.unlocked = true;
      startBgm();
    }
  }
  updateBgmToggle();
}

function playEffect(name) {
  const audio = getAudio(name);
  if (!audio || !audioState.unlocked) return;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function playResultSound(result) {
  if (result.result === "homerun") {
    playEffect("homerun");
    return;
  }
  if (result.result === "single" || result.result === "double") {
    playEffect("hit");
    return;
  }
  if (result.result === "swingingStrike") {
    playEffect("swing");
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(probability) {
  return Math.random() < clamp(probability, 0.02, 0.98);
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function sample(items, count) {
  const pool = [...items];
  const result = [];
  while (pool.length && result.length < count) {
    result.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return result;
}

function clonePitch(pitch) {
  return { ...pitch };
}

function pitchById(id) {
  return pitchLibrary.find((pitch) => pitch.id === id);
}

function requiredFastballs() {
  return requiredFastballIds.map(pitchById).filter(Boolean);
}

function pitchesByCategory(category) {
  return pitchLibrary.filter((pitch) => pitch.category === category);
}

function sortRepertoire(pitches) {
  return [...pitches]
    .filter(Boolean)
    .sort((a, b) => pitchLibrary.findIndex((pitch) => pitch.id === a.id) - pitchLibrary.findIndex((pitch) => pitch.id === b.id));
}

function tagById(tagId) {
  return (
    pitcherTagCatalog.find((tag) => tag.id === tagId) ||
    coreTagCatalog.find((tag) => tag.id === tagId) ||
    null
  );
}

function ensurePitcherTagFields(pitcher) {
  if (!pitcher) return;
  pitcher.coreEvolutionId = pitcher.coreEvolutionId || null;
  pitcher.bonusTags = pitcher.bonusTags || [];
  pitcher.bonusTagTiers = pitcher.bonusTagTiers || {};
  pitcher.bonusTags.forEach((tagId) => {
    if (!pitcher.bonusTagTiers[tagId]) pitcher.bonusTagTiers[tagId] = 1;
  });
}

function coreEvolutionById(evolutionId) {
  return coreEvolutionCatalog.find((item) => item.id === evolutionId) || null;
}

function coreTagNameById(tagId) {
  return coreTagCatalog.find((tag) => tag.id === tagId)?.name || "핵심태그";
}

function evolutionPitchContext(pitch, location, atBat, intent) {
  const history = atBat?.pitchHistory || [];
  const prevCategory = history.length ? history[history.length - 1] : null;
  const lowCourse = location.row >= 2;
  const highCourse = location.row <= 0;
  const edge = location.inZone && (location.col <= 0 || location.col >= 2 || location.row <= 0 || location.row >= 2);
  return {
    fullCount: state.balls === 3 && state.strikes === 2,
    twoStrike: state.strikes >= 2,
    beforeTwoStrike: state.strikes < 2,
    firstPitch: history.length <= 1,
    evenCount: state.balls === state.strikes,
    aheadEarly: state.strikes > state.balls && state.strikes >= 1 && state.balls <= 1,
    behindCount: state.balls >= 3,
    runners: state.bases.filter(Boolean).length > 0,
    runnerFirst: !!state.bases[0],
    scoring: state.bases.some(Boolean),
    lowCourse,
    highFast: highCourse && pitch.category === "fast",
    afterHigh: history.length && (state.lastLocation?.row ?? 1) <= 0,
    afterHighFast: prevCategory === "fast" && highCourse,
    afterSecondary: prevCategory && prevCategory !== "fast",
    fast: pitch.category === "fast",
    secondary: pitch.category !== "fast",
    inside: location.col <= 0,
    outside: location.col >= 2,
    edge,
    strike: intent === "strike",
    chaseZone: !location.inZone,
    categorySwitch: prevCategory && prevCategory !== pitch.category,
    highSuspicion: (atBat?.suspicion || 0) >= 60,
    counterPitch: atBat?.target && pitch.category !== atBat.target,
    patternExposed: !!state.patternMemory?.pitches?.length && state.patternMemory.pitches.length >= 2,
    afterFalseClue: !!atBat?.lastFalseClue,
    ballIntentSwitch: state.pitchIntent === "strike" && atBat?.ballIntent,
    afterFirstStrike: history.length === 1 && state.strikes >= 1,
    afterRun: !!state.runJustScored,
    boss: !!atBat?.batter?.isBoss
  };
}

function evolutionWhenMatches(when, context) {
  if (!when || !Object.keys(when).length) return true;
  return Object.entries(when).every(([key, expected]) => Boolean(context[key]) === Boolean(expected));
}

function activeEvolutionEffects(pitch, location, atBat, intent) {
  const evolution = coreEvolutionById(state.pitcher?.coreEvolutionId);
  if (!evolution?.effects) return {};
  const context = evolutionPitchContext(pitch, location, atBat, intent);
  return evolutionWhenMatches(evolution.when, context) ? evolution.effects : {};
}

function pitcherBaseCoreTagIds(pitcher = state.pitcher) {
  if (!pitcher?.coreTagId) return [];
  return [pitcher.coreTagId];
}

function pitcherCoreFamilies(pitcher = state.pitcher) {
  return pitcher.coreTagId ? [coreTagFamily(pitcher.coreTagId)] : [];
}

function isPitcherCoreTagId(tagId) {
  if (!tagId) return false;
  return coreTagCatalog.some((tag) => tag.id === tagId);
}

function tagSectionForTagId(tagId) {
  const tag = tagById(tagId);
  if (tag?.type === "weakness") return "weakness";
  if (isPitcherCoreTagId(tagId)) return "core";
  if (String(tagId).startsWith("evo_")) return "evolution";
  return "support";
}

function supportTagTier(pitcher, tagId) {
  return Math.max(1, pitcher?.bonusTagTiers?.[tagId] || 1);
}

function supportTagDisplayName(tagId, pitcher = state.pitcher) {
  const tag = tagById(tagId);
  if (!tag) return tagId;
  const tier = supportTagTier(pitcher, tagId);
  return tier > 1 ? `${tag.name} +${tier - 1}` : tag.name;
}

function scaleTagEffects(effects, multiplier) {
  if (!effects || multiplier <= 1) return effects || {};
  const scaled = {};
  Object.entries(effects).forEach(([key, value]) => {
    scaled[key] = typeof value === "number" ? Math.round(value * multiplier * 100) / 100 : value;
  });
  return scaled;
}

function tagEffectsForPitcher(tag, pitcher = state.pitcher) {
  const base = tag?.effects || {};
  if (tag?.type === "bonus" && (pitcher?.bonusTags || []).includes(tag.id)) {
    return scaleTagEffects(base, supportTagTier(pitcher, tag.id));
  }
  return base;
}

function tagDescriptionForPitcher(tag, pitcher = state.pitcher) {
  if (!tag) return "";
  const tier = tag.type === "bonus" ? supportTagTier(pitcher, tag.id) : 1;
  if (tier > 1) return `${tag.description} (강화 ${tier}단계)`;
  return tag.description;
}

function batterTagById(tagId) {
  return batterTagCatalog.find((tag) => tag.id === tagId) || null;
}

function batterHasTag(batter, tagId) {
  return (batter?.batterTagIds || []).includes(tagId);
}

function isInsideMistake(location) {
  const side = locationSideFromRowCol(location.row, location.col);
  return side === "inside" && location.inZone && (location.centerMistake || location.unintendedCenter || location.col <= 0);
}

function coreTagForProfile(profileId) {
  const candidates = coreTagCatalog.filter((tag) => tag.profiles?.includes(profileId));
  const picked = candidates.length ? pick(candidates) : pick(coreTagCatalog);
  return picked?.id || coreTagCatalog[0].id;
}

function supportTags() {
  return pitcherTagCatalog.filter((tag) => tag.type === "bonus");
}

function weaknessTags() {
  return pitcherTagCatalog.filter((tag) => tag.type === "weakness");
}

function supportTagFamily(tagId) {
  return supportTagMeta[tagId]?.family || "멘탈/운영계";
}

function coreTagFamily(coreTagId) {
  return coreTagCatalog.find((tag) => tag.id === coreTagId)?.family || "멘탈/운영계";
}

function pitcherAllTagIds(pitcher = state.pitcher) {
  if (!pitcher) return [];
  ensurePitcherTagFields(pitcher);
  return [...new Set([
    ...(pitcher.coreTagId ? [pitcher.coreTagId] : []),
    ...(pitcher.bonusTags || []),
    ...(pitcher.revealedWeaknessTags || [])
  ])].filter(Boolean);
}

function pitcherHasTag(tagId) {
  return pitcherAllTagIds().includes(tagId);
}

function applyControlLikeEffects(bonus, effects, context) {
  if (!effects) return bonus;
  let next = bonus;
  if (context.strike && effects.strikeControlBonus) next += effects.strikeControlBonus;
  if (context.low && effects.lowZoneControlBonus) next += effects.lowZoneControlBonus;
  if (context.outside && effects.outsideControlBonus) next += effects.outsideControlBonus;
  if (context.inside && effects.insideControlBonus) next += effects.insideControlBonus;
  if (context.fullCount && effects.fullCountControlBonus) next += effects.fullCountControlBonus;
  if (context.firstPitch && effects.firstPitchControlBonus) next += effects.firstPitchControlBonus;
  if (context.runners && effects.pressureReduce) next += effects.pressureReduce;
  if (context.runners && effects.pressurePenalty) next -= effects.pressurePenalty;
  if (state.balls >= 2 && effects.walkPressure) next -= effects.walkPressure;
  if (context.fullCount && effects.fullCountPenalty) next -= effects.fullCountPenalty;
  if (context.fullCount && effects.fullCountWalkReduce) next += effects.fullCountWalkReduce;
  return next;
}

function pitcherTagControlBonus(pitch, aimed, intent) {
  const tags = pitcherAllTagIds().map(tagById).filter(Boolean);
  const context = {
    low: aimed.row >= 2,
    outside: aimed.col >= 2,
    inside: aimed.col <= 0,
    high: aimed.row <= 0,
    firstPitch: (state.atBat?.pitchHistory?.length || 0) <= 1,
    strike: intent === "strike",
    fullCount: state.balls === 3 && state.strikes === 2,
    runners: state.bases.filter(Boolean).length
  };
  let bonus = tags.reduce((sum, tag) => sum + applyControlLikeEffects(0, tagEffectsForPitcher(tag, state.pitcher), context), 0);
  const evoEffects = activeEvolutionEffects(pitch, aimed, state.atBat, intent);
  bonus += applyControlLikeEffects(0, evoEffects, context);
  return bonus;
}

function buildPitcherStats(profile) {
  return Object.fromEntries(
    Object.entries(profile.stats).map(([label, range]) => [label, rand(range[0], range[1])])
  );
}

function buildPitcherRepertoire(profile) {
  const requiredFast = pick(requiredFastballs());
  const requiredSecondary = pick([...pitchesByCategory("breaking"), ...pitchesByCategory("offspeed")]);

  if (profile.id === "power") {
    const fastPool = pitchesByCategory("fast").filter((pitch) => pitch.id !== requiredFast.id);
    return sortRepertoire([requiredFast, ...sample(fastPool, 1), requiredSecondary]).map(clonePitch);
  }

  if (profile.id === "breaking") {
    const size = rand(4, 5);
    const core = [requiredFast, pitchById("slider"), pitchById("curve")];
    const offspeed = sample(pitchesByCategory("offspeed"), size - core.length);
    return sortRepertoire([...core, ...offspeed]).slice(0, size).map(clonePitch);
  }

  if (profile.id === "command") {
    const size = rand(3, 4);
    const core = [requiredFast, requiredSecondary];
    const pool = pitchLibrary.filter((pitch) => !core.some((owned) => owned.id === pitch.id));
    return sortRepertoire([...core, ...sample(pool, size - core.length)]).map(clonePitch);
  }

  const size = rand(3, 4);
  const core = [requiredFast, requiredSecondary];
  const pool = pitchLibrary.filter((pitch) => !core.some((owned) => owned.id === pitch.id));
  return sortRepertoire([...core, ...sample(pool, size - core.length)]).map(clonePitch);
}

function clampStat(value) {
  return Math.round(clamp(value, 18, 99));
}

function currentStageInnings() {
  return stageInnings[state.stageIndex] || stageInnings[stageInnings.length - 1];
}

function currentStageRunLimit() {
  return stageRunLimits[state.stageIndex] || stageRunLimits[stageRunLimits.length - 1];
}

function currentStageNumber() {
  return state.stageIndex + 1;
}

function pitchVelocityKmh(pitch) {
  const speedStat = pitcherEffectiveStat("구속");
  const fastballMax = 135 + speedStat * 0.3;
  return Math.round(clamp(fastballMax + (pitchVelocityAdjust[pitch.id] ?? -12), 92, 165));
}

function createRunStats() {
  return {
    strikeouts: 0,
    hits: 0,
    doubles: 0,
    homeruns: 0,
    walks: 0,
    doublePlays: 0,
    rewards: 0,
    bossOuts: 0,
    bossDamage: 0
  };
}

function createPatternMemory() {
  return {
    pitches: [],
    lastWarningAt: 0
  };
}

function makeName() {
  return `${pick(firstNames)}${pick(lastNames)}`;
}

function weightedCategory(weights) {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  let cursor = Math.random() * total;
  for (const [key, value] of entries) {
    cursor -= value;
    if (cursor <= 0) return key;
  }
  return entries[0][0];
}

function weightedCategoryWithout(weights, blocked) {
  const filtered = Object.fromEntries(Object.entries(weights).filter(([key]) => key !== blocked));
  return weightedCategory(Object.keys(filtered).length ? filtered : weights);
}

function weightedPickByScore(items, scoreKey = "weight") {
  const weights = Object.fromEntries(items.map((item) => [item.id, item[scoreKey] ?? 1]));
  const pickedId = weightedCategory(weights);
  return items.find((item) => item.id === pickedId) || items[0];
}

function pickMemoryGrade(stats, isBoss) {
  const value = stats.예측 + (isBoss ? 16 : 0) + rand(-10, 10);
  const grade =
    value >= 88
      ? memoryGrades.find((item) => item.id === "genius")
      : value >= 72
        ? memoryGrades.find((item) => item.id === "high")
        : value >= 48
          ? memoryGrades.find((item) => item.id === "normal")
          : memoryGrades.find((item) => item.id === "low");
  return { ...grade };
}

function pickMindType(stats, isBoss) {
  const weights = batterMindTypes.map((type) => {
    let weight = 1;
    if (type.id === "tricky") weight += stats.예측 / 75;
    if (type.id === "adaptive") weight += stats.컨택 / 70;
    if (type.id === "gambler") weight += stats.파워 / 74;
    if (type.id === "honest") weight += Math.max(0, 78 - stats.예측) / 90;
    if (isBoss && type.id !== "honest") weight += 1.2;
    return { ...type, weight };
  });
  return weightedPickByScore(weights);
}

function pickHiddenTendency(stats, isBoss) {
  const weights = hiddenTendencies.map((tendency) => {
    let weight = 1;
    if (tendency.id === "firstPitchAggro") weight += stats.컨택 / 90;
    if (tendency.id === "firstPitchWatch") weight += stats.선구 / 75;
    if (tendency.id === "twoStrike") weight += stats.컨택 / 80;
    if (tendency.id === "walkHunter") weight += stats.선구 / 70;
    if (tendency.id === "slugger") weight += stats.파워 / 65;
    if (tendency.id === "reactive") weight += stats.예측 / 80;
    if (isBoss) weight += 0.5;
    return { ...tendency, weight };
  });
  return weightedPickByScore(weights);
}

function pickBatterTags(slot, isBoss) {
  const slotBoost = slot <= 2 ? "top" : slot <= 4 ? "middle" : slot <= 6 ? "power" : "bottom";
  const weighted = batterTagCatalog.map((tag) => {
    let weight = tag.weight ?? 1;
    if (tag.slotBoost === slotBoost) weight += 1.5;
    if (isBoss && tag.bossWeight) weight += tag.bossWeight;
    return { ...tag, weight };
  });
  const picked = [];
  if (chance(isBoss ? 0.72 : 0.52)) {
    const first = weightedPickByScore(weighted);
    if (first) picked.push(first.id);
  }
  if (isBoss && chance(0.48) && picked.length < 2) {
    const pool = weighted.filter((tag) => !picked.includes(tag.id));
    if (pool.length) picked.push(weightedPickByScore(pool).id);
  }
  return picked;
}

function batterTagEffect(pitch, batter, location, targetMatch) {
  const effect = {
    swing: 0,
    chase: 0,
    contact: 0,
    foul: 0,
    contactQuality: 0,
    texasHitBonus: 0,
    doublePlayBonus: 0,
    groundOutReduce: 0,
    label: ""
  };
  const side = locationSideFromRowCol(location.row, location.col);
  const height = locationHeightFromRowCol(location.row);
  const isFullCount = state.balls === 3 && state.strikes === 2;
  const isFirstPitch = state.balls === 0 && state.strikes === 0;
  const isBreaking = pitch.category === "breaking" || pitch.category === "offspeed";

  (batter.batterTagIds || []).forEach((tagId) => {
    const tag = batterTagById(tagId);
    if (!tag) return;
    switch (tagId) {
      case "fast_killer":
        if (pitch.category === "fast" && targetMatch) {
          effect.contact += 0.06;
          effect.contactQuality += 8;
          effect.label = tag.name;
        }
        break;
      case "breaking_weak":
        if (isBreaking && !targetMatch) {
          effect.contact -= 0.08;
          effect.swing += 0.04;
          effect.label = tag.name;
        }
        break;
      case "inside_weak":
        if (side === "inside" && location.inZone) {
          effect.contact -= 0.05;
          effect.contactQuality -= 5;
          effect.label = tag.name;
        }
        break;
      case "inside_punish":
        if (isInsideMistake(location)) {
          effect.contactQuality += 10;
          effect.label = tag.name;
        }
        break;
      case "outside_chase_foul":
        if (side === "outside") {
          effect.foul += 0.08;
          effect.label = tag.name;
        }
        break;
      case "low_ball_grounder":
        if (height === "low") {
          effect.contactQuality -= 5;
          effect.groundOutReduce += 0.08;
          effect.label = tag.name;
        }
        break;
      case "high_fast_vulnerable":
        if (height === "high" && pitch.category === "fast") {
          effect.contact -= 0.1;
          effect.swing += 0.05;
          effect.label = tag.name;
        }
        break;
      case "full_count_heart":
        if (isFullCount) {
          if (!location.inZone) effect.chase -= 0.12;
          else effect.swing += 0.06;
          effect.label = tag.name;
        }
        break;
      case "texas_luck":
        effect.texasHitBonus += 0.08;
        break;
      case "dp_risk":
        if (height === "low") effect.doublePlayBonus += 0.1;
        break;
      case "offspeed_patience":
        if (isBreaking && !location.inZone) effect.chase -= 0.1;
        break;
      default:
        break;
    }
  });

  effect.chase = clamp(effect.chase, -0.18, 0.18);
  effect.foul = clamp(effect.foul, 0, 0.22);
  return effect;
}

function countKey() {
  return `${state.balls}-${state.strikes}`;
}

function runnersKey() {
  const runners = state.bases.map((occupied, index) => (occupied ? index + 1 : "")).filter(Boolean).join("");
  return runners || "empty";
}

function zoneSide(zone) {
  const col = courseZones[zone]?.col ?? 1;
  if (col <= 0) return "inside";
  if (col >= 2) return "outside";
  return "middle";
}

function zoneHeight(zone) {
  const row = courseZones[zone]?.row ?? 1;
  if (row <= 0) return "high";
  if (row >= 2) return "low";
  return "middle";
}

function classifyBallIntent(zone, intent, selectedPlan = "", targetRow = null, targetCol = null) {
  if (intent !== "ball") return null;
  if (ballIntentPlans[selectedPlan]) return selectedPlan;
  const row = Number.isFinite(Number(targetRow)) ? Number(targetRow) : courseZones[zone]?.row ?? 1;
  const col = Number.isFinite(Number(targetCol)) ? Number(targetCol) : courseZones[zone]?.col ?? 1;
  if (col < 0) return "brush";
  if (row > 2) return "fishing";
  if (row < 0) return "show";
  if (col > 2) return "waste";
  return "waste";
}

function pitchFamily(category) {
  return category === "fast" ? "fast" : "secondary";
}

function isTargetedPitchCategory(pitchCategory, targetCategory) {
  return pitchCategory === targetCategory || pitchFamily(pitchCategory) === pitchFamily(targetCategory);
}

function targetRevealText(result) {
  const target = state.atBat?.target;
  if (!target) return "";
  const pitchCategory = result.pitch?.category;
  if (isTargetedPitchCategory(pitchCategory, target)) {
    if (pitchCategory !== target) return "타자는 변화구 계열을 노렸습니다.";
    return `${categoryNames[target]} 노림이었습니다.`;
  }
  return `타자는 ${categoryNames[target]}을 노렸고, ${categoryNames[pitchCategory]}로 빗겨냈습니다.`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pitchLogTitle(result) {
  return `${result.pitch.name} ${pitchVelocityKmh(result.pitch)}km/h`;
}

function currentAtBatPitchCount() {
  return state.atBat?.pitchHistory?.length || 0;
}

function swingTimingText(result) {
  if (!result.swung) return result.inZone ? "지켜봄" : "참아냄";
  return `스윙 ${result.timingLabel}`;
}

function pitchLogText(result, options = {}) {
  const extraLines = [options.extra, options.reveal].filter(Boolean);
  const hiddenSpecialLabels = new Set(["파워 피처 구위", "변화구 장인 감각", "제구형 투수 코너워크", "균형형 투수 안정감"]);
  const special = result.special?.label && !hiddenSpecialLabels.has(result.special.label) ? `<small>${escapeHtml(result.special.label)}</small>` : "";
  const ballPlan = result.ballIntentPlan
    ? `<p><b>${escapeHtml(result.ballIntentPlan.label)}</b><i>→</i><em>${escapeHtml(result.ballIntentPlan.next)}</em></p>`
    : "";
  const patternLine = result.pattern?.exposed
    ? `<p class="log-warning">타자가 결정구 패턴을 의식하기 시작합니다.</p>`
    : "";
  const memoryLines = (result.memoryLogLines || [])
    .map((line) => `<p class="log-warning">${escapeHtml(line)}</p>`)
    .join("");
  const falseLine = result.falseClue
    ? `<p class="log-muted">반응 신뢰도 낮음: 방금 스윙이나 지켜본 반응이 연기일 수 있습니다. 다음 공을 반대로 기다릴 가능성이 있습니다.</p>`
    : "";
  return `
    <div class="log-lines">
      <p><b>이번 타자 ${currentAtBatPitchCount()}구</b><i>·</i><em>${escapeHtml(result.location?.actualLabel || "중앙")}</em></p>
      <p><b>배트 타이밍</b><i>→</i><em>${escapeHtml(swingTimingText(result))}</em>${special}</p>
      ${ballPlan}
      <p>${escapeHtml(result.detail)}</p>
      <p class="log-muted">${escapeHtml(result.clue)}</p>
      ${patternLine}
      ${memoryLines}
      ${falseLine}
      ${extraLines.map((line) => `<p class="log-muted">${escapeHtml(line)}</p>`).join("")}
    </div>
  `;
}

function availablePitchCategories() {
  const categories = state.pitcher?.repertoire?.map((pitch) => pitch.category) || [];
  return [...new Set(categories)].filter(Boolean);
}

function firstAvailableCategory(preferredCategories, availableCategories = availablePitchCategories()) {
  return preferredCategories.find((category) => availableCategories.includes(category)) || availableCategories[0] || "fast";
}

function counterCategoryForTarget(target, availableCategories = availablePitchCategories()) {
  const counters = {
    fast: ["breaking", "offspeed", "fast"],
    breaking: ["fast", "offspeed", "breaking"],
    offspeed: ["fast", "breaking", "offspeed"]
  };
  return firstAvailableCategory(counters[target] || ["fast", "breaking", "offspeed"], availableCategories);
}

function representativePitchName(category) {
  const pitch = state.pitcher?.repertoire?.find((item) => item.category === category) || state.pitcher?.repertoire?.[0];
  return pitch?.name || categoryNames[category] || "승부구";
}

function adjustWeightsByMemory(weights, memory) {
  const adjusted = { ...weights };
  if (!memory) return adjusted;

  if (memory.result === "swingingStrikeout") {
    adjusted[memory.category] = (adjusted[memory.category] || 1) + 2.2;
  }
  if (memory.result === "lookingStrikeout") {
    adjusted[memory.category] = (adjusted[memory.category] || 1) + 1.5;
    adjusted.fast = (adjusted.fast || 1) + 0.6;
  }
  if (memory.result === "doublePlay") {
    adjusted[memory.category] = Math.max(0.6, (adjusted[memory.category] || 1) - 1.0);
    adjusted.fast = (adjusted.fast || 1) + 1.0;
  }
  if (memory.result === "hit") {
    adjusted[memory.category] = (adjusted[memory.category] || 1) + 1.2;
  }
  return adjusted;
}

const MAX_SUSPICION_ADD_PER_PITCH = 16;

const PATTERN_LOG_LINES = {
  same_pitch_repeat: [
    "타자가 같은 구종 반복을 의식하기 시작합니다.",
    "같은 구종이 이어지며 타자의 타이밍이 맞아가고 있습니다."
  ],
  same_family_repeat: [
    "빠른 공 계열이 반복되며 타자의 타이밍이 맞아갑니다.",
    "변화구 흐름이 길어지며 타자가 궤적을 따라가기 시작합니다."
  ],
  same_zone_repeat: [
    "타자가 같은 코스를 의식하기 시작합니다.",
    "낮은 코스가 반복되며 타자의 배트가 따라옵니다."
  ],
  same_height_repeat: ["비슷한 높이가 이어지며 타자의 눈높이가 맞춰집니다."],
  two_strike_chase_repeat: [
    "2스트 이후 빠지는 공을 경계하고 있습니다.",
    "계속 빠지는 공을 보며 타자가 배트를 아낍니다."
  ],
  full_count_strike_pattern: [
    "풀카운트 승부 패턴이 읽히고 있습니다.",
    "타자가 풀카운트에서 스트라이크를 예상합니다."
  ]
};

function createEmptyMemoryModifiers() {
  return {
    swingBonus: 0,
    contactBonus: 0,
    foulBonus: 0,
    qualityBonus: 0,
    hardHitBonus: 0,
    chasePenalty: 0,
    takeBallBonus: 0,
    readBarBoost: 0,
    readBarCategory: null
  };
}

function getBatterMemoryLimit(batter) {
  if (batter.bossGimmick?.id === "geniusEye" || batter.memory?.id === "genius") return 10;
  if (batter.mind?.id === "adaptive" || batter.memory?.id === "high") return 7;
  if (batter.mind?.id === "tricky") return 6;
  if (batter.memory?.id === "low") return 3;
  return 5;
}

function createEmptyBatterMemory(batter) {
  return {
    pitches: [],
    detectedPatterns: [],
    countPatterns: {},
    finishPitchPatterns: [],
    memoryLimit: getBatterMemoryLimit(batter),
    fullCountPatternTriggered: false
  };
}

function locationSideFromRowCol(row, col) {
  if (row >= 0 && row <= 2 && col >= 0 && col <= 2) {
    if (col <= 0) return "inside";
    if (col >= 2) return "outside";
    return "center";
  }
  if (col < 0) return "inside";
  if (col > 2) return "outside";
  return "center";
}

function locationHeightFromRowCol(row) {
  if (row < 0) return "high";
  if (row > 2) return "low";
  if (row === 0) return "high";
  if (row === 2) return "low";
  return "middle";
}

function pitchResultMemoryType(result) {
  if (result.result === "ball") return "ball";
  if (result.result === "calledStrike") return "strike";
  if (result.result === "swingingStrike") return "whiff";
  if (result.result === "foul") return "foul";
  if (["single", "double", "homerun"].includes(result.result)) return "hit";
  if (["inPlayOut", "doublePlay"].includes(result.result)) return "out";
  if (result.result === "error") return "hit";
  return result.result;
}

function countSame(items, key, value) {
  return items.filter((item) => item[key] === value).length;
}

function patternLogLine(pattern, lastPitch) {
  const lines = PATTERN_LOG_LINES[pattern.id] || [pattern.label];
  let line = pick(lines);
  if (pattern.id === "same_family_repeat" && lastPitch?.family === "fast") {
    line = "빠른 공 계열이 반복되며 타자의 타이밍이 맞아갑니다.";
  } else if (pattern.id === "same_family_repeat" && lastPitch?.category === "breaking") {
    line = "변화구 흐름이 길어지며 타자가 궤적을 따라가기 시작합니다.";
  } else if (pattern.id === "same_zone_repeat" && lastPitch) {
    const sideLabel = lastPitch.side === "inside" ? "몸쪽" : lastPitch.side === "outside" ? "바깥" : "중앙";
    const heightLabel = lastPitch.height === "low" ? "낮은" : lastPitch.height === "high" ? "높은" : "가운데";
    line = `타자가 ${heightLabel} ${sideLabel} 코스를 기다리기 시작합니다.`;
  }
  return line;
}

function detectPitchPatterns(batterMemory, batter) {
  const pitches = batterMemory.pitches;
  const patterns = [];
  if (pitches.length < 2) return patterns;

  const last = pitches[pitches.length - 1];
  const prev = pitches[pitches.length - 2];
  const recent3 = pitches.slice(-3);

  if (last.pitchType === prev.pitchType) {
    patterns.push({
      id: "same_pitch_repeat",
      label: "같은 구종 반복",
      suspicionAdd: 8,
      contactBonus: 0.05,
      hardHitBonus: 0.04
    });
  }

  if (countSame(recent3, "family", last.family) >= 2) {
    patterns.push({
      id: "same_family_repeat",
      label: "같은 계열 반복",
      suspicionAdd: 6,
      readBarBoost: 0.08,
      readBarCategory: last.category,
      foulBonus: 0.05
    });
  }

  const lastZoneKey = `${last.side}_${last.height}`;
  if (recent3.filter((p) => `${p.side}_${p.height}` === lastZoneKey).length >= 2) {
    patterns.push({
      id: "same_zone_repeat",
      label: "같은 코스 반복",
      suspicionAdd: 7,
      swingBonus: 0.06,
      qualityBonus: 0.05
    });
  }

  if (countSame(recent3, "height", last.height) >= 2) {
    patterns.push({
      id: "same_height_repeat",
      label: "같은 높이 반복",
      suspicionAdd: 4,
      contactBonus: 0.03
    });
  }

  const twoStrikeBalls = pitches.filter((p) => p.wasTwoStrike && p.intent === "ball").length;
  if (twoStrikeBalls >= 2) {
    patterns.push({
      id: "two_strike_chase_repeat",
      label: "2스트 유인구 반복",
      suspicionAdd: 10,
      chasePenalty: -0.08,
      takeBallBonus: 0.08
    });
  }

  const fullCountStrikes = pitches.filter((p) => p.wasFullCount && p.intent === "strike").length;
  if (fullCountStrikes >= 1 && !batterMemory.fullCountPatternTriggered) {
    batterMemory.fullCountPatternTriggered = true;
    patterns.push({
      id: "full_count_strike_pattern",
      label: "풀카운트 스트라이크 패턴",
      suspicionAdd: 9,
      swingBonus: 0.08,
      hardHitBonus: 0.06
    });
  }

  if (batter.tendency?.pattern) {
    patterns.forEach((pattern) => {
      pattern.suspicionAdd = Math.round((pattern.suspicionAdd || 0) * (1 + batter.tendency.pattern));
    });
  }
  if (batter.bossGimmick?.id === "geniusEye") {
    patterns.forEach((pattern) => {
      pattern.suspicionAdd = (pattern.suspicionAdd || 0) + 2;
    });
  }

  return patterns;
}

function getMemoryModifiers(patterns) {
  return patterns.reduce(
    (mods, pattern) => {
      mods.swingBonus += pattern.swingBonus || 0;
      mods.contactBonus += pattern.contactBonus || 0;
      mods.foulBonus += pattern.foulBonus || 0;
      mods.qualityBonus += pattern.qualityBonus || 0;
      mods.hardHitBonus += pattern.hardHitBonus || 0;
      mods.chasePenalty += pattern.chasePenalty || 0;
      mods.takeBallBonus += pattern.takeBallBonus || 0;
      if (pattern.readBarBoost) {
        mods.readBarBoost += pattern.readBarBoost;
        mods.readBarCategory = pattern.readBarCategory || mods.readBarCategory;
      }
      return mods;
    },
    createEmptyMemoryModifiers()
  );
}

function memoryModifiersActive(mods) {
  if (!mods) return false;
  return (
    Math.abs(mods.swingBonus) +
      Math.abs(mods.contactBonus) +
      Math.abs(mods.foulBonus) +
      Math.abs(mods.qualityBonus) +
      Math.abs(mods.hardHitBonus) +
      Math.abs(mods.chasePenalty) +
      Math.abs(mods.takeBallBonus) >
    0.01
  );
}

function applyMemorySuspicion(patterns, batter) {
  const learnRate = batter.mind?.patternLearn ?? 1;
  const totalAdd = patterns.reduce((sum, pattern) => sum + (pattern.suspicionAdd || 0), 0);
  const cappedAdd = Math.min(Math.round(totalAdd * learnRate), MAX_SUSPICION_ADD_PER_PITCH);
  if (state.atBat) {
    state.atBat.suspicion = clamp((state.atBat.suspicion ?? 0) + cappedAdd, 0, 100);
  }
  return cappedAdd;
}

function applyMixingRelief(pitch, plannedCourse, batter) {
  const memory = state.atBat?.batterMemory;
  const last = memory?.pitches?.[memory.pitches.length - 1];
  if (!last) return 0;

  let delta = 0;
  const currentFamily = pitchFamily(pitch.category);
  const currentSide = zoneSide(plannedCourse.zone);
  const currentHeight = zoneHeight(plannedCourse.zone);
  const intent = plannedCourse.intent === "ball" ? "ball" : "strike";

  if (last.pitchId !== pitch.id) {
    if (last.category !== pitch.category) delta -= 5;
    else if (last.family !== currentFamily) delta -= 3;
  }
  if (last.side !== currentSide || last.height !== currentHeight) delta -= 4;
  if (last.intent !== intent) delta -= 4;

  if (pitcherHasTag("pattern_shuffler") && last.category !== pitch.category) {
    delta -= 2;
  }

  const learnRate = batter.mind?.patternLearn ?? 1;
  const applied = Math.round(delta * learnRate);
  if (state.atBat && applied) {
    state.atBat.suspicion = clamp((state.atBat.suspicion ?? 0) + applied, 0, 100);
  }
  return applied;
}

function buildPitchMindContext(pitch, plannedCourse, batter) {
  const zone = Number(plannedCourse.zone) || 5;
  const intent = plannedCourse.intent === "ball" ? "ball" : "strike";
  const targetRow = Number.isFinite(Number(plannedCourse.targetRow)) ? Number(plannedCourse.targetRow) : null;
  const targetCol = Number.isFinite(Number(plannedCourse.targetCol)) ? Number(plannedCourse.targetCol) : null;
  const ballIntent = classifyBallIntent(zone, intent, plannedCourse.ballPlan || "", targetRow, targetCol);

  applyMixingRelief(pitch, plannedCourse, batter);

  const suspicion = state.atBat?.suspicion ?? 0;
  const memoryModifiers = state.atBat?.activeMemoryModifiers || createEmptyMemoryModifiers();
  const exposed = suspicion >= 58 && memoryModifiersActive(memoryModifiers);
  const reverseEase = MP.themeReverseReadEase ? MP.themeReverseReadEase(state.stageThemeId, batter, state.stageIndex) : 0;
  const reverseRead =
    suspicion >= 72 - reverseEase * 85 && ["tricky", "adaptive", "gambler"].includes(batter.mind?.id);
  const falseClueChance = clamp(
    (batter.mind?.fakeRate ?? 0.08) +
      suspicion / 520 +
      (reverseRead ? 0.08 : 0) +
      (MP.stageThemePitchEffect
        ? MP.stageThemePitchEffect(state.stageThemeId, batter, { stageIndex: state.stageIndex }).falseClueBonus || 0
        : 0),
    0.02,
    0.48
  );
  const falseClue = chance(falseClueChance) ? weightedCategoryWithout(batter.weights, state.atBat?.target) : null;

  if (state.atBat) {
    state.atBat.reverseRead = reverseRead;
    state.atBat.falseClue = falseClue;
    state.atBat.ballIntent = ballIntent;
    state.atBat.recommendation = buildRecommendation(state.atBat.target, batter, suspicion);
  }

  return {
    pitchId: pitch.id,
    category: pitch.category,
    family: pitchFamily(pitch.category),
    zone,
    side: zoneSide(zone),
    height: zoneHeight(zone),
    intent,
    count: countKey(),
    runners: runnersKey(),
    suspicion,
    exposed,
    reverseRead,
    falseClue,
    ballIntent,
    memoryModifiers,
    memoryLogLines: []
  };
}

function buildBatterMemoryItem(pitch, plannedCourse, location, result) {
  const row = location?.row ?? 1;
  const col = location?.col ?? 1;
  const countParts = (result.countBefore || countKey()).split("-");
  const ballsBefore = Number(countParts[0]) || 0;
  const strikesBefore = Number(countParts[1]) || 0;
  return {
    pitchType: pitch.name,
    pitchId: pitch.id,
    category: pitch.category,
    family: pitchFamily(pitch.category),
    intent: plannedCourse.intent === "ball" ? "ball" : "strike",
    zoneX: col + 1,
    zoneY: row + 1,
    zoneLabel: location?.actualLabel || actualCourseLabel(row, col),
    height: locationHeightFromRowCol(row),
    side: locationSideFromRowCol(row, col),
    countBefore: result.countBefore || countKey(),
    runners: result.runnersBefore || runnersKey(),
    result: pitchResultMemoryType(result),
    wasTwoStrike: strikesBefore === 2,
    wasFullCount: ballsBefore === 3 && strikesBefore === 2
  };
}

function updateBatterMemoryAfterPitch(pitch, plannedCourse, result, batter) {
  if (!state.atBat) return [];

  if (!state.atBat.batterMemory) {
    state.atBat.batterMemory = createEmptyBatterMemory(batter);
  }
  const memory = state.atBat.batterMemory;
  const item = buildBatterMemoryItem(pitch, plannedCourse, result.location, result);
  memory.pitches.push(item);
  while (memory.pitches.length > memory.memoryLimit) {
    memory.pitches.shift();
  }

  memory.detectedPatterns = detectPitchPatterns(memory, batter);
  applyMemorySuspicion(memory.detectedPatterns, batter);

  const lastPitch = memory.pitches[memory.pitches.length - 1];
  const logLines = memory.detectedPatterns.map((pattern) => patternLogLine(pattern, lastPitch));
  state.atBat.patternSignals = memory.detectedPatterns.map((pattern) => pattern.label);
  state.atBat.activeMemoryModifiers = getMemoryModifiers(memory.detectedPatterns);

  if (memory.detectedPatterns.length) {
    memory.countPatterns[item.countBefore] = memory.detectedPatterns.map((pattern) => pattern.id);
  }

  const readMods = state.atBat.activeMemoryModifiers;
  if (readMods.readBarCategory && readMods.readBarBoost && state.atBat.readScores[readMods.readBarCategory] !== undefined) {
    state.atBat.readScores[readMods.readBarCategory] += readMods.readBarBoost;
    Object.keys(state.atBat.readScores).forEach((key) => {
      state.atBat.readScores[key] = clamp(state.atBat.readScores[key], 0.2, 8);
    });
  }

  state.atBat.recommendation = buildRecommendation(state.atBat.target, batter, state.atBat.suspicion);
  return logLines;
}

function recordPitchPattern(pitch, plannedCourse, result, pattern) {
  const row = result.location?.row ?? 1;
  const col = result.location?.col ?? 1;
  const entry = {
    pitchId: pitch.id,
    category: pitch.category,
    family: pitchFamily(pitch.category),
    zone: Number(plannedCourse.zone) || 5,
    side: locationSideFromRowCol(row, col),
    height: locationHeightFromRowCol(row),
    intent: plannedCourse.intent,
    count: result.countBefore || countKey(),
    runners: result.runnersBefore || runnersKey(),
    result: result.result
  };
  state.patternMemory.pitches.push(entry);
  if (state.patternMemory.pitches.length > 40) state.patternMemory.pitches.shift();
  state.atBat?.choiceHistory?.push(entry);

  if (pattern?.exposed && state.pitchCount - (state.patternMemory.lastWarningAt || 0) >= 3) {
    state.patternMemory.lastWarningAt = state.pitchCount;
  }
}

function recommendationForCategory(category, batter) {
  const pitchName = representativePitchName(category);
  if (category === "fast") {
    return {
      title: `${pitchName}로 타이밍 압박`,
      text: batter.stats.선구 > 72 ? "빠른 공은 존 끝으로 붙여야 효과가 큽니다." : "높은 존보다 낮은 존 빠른 공이 더 안전합니다."
    };
  }
  if (category === "breaking") {
    return {
      title: `${pitchName}로 헛스윙 유도`,
      text: "변화구를 던질 수 있는 상황입니다. 히터박스 오른쪽 낮은 코스(바깥쪽)가 가장 안정적입니다."
    };
  }
  return {
    title: `${pitchName}로 타이밍 교란`,
    text: "느린 공 계열로 앞 타이밍을 흔들 수 있습니다. 중앙 실투만 피하세요."
  };
}

function buildRecommendation(target, batter, suspicion = 0) {
  const prediction = state.pitcher?.stats?.예측 ?? 50;
  const reliabilityPenalty = suspicion >= 70 && batter.mind?.id === "tricky" ? 0.12 : 0;
  const themePenalty = MP.themeRecommendationPenalty
    ? MP.themeRecommendationPenalty(state.stageThemeId, state.stageIndex)
    : 0;
  const accuracy = clamp(0.28 + prediction / 125 - reliabilityPenalty - themePenalty, 0.28, 0.88);
  const guessedTarget = chance(accuracy) ? target : weightedCategoryWithout(batter.weights, target);
  const recommendedCategory = counterCategoryForTarget(guessedTarget);
  const recommendation = recommendationForCategory(recommendedCategory, batter);
  return {
    ...recommendation,
    guessedTarget,
    recommendedCategory,
    confidence: Math.round(accuracy * 100),
    reliable: guessedTarget === target
  };
}

function generatePitcher(portrait = pick(pitcherPortraits)) {
  const profile = pick(pitcherProfiles);
  const stats = buildPitcherStats(profile);
  const repertoire = buildPitcherRepertoire(profile);
  const weaknessPool = ["homerun_risk", "walk_risk", "full_count_wobble", "pressure_wobble"];
  const coreTagId = coreTagForProfile(profile.id);

  return {
    name: makeName(),
    style: profile.label,
    profileId: profile.id,
    portrait,
    stats,
    repertoire,
    coreTagId,
    coreEvolutionId: null,
    baseTags: [coreTagId],
    bonusTags: [],
    bonusTagTiers: {},
    hiddenWeaknessTags: sample(weaknessPool, 2),
    revealedWeaknessTags: []
  };
}

function archetypeForSlot(slot) {
  if (slot <= 2) {
    return {
      type: "출루형",
      contact: [62, 86],
      power: [30, 58],
      eye: [54, 82],
      speed: [68, 92],
      guess: [48, 74],
      weights: { fast: 3, breaking: 2, offspeed: 2 }
    };
  }
  if (slot <= 4) {
    return {
      type: "중심형",
      contact: [54, 78],
      power: [72, 96],
      eye: [42, 70],
      speed: [34, 66],
      guess: [56, 84],
      weights: { fast: 4, breaking: 3, offspeed: 2 }
    };
  }
  if (slot <= 6) {
    return {
      type: "장타형",
      contact: [46, 72],
      power: [62, 90],
      eye: [36, 68],
      speed: [34, 72],
      guess: [44, 76],
      weights: { fast: 3, breaking: 3, offspeed: 2 }
    };
  }
  return {
    type: "하위형",
    contact: [36, 66],
    power: [30, 72],
    eye: [30, 66],
    speed: [32, 78],
    guess: [30, 68],
    weights: { fast: 2, breaking: 2, offspeed: 2 }
  };
}

function makeBatterHint(stats, weights, isBoss, mind, tendency, memory, bossGimmick) {
  const likely = Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] || "fast";
  const hints = [];
  if (mind?.hint) hints.push(mind.hint);
  if (tendency?.label) hints.push(tendency.label);
  if (memory?.id === "genius") hints.push("이전 타석까지 기억");
  else if (memory?.id === "high") hints.push("이번 타석 기억력 높음");
  if (bossGimmick?.text) hints.push(bossGimmick.text);
  if (stats.컨택 >= 74) hints.push("컨택으로 파울을 만들 수 있음");
  if (stats.선구 >= 72) hints.push("볼 유인에 잘 속지 않음");
  if (stats.예측 >= 72) hints.push(`${categoryNames[likely]} 반응이 빠름`);
  if (stats.파워 >= 78) hints.push("실투 장타 위험");
  if (stats.컨택 <= 48) hints.push("불리한 카운트에 약함");
  if (stats.주력 >= 78) hints.push("땅볼도 빠르게 뛴다");
  if (isBoss) hints.unshift("이번 경기 위험 타자");
  return hints.slice(0, 2).join(" · ") || `${categoryNames[likely]} 쪽을 먼저 확인하는 타입`;
}

function makeBatterTags(stats, weights, mind, tendency, isBoss, batterTagIds = []) {
  const likely = Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] || "fast";
  const catalogNames = batterTagIds.map((id) => batterTagById(id)?.name).filter(Boolean);
  const tags = [...catalogNames, tendency?.label, mind?.hint];
  if (tags.length < 5 && stats.주력 >= 74) tags.push("주루형");
  if (tags.length < 5 && stats.컨택 >= 74) tags.push("파울형");
  if (tags.length < 5 && stats.선구 >= 72) tags.push("선구형");
  if (tags.length < 5 && stats.파워 >= 76) tags.push("장타형");
  if (tags.length < 5 && likely === "fast") tags.push("직구형");
  if (tags.length < 5 && likely === "breaking") tags.push("변화형");
  if (tags.length < 5 && likely === "offspeed") tags.push("느린형");
  if (isBoss) tags.unshift("보스형");
  return [...new Set(tags.filter(Boolean))].slice(0, 6);
}

function boostBossStats(stats) {
  return Object.fromEntries(
    Object.entries(stats).map(([label, value]) => [label, clampStat(value + rand(7, 14))])
  );
}

function boostStageStats(stats, stageIndex) {
  if (stageIndex <= 0) return stats;
  const baseBoost = stageIndex === 1 ? 14 : 28;
  return Object.fromEntries(
    Object.entries(stats).map(([label, value]) => [label, clampStat(value + baseBoost + rand(0, 8))])
  );
}

function generateLineup(stageIndex = state.stageIndex) {
  const theme = MP.getStageTheme ? MP.getStageTheme(state.stageThemeId) : null;
  const affinityMap = MP.assignThemeAffinities ? MP.assignThemeAffinities() : {};
  const bossSlot =
    theme?.bottomBossWeight && chance(0.42) ? rand(7, 9) : rand(1, 9);
  const lineupPortraits = sample(batterPortraits, 9);
  return Array.from({ length: 9 }, (_, index) => {
    const slot = index + 1;
    const themeAffinity = affinityMap[slot] || "medium";
    const archetype = archetypeForSlot(slot);
    const baseStats = {
      컨택: rand(...archetype.contact),
      파워: rand(...archetype.power),
      선구: rand(...archetype.eye),
      주력: rand(...archetype.speed),
      예측: rand(...archetype.guess)
    };
    const isBoss = slot === bossSlot;
    let stageStats = boostStageStats(baseStats, stageIndex);
    if (theme?.id === "bottom_revolt" && slot >= 7) {
      stageStats = Object.fromEntries(
        Object.entries(stageStats).map(([label, value]) => [label, clampStat(value + rand(6, 12))])
      );
    }
    stageStats = MP.applyThemeToBatterStats
      ? MP.applyThemeToBatterStats(stageStats, theme, themeAffinity, stageIndex)
      : stageStats;
    const stats = isBoss ? boostBossStats(stageStats) : stageStats;
    let mind = pickMindType(stats, isBoss);
    let tendency = pickHiddenTendency(stats, isBoss);
    if (MP.applyThemeIdentity) {
      const identity = MP.applyThemeIdentity(theme, themeAffinity, mind, tendency, batterMindTypes, hiddenTendencies);
      mind = identity.mind;
      tendency = identity.tendency;
    }
    const memory = pickMemoryGrade(stats, isBoss);
    const bossGimmick = isBoss
      ? MP.pickBossGimmickForTheme
        ? MP.pickBossGimmickForTheme(theme, bossGimmicks, pick, chance)
        : pick(bossGimmicks)
      : null;
    if (bossGimmick?.id === "geniusEye") {
      Object.assign(memory, { id: "genius", label: "천재형", span: 18, suspicion: 16 });
    }
    let weights = isBoss
      ? Object.fromEntries(Object.entries(archetype.weights).map(([key, value]) => [key, value + 2 + stageIndex * 2]))
      : Object.fromEntries(Object.entries(archetype.weights).map(([key, value]) => [key, value + stageIndex * 2]));
    weights = MP.applyThemeToWeights
      ? MP.applyThemeToWeights(weights, theme, themeAffinity, stageIndex)
      : weights;
    const batterTagIds = pickBatterTags(slot, isBoss);
    return {
      slot,
      name: `${makeName()}`,
      portrait: lineupPortraits[index],
      type: isBoss ? `보스 타자 · ${archetype.type}` : archetype.type,
      stats,
      weights,
      themeAffinity,
      isBoss,
      mind,
      tendency,
      memory,
      batterTagIds,
      bossGimmick,
      hint: makeBatterHint(stats, weights, isBoss, mind, tendency, memory, bossGimmick),
      tags: makeBatterTags(stats, weights, mind, tendency, isBoss, batterTagIds)
    };
  });
}

function createPlan(batter) {
  const approach = batter.tendency?.approach || pick(["균형", "적극", "신중", "초구", "보호"]);
  const weights = adjustWeightsByMemory(batter.weights, state.lastAtBatMemory);
  const target = weightedCategory(weights);
  const suspicion = clamp((batter.isBoss ? 10 : 0) + (batter.memory?.suspicion || 0) + state.stageIndex * 4, 0, 100);
  return {
    target,
    approach,
    readScores: { fast: 1, breaking: 1, offspeed: 1 },
    recommendation: buildRecommendation(target, batter, suspicion),
    pitchHistory: [],
    choiceHistory: [],
    patternSignals: [],
    batterMemory: createEmptyBatterMemory(batter),
    activeMemoryModifiers: createEmptyMemoryModifiers(),
    suspicion,
    reverseRead: false,
    falseClue: null,
    ballIntent: null,
    resolved: false
  };
}

function startGame() {
  clearAutoAdvance();
  clearCourseFlash();
  clearRewardTimer();
  clearGameOverTimer();
  hideBallSprite();
  resetTagDetail();
  resetPitcherTagDetail();
  state.pitcherChoices = sample(pitcherPortraits, 3).map((portrait) => generatePitcher(portrait));
  state.gameOver = true;
  state.waitingNextBatter = false;
  state.pendingGameOver = false;
  state.rewardPending = false;
  state.rewardChoices = [];
  state.rewardKind = "normal";
  state.afterRewardStageOverlay = null;
  state.pendingRewardKindAfterCurrent = null;
  state.pendingTransitionBanner = null;
  state.pendingStageOverlay = null;
  state.coreEvolutionOffered = false;
  state.pendingCoreEvolutionReward = false;
  state.selectedRewardIndex = null;
  els.resultOverlay.hidden = true;
  if (els.rewardOverlay) els.rewardOverlay.hidden = true;
  if (els.stageOverlay) els.stageOverlay.hidden = true;
  if (els.themeSelectOverlay) els.themeSelectOverlay.hidden = true;
  state.awaitingThemeSelection = false;
  state.pendingThemeChoices = [];
  state.stageThemeId = null;
  renderPitcherChoices();
}

function assignStartingBonusTag(pitcher) {
  ensurePitcherTagFields(pitcher);
  const owned = new Set([...(pitcher.bonusTags || []), ...(pitcher.coreTagId ? [pitcher.coreTagId] : [])]);
  const pool = supportTags().filter((tag) => !owned.has(tag.id));
  if (!pool.length) return;
  if ((pitcher.bonusTags || []).length) return;
  const tagId = pick(pool).id;
  pitcher.bonusTags = [tagId];
  pitcher.bonusTagTiers[tagId] = 1;
}

function beginGameWithPitcher(pitcher) {
  clearAutoAdvance();
  clearCourseFlash();
  clearRewardTimer();
  clearGameOverTimer();
  startBgm();
  state.pitcher = pitcher;
  ensurePitcherTagFields(state.pitcher);
  assignStartingBonusTag(state.pitcher);
  state.catcher = pick(catcherTypes);
  state.stageIndex = 0;
  state.stageThemeId = MP.pickStage1Theme ? MP.pickStage1Theme() : null;
  state.awaitingThemeSelection = false;
  state.pendingThemeChoices = [];
  state.stageJustAdvanced = false;
  state.lineup = generateLineup(state.stageIndex);
  state.batterIndex = 0;
  state.lineup.forEach((batter, index) => {
    batter.slot = index + 1;
  });
  state.inning = 1;
  state.outs = 0;
  state.balls = 0;
  state.strikes = 0;
  state.consecutiveBalls = 0;
  state.bases = [false, false, false];
  state.runs = 0;
  state.pitchCount = 0;
  state.selectedPitchId = state.pitcher.repertoire[0]?.id || null;
  state.pitchIntent = "strike";
  state.pitchBallPlan = "";
  state.flashZone = null;
  state.lastLocation = null;
  state.lastPitchCall = null;
  state.consecutiveOnBase = 0;
  state.fullCountSeen = 0;
  state.rewardChoices = [];
  state.rewardPending = false;
  state.rewardKind = "normal";
  state.afterRewardStageOverlay = null;
  state.pendingRewardKindAfterCurrent = null;
  state.pendingTransitionBanner = null;
  state.pendingStageOverlay = null;
  state.coreEvolutionOffered = false;
  state.pendingCoreEvolutionReward = false;
  state.selectedRewardIndex = null;
  state.lastAtBatMemory = null;
  state.patternMemory = createPatternMemory();
  state.pendingGameOver = false;
  state.runStats = createRunStats();
  state.gameOver = false;
  state.waitingNextBatter = false;
  state.batterCardExpanded = false;
  state.lastPitchPattern = null;
  if (MP.initPitchProgressionState) MP.initPitchProgressionState();
  resetTagDetail();
  resetPitcherTagDetail();
  els.resultOverlay.hidden = true;
  if (els.rewardOverlay) els.rewardOverlay.hidden = true;
  els.pitcherSelectOverlay.hidden = true;
  if (els.themeSelectOverlay) els.themeSelectOverlay.hidden = true;
  els.logList.innerHTML = "";
  startAtBat();
  render();
  showStageThemeOverlay(currentStageNumber(), currentStageInnings());
  if (currentBatter().isBoss) window.setTimeout(showBatterEntryBanner, GAME_TIMING.bossEntryBanner);
  const coreTagName = tagById(state.pitcher.coreTagId)?.name || "핵심태그";
  addLog(
    "새 경기",
    `${state.pitcher.name} 등판. 핵심태그: ${coreTagName}. ${state.catcher.label}와 호흡을 맞춥니다. ${currentStageRunLimit()}실점 전에 ${currentStageInnings()}이닝을 버티는 것이 목표입니다.`
  );
}

function startAtBat() {
  clearAutoAdvance();
  clearCourseFlash();
  resetTagDetail();
  state.balls = 0;
  state.strikes = 0;
  state.consecutiveBalls = 0;
  state.atBat = createPlan(currentBatter());
  state.lastLocation = null;
  state.lastPitchCall = null;
  state.consecutiveOnBase = 0;
  state.fullCountSeen = 0;
  state.flashZone = null;
  state.batterCardExpanded = false;
  if (!state.selectedPitchId) state.selectedPitchId = state.pitcher.repertoire[0]?.id || null;
  state.waitingNextBatter = false;
  els.nextBatterButton.hidden = true;
  hideTiming();
}

function currentBatter() {
  return state.lineup[state.batterIndex % state.lineup.length];
}

function pitcherEffectiveStat(statName) {
  const pressure = state.bases.some(Boolean) ? Math.max(0, 68 - state.pitcher.stats.멘탈) * 0.08 : 0;
  return clamp(state.pitcher.stats[statName] - pressure, 18, 98);
}

function pitchQuality(pitch) {
  const velocityPower = pitch.category === "fast" ? pitcherEffectiveStat("구속") * 0.52 : 0;
  const movementPower = pitch.category !== "fast" ? pitcherEffectiveStat("변화") * 0.55 : pitch.movement * 0.18;
  const controlPower = pitcherEffectiveStat("제구") * 0.34;
  return clamp((velocityPower + movementPower + controlPower + pitch.speed * 0.18 + pitch.control * 0.16) / 1.65, 20, 96);
}

function intendedCourse(zone, intent, targetRow = null, targetCol = null) {
  const base = courseZones[zone] || courseZones[5];
  const course = { row: base.row, col: base.col, label: base.label };
  if (intent !== "ball") return course;

  if (Number.isFinite(Number(targetRow)) && Number.isFinite(Number(targetCol))) {
    course.row = clamp(Number(targetRow), -1, 3);
    course.col = clamp(Number(targetCol), -1, 3);
    course.label = actualCourseLabel(course.row, course.col);
    return course;
  }

  if (base.row === 0) course.row = -1;
  else if (base.row === 2) course.row = 3;
  else if (base.col === 0) course.col = -1;
  else if (base.col === 2) course.col = 3;
  else if (chance(0.5)) course.row = chance(0.5) ? -1 : 3;
  else course.col = chance(0.5) ? -1 : 3;

  return course;
}

function actualCourseLabel(row, col) {
  if (row >= 0 && row <= 2 && col >= 0 && col <= 2) {
    if (col <= 0) return "몸쪽";
    if (col >= 2) return "바깥쪽";
    return "중앙";
  }
  if (row < 0) return "높은 볼";
  if (row > 2) return "낮은 볼";
  if (col < 0) return "몸쪽 볼";
  return "바깥쪽 볼";
}

function ballTakeDetail(location) {
  if (location.row < 0) return "높은 볼을 골라냈습니다.";
  if (location.row > 2) return "낮은 볼을 골라냈습니다.";
  if (location.col < 0) return "몸쪽 볼을 골라냈습니다.";
  if (location.col > 2) return "바깥쪽 볼을 골라냈습니다.";
  return "존에 걸친 공을 지켜봤습니다.";
}

function missStrikeZone(row, col, aimed) {
  if (aimed.row === 0) return { row: -1, col };
  if (aimed.row === 2) return { row: 3, col };
  if (aimed.col === 0) return { row, col: -1 };
  if (aimed.col === 2) return { row, col: 3 };
  return chance(0.5) ? { row: chance(0.5) ? -1 : 3, col } : { row, col: chance(0.5) ? -1 : 3 };
}

function resolvePitchLocation(pitch, plannedCourse) {
  const zone = Number(plannedCourse?.zone || 5);
  const intent = plannedCourse?.intent === "ball" ? "ball" : "strike";
  const aimed = intendedCourse(zone, intent, plannedCourse?.targetRow, plannedCourse?.targetCol);
  const runners = state.bases.filter(Boolean).length;
  const mental = state.pitcher.stats.멘탈 ?? 60;
  const pressurePenalty = runners > 0 ? Math.max(0, 72 - mental) * runners * 0.18 : 0;
  const commandScore = clamp(
    (pitch.control + pitcherEffectiveStat("제구")) / 2 -
      pressurePenalty -
      pitch.cost * 0.75 +
      pitcherTagControlBonus(pitch, aimed, intent),
    5,
    98
  );
  const strikeRecovery = intent === "strike" ? Math.min(state.consecutiveBalls * 9, 24) : 0;
  const effectiveCommand = clamp(commandScore + strikeRecovery, 5, 99);
  const driftChance = clamp(0.68 - effectiveCommand / 116, 0.025, 0.76);
  let row = aimed.row;
  let col = aimed.col;

  if (chance(driftChance)) {
    row += rand(-1, 1);
    col += rand(-1, 1);
  }
  if (effectiveCommand < 42 && chance(0.35)) {
    row += rand(-1, 1);
    col += rand(-1, 1);
  }

  row = clamp(row, -1, 3);
  col = clamp(col, -1, 3);

  const intentMissChance =
    intent === "ball"
      ? clamp(0.42 - effectiveCommand / 145, 0.04, 0.36)
      : clamp(0.36 - effectiveCommand / 145 - state.consecutiveBalls * 0.035, 0.015, 0.28);
  if (intent === "ball" && chance(intentMissChance)) {
    row = clamp(row, 0, 2);
    col = clamp(col, 0, 2);
  }
  if (intent === "strike" && chance(intentMissChance)) {
    const missed = missStrikeZone(row, col, aimed);
    row = clamp(missed.row, -1, 3);
    col = clamp(missed.col, -1, 3);
  }
  if (intent === "strike" && state.consecutiveBalls >= 2 && !(row >= 0 && row <= 2 && col >= 0 && col <= 2)) {
    const recoveryChance = clamp(0.24 + state.consecutiveBalls * 0.12 + effectiveCommand / 260, 0.32, 0.74);
    if (chance(recoveryChance)) {
      row = clamp(aimed.row, 0, 2);
      col = clamp(aimed.col, 0, 2);
    }
  }

  return {
    zone,
    intent,
    aimed,
    row,
    col,
    inZone: row >= 0 && row <= 2 && col >= 0 && col <= 2,
    centerMistake: row === 1 && col === 1,
    unintendedCenter: row === 1 && col === 1 && (aimed.row !== 1 || aimed.col !== 1),
    commandScore: effectiveCommand,
    rawCommandScore: commandScore,
    strikeRecovery,
    label: actualCourseLabel(row, col),
    actualLabel: actualCourseLabel(row, col)
  };
}

function selectPitch(pitchId) {
  if (pitchInputLocked()) return;
  state.selectedPitchId = pitchId;
  renderPitchButtons();
  renderCourseControls();
}

function selectPitchByNumber(numberKey) {
  if (pitchInputLocked()) return;
  const index = Number(numberKey) - 1;
  if (index < 0 || index > 4) return;
  const pitch = state.pitcher?.repertoire?.[index];
  if (!pitch) return;
  selectPitch(pitch.id);
}

function throwPitch(pitchId, zone, targetRow = null, targetCol = null) {
  if (pitchInputLocked()) return;

  const pitch = state.pitcher.repertoire.find((item) => item.id === pitchId);
  if (!pitch) return;

  const plannedCourse = {
    zone: Number(zone) || 5,
    intent: state.pitchIntent,
    ballPlan: state.pitchBallPlan,
    targetRow: Number.isFinite(Number(targetRow)) ? Number(targetRow) : null,
    targetCol: Number.isFinite(Number(targetCol)) ? Number(targetCol) : null
  };

  state.pitchCount += 1;
  const batter = currentBatter();
  const pattern = buildPitchMindContext(pitch, plannedCourse, batter);
  state.atBat.pitchHistory.push(pitch.category);

  hideTiming();

  const result = applyMindGameResult(resolvePitch(pitch, batter, plannedCourse, pattern), pattern);
  result.memoryLogLines = updateBatterMemoryAfterPitch(pitch, plannedCourse, result, batter);
  state.lastLocation = result.location;
  animatePitch(result.location, result.pitch);
  updateRead(result);
  const progressionSnapshot = { balls: state.balls, strikes: state.strikes, isBoss: !!batter?.isBoss };
  state.lastPitchPattern = pattern;
  if (MP.processPitchProgressionAfterPitch) MP.processPitchProgressionAfterPitch(result, progressionSnapshot, pattern);
  applyPitchResult(result);
  recordPitchPattern(pitch, plannedCourse, result, pattern);
  render();
}

function countSwingAdjustment(inZone) {
  let adjustment = 0;
  if (state.balls === 0 && state.strikes === 0) adjustment += 0.04;
  if (state.balls >= 2 && state.strikes === 0) adjustment += inZone ? 0.14 : -0.1;
  if (state.balls === 3) adjustment += inZone ? 0.22 : -0.16;
  if (state.strikes === 2) adjustment += inZone ? 0.13 : 0.19;
  if (state.strikes > state.balls && state.strikes < 2) adjustment += inZone ? 0.08 : 0.04;
  if (state.balls > state.strikes && state.balls < 3) adjustment += inZone ? 0.08 : -0.05;
  return adjustment;
}

function pitchSpecialEffect(pitch, location, atBat) {
  const effect = {
    quality: 0,
    swing: 0,
    contact: 0,
    contactQuality: 0,
    doublePlayBonus: 0,
    label: ""
  };
  const lowCourse = location.row >= 2;
  const edgeCourse = location.col <= 0 || location.col >= 2;
  const previousCategory = atBat.pitchHistory[atBat.pitchHistory.length - 2] || "";

  if (pitch.id === "four" && state.strikes === 2) {
    effect.quality += 6;
    effect.swing += location.inZone ? 0.05 : 0.02;
    effect.label = "포심 결정구 보너스";
  }
  if (pitch.id === "two" && lowCourse) {
    effect.contactQuality -= 8;
    effect.doublePlayBonus += 0.16;
    effect.label = "낮은 투심 땅볼 유도";
  }
  if (pitch.id === "slider" && edgeCourse) {
    effect.swing += 0.08;
    effect.contact -= 0.07;
    effect.contactQuality -= 5;
    effect.label = "슬라이더 유인 효과";
  }
  if (pitch.id === "curve" && atBat.pitchHistory.length <= 1) {
    effect.quality += 5;
    effect.contactQuality -= 6;
    effect.label = "초구 커브 타이밍 교란";
  }
  if (pitch.id === "change" && previousCategory === "fast") {
    effect.swing += 0.05;
    effect.contact -= 0.1;
    effect.contactQuality -= 9;
    effect.label = "직구 뒤 체인지업 완급차";
  }
  if (pitch.id === "splitter" && lowCourse) {
    effect.swing += 0.1;
    effect.contact -= 0.12;
    effect.contactQuality -= 10;
    effect.label = "낮은 스플리터 낙차";
  }
  if (pitch.id === "cutter" && edgeCourse) {
    effect.contact -= 0.05;
    effect.contactQuality -= 8;
    effect.label = "커터 빗맞힘 유도";
  }

  return effect;
}

function mindGameEffect(pitch, batter, plannedCourse, pattern, location) {
  const effect = {
    quality: 0,
    swing: 0,
    chase: 0,
    contact: 0,
    foul: 0,
    contactQuality: 0,
    label: ""
  };
  const suspicionPower = (pattern?.suspicion || 0) / 100;
  if (pattern?.exposed) {
    effect.swing += 0.05 + suspicionPower * 0.1;
    effect.contact += 0.04 + suspicionPower * 0.08;
    effect.foul += 0.06 + suspicionPower * 0.08;
    effect.contactQuality += suspicionPower * 10;
    effect.label = "패턴 노출";
  }
  if (pattern?.reverseRead) {
    effect.contact += 0.06;
    effect.contactQuality += 8;
    effect.label = "역노림 경계";
  }

  const ballPlan = ballIntentPlans[pattern?.ballIntent];
  if (ballPlan) {
    if (pattern.ballIntent === "fishing") {
      effect.swing += 0.08;
      effect.chase += 0.1;
      effect.contact -= 0.05;
      effect.label = ballPlan.label;
    }
    if (pattern.ballIntent === "show") {
      effect.quality += 2;
      effect.contactQuality -= 2;
      effect.label = ballPlan.label;
    }
    if (pattern.ballIntent === "waste") {
      effect.contactQuality -= 1;
      effect.label = ballPlan.label;
    }
    if (pattern.ballIntent === "brush") {
      effect.swing -= 0.03;
      effect.contactQuality -= 4;
      effect.label = ballPlan.label;
    }
  }

  if (batter.tendency?.id === "firstPitchAggro" && state.balls === 0 && state.strikes === 0) effect.swing += 0.12;
  if (batter.tendency?.id === "firstPitchWatch" && state.balls === 0 && state.strikes === 0) {
    if (!location.inZone) effect.chase -= 0.1;
    else effect.swing += batter.tendency.firstPitchSwing || -0.06;
  }
  if (batter.tendency?.id === "twoStrike" && state.strikes === 2) effect.foul += 0.1;
  if (batter.tendency?.id === "walkHunter" && !location.inZone) effect.chase -= 0.1;
  if (batter.tendency?.id === "slugger") {
    if (location.centerMistake) effect.contactQuality += 8;
    else if (isInsideMistake(location)) effect.contactQuality += 6;
  }
  if (batter.tendency?.id === "reactive" && (pattern?.suspicion || 0) >= 50) effect.contact += 0.08;

  if (batter.bossGimmick?.id === "sluggerKing" && location.centerMistake) effect.contactQuality += 16;
  if (batter.bossGimmick?.id === "cutMaster" && state.strikes === 2) effect.foul += 0.18;
  if (batter.bossGimmick?.id === "walkMonster" && !location.inZone) effect.chase -= 0.12;
  if (batter.bossGimmick?.id === "clutch" && state.bases.some(Boolean)) {
    effect.contact += 0.08;
    effect.contactQuality += 9;
  }
  if (batter.bossGimmick?.id === "geniusEye") {
    effect.foul += 0.06;
    if (pattern?.exposed) effect.contactQuality += 7;
  }

  return effect;
}

function pitcherProfileEffect(pitch, plannedCourse) {
  const profileId = state.pitcher?.profileId;
  const effect = { quality: 0, contactQuality: 0, label: "" };
  if (profileId === "power" && pitch.category === "fast") {
    effect.quality += 3;
    effect.label = "파워 피처 구위";
  }
  if (profileId === "breaking" && pitch.category !== "fast") {
    effect.quality += 2;
    effect.contactQuality -= 3;
    effect.label = "변화구 장인 감각";
  }
  if (profileId === "command" && plannedCourse.intent === "strike") {
    effect.quality += 1.5;
    effect.label = "제구형 투수 코너워크";
  }
  if (profileId === "balanced" && state.balls === state.strikes) {
    effect.quality += 1;
    effect.label = "균형형 투수 안정감";
  }
  return effect;
}

function applyTagLikeEffects(effect, effects, pitch, location) {
  if (!effects) return;
  const lowCourse = location.row >= 2;
  const highCourse = location.row <= 0 && location.inZone;
  if (pitch.category === "fast" && effects.fastQualityBonus) effect.quality += effects.fastQualityBonus;
  if (pitch.category !== "fast" && effects.secondaryQualityBonus) effect.quality += effects.secondaryQualityBonus;
  if (state.balls === state.strikes && effects.evenCountQualityBonus) effect.quality += effects.evenCountQualityBonus;
  if (state.strikes >= 2 && effects.twoStrikeQualityBonus) effect.quality += effects.twoStrikeQualityBonus;
  if (state.strikes >= 2 && effects.twoStrikeContactPenalty) effect.contact -= effects.twoStrikeContactPenalty;
  if ((state.atBat?.pitchHistory?.length || 0) <= 1 && effects.firstPitchQualityBonus) effect.quality += effects.firstPitchQualityBonus;
  if (highCourse && pitch.category === "fast" && effects.highFastQualityBonus) effect.quality += effects.highFastQualityBonus;
  if (highCourse && pitch.category === "fast" && effects.highFastWhiffBonus) {
    effect.swing += effects.highFastWhiffBonus;
    effect.contact -= effects.highFastWhiffBonus;
  }
  if (pitch.category !== "fast" && effects.whiffBonus) {
    effect.swing += effects.whiffBonus;
    effect.contact -= effects.whiffBonus;
  }
  if (!location.inZone && effects.chaseBonus) effect.chase += effects.chaseBonus;
  if (lowCourse && effects.groundballBonus) effect.doublePlayBonus += effects.groundballBonus;
  if (lowCourse && effects.lowContactQualityPenalty) effect.contactQuality -= effects.lowContactQualityPenalty;
  if (effects.counterContactPenalty) effect.contactQuality -= effects.counterContactPenalty;
  if (location.centerMistake && effects.mistakeHomerunRisk) effect.contactQuality += effects.mistakeHomerunRisk;
  if (state.atBat?.ballIntent === "brush" && effects.brushContactPenalty) effect.contactQuality -= effects.brushContactPenalty;
  if (effects.contactQuality) effect.contactQuality += effects.contactQuality;
  if (effects.doublePlayBonus) effect.doublePlayBonus += effects.doublePlayBonus;
}

function pitcherTagEffect(pitch, location, plannedCourse, atBat) {
  const effect = {
    quality: 0,
    swing: 0,
    chase: 0,
    contact: 0,
    contactQuality: 0,
    doublePlayBonus: 0,
    label: ""
  };
  const tags = pitcherAllTagIds().map(tagById).filter(Boolean);

  tags.forEach((tag) => {
    const effects = tagEffectsForPitcher(tag, state.pitcher);
    applyTagLikeEffects(effect, effects, pitch, location);
    if (!effect.label && tag.type === "bonus") effect.label = tag.name;
  });

  const evoEffects = activeEvolutionEffects(pitch, location, atBat, state.pitchIntent);
  applyTagLikeEffects(effect, evoEffects, pitch, location);
  const evolution = coreEvolutionById(state.pitcher?.coreEvolutionId);
  if (evolution && Object.keys(evoEffects).length && !effect.label) effect.label = evolution.name;

  return effect;
}

function applyMindGameResult(result, pattern) {
  const falseClue = pattern?.falseClue;
  const ballPlan = ballIntentPlans[pattern?.ballIntent];
  const patternLine =
    pattern?.exposed && pattern.memoryModifiers && memoryModifiersActive(pattern.memoryModifiers)
      ? "타자가 최근 배합을 의식하고 있습니다."
      : "";
  return {
    ...result,
    pattern,
    falseClue,
    ballIntentPlan: ballPlan || null,
    countBefore: pattern?.count,
    runnersBefore: pattern?.runners,
    memoryLogLines: pattern?.memoryLogLines || [],
    clue: [result.clue, patternLine].filter(Boolean).join(" ")
  };
}

function buildPitchResolutionContext(pitch, batter, plannedCourse, pattern = {}) {
  const atBat = state.atBat;
  const targetMatch = isTargetedPitchCategory(pitch.category, atBat.target);
  const location = resolvePitchLocation(pitch, plannedCourse);
  let special = pitchSpecialEffect(pitch, location, atBat);
  if (MP.mergePitchLevelEffect) special = MP.mergePitchLevelEffect(special, pitch, location, atBat);
  const burden = MP.getBurdenModifiers
    ? MP.getBurdenModifiers(pitch)
    : { commandPenalty: 0, mistakeBonus: 0, homerunBonus: 0, whiffBonus: 0, label: "" };
  const mind = mindGameEffect(pitch, batter, plannedCourse, pattern, location);
  const profile = pitcherProfileEffect(pitch, plannedCourse);
  const tagEffect = pitcherTagEffect(pitch, location, plannedCourse, atBat);
  const batterTag = batterTagEffect(pitch, batter, location, targetMatch);
  const mem = pattern.memoryModifiers || createEmptyMemoryModifiers();
  const quality = clamp(pitchQuality(pitch) + (location.commandScore - 60) * 0.08 + special.quality + mind.quality + profile.quality + tagEffect.quality - burden.commandPenalty, 20, 99);
  const repeatCount = [...atBat.pitchHistory].reverse().filter((category) => category === pitch.category).length;
  const repeatedPenalty = Math.max(0, repeatCount - 1) * 0.07;
  const inZone = location.inZone;
  const themeFx = MP.stageThemePitchEffect
    ? MP.stageThemePitchEffect(state.stageThemeId, batter, {
        stageIndex: state.stageIndex,
        balls: state.balls,
        strikes: state.strikes,
        outs: state.outs,
        inZone,
        targetMatch,
        centerMistake: location.centerMistake,
        calledStrikeBias: false
      })
    : {};
  const centerSwingBonus = location.centerMistake ? (location.unintendedCenter ? 0.18 : 0.11) : 0;
  const centerContactBonus = location.centerMistake ? (location.unintendedCenter ? 0.12 : 0.07) : 0;
  const centerQualityBonus = location.centerMistake ? (location.unintendedCenter ? 18 : 11) : 0;
  const memoryQualityBonus = (mem.qualityBonus || 0) * 10 + (mem.hardHitBonus || 0) * 12;

  return {
    pitch,
    batter,
    atBat,
    targetMatch,
    location,
    special,
    burden,
    mind,
    profile,
    tagEffect,
    batterTag,
    mem,
    quality,
    repeatedPenalty,
    inZone,
    themeFx,
    centerSwingBonus,
    centerContactBonus,
    centerQualityBonus,
    memoryQualityBonus
  };
}

function pitchSwingProbability(context) {
  const { atBat, batter, targetMatch, inZone, special, mind, tagEffect, batterTag, mem, themeFx, centerSwingBonus } = context;
  let swingProbability = inZone ? 0.46 : 0.16;
  if (atBat.approach === "적극") swingProbability += 0.13;
  if (atBat.approach === "신중") swingProbability -= 0.12;
  if (atBat.approach === "초구" && state.balls === 0 && state.strikes === 0) swingProbability += 0.22;
  if (atBat.approach === "보호" && state.strikes === 2) swingProbability += 0.24;
  swingProbability += targetMatch ? 0.2 : -0.09;
  swingProbability += countSwingAdjustment(inZone) + special.swing + mind.swing + tagEffect.swing + batterTag.swing + centerSwingBonus + (mem.swingBonus || 0) + (themeFx.swing || 0);
  if (!inZone) swingProbability += mind.chase + tagEffect.chase + batterTag.chase + (mem.chasePenalty || 0) + (themeFx.chase || 0);
  if (!inZone) swingProbability -= batter.stats.선구 / 230;
  return swingProbability;
}

function pitchTiming(context) {
  const { pitch, batter, atBat, targetMatch, quality, repeatedPenalty } = context;
  const deception = targetMatch ? -0.12 : 0.16;
  const timingBase = 0.34 + batter.stats.예측 / 180 + (targetMatch ? 0.2 : -0.11) - quality / 360 - repeatedPenalty + deception;
  const timingValue = clamp(timingBase + (Math.random() - 0.5) * 0.34, 0.05, 0.98);
  const timingLabel = timingText(pitch.category, atBat.target, timingValue);
  return {
    timingValue,
    timingLabel,
    fooledContactPenalty: timingLabel === "완전히 속음" ? -0.22 : 0,
    fooledQualityPenalty: timingLabel === "완전히 속음" ? -30 : 0
  };
}

function pitchContactProbability(context, timing) {
  const { batter, targetMatch, quality, repeatedPenalty, special, mind, tagEffect, batterTag, centerContactBonus, themeFx, burden, mem } = context;
  return (
    0.14 +
    batter.stats.컨택 / 170 +
    timing.timingValue * 0.34 -
    quality / 260 +
    (targetMatch ? 0.09 : -0.08) +
    repeatedPenalty +
    special.contact +
    mind.contact +
    tagEffect.contact +
    batterTag.contact +
    centerContactBonus +
    timing.fooledContactPenalty +
    (themeFx.contact || 0) +
    burden.mistakeBonus -
    burden.whiffBonus +
    (mem.contactBonus || 0)
  );
}

function pitchFoulProbability(context, timingValue) {
  const { mind, batterTag, mem, themeFx } = context;
  return 0.34 + Math.abs(0.58 - timingValue) * 0.28 + (state.strikes === 2 ? 0.12 : 0) + mind.foul + batterTag.foul + (mem.foulBonus || 0) + (themeFx.foul || 0);
}

function pitchContactQuality(context, timing) {
  const { batter, targetMatch, quality, repeatedPenalty, special, mind, tagEffect, batterTag, profile, centerQualityBonus, memoryQualityBonus, burden, themeFx } = context;
  return (
    batter.stats.컨택 * 0.28 +
    batter.stats.파워 * 0.48 +
    timing.timingValue * 42 -
    quality * 0.33 +
    (targetMatch ? 14 : -10) +
    repeatedPenalty * 70 +
    special.contactQuality +
    mind.contactQuality +
    tagEffect.contactQuality +
    batterTag.contactQuality +
    profile.contactQuality +
    centerQualityBonus +
    timing.fooledQualityPenalty +
    memoryQualityBonus +
    burden.mistakeBonus * 120 +
    burden.homerunBonus * 160 +
    (themeFx.homerunBonus || 0) * 120 +
    (themeFx.contactQuality || 0) +
    rand(-12, 16)
  );
}

function pitchResultSpecial(context) {
  const { special, mind, batterTag, tagEffect, profile } = context;
  return { ...special, label: mind.label || batterTag.label || tagEffect.label || special.label || profile.label };
}

function ballInPlaySpecial(context) {
  const { special, tagEffect, batterTag } = context;
  return {
    ...pitchResultSpecial(context),
    doublePlayBonus: (special.doublePlayBonus || 0) + (tagEffect.doublePlayBonus || 0) + (batterTag.doublePlayBonus || 0),
    groundOutReduce: (special.groundOutReduce || 0) + (batterTag.groundOutReduce || 0),
    texasHitBonus: batterTag.texasHitBonus || 0
  };
}

function resolvePitch(pitch, batter, plannedCourse, pattern = {}) {
  const context = buildPitchResolutionContext(pitch, batter, plannedCourse, pattern);
  const { atBat, targetMatch, location, inZone, mem } = context;
  const swung = chance(pitchSwingProbability(context));

  if (!swung) {
    let noSwingResult = inZone ? "calledStrike" : "ball";
    if (!inZone && (mem.takeBallBonus || 0) > 0 && chance(0.08 + mem.takeBallBonus)) noSwingResult = "ball";
    return {
      pitch,
      batter,
      location,
      inZone,
      swung,
      targetMatch,
      special: pitchResultSpecial(context),
      timingValue: 0,
      timingLabel: inZone ? "지켜봄" : "참아냄",
      result: noSwingResult,
      detail: inZone ? "스트라이크를 지켜봤습니다." : ballTakeDetail(location),
      clue: inZone && !targetMatch ? "노림과 다른 공에 얼어붙은 듯합니다." : "선구안으로 공을 봤습니다."
    };
  }

  const timing = pitchTiming(context);
  if (!chance(pitchContactProbability(context, timing))) {
    return {
      pitch,
      batter,
      location,
      inZone,
      swung,
      targetMatch,
      special: pitchResultSpecial(context),
      timingValue: timing.timingValue,
      timingLabel: timing.timingLabel,
      result: "swingingStrike",
      detail: "배트가 공 밑을 지나갔습니다.",
      clue: targetMatch ? "노림은 맞았지만 공의 힘이 이겼습니다." : "타이밍이 크게 흔들렸습니다."
    };
  }

  if (chance(pitchFoulProbability(context, timing.timingValue)) && timing.timingValue < 0.78) {
    return {
      pitch,
      batter,
      location,
      inZone,
      swung,
      targetMatch,
      special: pitchResultSpecial(context),
      timingValue: timing.timingValue,
      timingLabel: timing.timingLabel,
      result: "foul",
      detail: "간신히 걷어냈습니다.",
      clue: targetMatch ? "기다린 공에 가까웠습니다." : "맞히긴 했지만 중심은 벗어났습니다."
    };
  }

  return makeBallInPlayResult({
    pitch,
    batter,
    location,
    inZone,
    swung,
    targetMatch,
    special: ballInPlaySpecial(context),
    timingValue: timing.timingValue,
    timingLabel: timing.timingLabel,
    contactQuality: pitchContactQuality(context, timing)
  });
}

function timingText(pitchCategory, targetCategory, value) {
  if (value > 0.82) return "완벽";
  if (value > 0.66) return "좋음";
  if (value > 0.48) return "불안정";
  if (isTargetedPitchCategory(pitchCategory, targetCategory)) return value > 0.34 ? "밀림" : "완전히 속음";
  if (targetCategory === "fast" && pitchCategory !== "fast") return "너무 빠름";
  if (targetCategory !== "fast" && pitchCategory === "fast") return "늦음";
  return value > 0.34 ? "밀림" : "완전히 속음";
}

function battedDirection(timingValue) {
  if (timingValue > 0.72) return { style: "당겨쳐", lane: "좌중간", side: "왼쪽" };
  if (timingValue < 0.5) return { style: "밀어쳐", lane: "우중간", side: "오른쪽" };
  return { style: "정면으로 받아쳐", lane: "중견수 앞", side: "가운데" };
}

function hitDetail(base, bases) {
  const direction = battedDirection(base.timingValue);
  if (base.hitType === "texas") {
    return `텍사스 안타! 완전히 속였지만 ${direction.side} 외야 앞에 힘없이 떨어졌습니다.`;
  }
  if (bases >= 4) return `${direction.style} ${direction.side} 담장을 넘겼습니다.`;
  if (bases === 2) return `${direction.style} ${direction.lane}을 가르는 2루타입니다.`;
  return `${direction.style} ${direction.lane}으로 빠지는 안타입니다.`;
}

function errorChanceFor(base) {
  const weakGrounder = base.contactQuality < 42 || base.location.row >= 2;
  let errorChance = 0.015;
  if (weakGrounder) errorChance += 0.018;
  if (state.bases.some(Boolean)) errorChance += 0.008;
  if ((state.pitcher.stats.멘탈 ?? 60) < 46) errorChance += 0.008;
  return clamp(errorChance, 0.005, 0.055);
}

function makeBallInPlayResult(base) {
  const { contactQuality, batter, pitch, location, special } = base;
  let texasChance = 0.1 + (special?.texasHitBonus || 0);
  if (pitcherHasTag("texas_suppress")) {
    const suppress = tagById("texas_suppress")?.effects?.texasHitSuppress || 0.06;
    texasChance -= suppress;
  }
  texasChance = clamp(texasChance, 0.02, 0.22);

  if (base.timingLabel === "완전히 속음") {
    if (contactQuality > 48 && chance(texasChance)) {
      const texasBase = { ...base, hitType: "texas" };
      return {
        ...texasBase,
        result: "single",
        detail: hitDetail(texasBase, 1),
        clue: "배트 중심은 아니었지만 수비 사이에 떨어졌습니다."
      };
    }
    return {
      ...base,
      result: "inPlayOut",
      outLabel: "GROUND OUT!",
      detail: "완전히 속은 타구가 힘없이 굴렀습니다.",
      clue: "타이밍을 빼앗아 정타를 막았습니다."
    };
  }

  if (contactQuality > 82) {
    return {
      ...base,
      result: "homerun",
      detail: hitDetail(base, 4),
      clue: "타자의 노림수와 타이밍이 모두 맞았습니다."
    };
  }
  if (contactQuality > 67) {
    return {
      ...base,
      result: "double",
      detail: hitDetail(base, 2),
      clue: "배트 중심에 꽤 가깝게 맞았습니다."
    };
  }
  if (contactQuality > 52) {
    return {
      ...base,
      result: "single",
      detail: hitDetail(base, 1),
      clue: "타이밍이 어느 정도 맞았습니다."
    };
  }
  const doublePlayChance =
    state.bases[0] && state.outs < 2 && contactQuality <= 50
      ? clamp(
          0.14 + (pitch.category === "breaking" ? 0.12 : 0) + (location.row >= 2 ? 0.1 : 0) + (special?.doublePlayBonus || 0),
          0,
          0.32
        )
      : 0;
  if (doublePlayChance > 0 && chance(doublePlayChance)) {
    return {
      ...base,
      result: "doublePlay",
      detail: "낮게 맞은 땅볼이 병살 코스로 흘렀습니다.",
      clue: pitch.category === "breaking" ? "변화구로 타자의 타이밍을 앞당겼습니다." : "코스가 낮아 타구가 눌렸습니다."
    };
  }
  if (chance(errorChanceFor(base))) {
    return {
      ...base,
      result: "error",
      detail: "처리 가능한 타구였지만 수비 실책으로 출루를 허용했습니다.",
      clue: "타구 질은 약했지만 야수 판단이 흔들렸습니다."
    };
  }
  const groundOutRoll = contactQuality < 38 || pitch.id === "two" || location.row >= 2;
  const groundOut = groundOutRoll && !chance(special?.groundOutReduce || 0);
  return {
    ...base,
    result: "inPlayOut",
    outLabel: groundOut ? "GROUND OUT!" : "FLY OUT!",
    detail: groundOut ? "힘없는 땅볼입니다." : "높이 뜬 타구입니다.",
    clue: "맞았지만 정타는 아니었습니다."
  };
}

function updateRead(result) {
  const scores = state.atBat.readScores;
  const selected = result.pitch.category;

  if (result.swung && result.timingValue > 0.68) scores[selected] += result.targetMatch ? 1.35 : 0.75;
  if (result.result === "foul") scores[selected] += 0.42;
  if (result.result === "ball" && !result.inZone) scores[selected] -= 0.16;
  if (result.result === "calledStrike") {
    scores[selected] -= 0.22;
    Object.keys(scores).forEach((key) => {
      if (key !== selected) scores[key] += 0.13;
    });
  }
  if (result.timingLabel === "너무 빠름") scores.fast += 0.8;
  if (result.timingLabel === "늦음") {
    scores.breaking += 0.46;
    scores.offspeed += 0.46;
  }
  if (result.timingLabel === "완전히 속음") scores[selected] -= 0.3;
  if (result.falseClue && scores[result.falseClue] !== undefined) {
    scores[result.falseClue] += 0.55;
    scores[selected] -= 0.12;
  }
  const themeReadPenalty = MP.stageThemePitchEffect
    ? MP.stageThemePitchEffect(state.stageThemeId, currentBatter(), { stageIndex: state.stageIndex }).readPenalty || 0
    : 0;
  if (themeReadPenalty > 0) {
    Object.keys(scores).forEach((key) => {
      scores[key] *= Math.max(0.72, 1 - themeReadPenalty);
    });
  }
  if (result.ballIntentPlan && result.pattern?.ballIntent === "waste") {
    scores[selected] += 0.22;
  }

  Object.keys(scores).forEach((key) => {
    scores[key] = clamp(scores[key], 0.2, 8);
  });
}

function pitchCall(result) {
  if (result.result === "ball") return { label: "BALL", type: "ball" };
  if (result.result === "foul") return { label: "FOUL!", type: "foul" };
  if (result.result === "calledStrike" || result.result === "swingingStrike") {
    return { label: "STRIKE!", type: "strike" };
  }
  return { label: "", type: "inplay" };
}

function majorResultText(result) {
  const nextBalls = state.balls + 1;
  const nextStrikes = state.strikes + 1;

  switch (result.result) {
    case "ball":
      return nextBalls >= 4 ? "WALK!" : "";
    case "calledStrike":
      return nextStrikes >= 3 ? "STRIKE OUT!" : "";
    case "swingingStrike":
      return nextStrikes >= 3 ? "STRIKE OUT!" : "";
    case "foul":
      return "";
    case "inPlayOut":
      return result.outLabel || "FLY OUT!";
    case "doublePlay":
      return "DOUBLE PLAY!";
    case "error":
      return "ERROR!";
    case "single":
      return result.hitType === "texas" ? "TEXAS HIT!" : "BASE HIT!";
    case "double":
      return "DOUBLE!";
    case "homerun":
      return "HOME RUN!";
    default:
      return "";
  }
}

function majorResultTone(result) {
  if (result.result === "homerun" || result.result === "double" || result.result === "single") return "hit";
  if (result.result === "ball" || result.result === "error") return "walk";
  return "out";
}

function swingFeedbackText(result) {
  if (!result.swung) return "";
  if (result.timingValue > 0.78) return "FULL SWING";
  if (result.timingValue > 0.62) return "GOOD SWING";
  if (result.timingValue > 0.42) return "CHECK SWING";
  return "WEAK SWING";
}

function swingFeedbackTone(result) {
  if (result.timingValue > 0.7) return "danger";
  if (result.timingValue > 0.45) return "warn";
  return "good";
}

function atBatMemoryFrom(title, result) {
  if (!result) return null;
  let memoryResult = "neutral";
  if (title === "STRIKE OUT!") {
    memoryResult = result.result === "calledStrike" ? "lookingStrikeout" : "swingingStrikeout";
  } else if (title === "DOUBLE PLAY!") {
    memoryResult = "doublePlay";
  } else if (["BASE HIT!", "TEXAS HIT!", "DOUBLE!", "HOME RUN!"].includes(title)) {
    memoryResult = "hit";
  }
  return {
    result: memoryResult,
    category: result.pitch.category,
    pitchId: result.pitch.id,
    timingLabel: result.timingLabel,
    actualRow: result.location?.row,
    actualCol: result.location?.col
  };
}

function strikeoutRewardReason(result) {
  if (result.batter.isBoss) return result.result === "calledStrike" ? "보스 타자 루킹삼진" : "보스 타자 스윙삼진";
  return result.result === "calledStrike" ? "루킹삼진 보상" : "스윙삼진 보상";
}

function hitTitle(result) {
  if (result.result === "single" && result.hitType === "texas") return "TEXAS HIT!";
  if (result.result === "single") return "BASE HIT!";
  if (result.result === "double") return "DOUBLE!";
  if (result.result === "homerun") return "HOME RUN!";
  return "";
}

function applyPitchResult(result) {
  const title = pitchLogTitle(result);
  const text = pitchLogText(result);
  const revealText = targetRevealText(result);
  state.lastPitchCall = pitchCall(result);
  playResultSound(result);
  if (state.balls === 3 && state.strikes === 2) {
    state.fullCountSeen += 1;
    if (state.fullCountSeen >= 3) checkWeaknessReveal("fullCountStress");
  }

  const majorText = majorResultText(result);
  if (majorText) showEventBanner(majorText, majorResultTone(result), GAME_TIMING.eventBannerPitchResult);

  const swingFeedback = swingFeedbackText(result);
  if (swingFeedback) queueTiming(swingFeedback, swingFeedbackTone(result));
  els.batterFigure.classList.toggle("swing", result.swung);

  window.setTimeout(() => {
    hideTiming();
    els.strikeZone.classList.remove("flash-danger", "flash-good");
    els.batterFigure.classList.remove("swing");
    hideBallSprite();
  }, GAME_TIMING.pitchResultCleanup);

  if (result.result !== "ball") state.consecutiveBalls = 0;

  switch (result.result) {
    case "ball":
      state.consecutiveBalls += 1;
      state.balls += 1;
      if (state.balls >= 4) {
        walkBatter();
        noteOnBaseAllowed("walk");
        state.runStats.walks += 1;
        if (state.runStats.walks >= 2) checkWeaknessReveal("allowWalk");
        finishAtBat("WALK!", pitchLogText(result, { extra: "볼넷입니다." }));
      } else {
        addLog(title, text);
      }
      break;
    case "calledStrike":
    case "swingingStrike":
      state.strikes += 1;
      if (state.strikes >= 3) {
        noteOutRecorded();
        addOut();
        state.runStats.strikeouts += 1;
        if (result.batter.isBoss) state.runStats.bossOuts += 1;
        finishAtBat("STRIKE OUT!", pitchLogText(result, { reveal: revealText }), {
          rewardReason: strikeoutRewardReason(result),
          result
        });
      } else {
        addLog(title, text);
      }
      break;
    case "foul":
      if (state.strikes < 2) state.strikes += 1;
      addLog(title, text);
      break;
    case "inPlayOut":
      noteOutRecorded();
      addOut();
      if (result.batter.isBoss) state.runStats.bossOuts += 1;
      finishAtBat(result.outLabel || "FLY OUT!", pitchLogText(result, { reveal: revealText }), {
        rewardReason: result.batter.isBoss ? "보스 타자 제압" : "",
        result
      });
      break;
    case "error":
      advanceRunners(1);
      noteOnBaseAllowed("error");
      finishAtBat("ERROR!", pitchLogText(result, { reveal: revealText }), { result });
      break;
    case "doublePlay":
      noteOutRecorded();
      turnDoublePlay();
      state.runStats.doublePlays += 1;
      if (result.batter.isBoss) state.runStats.bossOuts += 1;
      finishAtBat("DOUBLE PLAY!", pitchLogText(result, { reveal: revealText }), {
        rewardReason: result.pitch.category === "breaking" ? "변화구 병살 보너스" : "병살 보너스",
        result
      });
      break;
    case "single":
      advanceRunners(1);
      noteOnBaseAllowed("hit");
      state.runStats.hits += 1;
      if (result.batter.isBoss) state.runStats.bossDamage += 1;
      finishAtBat(hitTitle(result), pitchLogText(result, { reveal: revealText }), { result });
      break;
    case "double":
      advanceRunners(2);
      noteOnBaseAllowed("hit");
      state.runStats.hits += 1;
      state.runStats.doubles += 1;
      if (result.batter.isBoss) state.runStats.bossDamage += 1;
      finishAtBat(hitTitle(result), pitchLogText(result, { reveal: revealText }), { result });
      break;
    case "homerun":
      advanceRunners(4);
      noteOnBaseAllowed("homerun");
      checkWeaknessReveal("allowHomerun");
      state.runStats.hits += 1;
      state.runStats.homeruns += 1;
      if (result.batter.isBoss) state.runStats.bossDamage += 1;
      finishAtBat(hitTitle(result), pitchLogText(result, { reveal: revealText }), { result });
      break;
    default:
      addLog(title, text);
  }

  if (state.runs >= currentStageRunLimit()) {
    queueGameOverAfterResult(result, `${currentStageRunLimit()}실점에 도달했습니다. 오늘은 타자들의 노림수가 한 수 빨랐습니다.`);
  }
}

function walkBatter() {
  if (state.bases[0] && state.bases[1] && state.bases[2]) state.runs += 1;
  if (state.bases[0] && state.bases[1]) state.bases[2] = true;
  if (state.bases[0]) state.bases[1] = true;
  state.bases[0] = true;
}

function checkWeaknessReveal(eventType) {
  const pitcher = state.pitcher;
  if (!pitcher?.hiddenWeaknessTags?.length) return;
  const tagId = pitcher.hiddenWeaknessTags.find((id) => tagById(id)?.revealCondition === eventType);
  if (!tagId) return;
  const tag = tagById(tagId);
  pitcher.hiddenWeaknessTags = pitcher.hiddenWeaknessTags.filter((id) => id !== tagId);
  pitcher.revealedWeaknessTags = [...new Set([...(pitcher.revealedWeaknessTags || []), tagId])];
  addLog("약점 태그 공개", `${tag.name} · ${tag.description}`);
  showEventBanner("WEAKNESS REVEALED!", "walk", GAME_TIMING.weaknessBanner);
}

function noteOnBaseAllowed() {
  state.consecutiveOnBase += 1;
  if (state.consecutiveOnBase >= 2) checkWeaknessReveal("consecutiveOnBase");
}

function noteOutRecorded() {
  state.consecutiveOnBase = 0;
}

function advanceRunners(bases) {
  if (bases >= 4) {
    const occupied = state.bases.filter(Boolean).length;
    state.runs += occupied + 1;
    state.bases = [false, false, false];
    return;
  }

  for (let index = 2; index >= 0; index -= 1) {
    if (!state.bases[index]) continue;
    state.bases[index] = false;
    const destination = index + bases;
    if (destination >= 3) state.runs += 1;
    else state.bases[destination] = true;
  }
  state.bases[bases - 1] = true;
}

function turnDoublePlay() {
  state.bases[0] = false;
  addOut(2);
}

function queueTransitionBanner(text, tone = "inning", duration = 1600) {
  state.pendingTransitionBanner = { text, tone, duration };
}

function advanceStage(themeId = state.stageThemeId) {
  const clearedStageNumber = state.stageIndex + 1;
  if (clearedStageNumber === 2 && !state.coreEvolutionOffered) {
    state.coreEvolutionOffered = true;
    state.pendingCoreEvolutionReward = true;
  }
  state.stageIndex += 1;
  state.stageThemeId = themeId || state.stageThemeId;
  state.stageJustAdvanced = true;
  state.inning = 1;
  state.outs = 0;
  state.balls = 0;
  state.strikes = 0;
  state.consecutiveBalls = 0;
  state.bases = [false, false, false];
  state.runs = 0;
  if (els.runsText) els.runsText.textContent = "0";
  state.batterIndex = 0;
  state.lineup = generateLineup(state.stageIndex);
  const themeName = MP.getStageTheme?.(state.stageThemeId)?.name || "";
  addLog(
    "스테이지 클리어",
    `${stageInnings[state.stageIndex - 1]}이닝 스테이지를 통과했습니다. ${themeName ? `${themeName} · ` : ""}다음은 ${currentStageInnings()}이닝 승부입니다.`
  );
  state.pendingStageOverlay = {
    stageNumber: currentStageNumber(),
    innings: currentStageInnings(),
    themeId: state.stageThemeId
  };
  if (MP.onStageClearPitchProgression) MP.onStageClearPitchProgression();
  state.pitcher?.repertoire?.forEach((pitch) => {
    if (MP.ensurePitchRuntime) MP.ensurePitchRuntime(pitch);
  });
}

function addOut(count = 1) {
  for (let index = 0; index < count; index += 1) {
    if (state.gameOver) return;
    state.outs += 1;
    if (state.outs >= 3) {
      state.outs = 0;
      state.bases = [false, false, false];
      state.inning += 1;
      if (state.inning > currentStageInnings()) {
        if (state.stageIndex >= stageInnings.length - 1) {
          endGame(true, "7이닝 최종 스테이지까지 버텨냈습니다. 마운드의 심리전에서 이겼습니다.");
        } else {
          state.pendingThemeChoices = MP.rollThemeChoices
            ? MP.rollThemeChoices(state.stageIndex + 1, state.pitcher)
            : [];
          state.awaitingThemeSelection = true;
          state.inning = currentStageInnings();
          addLog("스테이지 클리어", `${currentStageInnings()}이닝을 막았습니다. 다음 상대를 선택하세요.`);
        }
      } else {
        if (MP.recoverPitchBurdenInning) MP.recoverPitchBurdenInning();
        addLog("이닝 종료", `${state.inning - 1}이닝을 막았습니다. 다음 이닝으로 넘어갑니다.`);
        queueTransitionBanner(`INNING CHANGE · ${state.inning} INNING`, "inning", 1600);
      }
      break;
    }
  }
}

function finishAtBat(title, text, options = {}) {
  addLog(title, text);
  state.lastAtBatMemory = atBatMemoryFrom(title, options.result);
  if (options.result && MP.processPitchProgressionAtBatEnd) {
    MP.processPitchProgressionAtBatEnd(options.result, title, state.lastPitchPattern);
  }
  if (options.result?.batter?.isBoss && /OUT!|DOUBLE PLAY!/.test(title) && MP.noteBossUpgradeUnlock) {
    MP.noteBossUpgradeUnlock();
  }
  state.balls = 0;
  state.strikes = 0;
  state.consecutiveBalls = 0;
  state.waitingNextBatter = !state.gameOver;
  els.nextBatterButton.hidden = true;
  if (state.gameOver) return;
  const transition = state.pendingTransitionBanner;
  const stageOverlay = state.pendingStageOverlay;
  state.pendingTransitionBanner = null;
  state.pendingStageOverlay = null;
  if (transition) {
    window.setTimeout(() => {
      if (!state.gameOver) showInningChangeOverlay(transition);
    }, GAME_TIMING.inningTransitionDelay);
  }
  if (options.rewardReason) {
    state.afterRewardStageOverlay = stageOverlay;
    clearRewardTimer();
    MP.rewardTimer = window.setTimeout(() => {
      MP.rewardTimer = null;
      openRewardDraft(options.rewardReason, options.result);
    }, transition ? GAME_TIMING.rewardAfterOutWithTransition : GAME_TIMING.rewardAfterOut);
    return;
  }
  if (state.awaitingThemeSelection) {
    clearRewardTimer();
    MP.rewardTimer = window.setTimeout(() => {
      MP.rewardTimer = null;
      openStageTagReward();
    }, transition ? GAME_TIMING.rewardAfterOutWithTransition : 600);
    return;
  }
  if (stageOverlay) {
    queueStageEntryAndTagReward(stageOverlay, GAME_TIMING.stageEntryDelay);
    return;
  }
  scheduleAutoAdvance(transition ? GAME_TIMING.autoAdvanceAfterTransition : GAME_TIMING.autoAdvanceDefault);
}

function showInningChangeOverlay(transition) {
  const match = String(transition?.text || "").match(/(\d+)\s*INNING/i);
  const subtitle = match ? `${match[1]} INNING` : "NEXT INNING";
  showStageOverlay("INNING CHANGE", subtitle, transition?.duration || GAME_TIMING.inningChangeOverlay);
}

function queueStageEntryAndTagReward(stageOverlay, delay = GAME_TIMING.stageEntryDelay) {
  window.setTimeout(() => {
    if (!state.gameOver) showStageThemeOverlay(stageOverlay?.stageNumber, stageOverlay?.innings, stageOverlay?.themeId);
  }, delay);
  MP.rewardTimer = window.setTimeout(() => {
    MP.rewardTimer = null;
    openStageTagReward();
  }, delay + GAME_TIMING.stageTagRewardDelay);
}

function rewardReasonText(reason) {
  if (reason.includes("병살")) return "병살 보상 · 1개 선택";
  if (reason.includes("보스")) return "보스 보상 · 1개 선택";
  if (reason.includes("스테이지")) {
    const allSupportOwned = supportTags().every((tag) => (state.pitcher?.bonusTags || []).includes(tag.id));
    return allSupportOwned ? "보조태그 강화 · 1개 선택" : "보조태그 보상 · 1개 선택";
  }
  if (reason.includes("핵심태그")) return "핵심태그 보상 · 1개 선택";
  return "삼진 보상 · 1개 선택";
}

function supportTagWeight(tag, selectedIds = []) {
  const coreFamilies = pitcherCoreFamilies(state.pitcher);
  const tagFamily = supportTagFamily(tag.id);
  const meta = supportTagMeta[tag.id] || {};
  const ownedSupport = state.pitcher?.bonusTags || [];
  const revealedWeakness = state.pitcher?.revealedWeaknessTags || [];
  const familyOwnedCount = ownedSupport.filter((id) => supportTagFamily(id) === tagFamily).length;
  const lastPitchId = state.lastAtBatMemory?.pitchId;
  const recentPitch = lastPitchId ? pitchById(lastPitchId) : null;
  const recentFamilyMap = { fast: "삼진계", breaking: "완급계", offspeed: "심리계" };
  const recentFamily = recentPitch ? recentFamilyMap[recentPitch.category] : null;
  let weight = 1;
  let reason = "랜덤 후보";
  const profileSynergy = tag.profiles?.includes(state.pitcher?.profileId) ? 1.15 : 1;
  weight *= profileSynergy;

  if (coreFamilies.includes(tagFamily)) {
    weight *= 1.8;
    reason = "핵심태그 시너지";
  }
  if (meta.countersWeakness?.some((weakId) => revealedWeakness.includes(weakId))) {
    weight *= 1.5;
    reason = "약점 보완";
  }
  if (recentFamily && recentFamily === tagFamily) weight *= 1.4;
  if (familyOwnedCount >= 2) weight *= 1.3;
  if (coreFamilies.some((family) => meta.oppositeFamilies?.includes(family))) weight *= 0.5;
  if (selectedIds.includes(tag.id)) weight = 0;

  return { weight, reason };
}

function weightedPickFromTop(items, topCount = 4) {
  if (!items.length) return null;
  const sorted = [...items].sort((a, b) => b.weight - a.weight);
  return weightedPick(sorted.slice(0, Math.max(1, topCount)));
}

function weightedPick(items) {
  if (!items.length) return null;
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  if (total <= 0) return items[0] || null;
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1] || null;
}

function toSupportReward(tag, reason = "랜덤 후보") {
  return {
    type: "tag",
    tagId: tag.id,
    title: tag.name,
    desc: tag.description,
    categoryLabel: `보조태그 · ${supportTagFamily(tag.id)}`,
    recommendReason: reason
  };
}

function toSupportUpgradeReward(tag, reason = "마스터리 강화") {
  const tier = supportTagTier(state.pitcher, tag.id);
  const nextTier = tier + 1;
  return {
    type: "supportUpgrade",
    tagId: tag.id,
    title: `${tag.name} 강화 +${nextTier - 1}`,
    desc: `${tag.description} (강화 ${nextTier}단계 — 효과 ${nextTier}배)`,
    categoryLabel: `보조태그 강화 · ${supportTagFamily(tag.id)}`,
    recommendReason: reason
  };
}

function generateSupportTagUpgradeChoices() {
  const ownedIds = state.pitcher?.bonusTags || [];
  if (!ownedIds.length) return [];
  const selected = [];
  const selectedIds = [];
  const ownedTags = ownedIds.map(tagById).filter(Boolean);

  for (let index = 0; index < 3; index += 1) {
    const pool = ownedTags
      .filter((tag) => !selectedIds.includes(tag.id))
      .map((tag) => ({ tag, ...supportTagWeight(tag, selectedIds) }))
      .filter((item) => item.weight > 0);
    const pick = weightedPickFromTop(pool, 6) || weightedPick(pool);
    if (!pick) break;
    selected.push(toSupportUpgradeReward(pick.tag, pick.reason || "마스터리 강화"));
    selectedIds.push(pick.tag.id);
  }
  return selected;
}

function rewardAmount(kind) {
  if (kind === "pitch") return rand(3, 5);
  return rand(1, 2);
}

function generateRewardChoices(reason, result) {
  const usedPitch = result?.pitch;
  const rewards = [
    { type: "stat", stat: "제구", amount: rewardAmount("stat"), title: "코너워크 감각", desc: "제구가 소폭 상승합니다." },
    { type: "stat", stat: "구속", amount: rewardAmount("stat"), title: "팔 스피드 상승", desc: "구속이 소폭 상승합니다." },
    { type: "stat", stat: "변화", amount: rewardAmount("stat"), title: "손끝 감각", desc: "변화 수치가 소폭 상승합니다." },
    { type: "stat", stat: "멘탈", amount: rewardAmount("stat"), title: "위기관리 루틴", desc: "멘탈이 소폭 상승합니다." },
    { type: "stat", stat: "예측", amount: rewardAmount("stat"), title: "타자 분석", desc: "노림수 추천 정확도가 소폭 상승합니다." }
  ];

  if (usedPitch) {
    rewards.push({
      type: "pitch",
      pitchId: usedPitch.id,
      field: "control",
      amount: rewardAmount("pitch"),
      title: `${usedPitch.name} 숙련`,
      desc: `${usedPitch.name} 전용 제구가 크게 상승합니다.`
    });
  }

  if (reason.includes("병살")) {
    rewards.push(
      { type: "stat", stat: "변화", amount: rewardAmount("stat"), title: "땅볼 유도 감각", desc: "변화 수치가 소폭 상승합니다." },
      { type: "stat", stat: "멘탈", amount: rewardAmount("stat"), title: "위기 탈출 자신감", desc: "멘탈 수치가 소폭 상승합니다." }
    );
  }

  if (reason.includes("보스")) {
    rewards.push(
      { type: "stat", stat: "제구", amount: rewardAmount("stat"), title: "강타자 상대 데이터", desc: "제구 수치가 소폭 상승합니다." },
      { type: "stat", stat: "예측", amount: rewardAmount("stat"), title: "보스 타자 분석", desc: "예측 수치가 소폭 상승합니다." }
    );
  }

  const themeEntries =
    MP.buildThemeAtBatRewardEntries?.(MP.getStageTheme?.(state.stageThemeId)) || [];
  if (themeEntries.length) rewards.push(...themeEntries);

  const unknownPitch =
    state.pitcher.repertoire.length < 5
      ? sample(
          pitchLibrary.filter((pitch) => !state.pitcher.repertoire.some((owned) => owned.id === pitch.id)),
          1
        )[0]
      : null;
  if (unknownPitch) {
    rewards.push({
      type: "newPitch",
      pitch: clonePitch(unknownPitch),
      title: `${unknownPitch.name} 장착`,
      desc: `새 구종 ${unknownPitch.name}을 레퍼토리에 추가합니다.`
    });
  }

  const upgradeEntries = MP.collectPitchUpgradeCandidates ? MP.collectPitchUpgradeCandidates(reason, result) : [];
  const upgradePicks = MP.pickWeightedPitchUpgrades ? MP.pickWeightedPitchUpgrades(upgradeEntries, 2) : [];
  if (upgradePicks.length) {
    const filler = sample(rewards, Math.max(0, 3 - upgradePicks.length));
    return sample([...upgradePicks, ...filler], 3);
  }

  return sample(rewards, 3);
}

function generateStageTagChoices() {
  const owned = new Set([...(state.pitcher.bonusTags || [])]);
  const candidates = supportTags().filter((tag) => !owned.has(tag.id));
  if (!candidates.length) return generateSupportTagUpgradeChoices();

  const selected = [];
  const selectedIds = [];
  const weaknessSet = new Set(state.pitcher.revealedWeaknessTags || []);
  const coreFamilies = pitcherCoreFamilies(state.pitcher);

  const synergyPool = candidates
    .map((tag) => ({ tag, ...supportTagWeight(tag, selectedIds) }))
    .filter((item) => item.weight > 0);
  const strictCorePool = synergyPool.filter((item) => coreFamilies.includes(supportTagFamily(item.tag.id)));
  const synergyPick = weightedPickFromTop(strictCorePool.length ? strictCorePool : synergyPool, 5);
  if (synergyPick) {
    selected.push(toSupportReward(synergyPick.tag, "핵심태그 시너지"));
    selectedIds.push(synergyPick.tag.id);
  }

  const clearedTheme = MP.getStageTheme ? MP.getStageTheme(state.stageThemeId) : null;
  const themeFamilies = clearedTheme && MP.themeRewardFamilies ? MP.themeRewardFamilies(clearedTheme) : [];
  const themePool = candidates
    .filter((tag) => !selectedIds.includes(tag.id))
    .map((tag) => {
      const base = supportTagWeight(tag, selectedIds);
      const family = supportTagFamily(tag.id);
      if (themeFamilies.includes(family)) base.weight *= 2.4;
      return { tag, ...base };
    })
    .filter((item) => item.weight > 0);
  const themePick = weightedPickFromTop(themePool.filter((item) => themeFamilies.includes(supportTagFamily(item.tag.id))), 5);
  if (themePick) {
    selected.push(toSupportReward(themePick.tag, "스테이지 테마 대응"));
    selectedIds.push(themePick.tag.id);
  }

  const weaknessPool = candidates
    .filter((tag) => !selectedIds.includes(tag.id))
    .map((tag) => ({ tag, ...supportTagWeight(tag, selectedIds) }))
    .filter((item) => (supportTagMeta[item.tag.id]?.countersWeakness || []).some((weak) => weaknessSet.has(weak)));
  const weaknessPick = weightedPickFromTop(weaknessPool, 4);
  if (weaknessPick) {
    selected.push(toSupportReward(weaknessPick.tag, "약점 보완"));
    selectedIds.push(weaknessPick.tag.id);
  }

  const randomPool = candidates
    .filter((tag) => !selectedIds.includes(tag.id))
    .map((tag) => ({ tag, ...supportTagWeight(tag, selectedIds) }))
    .filter((item) => item.weight > 0);
  const oppositePool = randomPool.filter((item) =>
    coreFamilies.some((family) => (supportTagMeta[item.tag.id]?.oppositeFamilies || []).includes(family))
  );
  const randomPick = weightedPickFromTop(oppositePool.length ? oppositePool : randomPool, 6);
  if (randomPick) {
    const reason = oppositePool.length ? "위험 보상" : randomPick.reason;
    selected.push(toSupportReward(randomPick.tag, reason));
    selectedIds.push(randomPick.tag.id);
  }

  while (selected.length < 3) {
    const fallback = candidates.find((tag) => !selectedIds.includes(tag.id));
    if (!fallback) break;
    selected.push(toSupportReward(fallback, "랜덤 후보"));
    selectedIds.push(fallback.id);
  }
  return selected;
}

function coreEvolutionPoolForPitcher(pitcher = state.pitcher) {
  if (!pitcher?.coreTagId) return [];
  return coreEvolutionCatalog.filter((item) => item.coreTagId === pitcher.coreTagId);
}

function evolutionChoiceWeight(card, pitcher = state.pitcher) {
  let weight = 1;
  const bonusFamilies = new Set((pitcher.bonusTags || []).map((id) => supportTagFamily(id)));
  const weaknessIds = new Set(pitcher.revealedWeaknessTags || []);
  if (card.role === "weakness" && weaknessIds.size) weight += 1.2;
  if (card.role === "synergy" && bonusFamilies.size) weight += 0.6;
  if (card.role === "stage" && state.stageIndex >= 1) weight += 0.5;
  if (card.role === "mastery" && MP.getPitchMasterySnapshot) weight += 0.4;
  return weight;
}

function pickEvolutionForRole(pool, role, usedIds) {
  const candidates = pool.filter((card) => card.role === role && !usedIds.has(card.id));
  if (!candidates.length) return null;
  const weighted = candidates.map((card) => ({ card, weight: evolutionChoiceWeight(card) }));
  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of weighted) {
    roll -= item.weight;
    if (roll <= 0) return item.card;
  }
  return weighted[weighted.length - 1].card;
}

function generateCoreEvolutionChoices() {
  ensurePitcherTagFields(state.pitcher);
  if (state.pitcher.coreEvolutionId) return [];
  const pool = coreEvolutionPoolForPitcher(state.pitcher);
  if (!pool.length) return [];
  const patternKey = pick(Object.keys(coreEvolutionPatternSets));
  const roles = coreEvolutionPatternSets[patternKey];
  const usedIds = new Set();
  const selected = [];
  roles.forEach((role) => {
    const card = pickEvolutionForRole(pool, role, usedIds);
    if (card) {
      selected.push(card);
      usedIds.add(card.id);
    }
  });
  while (selected.length < 3) {
    const fallback = pick(pool.filter((card) => !usedIds.has(card.id)));
    if (!fallback) break;
    selected.push(fallback);
    usedIds.add(fallback.id);
  }
  return selected.slice(0, 3).map((card) => ({
    type: "coreEvolution",
    evolutionId: card.id,
    title: card.name,
    subtitle: `${coreTagNameById(card.coreTagId)} 진화`,
    condition: card.condition,
    effectText: card.effectText,
    operation: card.operation,
    icon: card.icon,
    desc: card.operation
  }));
}

function openRewardDraft(reason, result, kind = "normal") {
  if (!els.rewardOverlay || state.gameOver) return;
  clearAutoAdvance();
  state.selectedRewardIndex = null;
  state.rewardKind = kind;
  state.rewardPending = true;
  if (kind === "stageTag") state.rewardChoices = generateStageTagChoices();
  else if (kind === "coreEvolution") state.rewardChoices = generateCoreEvolutionChoices();
  else state.rewardChoices = generateRewardChoices(reason, result);
  if (!state.rewardChoices.length) {
    state.rewardPending = false;
    state.rewardKind = "normal";
    scheduleAutoAdvance(900);
    return;
  }
  els.rewardTitle.textContent = kind === "coreEvolution" ? "핵심진화 보상" : reason;
  els.rewardReason.textContent = kind === "coreEvolution" ? "핵심진화 보상 · 1개 선택" : rewardReasonText(reason);
  renderRewardChoices();
  if (els.rewardConfirmButton) {
    const isCoreEvo = kind === "coreEvolution";
    els.rewardConfirmButton.hidden = !isCoreEvo;
    els.rewardConfirmButton.disabled = true;
  }
  els.rewardOverlay.hidden = false;
  disablePitchButtons(true);
}

function openStageTagReward() {
  if (state.pendingCoreEvolutionReward) {
    const coreChoices = generateCoreEvolutionChoices();
    state.pendingCoreEvolutionReward = false;
    if (coreChoices.length) {
      state.pendingRewardKindAfterCurrent = "stageTag";
      openRewardDraft("핵심진화 보상", null, "coreEvolution");
      return;
    }
    state.pendingRewardKindAfterCurrent = null;
    openRewardDraft("스테이지 클리어 보상", null, "stageTag");
    return;
  }
  openRewardDraft("스테이지 클리어 보상", null, "stageTag");
}

function applyReward(index) {
  const reward = state.rewardChoices[index];
  if (!reward || state.gameOver) return;
  const rewardKind = state.rewardKind;
  const afterStageOverlay = state.afterRewardStageOverlay;

  if (reward.type === "stat") {
    state.pitcher.stats[reward.stat] = clampStat((state.pitcher.stats[reward.stat] || 0) + reward.amount);
  }
  if (reward.type === "pitch") {
    const pitch = state.pitcher.repertoire.find((item) => item.id === reward.pitchId);
    if (pitch) pitch[reward.field] = clampStat((pitch[reward.field] || 0) + reward.amount);
  }
  if (reward.type === "newPitch") {
    if (state.pitcher.repertoire.length < 5) {
      state.pitcher.repertoire.push(clonePitch(reward.pitch));
      state.pitcher.repertoire.sort((a, b) => a.name.localeCompare(b.name, "ko"));
    }
  }
  if (reward.type === "pitchUpgrade") {
    if (MP.applyPitchUpgradeReward) MP.applyPitchUpgradeReward(reward);
  }
  if (reward.type === "tag") {
    ensurePitcherTagFields(state.pitcher);
    const nextTags = [...new Set([...(state.pitcher.bonusTags || []), reward.tagId])];
    state.pitcher.bonusTags = nextTags;
    state.pitcher.bonusTagTiers[reward.tagId] = state.pitcher.bonusTagTiers[reward.tagId] || 1;
  }
  if (reward.type === "supportUpgrade") {
    ensurePitcherTagFields(state.pitcher);
    state.pitcher.bonusTagTiers[reward.tagId] = (state.pitcher.bonusTagTiers[reward.tagId] || 1) + 1;
  }
  if (reward.type === "coreEvolution") {
    ensurePitcherTagFields(state.pitcher);
    state.pitcher.coreEvolutionId = reward.evolutionId;
  }

  state.runStats.rewards += 1;
  addLog("보상 획득", `${reward.title} · ${reward.operation || reward.desc}`);
  showEventBanner(
    reward.type === "tag" ? "TAG GET!" : reward.type === "supportUpgrade" ? "TAG UP!" : reward.type === "coreEvolution" ? "EVOLUTION!" : "REWARD GET!",
    "reward",
    1050
  );
  state.rewardPending = false;
  state.rewardKind = "normal";
  state.selectedRewardIndex = null;
  state.afterRewardStageOverlay = null;
  state.rewardChoices = [];
  els.rewardOverlay.hidden = true;
  if (els.rewardConfirmButton) {
    els.rewardConfirmButton.hidden = true;
    els.rewardConfirmButton.disabled = true;
  }
  render();
  if (rewardKind === "coreEvolution" && state.pendingRewardKindAfterCurrent) {
    const nextKind = state.pendingRewardKindAfterCurrent;
    state.pendingRewardKindAfterCurrent = null;
    window.setTimeout(() => {
      if (!state.gameOver) openRewardDraft(nextKind === "stageTag" ? "스테이지 클리어 보상" : "보상", null, nextKind);
    }, 280);
    return;
  }
  if (afterStageOverlay) {
    queueStageEntryAndTagReward(afterStageOverlay, 450);
    return;
  }
  if (state.awaitingThemeSelection) {
    openThemeSelectOverlay();
    return;
  }
  scheduleAutoAdvance(rewardKind === "stageTag" ? GAME_TIMING.rewardAutoAdvanceStageTag : GAME_TIMING.rewardAutoAdvanceNormal);
}

function rewardChoiceMetaParts(reward) {
  if (reward.themeReward) return [{ kind: "reason", text: "테마 대응" }];
  if (reward.type === "newPitch") return [{ kind: "kind", text: "새 구종" }];
  if (reward.type === "tag") {
    const family = String(reward.categoryLabel || "").replace(/^보조태그\s*·\s*/, "");
    const parts = [{ kind: "kind", text: "보조태그" }];
    if (family) parts.push({ kind: "family", text: family });
    parts.push({ kind: "reason", text: reward.recommendReason || "추천" });
    return parts;
  }
  if (reward.type === "supportUpgrade") {
    return [
      { kind: "kind", text: "보조태그 강화" },
      { kind: "reason", text: reward.recommendReason || "마스터리" }
    ];
  }
  if (reward.type === "coreEvolution") {
    return [{ kind: "kind", text: "핵심진화" }];
  }
  if (reward.type === "pitchUpgrade") {
    return [
      { kind: "kind", text: "구종 강화" },
      { kind: "reason", text: reward.reason || "스테이지 활약" }
    ];
  }
  return [{ kind: "amount", text: `+${reward.amount}` }];
}

function rewardChoiceMetaHtml(reward) {
  const parts = rewardChoiceMetaParts(reward);
  if (!parts.length) return "";
  return `<footer class="reward-card-foot">${parts
    .map((part) => `<span class="reward-chip reward-chip--${part.kind}">${escapeHtml(part.text)}</span>`)
    .join("")}</footer>`;
}

function coreEvolutionIconHtml(icon) {
  const icons = {
    target: "◎",
    scales: "⚖",
    cycle: "↻",
    shield: "⛨",
    bolt: "⚡",
    hook: "🪝"
  };
  return `<span class="core-evo-icon core-evo-icon--${escapeHtml(icon || "target")}" aria-hidden="true">${icons[icon] || "◎"}</span>`;
}

function renderCoreEvolutionRewardCard(reward, index) {
  const selected = state.selectedRewardIndex === index;
  return `
    <button class="reward-choice-card core-evolution-card${selected ? " is-selected" : ""}" type="button" data-reward-index="${index}">
      <span class="core-evo-check" aria-hidden="true">${selected ? "✓" : ""}</span>
      <header class="core-evo-head">
        ${coreEvolutionIconHtml(reward.icon)}
        <div class="core-evo-titles">
          <strong class="core-evo-name">${escapeHtml(reward.title)}</strong>
          <span class="core-evo-sub">${escapeHtml(reward.subtitle || "")}</span>
        </div>
      </header>
      <div class="core-evo-body">
        <div class="core-evo-row"><span class="core-evo-label">조건</span><span class="core-evo-value">${escapeHtml(reward.condition || "-")}</span></div>
        <div class="core-evo-row"><span class="core-evo-label">효과</span><span class="core-evo-value">${escapeHtml(reward.effectText || "-")}</span></div>
        <div class="core-evo-row"><span class="core-evo-label">운영</span><span class="core-evo-value">${escapeHtml(reward.operation || "-")}</span></div>
      </div>
    </button>
  `;
}

function renderRewardChoices() {
  if (!els.rewardChoiceList) return;
  const isCoreEvolution = state.rewardKind === "coreEvolution";
  els.rewardChoiceList.classList.toggle("core-evolution-list", isCoreEvolution);
  els.rewardChoiceList.innerHTML = state.rewardChoices
    .map((reward, index) =>
      isCoreEvolution
        ? renderCoreEvolutionRewardCard(reward, index)
        : `
        <button class="reward-choice-card" type="button" data-reward-index="${index}">
          <strong>${escapeHtml(reward.title)}</strong>
          <span>${escapeHtml(reward.desc)}</span>
          ${rewardChoiceMetaHtml(reward)}
        </button>
      `
    )
    .join("");
  if (els.rewardConfirmButton) {
    els.rewardConfirmButton.hidden = !isCoreEvolution;
    els.rewardConfirmButton.disabled = state.selectedRewardIndex == null;
  }
}

function selectRewardChoice(index) {
  if (state.rewardKind === "coreEvolution") {
    state.selectedRewardIndex = index;
    renderRewardChoices();
    return;
  }
  applyReward(index);
}

function confirmRewardChoice() {
  if (state.selectedRewardIndex == null) return;
  applyReward(state.selectedRewardIndex);
}

function nextBatter() {
  if (state.gameOver || state.rewardPending) return;
  clearAutoAdvance();
  if (state.waitingNextBatter) state.batterIndex += 1;
  startAtBat();
  render();
  showBatterEntryBanner();
}

function clearAutoAdvance() {
  if (MP.autoAdvanceTimer) {
    window.clearTimeout(MP.autoAdvanceTimer);
    MP.autoAdvanceTimer = null;
  }
}

function clearRewardTimer() {
  if (MP.rewardTimer) {
    window.clearTimeout(MP.rewardTimer);
    MP.rewardTimer = null;
  }
}

function clearGameOverTimer() {
  if (MP.gameOverTimer) {
    window.clearTimeout(MP.gameOverTimer);
    MP.gameOverTimer = null;
  }
}

function clearCourseFlash() {
  if (MP.courseFlashTimer) {
    window.clearTimeout(MP.courseFlashTimer);
    MP.courseFlashTimer = null;
  }
  state.flashZone = null;
}

function flashCourse(zone) {
  clearCourseFlash();
  state.flashZone = Number(zone) || null;
  MP.courseFlashTimer = window.setTimeout(() => {
    state.flashZone = null;
    MP.courseFlashTimer = null;
    renderCourseControls();
  }, GAME_TIMING.courseFlash);
}

function scheduleAutoAdvance(delay = GAME_TIMING.autoAdvanceDefault) {
  clearAutoAdvance();
  if (state.gameOver || state.pendingGameOver) return;
  MP.autoAdvanceTimer = window.setTimeout(() => {
    MP.autoAdvanceTimer = null;
    if (state.gameOver || state.pendingGameOver) return;
    if (state.stageJustAdvanced) {
      state.stageJustAdvanced = false;
    } else {
      state.batterIndex += 1;
    }
    startAtBat();
    render();
    showBatterEntryBanner();
  }, delay);
}

function queueGameOverAfterResult(result, message) {
  if (state.gameOver || state.pendingGameOver) return;
  state.pendingGameOver = true;
  clearAutoAdvance();
  clearRewardTimer();
  disablePitchButtons(true);
  const delayedResults = ["single", "double", "homerun"];
  const delay = delayedResults.includes(result.result) ? GAME_TIMING.gameOverHit : GAME_TIMING.gameOverDefault;
  MP.gameOverTimer = window.setTimeout(() => {
    MP.gameOverTimer = null;
    endGame(false, message);
  }, delay);
}

function gameSummaryHtml(message) {
  const stats = state.runStats;
  return `
    <span class="result-copy">${message} 최종 실점: ${state.runs}</span>
    <span class="result-summary">
      <span><b>${pitchedInningsText()}</b>투구 이닝</span>
      <span><b>${stats.strikeouts}</b>삼진</span>
      <span><b>${stats.doublePlays}</b>병살</span>
      <span><b>${stats.hits}</b>피안타</span>
      <span><b>${stats.walks}</b>볼넷</span>
      <span><b>${stats.rewards}</b>보상</span>
      <span><b>${stats.bossOuts}</b>보스 제압</span>
    </span>
  `;
}

function pitchedInningsText() {
  const completedBeforeStage = stageInnings
    .slice(0, state.stageIndex)
    .reduce((sum, innings) => sum + innings, 0);
  const stageCompleted = clamp(state.inning - 1, 0, currentStageInnings());
  const currentOuts = state.inning > currentStageInnings() ? 0 : clamp(state.outs, 0, 2);
  return `${completedBeforeStage + stageCompleted}.${currentOuts}`;
}

function endGame(won, message) {
  clearAutoAdvance();
  clearRewardTimer();
  clearGameOverTimer();
  state.gameOver = true;
  state.pendingGameOver = false;
  state.waitingNextBatter = false;
  state.rewardPending = false;
  state.rewardKind = "normal";
  state.afterRewardStageOverlay = null;
  if (els.rewardOverlay) els.rewardOverlay.hidden = true;
  els.nextBatterButton.hidden = true;
  els.resultTitle.textContent = won ? "클리어" : "경기 종료";
  els.resultMessage.innerHTML = gameSummaryHtml(message);
  els.resultOverlay.hidden = false;
  disablePitchButtons(true);
}

function addLog(title, text) {
  const item = document.createElement("div");
  item.className = "log-item";
  item.innerHTML = `<strong class="log-title">${escapeHtml(title)}</strong><div class="log-body">${text}</div>`;
  els.logList.prepend(item);
  while (els.logList.children.length > 18) {
    els.logList.lastElementChild.remove();
  }
}

function renderCountIndicator(element, value, total, label) {
  const count = clamp(value, 0, total);
  if (element.setAttribute) element.setAttribute("aria-label", `${label} ${count}`);
  element.innerHTML = Array.from({ length: total }, (_, index) =>
    `<i class="count-dot${index < count ? " active" : ""}"></i>`
  ).join("");
}

function setPortrait(element, src) {
  if (!element) return;
  if (!src) {
    element.hidden = true;
    element.removeAttribute("src");
    return;
  }
  if (element.getAttribute("src") !== src) {
    element.src = src;
  }
  element.hidden = false;
}

function batterInfoLines(batter) {
  return [String(batter.type || "-").replace("보스 타자 · ", ""), ...(batter.tags || [])].filter(Boolean);
}

function tagDetailText(tag, batter) {
  const catalogTag = batterTagCatalog.find((item) => item.name === tag);
  if (catalogTag) return catalogTag.description;

  const details = {
    출루형: "컨택과 선구안으로 살아나가려는 타자입니다. 볼 유도 성공률이 낮아질 수 있습니다.",
    중심형: "장타 기대치가 높은 타순입니다. 중앙 실투와 반복 패턴이 특히 위험합니다.",
    장타형: "정타가 아니어도 큰 타구가 나올 수 있습니다. 낮은 코스와 변화가 중요합니다.",
    하위형: "기본 능력은 낮지만 반복 패턴을 허용하면 충분히 대응합니다.",
    보스형: "보스 타자입니다. 스탯뿐 아니라 고유 기믹이 함께 적용됩니다.",
    주루형: "땅볼이나 약한 타구에도 출루 가능성이 높습니다.",
    파울형: "불리한 카운트에서 파울로 버티며 승부를 길게 끕니다.",
    선구형: "존 밖 공에 덜 속습니다. 낚시 볼보다 코너 스트라이크가 필요할 수 있습니다.",
    직구형: "빠른 공 계열에 강합니다. 변화구나 느린공으로 타이밍을 흔들어보세요.",
    변화형: "변화구 계열을 의식합니다. 빠른 공으로 카운트를 잡는 선택이 유효합니다.",
    느린형: "느린 공·심변 계열을 기다릴 수 있습니다. 강속구로 압박할 수 있습니다.",
    포커형: "반응 신뢰도가 낮습니다. 일부러 속이는 스윙·지켜보기에 주의하세요.",
    정직스윙: "반응 신뢰도가 높습니다. 스윙·파울 반응을 비교적 믿어도 됩니다.",
    패턴형: "방금 본 공을 빠르게 기억합니다. 같은 패턴 반복 시 대응력이 올라갑니다.",
    한방형: "타이밍이 맞으면 크게 칩니다. 볼넷보다 실투 억제가 중요합니다.",
    "초구 적극": "첫 공부터 적극적으로 칩니다. 0-0 중앙 승부는 위험합니다.",
    "초구 관찰": "첫 공은 지켜봅니다. 존 밖 유인에 잘 속지 않습니다.",
    인내형: "2스트 이후 파울로 버티는 타자입니다. 결정구 반복을 조심하세요.",
    안구형: "볼을 잘 골라냅니다. 무리한 유인구는 카운트를 불리하게 만듭니다.",
    응징형: "몰린 공·실투를 강하게 칩니다. 제구가 흔들리면 장타 위험이 큽니다.",
    즉응형: "직전 투구를 빠르게 읽습니다. 패턴을 섞어야 합니다.",
    정직형: "반응 신뢰도가 높은 타입입니다.",
    교활형: "반응 신뢰도가 낮을 수 있습니다.",
    적응형: "패턴을 빠르게 읽는 타입입니다.",
    도박형: "한 방을 노리는 타입입니다.",
    커트장인: "불리한 카운트에서 파울 확률이 높습니다.",
    천재타자: "패턴 기억력과 역노림이 강합니다.",
    눈야구: "볼 유도에 강합니다.",
    클러치: "주자가 있으면 더 위험해집니다.",
    홈런왕: "실투 시 홈런 위험이 큽니다."
  };
  return details[tag] || `${batter.name}의 현재 성향 태그입니다. 승부 중 노림수와 반응 확률에 영향을 줍니다.`;
}

function showTagDetail(tag) {
  if (!els.tagDetail) return;
  if (!els.tagDetail.hidden && els.tagDetail.dataset.tag === tag) {
    resetTagDetail();
    return;
  }
  const batter = currentBatter();
  els.tagDetail.innerHTML = `<strong>${escapeHtml(tag)}</strong><span>${escapeHtml(tagDetailText(tag, batter))}</span>`;
  els.tagDetail.dataset.tag = tag;
  els.tagDetail.hidden = false;
  els.batterCard?.classList.add("tag-open");
}

function renderPitcherName() {
  if (!els.pitcherName) return;
  els.pitcherName.textContent = state.pitcher?.name || "-";
}

function pitcherNameParts(pitcher) {
  if (pitcher?.style) return { name: pitcher.name || "-", style: pitcher.style };
  const parts = String(pitcher?.name || "").trim().split(/\s+/);
  if (parts.length >= 3) {
    return {
      name: parts.slice(0, -2).join(" "),
      style: parts.slice(-2).join(" ")
    };
  }
  return { name: pitcher?.name || "-", style: "균형형 투수" };
}

function renderPitcherChoices() {
  if (!els.pitcherSelectOverlay || !els.pitcherChoiceList) return;
  els.pitcherChoiceList.innerHTML = state.pitcherChoices
    .map((pitcher, index) => {
      const display = pitcherNameParts(pitcher);
      return `
        <button class="pitcher-choice-card" type="button" data-pitcher-index="${index}">
          <img class="choice-portrait" src="${pitcher.portrait}" alt="" aria-hidden="true" />
          <span class="choice-number">${index + 1}</span>
          <strong>${display.name}</strong>
          <em>${display.style}</em>
        </button>
      `;
    })
    .join("");
  els.pitcherSelectOverlay.hidden = false;
}

function pitchInputLocked() {
  return (
    state.screenPhase !== SCREEN_PHASE.pitching ||
    state.gameOver ||
    state.waitingNextBatter ||
    state.rewardPending ||
    state.awaitingThemeSelection ||
    state.pendingGameOver
  );
}

function syncScreenPhase() {
  if (state.gameOver || state.pendingGameOver) {
    state.screenPhase = SCREEN_PHASE.gameOver;
    return;
  }
  if (state.rewardPending) {
    state.screenPhase = SCREEN_PHASE.reward;
    return;
  }
  if (els.themeSelectOverlay && !els.themeSelectOverlay.hidden) {
    state.screenPhase = SCREEN_PHASE.themeSelect;
    return;
  }
  if (els.pitcherSelectOverlay && !els.pitcherSelectOverlay.hidden) {
    state.screenPhase = SCREEN_PHASE.pitcherSelect;
    return;
  }
  if (state.waitingNextBatter) {
    state.screenPhase = SCREEN_PHASE.transition;
    return;
  }
  state.screenPhase = SCREEN_PHASE.pitching;
}

function render() {
  const useCardUiV2 = state.useCardUiV2 !== false;
  state.batterCardExpanded = false;
  const batter = currentBatter();
  const stageTarget = currentStageInnings();
  els.inningText.textContent = `${Math.min(state.inning, stageTarget)} / ${stageTarget}`;
  els.runsText.textContent = state.runs;
  if (els.targetText) els.targetText.textContent = `${currentStageRunLimit()}실점 시 종료`;
  renderCountIndicator(els.ballsText, state.balls, 3, "Balls");
  renderCountIndicator(els.strikesText, state.strikes, 2, "Strikes");
  renderCountIndicator(els.outsText, state.outs, 2, "Outs");
  els.pitchCountText.textContent = `${state.pitchCount}구`;

  els.base1.classList.toggle("occupied", state.bases[0]);
  els.base2.classList.toggle("occupied", state.bases[1]);
  els.base3.classList.toggle("occupied", state.bases[2]);

  parkPitcherTagDetail();
  renderPitcherName();
  setPortrait(els.pitcherPortrait, state.pitcher.portrait);
  els.pitcherCard?.classList.toggle("card-v2", useCardUiV2);
  renderPitcherTags();
  const pitcherLayout = assertPitcherCardLayout();
  if (pitcherLayout && !pitcherLayout.ok && !pitcherLayout.skipped) {
    console.warn("[pitcher-card layout]", pitcherLayout);
  }
  renderMiniStats(els.pitcherStats, state.pitcher.stats, true);
  renderPitchButtons();
  renderCourseControls();

  els.batterName.textContent = batter.name;
  setPortrait(els.batterPortrait, batter.portrait);
  els.batterCard?.classList.toggle("card-v2", useCardUiV2);
  renderSlotBadge(batter);
  if (useCardUiV2) renderBatterTypeV2(batter);
  else {
    const batterTags = batterInfoLines(batter);
    const visibleBatterTags = batterTags.slice(0, 6);
    els.batterType.innerHTML = visibleBatterTags
      .map((line, index) => {
        const breakAfter = index === 3 && visibleBatterTags.length > 4 ? '<span class="tag-break" aria-hidden="true"></span>' : "";
        return `<button class="${index === 0 ? "type-main" : "type-tag"}" type="button" data-batter-tag="${escapeHtml(
          line
        )}">${escapeHtml(line)}</button>${breakAfter}`;
      })
      .join("");
  }
  resetTagDetail();
  els.batterCard?.classList.toggle("boss-batter", Boolean(batter.isBoss));
  els.batterCardLower?.classList.toggle("is-expanded", state.batterCardExpanded);
  updateCardToggle(els.batterCardToggle, state.batterCardExpanded, "타자");
  if (els.batterCardToggle) {
    els.batterCardToggle.hidden = true;
    els.batterCardToggle.style.setProperty("display", "none", "important");
  }
  renderStatBars(els.batterStats, batter.stats, true);
  renderDetailedStatBars(els.batterDetailStats, batter.stats, state.batterCardExpanded);
  renderSuspicionMeter();
  renderReadBars();
  renderRecommendation();
  syncScreenPhase();
  disablePitchButtons(pitchInputLocked());
}

function updateCardToggle(button, expanded, label) {
  if (!button) return;
  button.setAttribute("aria-expanded", String(expanded));
  button.setAttribute("aria-label", `${label} 카드 ${expanded ? "접기" : "펼치기"}`);
  button.classList.toggle("is-expanded", expanded);
  button.innerHTML = `<span class="card-toggle-text">${expanded ? "접기" : "상세"}</span>`;
  const fixedStyles = {
    width: "64px",
    minWidth: "64px",
    maxWidth: "64px",
    height: "28px",
    minHeight: "28px",
    maxHeight: "28px",
    padding: "0",
    fontFamily: "Arial, Malgun Gothic, sans-serif",
    fontSize: "12px",
    lineHeight: "28px",
    fontWeight: "900",
    letterSpacing: "0",
    textAlign: "center"
  };
  Object.entries(fixedStyles).forEach(([property, value]) => {
    button.style.setProperty(property, value, "important");
  });
}

function resetTagDetail() {
  if (!els.tagDetail) return;
  els.tagDetail.hidden = true;
  els.tagDetail.innerHTML = "";
  delete els.tagDetail.dataset.tag;
  els.batterCard?.classList.remove("tag-open");
}

function renderSlotBadge(batter) {
  if (!els.battingSlot) return;
  els.battingSlot.innerHTML = batter.isBoss
    ? `<span>${batter.slot}번</span><small>BOSS</small>`
    : `<span>${batter.slot}번</span>`;
}

function statIconSvg(label) {
  const icons = {
    구속: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 15a7 7 0 0 1 14 0"/><path d="M12 15l4-6"/><path d="M8 19h8"/></svg>',
    제구: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>',
    변화: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18c8 0 5-12 14-12"/><path d="M15 5h4v4"/></svg>',
    멘탈: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 20v-3H6v-5a6 6 0 0 1 12 0v8"/><path d="M10 10h4M10 14h5"/></svg>',
    예측: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="3"/></svg>',
    컨택: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="17" r="3"/><path d="M12 13l7-7M15 4l5 5"/></svg>',
    파워: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 10-13h-7l1-7z"/></svg>',
    선구: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z"/><path d="M12 9v6M9 12h6"/></svg>',
    주력: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17h10l3 3H8c-3 0-5-1-5-3"/><path d="M10 17l4-10h4M14 7l-3-3"/></svg>'
  };
  return icons[label] || '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/></svg>';
}

function statDisplayEntries(stats, order) {
  if (order) {
    return order.map((label) => [label, clampStat(stats[label] ?? 50)]);
  }
  return Object.entries(stats);
}

function statRowHtml(label, value, compact, rowClass) {
  if (compact) {
    return `
        <button class="stat-chip" type="button" data-stat="${label}" aria-label="${label} ${value}">
          <i class="stat-icon" aria-hidden="true">${statIconSvg(label)}</i>
          <strong>${value}</strong>
          <span>${label}</span>
        </button>
      `;
  }
  return `
        <div class="${rowClass}" data-stat="${label}">
          <i class="stat-icon" aria-hidden="true">${statIconSvg(label)}</i>
          <span>${label}</span>
          <div class="bar-track"><div class="bar-fill" style="width: ${value}%"></div></div>
          <strong>${value}</strong>
        </div>
      `;
}

function renderStatDisplay(container, stats, { compact = false, order = null, rowClass = "stat-line", expanded = null } = {}) {
  if (!container) return;
  if (expanded === false) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }
  if (expanded === true) {
    container.hidden = false;
    container.classList.add("detailed-stats");
    container.classList.remove("compact-stats");
  } else {
    container.classList.toggle("compact-stats", compact);
    container.classList.toggle("detailed-stats", !compact);
  }
  const entries = statDisplayEntries(stats, order);
  const useCompact = expanded === true ? false : compact;
  const useRowClass = order && !useCompact ? "mini-stat" : rowClass;
  container.innerHTML = entries
    .map(([label, value]) => statRowHtml(label, value, useCompact, useRowClass))
    .join("");
}

function renderMiniStats(container, stats, compact = false) {
  renderStatDisplay(container, stats, { compact, order: pitcherStatOrder });
}

function renderStatBars(container, stats, compact = false) {
  renderStatDisplay(container, stats, { compact });
}

function evolutionDescription(evolution) {
  if (!evolution) return "";
  return `조건: ${evolution.condition}. 효과: ${evolution.effectText}. 운영: ${evolution.operation}`;
}

function renderPitcherTags() {
  if (!els.pitcherTags || !state.pitcher) return;
  ensurePitcherTagFields(state.pitcher);
  const useCardUiV2 = state.useCardUiV2 !== false;
  const coreTag = state.pitcher.coreTagId ? tagById(state.pitcher.coreTagId) : null;
  const evolution = state.pitcher.coreEvolutionId ? coreEvolutionById(state.pitcher.coreEvolutionId) : null;
  const chipList = (tags, cssType, labelForTag = (tag) => tag.name) =>
    tags
      .map(
        (tag) =>
          `<button class="pitcher-tag ${cssType}" type="button" data-pitcher-tag="${escapeHtml(tag.id)}" title="${escapeHtml(
            tagDescriptionForPitcher(tag)
          )}">${escapeHtml(labelForTag(tag))}</button>`
      )
      .join("");

  if (!useCardUiV2) {
    const tagIds = pitcherAllTagIds();
    const tags = tagIds.map(tagById).filter(Boolean);
    const legacyExtra = evolution
      ? `<button class="pitcher-tag evolution" type="button" data-pitcher-evolution="${escapeHtml(evolution.id)}" title="${escapeHtml(evolutionDescription(evolution))}">${escapeHtml(evolution.name)}</button>`
      : "";
    els.pitcherTags.innerHTML =
      tags
        .map((tag) => {
          const label = tag.type === "bonus" ? supportTagDisplayName(tag.id) : tag.name;
          return `<button class="pitcher-tag ${tag.type || "base"}" type="button" data-pitcher-tag="${escapeHtml(tag.id)}">${escapeHtml(label)}</button>`;
        })
        .join("") + legacyExtra;
    return;
  }

  const support = (state.pitcher.bonusTags || []).map((tagId) => tagById(tagId)).filter(Boolean);
  const weakness = (state.pitcher.revealedWeaknessTags || []).map(tagById).filter(Boolean);

  const emptyChip = (text, kind) =>
    `<span class="pitcher-tag state-tag state-tag--${kind}" aria-label="${escapeHtml(text)}">${escapeHtml(text)}</span>`;

  const coreChips = coreTag
    ? `<button class="pitcher-tag base" type="button" data-pitcher-tag="${escapeHtml(coreTag.id)}" title="${escapeHtml(tagDescriptionForPitcher(coreTag))}">${escapeHtml(coreTag.name)}</button>`
    : emptyChip("아직 없음", "core");
  const evolutionChip = evolution
    ? `<button class="pitcher-tag evolution" type="button" data-pitcher-evolution="${escapeHtml(evolution.id)}" title="${escapeHtml(evolutionDescription(evolution))}">${escapeHtml(evolution.name)}</button>`
    : "";

  parkPitcherTagDetail();
  els.pitcherTags.hidden = false;
  els.pitcherTags.innerHTML = `
    <section class="card-v2-section" data-tag-section="core">
      <header class="card-v2-head">
        <strong class="card-v2-kicker">핵심태그</strong>
      </header>
      <div class="card-v2-row card-v2-row--core">${coreChips}${evolutionChip ? `<span class="card-v2-evolution-wrap">${evolutionChip}</span>` : ""}</div>
      <div class="pitcher-tag-detail-slot"></div>
    </section>
    <section class="card-v2-section" data-tag-section="support">
      <header class="card-v2-head">
        <strong class="card-v2-kicker">보조태그</strong>
      </header>
      <div class="card-v2-row">${support.length ? chipList(support, "bonus", (tag) => supportTagDisplayName(tag.id)) : emptyChip("아직 없음", "support")}</div>
      <div class="pitcher-tag-detail-slot"></div>
    </section>
    <section class="card-v2-section" data-tag-section="weakness">
      <header class="card-v2-head">
        <strong class="card-v2-kicker">약점태그</strong>
      </header>
      <div class="card-v2-row">${weakness.length ? chipList(weakness, "weakness") : emptyChip("미공개", "weakness")}</div>
      <div class="pitcher-tag-detail-slot"></div>
    </section>
  `;
  repositionOpenPitcherTagDetail();
}

function renderBatterTypeV2(batter) {
  if (!els.batterType) return;
  const tags = batterInfoLines(batter);
  const visible = tags.slice(0, 4);
  const tagButtons = visible
    .map((line, index) => {
      const cls = index === 0 ? "type-main" : "type-tag";
      return `<button class="${cls}" type="button" data-batter-tag="${escapeHtml(line)}">${escapeHtml(line)}</button>`;
    })
    .join("");
  els.batterType.innerHTML = `
    <span class="card-v2-inline-kicker">타자 성향</span>
    <span class="card-v2-inline-row">${tagButtons}</span>
  `;
}

function pitcherTagsParkEl() {
  return els.pitcherTagsPark || els.pitcherTagsStack?.querySelector(".pitcher-tags-park") || null;
}

function parkPitcherTagDetail() {
  const park = pitcherTagsParkEl();
  if (!els.pitcherTagDetail || !park) return;
  park.appendChild(els.pitcherTagDetail);
}

function assertPitcherCardLayout() {
  if (!els.pitcherCard || !state.pitcher) return { ok: true, skipped: true, reason: "no-pitcher" };
  if (state.useCardUiV2 === false) return { ok: true, skipped: true, reason: "legacy-ui" };

  const stack = els.pitcherTagsStack || els.pitcherTags?.closest(".pitcher-tags-stack");
  const stats = els.pitcherCardLower;
  if (!stack || !stats) return { ok: false, reason: "missing-stack-or-stats" };

  if (els.pitcherTagDetail && els.pitcherTagDetail.parentElement === els.pitcherCard) {
    return { ok: false, reason: "tag-detail is direct child of pitcher-card" };
  }

  // 핵심태그 섹션에 칩이 있어야 함
  if (pitcherBaseCoreTagIds(state.pitcher).length && els.pitcherTags) {
    const coreRow = els.pitcherTags.querySelector('[data-tag-section="core"] .card-v2-row');
    if (!coreRow?.querySelector("[data-pitcher-tag]")) {
      return { ok: false, reason: "missing core tag chips in core section" };
    }
  }

  const stackRect = stack.getBoundingClientRect();
  const statsRect = stats.getBoundingClientRect();
  const gapPx = Math.round((statsRect.top - stackRect.bottom) * 10) / 10;
  if (gapPx < -1) {
    return { ok: false, reason: "tags-stack overlaps stats", gapPx, stackBottom: stackRect.bottom, statsTop: statsRect.top };
  }

  const weaknessRow = els.pitcherTags?.querySelector('[data-tag-section="weakness"] .card-v2-row');
  if (weaknessRow) {
    const weaknessRect = weaknessRow.getBoundingClientRect();
    if (weaknessRect.bottom > statsRect.top + 1) {
      return {
        ok: false,
        reason: "weakness-row overlaps stats",
        gapPx,
        weaknessBottom: weaknessRect.bottom,
        statsTop: statsRect.top
      };
    }
  }

  return { ok: true, gapPx };
}

function pitcherTagDetailSlotForTag(tagId) {
  if (!tagId || !state.pitcher) return null;
  const sectionKey = tagSectionForTagId(tagId);
  return els.pitcherTags?.querySelector(`[data-tag-section="${sectionKey}"] .pitcher-tag-detail-slot`) || null;
}

function mountPitcherTagDetail(slot, afterButton = null) {
  if (!els.pitcherTagDetail || !slot) return;
  if (afterButton && slot === els.pitcherName) {
    afterButton.insertAdjacentElement("afterend", els.pitcherTagDetail);
    return;
  }
  slot.appendChild(els.pitcherTagDetail);
}

function repositionOpenPitcherTagDetail() {
  if (!els.pitcherTagDetail || els.pitcherTagDetail.hidden || !els.pitcherTagDetail.dataset.tag) return;
  const slot = pitcherTagDetailSlotForTag(els.pitcherTagDetail.dataset.tag);
  if (slot) mountPitcherTagDetail(slot);
}

function resetPitcherTagDetail() {
  if (!els.pitcherTagDetail) return;
  els.pitcherTagDetail.hidden = true;
  els.pitcherTagDetail.innerHTML = "";
  delete els.pitcherTagDetail.dataset.tag;
  parkPitcherTagDetail();
  els.pitcherCard?.classList.remove("pitcher-tag-open");
}

function showPitcherTagDetail(tagId, anchorButton = null) {
  if (!els.pitcherTagDetail) return;
  if (!els.pitcherTagDetail.hidden && els.pitcherTagDetail.dataset.tag === tagId) {
    resetPitcherTagDetail();
    return;
  }
  const tag = tagById(tagId);
  if (!tag) return;

  const slot =
    anchorButton?.closest?.(".card-v2-section")?.querySelector(".pitcher-tag-detail-slot") ||
    pitcherTagDetailSlotForTag(tagId);

  if (slot) mountPitcherTagDetail(slot);
  else parkPitcherTagDetail();

  els.pitcherTagDetail.innerHTML = `<strong>${escapeHtml(tag.name)}</strong><span>${escapeHtml(tagDescriptionForPitcher(tag))}</span>`;
  els.pitcherTagDetail.dataset.tag = tagId;
  els.pitcherTagDetail.hidden = false;
  els.pitcherCard?.classList.add("pitcher-tag-open");
}

function showPitcherEvolutionDetail(evolutionId, anchorButton = null) {
  if (!els.pitcherTagDetail) return;
  const detailKey = `evo:${evolutionId}`;
  if (!els.pitcherTagDetail.hidden && els.pitcherTagDetail.dataset.tag === detailKey) {
    resetPitcherTagDetail();
    return;
  }
  const evolution = coreEvolutionById(evolutionId);
  if (!evolution) return;
  const slot =
    anchorButton?.closest?.(".card-v2-section")?.querySelector(".pitcher-tag-detail-slot") ||
    document.querySelector('[data-tag-section="core"] .pitcher-tag-detail-slot');
  if (slot) mountPitcherTagDetail(slot);
  else parkPitcherTagDetail();
  els.pitcherTagDetail.innerHTML = `<strong>${escapeHtml(evolution.name)}</strong><span>${escapeHtml(evolutionDescription(evolution))}</span>`;
  els.pitcherTagDetail.dataset.tag = detailKey;
  els.pitcherTagDetail.hidden = false;
  els.pitcherCard?.classList.add("pitcher-tag-open");
}

function renderDetailedStatBars(container, stats, expanded = false) {
  renderStatDisplay(container, stats, { expanded });
}

function renderReadBars() {
  const scores = state.atBat.readScores;
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const entries = Object.entries(scores)
    .map(([key, value]) => [key, Math.round((value / total) * 100)])
    .sort((a, b) => b[1] - a[1]);

  els.readGuess.textContent = entries[0][1] < 42 ? "불명" : categoryNames[entries[0][0]];
  els.readBars.innerHTML = entries
    .map(
      ([key, percent]) => `
        <div class="read-line">
          <span>${categoryNames[key]}</span>
          <div class="bar-track"><div class="bar-fill" style="width: ${percent}%"></div></div>
          <strong>${percent}</strong>
        </div>
      `
    )
    .join("");
}

function currentCountPsychCard() {
  if (state.balls === 0 && state.strikes === 2) {
    return { title: "0-2 선택", text: "유인구로 반응을 보거나, 정면승부로 루킹 삼진을 노릴 수 있습니다." };
  }
  if (state.balls === 3 && state.strikes === 1) {
    return { title: "3-1 선택", text: "넣으러 가면 장타 위험, 과감한 유인구는 볼넷 위험이 큽니다." };
  }
  if (state.balls === 3 && state.strikes === 2) {
    return { title: "풀카운트", text: "배짱승부와 코너워크 중 하나를 확실히 선택해야 합니다." };
  }
  if (state.balls > state.strikes) {
    return { title: "불리한 카운트", text: "스트라이크 의도는 안정적이지만 중앙 실투는 위험합니다." };
  }
  if (state.strikes > state.balls) {
    return { title: "투수 유리", text: "의도적 볼로 단서를 얻거나 결정구를 아껴도 됩니다." };
  }
  return { title: "균형 카운트", text: "구종과 코스를 섞어 의심 게이지를 낮게 유지하세요." };
}

function currentCatcherSign() {
  const catcher = state.catcher || catcherTypes[0];
  const recommendation = state.atBat?.recommendation;
  const target = recommendation?.guessedTarget || state.atBat?.target || "fast";
  const counter = counterCategoryForTarget(target);
  const pitchName = representativePitchName(counter);
  const suspicion = state.atBat?.suspicion || 0;

  if (catcher.id === "safe") {
    return {
      title: `${catcher.label} · ${catcher.tone}`,
      text: suspicion >= 65 ? "패턴이 읽혔습니다. 낮은 코스보다 반대 코스로 섞는 사인을 냅니다." : `${pitchName}를 존 끝에 붙여 큰 타구를 줄이자는 사인입니다.`
    };
  }
  if (catcher.id === "attack") {
    return {
      title: `${catcher.label} · ${catcher.tone}`,
      text: state.strikes >= 2 ? `${pitchName} 결정구로 헛스윙을 노리자는 사인입니다.` : "초반부터 스트라이크를 먹고 들어가자는 공격적인 사인입니다."
    };
  }
  if (catcher.id === "analysis") {
    return {
      title: `${catcher.label} · ${catcher.tone}`,
      text: `${categoryNames[target]} 노림 가능성을 보고 ${pitchName} 카운터를 추천합니다.`
    };
  }
  return {
    title: `${catcher.label} · ${catcher.tone}`,
    text: state.bases.some(Boolean) ? "주자가 있어도 승부구를 요구합니다. 믿을지 말지는 플레이어 판단입니다." : `${pitchName}로 과감하게 존을 찌르자는 사인입니다.`
  };
}

function renderSuspicionMeter() {
  if (!els.suspicionText || !els.suspicionFill) return;
  const suspicion = Math.round(state.atBat?.suspicion || 0);
  els.suspicionText.textContent = `${suspicion}%`;
  els.suspicionFill.style.width = `${suspicion}%`;
  els.suspicionFill.classList.toggle("danger", suspicion >= 70);
  if (els.suspicionHint) {
    if (suspicion >= 80) els.suspicionHint.textContent = "역노림 위험. 같은 계열과 같은 코스를 피하세요.";
    else if (suspicion >= 58) els.suspicionHint.textContent = "타자가 패턴을 의식합니다. 의도적 볼이나 반대 코스가 필요합니다.";
    else els.suspicionHint.textContent = "구종, 코스, 볼/스트라이크 의도를 섞으면 낮아집니다.";
  }
}

function renderRecommendation() {
  if (!els.recommendTitle || !state.atBat?.recommendation) return;
  const recommendation = state.atBat.recommendation;
  els.recommendConfidence.textContent =
    recommendation.confidence >= 76 ? "높음" : recommendation.confidence >= 58 ? "보통" : "불명";
  els.recommendTitle.textContent = recommendation.title;
  els.recommendText.textContent = recommendation.text;
  const catcherSign = currentCatcherSign();
  if (els.catcherTitle) els.catcherTitle.textContent = catcherSign.title;
  if (els.catcherText) els.catcherText.textContent = catcherSign.text;
  const countCard = currentCountPsychCard();
  if (els.countCardTitle) els.countCardTitle.textContent = countCard.title;
  if (els.countCardText) els.countCardText.textContent = countCard.text;
}

function pitchIconUrl(pitch) {
  return `assets/images/pitches/${pitch.id}.png`;
}

function burdenChipIcon(tierId) {
  return tierId === "stable" ? "✓" : "⚠";
}

function burdenUiHint(tierId) {
  const hints = {
    stable: "부담 낮음 · 제구 안정",
    load: "부담 증가 · 제구 흔들림",
    overload: "과부하 · 실투 위험",
    limit: "한계 · 장타 위험"
  };
  return hints[tierId] || hints.stable;
}

function renderPitchButtons() {
  els.pitchButtons.classList.toggle("pitch-buttons--single-column", state.pitcher.repertoire.length <= 2);
  els.pitchButtons.innerHTML = state.pitcher.repertoire
    .map((pitch, index) => {
      if (MP.ensurePitchRuntime) MP.ensurePitchRuntime(pitch);
      const level = pitch.level || 1;
      const burdenValue = Math.min(100, Math.max(0, pitch.burden || 0));
      const burdenTierLabel = MP.burdenLabel ? MP.burdenLabel(burdenValue) : "안정";
      const burdenTierId = MP.getBurdenModifiers ? MP.getBurdenModifiers(pitch).tierId : "stable";
      const selected = state.selectedPitchId === pitch.id;
      const levelMeta = level > 1 ? ` · Lv.${level}` : "";
      const hint = burdenUiHint(burdenTierId);
      return `
        <button
          class="pitch-button${selected ? " selected" : ""}"
          type="button"
          data-pitch="${pitch.id}"
          data-burden-tier="${burdenTierId}"
          aria-label="${pitch.name} ${pitch.label} ${burdenTierLabel}"
        >
          <span class="pitch-burden-chip" data-tier="${burdenTierId}">
            <span class="pitch-burden-chip-icon" aria-hidden="true">${burdenChipIcon(burdenTierId)}</span>
            <span class="pitch-burden-chip-text">${escapeHtml(burdenTierLabel)}</span>
          </span>
          <img class="pitch-icon" src="${pitchIconUrl(pitch)}" alt="" aria-hidden="true" />
          <div class="pitch-content">
            <div class="pitch-name-row">
              <kbd>${index + 1}</kbd>
              <strong class="pitch-name">${escapeHtml(pitch.name)}</strong>
            </div>
            <span class="pitch-meta">${escapeHtml(pitch.label)} · ${pitchVelocityKmh(pitch)}km/h${levelMeta}</span>
            <small class="pitch-role">${escapeHtml(pitch.note || "")}</small>
            <span class="pitch-burden-hint">${escapeHtml(hint)}</span>
          </div>
          <div class="pitch-fatigue">
            <span class="pitch-fatigue-label">피로도</span>
            <span class="pitch-burden" data-tier="${burdenTierId}" aria-hidden="true">
              <i style="width:${burdenValue}%"></i>
            </span>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderCourseControls() {
  els.strikeZone.classList.add("ball-mode", "wide-target-mode");

  els.strikeZone.innerHTML = `
    ${renderZoneButtons()}
    <div class="zone-result"></div>
    <div class="pitch-marker"><span></span></div>
  `;

  els.strikeZone.querySelectorAll(".zone-button").forEach((button) => {
    const zone = Number(button.dataset.zone);
    button.disabled = pitchInputLocked();
    button.classList.toggle("flash", state.flashZone === zone);
  });

  renderPitchMarker();
}

function renderZoneButtons() {
  return Array.from({ length: 25 }, (_, index) => {
    const row = Math.floor(index / 5) - 1;
    const col = (index % 5) - 1;
    const insideZone = row >= 0 && row <= 2 && col >= 0 && col <= 2;
    const nearestRow = clamp(row, 0, 2);
    const nearestCol = clamp(col, 0, 2);
    const zone = nearestRow * 3 + nearestCol + 1;
    const label = actualCourseLabel(row, col);
    if (insideZone) {
      return `<button class="zone-button strike-zone-target" type="button" data-zone="${zone}" data-target-row="${row}" data-target-col="${col}" data-intent="strike" aria-label="${zone}번 스트라이크 승부"></button>`;
    }
    return `<button class="zone-button ball-zone" type="button" data-zone="${zone}" data-target-row="${row}" data-target-col="${col}" data-intent="ball" aria-label="${label} 볼 유도"></button>`;
  }).join("");
}

function renderPitchMarker() {
  const marker = els.strikeZone.querySelector?.(".pitch-marker");
  const badge = els.strikeZone.querySelector?.(".zone-result");
  if (!marker || !badge) return;

  marker.className = "pitch-marker";
  badge.className = "zone-result";

  if (!state.lastLocation || !state.lastPitchCall) {
    marker.classList.remove("show");
    badge.textContent = "";
    return;
  }

  const x = clamp(((state.lastLocation.col + 1.5) / 5) * 100, 4, 96);
  const y = clamp(((state.lastLocation.row + 1.5) / 5) * 100, 4, 96);
  marker.style.setProperty("--marker-x", `${x}%`);
  marker.style.setProperty("--marker-y", `${y}%`);
  marker.classList.add("show", state.lastPitchCall.type);
  marker.querySelector("span").textContent = state.lastLocation.actualLabel;

  badge.textContent = state.lastPitchCall.label || "";
  if (state.lastPitchCall.label) badge.classList.add("show", state.lastPitchCall.type);
}

function handleCourseClick(zone, targetRow = null, targetCol = null, intent = "strike") {
  if (pitchInputLocked()) return;
  const plannedIntent = intent === "ball" ? "ball" : "strike";
  state.pitchIntent = plannedIntent;
  state.pitchBallPlan =
    plannedIntent === "ball" ? classifyBallIntent(zone, "ball", "", targetRow, targetCol) || "waste" : "";
  flashCourse(zone);
  if (!state.selectedPitchId) {
    state.selectedPitchId = state.pitcher.repertoire[0]?.id || null;
    renderPitchButtons();
  }
  if (state.selectedPitchId) throwPitch(state.selectedPitchId, zone, targetRow, targetCol);
}

function disablePitchButtons(disabled) {
  els.pitchButtons.querySelectorAll("button").forEach((button) => {
    button.disabled = disabled;
  });
  els.strikeZone.querySelectorAll(".zone-button").forEach((button) => {
    button.disabled = disabled;
  });
}

function setTiming(text, tone) {
  els.timingBadge.textContent = text;
  els.timingBadge.classList.remove("show", "good", "warn", "danger");
  if (tone) els.timingBadge.classList.add(tone);
  els.timingBadge.classList.add("show");
  els.strikeZone.classList.toggle("flash-danger", tone === "danger");
  els.strikeZone.classList.toggle("flash-good", tone === "good");
}

function queueTiming(text, tone) {
  if (MP.timingTimer) window.clearTimeout(MP.timingTimer);
  MP.timingTimer = window.setTimeout(() => {
    setTiming(text, tone);
    MP.timingTimer = null;
  }, GAME_TIMING.timingFeedbackDelay);
}

function hideTiming() {
  if (MP.timingTimer) {
    window.clearTimeout(MP.timingTimer);
    MP.timingTimer = null;
  }
  els.timingBadge.textContent = "";
  els.timingBadge.classList.remove("show", "good", "warn", "danger");
}

function showEventBanner(text, tone = "inning", duration = GAME_TIMING.eventBannerDefault) {
  if (!els.inningBanner) return;
  if (MP.inningBannerTimer) {
    window.clearTimeout(MP.inningBannerTimer);
    MP.inningBannerTimer = null;
  }
  els.inningBanner.textContent = text;
  els.inningBanner.className = `inning-banner ${tone}`;
  els.inningBanner.hidden = false;
  els.inningBanner.classList.add("show");
  MP.inningBannerTimer = window.setTimeout(() => {
    els.inningBanner.classList.remove("show");
    els.inningBanner.hidden = true;
    MP.inningBannerTimer = null;
  }, duration);
}

function showStageOverlay(title, subtitle, duration = GAME_TIMING.stageOverlayDefault) {
  if (!els.stageOverlay) return;
  els.stageTitle.textContent = title;
  els.stageSubtitle.textContent = subtitle;
  if (els.stageThemePanel) els.stageThemePanel.hidden = true;
  els.stageOverlay.hidden = false;
  els.stageOverlay.classList.add("show");
  window.setTimeout(() => {
    els.stageOverlay.classList.remove("show");
    els.stageOverlay.hidden = true;
  }, duration);
}

function stageThemeDetailHtml(theme) {
  if (!theme) return "";
  return `
    <p class="stage-theme-line"><span>특징</span> ${escapeHtml(theme.shortDesc)}</p>
    <p class="stage-theme-line"><span>위험</span> ${escapeHtml(theme.dangerText)}</p>
    <p class="stage-theme-line"><span>공략</span> ${escapeHtml(theme.counterText)}</p>
    <p class="stage-theme-line"><span>보상</span> ${escapeHtml(theme.rewardHint)}</p>
  `;
}

function showStageThemeOverlay(stageNumber, innings, themeId = state.stageThemeId) {
  if (!els.stageOverlay) return;
  const theme = MP.getStageTheme ? MP.getStageTheme(themeId || state.stageThemeId) : null;
  els.stageTitle.textContent = `STAGE ${stageNumber || currentStageNumber()}`;
  els.stageSubtitle.textContent = `${innings || currentStageInnings()} INNINGS`;
  if (els.stageThemePanel && theme) {
    els.stageThemePanel.hidden = false;
    els.stageThemePanel.innerHTML = `
      <p class="stage-theme-name">${escapeHtml(theme.name)}</p>
      ${stageThemeDetailHtml(theme)}
    `;
  } else if (els.stageThemePanel) {
    els.stageThemePanel.hidden = true;
    els.stageThemePanel.innerHTML = "";
  }
  els.stageOverlay.hidden = false;
  els.stageOverlay.classList.add("show");
  window.setTimeout(() => {
    els.stageOverlay.classList.remove("show");
    els.stageOverlay.hidden = true;
  }, GAME_TIMING.stageOverlayBegin || GAME_TIMING.stageOverlayDefault);
}

function renderThemeChoiceCards() {
  if (!els.themeChoiceList) return;
  els.themeChoiceList.innerHTML = (state.pendingThemeChoices || [])
    .map((theme) => {
      const fit = MP.themeFitLabel ? MP.themeFitLabel(theme, state.pitcher) : null;
      const fitClass = fit?.tone ? ` theme-fit--${fit.tone}` : "";
      const fitText = fit?.text ? `<p class="theme-choice-fit${fitClass}">${escapeHtml(fit.text)}</p>` : "";
      return `
      <button class="theme-choice-card" type="button" data-theme-id="${escapeHtml(theme.id)}">
        <strong>${escapeHtml(theme.name)}</strong>
        <p>${escapeHtml(theme.shortDesc)}</p>
        ${fitText}
        <p class="theme-choice-danger"><span>위험</span> ${escapeHtml(theme.dangerText)}</p>
        <p class="theme-choice-reward"><span>보상</span> ${escapeHtml(theme.rewardHint)}</p>
      </button>
    `;
    })
    .join("");
}

function openThemeSelectOverlay() {
  if (!els.themeSelectOverlay || state.gameOver) return;
  clearAutoAdvance();
  renderThemeChoiceCards();
  els.themeSelectOverlay.hidden = false;
  disablePitchButtons(true);
  syncScreenPhase();
}

function confirmStageTheme(themeId) {
  if (!themeId || state.gameOver) return;
  state.awaitingThemeSelection = false;
  state.pendingThemeChoices = [];
  if (els.themeSelectOverlay) els.themeSelectOverlay.hidden = true;
  advanceStage(themeId);
  showStageThemeOverlay(currentStageNumber(), currentStageInnings(), themeId);
  state.waitingNextBatter = false;
  startAtBat();
  render();
  scheduleAutoAdvance(GAME_TIMING.autoAdvanceDefault);
}

function showBatterEntryBanner() {
  if (state.gameOver) return;
  const batter = currentBatter();
  if (batter.isBoss) {
    showEventBanner(`보스배터\n${batter.name}`, "boss", GAME_TIMING.bossBanner);
    return;
  }
  showNextBatterBanner();
}

function showNextBatterBanner() {
  if (state.gameOver) return;
  const batter = currentBatter();
  showEventBanner(`NEXT BATTER · ${batter.slot}번 ${batter.name}`, "next", GAME_TIMING.nextBatterBanner);
}

function hideBallSprite() {
  if (MP.pitchFlightFrame) {
    window.cancelAnimationFrame(MP.pitchFlightFrame);
    MP.pitchFlightFrame = null;
  }
  els.ballSprite.getAnimations?.().forEach((animation) => animation.cancel());
  els.ballSprite.classList.remove("animate");
  els.ballSprite.style.setProperty("--ball-opacity", "0");
  els.ballSprite.style.setProperty("--ball-visibility", "hidden");
}

function pitchFlightProfile(pitch) {
  const profiles = {
    four: { breakX: 0, breakY: -8, duration: 520, spin: 540 },
    two: { breakX: -28, breakY: 18, duration: 590, spin: 470 },
    sinker: { breakX: -14, breakY: 58, duration: 640, spin: 430 },
    cutter: { breakX: 26, breakY: -2, duration: 560, spin: 500 },
    slider: { breakX: 58, breakY: 12, duration: 680, spin: 620 },
    curve: { breakX: -24, breakY: 76, duration: 780, spin: 760 },
    change: { breakX: -10, breakY: 34, duration: 740, spin: 360 },
    splitter: { breakX: 6, breakY: 86, duration: 700, spin: 420 }
  };
  return profiles[pitch?.id] || { breakX: 0, breakY: 0, duration: 620, spin: 420 };
}

function animatePitch(location, pitch) {
  const zoneRect = els.strikeZone.getBoundingClientRect();
  const sceneRect = els.ballSprite.parentElement.getBoundingClientRect();
  const row = location?.row ?? 1;
  const col = location?.col ?? 1;
  const movement = pitchFlightProfile(pitch);
  const endX = zoneRect.left - sceneRect.left + ((col + 1.5) / 5) * zoneRect.width;
  const endY = zoneRect.top - sceneRect.top + ((row + 1.5) / 5) * zoneRect.height;
  const zoneCenterX = zoneRect.left - sceneRect.left + zoneRect.width * 0.5;
  const zoneTopY = zoneRect.top - sceneRect.top;
  const startX = zoneCenterX;
  const startY = clamp(zoneTopY - sceneRect.height * 0.14, sceneRect.height * 0.18, sceneRect.height * 0.42);
  const controlX = (startX + endX) * 0.5 + movement.breakX;
  const controlY = (startY + endY) * 0.5 + movement.breakY;

  els.ballSprite.style.setProperty("--ball-start-x", `${startX}px`);
  els.ballSprite.style.setProperty("--ball-start-y", `${startY}px`);
  els.ballSprite.style.setProperty("--ball-end-x", `${endX}px`);
  els.ballSprite.style.setProperty("--ball-end-y", `${endY}px`);

  if (MP.pitchFlightFrame) window.cancelAnimationFrame(MP.pitchFlightFrame);
  els.ballSprite.getAnimations?.().forEach((animation) => animation.cancel());
  els.ballSprite.classList.remove("animate");
  void els.ballSprite.offsetWidth;
  els.ballSprite.style.setProperty("--ball-current-x", `${startX}px`);
  els.ballSprite.style.setProperty("--ball-current-y", `${startY}px`);
  els.ballSprite.style.setProperty("--ball-scale", "0.34");
  els.ballSprite.style.setProperty("--ball-rotate", "0deg");
  els.ballSprite.style.setProperty("--ball-opacity", "1");
  els.ballSprite.style.setProperty("--ball-visibility", "visible");
  els.ballSprite.classList.add("animate");

  const duration = movement.duration;
  const startTime = performance.now();
  const easeOut = (value) => 1 - Math.pow(1 - value, 3);
  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = easeOut(progress);
    const oneMinus = 1 - eased;
    const x = oneMinus * oneMinus * startX + 2 * oneMinus * eased * controlX + eased * eased * endX;
    const y = oneMinus * oneMinus * startY + 2 * oneMinus * eased * controlY + eased * eased * endY;
    const scale = 0.34 + (1.22 - 0.34) * eased;
    const rotate = movement.spin * eased;

    els.ballSprite.style.setProperty("--ball-current-x", `${x}px`);
    els.ballSprite.style.setProperty("--ball-current-y", `${y}px`);
    els.ballSprite.style.setProperty("--ball-scale", String(scale));
    els.ballSprite.style.setProperty("--ball-rotate", `${rotate}deg`);

    if (progress < 1) {
      MP.pitchFlightFrame = window.requestAnimationFrame(tick);
    } else {
      MP.pitchFlightFrame = null;
    }
  };
  MP.pitchFlightFrame = window.requestAnimationFrame(tick);
}

function bindUiEvents() {
  if (MP.uiEventsBound) return;
  MP.uiEventsBound = true;

  els.newGameButton.addEventListener("click", startGame);
  els.bgmToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleBgm();
  });
  els.restartButton.addEventListener("click", startGame);
  els.nextBatterButton.addEventListener("click", nextBatter);
  document.addEventListener("pointerdown", unlockAudio, { once: true });
  els.batterCardToggle?.addEventListener("click", () => {
    state.batterCardExpanded = !state.batterCardExpanded;
    render();
  });
  els.strikeZone.addEventListener("click", (event) => {
    const button = event.target.closest?.(".zone-button");
    if (button) handleCourseClick(button.dataset.zone, button.dataset.targetRow, button.dataset.targetCol, button.dataset.intent);
  });
  els.batterType?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-batter-tag]");
    if (button) showTagDetail(button.dataset.batterTag);
  });
  els.pitcherTags?.addEventListener("click", (event) => {
    const evoButton = event.target.closest?.("[data-pitcher-evolution]");
    if (evoButton) {
      showPitcherEvolutionDetail(evoButton.dataset.pitcherEvolution, evoButton);
      return;
    }
    const button = event.target.closest?.("[data-pitcher-tag]");
    if (button) showPitcherTagDetail(button.dataset.pitcherTag, button);
  });
  els.pitcherName?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-pitcher-tag]");
    if (button) showPitcherTagDetail(button.dataset.pitcherTag, button);
  });
  els.pitchButtons?.addEventListener("click", (event) => {
    const button = event.target.closest?.("button[data-pitch]");
    if (button) selectPitch(button.dataset.pitch);
  });
  els.pitcherChoiceList?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-pitcher-index]");
    if (!button) return;
    const pitcher = state.pitcherChoices[Number(button.dataset.pitcherIndex)];
    if (pitcher) beginGameWithPitcher(pitcher);
  });
  els.rewardChoiceList?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-reward-index]");
    if (button) selectRewardChoice(Number(button.dataset.rewardIndex));
  });
  els.rewardConfirmButton?.addEventListener("click", () => confirmRewardChoice());
  els.themeChoiceList?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-theme-id]");
    if (button?.dataset.themeId) confirmStageTheme(button.dataset.themeId);
  });
  if (document.addEventListener) {
    document.addEventListener("keydown", (event) => {
      if (event.target?.matches?.("input, textarea, button")) return;
      unlockAudio();
      if (/^[1-5]$/.test(event.key)) {
        event.preventDefault();
        selectPitchByNumber(event.key);
      }
    });
  }
}

MP.debug = {
  state,
  els,
  render,
  generatePitcher,
  beginGameWithPitcher,
  startGame,
  startAtBat,
  nextBatter,
  currentBatter,
  addOut,
  advanceStage,
  finishAtBat,
  generateLineup,
  createPlan,
  openRewardDraft,
  generateRewardChoices,
  generateStageTagChoices,
  generateSupportTagUpgradeChoices,
  generateCoreEvolutionChoices,
  selectRewardChoice,
  confirmRewardChoice,
  coreEvolutionById,
  applyReward,
  selectPitch,
  tagById,
  pitchById,
  currentStageInnings,
  assertPitcherCardLayout
};
MP.debugReady = true;

function setupTestConsoleBridge() {
  const CHANNEL = "mount-psycho-test";

  function testConsoleSnapshot() {
    const batter = currentBatter();
    const snap = {
      balls: state.balls,
      strikes: state.strikes,
      outs: state.outs,
      bases: state.bases.slice(),
      runs: state.runs,
      inning: state.inning,
      stageIndex: state.stageIndex,
      batterIndex: state.batterIndex,
      pitchCount: state.pitchCount,
      screenPhase: state.screenPhase,
      atBat: state.atBat
        ? {
            suspicion: state.atBat.suspicion,
            target: state.atBat.target,
            recommendation: state.atBat.recommendation
          }
        : null,
      lineup: (state.lineup || []).map((b, index) => ({
        name: b.name,
        slot: b.slot || index + 1,
        isBoss: !!b.isBoss,
        type: b.type
      })),
      pitcher: null,
      currentBatter: null
    };
    if (state.pitcher) {
      snap.pitcher = {
        name: state.pitcher.name,
        style: state.pitcher.style,
        coreTagId: state.pitcher.coreTagId,
        coreEvolutionId: state.pitcher.coreEvolutionId || null,
        bonusTags: (state.pitcher.bonusTags || []).slice(),
        bonusTagTiers: { ...(state.pitcher.bonusTagTiers || {}) },
        revealedWeaknessTags: (state.pitcher.revealedWeaknessTags || []).slice(),
        stats: { ...state.pitcher.stats },
        repertoire: (state.pitcher.repertoire || []).map((pitch) => {
          if (MP.ensurePitchRuntime) MP.ensurePitchRuntime(pitch);
          return {
            id: pitch.id,
            name: pitch.name,
            label: pitch.label || "",
            level: pitch.level || 1,
            burden: pitch.burden,
            stageMastery: pitch.stageMastery,
            runMastery: pitch.runMastery,
            burdenTier: MP.burdenLabel ? MP.burdenLabel(pitch.burden) : ""
          };
        }),
        tagNames: {
          core: tagById(state.pitcher.coreTagId)?.name || "-",
          evolution: coreEvolutionById(state.pitcher.coreEvolutionId)?.name || "-",
          bonus: (state.pitcher.bonusTags || []).map((tagId) => supportTagDisplayName(tagId)).join(", ") || "-",
          weakness: (state.pitcher.revealedWeaknessTags || []).map((tagId) => tagById(tagId)?.name || tagId).join(", ") || "-"
        }
      };
    }
    if (batter) {
      snap.currentBatter = {
        name: batter.name,
        type: batter.type,
        isBoss: !!batter.isBoss,
        stats: { ...batter.stats },
        tendency: batter.tendency,
        mind: batter.mind
      };
    }
    return snap;
  }

  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.channel !== CHANNEL || data.id == null) return;
    const respond = (payload) => {
      event.source?.postMessage({ channel: CHANNEL, id: data.id, ...payload }, event.origin === "null" ? "*" : event.origin || "*");
    };
    try {
      if (data.cmd === "ping") {
        respond({ ok: true, debugReady: !!MP.debugReady, hasPitcher: !!state.pitcher, screenPhase: state.screenPhase });
        return;
      }
      if (data.cmd === "exec") {
        const result = (0, eval)(data.code);
        respond({ ok: true, result: result === undefined ? null : result });
        return;
      }
      if (data.cmd === "snapshot") {
        respond({ ok: true, snapshot: testConsoleSnapshot() });
        return;
      }
      respond({ ok: false, error: "unknown cmd: " + data.cmd });
    } catch (error) {
      respond({ ok: false, error: String(error?.message || error) });
    }
  });

  if (window.parent !== window) {
    window.parent.postMessage({ channel: CHANNEL, event: "boot", debugReady: !!MP.debugReady }, "*");
  }
}

setupTestConsoleBridge();

bindUiEvents();
startGame();

})(window.MountPsycho);
