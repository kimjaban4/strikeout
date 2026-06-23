/* 구종 부담도 + 숙련도 — 마운드 심리전 */
window.MountPsycho = window.MountPsycho || {};
(function (MP) {
  const { pitchBurdenConfig: burdenCfg, pitchMasteryConfig: masteryCfg, pitchLevelNames, state } = MP;

  function clampBurden(value) {
    return Math.round(Math.max(0, Math.min(burdenCfg.max, value)));
  }

  function ensurePitchRuntime(pitch) {
    if (!pitch) return pitch;
    if (pitch.level == null) pitch.level = 1;
    if (pitch.burden == null) pitch.burden = 0;
    if (pitch.stageMastery == null) pitch.stageMastery = 0;
    if (pitch.runMastery == null) pitch.runMastery = 0;
    return pitch;
  }

  function initPitchProgressionState() {
    state.pitchProgression = {
      lastPitchId: null,
      consecutivePitchId: null,
      consecutiveCount: 0,
      pitchSequence: [],
      bossUpgradeUnlocked: false
    };
    state.pitcher?.repertoire?.forEach(ensurePitchRuntime);
  }

  function burdenTier(burden) {
    return burdenCfg.tiers.find((tier) => burden >= tier.min && burden <= tier.max) || burdenCfg.tiers[0];
  }

  function burdenLabel(burden) {
    return burdenTier(burden).label;
  }

  function masteryFlowLabel(stageMastery) {
    const row = masteryCfg.flowLabels.find((item) => stageMastery >= item.min && stageMastery <= item.max);
    return row?.label || "낮음";
  }

  function getBurdenModifiers(pitch) {
    ensurePitchRuntime(pitch);
    const tier = burdenTier(pitch.burden);
    return {
      tierId: tier.id,
      label: tier.label,
      commandPenalty: tier.command,
      mistakeBonus: tier.mistake,
      homerunBonus: tier.homerun,
      whiffBonus: tier.whiff
    };
  }

  function countKey(balls, strikes) {
    return `${balls}-${strikes}`;
  }

  function countMultiplier(balls, strikes) {
    return masteryCfg.countMult[countKey(balls, strikes)] ?? 1;
  }

  function runnerMultiplier() {
    const bases = state.bases;
    const scoring = bases[1] || bases[2];
    const loaded = bases[0] && bases[1] && bases[2];
    if (loaded) return masteryCfg.runnerMult.loaded;
    if (state.outs === 2 && scoring) return masteryCfg.runnerMult.twoOutScoring;
    if (scoring) return masteryCfg.runnerMult.scoring;
    if (bases[0]) return masteryCfg.runnerMult.first;
    return masteryCfg.runnerMult.none;
  }

  function batterMultiplier(batter) {
    if (!batter) return masteryCfg.batterMult.normal;
    if (batter.isBoss && state.stageIndex >= 2) return masteryCfg.batterMult.finalBoss;
    if (batter.isBoss) return masteryCfg.batterMult.boss;
    if (batter.slot >= 3 && batter.slot <= 6) return masteryCfg.batterMult.middle;
    if (batter.slot >= 7) return masteryCfg.batterMult.bottom;
    return masteryCfg.batterMult.normal;
  }

  function repeatGainMultiplier(consecutiveCount) {
    if (consecutiveCount <= 1) return masteryCfg.repeatGain[1];
    if (consecutiveCount === 2) return masteryCfg.repeatGain[2];
    if (consecutiveCount === 3) return masteryCfg.repeatGain[3];
    return masteryCfg.repeatGain[4];
  }

  function burdenGainRate(tierId) {
    return masteryCfg.burdenGainRate[tierId] ?? 1;
  }

  function updatePitchSequence(pitchId) {
    const prog = state.pitchProgression;
    if (prog.consecutivePitchId === pitchId) prog.consecutiveCount += 1;
    else {
      prog.consecutivePitchId = pitchId;
      prog.consecutiveCount = 1;
    }
    prog.lastPitchId = pitchId;
    prog.pitchSequence = [...prog.pitchSequence, pitchId].slice(-6);
  }

  function applyBurdenAfterPitch(pitch, snapshot) {
    ensurePitchRuntime(pitch);
    const before = pitch.burden;
    const prog = state.pitchProgression;
    const consecutive = prog.consecutiveCount;
    let delta = burdenCfg.useBase;
    if (consecutive >= 4) delta += burdenCfg.repeat4;
    else if (consecutive === 3) delta += burdenCfg.repeat3;
    else if (consecutive === 2) delta += burdenCfg.repeat2;
    if (snapshot.strikes === 2) delta += burdenCfg.twoStrike;
    if (snapshot.balls === 3 && snapshot.strikes === 2) delta += burdenCfg.fullCount;
    if (snapshot.isBoss) delta += burdenCfg.vsBoss;
    if (before >= burdenCfg.highBurdenThreshold) delta += burdenCfg.highBurdenExtra;
    pitch.burden = clampBurden(before + delta);
  }

  function recoverBurdenOtherPitches(usedPitchId) {
    state.pitcher?.repertoire?.forEach((pitch) => {
      if (pitch.id === usedPitchId) return;
      ensurePitchRuntime(pitch);
      const before = pitch.burden;
      pitch.burden = clampBurden(pitch.burden - burdenCfg.recoverOther);
    });
  }

  function recoverBurdenAll(amount) {
    state.pitcher?.repertoire?.forEach((pitch) => {
      ensurePitchRuntime(pitch);
      pitch.burden = clampBurden(pitch.burden - amount);
    });
  }

  function resetStageMasteryAll() {
    state.pitcher?.repertoire?.forEach((pitch) => {
      ensurePitchRuntime(pitch);
      pitch.stageMastery = 0;
      pitch.lastSuccessReason = null;
    });
  }

  function onStageClearProgression() {
    recoverBurdenAll(burdenCfg.recoverStage);
    resetStageMasteryAll();
  }

  function roleBonus(pitch, result, snapshot, pattern) {
    let bonus = 0;
    const low = result.location?.row >= 2;
    const edge = result.location?.col <= 0 || result.location?.col >= 2;
    const prevCat = state.atBat?.pitchHistory?.[state.atBat.pitchHistory.length - 2];
    const seq = state.pitchProgression.pitchSequence;
    const prevId = seq[seq.length - 2];

    if (pitch.id === "four") {
      if (result.result === "calledStrike") bonus += 4;
      if (result.result === "swingingStrike" && result.timingLabel === "완전히 속음") bonus += 6;
      if (snapshot.balls >= 2 && result.result === "calledStrike") bonus += 5;
      if (prevCat === "breaking" || prevCat === "offspeed") bonus += 4;
      if (snapshot.balls === 3 && snapshot.strikes === 2 && result.result === "calledStrike") bonus += 6;
    }
    if (pitch.id === "two" && low && result.result === "inPlayOut") bonus += 6;
    if (pitch.id === "sinker") {
      if (result.result === "inPlayOut" && low) bonus += 6;
      if (result.result === "doublePlay") bonus += 10;
      if (state.bases.some(Boolean) && low) bonus += 7;
    }
    if (pitch.id === "slider") {
      if (snapshot.strikes === 2 && result.result === "swingingStrike") bonus += 8;
      if (!result.inZone && result.swung) bonus += 7;
      if (prevCat === "fast") bonus += 5;
    }
    if (pitch.id === "curve") {
      if (snapshot.balls === 0 && snapshot.strikes === 0 && result.result === "calledStrike") bonus += 6;
      if (prevCat === "fast" && low) bonus += 6;
      if (snapshot.balls === 2 && snapshot.strikes === 2) bonus += 7;
    }
    if (pitch.id === "change") {
      if (prevCat === "fast") bonus += 8;
      if (result.timingLabel === "완전히 속음") bonus += 8;
      if (snapshot.strikes === 2 || (snapshot.balls === 3 && snapshot.strikes === 2)) bonus += 7;
    }
    if (pitch.id === "cutter" && (result.result === "foul" || result.result === "inPlayOut")) bonus += 5;
    if (pitch.id === "splitter") {
      if (snapshot.strikes === 2 && result.result === "swingingStrike") bonus += 9;
      if (low && result.result === "inPlayOut") bonus += 7;
      if (state.bases.every(Boolean) && (result.result === "inPlayOut" || result.result === "swingingStrike")) bonus += 10;
    }
    if (prevId && pitch.category === "offspeed" && MP.pitchById?.(prevId)?.category === "fast") bonus += masteryCfg.comboFastToSlow;
    if (pattern?.reverseRead && !result.targetMatch) bonus += masteryCfg.psychCounter;
    if ((pattern?.suspicion || 0) >= 60 && !result.targetMatch && result.result !== "ball") bonus += masteryCfg.psychCounterHigh;
    return bonus;
  }

  function baseResultScore(result, atBatEnd, finishTitle) {
    const cfg = masteryCfg.baseScores;
    if (atBatEnd && finishTitle === "STRIKE OUT!") {
      let score = cfg.strikeoutFinish;
      if (result.batter?.isBoss) score += cfg.bossStrikeoutBonus;
      if (result.result === "calledStrike") score += cfg.lookingStrike - cfg.calledStrike;
      return score;
    }
    if (atBatEnd && finishTitle === "DOUBLE PLAY!") {
      let score = cfg.doublePlay;
      if (result.batter?.isBoss) score += cfg.bossOutBonus;
      return score;
    }
    if (atBatEnd && result.batter?.isBoss) return cfg.bossOutBonus;
    if (result.result === "calledStrike") return cfg.lookingStrike;
    if (result.result === "swingingStrike") {
      return result.timingLabel === "완전히 속음" || result.timingLabel === "늦음" || result.timingLabel === "너무 빠름"
        ? cfg.whiff
        : cfg.swingingStrike;
    }
    if (result.result === "foul") return cfg.foul;
    if (result.result === "inPlayOut") return result.timingLabel === "완전히 속음" ? cfg.weakOut : cfg.inPlayOut;
    if (result.result === "doublePlay") return cfg.doublePlay;
    return 0;
  }

  function failMasteryPenalty(result, consecutive) {
    const cfg = masteryCfg.failPenalty;
    if (result.result === "ball") return cfg.ball;
    if (result.result === "single" || result.result === "double" || result.result === "homerun") {
      if (consecutive >= 3) return cfg.spamHit;
      return result.result === "homerun" ? cfg.homerun : cfg.hit;
    }
    if (result.targetMatch && result.result !== "foul" && result.swung) return cfg.counterHit;
    return 0;
  }

  function applyMasteryFromResult(result, snapshot, options = {}) {
    const pitch = result.pitch;
    if (!pitch) return;
    ensurePitchRuntime(pitch);
    const score = baseResultScore(result, options.atBatEnd, options.finishTitle);
    if (score <= 0 && !options.atBatEnd) {
      const penalty = failMasteryPenalty(result, state.pitchProgression.consecutiveCount);
      if (penalty > 0) {
        pitch.stageMastery = Math.max(0, pitch.stageMastery - penalty);
      }
      return;
    }
    if (score <= 0) return;

    let total = score + roleBonus(pitch, result, snapshot, options.pattern);
    total *= countMultiplier(snapshot.balls, snapshot.strikes);
    total *= runnerMultiplier();
    total *= batterMultiplier(result.batter);
    total *= repeatGainMultiplier(state.pitchProgression.consecutiveCount);
    total *= burdenGainRate(burdenTier(pitch.burden).id);

    const gain = Math.max(0, Math.round(total));
    if (gain <= 0) return;

    pitch.stageMastery = Math.min(masteryCfg.stageMax, pitch.stageMastery + gain);
    pitch.runMastery += gain;
    pitch.lastSuccessReason = buildSuccessReason(pitch, result, snapshot, options);
  }

  function shortMasteryReason(pitch, result, snapshot, options) {
    if (pitch.id === "change" && state.pitchProgression.pitchSequence.length >= 2) {
      const prevId = state.pitchProgression.pitchSequence[state.pitchProgression.pitchSequence.length - 2];
      const prev = (MP.pitchLibrary || []).find((item) => item.id === prevId);
      if (prev?.category === "fast") return "완급 역이용";
    }
    if (pitch.id === "sinker" && result.result === "doublePlay") return "병살 유도";
    if (pitch.id === "cutter" && result.result === "foul") return "빗맞힘 유도";
    if (pitch.id === "splitter" && snapshot.strikes === 2) return "결정구 각인";
    if (pitch.id === "four") return "존 압박";
    if (options.pattern?.reverseRead) return "역노림 카운터";
    if (state.bases.some(Boolean)) return "위기 대응";
    return "스테이지 활약";
  }

  function buildSuccessReason(pitch, result, snapshot, options) {
    return shortMasteryReason(pitch, result, snapshot, options);
  }

  function processAfterPitch(result, snapshot, pattern) {
    if (!state.pitcher || !result?.pitch) return;
    updatePitchSequence(result.pitch.id);
    recoverBurdenOtherPitches(result.pitch.id);
    applyBurdenAfterPitch(result.pitch, snapshot);
    applyMasteryFromResult(result, snapshot, { pattern, atBatEnd: false });
  }

  function processAtBatEnd(result, finishTitle, pattern) {
    if (!result?.pitch) return;
    const snapshot = {
      balls: state.balls,
      strikes: state.strikes,
      isBoss: result.batter?.isBoss,
      isFullCount: state.balls === 3 && state.strikes === 2
    };
    applyMasteryFromResult(result, snapshot, { pattern, atBatEnd: true, finishTitle });
    recoverBurdenAll(burdenCfg.recoverAtBat);
  }

  function masteryWeightMult(stageMastery) {
    const row = masteryCfg.masteryWeight.find((item) => stageMastery >= item.min && stageMastery <= item.max);
    return row?.mult ?? 1;
  }

  function pitchTierLabelForLevel(level) {
    return ["무등급", "브론즈", "실버", "골드", "플래티넘"][Math.max(0, Math.min(4, (level || 1) - 1))];
  }

  function canUpgradePitchTo(pitch, nextLevel) {
    ensurePitchRuntime(pitch);
    if (nextLevel > 5 || pitch.level >= nextLevel) return false;
    if (nextLevel === 4 && pitch.stageMastery < masteryCfg.upgradeMasteryGate[4]) return false;
    if (nextLevel === 5) {
      if (pitch.stageMastery < masteryCfg.upgradeMasteryGate[5]) return false;
      if (!state.pitchProgression.bossUpgradeUnlocked) return false;
    }
    return true;
  }

  function upgradeRewardWeight(pitch, reason, result) {
    ensurePitchRuntime(pitch);
    const nextLevel = pitch.level + 1;
    if (!canUpgradePitchTo(pitch, nextLevel)) return 0;
    let weight = masteryWeightMult(pitch.stageMastery);
    const runBonus = Math.min(1.2, 1 + pitch.runMastery / 200);
    weight *= runBonus;
    if (reason?.includes("삼진") && result?.pitch?.id === pitch.id) weight += 0.5;
    if (reason?.includes("병살") && result?.pitch?.id === pitch.id) weight += 0.7;
    if (reason?.includes("보스") && result?.pitch?.id === pitch.id) weight += 0.8;
    if (pitch.burden >= 70) weight -= 0.4;
    if (pitch.level >= 3) weight *= masteryCfg.levelWeightDecay[3];
    if (pitch.level >= 4) weight *= masteryCfg.levelWeightDecay[4];
    if (pitch.level >= 5) weight *= masteryCfg.levelWeightDecay[5];
    return Math.max(0, weight);
  }

  function buildPitchUpgradeReward(pitch) {
    const nextLevel = pitch.level + 1;
    const names = pitchLevelNames[pitch.id] || [];
    const effectName = names[nextLevel] || "강화";
    const reasonShort = pitch.lastSuccessReason || "스테이지 활약";
    return {
      type: "pitchUpgrade",
      pitchId: pitch.id,
      nextLevel,
      title: `${pitch.name} ${pitchTierLabelForLevel(nextLevel)}`,
      desc: effectName,
      reason: reasonShort
    };
  }

  function collectPitchUpgradeCandidates(reason, result) {
    const candidates = [];
    state.pitcher?.repertoire?.forEach((pitch) => {
      ensurePitchRuntime(pitch);
      const weight = upgradeRewardWeight(pitch, reason, result);
      if (weight <= 0) return;
      const reward = buildPitchUpgradeReward(pitch);
      const copies = Math.max(1, Math.round(weight * 2));
      for (let i = 0; i < copies; i += 1) candidates.push({ reward, weight: 1 });
    });
    return candidates;
  }

  function pickWeightedPitchUpgrades(entries, count) {
    const picked = [];
    const pool = [...entries];
    while (pool.length && picked.length < count) {
      const total = pool.reduce((sum, item) => sum + item.weight, 0);
      let roll = Math.random() * total;
      let index = 0;
      for (; index < pool.length; index += 1) {
        roll -= pool[index].weight;
        if (roll <= 0) break;
      }
      const chosen = pool.splice(index, 1)[0];
      if (!chosen) break;
      if (picked.some((item) => item.pitchId === chosen.reward.pitchId)) continue;
      picked.push(chosen.reward);
    }
    return picked;
  }

  function applyPitchUpgrade(reward) {
    const pitch = state.pitcher?.repertoire?.find((item) => item.id === reward.pitchId);
    if (!pitch || !canUpgradePitchTo(pitch, reward.nextLevel)) return false;
    pitch.level = reward.nextLevel;
    return true;
  }

  function pitchLevelEffect(pitch, location, atBat) {
    ensurePitchRuntime(pitch);
    const level = pitch.level;
    const effect = { quality: 0, swing: 0, contact: 0, contactQuality: 0, doublePlayBonus: 0, groundOutReduce: 0, label: "" };
    if (level < 2) return effect;

    const low = location.row >= 2;
    const edge = location.col <= 0 || location.col >= 2;

    if (pitch.id === "four") {
      if (level >= 2) effect.quality += 2;
      if (level >= 3 && location.row <= 0) effect.swing += 0.05;
      if (level >= 4 && atBat.pitchHistory[atBat.pitchHistory.length - 2] === "fast") effect.contact -= 0.05;
      if (level >= 5 && state.strikes === 2) effect.swing += pitch.burden >= 70 ? 0.03 : 0.06;
    }
    if (pitch.id === "sinker") {
      if (level >= 2 && low) effect.quality += 2;
      if (level >= 3 && low) effect.doublePlayBonus += 0.08;
      if (level >= 4 && state.bases[0]) effect.doublePlayBonus += 0.07;
    }
    if (pitch.id === "slider") {
      if (level >= 2 && edge) effect.quality += 2;
      if (level >= 3 && state.strikes === 2) effect.swing += 0.06;
    }
    if (pitch.id === "change") {
      if (level >= 2) effect.quality += 2;
      if (level >= 3 && atBat.pitchHistory[atBat.pitchHistory.length - 2] === "fast") effect.contactQuality -= 9;
    }
    if (pitch.id === "curve" && level >= 3 && atBat.pitchHistory.length <= 2) effect.quality += 4;
    if (pitch.id === "cutter" && level >= 3) effect.contactQuality -= 5;
    if (pitch.id === "splitter" && level >= 3 && state.strikes === 2 && low) {
      effect.swing += 0.08;
      effect.contact -= 0.1;
    }
    if (pitch.id === "two" && level >= 3 && low) effect.contactQuality -= 6;

    if (effect.quality || effect.swing) effect.label = `${pitch.name} ${pitchTierLabelForLevel(level)}`;
    return effect;
  }

  function mergeLevelEffect(baseEffect, pitch, location, atBat) {
    const levelFx = pitchLevelEffect(pitch, location, atBat);
    return {
      quality: baseEffect.quality + levelFx.quality,
      swing: baseEffect.swing + levelFx.swing,
      contact: baseEffect.contact + levelFx.contact,
      contactQuality: baseEffect.contactQuality + levelFx.contactQuality,
      doublePlayBonus: (baseEffect.doublePlayBonus || 0) + (levelFx.doublePlayBonus || 0),
      groundOutReduce: (baseEffect.groundOutReduce || 0) + (levelFx.groundOutReduce || 0),
      label: levelFx.label || baseEffect.label
    };
  }

  function noteBossUpgradeUnlock() {
    state.pitchProgression.bossUpgradeUnlocked = true;
  }

  MP.ensurePitchRuntime = ensurePitchRuntime;
  MP.initPitchProgressionState = initPitchProgressionState;
  MP.getBurdenModifiers = getBurdenModifiers;
  MP.burdenLabel = burdenLabel;
  MP.masteryFlowLabel = masteryFlowLabel;
  MP.processPitchProgressionAfterPitch = processAfterPitch;
  MP.processPitchProgressionAtBatEnd = processAtBatEnd;
  MP.recoverPitchBurdenInning = () => recoverBurdenAll(burdenCfg.recoverInning);
  MP.onStageClearPitchProgression = onStageClearProgression;
  MP.collectPitchUpgradeCandidates = collectPitchUpgradeCandidates;
  MP.pickWeightedPitchUpgrades = pickWeightedPitchUpgrades;
  MP.applyPitchUpgradeReward = applyPitchUpgrade;
  MP.mergePitchLevelEffect = mergeLevelEffect;
  MP.noteBossUpgradeUnlock = noteBossUpgradeUnlock;
})(window.MountPsycho);
