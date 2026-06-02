/* Generated from game.js by tools/split-game-modules.mjs. Do not edit directly. */
/* constants — 마운드 심리전 */
window.MountPsycho = window.MountPsycho || {};
(function (MP) {
MP.pitchLibrary = [
  {
    id: "four",
    name: "포심",
    category: "fast",
    label: "강속구",
    speed: 92,
    movement: 28,
    control: 76,
    cost: 5,
    note: "정면 승부"
  },
  {
    id: "two",
    name: "투심",
    category: "fast",
    label: "강속구",
    speed: 86,
    movement: 52,
    control: 68,
    cost: 5,
    note: "땅볼 유도"
  },
  {
    id: "sinker",
    name: "싱커",
    category: "fast",
    label: "강속구",
    speed: 84,
    movement: 74,
    control: 62,
    cost: 6,
    note: "낮은 땅볼 유도"
  },
  {
    id: "slider",
    name: "슬라이더",
    category: "breaking",
    label: "변화구",
    speed: 72,
    movement: 86,
    control: 58,
    cost: 7,
    note: "헛스윙 유도"
  },
  {
    id: "curve",
    name: "커브",
    category: "breaking",
    label: "변화구",
    speed: 56,
    movement: 92,
    control: 50,
    cost: 7,
    note: "타이밍 교란"
  },
  {
    id: "change",
    name: "체인지업",
    category: "offspeed",
    label: "느린공",
    speed: 48,
    movement: 66,
    control: 62,
    cost: 6,
    note: "직구 노림 저격"
  },
  {
    id: "splitter",
    name: "스플리터",
    category: "offspeed",
    label: "느린공",
    speed: 64,
    movement: 80,
    control: 46,
    cost: 8,
    note: "낙차 큰 승부구"
  },
  {
    id: "cutter",
    name: "커터",
    category: "fast",
    label: "강속구",
    speed: 82,
    movement: 62,
    control: 70,
    cost: 6,
    note: "빗맞힘 유도"
  }
];

MP.categoryNames = {
  fast: "강속구",
  breaking: "변화구",
  offspeed: "느린공"
};

MP.stageInnings = [3, 5, 7];
MP.stageRunLimits = [5, 4, 3];

MP.GAME_TIMING = {
  timingFeedbackDelay: 430,
  pitchResultCleanup: 1450,
  courseFlash: 460,
  weaknessBanner: 1250,
  inningTransitionDelay: 1250,
  rewardAfterOutWithTransition: 2850,
  rewardAfterOut: 1550,
  autoAdvanceAfterTransition: 2500,
  autoAdvanceDefault: 1200,
  rewardAutoAdvanceStageTag: 950,
  rewardAutoAdvanceNormal: 1200,
  stageTagRewardDelay: 2550,
  stageEntryDelay: 700,
  bossEntryBanner: 2050,
  gameOverHit: 1850,
  gameOverDefault: 650,
  eventBannerPitchResult: 1180,
  eventBannerDefault: 1500,
  stageOverlayDefault: 2100,
  stageOverlayBegin: 1900,
  nextBatterBanner: 1150,
  bossBanner: 1900,
  inningChangeOverlay: 1700,
  stageOverlayLong: 2200
};

MP.SCREEN_PHASE = {
  pitcherSelect: "pitcherSelect",
  pitching: "pitching",
  reward: "reward",
  themeSelect: "themeSelect",
  transition: "transition",
  gameOver: "gameOver"
};
MP.batterPortraits = Array.from({ length: 15 }, (_, index) => `assets/images/batters/batter${index + 1}.png`);
MP.pitcherPortraits = [1, 2, 3, 4, 5, 6, 7, 8, 10].map((index) => `assets/images/pitchers/pitcher${index}.png`);
MP.pitcherStatOrder = ["구속", "제구", "변화", "멘탈", "예측"];
MP.requiredFastballIds = ["four", "two", "sinker"];
MP.pitchVelocityAdjust = {
  four: 0,
  two: -4,
  sinker: -7,
  cutter: -6,
  splitter: -10,
  slider: -15,
  change: -22,
  curve: -28
};

MP.audioPaths = {
  bgm: "assets/audio/BGM.mp3",
  hit: "assets/audio/hit.mp3",
  homerun: "assets/audio/homerun.mp3",
  swing: "assets/audio/swing.wav"
};

MP.audioState = {
  unlocked: false,
  muted: false,
  bgm: null,
  bgmTimer: null,
  effects: {}
};

MP.pitcherProfiles = [
  {
    id: "power",
    label: "파워 피처",
    stats: {
      구속: [74, 92],
      제구: [46, 74],
      변화: [34, 58],
      멘탈: [44, 78],
      예측: [34, 68]
    }
  },
  {
    id: "breaking",
    label: "변화구 장인",
    stats: {
      구속: [46, 74],
      제구: [48, 78],
      변화: [74, 92],
      멘탈: [46, 82],
      예측: [42, 84]
    }
  },
  {
    id: "command",
    label: "제구형 투수",
    stats: {
      구속: [48, 78],
      제구: [74, 92],
      변화: [48, 76],
      멘탈: [52, 86],
      예측: [46, 84]
    }
  },
  {
    id: "balanced",
    label: "균형형 투수",
    stats: {
      구속: [54, 82],
      제구: [54, 82],
      변화: [54, 82],
      멘탈: [48, 84],
      예측: [40, 78]
    }
  }
];

MP.pitcherTagCatalog = [
  {
    id: "power_fastball",
    name: "강속구형",
    type: "base",
    description: "빠른 공 계열의 구위가 조금 강해집니다.",
    effects: { fastQualityBonus: 3 },
    profiles: ["power"]
  },
  {
    id: "breaking_master",
    name: "변화구 장인",
    type: "base",
    description: "변화구와 느린공 계열의 헛스윙 유도가 좋아집니다.",
    effects: { secondaryQualityBonus: 2, whiffBonus: 0.03 },
    profiles: ["breaking"]
  },
  {
    id: "command_artist",
    name: "제구형 투수",
    type: "base",
    description: "스트라이크 승부의 제구 흔들림이 조금 줄어듭니다.",
    effects: { strikeControlBonus: 3 },
    profiles: ["command"]
  },
  {
    id: "balanced_pitcher",
    name: "균형형 투수",
    type: "base",
    description: "동점 카운트에서 구위가 조금 안정됩니다.",
    effects: { evenCountQualityBonus: 2 },
    profiles: ["balanced"]
  },
  {
    id: "two_strike_specialist",
    name: "2스트 특화",
    type: "bonus",
    description: "2스트라이크 이후 삼진을 노릴 때 공의 힘이 좋아집니다.",
    effects: { twoStrikeQualityBonus: 4, twoStrikeContactPenalty: 0.05 },
    profiles: ["power", "command"]
  },
  {
    id: "low_zone_master",
    name: "낮은 코스 장인",
    type: "bonus",
    description: "낮은 코스 투구의 제구가 좋아집니다.",
    effects: { lowZoneControlBonus: 6 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "outside_control",
    name: "바깥쪽 제구",
    type: "bonus",
    description: "바깥쪽 승부의 제구가 좋아집니다.",
    effects: { outsideControlBonus: 6 },
    profiles: ["command", "balanced"]
  },
  {
    id: "whiff_boost",
    name: "헛스윙 유도",
    type: "bonus",
    description: "변화구와 유인구에 배트가 나올 확률이 조금 올라갑니다.",
    effects: { whiffBonus: 0.06, chaseBonus: 0.04 },
    profiles: ["breaking"]
  },
  {
    id: "groundball_inducer",
    name: "땅볼 유도",
    type: "bonus",
    description: "낮은 코스 인플레이에서 땅볼과 병살 가능성이 올라갑니다.",
    effects: { groundballBonus: 0.12, lowContactQualityPenalty: 5 },
    profiles: ["breaking", "command"]
  },
  {
    id: "mental_recovery",
    name: "멘탈 회복",
    type: "bonus",
    description: "주자가 있을 때 멘탈 부담이 조금 줄어듭니다.",
    effects: { pressureReduce: 4 },
    profiles: ["balanced", "command"]
  },
  {
    id: "first_pitch_edge",
    name: "초구 강세",
    type: "bonus",
    description: "타석 첫 구의 제구와 구위가 좋아집니다.",
    effects: { firstPitchControlBonus: 4, firstPitchQualityBonus: 3 },
    profiles: ["power", "balanced"]
  },
  {
    id: "homerun_risk",
    name: "장타 위험",
    type: "weakness",
    description: "실투가 몰리면 장타 위험이 커질 수 있습니다.",
    revealCondition: "allowHomerun",
    effects: { mistakeHomerunRisk: 8 }
  },
  {
    id: "walk_risk",
    name: "볼넷 위험",
    type: "weakness",
    description: "볼넷이 쌓이면 흔들릴 수 있습니다.",
    revealCondition: "allowWalk",
    effects: { walkPressure: 4 }
  },
  {
    id: "full_count_wobble",
    name: "풀카운트 불안",
    type: "weakness",
    description: "풀카운트에서 넣으러 가는 공이 흔들릴 수 있습니다.",
    revealCondition: "fullCountStress",
    effects: { fullCountPenalty: 5 }
  },
  {
    id: "pressure_wobble",
    name: "위기 흔들림",
    type: "weakness",
    description: "주자가 쌓이면 제구 흔들림이 커질 수 있습니다.",
    revealCondition: "consecutiveOnBase",
    effects: { pressurePenalty: 4 }
  },
  {
    id: "inside_cheese",
    name: "몸쪽 위협",
    type: "bonus",
    description: "몸쪽 승부 제구가 좋아지고 위협구가 더 효과적입니다.",
    effects: { insideControlBonus: 4, brushContactPenalty: 3 },
    profiles: ["power", "command"]
  },
  {
    id: "high_fast_lift",
    name: "고속 직구 위",
    type: "bonus",
    description: "높은 존 강속구의 구위와 헛스윙 유도가 좋아집니다.",
    effects: { highFastQualityBonus: 3, highFastWhiffBonus: 0.04 },
    profiles: ["power"]
  },
  {
    id: "full_count_command",
    name: "풀카운트 제구",
    type: "bonus",
    description: "풀카운트 스트라이크 승부의 제구가 안정됩니다.",
    effects: { fullCountControlBonus: 5, fullCountWalkReduce: 2 },
    profiles: ["command", "balanced"]
  },
  {
    id: "pattern_shuffler",
    name: "배합 교란",
    type: "bonus",
    description: "구종·계열을 섞을 때 타자의 의심이 더 빨리 풀립니다.",
    effects: { mixSuspicionBonus: 2 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "texas_suppress",
    name: "약타 억제",
    type: "bonus",
    description: "완전히 속인 타자의 약한 안타 확률을 줄입니다.",
    effects: { texasHitSuppress: 0.06 },
    profiles: ["command", "breaking"]
  }
];

MP.coreTagCatalog = [
  {
    id: "core_high_fastballer",
    name: "하이볼러",
    family: "삼진계",
    description: "높은 코스에 강속구를 던지면 구위가 오르고 헛스윙 유도가 쉬워집니다. 강속구 전반의 위력도 조금 강해집니다.",
    effects: { highFastQualityBonus: 2, highFastWhiffBonus: 0.03, fastQualityBonus: 1 },
    profiles: ["power", "command"]
  },
  {
    id: "core_groundball_architect",
    name: "땅볼설계",
    family: "땅볼계",
    description: "낮은 코스로 승부하면 땅볼 유도 확률이 오르고, 낮은 공에 맞은 타구는 위력이 약해집니다.",
    effects: { groundballBonus: 0.08, lowContactQualityPenalty: 3 },
    profiles: ["breaking", "command"]
  },
  {
    id: "core_tempo_master",
    name: "완급지배",
    family: "완급계",
    description: "변화구·느린공의 구위가 오르고, 빠른 공과 번갈아 던질 때 헛스윙 확률이 조금 올라갑니다.",
    effects: { secondaryQualityBonus: 2, whiffBonus: 0.02 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "core_breaking_maestro",
    name: "마구장인",
    family: "삼진계",
    description: "변화구의 구위가 크게 오르고, 결정구로 헛스윙을 잡아낼 확률이 높아집니다.",
    effects: { secondaryQualityBonus: 3, whiffBonus: 0.03 },
    profiles: ["breaking"]
  },
  {
    id: "core_corner_artist",
    name: "칼제구",
    family: "제구계",
    description: "스트라이크 존 제구가 정밀해지고, 특히 바깥쪽 코너 제구가 좋아져 볼카운트를 유리하게 끌고 갑니다.",
    effects: { strikeControlBonus: 3, outsideControlBonus: 3 },
    profiles: ["command", "balanced"]
  },
  {
    id: "core_bait_designer",
    name: "낚시꾼",
    family: "심리계",
    description: "유인구·낚시 볼에 타자가 따라 나와 헛스윙할 확률이 오르고, 구종 배합으로 타자의 의심을 키웁니다.",
    effects: { chaseBonus: 0.03, mixSuspicionBonus: 1 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "core_counter_pitcher",
    name: "수싸움",
    family: "심리계",
    description: "타자가 노린 구종을 역으로 찔렀을 때 타구 위력을 크게 떨어뜨리고, 배합으로 의심을 키웁니다.",
    effects: { counterContactPenalty: 4, mixSuspicionBonus: 1 },
    profiles: ["command", "breaking"]
  },
  {
    id: "core_clutch_pitcher",
    name: "강심장",
    family: "멘탈/운영계",
    description: "득점권 등 위기 상황에서 받는 압박이 줄어 제구·멘탈이 흔들리지 않고, 풀카운트 제구도 안정됩니다.",
    effects: { pressureReduce: 5, fullCountControlBonus: 2 },
    profiles: ["balanced", "command"]
  },
  {
    id: "core_first_pitch_pressure",
    name: "기선제압",
    family: "제구계",
    description: "타석 첫 공의 제구와 구위가 크게 올라, 초구 스트라이크로 카운트를 선점하기 쉬워집니다.",
    effects: { firstPitchControlBonus: 4, firstPitchQualityBonus: 3 },
    profiles: ["power", "balanced"]
  },
  {
    id: "core_cutter_softcontact",
    name: "정타봉쇄",
    family: "땅볼계",
    description: "커터·투심으로 몸쪽·낮은 코스를 공략하면 정타를 억제해, 맞아도 약한 타구로 만듭니다.",
    effects: { brushContactPenalty: 2, lowContactQualityPenalty: 2 },
    profiles: ["command", "power"]
  },
  {
    id: "core_finisher_collector",
    name: "필살구",
    family: "삼진계",
    description: "2스트라이크 이후 결정구의 구위가 오르고 타자의 정타 확률이 떨어져, 삼진을 잡기 쉬워집니다.",
    effects: { twoStrikeQualityBonus: 3, twoStrikeContactPenalty: 0.04 },
    profiles: ["power", "breaking"]
  },
  {
    id: "core_game_manager",
    name: "판짜기",
    family: "멘탈/운영계",
    description: "동점 카운트에서 구위가 오르고 풀카운트 볼넷이 줄며, 위기 압박도 조금 줄어 안정적으로 운영합니다.",
    effects: { evenCountQualityBonus: 2, fullCountWalkReduce: 1, pressureReduce: 2 },
    profiles: ["balanced", "command"]
  }
];

MP.supportTagMeta = {
  two_strike_specialist: { family: "삼진계", countersWeakness: ["homerun_risk"], oppositeFamilies: ["멘탈/운영계"] },
  low_zone_master: { family: "제구계", countersWeakness: ["walk_risk", "homerun_risk"], oppositeFamilies: ["심리계"] },
  outside_control: { family: "제구계", countersWeakness: ["walk_risk"], oppositeFamilies: ["심리계"] },
  whiff_boost: { family: "삼진계", countersWeakness: ["homerun_risk"], oppositeFamilies: ["멘탈/운영계"] },
  groundball_inducer: { family: "땅볼계", countersWeakness: ["homerun_risk"], oppositeFamilies: ["삼진계"] },
  mental_recovery: { family: "멘탈/운영계", countersWeakness: ["pressure_wobble", "walk_risk"], oppositeFamilies: ["삼진계"] },
  first_pitch_edge: { family: "제구계", countersWeakness: ["walk_risk"], oppositeFamilies: ["심리계"] },
  inside_cheese: { family: "심리계", countersWeakness: ["homerun_risk"], oppositeFamilies: ["제구계"] },
  high_fast_lift: { family: "삼진계", countersWeakness: ["homerun_risk"], oppositeFamilies: ["멘탈/운영계"] },
  full_count_command: { family: "제구계", countersWeakness: ["full_count_wobble", "walk_risk"], oppositeFamilies: ["심리계"] },
  pattern_shuffler: { family: "심리계", countersWeakness: ["pressure_wobble"], oppositeFamilies: ["제구계"] },
  texas_suppress: { family: "멘탈/운영계", countersWeakness: ["homerun_risk"], oppositeFamilies: ["삼진계"] }
};

MP.coreEvolutionPatternSets = {
  A: ["canonical", "synergy", "weakness"],
  B: ["canonical", "operation", "risk"],
  C: ["synergy", "mastery", "stage"],
  D: ["weakness", "operation", "risk"],
  E: ["canonical", "psych", "burden"]
};

MP.coreEvolutionCatalog = [
  { id: "evo_hf_top_pressure", coreTagId: "core_high_fastballer", name: "상단압박", icon: "target", role: "canonical", condition: "높은 코스 강속구", effectText: "헛스윙↑, 장타 위험 소폭↑", operation: "높은 직구로 찍어누르는 운영", when: { highFast: true }, effects: { highFastWhiffBonus: 0.04, highFastQualityBonus: 2, mistakeHomerunRisk: 2 } },
  { id: "evo_hf_fast_imprint", coreTagId: "core_high_fastballer", name: "직구각인", icon: "bolt", role: "synergy", condition: "높은 강속구 성공 후", effectText: "다음 변화구 속임↑", operation: "직구 후 변화구로 마무리", when: { afterHighFast: true }, effects: { mixSuspicionBonus: 1, secondaryQualityBonus: 2 } },
  { id: "evo_hf_power_finish", coreTagId: "core_high_fastballer", name: "파워피니시", icon: "bolt", role: "risk", condition: "2스트 높은 강속구", effectText: "결정구 위력↑, 부담↑ 시 감소", operation: "2스트에서 위로 끝내기", when: { twoStrike: true, highFast: true }, effects: { twoStrikeQualityBonus: 3, highFastWhiffBonus: 0.03 } },
  { id: "evo_hf_bait_look", coreTagId: "core_high_fastballer", name: "시선끌기", icon: "hook", role: "psych", condition: "높은 공 후 낮은 변화구", effectText: "낮은 변화구 효과↑", operation: "높은 공 보여주고 아래로", when: { afterHigh: true, secondary: true }, effects: { secondaryQualityBonus: 2, whiffBonus: 0.02 } },
  { id: "evo_hf_speed_gamble", coreTagId: "core_high_fastballer", name: "강속승부", icon: "bolt", role: "risk", condition: "강속구 계열", effectText: "구위↑, 노림 일치 시 장타↑", operation: "속도로 밀어붙이는 고위험 운영", when: { fast: true }, effects: { fastQualityBonus: 2, mistakeHomerunRisk: 3 } },
  { id: "evo_bm_angle_up", coreTagId: "core_breaking_maestro", name: "각도강화", icon: "target", role: "canonical", condition: "변화구 계열", effectText: "헛스윙·타이밍 교란↑", operation: "변화구 각도로 흔들기", when: { secondary: true }, effects: { secondaryQualityBonus: 3, whiffBonus: 0.03 } },
  { id: "evo_bm_hide_path", coreTagId: "core_breaking_maestro", name: "궤적은폐", icon: "cycle", role: "psych", condition: "변화구 반복 시", effectText: "의심 상승 완화", operation: "같은 변화구를 숨기듯 던지기", when: { secondary: true }, effects: { mixSuspicionBonus: 1 } },
  { id: "evo_bm_k_finish", coreTagId: "core_breaking_maestro", name: "결정낙차", icon: "bolt", role: "canonical", condition: "2스트 변화구", effectText: "유인·헛스윙↑", operation: "2스트에서 낙차로 끝내기", when: { twoStrike: true, secondary: true }, effects: { twoStrikeQualityBonus: 3, whiffBonus: 0.03 } },
  { id: "evo_bm_whiff_angle", coreTagId: "core_breaking_maestro", name: "헛스윙각", icon: "bolt", role: "risk", condition: "변화구 유인", effectText: "헛스윙↑, 실투 시 장타↑", operation: "과감한 변화구 승부", when: { secondary: true }, effects: { whiffBonus: 0.04, mistakeHomerunRisk: 2 } },
  { id: "evo_bm_speed_illusion", coreTagId: "core_breaking_maestro", name: "속도착시", icon: "cycle", role: "synergy", condition: "변화구 성공 후 강속구", effectText: "다음 강속구 속임↑", operation: "느린 뒤 빠른 공으로 교란", when: { afterSecondary: true, fast: true }, effects: { fastQualityBonus: 2, mixSuspicionBonus: 1 } },
  { id: "evo_fc_decide_imprint", coreTagId: "core_finisher_collector", name: "결정각인", icon: "bolt", role: "canonical", condition: "2스트 결정구", effectText: "최고 레벨 구종 위력↑", operation: "2스트에서 최고 구종으로", when: { twoStrike: true }, effects: { twoStrikeQualityBonus: 4, twoStrikeContactPenalty: 0.04 } },
  { id: "evo_fc_final_gamble", coreTagId: "core_finisher_collector", name: "끝장승부", icon: "bolt", role: "risk", condition: "2스트", effectText: "헛스윙↑, 실패 시 위험↑", operation: "한 방에 끝내기", when: { twoStrike: true }, effects: { whiffBonus: 0.04, twoStrikeContactPenalty: 0.02, mistakeHomerunRisk: 2 } },
  { id: "evo_fc_burden_care", coreTagId: "core_finisher_collector", name: "부담관리", icon: "shield", role: "burden", condition: "2스트 결정구", effectText: "부담도 증가량↓", operation: "결정구를 아껴 쓰기", when: { twoStrike: true }, effects: { twoStrikeQualityBonus: 1 } },
  { id: "evo_fc_closer_sense", coreTagId: "core_finisher_collector", name: "마무리감", icon: "scales", role: "operation", condition: "2스트", effectText: "제구 안정, 삼진 보상↑", operation: "차분히 삼진 잡기", when: { twoStrike: true }, effects: { twoStrikeQualityBonus: 2, strikeControlBonus: 2 } },
  { id: "evo_fc_boss_killer", coreTagId: "core_finisher_collector", name: "보스킬러", icon: "bolt", role: "stage", condition: "보스 상대 2스트", effectText: "결정구 효과↑", operation: "보스에게 결정구 집중", when: { twoStrike: true, boss: true }, effects: { twoStrikeQualityBonus: 3, twoStrikeContactPenalty: 0.05 } },
  { id: "evo_ga_low_drive", coreTagId: "core_groundball_architect", name: "낮게깔기", icon: "target", role: "canonical", condition: "낮은 코스", effectText: "제구↑, 땅볼↑", operation: "낮게 깔아 약타 유도", when: { lowCourse: true }, effects: { lowZoneControlBonus: 3, groundballBonus: 0.06 } },
  { id: "evo_ga_dp_route", coreTagId: "core_groundball_architect", name: "병살루트", icon: "shield", role: "operation", condition: "1루 주자 + 낮은 공", effectText: "병살 확률↑", operation: "주자 있을 때 병살 노리기", when: { lowCourse: true, runnerFirst: true }, effects: { groundballBonus: 0.08, doublePlayBonus: 0.06 } },
  { id: "evo_ga_hr_block", coreTagId: "core_groundball_architect", name: "장타봉쇄", icon: "shield", role: "weakness", condition: "낮은 코스", effectText: "장타 위험↓", operation: "실점 억제형 땅볼", when: { lowCourse: true }, effects: { lowContactQualityPenalty: 3, groundballBonus: 0.04 } },
  { id: "evo_ga_ground_pull", coreTagId: "core_groundball_architect", name: "지면유도", icon: "target", role: "canonical", condition: "낮은 공 컨택", effectText: "타구각↓", operation: "땅볼 각도 강화", when: { lowCourse: true }, effects: { groundballBonus: 0.05, lowContactQualityPenalty: 2 } },
  { id: "evo_ga_infield_bind", coreTagId: "core_groundball_architect", name: "내야묶기", icon: "shield", role: "operation", condition: "주자 있을 때 낮은 공", effectText: "약타↑", operation: "내야 수비로 묶기", when: { lowCourse: true, runners: true }, effects: { groundballBonus: 0.05, brushContactPenalty: 2 } },
  { id: "evo_cs_center_dodge", coreTagId: "core_cutter_softcontact", name: "중심회피", icon: "shield", role: "canonical", condition: "컨택 시", effectText: "타구 품질↓", operation: "정타를 약타로", effects: { brushContactPenalty: 3, lowContactQualityPenalty: 2 } },
  { id: "evo_cs_body_bite", coreTagId: "core_cutter_softcontact", name: "먹힌타구", icon: "target", role: "synergy", condition: "몸쪽 커터·투심", effectText: "약타↑", operation: "몸쪽으로 깎아내기", when: { inside: true }, effects: { brushContactPenalty: 3, insideControlBonus: 2 } },
  { id: "evo_cs_foul_guide", coreTagId: "core_cutter_softcontact", name: "파울유도", icon: "cycle", role: "operation", condition: "2스트 이전", effectText: "파울↑, 투구 수↑ 가능", operation: "파울로 카운트 끌기", when: { beforeTwoStrike: true }, effects: { whiffBonus: 0.02, strikeControlBonus: 1 } },
  { id: "evo_cs_bat_tip", coreTagId: "core_cutter_softcontact", name: "배트끝", icon: "target", role: "weakness", condition: "바깥쪽 컨택", effectText: "약한 타구↑", operation: "바깥 코너로 끝 묶기", when: { outside: true }, effects: { brushContactPenalty: 2, outsideControlBonus: 2 } },
  { id: "evo_cs_hr_cut", coreTagId: "core_cutter_softcontact", name: "장타차단", icon: "shield", role: "weakness", condition: "정타 상황", effectText: "정타↓, 헛스윙 보너스 낮음", operation: "장타만 막는 보수 운영", effects: { contactQuality: -3, brushContactPenalty: 2 } },
  { id: "evo_ca_corner_lock", coreTagId: "core_corner_artist", name: "코너잠금", icon: "target", role: "canonical", condition: "존 가장자리", effectText: "스트 의도 제구↑", operation: "코너에 박아 넣기", when: { edge: true, strike: true }, effects: { strikeControlBonus: 3, outsideControlBonus: 2 } },
  { id: "evo_ca_looking_bait", coreTagId: "core_corner_artist", name: "루킹유도", icon: "hook", role: "psych", condition: "코너 스트 성공", effectText: "루킹↑", operation: "코너에서 루킹 삼진", when: { edge: true }, effects: { whiffBonus: 0.03, outsideControlBonus: 2 } },
  { id: "evo_ca_walk_block", coreTagId: "core_corner_artist", name: "볼넷차단", icon: "scales", role: "weakness", condition: "3볼 이후", effectText: "스트 제구↑, 볼넷↓", operation: "볼넷 위험 줄이기", when: { behindCount: true }, effects: { strikeControlBonus: 3, fullCountWalkReduce: 1 } },
  { id: "evo_ca_outside_fight", coreTagId: "core_corner_artist", name: "바깥승부", icon: "target", role: "operation", condition: "바깥 스트", effectText: "바깥 제구↑", operation: "바깥 코너 승부", when: { outside: true, strike: true }, effects: { outsideControlBonus: 4 } },
  { id: "evo_ca_zone_manage", coreTagId: "core_corner_artist", name: "존관리", icon: "scales", role: "burden", condition: "연속 볼 후", effectText: "스트 제구 회복", operation: "장기전 존 관리", when: { behindCount: true }, effects: { strikeControlBonus: 2, fullCountControlBonus: 2 } },
  { id: "evo_fp_first_edge", coreTagId: "core_first_pitch_pressure", name: "초구선점", icon: "target", role: "canonical", condition: "0-0", effectText: "스트 의도 제구↑", operation: "첫 공부터 스트라이크", when: { firstPitch: true }, effects: { firstPitchControlBonus: 4, firstPitchQualityBonus: 3 } },
  { id: "evo_fp_open_push", coreTagId: "core_first_pitch_pressure", name: "첫공압박", icon: "bolt", role: "synergy", condition: "초구 스트 성공", effectText: "다음 공 속임↑", operation: "초구 성공 후 이어치기", when: { afterFirstStrike: true }, effects: { mixSuspicionBonus: 1, secondaryQualityBonus: 1 } },
  { id: "evo_fp_first_bait", coreTagId: "core_first_pitch_pressure", name: "초구미끼", icon: "hook", role: "psych", condition: "초구 볼 후 스트", effectText: "속임↑", operation: "볼 보여주고 스트", when: { ballIntentSwitch: true }, effects: { chaseBonus: 0.02, strikeControlBonus: 2 } },
  { id: "evo_fp_preempt", coreTagId: "core_first_pitch_pressure", name: "선제공략", icon: "cycle", role: "operation", condition: "초구 스트", effectText: "타자 의심↑", operation: "초구로 심리 선점", when: { firstPitch: true, strike: true }, effects: { mixSuspicionBonus: 1, firstPitchQualityBonus: 2 } },
  { id: "evo_fp_fast_count", coreTagId: "core_first_pitch_pressure", name: "빠른카운트", icon: "shield", role: "burden", condition: "0-1 이후", effectText: "부담 증가↓", operation: "빠르게 카운트 진행", when: { aheadEarly: true }, effects: { evenCountQualityBonus: 1 } },
  { id: "evo_bd_chase_up", coreTagId: "core_bait_designer", name: "유인강화", icon: "hook", role: "canonical", condition: "존 밖 근처", effectText: "유인 스윙↑", operation: "볼 근처로 끌어내기", when: { chaseZone: true }, effects: { chaseBonus: 0.04, whiffBonus: 0.02 } },
  { id: "evo_bd_bait_recall", coreTagId: "core_bait_designer", name: "미끼회수", icon: "cycle", role: "synergy", condition: "볼 후 스트", effectText: "속임↑", operation: "미끼 후 회수", when: { ballIntentSwitch: true }, effects: { mixSuspicionBonus: 1, strikeControlBonus: 2 } },
  { id: "evo_bd_walk_care", coreTagId: "core_bait_designer", name: "볼넷관리", icon: "scales", role: "weakness", condition: "유인 실패 후", effectText: "다음 스트 제구↑", operation: "볼넷 막기", when: { behindCount: true }, effects: { strikeControlBonus: 2, fullCountWalkReduce: 1 } },
  { id: "evo_bd_whiff_trap", coreTagId: "core_bait_designer", name: "헛스윙덫", icon: "hook", role: "risk", condition: "유인구", effectText: "헛스윙↑, 3볼↓", operation: "과감한 유인", when: { chaseZone: true }, effects: { chaseBonus: 0.05, whiffBonus: 0.03 } },
  { id: "evo_bd_eye_lead", coreTagId: "core_bait_designer", name: "시선유도", icon: "cycle", role: "psych", condition: "보여주기 볼 후", effectText: "반대 코스 속임↑", operation: "시선 끌고 반대로", when: { ballIntentSwitch: true }, effects: { mixSuspicionBonus: 2, chaseBonus: 0.02 } },
  { id: "evo_cp_read_break", coreTagId: "core_counter_pitcher", name: "노림파괴", icon: "target", role: "canonical", condition: "역노림 성공", effectText: "타구 품질↓", operation: "읽힘 역이용", when: { counterPitch: true }, effects: { counterContactPenalty: 5, mixSuspicionBonus: 1 } },
  { id: "evo_cp_reverse_flow", coreTagId: "core_counter_pitcher", name: "역류승부", icon: "cycle", role: "psych", condition: "의심 60+", effectText: "다른 계열 속임↑", operation: "고의심 역공", when: { highSuspicion: true, categorySwitch: true }, effects: { mixSuspicionBonus: 2, secondaryQualityBonus: 2 } },
  { id: "evo_cp_pattern_cut", coreTagId: "core_counter_pitcher", name: "패턴절단", icon: "shield", role: "weakness", condition: "패턴 노출 후", effectText: "의심 상승 완화", operation: "패턴 끊고 안정", when: { categorySwitch: true }, effects: { mixSuspicionBonus: 1 } },
  { id: "evo_cp_false_seed", coreTagId: "core_counter_pitcher", name: "허상심기", icon: "hook", role: "synergy", condition: "거짓 단서 후", effectText: "다음 공 속임↑", operation: "허상으로 흔들기", when: { afterFalseClue: true }, effects: { mixSuspicionBonus: 2, chaseBonus: 0.02 } },
  { id: "evo_cp_read_counter", coreTagId: "core_counter_pitcher", name: "읽힘역공", icon: "bolt", role: "risk", condition: "패턴 노출 역계열", effectText: "성공 시 큰 보너스", operation: "읽혔을 때 역공", when: { counterPitch: true, patternExposed: true }, effects: { counterContactPenalty: 6, whiffBonus: 0.03 } },
  { id: "evo_cl_crisis_block", coreTagId: "core_clutch_pitcher", name: "위기봉쇄", icon: "shield", role: "canonical", condition: "득점권", effectText: "실투↓", operation: "득점권에서 버티기", when: { scoring: true }, effects: { pressureReduce: 5, strikeControlBonus: 2 } },
  { id: "evo_cl_full_gamble", coreTagId: "core_clutch_pitcher", name: "승부수", icon: "scales", role: "operation", condition: "3-2 풀카운트", effectText: "스트 제구↑, 볼넷↓", operation: "도망가지 않는 존 승부", when: { fullCount: true, strike: true }, effects: { fullCountControlBonus: 4, fullCountWalkReduce: 2 } },
  { id: "evo_cl_clutch_engine", coreTagId: "core_clutch_pitcher", name: "클러치엔진", icon: "bolt", role: "risk", condition: "주자 + 결정구", effectText: "결정구↑, 실패 시 부담↑", operation: "위기에서 한 방", when: { runners: true, twoStrike: true }, effects: { twoStrikeQualityBonus: 3, pressureReduce: 3 } },
  { id: "evo_cl_runner_bind", coreTagId: "core_clutch_pitcher", name: "주자묶기", icon: "shield", role: "weakness", condition: "주자 있음", effectText: "장타 위험↓", operation: "주자 묶는 보수 운영", when: { runners: true }, effects: { pressureReduce: 3, lowContactQualityPenalty: 2 } },
  { id: "evo_cl_mental_reset", coreTagId: "core_clutch_pitcher", name: "멘탈회복", icon: "scales", role: "burden", condition: "실점 직후", effectText: "제구 흔들림 완화", operation: "실점 후 바로 회복", when: { afterRun: true }, effects: { pressureReduce: 4, strikeControlBonus: 2 } },
  { id: "evo_gm_tempo", coreTagId: "core_game_manager", name: "운영템포", icon: "scales", role: "canonical", condition: "동점 카운트", effectText: "구위·제구 소폭↑", operation: "동점에서 리듬 유지", when: { evenCount: true }, effects: { evenCountQualityBonus: 3, strikeControlBonus: 1 } },
  { id: "evo_gm_flow_switch", coreTagId: "core_game_manager", name: "흐름전환", icon: "cycle", role: "psych", condition: "직전과 다른 계열", effectText: "속임↑", operation: "반복 패턴 끊기", when: { categorySwitch: true }, effects: { mixSuspicionBonus: 2, secondaryQualityBonus: 1, whiffBonus: 0.02 } },
  { id: "evo_gm_inning_care", coreTagId: "core_game_manager", name: "이닝관리", icon: "shield", role: "burden", condition: "이닝 종료", effectText: "부담 회복↑", operation: "이닝마다 체력 분배", effects: { evenCountQualityBonus: 1 } },
  { id: "evo_gm_count_design", coreTagId: "core_game_manager", name: "카운트설계", icon: "target", role: "operation", condition: "1-1, 2-2", effectText: "카운터 효과↑", operation: "중립 카운트 설계", when: { evenCount: true }, effects: { evenCountQualityBonus: 2, mixSuspicionBonus: 1 } },
  { id: "evo_gm_stamina_split", coreTagId: "core_game_manager", name: "체력분배", icon: "shield", role: "burden", condition: "미사용 구종", effectText: "부담 회복↑", operation: "구종 로테이션", effects: { evenCountQualityBonus: 1, pressureReduce: 2 } },
  { id: "evo_tm_tempo_burst", coreTagId: "core_tempo_master", name: "완급폭발", icon: "bolt", role: "canonical", condition: "강속↔느린 교차", effectText: "교차 효과↑", operation: "속도 차로 흔들기", when: { categorySwitch: true }, effects: { whiffBonus: 0.03, secondaryQualityBonus: 2 } },
  { id: "evo_tm_timing_cut", coreTagId: "core_tempo_master", name: "타이밍절단", icon: "target", role: "synergy", condition: "타이밍 교란", effectText: "컨택 품질↓", operation: "타이밍 뺏기", when: { categorySwitch: true }, effects: { whiffBonus: 0.02, contactQuality: -3 } },
  { id: "evo_tm_seq_press", coreTagId: "core_tempo_master", name: "시퀀스압박", icon: "cycle", role: "mastery", condition: "3구 내 계열 혼합", effectText: "의심 완화·속임↑", operation: "짧은 시퀀스 압박", when: { categorySwitch: true }, effects: { mixSuspicionBonus: 1, whiffBonus: 0.02 } },
  { id: "evo_tm_speed_gap", coreTagId: "core_tempo_master", name: "속도낙차", icon: "bolt", role: "canonical", condition: "속도 차 클 때", effectText: "타이밍 교란↑", operation: "낙차 극대화", when: { categorySwitch: true }, effects: { secondaryQualityBonus: 2, whiffBonus: 0.03 } },
  { id: "evo_tm_slow_bait", coreTagId: "core_tempo_master", name: "완급미끼", icon: "hook", role: "psych", condition: "느린공 후 강속구", effectText: "헛스윙↑", operation: "느린 뒤 빠른 공", when: { afterSecondary: true, fast: true }, effects: { whiffBonus: 0.04, fastQualityBonus: 1 } }
];

MP.batterTagCatalog = [
  {
    id: "fast_killer",
    name: "빠른공 킬러",
    description: "강속구 계열에 배트가 빨리 나옵니다.",
    slotBoost: "middle",
    bossWeight: 2,
    weight: 1.2
  },
  {
    id: "breaking_weak",
    name: "변화구 약점",
    description: "변화구·느린공 타이밍을 자주 뺏깁니다.",
    slotBoost: "bottom",
    weight: 1.1
  },
  {
    id: "inside_weak",
    name: "몸쪽 약함",
    description: "몸쪽 스트라이크에 타이밍이 흔들립니다.",
    slotBoost: "bottom",
    weight: 1
  },
  {
    id: "inside_punish",
    name: "몸쪽 응징",
    description: "몸쪽 실투를 강하게 받아칩니다.",
    slotBoost: "middle",
    bossWeight: 2,
    weight: 1
  },
  {
    id: "outside_chase_foul",
    name: "바깥쪽 추격",
    description: "바깥 공을 파울로 막아냅니다.",
    slotBoost: "top",
    weight: 1
  },
  {
    id: "low_ball_grounder",
    name: "골퍼",
    description: "낮은 공도 땅볼로 살려냅니다.",
    slotBoost: "bottom",
    weight: 1.1
  },
  {
    id: "high_fast_vulnerable",
    name: "높은 공 취약",
    description: "높은 직구에 배트가 뜨기 쉽습니다.",
    slotBoost: "middle",
    weight: 1
  },
  {
    id: "full_count_heart",
    name: "풀카운트 강심장",
    description: "풀카운트에서 승부를 고릅니다.",
    slotBoost: "top",
    bossWeight: 1.5,
    weight: 0.9
  },
  {
    id: "texas_luck",
    name: "약타 생산",
    description: "완전히 속아도 약한 안타가 나올 수 있습니다.",
    slotBoost: "power",
    weight: 0.8
  },
  {
    id: "dp_risk",
    name: "병살 위험",
    description: "낮은 땅볼이 병살 코스로 흐르기 쉽습니다.",
    slotBoost: "power",
    weight: 0.85
  },
  {
    id: "offspeed_patience",
    name: "느린공 참기",
    description: "느린 공 계열 유인구에 잘 속지 않습니다.",
    slotBoost: "top",
    weight: 1
  }
];

MP.firstNames = ["강", "한", "민", "유", "백", "서", "오", "문", "차", "주", "나", "윤"];
MP.lastNames = ["도윤", "지훈", "태오", "준서", "현우", "시온", "민재", "건우", "로한", "하준", "이준", "우진"];

MP.catcherTypes = [
  { id: "safe", label: "안정형 포수", tone: "실점 억제형", countBias: "edge", trust: 0.72 },
  { id: "attack", label: "공격형 포수", tone: "삼진 유도형", countBias: "chase", trust: 0.58 },
  { id: "analysis", label: "분석형 포수", tone: "노림수 추론형", countBias: "counter", trust: 0.82 },
  { id: "guts", label: "배짱형 포수", tone: "위기 승부형", countBias: "challenge", trust: 0.5 }
];

MP.batterMindTypes = [
  { id: "honest", label: "정직형", hint: "정직스윙", reliability: 0.86, fakeRate: 0.04, patternLearn: 0.92 },
  { id: "tricky", label: "교활형", hint: "포커형", reliability: 0.42, fakeRate: 0.2, patternLearn: 1.08 },
  { id: "adaptive", label: "적응형", hint: "패턴형", reliability: 0.62, fakeRate: 0.1, patternLearn: 1.26 },
  { id: "gambler", label: "도박형", hint: "한방형", reliability: 0.54, fakeRate: 0.16, patternLearn: 0.82 }
];

MP.hiddenTendencies = [
  { id: "firstPitchAggro", label: "초구 적극", approach: "초구", swing: 0.12 },
  { id: "firstPitchWatch", label: "초구 관찰", approach: "신중", chase: -0.1, firstPitchSwing: -0.06 },
  { id: "twoStrike", label: "인내형", approach: "보호", foul: 0.1 },
  { id: "walkHunter", label: "안구형", approach: "신중", chase: -0.08 },
  { id: "slugger", label: "응징형", approach: "적극", power: 8 },
  { id: "reactive", label: "즉응형", approach: "균형", pattern: 0.12 }
];

MP.memoryGrades = [
  { id: "low", label: "낮음", span: 1, suspicion: -5 },
  { id: "normal", label: "보통", span: 3, suspicion: 0 },
  { id: "high", label: "높음", span: 8, suspicion: 8 },
  { id: "genius", label: "천재형", span: 18, suspicion: 16 }
];

MP.bossGimmicks = [
  { id: "sluggerKing", label: "홈런왕", text: "실투 시 홈런 위험 극대화" },
  { id: "cutMaster", label: "커트장인", text: "불리한 카운트에서 파울 확률 상승" },
  { id: "geniusEye", label: "천재타자", text: "패턴 기억력과 역노림 상승" },
  { id: "walkMonster", label: "눈야구", text: "볼 유도에 강함" },
  { id: "clutch", label: "클러치", text: "주자 있을 때 강화" }
];

MP.ballIntentPlans = {
  fishing: { label: "낚시 볼", text: "헛스윙을 유도합니다.", swing: 0.08, next: "다음 공 반응 단서 확보" },
  show: { label: "보여주기 볼", text: "다음 공 체감 변화를 키웁니다.", quality: 2, next: "완급 보정" },
  waste: { label: "버리는 볼", text: "타자 반응을 확인합니다.", read: 0.22, next: "노림수 정보" },
  brush: { label: "위협구", text: "몸쪽 의식을 심습니다.", contactQuality: -4, next: "몸쪽 의식 유도" }
};

MP.pitchBurdenConfig = {
  max: 100,
  tiers: [
    { id: "stable", min: 0, max: 24, label: "안정", command: 0, mistake: 0, homerun: 0, whiff: 0 },
    { id: "load", min: 25, max: 49, label: "부담", command: 2, mistake: 0.01, homerun: 0, whiff: 0 },
    { id: "overload", min: 50, max: 74, label: "과부하", command: 5, mistake: 0.04, homerun: 0.02, whiff: -0.02 },
    { id: "limit", min: 75, max: 100, label: "한계", command: 8, mistake: 0.07, homerun: 0.05, whiff: -0.04 }
  ],
  useBase: 4,
  repeat2: 8,
  repeat3: 14,
  repeat4: 20,
  twoStrike: 4,
  fullCount: 5,
  vsBoss: 3,
  highBurdenExtra: 6,
  highBurdenThreshold: 70,
  recoverOther: 6,
  recoverAtBat: 5,
  recoverInning: 12,
  recoverStage: 25
};

MP.pitchMasteryConfig = {
  stageMax: 100,
  baseScores: {
    calledStrike: 2,
    swingingStrike: 2,
    lookingStrike: 4,
    whiff: 6,
    foul: 3,
    weakOut: 7,
    inPlayOut: 6,
    strikeoutFinish: 10,
    doublePlay: 14,
    bossOutBonus: 8,
    bossStrikeoutBonus: 12
  },
  countMult: {
    "0-0": 1,
    "0-1": 1.05,
    "1-0": 1.05,
    "1-1": 1.05,
    "0-2": 1.1,
    "1-2": 1.15,
    "2-2": 1.25,
    "2-0": 1.3,
    "3-0": 1.4,
    "3-1": 1.35,
    "3-2": 1.45
  },
  runnerMult: { none: 1, first: 1.08, scoring: 1.2, loaded: 1.35, twoOutScoring: 1.3 },
  batterMult: { bottom: 0.9, normal: 1, middle: 1.15, boss: 1.35, finalBoss: 1.5 },
  repeatGain: { 1: 1, 2: 0.8, 3: 0.55, 4: 0.3 },
  burdenGainRate: { stable: 1, load: 0.9, overload: 0.7, limit: 0.45 },
  masteryWeight: [
    { min: 0, max: 19, mult: 1 },
    { min: 20, max: 39, mult: 1.4 },
    { min: 40, max: 59, mult: 1.9 },
    { min: 60, max: 79, mult: 2.6 },
    { min: 80, max: 100, mult: 3.5 }
  ],
  levelWeightDecay: { 3: 0.65, 4: 0.45, 5: 0.3 },
  upgradeMasteryGate: { 4: 40, 5: 70 },
  flowLabels: [
    { min: 0, max: 19, label: "낮음" },
    { min: 20, max: 39, label: "상승" },
    { min: 40, max: 59, label: "좋음" },
    { min: 60, max: 79, label: "강함" },
    { min: 80, max: 100, label: "폭발" }
  ],
  failPenalty: { ball: 1, walk: 8, hit: 4, double: 8, homerun: 15, counterHit: 10, spamHit: 12 },
  comboFastToSlow: 8,
  psychCounter: 8,
  psychCounterHigh: 10
};

MP.pitchLevelNames = {
  four: ["", "존 압박", "하이패스트볼", "직구가 만든 그림자", "에이스 패스트볼"],
  two: ["", "스트라이크 안정", "먹힌 타구", "더블플레이 루트", "땅볼 머신"],
  sinker: ["", "낮게 깔기", "땅볼 유도", "병살 설계", "가라앉는 승부구"],
  slider: ["", "바깥 제구", "헛스윙 유도", "백도어 감각", "마무리 슬라이더"],
  curve: ["", "낙차 안정", "눈높이 흔들기", "카운트 훔치기", "느린 낙차"],
  change: ["", "완급 안정", "타이밍 파괴", "느린 척 빠른 승부", "완급 지배"],
  cutter: ["", "손끝 제구", "빗맞힘", "파울 유도", "배트 브레이커"],
  splitter: ["", "낮은 존 감각", "헛스윙 낙차", "땅볼 낙차", "사라지는 공"]
};

MP.courseZones = {
  1: { row: 0, col: 0, label: "1번 높은 몸쪽" },
  2: { row: 0, col: 1, label: "2번 높은 중앙" },
  3: { row: 0, col: 2, label: "3번 높은 바깥쪽" },
  4: { row: 1, col: 0, label: "4번 가운데 몸쪽" },
  5: { row: 1, col: 1, label: "5번 정중앙" },
  6: { row: 1, col: 2, label: "6번 가운데 바깥쪽" },
  7: { row: 2, col: 0, label: "7번 낮은 몸쪽" },
  8: { row: 2, col: 1, label: "8번 낮은 중앙" },
  9: { row: 2, col: 2, label: "9번 낮은 바깥쪽" }
};

})(window.MountPsycho);
