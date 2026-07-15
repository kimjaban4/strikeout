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
    note: "존 안을 밀어붙이는 기본 빠른 공"
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
    note: "낮게 들어가면 먹힌 타구 유도"
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
    note: "주자가 있을 때 병살 흐름 유도"
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
    note: "배트 끝을 끌어내는 변화구"
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
    note: "빠른 공 뒤 타이밍 교란"
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
    note: "빠른 공을 기다리는 타자 흔들기"
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
    note: "낮게 떨어지면 삼진, 몰리면 위험"
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
    note: "배트 중심을 비껴가는 빠른 공"
  }
];

MP.categoryNames = {
  fast: "강속구",
  breaking: "변화구",
  offspeed: "느린공"
};

MP.stageInnings = [3, 3, 3];
MP.RELEASE_TIMING_SPEED = 0.8;
MP.RELEASE_TIMING_ZONE_SCALE = 0.8;

MP.stageConfigs = [
  {
    id: "rookie_lineup",
    name: "루키타선",
    innings: 3,
    clearRuns: 3,
    stableRuns: 1,
    perfectRuns: 0,
    themeText: "아직 배합을 넓게 가져갈 수 있는 초반 타선입니다. 반복 패턴만 조심하세요.",
    starNames: ["버텨낸 경기", "안정적인 운영", "무실점 루키타선 제압"],
    missions: [
      { id: "s1_i1_first_strike", inning: 1, title: "초구 스트라이크 1회 이상", type: "firstPitchStrikesAtLeast", threshold: 1 },
      { id: "s1_i2_no_walk", inning: 2, title: "볼넷 없이 이닝 종료", type: "noWalk" },
      { id: "s1_i3_low_suspicion", inning: 3, title: "간파도 60% 이하 유지", type: "suspicionEndBelow", threshold: 60 }
    ],
    rival: {
      name: "주시온",
      slot: 1,
      role: "출루형 / 몸쪽 반응 / 선구안 보통",
      goalText: "장타를 막으세요. 실투와 반복 패턴이 가장 위험합니다.",
      rewardText: "보상 카드 선택지 +1",
      reward: { choiceBonus: 1 }
    }
  },
  {
    id: "analysis_lineup",
    name: "분석타선",
    innings: 3,
    clearRuns: 4,
    stableRuns: 2,
    perfectRuns: 1,
    perfectExtras: ["같은 구종 3연속 사용 없음", "간파도 평균 55% 이하"],
    themeText: "같은 공과 같은 코스를 빠르게 기억합니다. 성공한 패턴도 반복하면 바로 읽힙니다.",
    starNames: ["분석타선 돌파", "패턴 관리 성공", "노림수 역이용 경기"],
    missions: [
      { id: "s2_i1_first_strike", inning: 1, title: "초구 스트라이크 2회 이상", type: "firstPitchStrikesAtLeast", threshold: 2 },
      { id: "s2_i2_no_three_pitch", inning: 2, title: "같은 구종 3연속 금지", type: "maxPitchStreakBelow", threshold: 3 },
      { id: "s2_i3_weakness_choice", inning: 3, title: "약점 태그 찌르기 1회", type: "weaknessChoiceAtLeast", threshold: 1 }
    ],
    rival: {
      name: "한도윤",
      slot: 3,
      role: "분석형 / 같은 구종 적응 / 바깥쪽 코스 예측",
      goalText: "같은 구종을 두 번 이상 보여주지 마세요. 이 타자는 반복을 빠르게 기억합니다.",
      rewardText: "희귀 카드 1장 추가 보장",
      reward: { guaranteedRare: 1 }
    }
  },
  {
    id: "championship_lineup",
    name: "챔피언십타선",
    innings: 3,
    clearRuns: 5,
    stableRuns: 3,
    perfectRuns: 2,
    perfectExtras: ["라이벌 장타 허용 없음", "간파도 평균 60% 이하"],
    themeText: "강한 타자들이 실투와 반복을 놓치지 않습니다. 인상을 심고, 다음 공에서 배신해야 합니다.",
    starNames: ["최종전 생존", "우승권 운영", "완벽한 마운드 지배"],
    missions: [
      { id: "s3_i1_no_center_long", inning: 1, title: "중심 타선 장타 금지", type: "noCenterLongHit" },
      { id: "s3_i2_no_walk", inning: 2, title: "볼넷 없이 이닝 종료", type: "noWalk" },
      { id: "s3_i3_no_scoring_run", inning: 3, title: "득점권 상황 실점 금지", type: "noScoringPositionRun" }
    ],
    rival: {
      name: "강태오",
      slot: 4,
      role: "해결사 / 장타형 / 득점권 강함 / 위험 구종 노림",
      goalText: "장타를 막고 출루도 1번 이하로 묶으세요. 코스보다 흐름 관리가 중요합니다.",
      rewardText: "핵심 카드 선택지 +1",
      reward: { coreChoiceBonus: 1 }
    }
  }
];

MP.stageRunLimits = [4, 5, 6];

MP.rivalPsychPatterns = {
  leadoffProbe: {
    id: "leadoffProbe",
    microRead: "선구 모드",
    memoryBonus: 1,
    firstPitchTake: 0.06,
    ballPatience: 0.04
  },
  patternReader: {
    id: "patternReader",
    microRead: "패턴 대기",
    memoryBonus: 2,
    repeatSuspicionBonus: 3,
    exposedContactBonus: 0.04
  },
  clutchSlugger: {
    id: "clutchSlugger",
    microRead: "장타 노림",
    memoryBonus: 1,
    targetQualityBonus: 5,
    mistakeQualityBonus: 8
  }
};

MP.batterWeaknessCatalog = [
  {
    id: "weak_low_breaking",
    name: "낮은 변화구 취약",
    category: "pitchType",
    description: "몸이 먼저 나가 낮은 변화구에 따라붙습니다. 빠른 공 인상을 먼저 심으면 더 잘 속습니다.",
    triggerCondition: "낮은 존 + 변화구 계열",
    effectText: "낮은 변화구에 배트가 따라 나옵니다.",
    recommendedPitchTypes: ["slider", "curve", "splitter"],
    recommendedZones: ["low"],
    effects: { swing: 0.06, contact: -0.1 }
  },
  {
    id: "weak_first_pitch_hasty",
    name: "첫 공 과반응",
    category: "count",
    description: "첫 공부터 배트가 빨리 나옵니다. 초구를 존 끝에 붙이면 흐름을 가져올 수 있습니다.",
    triggerCondition: "0-0 카운트",
    effectText: "초구 코너워크가 잘 먹힙니다.",
    recommendedPitchTypes: ["four", "cutter", "curve"],
    recommendedZones: ["edge", "high"],
    effects: { firstPitchSwing: 0.1, contactQuality: -4 }
  },
  {
    id: "weak_inside",
    name: "몸쪽 경직",
    category: "zone",
    description: "몸쪽 공 이후 시야가 좁아지고 반응이 굳습니다.",
    triggerCondition: "몸쪽 코스 제구 성공",
    effectText: "몸쪽 성공 시 정타가 줄어듭니다.",
    recommendedPitchTypes: ["two", "cutter", "four"],
    recommendedZones: ["inside"],
    effects: { contact: -0.06, contactQuality: -6 }
  },
  {
    id: "weak_outer_reach",
    name: "바깥쪽 팔 뻗음",
    category: "zone",
    description: "바깥쪽 공에 팔이 멀리 나옵니다. 코너에 붙이면 파울이나 약한 타구를 만들기 좋습니다.",
    triggerCondition: "바깥쪽 코스",
    effectText: "바깥쪽 코너에서 파울과 약타가 늘어납니다.",
    recommendedPitchTypes: ["slider", "change", "four"],
    recommendedZones: ["outside"],
    effects: { foul: 0.07, contactQuality: -5 }
  },
  {
    id: "weak_after_two_strike",
    name: "보호 스윙 과잉",
    category: "count",
    description: "삼진을 피하려다 낮은 변화구에 배트가 따라 나옵니다.",
    triggerCondition: "2스트라이크 + 변화구",
    effectText: "2스트 이후 낮은 변화구가 잘 먹힙니다.",
    recommendedPitchTypes: ["slider", "curve", "splitter"],
    recommendedZones: ["low", "outside"],
    effects: { twoStrikeSwing: 0.08, contact: -0.12 }
  },
  {
    id: "weak_scoring_pressure",
    name: "득점권 과반응",
    category: "psychology",
    description: "주자가 득점권에 있으면 빠르게 해결하려는 스윙이 늘어납니다.",
    triggerCondition: "주자 2루 또는 3루",
    effectText: "득점권에서 유인 반응이 늘어납니다.",
    recommendedPitchTypes: ["change", "slider", "splitter"],
    recommendedZones: ["low", "outside"],
    effects: { scoringChase: 0.08, contactQuality: -4 }
  },
  {
    id: "weak_high_fast",
    name: "하이존 늦음",
    category: "pitchType",
    description: "배트가 아래에서 올라와 높은 빠른 공에 늦습니다.",
    triggerCondition: "높은 존 + 강속구",
    effectText: "높은 빠른 공에 반응이 늦습니다.",
    recommendedPitchTypes: ["four", "cutter"],
    recommendedZones: ["high"],
    effects: { swing: 0.05, contact: -0.09 }
  },
  {
    id: "weak_full_count",
    name: "풀카운트 코너 반응",
    category: "count",
    description: "3볼 2스트라이크에서 코너 스트라이크 반응이 늦습니다.",
    triggerCondition: "3볼 2스트라이크",
    effectText: "풀카운트 코너 승부에 반응이 늦습니다.",
    recommendedPitchTypes: ["four", "two", "slider"],
    recommendedZones: ["edge"],
    effects: { fullCountContact: -0.08, contactQuality: -4 }
  }
];

MP.rewardCardCatalog = [
  { id: "C001", rarity: "common", name: "포심으로 존 점유", type: ["구종 강화"], description: "포심으로 존 안을 밀어붙일 때 손끝이 더 안정됩니다.", triggerCondition: "포심 사용", effectText: "포심 제구가 증가합니다.", stackType: "stackable", maxStack: 3, synergyTags: ["포심"], effects: { fourControl: 5 } },
  { id: "C002", rarity: "common", name: "먹히는 투심", type: ["구종 강화"], description: "투심이 존 근처에 들어가면 배트 중심을 비껴 약한 땅볼을 만들기 쉬워집니다.", triggerCondition: "투심 제구 성공", effectText: "투심 땅볼 확률이 증가합니다.", stackType: "stackable", maxStack: 3, synergyTags: ["투심", "땅볼"], effects: { twoGroundball: 0.05 } },
  { id: "C003", rarity: "common", name: "슬라이더 감각 유지", type: ["노출 관리"], description: "슬라이더를 여러 번 써도 손끝 부담이 덜 쌓입니다.", triggerCondition: "슬라이더 사용", effectText: "슬라이더 부담도 증가량이 감소합니다.", stackType: "stackable", maxStack: 2, synergyTags: ["슬라이더"], effects: { sliderBurdenReduce: 10 } },
  { id: "C004", rarity: "common", name: "커브로 시선 끌기", type: ["심리전", "구종 강화"], description: "커브를 보여주면 타자의 시선이 느린 궤적에 묶입니다.", triggerCondition: "커브 사용 후 노스윙", effectText: "커브를 지켜보게 만들면 다음 빠른 공이 살아납니다.", stackType: "stackable", maxStack: 2, synergyTags: ["커브"], effects: { curveTakeSuspicion: -5 } },
  { id: "C005", rarity: "common", name: "직구 뒤 체인지업", type: ["구종 강화", "심리전"], description: "빠른 공을 보여준 뒤 체인지업을 던지면 타자의 판단이 늦습니다.", triggerCondition: "직구 계열 이후 체인지업", effectText: "직구 계열 이후 체인지업 성공률이 증가합니다.", stackType: "stackable", maxStack: 2, synergyTags: ["체인지업", "완급"], effects: { changeAfterFastQuality: 4 } },
  { id: "C015", rarity: "common", name: "같은 릴리스", type: ["심리전", "구종 운영"], description: "빠른 공과 같은 팔스윙에서 늦게 갈라지는 공의 효과가 좋아집니다.", triggerCondition: "빠른 공 이후 체인지업/스플리터/커터", effectText: "직구처럼 보인 공이 늦게 갈라지며 타이밍을 흔듭니다.", stackType: "stackable", maxStack: 2, synergyTags: ["완급", "릴리스"], effects: { sameRelease: 1 } },
  { id: "C006", rarity: "common", name: "낮게 사라지는 포크", type: ["구종 강화"], description: "낮게 떨어지는 스플리터가 배트 밑으로 사라집니다.", triggerCondition: "낮은 포크", effectText: "낮은 스플리터 헛스윙 확률이 증가합니다.", stackType: "stackable", maxStack: 2, synergyTags: ["포크"], effects: { splitterLowWhiff: 0.05 } },
  { id: "C007", rarity: "common", name: "플레이트 점유", type: ["코스 운영", "심리전"], description: "타석 첫 공을 존 끝에 붙여 타자가 플레이트를 편하게 쓰지 못하게 만듭니다.", triggerCondition: "타자별 첫 투구", effectText: "초구 스트라이크 성공 시 타자가 빠른 승부를 의식합니다.", stackType: "stackable", maxStack: 2, synergyTags: ["초구", "압박"], effects: { firstPitchControl: 5 } },
  { id: "C008", rarity: "common", name: "흔들림 억제", type: ["위기관리"], description: "3볼 이후에도 손끝을 붙잡아 볼넷 위험을 줄입니다.", triggerCondition: "3볼 카운트", effectText: "3볼 카운트 제구가 증가합니다.", stackType: "stackable", maxStack: 2, synergyTags: ["볼넷"], effects: { threeBallControl: 5 } },
  { id: "C009", rarity: "common", name: "낮게 깔기", type: ["코스 운영"], description: "낮은 존을 더 안정적으로 공략해 큰 타구를 줄입니다.", triggerCondition: "낮은 존 선택", effectText: "낮은 존 성공률이 증가합니다.", stackType: "stackable", maxStack: 2, synergyTags: ["낮은 코스"], effects: { lowZoneControl: 4 } },
  { id: "C010", rarity: "common", name: "몸쪽 의식", type: ["코스 운영"], description: "몸쪽 공을 성공시키면 타자의 몸과 시야가 굳습니다.", triggerCondition: "몸쪽 코스 제구 성공", effectText: "몸쪽 성공 시 약한 타구 확률이 증가합니다.", stackType: "stackable", maxStack: 2, synergyTags: ["몸쪽"], effects: { insideWeakContact: 5 } },
  { id: "C011", rarity: "common", name: "바깥쪽으로 멀어지게", type: ["코스 운영"], description: "바깥쪽 코스를 성공시키면 타자의 배트가 멀리 나옵니다.", triggerCondition: "바깥쪽 코스 제구 성공", effectText: "바깥쪽 성공 시 다음 몸쪽 승부가 숨습니다.", stackType: "stackable", maxStack: 2, synergyTags: ["바깥쪽"], effects: { outsideSuspicion: -5 } },
  { id: "C012", rarity: "common", name: "첫 이닝 흐름 잡기", type: ["심리전"], description: "스테이지 초반에는 배합을 넓게 가져가며 타자를 흔듭니다.", triggerCondition: "각 스테이지 1이닝", effectText: "각 스테이지 첫 이닝에는 반복 흐름이 조금 덜 읽힙니다.", stackType: "unique", synergyTags: ["운영"], effects: { firstInningSuspicionMult: 0.9 } },
  { id: "C013", rarity: "common", name: "이닝 미션 집중", type: ["보상 강화"], description: "이닝 미션을 달성하면 다음 선택지가 넓어집니다.", triggerCondition: "이닝 미션 성공", effectText: "이닝 미션 성공 시 보상 선택지가 증가합니다.", stackType: "limited", maxStack: 2, synergyTags: ["미션"], effects: { missionChoiceBonus: 1 } },
  { id: "C014", rarity: "common", name: "기본기 다지기", type: ["구종 강화"], description: "모든 구종의 손끝 감각이 조금 안정됩니다.", triggerCondition: "항상 적용", effectText: "모든 구종 제구가 조금 증가합니다.", stackType: "stackable", maxStack: 3, synergyTags: ["기본기"], effects: { allControl: 2 } },
  { id: "C016", rarity: "common", name: "초구 설계", type: ["초구", "심리전"], description: "타석 첫 공으로 의식이나 카운트 주도권을 잡습니다.", triggerCondition: "타자별 첫 투구", effectText: "초구 제구와 초구 설계 성과가 좋아집니다.", stackType: "stackable", maxStack: 2, synergyTags: ["초구", "운영"], effects: { firstPitchControl: 3, firstPitchPlan: 1 } },
  { id: "C017", rarity: "common", name: "타이밍 체크", type: ["분석", "심리전"], description: "앞/뒤 타이밍 반응을 보고 다음 공의 속도차를 살립니다.", triggerCondition: "타이밍 반응 후 다른 계열", effectText: "타이밍을 읽은 뒤 다른 흐름으로 흔들기 쉽습니다.", stackType: "stackable", maxStack: 2, synergyTags: ["타이밍", "완급"], effects: { timingCounter: 1 } },
  { id: "C018", rarity: "common", name: "존 끝 감각", type: ["카운트", "코스 운영"], description: "볼카운트가 불리해도 존 끝과 낮은 코스로 버팁니다.", triggerCondition: "2볼 이상 존 끝 선택", effectText: "불리한 카운트의 존 끝 제구가 좋아집니다.", stackType: "stackable", maxStack: 2, synergyTags: ["카운트", "코스"], effects: { behindEdgeControl: 3 } },
  { id: "C019", rarity: "common", name: "반응 관찰", type: ["분석", "보상 강화"], description: "버리는 공과 보여주는 공의 반응을 최종 카드 성과로 회수합니다.", triggerCondition: "반응 확인용 볼", effectText: "타자 반응 관찰 성과가 더 안정적으로 쌓입니다.", stackType: "stackable", maxStack: 2, synergyTags: ["분석", "볼 의도"], effects: { readBallBonus: 1 } },
  { id: "R001", rarity: "rare", name: "완급으로 흔들기", type: ["심리전", "구종 운영"], description: "빠른 공 뒤에 느린 공을 섞어 타자의 기준 타이밍을 무너뜨립니다.", triggerCondition: "직구 이후 느린 구종", effectText: "직구 이후 느린 구종으로 타이밍을 빼앗습니다.", stackType: "unique", synergyTags: ["완급"], effects: { slowAfterFastSuspicion: -8 } },
  { id: "R002", rarity: "rare", name: "결정구 미끼", type: ["심리전", "구종 운영"], description: "유리한 카운트에서 변화구를 미끼로 써 배트를 끌어냅니다.", triggerCondition: "0-2, 1-2, 2-2 변화구", effectText: "유리 카운트 변화구 헛스윙 확률이 증가합니다.", stackType: "limited", maxStack: 2, synergyTags: ["유인구"], effects: { aheadBreakingWhiff: 0.12 } },
  { id: "R003", rarity: "rare", name: "득점권 호흡", type: ["위기관리"], description: "주자가 득점권에 있어도 손끝과 호흡을 유지합니다.", triggerCondition: "주자 2루 또는 3루", effectText: "득점권 제구가 증가합니다.", stackType: "unique", synergyTags: ["득점권"], effects: { scoringControl: 10 } },
  { id: "R004", rarity: "rare", name: "코스 흐름 끊기", type: ["코스 운영", "심리전"], description: "같은 코스가 이어져도 포수 사인으로 타자의 기다림을 한 번 늦춥니다.", triggerCondition: "같은 코스 2회 연속", effectText: "같은 코스 반복을 타자가 바로 기다리지 못합니다.", stackType: "unique", synergyTags: ["코스"], effects: { sameCourseShield: 1 } },
  { id: "R005", rarity: "rare", name: "같은 공 재요구", type: ["심리전"], description: "같은 구종을 다시 요구해도 포수 사인으로 타자의 기다림을 한 박자 늦춥니다.", triggerCondition: "같은 구종 반복", effectText: "같은 구종 반복이 조금 덜 읽힙니다.", stackType: "unique", synergyTags: ["반복", "포수"], effects: { repeatSuspicionMult: 0.7 } },
  { id: "R006", rarity: "rare", name: "포수의 첫 수", type: ["덕아웃", "심리전"], description: "이닝 첫 타자를 상대로 포수가 안전한 흐름을 먼저 잡아줍니다.", triggerCondition: "이닝 첫 타자", effectText: "이닝 첫 타자가 배합을 바로 좁히지 못합니다.", stackType: "unique", synergyTags: ["포수"], effects: { inningFirstBatterSuspicion: -10 } },
  { id: "R009", rarity: "rare", name: "약점 태그 활용", type: ["타자 분석", "심리전"], description: "공개된 약점 태그에 맞춰 승부에 성공하면 타자가 쉽게 배합을 좁히지 못합니다.", triggerCondition: "약점 태그 활용 성공", effectText: "약점 승부 성공 후 다음 같은 흐름을 숨깁니다.", stackType: "unique", synergyTags: ["약점 태그"], effects: { weaknessSuccessSuspicion: -10 } },
  { id: "R010", rarity: "rare", name: "몸쪽으로 문 열기", type: ["코스 운영", "심리전"], description: "몸쪽을 성공시킨 뒤 바깥쪽을 열어 타자의 시야를 흔듭니다.", triggerCondition: "몸쪽 성공 후 바깥쪽", effectText: "몸쪽 성공 후 다음 바깥쪽 성공률이 증가합니다.", stackType: "unique", synergyTags: ["몸쪽", "바깥쪽"], effects: { outsideAfterInsideControl: 7 } },
  { id: "R011", rarity: "rare", name: "바깥쪽 의식 후 낙차", type: ["코스 운영"], description: "바깥쪽을 계속 보여준 뒤 낮은 변화구로 배트를 끌어냅니다.", triggerCondition: "바깥쪽 성공 누적 후 낮은 변화구", effectText: "바깥쪽 성공 누적 후 낮은 변화구가 강해집니다.", stackType: "unique", synergyTags: ["바깥쪽", "변화구"], effects: { outsideSetupLowBreaking: 0.1 } },
  { id: "R012", rarity: "rare", name: "풀카운트 호흡", type: ["위기관리"], description: "풀카운트에서 넣으러 가는 공도 끝까지 존 끝에 붙입니다.", triggerCondition: "3볼 2스트라이크", effectText: "풀카운트 제구가 오르고 같은 흐름이 덜 읽힙니다.", stackType: "unique", synergyTags: ["풀카운트"], effects: { fullCountControl: 10, fullCountSuspicion: -5 } },
  { id: "R013", rarity: "rare", name: "위기 승부 집중", type: ["위기관리", "보상 강화"], description: "하이라이트 승부를 이기면 팀 분위기와 카드 등급이 좋아집니다.", triggerCondition: "하이라이트 성공", effectText: "하이라이트 성공 시 보상 선택지가 증가합니다.", stackType: "unique", synergyTags: ["하이라이트"], effects: { highlightChoiceBonus: 1 } },
  { id: "R015", rarity: "rare", name: "시선 높이 함정", type: ["심리전", "코스 운영"], description: "높은 빠른 공으로 눈높이를 올린 뒤 낮은 변화구로 배트를 끌어냅니다.", triggerCondition: "높은 빠른 공 이후 낮은 변화구", effectText: "높은 공 뒤 낮은 변화구가 더 살아납니다.", stackType: "unique", synergyTags: ["하이존", "낮은 코스"], effects: { heightTrap: 1 } },
  { id: "R016", rarity: "rare", name: "반응 데이터 축적", type: ["타자 분석", "심리전"], description: "초구 반응 데이터를 쌓아 타자가 어느 계열에 맞춰 움직이는지 더 빨리 좁힙니다.", triggerCondition: "타자별 첫 투구", effectText: "초구 반응 데이터로 다음 승부의 읽기가 좋아집니다.", stackType: "unique", synergyTags: ["분석", "초구"], effects: { reactionCheck: 1 } },
  { id: "R017", rarity: "rare", name: "파울 분석", type: ["타자 분석", "심리전"], description: "파울 타이밍을 보고 타자의 기준점을 더 정확히 읽습니다.", triggerCondition: "파울 발생", effectText: "파울 이후 다음 배합 판단이 좋아집니다.", stackType: "unique", synergyTags: ["분석", "파울"], effects: { foulAnalysis: 1 } },
  { id: "K001", rarity: "core", name: "땅볼 설계자", type: ["구종 강화", "위기관리"], description: "낮은 공으로 타구를 눌러 다음 타자까지 흐름을 안정시킵니다.", triggerCondition: "땅볼 결과", effectText: "땅볼 성공 시 다음 타자가 바로 기다리지 못합니다.", stackType: "unique", synergyTags: ["땅볼"], effects: { groundOutNextSuspicion: -10 } },
  { id: "K002", rarity: "core", name: "노림수 역이용", type: ["심리전"], description: "타자가 기다리기 시작한 순간, 오히려 그 기다림을 흔듭니다.", triggerCondition: "간파도 60% 이상", effectText: "타자가 기다리는 순간 헛스윙을 끌어내기 쉽습니다.", stackType: "unique", synergyTags: ["심리전"], effects: { highSuspicionWhiff: 0.12 } },
  { id: "K003", rarity: "core", name: "부담 건 승부", type: ["심리전", "위험 감수"], description: "피로도가 쌓인 구종을 과감하게 성공시키면 분위기를 되찾지만 실패 리스크가 큽니다.", triggerCondition: "부담 50 이상 구종", effectText: "부담 높은 구종 성공 시 타자의 기다림을 끊습니다.", stackType: "unique", synergyTags: ["위험"], effects: { burdenGamble: 1 } },
  { id: "K004", rarity: "core", name: "포수의 다음 수", type: ["덕아웃", "심리전"], description: "포수와 미리 맞춘 작전으로 직전 공의 의식을 다음 공까지 더 선명하게 이어갑니다.", triggerCondition: "덕아웃 선택 / 이전 공 활용", effectText: "덕아웃 효과와 이전 공 활용이 강화됩니다.", stackType: "unique", synergyTags: ["덕아웃", "포수"], effects: { dugoutEffectMult: 1.3, catcherNextMove: 1 } },
  { id: "K005", rarity: "core", name: "분석 역이용", type: ["타자 분석", "심리전"], description: "공개된 약점 태그와 일치하는 투구에 성공하면 다음 승부가 더 쉬워집니다.", triggerCondition: "약점 태그 활용 성공", effectText: "다음 투구 성공률이 증가합니다.", stackType: "unique", synergyTags: ["약점 태그"], effects: { weaknessNextPitchControl: 7 } },
  { id: "K006", rarity: "core", name: "클러치 에이스", type: ["위기관리"], description: "득점권에서도 호흡을 유지해 손끝과 제구가 흔들리지 않습니다.", triggerCondition: "주자 2루 또는 3루", effectText: "득점권 멘탈과 제구가 상승합니다.", stackType: "unique", synergyTags: ["득점권"], effects: { scoringControl: 5, scoringQuality: 4 } },
  { id: "K007", rarity: "core", name: "배합 배신", type: ["심리전", "구종 운영"], description: "앞선 두 공과 다른 흐름으로 타자의 기다림을 끊습니다.", triggerCondition: "직전 2구와 다른 계열", effectText: "직전 2구와 다른 계열로 타자의 기다림을 흔듭니다.", stackType: "unique", synergyTags: ["배합"], effects: { patternBreaker: 1 } },
  { id: "K008", rarity: "core", name: "결승구 설계", type: ["구종 운영", "보상 강화"], description: "2스트라이크 이후 삼진을 잡을수록 카드 등급이 좋아집니다.", triggerCondition: "2스트 이후 삼진", effectText: "2스트 이후 삼진 시 희귀 카드 선택지가 추가됩니다.", stackType: "unique", synergyTags: ["삼진", "보상"], effects: { twoStrikeGuaranteedRare: 1 } },
  { id: "K009", rarity: "core", name: "배합 설계자", type: ["심리전", "볼 의도"], description: "보여준 공과 버린 공의 의미를 다음 결과까지 이어갑니다.", triggerCondition: "볼 의도 후 결과", effectText: "볼 설계 후 범타·삼진 성과가 크게 좋아집니다.", stackType: "unique", synergyTags: ["배합", "볼 의도"], effects: { ballIntentDesign: 1 } },
  { id: "K010", rarity: "core", name: "정면승부형", type: ["초구", "제구"], description: "첫 공부터 스트라이크를 꽂아 타자의 선택지를 좁힙니다.", triggerCondition: "초구 스트라이크", effectText: "초구 스트라이크 제구와 타구 억제가 좋아집니다.", stackType: "unique", synergyTags: ["초구", "스트라이크"], effects: { firstStrikeDirect: 1 } },
  { id: "K011", rarity: "core", name: "타이밍 지배", type: ["완급", "심리전"], description: "빠름과 느림의 기준점을 빼앗아 타자의 컨택 질을 낮춥니다.", triggerCondition: "다른 계열 연계", effectText: "속도차와 계열 전환으로 타이밍을 지배합니다.", stackType: "unique", synergyTags: ["완급", "타이밍"], effects: { timingDominance: 1 } },
  { id: "K012", rarity: "core", name: "승부 설계자", type: ["보상 강화", "심리전"], description: "정타 위험이나 좋은 볼을 다음 결과로 회수해 보상 등급을 밀어 올립니다.", triggerCondition: "위험 반응 후 범타·삼진", effectText: "연계 성과 점수가 크게 증가합니다.", stackType: "unique", synergyTags: ["보상", "연계"], effects: { foulPlanReward: 1 } },
  { id: "R018", rarity: "rare", name: "불리한 카운트 수습", type: ["위기 관리"], description: "2볼 이상에서 다음 1타석의 제구 불안을 줄입니다.", triggerCondition: "2볼 이상", effectText: "2볼 이상 제구 불안 감소", stackType: "unique", synergyTags: ["카운트", "제구"], effects: { fullCountControlBonus: 4, fullCountWalkReduce: 1 } },
  { id: "R019", rarity: "rare", name: "약점 노출 유도", type: ["타자 분석"], description: "다음 스테이지 첫 3타자의 약점 태그 발견 확률이 올라갑니다.", triggerCondition: "다음 스테이지 첫 3타자", effectText: "초반 타자 약점 발견률 증가", stackType: "unique", synergyTags: ["분석", "공략"], effects: { candidateNextFirstWeakness: 3 } },
  { id: "R020", rarity: "rare", name: "반복 패턴 절단", type: ["심리전"], description: "직전 2구와 다른 계열이나 높이를 고르면 반복 간파 위험이 줄어듭니다.", triggerCondition: "직전 2구와 다른 선택", effectText: "반복 간파 위험 감소", stackType: "unique", synergyTags: ["반복", "배합"], effects: { patternBreaker: 1 } },
  { id: "R021", rarity: "rare", name: "몸쪽 각인", type: ["코스 운영", "심리전"], description: "몸쪽 의식을 심은 뒤 반대쪽 승부를 더 선명하게 살립니다.", triggerCondition: "몸쪽 후 바깥쪽", effectText: "몸쪽 각인 후 바깥쪽 제구와 약타 유도가 좋아집니다.", stackType: "unique", synergyTags: ["몸쪽", "바깥쪽"], effects: { insideImpressionOutside: 1 } },
  { id: "R022", rarity: "rare", name: "배합 복선", type: ["구종 운영", "심리전"], description: "앞선 공과 다른 계열로 타자의 기준점을 빼앗습니다.", triggerCondition: "직전 공과 다른 계열", effectText: "계열 전환 시 타구 품질이 낮아집니다.", stackType: "unique", synergyTags: ["배합", "전환"], effects: { categorySwitchSuspicion: 1 } },
  { id: "R023", rarity: "rare", name: "카운트 운영", type: ["카운트", "제구"], description: "2볼 이후에도 존 끝 승부로 카운트 압박을 뒤집습니다.", triggerCondition: "2볼 이상", effectText: "불리한 카운트 제구와 카운트 회복 성과가 증가합니다.", stackType: "unique", synergyTags: ["카운트", "제구"], effects: { twoBallStrikeReduce: 1 } },
  { id: "R024", rarity: "rare", name: "위기 병살 유도", type: ["위기관리", "땅볼"], description: "주자가 있을 때 낮은 공으로 병살 루트를 설계합니다.", triggerCondition: "1루 주자 + 낮은 공", effectText: "위기 병살 확률과 병살 성과가 증가합니다.", stackType: "unique", synergyTags: ["병살", "낮은 코스"], effects: { pressureDoublePlay: 1 } }
];

MP.dugoutChoiceCatalog = [
  { id: "pitch_check", category: "안정형", title: "구종 점검", desc: "다음 이닝 동안 가장 피로도가 쌓인 구종의 부담 증가가 줄고, 같은 공 재요구도 조금 숨깁니다.", effects: { burdenControl: 0.8, repeatSuspicionMult: 0.92, samePitchCall: 1 } },
  { id: "breaking_tune", category: "안정형", title: "변화구 감각 정비", desc: "다음 이닝 변화구 계열의 손끝 감각이 좋아지고, 빠른 공 뒤 느린 공 연결이 살아납니다.", effects: { breakingQuality: 4, slowAfterFastBoost: 0.1 } },
  { id: "fastball_reset", category: "안정형", title: "빠른 공 재정비", desc: "다음 이닝 포심, 투심, 커터를 존 끝에 붙이기 쉽고 초구 압박이 살아납니다.", effects: { fastControl: 5, firstStrikePressure: 1 } },
  { id: "catcher_lead", category: "안정형", title: "포수 리드 강화", desc: "다음 이닝 포수 사인으로 직전 공의 의식을 더 오래 살리고, 반복 패턴을 조금 숨깁니다.", effects: { suspicionMult: 0.88, impressionBonus: 0.12, samePitchCall: 1 } },
  { id: "breath_reset", category: "안정형", title: "첫 타자 호흡 정리", desc: "이닝 첫 타자를 상대로 급하게 들어가지 않습니다. 첫 승부에서 타자가 배합을 바로 좁히지 못합니다.", effects: { firstBatterSuspicion: -10 } },
  { id: "batter_analysis", category: "분석형", title: "반응 데이터 축적", desc: "다음 이닝 첫 타자의 약점 태그 후보를 2개 확인하고 초구 반응 데이터를 더 잘 읽습니다.", effects: { candidateNextFirstWeakness: 2, reactionCheckBoost: 0.35 } },
  { id: "rival_analysis", category: "분석형", title: "라이벌 사전 분석", desc: "라이벌 타자의 약점 태그 1개를 공개합니다.", effects: { revealRivalWeakness: 1 } },
  { id: "course_analysis", category: "분석형", title: "코스 반응 분석", desc: "다음 이닝 첫 타자의 코스 단서 후보를 2개 확인하고 파울 코스를 더 잘 읽습니다.", effects: { candidateCourseWeakness: 2, courseReadBoost: 0.3 } },
  { id: "deep_outfield", category: "안정형", title: "외야 깊게 수비", desc: "다음 이닝 장타를 줄이는 대신 약한 안타 위험은 조금 늘어납니다.", effects: { longHitGuard: 1, singleRisk: 0.1 } },
  { id: "perfect_challenge", category: "도박형", title: "완벽 이닝 도전", desc: "무실점이면 희귀 카드가 열리고, 실점하면 다음 타자가 같은 흐름을 더 빨리 기다립니다.", effects: { scorelessGuaranteedRare: 1, scorelessRiskSuspicion: 15 } },
  { id: "aggressive_call", category: "도박형", title: "선제 압박 운영", desc: "이닝 미션을 달성하면 보상 카드가 넓어집니다. 초구 스트라이크는 강해지지만, 초구 볼은 바로 읽힙니다.", effects: { missionChoiceBonus: 1, firstBatterSuspicion: 8, firstStrikePressure: 1, firstStrikeRiskSuspicion: 8 } },
  { id: "rival_duel_call", category: "특수형", title: "라이벌 정면승부 선언", desc: "위험 타자를 장타 없이 막으면 핵심 보상이 열리고, 장타를 맞으면 등급이 흔들립니다.", effects: { rivalCoreChoiceBonus: 1, rivalRisk: 1 }, requiresNextInningThreat: true }
];

MP.GAME_TIMING = {
  timingFeedbackDelay: 430,
  pitchResultCleanup: 900,
  courseFlash: 460,
  weaknessBanner: 1250,
  inningTransitionDelay: 900,
  rewardAfterOutWithTransition: 2400,
  rewardAfterOut: 1700,
  autoAdvanceAfterTransition: 1600,
  autoAdvanceDefault: 650,
  rewardAutoAdvanceStageTag: 950,
  rewardAutoAdvanceNormal: 1200,
  stageTagRewardDelay: 2550,
  stageEntryDelay: 700,
  bossEntryBanner: 2050,
  gameOverHit: 1850,
  gameOverDefault: 650,
  pitchResultToast: 3000,
  eventBannerDefault: 1500,
  stageOverlayDefault: 2100,
  stageOverlayBegin: 1900,
  nextBatterBanner: 850,
  bossBanner: 1900,
  inningChangeOverlay: 1700,
  stageOverlayLong: 2200
};

MP.suspicionStageMultipliers = [0.8, 1, 1.2];
MP.batterMindStageMultipliers = [0.7, 1, 1.12];
MP.suspicionPatternValues = {
  samePitch: 12,
  sameFamily: 7,
  sameZone: 6,
  sameHeight: 4,
  sameIntent: 4,
  targetMatch: 15,
  mistake: 10,
  exactRepeat: 10
};

MP.BATTER_MIND_LIMITS = {
  timing: [0, 100],
  confidence: [0, 100],
  confusion: [0, 100],
  pressure: [0, 100],
  plateAware: [0, 100]
};

MP.SCREEN_PHASE = {
  title: "title",
  tutorial: "tutorial",
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
    name: "빠른 공 압박",
    type: "base",
    description: "빠른 공으로 타자를 늦게 만들기 좋습니다.",
    effects: { fastQualityBonus: 3 },
    profiles: ["power"]
  },
  {
    id: "breaking_master",
    name: "꺾이는 공의 감각",
    type: "base",
    description: "변화구와 느린 공으로 타이밍을 흔드는 데 강합니다.",
    effects: { secondaryQualityBonus: 2, whiffBonus: 0.03 },
    profiles: ["breaking"]
  },
  {
    id: "command_artist",
    name: "코너워크",
    type: "base",
    description: "존 끝에 붙이는 능력이 좋습니다. 볼넷보다 루킹 승부에 강합니다.",
    effects: { strikeControlBonus: 3 },
    profiles: ["command"]
  },
  {
    id: "balanced_pitcher",
    name: "안정 운영",
    type: "base",
    description: "한쪽에 치우치지 않고 카운트 운영이 안정적입니다.",
    effects: { evenCountQualityBonus: 2 },
    profiles: ["balanced"]
  },
  {
    id: "two_strike_specialist",
    name: "몰아넣은 뒤 강함",
    type: "bonus",
    description: "2스트라이크 이후 결정구의 힘이 좋아집니다.",
    effects: { twoStrikeQualityBonus: 4, twoStrikeContactPenalty: 0.05 },
    profiles: ["power", "command"]
  },
  {
    id: "low_zone_master",
    name: "낮게 누르기",
    type: "bonus",
    description: "낮은 코스로 타구를 누르는 데 강합니다.",
    effects: { lowZoneControlBonus: 6 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "outside_control",
    name: "바깥 코너 제구",
    type: "bonus",
    description: "바깥쪽 승부가 안정적입니다. 파울과 약한 타구를 유도하기 좋습니다.",
    effects: { outsideControlBonus: 6 },
    profiles: ["command", "balanced"]
  },
  {
    id: "whiff_boost",
    name: "배트 끌어내기",
    type: "bonus",
    description: "변화구와 유인구로 스윙을 끌어내는 능력이 좋습니다.",
    effects: { whiffBonus: 0.06, chaseBonus: 0.04 },
    profiles: ["breaking"]
  },
  {
    id: "groundball_inducer",
    name: "땅볼 설계",
    type: "bonus",
    description: "낮은 공으로 땅볼과 병살 흐름을 만들기 좋습니다.",
    effects: { groundballBonus: 0.12, lowContactQualityPenalty: 5 },
    profiles: ["breaking", "command"]
  },
  {
    id: "mental_recovery",
    name: "위기 호흡",
    type: "bonus",
    description: "주자가 있어도 흔들림이 적습니다.",
    effects: { pressureReduce: 4 },
    profiles: ["balanced", "command"]
  },
  {
    id: "first_pitch_edge",
    name: "첫 공 선점",
    type: "bonus",
    description: "타석 첫 공으로 카운트를 가져오기 쉽습니다.",
    effects: { firstPitchControlBonus: 4, firstPitchQualityBonus: 3 },
    profiles: ["power", "balanced"]
  },
  {
    id: "homerun_risk",
    name: "실투 장타 위험",
    type: "weakness",
    description: "몰린 공이 나오면 장타 위험이 큽니다.",
    revealCondition: "allowHomerun",
    effects: { mistakeHomerunRisk: 8 }
  },
  {
    id: "walk_risk",
    name: "볼넷 흔들림",
    type: "weakness",
    description: "볼넷이 쌓이면 손끝이 흔들릴 수 있습니다.",
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
    description: "주자가 쌓이면 제구가 흔들릴 수 있습니다.",
    revealCondition: "consecutiveOnBase",
    effects: { pressurePenalty: 4 }
  },
  {
    id: "inside_cheese",
    name: "몸쪽 위협",
    type: "bonus",
    description: "몸쪽 승부가 좋고 위협구로 타자를 불편하게 만들 수 있습니다.",
    effects: { insideControlBonus: 4, brushContactPenalty: 3 },
    profiles: ["power", "command"]
  },
  {
    id: "high_fast_lift",
    name: "하이존 압박",
    type: "bonus",
    description: "높은 빠른 공으로 배트 궤적 위를 찌르는 데 강합니다.",
    effects: { highFastQualityBonus: 3, highFastWhiffBonus: 0.04 },
    profiles: ["power"]
  },
  {
    id: "full_count_command",
    name: "끝까지 코너워크",
    type: "bonus",
    description: "풀카운트에서도 존 끝을 노릴 수 있습니다.",
    effects: { fullCountControlBonus: 5, fullCountWalkReduce: 2 },
    profiles: ["command", "balanced"]
  },
  {
    id: "pattern_shuffler",
    name: "흐름 섞기",
    type: "bonus",
    description: "구종과 계열을 섞을 때 타자의 간파도를 더 빨리 낮춥니다.",
    effects: { mixSuspicionBonus: 2 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "texas_suppress",
    name: "빗맞은 안타 감소",
    type: "bonus",
    description: "완전히 속인 타구가 운 좋게 떨어질 확률을 줄입니다.",
    effects: { texasHitSuppress: 0.06 },
    profiles: ["command", "breaking"]
  }
];

MP.coreTagCatalog = [
  {
    id: "core_high_fastballer",
    name: "하이존 압박",
    family: "삼진계",
    description: "높은 빠른 공으로 배트 궤적 위를 찌릅니다. 단, 반복하면 장타 위험이 커집니다.",
    effects: { highFastQualityBonus: 2, highFastWhiffBonus: 0.03, fastQualityBonus: 1 },
    profiles: ["power", "command"]
  },
  {
    id: "core_groundball_architect",
    name: "낮게 누르는 설계",
    family: "땅볼계",
    description: "낮은 코스로 타구를 눌러 병살과 약한 땅볼을 노립니다.",
    effects: { groundballBonus: 0.08, lowContactQualityPenalty: 3 },
    profiles: ["breaking", "command"]
  },
  {
    id: "core_tempo_master",
    name: "속도차 지배",
    family: "완급계",
    description: "빠른 공과 느린 공의 간격으로 타자의 기준 타이밍을 흔듭니다.",
    effects: { secondaryQualityBonus: 2, whiffBonus: 0.02 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "core_breaking_maestro",
    name: "궤적 지배",
    family: "삼진계",
    description: "변화구 궤적으로 타자의 판단을 늦추고 헛스윙을 노립니다.",
    effects: { secondaryQualityBonus: 3, whiffBonus: 0.03 },
    profiles: ["breaking"]
  },
  {
    id: "core_corner_artist",
    name: "코너 잠금",
    family: "제구계",
    description: "존 끝을 안정적으로 공략해 볼카운트를 유리하게 가져갑니다.",
    effects: { strikeControlBonus: 3, outsideControlBonus: 3 },
    profiles: ["command", "balanced"]
  },
  {
    id: "core_bait_designer",
    name: "미끼 설계",
    family: "심리계",
    description: "유인구와 보여주는 공으로 타자의 배트를 끌어냅니다.",
    effects: { chaseBonus: 0.03, mixSuspicionBonus: 1 },
    profiles: ["breaking", "balanced"]
  },
  {
    id: "core_counter_pitcher",
    name: "노림수 역이용",
    family: "심리계",
    description: "타자가 기다리는 흐름을 읽고 반대로 찔러 타구 힘을 떨어뜨립니다.",
    effects: { counterContactPenalty: 4, mixSuspicionBonus: 1 },
    profiles: ["command", "breaking"]
  },
  {
    id: "core_clutch_pitcher",
    name: "위기 제압",
    family: "멘탈/운영계",
    description: "득점권과 풀카운트에서도 흔들림을 줄입니다.",
    effects: { pressureReduce: 5, fullCountControlBonus: 2 },
    profiles: ["balanced", "command"]
  },
  {
    id: "core_first_pitch_pressure",
    name: "첫 공 압박",
    family: "제구계",
    description: "타석 첫 공으로 카운트와 심리 주도권을 가져옵니다.",
    effects: { firstPitchControlBonus: 4, firstPitchQualityBonus: 3 },
    profiles: ["power", "balanced"]
  },
  {
    id: "core_cutter_softcontact",
    name: "배트 중심 회피",
    family: "땅볼계",
    description: "커터와 투심으로 정타를 피하고 약한 타구를 만듭니다.",
    effects: { brushContactPenalty: 2, lowContactQualityPenalty: 2 },
    requiredAllPitchIds: ["cutter", "two"],
    profiles: ["command", "power"]
  },
  {
    id: "core_finisher_collector",
    name: "마지막 공 설계",
    family: "삼진계",
    description: "2스트라이크 이후 결정구로 삼진을 잡는 데 강합니다.",
    effects: { twoStrikeQualityBonus: 3, twoStrikeContactPenalty: 0.04 },
    profiles: ["power", "breaking"]
  },
  {
    id: "core_game_manager",
    name: "이닝 운영자",
    family: "멘탈/운영계",
    description: "카운트와 위기를 안정적으로 관리해 큰 흐름을 지킵니다.",
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
  { id: "evo_hf_fast_imprint", coreTagId: "core_high_fastballer", name: "직구 의식", icon: "bolt", role: "synergy", condition: "높은 강속구 성공 후", effectText: "다음 변화구 타이밍 흔듦↑", operation: "직구 후 변화구로 마무리", when: { afterHighFast: true }, effects: { mixSuspicionBonus: 1, secondaryQualityBonus: 2 } },
  { id: "evo_hf_power_finish", coreTagId: "core_high_fastballer", name: "파워피니시", icon: "bolt", role: "risk", condition: "2스트 높은 강속구", effectText: "결정구 위력↑, 부담↑ 시 감소", operation: "2스트에서 위로 끝내기", when: { twoStrike: true, highFast: true }, effects: { twoStrikeQualityBonus: 3, highFastWhiffBonus: 0.03 } },
  { id: "evo_hf_bait_look", coreTagId: "core_high_fastballer", name: "시선끌기", icon: "hook", role: "psych", condition: "높은 공 후 낮은 변화구", effectText: "낮은 변화구 효과↑", operation: "높은 공 보여주고 아래로", when: { afterHigh: true, secondary: true }, effects: { secondaryQualityBonus: 2, whiffBonus: 0.02 } },
  { id: "evo_hf_speed_gamble", coreTagId: "core_high_fastballer", name: "강속승부", icon: "bolt", role: "risk", condition: "강속구 계열", effectText: "구위↑, 노림 일치 시 장타↑", operation: "속도로 밀어붙이는 고위험 운영", when: { fast: true }, effects: { fastQualityBonus: 2, mistakeHomerunRisk: 3 } },
  { id: "evo_bm_angle_up", coreTagId: "core_breaking_maestro", name: "각도강화", icon: "target", role: "canonical", condition: "변화구 계열", effectText: "헛스윙·타이밍 교란↑", operation: "변화구 각도로 흔들기", when: { secondary: true }, effects: { secondaryQualityBonus: 3, whiffBonus: 0.03 } },
  { id: "evo_bm_hide_path", coreTagId: "core_breaking_maestro", name: "궤적은폐", icon: "cycle", role: "psych", condition: "변화구 반복 시", effectText: "반복 흐름 완화", operation: "같은 변화구를 숨기듯 던지기", when: { secondary: true }, effects: { mixSuspicionBonus: 1 } },
  { id: "evo_bm_k_finish", coreTagId: "core_breaking_maestro", name: "결정낙차", icon: "bolt", role: "canonical", condition: "2스트 변화구", effectText: "유인·헛스윙↑", operation: "2스트에서 낙차로 끝내기", when: { twoStrike: true, secondary: true }, effects: { twoStrikeQualityBonus: 3, whiffBonus: 0.03 } },
  { id: "evo_bm_whiff_angle", coreTagId: "core_breaking_maestro", name: "헛스윙각", icon: "bolt", role: "risk", condition: "변화구 유인", effectText: "헛스윙↑, 실투 시 장타↑", operation: "과감한 변화구 승부", when: { secondary: true }, effects: { whiffBonus: 0.04, mistakeHomerunRisk: 2 } },
  { id: "evo_bm_speed_illusion", coreTagId: "core_breaking_maestro", name: "속도착시", icon: "cycle", role: "synergy", condition: "변화구 성공 후 강속구", effectText: "다음 강속구 타이밍 흔듦↑", operation: "느린 뒤 빠른 공으로 교란", when: { afterSecondary: true, fast: true }, effects: { fastQualityBonus: 2, mixSuspicionBonus: 1 } },
  { id: "evo_fc_decide_imprint", coreTagId: "core_finisher_collector", name: "결정구 집중", icon: "bolt", role: "canonical", condition: "2스트 결정구", effectText: "최고 레벨 구종 위력↑", operation: "2스트에서 최고 구종으로", when: { twoStrike: true }, effects: { twoStrikeQualityBonus: 4, twoStrikeContactPenalty: 0.04 } },
  { id: "evo_fc_final_gamble", coreTagId: "core_finisher_collector", name: "끝장승부", icon: "bolt", role: "risk", condition: "2스트", effectText: "헛스윙↑, 실패 시 위험↑", operation: "한 방에 끝내기", when: { twoStrike: true }, effects: { whiffBonus: 0.04, twoStrikeContactPenalty: 0.02, mistakeHomerunRisk: 2 } },
  { id: "evo_fc_burden_care", coreTagId: "core_finisher_collector", name: "부담관리", icon: "shield", role: "burden", condition: "2스트 결정구", effectText: "부담도 증가량↓", operation: "결정구를 아껴 쓰기", when: { twoStrike: true }, effects: { twoStrikeQualityBonus: 1 } },
  { id: "evo_fc_closer_sense", coreTagId: "core_finisher_collector", name: "마무리감", icon: "scales", role: "operation", condition: "2스트", effectText: "제구 안정, 마무리 성과↑", operation: "차분히 삼진 잡기", when: { twoStrike: true }, effects: { twoStrikeQualityBonus: 2, strikeControlBonus: 2 } },
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
  { id: "evo_fp_open_push", coreTagId: "core_first_pitch_pressure", name: "첫공압박", icon: "bolt", role: "synergy", condition: "초구 스트 성공", effectText: "다음 공 타이밍 흔듦↑", operation: "초구 성공 후 이어치기", when: { afterFirstStrike: true }, effects: { mixSuspicionBonus: 1, secondaryQualityBonus: 1 } },
  { id: "evo_fp_first_bait", coreTagId: "core_first_pitch_pressure", name: "초구미끼", icon: "hook", role: "psych", condition: "초구 볼 후 스트", effectText: "타이밍 흔듦↑", operation: "볼 보여주고 스트", when: { ballIntentSwitch: true }, effects: { chaseBonus: 0.02, strikeControlBonus: 2 } },
  { id: "evo_fp_preempt", coreTagId: "core_first_pitch_pressure", name: "선제공략", icon: "cycle", role: "operation", condition: "초구 스트", effectText: "초구 흐름 선점", operation: "초구로 심리 선점", when: { firstPitch: true, strike: true }, effects: { mixSuspicionBonus: 1, firstPitchQualityBonus: 2 } },
  { id: "evo_fp_fast_count", coreTagId: "core_first_pitch_pressure", name: "빠른카운트", icon: "shield", role: "burden", condition: "0-1 이후", effectText: "부담 증가↓", operation: "빠르게 카운트 진행", when: { aheadEarly: true }, effects: { evenCountQualityBonus: 1 } },
  { id: "evo_bd_chase_up", coreTagId: "core_bait_designer", name: "유인강화", icon: "hook", role: "canonical", condition: "존 밖 근처", effectText: "유인 스윙↑", operation: "볼 근처로 끌어내기", when: { chaseZone: true }, effects: { chaseBonus: 0.04, whiffBonus: 0.02 } },
  { id: "evo_bd_bait_recall", coreTagId: "core_bait_designer", name: "미끼회수", icon: "cycle", role: "synergy", condition: "볼 후 스트", effectText: "타이밍 흔듦↑", operation: "미끼 후 회수", when: { ballIntentSwitch: true }, effects: { mixSuspicionBonus: 1, strikeControlBonus: 2 } },
  { id: "evo_bd_walk_care", coreTagId: "core_bait_designer", name: "볼넷관리", icon: "scales", role: "weakness", condition: "유인 실패 후", effectText: "다음 스트 제구↑", operation: "볼넷 막기", when: { behindCount: true }, effects: { strikeControlBonus: 2, fullCountWalkReduce: 1 } },
  { id: "evo_bd_whiff_trap", coreTagId: "core_bait_designer", name: "헛스윙덫", icon: "hook", role: "risk", condition: "유인구", effectText: "헛스윙↑, 3볼↓", operation: "과감한 유인", when: { chaseZone: true }, effects: { chaseBonus: 0.05, whiffBonus: 0.03 } },
  { id: "evo_bd_eye_lead", coreTagId: "core_bait_designer", name: "시선유도", icon: "cycle", role: "psych", condition: "보여주기 볼 후", effectText: "반대 코스 타이밍 흔듦↑", operation: "시선 끌고 반대로", when: { ballIntentSwitch: true }, effects: { mixSuspicionBonus: 2, chaseBonus: 0.02 } },
  { id: "evo_cp_read_break", coreTagId: "core_counter_pitcher", name: "노림파괴", icon: "target", role: "canonical", condition: "역노림 성공", effectText: "타구 품질↓", operation: "노림수 역이용", when: { counterPitch: true }, effects: { counterContactPenalty: 5, mixSuspicionBonus: 1 } },
  { id: "evo_cp_reverse_flow", coreTagId: "core_counter_pitcher", name: "역류승부", icon: "cycle", role: "psych", condition: "간파도 60+", effectText: "다른 계열 타이밍 흔듦↑", operation: "높은 간파도 역공", when: { highSuspicion: true, categorySwitch: true }, effects: { mixSuspicionBonus: 2, secondaryQualityBonus: 2 } },
  { id: "evo_cp_pattern_cut", coreTagId: "core_counter_pitcher", name: "패턴절단", icon: "shield", role: "weakness", condition: "패턴 노출 후", effectText: "반복 흐름 완화", operation: "패턴 끊고 안정", when: { categorySwitch: true }, effects: { mixSuspicionBonus: 1 } },
  { id: "evo_cp_false_seed", coreTagId: "core_counter_pitcher", name: "허상심기", icon: "hook", role: "synergy", condition: "거짓 단서 후", effectText: "다음 공 타이밍 흔듦↑", operation: "허상으로 흔들기", when: { afterFalseClue: true }, effects: { mixSuspicionBonus: 2, chaseBonus: 0.02 } },
  { id: "evo_cp_read_counter", coreTagId: "core_counter_pitcher", name: "노림수역공", icon: "bolt", role: "risk", condition: "패턴 노출 역계열", effectText: "성공 시 큰 보너스", operation: "간파당했을 때 역공", when: { counterPitch: true, patternExposed: true }, effects: { counterContactPenalty: 6, whiffBonus: 0.03 } },
  { id: "evo_cl_crisis_block", coreTagId: "core_clutch_pitcher", name: "위기봉쇄", icon: "shield", role: "canonical", condition: "득점권", effectText: "실투↓", operation: "득점권에서 버티기", when: { scoring: true }, effects: { pressureReduce: 5, strikeControlBonus: 2 } },
  { id: "evo_cl_full_gamble", coreTagId: "core_clutch_pitcher", name: "승부수", icon: "scales", role: "operation", condition: "3-2 풀카운트", effectText: "스트 제구↑, 볼넷↓", operation: "도망가지 않는 존 승부", when: { fullCount: true, strike: true }, effects: { fullCountControlBonus: 4, fullCountWalkReduce: 2 } },
  { id: "evo_cl_clutch_engine", coreTagId: "core_clutch_pitcher", name: "클러치엔진", icon: "bolt", role: "risk", condition: "주자 + 결정구", effectText: "결정구↑, 실패 시 부담↑", operation: "위기에서 한 방", when: { runners: true, twoStrike: true }, effects: { twoStrikeQualityBonus: 3, pressureReduce: 3 } },
  { id: "evo_cl_runner_bind", coreTagId: "core_clutch_pitcher", name: "주자묶기", icon: "shield", role: "weakness", condition: "주자 있음", effectText: "장타 위험↓", operation: "주자 묶는 보수 운영", when: { runners: true }, effects: { pressureReduce: 3, lowContactQualityPenalty: 2 } },
  { id: "evo_cl_mental_reset", coreTagId: "core_clutch_pitcher", name: "멘탈회복", icon: "scales", role: "burden", condition: "실점 직후", effectText: "제구 흔들림 완화", operation: "실점 후 바로 회복", when: { afterRun: true }, effects: { pressureReduce: 4, strikeControlBonus: 2 } },
  { id: "evo_gm_tempo", coreTagId: "core_game_manager", name: "운영템포", icon: "scales", role: "canonical", condition: "동점 카운트", effectText: "구위·제구 소폭↑", operation: "동점에서 리듬 유지", when: { evenCount: true }, effects: { evenCountQualityBonus: 3, strikeControlBonus: 1 } },
  { id: "evo_gm_flow_switch", coreTagId: "core_game_manager", name: "흐름전환", icon: "cycle", role: "psych", condition: "직전과 다른 계열", effectText: "타이밍 흔듦↑", operation: "반복 패턴 끊기", when: { categorySwitch: true }, effects: { mixSuspicionBonus: 2, secondaryQualityBonus: 1, whiffBonus: 0.02 } },
  { id: "evo_gm_inning_care", coreTagId: "core_game_manager", name: "이닝관리", icon: "shield", role: "burden", condition: "이닝 종료", effectText: "부담 회복↑", operation: "이닝마다 체력 분배", effects: { evenCountQualityBonus: 1 } },
  { id: "evo_gm_count_design", coreTagId: "core_game_manager", name: "카운트설계", icon: "target", role: "operation", condition: "1-1, 2-2", effectText: "카운터 효과↑", operation: "중립 카운트 설계", when: { evenCount: true }, effects: { evenCountQualityBonus: 2, mixSuspicionBonus: 1 } },
  { id: "evo_gm_stamina_split", coreTagId: "core_game_manager", name: "체력분배", icon: "shield", role: "burden", condition: "미사용 구종", effectText: "부담 회복↑", operation: "구종 로테이션", effects: { evenCountQualityBonus: 1, pressureReduce: 2 } },
  { id: "evo_tm_tempo_burst", coreTagId: "core_tempo_master", name: "완급폭발", icon: "bolt", role: "canonical", condition: "강속↔느린 교차", effectText: "교차 효과↑", operation: "속도 차로 흔들기", when: { categorySwitch: true }, effects: { whiffBonus: 0.03, secondaryQualityBonus: 2 } },
  { id: "evo_tm_timing_cut", coreTagId: "core_tempo_master", name: "타이밍절단", icon: "target", role: "synergy", condition: "타이밍 교란", effectText: "컨택 품질↓", operation: "타이밍 뺏기", when: { categorySwitch: true }, effects: { whiffBonus: 0.02, contactQuality: -3 } },
  { id: "evo_tm_seq_press", coreTagId: "core_tempo_master", name: "시퀀스압박", icon: "cycle", role: "mastery", condition: "3구 내 계열 혼합", effectText: "간파도 완화·타이밍 흔듦↑", operation: "짧은 시퀀스 압박", when: { categorySwitch: true }, effects: { mixSuspicionBonus: 1, whiffBonus: 0.02 } },
  { id: "evo_tm_speed_gap", coreTagId: "core_tempo_master", name: "속도낙차", icon: "bolt", role: "canonical", condition: "속도 차 클 때", effectText: "타이밍 교란↑", operation: "낙차 극대화", when: { categorySwitch: true }, effects: { secondaryQualityBonus: 2, whiffBonus: 0.03 } },
  { id: "evo_tm_slow_bait", coreTagId: "core_tempo_master", name: "완급미끼", icon: "hook", role: "psych", condition: "느린공 후 강속구", effectText: "헛스윙↑", operation: "느린 뒤 빠른 공", when: { afterSecondary: true, fast: true }, effects: { whiffBonus: 0.04, fastQualityBonus: 1 } }
];

MP.batterTagCatalog = [
  {
    id: "fast_killer",
    name: "빠른 공 기준",
    description: "빠른 공에 기준을 둡니다. 느린 공이나 궤적 변화로 흔들어야 합니다.",
    slotBoost: "middle",
    bossWeight: 2,
    weight: 1.2
  },
  {
    id: "breaking_weak",
    name: "궤적 흔들림",
    description: "변화구와 느린 공에 타이밍을 자주 뺏깁니다.",
    slotBoost: "bottom",
    weight: 1.1
  },
  {
    id: "inside_weak",
    name: "몸쪽 경직",
    description: "몸쪽 스트라이크에 반응이 굳습니다.",
    slotBoost: "bottom",
    weight: 1
  },
  {
    id: "inside_punish",
    name: "몸쪽 실투 응징",
    description: "몸쪽으로 몰리면 강하게 받아칩니다. 정확한 코스가 필요합니다.",
    slotBoost: "middle",
    bossWeight: 2,
    weight: 1
  },
  {
    id: "outside_chase_foul",
    name: "바깥쪽 커트",
    description: "바깥 공을 파울로 버팁니다. 너무 단순한 바깥 승부는 길어집니다.",
    slotBoost: "top",
    weight: 1
  },
  {
    id: "low_ball_grounder",
    name: "낮은 공 살리기",
    description: "낮은 공도 땅볼로 살려낼 수 있습니다.",
    slotBoost: "bottom",
    weight: 1.1
  },
  {
    id: "high_fast_vulnerable",
    name: "하이존 늦음",
    description: "높은 직구에 배트가 늦기 쉽습니다.",
    slotBoost: "middle",
    weight: 1
  },
  {
    id: "full_count_heart",
    name: "풀카운트 침착",
    description: "풀카운트에서 쉽게 무너지지 않습니다. 확실한 코너가 필요합니다.",
    slotBoost: "top",
    bossWeight: 1.5,
    weight: 0.9
  },
  {
    id: "texas_luck",
    name: "빗맞은 안타",
    description: "완전히 속아도 약한 안타가 나올 수 있습니다.",
    slotBoost: "power",
    weight: 0.8
  },
  {
    id: "dp_risk",
    name: "병살 유도 가능",
    description: "낮은 땅볼이 병살 코스로 흐르기 쉽습니다.",
    slotBoost: "power",
    weight: 0.85
  },
  {
    id: "offspeed_patience",
    name: "느린 공 인내",
    description: "느린 공 유인구에 잘 속지 않습니다. 빠른 공 압박이 필요합니다.",
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
  { id: "reactive", label: "즉응형", approach: "균형", pattern: 0.12 },
  { id: "scoringImpatient", label: "득점권 조급", approach: "적극", scoringChase: 0.1 },
  { id: "threeBallWait", label: "3볼 대기", approach: "신중", threeBallTake: 0.12 },
  { id: "offspeedPatient", label: "변화구 참음", approach: "신중", offspeedChase: -0.12 },
  { id: "insideGuard", label: "몸쪽 경계", approach: "신중", insideAware: 0.12 }
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
  fishing: { label: "유인구", text: "타자의 배트를 끌어내기 위한 존 밖 공입니다.", swing: 0.08, next: "다음 공 반응 단서 확보" },
  show: { label: "보여주는 공", text: "다음 공을 살리기 위해 타자의 의식을 한쪽으로 묶는 공입니다.", quality: 2, next: "타이밍 흔듦" },
  waste: { label: "버리는 공", text: "카운트 여유를 써서 타자의 반응을 보는 공입니다.", read: 0.22, next: "노림수 정보" },
  brush: { label: "위협구", text: "타자를 불편하게 만들어 다음 바깥쪽을 열기 위한 공입니다.", contactQuality: -4, next: "몸쪽 의식 유도" }
};

MP.pitchBurdenConfig = {
  max: 100,
  tiers: [
    { id: "stable", min: 0, max: 24, label: "안정", command: 0, mistake: 0, homerun: 0, whiff: 0 },
    { id: "load", min: 25, max: 49, label: "노출", command: 2, mistake: 0.01, homerun: 0, whiff: 0 },
    { id: "overload", min: 50, max: 74, label: "흔들림", command: 5, mistake: 0.04, homerun: 0.02, whiff: -0.02 },
    { id: "limit", min: 75, max: 100, label: "위험", command: 8, mistake: 0.07, homerun: 0.05, whiff: -0.04 }
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
    { min: 20, max: 39, mult: 0.75 },
    { min: 40, max: 59, mult: 1 },
    { min: 60, max: 79, mult: 1.25 },
    { min: 80, max: 100, mult: 1.55 }
  ],
  levelWeightDecay: { 3: 0.35, 4: 0.18, 5: 0.08 },
  upgradeMasteryGate: { 4: 55, 5: 90 },
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
  four: ["", "존 압박", "하이패스트볼", "직구 후 변화구 강화", "에이스 패스트볼"],
  two: ["", "스트라이크 안정", "먹힌 타구", "더블플레이 루트", "땅볼 머신"],
  sinker: ["", "낮게 깔기", "땅볼 유도", "병살 설계", "가라앉는 승부구"],
  slider: ["", "바깥 제구", "헛스윙 유도", "백도어 감각", "마무리 슬라이더"],
  curve: ["", "낙차 안정", "눈높이 흔들기", "카운트 훔치기", "느린 낙차"],
  change: ["", "완급 안정", "타이밍 파괴", "느린 척 빠른 승부", "완급 지배"],
  cutter: ["", "손끝 제구", "빗맞힘", "파울 유도", "배트 브레이커"],
  splitter: ["", "낮은 존 감각", "헛스윙 낙차", "땅볼 낙차", "사라지는 공"]
};

MP.courseZones = {
  1: { row: 0, col: 0, label: "1번 높은 바깥쪽" },
  2: { row: 0, col: 1, label: "2번 높은 중앙" },
  3: { row: 0, col: 2, label: "3번 높은 몸쪽" },
  4: { row: 1, col: 0, label: "4번 가운데 바깥쪽" },
  5: { row: 1, col: 1, label: "5번 정중앙" },
  6: { row: 1, col: 2, label: "6번 가운데 몸쪽" },
  7: { row: 2, col: 0, label: "7번 낮은 바깥쪽" },
  8: { row: 2, col: 1, label: "8번 낮은 중앙" },
  9: { row: 2, col: 2, label: "9번 낮은 몸쪽" }
};

})(window.MountPsycho);
