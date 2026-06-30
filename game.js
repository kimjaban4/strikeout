const pitchLibrary = [
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

const categoryNames = {
  fast: "강속구",
  breaking: "변화구",
  offspeed: "느린공"
};

const stageInnings = [3, 3, 3];
const RELEASE_TIMING_SPEED = 0.8;
const RELEASE_TIMING_ZONE_SCALE = 0.8;

const stageConfigs = [
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
      { id: "s1_i3_low_suspicion", inning: 3, title: "배합 간파도 60% 이하 유지", type: "suspicionEndBelow", threshold: 60 }
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
    perfectExtras: ["같은 구종 3연속 사용 없음", "배합 간파도 평균 55% 이하"],
    themeText: "같은 공과 같은 코스를 빠르게 기억합니다. 성공한 패턴도 반복하면 바로 읽힙니다.",
    starNames: ["분석타선 돌파", "패턴 관리 성공", "노림수 역이용 경기"],
    missions: [
      { id: "s2_i1_first_strike", inning: 1, title: "초구 스트라이크 2회 이상", type: "firstPitchStrikesAtLeast", threshold: 2 },
      { id: "s2_i2_no_three_pitch", inning: 2, title: "같은 구종 3연속 금지", type: "maxPitchStreakBelow", threshold: 3 },
      { id: "s2_i3_weakness_choice", inning: 3, title: "공략 보조태그 찌르기 1회", type: "weaknessChoiceAtLeast", threshold: 1 },
      { id: "s2_i4_no_center_long", inning: 4, title: "중심 타선 장타 금지", type: "noCenterLongHit" },
      { id: "s2_i5_low_suspicion", inning: 5, title: "배합 간파도 70% 이하 유지", type: "suspicionEndBelow", threshold: 70 }
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
    perfectExtras: ["라이벌 장타 허용 없음", "배합 간파도 평균 60% 이하"],
    themeText: "강한 타자들이 실투와 반복을 놓치지 않습니다. 인상을 심고, 다음 공에서 배신해야 합니다.",
    starNames: ["최종전 생존", "우승권 운영", "완벽한 마운드 지배"],
    missions: [
      { id: "s3_i1_no_center_long", inning: 1, title: "중심 타선 장타 금지", type: "noCenterLongHit" },
      { id: "s3_i2_no_walk", inning: 2, title: "볼넷 없이 이닝 종료", type: "noWalk" },
      { id: "s3_i3_no_scoring_run", inning: 3, title: "득점권 상황 실점 금지", type: "noScoringPositionRun" },
      { id: "s3_i4_no_center_long", inning: 4, title: "중심 타선 장타 금지", type: "noCenterLongHit" },
      { id: "s3_i5_highlight_success", inning: 5, title: "하이라이트 승부 성공", type: "highlightSuccessAtLeast", threshold: 1 },
      { id: "s3_i6_weakness_choice", inning: 6, title: "공략 보조태그 선택 2회", type: "weaknessChoiceAtLeast", threshold: 2 },
      { id: "s3_i7_scoreless", inning: 7, title: "최종 이닝 무실점", type: "scorelessInning" }
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

const stageRunLimits = [4, 5, 6];

const rivalPsychPatterns = {
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

const batterWeaknessCatalog = [
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
    name: "풀카운트 존끝 흔들림",
    category: "count",
    description: "3볼 2스트라이크에서 존 끝 스트라이크 승부에 반응이 늦습니다.",
    triggerCondition: "3볼 2스트라이크",
    effectText: "풀카운트 존 끝 승부에 반응이 늦습니다.",
    recommendedPitchTypes: ["four", "two", "slider"],
    recommendedZones: ["edge"],
    effects: { fullCountContact: -0.08, contactQuality: -4 }
  }
];

const rewardCardCatalog = [
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
  { id: "R001", rarity: "rare", name: "완급으로 흔들기", type: ["심리전", "구종 운영"], description: "빠른 공 뒤에 느린 공을 섞어 타자의 기준 타이밍을 무너뜨립니다.", triggerCondition: "직구 이후 느린 구종", effectText: "직구 이후 느린 구종으로 타이밍을 빼앗습니다.", stackType: "unique", synergyTags: ["완급"], effects: { slowAfterFastSuspicion: -8 } },
  { id: "R002", rarity: "rare", name: "결정구 미끼", type: ["심리전", "구종 운영"], description: "유리한 카운트에서 변화구를 미끼로 써 배트를 끌어냅니다.", triggerCondition: "0-2, 1-2, 2-2 변화구", effectText: "유리 카운트 변화구 헛스윙 확률이 증가합니다.", stackType: "limited", maxStack: 2, synergyTags: ["유인구"], effects: { aheadBreakingWhiff: 0.12 } },
  { id: "R003", rarity: "rare", name: "득점권 호흡", type: ["위기관리"], description: "주자가 득점권에 있어도 손끝과 호흡을 유지합니다.", triggerCondition: "주자 2루 또는 3루", effectText: "득점권 제구가 증가합니다.", stackType: "unique", synergyTags: ["득점권"], effects: { scoringControl: 10 } },
  { id: "R004", rarity: "rare", name: "코스 흐름 끊기", type: ["코스 운영", "심리전"], description: "같은 코스가 이어져도 포수 사인으로 타자의 기다림을 한 번 늦춥니다.", triggerCondition: "같은 코스 2회 연속", effectText: "같은 코스 반복을 타자가 바로 기다리지 못합니다.", stackType: "unique", synergyTags: ["코스"], effects: { sameCourseShield: 1 } },
  { id: "R005", rarity: "rare", name: "같은 공 재요구", type: ["심리전"], description: "같은 구종을 다시 요구해도 포수 사인으로 타자의 기다림을 한 박자 늦춥니다.", triggerCondition: "같은 구종 반복", effectText: "같은 구종 반복이 조금 덜 읽힙니다.", stackType: "unique", synergyTags: ["반복", "포수"], effects: { repeatSuspicionMult: 0.7 } },
  { id: "R006", rarity: "rare", name: "포수의 첫 수", type: ["덕아웃", "심리전"], description: "이닝 첫 타자를 상대로 포수가 안전한 흐름을 먼저 잡아줍니다.", triggerCondition: "이닝 첫 타자", effectText: "이닝 첫 타자가 배합을 바로 좁히지 못합니다.", stackType: "unique", synergyTags: ["포수"], effects: { inningFirstBatterSuspicion: -10 } },
  { id: "R007", rarity: "rare", name: "라이벌 사전 분석", type: ["타자 분석"], description: "스테이지 시작 전 라이벌의 공략 보조태그를 미리 확인합니다.", triggerCondition: "스테이지 시작", effectText: "라이벌 공략 보조태그 1개가 공개됩니다.", stackType: "limited", maxStack: 2, synergyTags: ["라이벌", "분석"], effects: { stageRivalWeaknessReveal: 1 } },
  { id: "R008", rarity: "rare", name: "첫 타자 반응 체크", type: ["타자 분석"], description: "이닝 첫 타자의 약한 반응을 포수가 먼저 읽어냅니다.", triggerCondition: "이닝 첫 타자 등장", effectText: "이닝 첫 타자 공략 보조태그 1개가 공개됩니다.", stackType: "unique", synergyTags: ["분석"], effects: { firstBatterWeaknessReveal: 1 } },
  { id: "R009", rarity: "rare", name: "공략 보조태그 활용", type: ["타자 분석", "심리전"], description: "공개된 공략 보조태그에 맞춰 승부에 성공하면 타자가 쉽게 배합을 좁히지 못합니다.", triggerCondition: "공략 보조태그 활용 성공", effectText: "공략 승부 성공 후 다음 같은 흐름을 숨깁니다.", stackType: "unique", synergyTags: ["공략 보조태그"], effects: { weaknessSuccessSuspicion: -10 } },
  { id: "R010", rarity: "rare", name: "몸쪽으로 문 열기", type: ["코스 운영", "심리전"], description: "몸쪽을 성공시킨 뒤 바깥쪽을 열어 타자의 시야를 흔듭니다.", triggerCondition: "몸쪽 성공 후 바깥쪽", effectText: "몸쪽 성공 후 다음 바깥쪽 성공률이 증가합니다.", stackType: "unique", synergyTags: ["몸쪽", "바깥쪽"], effects: { outsideAfterInsideControl: 7 } },
  { id: "R011", rarity: "rare", name: "바깥쪽 의식 후 낙차", type: ["코스 운영"], description: "바깥쪽을 계속 보여준 뒤 낮은 변화구로 배트를 끌어냅니다.", triggerCondition: "바깥쪽 성공 누적 후 낮은 변화구", effectText: "바깥쪽 성공 누적 후 낮은 변화구가 강해집니다.", stackType: "unique", synergyTags: ["바깥쪽", "변화구"], effects: { outsideSetupLowBreaking: 0.1 } },
  { id: "R012", rarity: "rare", name: "풀카운트 호흡", type: ["위기관리"], description: "풀카운트에서 넣으러 가는 공도 끝까지 존 끝에 붙입니다.", triggerCondition: "3볼 2스트라이크", effectText: "풀카운트 제구가 오르고 같은 흐름이 덜 읽힙니다.", stackType: "unique", synergyTags: ["풀카운트"], effects: { fullCountControl: 10, fullCountSuspicion: -5 } },
  { id: "R013", rarity: "rare", name: "위기 승부 집중", type: ["위기관리", "보상 강화"], description: "하이라이트 승부를 이기면 팀 분위기와 보상 흐름이 좋아집니다.", triggerCondition: "하이라이트 성공", effectText: "하이라이트 성공 시 보상 선택지가 증가합니다.", stackType: "unique", synergyTags: ["하이라이트"], effects: { highlightChoiceBonus: 1 } },
  { id: "R014", rarity: "rare", name: "덕아웃 플랜", type: ["덕아웃", "보상 강화"], description: "덕아웃 작전 중 하나가 더 강한 선택지로 등장합니다.", triggerCondition: "덕아웃 선택지 생성", effectText: "희귀 덕아웃 선택지 1개가 보장됩니다.", stackType: "unique", synergyTags: ["덕아웃"], effects: { guaranteedRareDugout: 1 } },
  { id: "R015", rarity: "rare", name: "시선 높이 함정", type: ["심리전", "코스 운영"], description: "높은 빠른 공으로 눈높이를 올린 뒤 낮은 변화구로 배트를 끌어냅니다.", triggerCondition: "높은 빠른 공 이후 낮은 변화구", effectText: "높은 공 뒤 낮은 변화구가 더 살아납니다.", stackType: "unique", synergyTags: ["하이존", "낮은 코스"], effects: { heightTrap: 1 } },
  { id: "R016", rarity: "rare", name: "반응 체크", type: ["타자 분석", "심리전"], description: "초구 반응을 보고 타자가 어느 계열에 맞춰 움직이는지 더 빨리 좁힙니다.", triggerCondition: "타자별 첫 투구", effectText: "초구 반응으로 다음 승부의 읽기가 좋아집니다.", stackType: "unique", synergyTags: ["분석", "초구"], effects: { reactionCheck: 1 } },
  { id: "R017", rarity: "rare", name: "파울 분석", type: ["타자 분석", "심리전"], description: "파울 타이밍을 보고 타자의 기준점을 더 정확히 읽습니다.", triggerCondition: "파울 발생", effectText: "파울 이후 다음 배합 판단이 좋아집니다.", stackType: "unique", synergyTags: ["분석", "파울"], effects: { foulAnalysis: 1 } },
  { id: "K001", rarity: "core", name: "땅볼 설계자", type: ["구종 강화", "위기관리"], description: "낮은 공으로 타구를 눌러 다음 타자까지 흐름을 안정시킵니다.", triggerCondition: "땅볼 결과", effectText: "땅볼 성공 시 다음 타자가 바로 기다리지 못합니다.", stackType: "unique", synergyTags: ["땅볼"], effects: { groundOutNextSuspicion: -10 } },
  { id: "K002", rarity: "core", name: "노림수 역이용", type: ["심리전"], description: "타자가 기다리기 시작한 순간, 오히려 그 기다림을 흔듭니다.", triggerCondition: "간파도 60% 이상", effectText: "타자가 기다리는 순간 헛스윙을 끌어내기 쉽습니다.", stackType: "unique", synergyTags: ["심리전"], effects: { highSuspicionWhiff: 0.12 } },
  { id: "K003", rarity: "core", name: "부담 건 승부", type: ["심리전", "위험 감수"], description: "피로도가 쌓인 구종을 과감하게 성공시키면 분위기를 되찾지만 실패 리스크가 큽니다.", triggerCondition: "부담 50 이상 구종", effectText: "부담 높은 구종 성공 시 타자의 기다림을 끊습니다.", stackType: "unique", synergyTags: ["위험"], effects: { burdenGamble: 1 } },
  { id: "K004", rarity: "core", name: "포수의 다음 수", type: ["덕아웃", "심리전"], description: "포수와 미리 맞춘 작전으로 직전 공의 의식을 다음 공까지 더 선명하게 이어갑니다.", triggerCondition: "덕아웃 선택 / 이전 공 활용", effectText: "덕아웃 효과와 이전 공 활용이 강화됩니다.", stackType: "unique", synergyTags: ["덕아웃", "포수"], effects: { dugoutEffectMult: 1.3, catcherNextMove: 1 } },
  { id: "K005", rarity: "core", name: "분석 역이용", type: ["타자 분석", "심리전"], description: "공개된 공략 보조태그와 일치하는 투구에 성공하면 다음 승부가 더 쉬워집니다.", triggerCondition: "공략 보조태그 활용 성공", effectText: "다음 투구 성공률이 증가합니다.", stackType: "unique", synergyTags: ["공략 보조태그"], effects: { weaknessNextPitchControl: 7 } },
  { id: "K006", rarity: "core", name: "클러치 에이스", type: ["위기관리"], description: "득점권에서도 호흡을 유지해 손끝과 제구가 흔들리지 않습니다.", triggerCondition: "주자 2루 또는 3루", effectText: "득점권 멘탈과 제구가 상승합니다.", stackType: "unique", synergyTags: ["득점권"], effects: { scoringControl: 5, scoringQuality: 4 } },
  { id: "K007", rarity: "core", name: "배합 배신", type: ["심리전", "구종 운영"], description: "앞선 두 공과 다른 흐름으로 타자의 기다림을 끊습니다.", triggerCondition: "직전 2구와 다른 계열", effectText: "직전 2구와 다른 계열로 타자의 기다림을 흔듭니다.", stackType: "unique", synergyTags: ["배합"], effects: { patternBreaker: 1 } },
  { id: "K008", rarity: "core", name: "결승구 설계", type: ["구종 운영", "보상 강화"], description: "2스트라이크 이후 삼진을 잡을수록 보상 흐름이 좋아집니다.", triggerCondition: "2스트 이후 삼진", effectText: "2스트 이후 삼진 시 희귀 카드 선택지가 추가됩니다.", stackType: "unique", synergyTags: ["삼진", "보상"], effects: { twoStrikeGuaranteedRare: 1 } },
  { id: "R018", rarity: "rare", name: "불리한 카운트 수습", type: ["위기 관리"], description: "2볼 이상에서 다음 1타석의 제구 불안을 줄입니다.", triggerCondition: "2볼 이상", effectText: "2볼 이상 제구 불안 감소", stackType: "unique", synergyTags: ["카운트", "제구"], effects: { fullCountControlBonus: 4, fullCountWalkReduce: 1 } },
  { id: "R019", rarity: "rare", name: "약점 노출 유도", type: ["타자 분석"], description: "다음 스테이지 첫 3타자의 공략 보조태그 발견 확률이 올라갑니다.", triggerCondition: "다음 스테이지 첫 3타자", effectText: "초반 타자 약점 발견률 증가", stackType: "unique", synergyTags: ["분석", "공략"], effects: { candidateNextFirstWeakness: 3 } },
  { id: "R020", rarity: "rare", name: "반복 패턴 절단", type: ["심리전"], description: "직전 2구와 다른 계열이나 높이를 고르면 반복 간파 위험이 줄어듭니다.", triggerCondition: "직전 2구와 다른 선택", effectText: "반복 간파 위험 감소", stackType: "unique", synergyTags: ["반복", "배합"], effects: { patternBreaker: 1 } }
];

const dugoutChoiceCatalog = [
  { id: "pitch_check", category: "안정형", title: "구종 점검", desc: "다음 이닝 동안 가장 피로도가 쌓인 구종의 부담 증가가 줄고, 같은 공 재요구도 조금 숨깁니다.", effects: { burdenControl: 0.8, repeatSuspicionMult: 0.92, samePitchCall: 1 } },
  { id: "breaking_tune", category: "안정형", title: "변화구 감각 정비", desc: "다음 이닝 변화구 계열의 손끝 감각이 좋아지고, 빠른 공 뒤 느린 공 연결이 살아납니다.", effects: { breakingQuality: 4, slowAfterFastBoost: 0.1 } },
  { id: "fastball_reset", category: "안정형", title: "빠른 공 재정비", desc: "다음 이닝 포심, 투심, 커터를 존 끝에 붙이기 쉽고 초구 압박이 살아납니다.", effects: { fastControl: 5, firstStrikePressure: 1 } },
  { id: "catcher_lead", category: "안정형", title: "포수 리드 강화", desc: "다음 이닝 포수 사인으로 직전 공의 의식을 더 오래 살리고, 반복 패턴을 조금 숨깁니다.", effects: { suspicionMult: 0.88, impressionBonus: 0.12, samePitchCall: 1 } },
  { id: "breath_reset", category: "안정형", title: "첫 타자 호흡 정리", desc: "이닝 첫 타자를 상대로 급하게 들어가지 않습니다. 첫 승부에서 타자가 배합을 바로 좁히지 못합니다.", effects: { firstBatterSuspicion: -10 } },
  { id: "batter_analysis", category: "분석형", title: "타자 반응 체크", desc: "다음 이닝 첫 타자의 공략 보조태그 후보를 2개 확인하고 초구 반응을 더 잘 읽습니다.", effects: { candidateNextFirstWeakness: 2, reactionCheckBoost: 0.35 } },
  { id: "rival_analysis", category: "분석형", title: "라이벌 사전 분석", desc: "라이벌 타자의 공략 보조태그 1개를 공개합니다.", effects: { revealRivalWeakness: 1 } },
  { id: "course_analysis", category: "분석형", title: "코스 반응 분석", desc: "다음 이닝 첫 타자의 코스 단서 후보를 2개 확인하고 파울 코스를 더 잘 읽습니다.", effects: { candidateCourseWeakness: 2, courseReadBoost: 0.3 } },
  { id: "deep_outfield", category: "안정형", title: "외야 깊게 수비", desc: "다음 이닝 장타를 줄이는 대신 약한 안타 위험은 조금 늘어납니다.", effects: { longHitGuard: 1, singleRisk: 0.1 } },
  { id: "perfect_challenge", category: "도박형", title: "완벽 이닝 도전", desc: "무실점이면 희귀 보상 흐름이 열리고, 실점하면 다음 타자가 같은 흐름을 더 빨리 기다립니다.", effects: { scorelessGuaranteedRare: 1, scorelessRiskSuspicion: 15 } },
  { id: "aggressive_call", category: "도박형", title: "선제 압박 운영", desc: "이닝 미션을 달성하면 보상 흐름이 넓어집니다. 초구 스트라이크는 강해지지만, 초구 볼은 바로 읽힙니다.", effects: { missionChoiceBonus: 1, firstBatterSuspicion: 8, firstStrikePressure: 1, firstStrikeRiskSuspicion: 8 } },
  { id: "rival_duel_call", category: "특수형", title: "라이벌 정면승부 선언", desc: "위험 타자를 장타 없이 막으면 핵심 보상이 열리고, 장타를 맞으면 등급이 흔들립니다.", effects: { rivalCoreChoiceBonus: 1, rivalRisk: 1 }, requiresNextInningThreat: true }
];

const GAME_TIMING = {
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
  eventBannerPitchResult: 850,
  eventBannerDefault: 1500,
  stageOverlayDefault: 2100,
  stageOverlayBegin: 1900,
  nextBatterBanner: 850,
  bossBanner: 1900,
  inningChangeOverlay: 1700,
  stageOverlayLong: 2200
};

const suspicionStageMultipliers = [0.8, 1, 1.2];
const batterMindStageMultipliers = [0.7, 1, 1.12];
const suspicionPatternValues = {
  samePitch: 12,
  sameFamily: 7,
  sameZone: 6,
  sameHeight: 4,
  sameIntent: 4,
  targetMatch: 15,
  mistake: 10,
  exactRepeat: 10
};

const BATTER_MIND_LIMITS = {
  timing: [0, 100],
  confidence: [0, 100],
  confusion: [0, 100],
  pressure: [0, 100],
  plateAware: [0, 100]
};

const SCREEN_PHASE = {
  title: "title",
  tutorial: "tutorial",
  pitcherSelect: "pitcherSelect",
  pitching: "pitching",
  reward: "reward",
  themeSelect: "themeSelect",
  transition: "transition",
  gameOver: "gameOver"
};
const batterPortraits = Array.from({ length: 15 }, (_, index) => `assets/images/batters/batter${index + 1}.png`);
const pitcherPortraits = [1, 2, 3, 4, 5, 6, 7, 8, 10].map((index) => `assets/images/pitchers/pitcher${index}.png`);
const pitcherStatOrder = ["구속", "제구", "변화", "멘탈", "예측"];
const requiredFastballIds = ["four", "two", "sinker"];
const pitchVelocityAdjust = {
  four: 0,
  two: -4,
  sinker: -7,
  cutter: -6,
  splitter: -10,
  slider: -15,
  change: -22,
  curve: -28
};

const audioPaths = {
  bgm: "assets/audio/BGM.mp3",
  hit: "assets/audio/hit.mp3",
  homerun: "assets/audio/homerun.mp3",
  swing: "assets/audio/swing.wav"
};

const audioState = {
  unlocked: false,
  muted: false,
  bgm: null,
  bgmTimer: null,
  effects: {}
};

const pitcherProfiles = [
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

const pitcherTagCatalog = [
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

const coreTagCatalog = [
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

const supportTagMeta = {
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

const coreEvolutionPatternSets = {
  A: ["canonical", "synergy", "weakness"],
  B: ["canonical", "operation", "risk"],
  C: ["synergy", "mastery", "stage"],
  D: ["weakness", "operation", "risk"],
  E: ["canonical", "psych", "burden"]
};

const coreEvolutionCatalog = [
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

const batterTagCatalog = [
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

const firstNames = ["강", "한", "민", "유", "백", "서", "오", "문", "차", "주", "나", "윤"];
const lastNames = ["도윤", "지훈", "태오", "준서", "현우", "시온", "민재", "건우", "로한", "하준", "이준", "우진"];

const catcherTypes = [
  { id: "safe", label: "안정형 포수", tone: "실점 억제형", countBias: "edge", trust: 0.72 },
  { id: "attack", label: "공격형 포수", tone: "삼진 유도형", countBias: "chase", trust: 0.58 },
  { id: "analysis", label: "분석형 포수", tone: "노림수 추론형", countBias: "counter", trust: 0.82 },
  { id: "guts", label: "배짱형 포수", tone: "위기 승부형", countBias: "challenge", trust: 0.5 }
];

const batterMindTypes = [
  { id: "honest", label: "정직형", hint: "정직스윙", reliability: 0.86, fakeRate: 0.04, patternLearn: 0.92 },
  { id: "tricky", label: "교활형", hint: "포커형", reliability: 0.42, fakeRate: 0.2, patternLearn: 1.08 },
  { id: "adaptive", label: "적응형", hint: "패턴형", reliability: 0.62, fakeRate: 0.1, patternLearn: 1.26 },
  { id: "gambler", label: "도박형", hint: "한방형", reliability: 0.54, fakeRate: 0.16, patternLearn: 0.82 }
];

const hiddenTendencies = [
  { id: "firstPitchAggro", label: "초구 적극", approach: "초구", swing: 0.12 },
  { id: "firstPitchWatch", label: "초구 관찰", approach: "신중", chase: -0.1, firstPitchSwing: -0.06 },
  { id: "twoStrike", label: "인내형", approach: "보호", foul: 0.1 },
  { id: "walkHunter", label: "안구형", approach: "신중", chase: -0.08 },
  { id: "slugger", label: "응징형", approach: "적극", power: 8 },
  { id: "reactive", label: "즉응형", approach: "균형", pattern: 0.12 }
];

const memoryGrades = [
  { id: "low", label: "낮음", span: 1, suspicion: -5 },
  { id: "normal", label: "보통", span: 3, suspicion: 0 },
  { id: "high", label: "높음", span: 8, suspicion: 8 },
  { id: "genius", label: "천재형", span: 18, suspicion: 16 }
];

const bossGimmicks = [
  { id: "sluggerKing", label: "홈런왕", text: "실투 시 홈런 위험 극대화" },
  { id: "cutMaster", label: "커트장인", text: "불리한 카운트에서 파울 확률 상승" },
  { id: "geniusEye", label: "천재타자", text: "패턴 기억력과 역노림 상승" },
  { id: "walkMonster", label: "눈야구", text: "볼 유도에 강함" },
  { id: "clutch", label: "클러치", text: "주자 있을 때 강화" }
];

const ballIntentPlans = {
  fishing: { label: "유인구", text: "타자의 배트를 끌어내기 위한 존 밖 공입니다.", swing: 0.08, next: "다음 공 반응 단서 확보" },
  show: { label: "보여주는 공", text: "다음 공을 살리기 위해 타자의 의식을 한쪽으로 묶는 공입니다.", quality: 2, next: "타이밍 흔듦" },
  waste: { label: "버리는 공", text: "카운트 여유를 써서 타자의 반응을 보는 공입니다.", read: 0.22, next: "노림수 정보" },
  brush: { label: "위협구", text: "타자를 불편하게 만들어 다음 바깥쪽을 열기 위한 공입니다.", contactQuality: -4, next: "몸쪽 의식 유도" }
};

const pitchBurdenConfig = {
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

const pitchMasteryConfig = {
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

const pitchLevelNames = {
  four: ["", "존 압박", "하이패스트볼", "직구 후 변화구 강화", "에이스 패스트볼"],
  two: ["", "스트라이크 안정", "먹힌 타구", "더블플레이 루트", "땅볼 머신"],
  sinker: ["", "낮게 깔기", "땅볼 유도", "병살 설계", "가라앉는 승부구"],
  slider: ["", "바깥 제구", "헛스윙 유도", "백도어 감각", "마무리 슬라이더"],
  curve: ["", "낙차 안정", "눈높이 흔들기", "카운트 훔치기", "느린 낙차"],
  change: ["", "완급 안정", "타이밍 파괴", "느린 척 빠른 승부", "완급 지배"],
  cutter: ["", "손끝 제구", "빗맞힘", "파울 유도", "배트 브레이커"],
  splitter: ["", "낮은 존 감각", "헛스윙 낙차", "땅볼 낙차", "사라지는 공"]
};

// @runtime-split state:start
const state = {
  pitcher: null,
  pitcherChoices: [],
  catcher: null,
  lineup: [],
  batterIndex: 0,
  stageIndex: 0,
  stageThemeId: null,
  awaitingThemeSelection: false,
  pendingThemeChoices: [],
  stageJustAdvanced: false,
  awaitingStageStart: false,
  inning: 1,
  outs: 0,
  balls: 0,
  strikes: 0,
  consecutiveBalls: 0,
  bases: [false, false, false],
  runs: 0,
  pitchCount: 0,
  atBat: null,
  selectedPitchId: null,
  pitchIntent: "strike",
  pitchBallPlan: "",
  releaseTiming: null,
  lastReleaseResult: null,
  flashZone: null,
  lastLocation: null,
  lastPitchCall: null,
  consecutiveOnBase: 0,
  fullCountSeen: 0,
  rewardChoices: [],
  rewardPending: false,
  rewardKind: "normal",
  afterRewardStageOverlay: null,
  pendingRewardKindAfterCurrent: null,
  pendingTransitionBanner: null,
  pendingStageOverlay: null,
  coreEvolutionOffered: false,
  pendingCoreEvolutionReward: false,
  lastAtBatMemory: null,
  ownedRewardCards: [],
  cardTriggerLog: [],
  stageRun: null,
  currentInningStats: null,
  currentAtBatMeta: null,
  pendingDugoutChoices: [],
  dugoutPending: false,
  dugoutBeforeAtBat: false,
  dugoutAdvanceBatterOnConfirm: false,
  activeDugoutEffects: [],
  pendingRunComplete: false,
  pendingRunCompleteMessage: "",
  lastStageResult: null,
  nextBatterSuspicionBonus: 0,
  nextPitchControlBonus: 0,
  patternMemory: { pitches: [], lastWarningAt: 0 },
  pendingGameOver: false,
  tutorialSeen: {},
  runStats: {
    strikeouts: 0,
    hits: 0,
    doubles: 0,
    homeruns: 0,
    walks: 0,
    doublePlays: 0,
    rewards: 0,
    bossOuts: 0,
    bossDamage: 0
  },
  gameOver: false,
  waitingNextBatter: false,
  batterCardExpanded: false,
  screenPhase: "title"
};

let inningBannerTimer = null;
let timingTimer = null;
let uiEventsBound = false;
let autoAdvanceTimer = null;
let courseFlashTimer = null;
let pitchFlightFrame = null;
let releaseTimingFrame = null;
let rewardTimer = null;
MP.inningBannerDismissHandler = null;
MP.timingDismissHandler = null;
MP.rewardRevealTimer = null;
MP.dugoutRevealTimer = null;
MP.pitcherRevealTimer = null;
let gameOverTimer = null;

const els = {
  newGameButton: document.querySelector("#newGameButton"),
  bgmToggle: document.querySelector("#bgmToggle"),
  nextBatterButton: document.querySelector("#nextBatterButton"),
  inningText: document.querySelector("#inningText"),
  runsText: document.querySelector("#runsText"),
  targetText: document.querySelector("#targetText"),
  ballsText: document.querySelector("#ballsText"),
  strikesText: document.querySelector("#strikesText"),
  outsText: document.querySelector("#outsText"),
  base1: document.querySelector("#base1"),
  base2: document.querySelector("#base2"),
  base3: document.querySelector("#base3"),
  pitcherName: document.querySelector("#pitcherName"),
  pitcherPortrait: document.querySelector("#pitcherPortrait"),
  pitcherTags: document.querySelector("#pitcherTags"),
  pitcherTagsStack: document.querySelector(".pitcher-tags-stack"),
  pitcherTagsPark: document.querySelector("#pitcherTagsPark"),
  pitcherTagDetail: document.querySelector("#pitcherTagDetail"),
  pitcherStats: document.querySelector("#pitcherStats"),
  pitcherCardLower: document.querySelector("#pitcherCardLower"),
  pitchArea: document.querySelector(".pitch-area"),
  pitcherCard: document.querySelector(".pitcher-card"),
  pitchButtons: document.querySelector("#pitchButtons"),
  batterName: document.querySelector("#batterName"),
  batterPortrait: document.querySelector("#batterPortrait"),
  battingSlot: document.querySelector("#battingSlot"),
  batterType: document.querySelector("#batterType"),
  tagDetail: document.querySelector("#tagDetail"),
  batterStats: document.querySelector("#batterStats"),
  batterDetailStats: document.querySelector("#batterDetailStats"),
  batterCardLower: document.querySelector("#batterCardLower"),
  batterCard: document.querySelector(".batter-card"),
  batterCardToggle: document.querySelector("#batterCardToggle"),
  suspicionText: document.querySelector("#suspicionText"),
  suspicionFill: document.querySelector("#suspicionFill"),
  suspicionHint: document.querySelector("#suspicionHint"),
  readGuess: document.querySelector("#readGuess"),
  readBars: document.querySelector("#readBars"),
  recommendConfidence: document.querySelector("#recommendConfidence"),
  recommendTitle: document.querySelector("#recommendTitle"),
  recommendText: document.querySelector("#recommendText"),
  catcherTitle: document.querySelector("#catcherTitle"),
  catcherText: document.querySelector("#catcherText"),
  releaseTimingPanel: document.querySelector("#releaseTimingPanel"),
  releaseTimingButton: document.querySelector("#releaseTimingButton"),
  releaseTimingGrade: document.querySelector("#releaseTimingGrade"),
  releaseTimingMode: document.querySelector("#releaseTimingMode"),
  releaseTimingTrack: document.querySelector("#releaseTimingTrack"),
  releaseGoodZone: document.querySelector("#releaseGoodZone"),
  releasePerfectZone: document.querySelector("#releasePerfectZone"),
  releaseTimingCursor: document.querySelector("#releaseTimingCursor"),
  releaseTimingHint: document.querySelector("#releaseTimingHint"),
  logList: document.querySelector("#logList"),
  pitchCountText: document.querySelector("#pitchCountText"),
  timingBadge: document.querySelector("#timingBadge"),
  inningBanner: document.querySelector("#inningBanner"),
  batterFigure: document.querySelector("#batterFigure"),
  strikeZone: document.querySelector("#strikeZone"),
  ballSprite: document.querySelector("#ballSprite"),
  resultOverlay: document.querySelector("#resultOverlay"),
  resultTitle: document.querySelector("#resultTitle"),
  resultMessage: document.querySelector("#resultMessage"),
  restartButton: document.querySelector("#restartButton"),
  titleOverlay: document.querySelector("#titleOverlay"),
  titleStartButton: document.querySelector("#titleStartButton"),
  titleTutorialButton: document.querySelector("#titleTutorialButton"),
  tutorialOverlay: document.querySelector("#tutorialOverlay"),
  tutorialBackButton: document.querySelector("#tutorialBackButton"),
  pitcherSelectOverlay: document.querySelector("#pitcherSelectOverlay"),
  pitcherChoiceList: document.querySelector("#pitcherChoiceList"),
  rewardOverlay: document.querySelector("#rewardOverlay"),
  rewardTitle: document.querySelector("#rewardTitle"),
  rewardReason: document.querySelector("#rewardReason"),
  rewardChoiceList: document.querySelector("#rewardChoiceList"),
  stageOverlay: document.querySelector("#stageOverlay"),
  stageTitle: document.querySelector("#stageTitle"),
  stageSubtitle: document.querySelector("#stageSubtitle"),
  stageThemePanel: document.querySelector("#stageThemePanel"),
  stageStartButton: document.querySelector("#stageStartButton"),
  stageThemeBadge: document.querySelector("#stageThemeBadge"),
  themeSelectOverlay: document.querySelector("#themeSelectOverlay"),
  themeChoiceList: document.querySelector("#themeChoiceList"),
  stageThemeDetailOverlay: document.querySelector("#stageThemeDetailOverlay"),
  stageThemeDetailTitle: document.querySelector("#stageThemeDetailTitle"),
  stageThemeDetailBody: document.querySelector("#stageThemeDetailBody"),
  stageThemeDetailClose: document.querySelector("#stageThemeDetailClose"),
  missionFocusCard: document.querySelector("#missionFocusCard"),
  missionFocusTitle: document.querySelector("#missionFocusTitle"),
  missionFocusStatus: document.querySelector("#missionFocusStatus"),
  missionFocusCondition: document.querySelector("#missionFocusCondition"),
  missionFocusReward: document.querySelector("#missionFocusReward"),
  missionFocusRewardRow: document.querySelector("#missionFocusRewardRow"),
  runStatusCard: document.querySelector("#runStatusCard"),
  runStageName: document.querySelector("#runStageName"),
  runMissionText: document.querySelector("#runMissionText"),
  runRivalText: document.querySelector("#runRivalText"),
  runStarText: document.querySelector("#runStarText"),
  ownedCardSummary: document.querySelector("#ownedCardSummary"),
  cardTriggerLog: document.querySelector("#cardTriggerLog"),
  dugoutOverlay: document.querySelector("#dugoutOverlay"),
  dugoutChoiceList: document.querySelector("#dugoutChoiceList"),
  dugoutTitle: document.querySelector("#dugoutTitle"),
  dugoutReason: document.querySelector("#dugoutReason"),
  mobileBatterToggle: document.querySelector("#mobileBatterToggle"),
  mobileLogMore: document.querySelector("#mobileLogMore"),
  mobilePitchTab: document.querySelector("#mobilePitchTab"),
  mobileLogTab: document.querySelector("#mobileLogTab"),
  mobileInfoTab: document.querySelector("#mobileInfoTab"),
  mobileGameShell: document.querySelector("#mobileGameShell"),
  mobileStageThemeSummary: document.querySelector("#mobileStageThemeSummary"),
  mobileNewGameButton: document.querySelector("#mobileNewGameButton"),
  mobileInningText: document.querySelector("#mobileInningText"),
  mobileRunsText: document.querySelector("#mobileRunsText"),
  mobileTargetText: document.querySelector("#mobileTargetText"),
  mobileBallsDots: document.querySelector("#mobileBallsDots"),
  mobileStrikesDots: document.querySelector("#mobileStrikesDots"),
  mobileOutsDots: document.querySelector("#mobileOutsDots"),
  mobileBases: document.querySelector("#mobileBases"),
  mobileMissionCard: document.querySelector("#mobileMissionCard"),
  mobileMissionTitle: document.querySelector("#mobileMissionTitle"),
  mobileMissionCondition: document.querySelector("#mobileMissionCondition"),
  mobileMissionStatus: document.querySelector("#mobileMissionStatus"),
  mobilePitcherName: document.querySelector("#mobilePitcherName"),
  mobilePitcherTags: document.querySelector("#mobilePitcherTags"),
  mobileBatterName: document.querySelector("#mobileBatterName"),
  mobileBatterTags: document.querySelector("#mobileBatterTags"),
  mobilePlayerDetailPanel: document.querySelector("#mobilePlayerDetailPanel"),
  mobileBattingSlot: document.querySelector("#mobileBattingSlot"),
  mobileSuspicionFill: document.querySelector("#mobileSuspicionFill"),
  mobileSuspicionText: document.querySelector("#mobileSuspicionText"),
  mobileStrikeZone: document.querySelector("#mobileStrikeZone"),
  mobileInningBanner: document.querySelector("#mobileInningBanner"),
  mobileTimingBadge: document.querySelector("#mobileTimingBadge"),
  mobileBallSprite: document.querySelector("#mobileBallSprite"),
  mobilePitchButtons: document.querySelector("#mobilePitchButtons"),
  mobileReleasePanel: document.querySelector("#mobileReleasePanel"),
  mobileReleaseGrade: document.querySelector("#mobileReleaseGrade"),
  mobileReleaseMode: document.querySelector("#mobileReleaseMode"),
  mobileReleaseCursor: document.querySelector("#mobileReleaseCursor"),
  mobileRecommendConfidence: document.querySelector("#mobileRecommendConfidence"),
  mobileRecommendTitle: document.querySelector("#mobileRecommendTitle"),
  mobileRecommendText: document.querySelector("#mobileRecommendText"),
  mobileDuelReadFlow: document.querySelector("#mobileDuelReadFlow"),
  mobileDuelReadPitch: document.querySelector("#mobileDuelReadPitch"),
  mobileDuelReadRisk: document.querySelector("#mobileDuelReadRisk"),
  mobileRecentLog: document.querySelector("#mobileRecentLog"),
  mobileRecentLogMore: document.querySelector("#mobileRecentLogMore"),
  mobileThrowButton: document.querySelector("#mobileThrowButton"),
  mobilePanelBackdrop: document.querySelector("#mobilePanelBackdrop"),
  mobileInfoPanel: document.querySelector("#mobileInfoPanel"),
  mobileInfoPanelTitle: document.querySelector("#mobileInfoPanelTitle"),
  mobileInfoPanelBody: document.querySelector("#mobileInfoPanelBody"),
  mobileInfoPanelClose: document.querySelector("#mobileInfoPanelClose"),
  mobileSheetBackdrop: document.querySelector("#mobileSheetBackdrop"),
};

// @runtime-split constants:resume
const courseZones = {
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

// @runtime-split core:start
const tutorialSteps = {
  firstPitch: {
    title: "튜토리얼 · 첫 투구",
    text: "매 공은 단순히 던지는 싸움이 아닙니다. 타자가 무엇을 기다리는지 흔드는 싸움입니다."
  },
  inningMission: {
    title: "튜토리얼 · 이닝 미션",
    text: "이닝마다 추가 과제가 있습니다. 성공하면 다음 이닝 첫 타자 공략 보조태그 1개가 공개됩니다."
  },
  weakness: {
    title: "튜토리얼 · 공략 보조태그",
    text: "공략 보조태그는 강한 힌트지만 정답은 아닙니다. 계속 찌르면 타자가 적응합니다."
  },
  dugout: {
    title: "튜토리얼 · 덕아웃 작전",
    text: "덕아웃 선택은 다음 이닝의 운영 방향입니다. 과제와 타선 성향을 보고 고르세요."
  },
  stageCards: {
    title: "튜토리얼 · 스테이지 카드",
    text: "카드는 단순 능력치가 아니라 운영 방식입니다. 내 투수가 어떤 방식으로 타자를 흔들지 정하세요."
  },
  nextLineup: {
    title: "튜토리얼 · 다음 상대 타선",
    text: "타선마다 참는 방식, 치는 방식, 읽는 방식이 다릅니다. 테마를 보고 배합을 바꾸세요."
  }
};

function showTutorialStep(id) {
  const step = tutorialSteps[id];
  if (!step || state.tutorialSeen?.[id]) return;
  state.tutorialSeen = { ...(state.tutorialSeen || {}), [id]: true };
  addLog(step.title, step.text);
  showEventBanner(step.title.replace("튜토리얼 · ", ""), "reward", 1600);
}

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

const MAX_SUPPORT_TAGS = 3;
const STAGE_CARD_EXCLUDED_IDS = new Set(["R007", "R008", "R014"]);
const CONDITIONAL_CARD_RULES = {
  preventSameTypeRepeatStages: 2
};

function ensurePitcherTagFields(pitcher) {
  if (!pitcher) return;
  pitcher.coreEvolutionId = pitcher.coreEvolutionId || null;
  pitcher.bonusTags = [...new Set(pitcher.bonusTags || [])].slice(0, MAX_SUPPORT_TAGS);
  pitcher.bonusTagTiers = pitcher.bonusTagTiers || {};
  pitcher.bonusTags.forEach((tagId) => {
    if (!pitcher.bonusTagTiers[tagId]) pitcher.bonusTagTiers[tagId] = 1;
  });
}

const CORE_XP_THRESHOLDS = {
  silver: 4,
  gold: 9,
  evolution1: 15,
  evolution2: 24
};

const CORE_XP_GAIN_LIMIT = {
  perAtBat: 1,
  perInning: 2,
  perStage: 5
};

const PITCH_TIER_XP = {
  bronze: 3,
  silver: 7,
  gold: 12
};

const GROWTH_TIER_RANK = {
  none: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
  platinum: 4
};

const GROWTH_TIER_LABEL = {
  none: "무등급",
  bronze: "브론즈",
  silver: "실버",
  gold: "골드",
  platinum: "플래티넘"
};

function coreTierFromXp(xp = 0) {
  if (xp >= CORE_XP_THRESHOLDS.gold) return "gold";
  if (xp >= CORE_XP_THRESHOLDS.silver) return "silver";
  return "bronze";
}

function pitchTierFromXp(xp = 0) {
  if (xp >= PITCH_TIER_XP.gold) return "gold";
  if (xp >= PITCH_TIER_XP.silver) return "silver";
  if (xp >= PITCH_TIER_XP.bronze) return "bronze";
  return "none";
}

function ensurePitcherGrowthFields(pitcher = state.pitcher) {
  if (!pitcher) return null;
  ensurePitcherTagFields(pitcher);
  pitcher.coreXp = Number.isFinite(pitcher.coreXp) ? pitcher.coreXp : 0;
  pitcher.coreTier = pitcher.coreTier || coreTierFromXp(pitcher.coreXp);
  pitcher.pitchMastery = pitcher.pitchMastery || {};
  (pitchLibrary || []).forEach((pitch) => {
    if (!pitcher.pitchMastery[pitch.id]) {
      pitcher.pitchMastery[pitch.id] = { xp: 0, tier: "none" };
    }
  });
  pitcher.weaknessTagId = pitcher.weaknessTagId || null;
  pitcher.pendingCoreEvolutionReward = pitcher.pendingCoreEvolutionReward || null;
  pitcher.pendingPitchUpgradeReward = pitcher.pendingPitchUpgradeReward || null;
  pitcher.bossData = Number.isFinite(pitcher.bossData) ? pitcher.bossData : 0;
  pitcher.rewardHistory = pitcher.rewardHistory || {};
  pitcher.rewardHistory.conditionTypesByStage = pitcher.rewardHistory.conditionTypesByStage || [];
  pitcher.coreXpLimits = pitcher.coreXpLimits || {};
  return pitcher;
}

function resetStageGrowthSummary() {
  state.stageGrowthSummary = {
    stageIndex: state.stageIndex,
    coreXp: 0,
    bossData: 0,
    growthMarks: 0,
    pitchXp: 0,
    pitchTierUps: []
  };
  state.stageGrowthSummaryLogged = false;
}

function createGrowthResult() {
  return {
    visible: false,
    coreXpGain: 0,
    coreTierBefore: "bronze",
    coreTierAfter: "bronze",
    coreTierUp: false,
    pitchGrowth: [],
    bossDataGain: 0,
    weaknessProgress: 0,
    bonusTagProgress: 0,
    pendingCoreEvolution: false,
    pendingPitchUpgrade: false,
    detailReason: []
  };
}

function shouldShowGrowthMark(growthResult) {
  return (
    growthResult.coreXpGain > 0 ||
    growthResult.coreTierUp ||
    growthResult.pitchGrowth.some((growth) => growth.tierUp) ||
    growthResult.bossDataGain > 0 ||
    growthResult.weaknessProgress > 0 ||
    growthResult.bonusTagProgress > 0 ||
    growthResult.pendingCoreEvolution ||
    growthResult.pendingPitchUpgrade
  );
}

function growthResultIsOut(title, result) {
  return title === "STRIKE OUT!" || title === "DOUBLE PLAY!" || result?.result === "inPlayOut";
}

function shouldGrantCoreXp(title, result) {
  if (!growthResultIsOut(title, result)) return false;
  if (result?.batter?.isBoss) return true;
  if (title === "DOUBLE PLAY!") return true;
  return !result?.targetMatch;
}

function grantCoreXp(pitcher, requested, result) {
  const limits = pitcher.coreXpLimits || {};
  if (limits.stageIndex !== state.stageIndex) {
    limits.stageIndex = state.stageIndex;
    limits.stageGain = 0;
  }
  if (limits.inning !== state.inning) {
    limits.inning = state.inning;
    limits.inningGain = 0;
  }
  const atBatCap = result?.result === "doublePlay" ? 2 : CORE_XP_GAIN_LIMIT.perAtBat;
  const cappedRequest = Math.min(requested, atBatCap);
  const remainingInning = Math.max(0, CORE_XP_GAIN_LIMIT.perInning - (limits.inningGain || 0));
  const remainingStage = Math.max(0, CORE_XP_GAIN_LIMIT.perStage - (limits.stageGain || 0));
  const gain = Math.max(0, Math.min(cappedRequest, remainingInning, remainingStage));
  if (gain > 0) {
    pitcher.coreXp += gain;
    limits.inningGain = (limits.inningGain || 0) + gain;
    limits.stageGain = (limits.stageGain || 0) + gain;
  }
  pitcher.coreXpLimits = limits;
  return gain;
}

function grantPitchMasteryXp(pitcher, result) {
  const pitchId = result?.pitch?.id;
  if (!pitchId) return null;
  const mastery = pitcher.pitchMastery[pitchId] || { xp: 0, tier: "none" };
  const tierBefore = mastery.tier || pitchTierFromXp(mastery.xp);
  mastery.xp = (mastery.xp || 0) + 1;
  mastery.tier = pitchTierFromXp(mastery.xp);
  pitcher.pitchMastery[pitchId] = mastery;
  return {
    pitchId,
    pitchName: result.pitch.name || pitchId,
    xpGain: 1,
    tierBefore,
    tierAfter: mastery.tier,
    tierUp: GROWTH_TIER_RANK[mastery.tier] > GROWTH_TIER_RANK[tierBefore]
  };
}

function recordStageGrowth(growthResult) {
  if (!state.stageGrowthSummary || state.stageGrowthSummary.stageIndex !== state.stageIndex) resetStageGrowthSummary();
  const summary = state.stageGrowthSummary;
  summary.coreXp += growthResult.coreXpGain;
  summary.bossData += growthResult.bossDataGain;
  summary.pitchXp += growthResult.pitchGrowth.reduce((sum, growth) => sum + (growth.xpGain || 0), 0);
  if (growthResult.visible) summary.growthMarks += 1;
  growthResult.pitchGrowth
    .filter((growth) => growth.tierUp)
    .forEach((growth) => {
      summary.pitchTierUps.push({
        pitchId: growth.pitchId,
        pitchName: growth.pitchName,
        tier: growth.tierAfter
      });
    });
}

function processAtBatGrowth(result, title) {
  const growthResult = createGrowthResult();
  const pitcher = ensurePitcherGrowthFields();
  if (!pitcher || !result || !growthResultIsOut(title, result)) {
    state.lastGrowthResult = growthResult;
    return growthResult;
  }

  const coreXpBefore = pitcher.coreXp;
  growthResult.coreTierBefore = pitcher.coreTier || coreTierFromXp(pitcher.coreXp);
  const pitchGrowth = grantPitchMasteryXp(pitcher, result);
  if (pitchGrowth) growthResult.pitchGrowth.push(pitchGrowth);

  if (shouldGrantCoreXp(title, result)) {
    const requestedCoreXp = title === "DOUBLE PLAY!" ? 2 : 1;
    growthResult.coreXpGain = grantCoreXp(pitcher, requestedCoreXp, result);
    if (growthResult.coreXpGain > 0) growthResult.detailReason.push("핵심 성향 경험 축적");
  }

  if (result.batter?.isBoss) {
    pitcher.bossData += 1;
    growthResult.bossDataGain = 1;
    growthResult.detailReason.push("보스 데이터 획득");
  }

  const coreTierAfter = coreTierFromXp(pitcher.coreXp);
  growthResult.coreTierAfter = coreTierAfter;
  growthResult.coreTierUp = GROWTH_TIER_RANK[coreTierAfter] > GROWTH_TIER_RANK[growthResult.coreTierBefore];
  pitcher.coreTier = coreTierAfter;
  growthResult.pendingCoreEvolution =
    !pitcher.coreEvolutionId && coreXpBefore < CORE_XP_THRESHOLDS.evolution1 && pitcher.coreXp >= CORE_XP_THRESHOLDS.evolution1;
  if (growthResult.pendingCoreEvolution) pitcher.pendingCoreEvolutionReward = true;
  growthResult.pendingPitchUpgrade = growthResult.pitchGrowth.some((growth) => growth.tierUp);
  if (growthResult.pendingPitchUpgrade) {
    pitcher.pendingPitchUpgradeReward = growthResult.pitchGrowth.find((growth) => growth.tierUp)?.pitchId || null;
  }
  growthResult.visible = shouldShowGrowthMark(growthResult);
  state.lastGrowthResult = growthResult;
  recordStageGrowth(growthResult);
  return growthResult;
}

function growthMarkLabel(growthResult) {
  if (!growthResult?.visible) return "";
  const details = [];
  if (growthResult.coreTierUp) details.push(`핵심 ${GROWTH_TIER_LABEL[growthResult.coreTierAfter] || growthResult.coreTierAfter} 달성`);
  if (growthResult.coreXpGain > 0) details.push(`핵심 +${growthResult.coreXpGain}`);
  (growthResult.pitchGrowth || []).forEach((growth) => {
    if (growth.tierUp) details.push(`${growth.pitchName} ${GROWTH_TIER_LABEL[growth.tierAfter] || growth.tierAfter} 달성`);
    if (growth.xpGain > 0) details.push(`${growth.pitchName} 숙련 +${growth.xpGain}`);
  });
  if (growthResult.bossDataGain > 0) details.push("보스 데이터");
  if (growthResult.pendingCoreEvolution) details.push("진화 준비");
  return details.join("\n") || "누적";
}

function appendGrowthMark(text, growthResult) {
  if (!growthResult?.visible) return text;
  const label = growthMarkLabel(growthResult);
  return `${text}<div class="growth-log-mark"><strong>성장+</strong><span>${escapeHtml(label)}</span></div>`;
}

function stageGrowthSummaryHtml() {
  const summary = state.stageGrowthSummary;
  if (!summary) return "";
  const lines = [];
  if (summary.coreXp > 0) lines.push(`핵심 성향 경험 +${summary.coreXp}`);
  const tierUps = summary.pitchTierUps.map((growth) => `${growth.pitchName} ${GROWTH_TIER_LABEL[growth.tier] || growth.tier}`);
  if (tierUps.length) lines.push(`구종 숙련 상승: ${[...new Set(tierUps)].join(", ")}`);
  else if (summary.pitchXp > 0) lines.push(`구종 숙련 누적 +${summary.pitchXp}`);
  if (summary.bossData > 0) lines.push(`보스 데이터 +${summary.bossData}`);
  if (!lines.length) return "";
  return `<div class="log-lines">${lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>`;
}

function logStageGrowthSummaryOnce() {
  if (state.stageGrowthSummaryLogged) return;
  const growthSummary = stageGrowthSummaryHtml();
  if (!growthSummary) return;
  state.stageGrowthSummaryLogged = true;
  addLog("스테이지 성장 요약", growthSummary);
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
    inside: location.col >= 2,
    outside: location.col <= 0,
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
  return tag.name;
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

function coreTagFitsRepertoire(tag, repertoire = []) {
  const owned = new Set((repertoire || []).map((pitch) => pitch.id));
  if (tag.requiredAllPitchIds?.length && !tag.requiredAllPitchIds.every((id) => owned.has(id))) return false;
  if (tag.requiredAnyPitchIds?.length && !tag.requiredAnyPitchIds.some((id) => owned.has(id))) return false;
  return true;
}

function coreTagForProfile(profileId, repertoire = []) {
  const available = coreTagCatalog.filter((tag) => coreTagFitsRepertoire(tag, repertoire));
  const candidates = available.filter((tag) => tag.profiles?.includes(profileId));
  const picked = candidates.length ? pick(candidates) : pick(available.length ? available : coreTagCatalog);
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
    outside: aimed.col <= 0,
    inside: aimed.col >= 2,
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

function activeDugoutEffectEntries() {
  const current = state.inning;
  state.activeDugoutEffects = (state.activeDugoutEffects || []).filter((entry) => entry.expiresInning == null || entry.expiresInning >= current);
  return state.activeDugoutEffects;
}

function dugoutEffectValue(key, fallback = 0) {
  return activeDugoutEffectEntries().reduce((sum, entry) => sum + (entry.effects?.[key] || 0), fallback);
}

function dugoutEffectMultiplier(key, fallback = 1) {
  return activeDugoutEffectEntries().reduce((value, entry) => value * (entry.effects?.[key] || 1), fallback);
}

function rewardCardControlBonus(pitch, aimed, intent) {
  let bonus = state.nextPitchControlBonus || 0;
  const stack = (id) => cardStackCount(id);
  const previousPitch = state.atBat?.choiceHistory?.[state.atBat.choiceHistory.length - 1];
  const impression = state.atBat?.batterMind?.lastImpression;
  if (hasRewardCard("C014")) bonus += stack("C014") * 2;
  if (pitch.id === "four" && hasRewardCard("C001")) bonus += stack("C001") * 5;
  if ((state.atBat?.pitchHistory?.length || 0) <= 1 && hasRewardCard("C007")) bonus += stack("C007") * 5;
  if (state.balls >= 3 && hasRewardCard("C008")) bonus += stack("C008") * 5;
  if (state.balls >= 2 && hasRewardCard("R018")) bonus += 4;
  if (aimed.row >= 2 && hasRewardCard("C009")) bonus += stack("C009") * 4;
  if (state.balls === 3 && state.strikes === 2 && hasRewardCard("R012")) bonus += 10;
  if (previousPitch?.pitchId === pitch.id && hasRewardCard("R005")) bonus += 2;
  if (impression && hasRewardCard("K004")) bonus += 2;
  if (state.bases[1] || state.bases[2]) {
    if (hasRewardCard("R003")) bonus += 10;
    if (hasRewardCard("K006")) bonus += 5;
  }
  if (pitch.category === "fast") bonus += dugoutEffectValue("fastControl");
  if (pitch.category !== "fast") bonus += dugoutEffectValue("breakingQuality");
  return Math.round(bonus);
}

function rewardCardPitchEffect(pitch, location, plannedCourse, pattern, batter) {
  const effect = {
    quality: 0,
    swing: 0,
    chase: 0,
    contact: 0,
    foul: 0,
    contactQuality: 0,
    doublePlayBonus: 0,
    label: ""
  };
  const stack = (id) => cardStackCount(id);
  const side = locationSideFromRowCol(location.row, location.col);
  const height = locationHeightFromRowCol(location.row);
  const previousPitch = state.atBat?.choiceHistory?.[state.atBat.choiceHistory.length - 1];
  const previousCategory = previousPitch?.category || state.atBat?.pitchHistory?.[state.atBat.pitchHistory.length - 2] || "";
  const previousHeight = previousPitch?.height || state.lastPitchPattern?.height || "";
  const previousSide = previousPitch?.side || state.lastPitchPattern?.side || "";
  const impression = state.atBat?.batterMind?.lastImpression;
  const isBreaking = pitch.category === "breaking" || pitch.category === "offspeed";
  const hasScoringRunner = state.bases[1] || state.bases[2];
  const isSameReleaseTarget = previousCategory === "fast" && ["change", "splitter", "cutter"].includes(pitch.id);

  if (pitch.id === "two" && location.inZone && hasRewardCard("C002")) effect.doublePlayBonus += stack("C002") * 0.05;
  if (pitch.id === "change" && previousCategory === "fast" && hasRewardCard("C005")) {
    effect.quality += stack("C005") * 4;
    effect.contact -= stack("C005") * 0.025;
    effect.contactQuality -= stack("C005") * 2;
  }
  if (isSameReleaseTarget && hasRewardCard("C015")) {
    effect.contact -= stack("C015") * 0.03;
    effect.contactQuality -= stack("C015") * 3;
    effect.label = "같은 릴리스";
  }
  if (pitch.id === "splitter" && height === "low" && hasRewardCard("C006")) {
    effect.swing += stack("C006") * 0.05;
    effect.contact -= stack("C006") * 0.05;
  }
  if ((state.atBat?.pitchHistory?.length || 0) <= 1 && location.inZone && hasRewardCard("C007")) {
    effect.contactQuality -= stack("C007") * 2;
    effect.label = "플레이트 점유";
  }
  if (side === "inside" && location.inZone && hasRewardCard("C010")) effect.contactQuality -= stack("C010") * 5;
  if (previousCategory === "fast" && isBreaking && hasRewardCard("R001")) effect.contactQuality -= 4;
  if (isBreaking && state.strikes >= 2 && hasRewardCard("R002")) {
    effect.swing += stack("R002") * 0.12;
    effect.contact -= stack("R002") * 0.08;
  }
  if (side === "outside" && hasRewardCard("R010") && state.lastPitchPattern?.side === "inside") effect.quality += 4;
  if (previousHeight === "high" && height === "low" && isBreaking && hasRewardCard("R015")) {
    effect.swing += 0.05;
    effect.contact -= 0.05;
    effect.contactQuality -= 5;
    effect.label = "시선 높이 함정";
  }
  if (side === "outside" && hasRewardCard("R011")) {
    const outsideCount = (state.atBat?.choiceHistory || []).filter((entry) => entry.side === "outside").length;
    if (outsideCount >= 2 && height === "low" && isBreaking) {
      effect.swing += 0.1;
      effect.contact -= 0.08;
    }
  }
  if ((pattern?.suspicion || 0) >= 60 && hasRewardCard("K002")) {
    effect.swing += 0.12;
    effect.contact -= 0.08;
  }
  if (hasScoringRunner && hasRewardCard("K006")) {
    effect.quality += 4;
    effect.contactQuality -= 3;
  }
  if (hasRewardCard("K007") || hasRewardCard("R020")) {
    const recent = (state.atBat?.choiceHistory || []).slice(-2);
    const currentFamily = pitchFamily(pitch.category);
    if (recent.length >= 2 && recent.every((entry) => entry.family !== currentFamily)) {
      effect.contactQuality -= hasRewardCard("K007") ? 8 : 5;
      effect.label = "배합 배신";
    }
  }
  if (previousPitch?.pitchId === pitch.id && (hasRewardCard("R005") || dugoutEffectValue("samePitchCall"))) {
    const callBoost = (hasRewardCard("R005") ? 1 : 0) + dugoutEffectValue("samePitchCall");
    effect.quality += callBoost * 2;
    effect.contactQuality -= callBoost * 3;
    effect.label = "같은 공 재요구";
  }
  if (impression && hasRewardCard("K004")) {
    effect.quality += 2;
    effect.contactQuality -= 3;
    effect.label = "포수의 다음 수";
  }
  if (pitchMatchesRevealedWeakness({ batter, pitch, location }) && hasRewardCard("K005")) {
    effect.quality += 4;
    effect.contactQuality -= 4;
  }
  if (pitch.category !== "fast") effect.quality += dugoutEffectValue("breakingQuality");
  if (dugoutEffectValue("firstStrikePressure") && (state.atBat?.pitchHistory?.length || 0) <= 1 && location.inZone) {
    effect.contactQuality -= 2 * dugoutEffectValue("firstStrikePressure");
  }
  if (dugoutEffectValue("longHitGuard")) {
    effect.contactQuality -= 5;
    effect.contact += dugoutEffectValue("singleRisk") || 0.02;
  }
  return effect;
}

function applyInningStartCardEffects() {
  const run = ensureStageRunState();
  if (!run.scoutingApplied && hasRewardCard("R007")) {
    revealRivalWeakness();
    run.scoutingApplied = true;
  }
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
  return stageConfig().innings;
}

function currentStageRunLimit() {
  return stageRunLimits[state.stageIndex] ?? stageConfig().clearRuns + 1;
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

const BALANCE_LOG_VERSION = 1;
const balanceLog = { enabled: false, active: null };

function balanceRound(value, digits = 2) {
  const scale = 10 ** digits;
  return Math.round((Number(value) || 0) * scale) / scale;
}

function enableBalancePlayLog(enabled = true) {
  balanceLog.enabled = !!enabled;
  if (!balanceLog.enabled) balanceLog.active = null;
}

function setBalancePlayLogMeta(meta = {}) {
  MP._balanceSimMeta = { ...(MP._balanceSimMeta || {}), ...meta };
}

function beginBalancePlayLog() {
  if (!balanceLog.enabled) return;
  const meta = MP._balanceSimMeta || {};
  MP._balanceSimMeta = null;
  balanceLog.active = {
    version: BALANCE_LOG_VERSION,
    startedAt: Date.now(),
    seed: meta.seed ?? null,
    simIndex: meta.simIndex ?? null,
    botProfile: meta.botProfile ?? "player",
    botConcept: meta.botConcept ?? "psych-command-anti-longball",
    pitcher: null,
    stageClears: [],
    pitchEvents: [],
    fatalPitch: null
  };
}

function balanceChance(probability, key, balanceMeta) {
  const threshold = clamp(probability, 0.02, 0.98);
  if (!balanceMeta) return Math.random() < threshold;
  const roll = Math.random();
  const success = roll < threshold;
  balanceMeta.rolls[key] = { probability: balanceRound(threshold, 4), roll: balanceRound(roll, 4), success };
  return success;
}

function recordBalanceStageClear(stageResult) {
  if (!balanceLog.active || !stageResult) return;
  balanceLog.active.stageClears.push({
    stageIndex: stageResult.stageIndex,
    stageNumber: stageResult.stageIndex + 1,
    stageName: stageResult.stageName,
    stars: stageResult.stars,
    runs: stageResult.runs,
    failed: false
  });
}

function recordBalancePitchEvent(result, plannedCourse, pattern, runsBefore, runsScored, cardTriggers = []) {
  if (!balanceLog.active || !result?._balanceCapture) return;
  const { balanceMeta, pitch } = result._balanceCapture;
  const context = balanceMeta?.context;
  const event = {
    seq: balanceLog.active.pitchEvents.length + 1,
    stageIndex: state.stageIndex,
    stageNumber: currentStageNumber(),
    inning: state.inning,
    outs: state.outs,
    count: `${state.balls}-${state.strikes}`,
    countBefore: pattern?.count || `${state.balls}-${state.strikes}`,
    runsBefore,
    runsScored,
    bases: pattern?.runners || result.runnersBefore || runnersKey(),
    pitchId: pitch?.id || result.pitch?.id,
    pitchName: pitch?.name || result.pitch?.name,
    category: pitch?.category || result.pitch?.category,
    zone: plannedCourse.zone,
    intent: plannedCourse.intent,
    ballPlan: plannedCourse.ballPlan || "",
    release: plannedCourse.release
      ? {
          grade: plannedCourse.release.grade,
          label: plannedCourse.release.label,
          accuracy: plannedCourse.release.accuracy ?? null,
          pressure: plannedCourse.release.pressure ?? null,
          commandBonus: plannedCourse.release.commandBonus || 0,
          contactMod: plannedCourse.release.contactMod || 0,
          contactQualityMod: plannedCourse.release.contactQualityMod || 0,
          zoneSize: plannedCourse.release.zoneSize ?? null,
          perfectSize: plannedCourse.release.perfectSize ?? null,
          auto: !!plannedCourse.release.auto
        }
      : null,
    targetMatch: !!result.targetMatch,
    inZone: !!result.inZone,
    location: result.location
      ? {
          row: result.location.row,
          col: result.location.col,
          inZone: !!result.location.inZone,
          centerMistake: !!result.location.centerMistake
        }
      : null,
    quality: context ? balanceRound(context.quality, 2) : null,
    suspicion: Math.round(state.atBat?.suspicion || pattern?.suspicion || 0),
    patternExposed: !!pattern?.exposed,
    reverseRead: !!pattern?.reverseRead,
    ballIntent: pattern?.ballIntent || null,
    batter: result.batter
      ? {
          name: result.batter.name,
          slot: result.batter.slot,
          isBoss: !!result.batter.isBoss,
          isRival: !!result.batter.isRival
        }
      : null,
    batterTarget: state.atBat?.target || null,
    swung: !!result.swung,
    timingLabel: result.timingLabel || "",
    timingValue: result.timingValue ?? null,
    contactQuality: result.contactQuality ?? balanceMeta?.contactQuality ?? null,
    result: result.result,
    probabilities: balanceMeta?.probabilities || {},
    rolls: balanceMeta?.rolls || {},
    thresholds: balanceMeta?.thresholds || {},
    cardTriggers
  };
  balanceLog.active.pitchEvents.push(event);
  if (runsScored > 0) balanceLog.active.fatalPitch = { ...event };
}

function buildBalanceRunSummary(won, message = "") {
  if (!balanceLog.active) return null;
  const stageNumber = currentStageNumber();
  const stats = { ...state.runStats };
  const stageClears = balanceLog.active.stageClears.slice();
  if (!won) {
    stageClears.push({
      stageIndex: state.stageIndex,
      stageNumber,
      stageName: stageConfig().name,
      stars: 0,
      runs: state.runs,
      failed: true,
      runLimit: currentStageRunLimit()
    });
  }
  const fatal = balanceLog.active.fatalPitch;
  const loss = won
    ? null
    : {
        reason: "run_limit",
        message: message || "",
        stageIndex: state.stageIndex,
        stageNumber,
        stageName: stageConfig().name,
        runLimit: currentStageRunLimit(),
        runsAtDeath: state.runs,
        inning: state.inning,
        fatalResult: fatal?.result || null,
        fatalPitchId: fatal?.pitchId || null,
        fatalPitchName: fatal?.pitchName || null,
        fatalBatter: fatal?.batter?.name || null,
        runsScoredOnPitch: fatal?.runsScored ?? null,
        count: fatal?.countBefore || fatal?.count || null
      };
  return {
    version: BALANCE_LOG_VERSION,
    startedAt: balanceLog.active.startedAt,
    endedAt: Date.now(),
    seed: balanceLog.active.seed,
    simIndex: balanceLog.active.simIndex,
    botProfile: balanceLog.active.botProfile || "player",
    botConcept: balanceLog.active.botConcept || "psych-command-anti-longball",
    outcome: won ? "clear" : "failed",
    won: !!won,
    resultTitle: won ? "클리어" : "경기 종료",
    message: message || "",
    stageReached: won ? stageInnings.length : stageNumber,
    diedAtStage: won ? null : stageNumber,
    maxStageCleared: won ? stageInnings.length : Math.max(0, stageNumber - 1),
    stageClears,
    loss,
    stats,
    runStats: stats,
    pitchCount: state.pitchCount,
    pitches: balanceLog.active.pitchEvents.length,
    pitcher: balanceLog.active.pitcher,
    ownedCards: ownedRewardCardEntries().map((entry) => ({
      id: entry.card.id,
      name: entry.card.name,
      rarity: entry.card.rarity,
      stack: entry.stack
    })),
    pitchEvents: balanceLog.active.pitchEvents.slice()
  };
}

function stageConfig(index = state.stageIndex) {
  return stageConfigs[index] || stageConfigs[stageConfigs.length - 1];
}

function currentStageClearLimit() {
  return stageConfig().clearRuns;
}

function createInningStats(inning = 1) {
  return {
    inning,
    battersStarted: 0,
    runs: 0,
    walks: 0,
    strikeouts: 0,
    hits: 0,
    doubles: 0,
    homeruns: 0,
    longHits: 0,
    centerLongHits: 0,
    firstBatterOnBaseAllowed: false,
    firstPitchStrikes: 0,
    maxPitchStreak: 0,
    weaknessOuts: 0,
    weaknessChoices: 0,
    weaknessPitchSuccesses: 0,
    scoringPositionRuns: 0,
    highlightSuccesses: 0,
    suspicionEnd: 0,
    suspicionTotal: 0,
    suspicionSamples: 0
  };
}

function createStageRunState(stageIndex = 0) {
  const config = stageConfigs[stageIndex] || stageConfigs[0];
  return {
    stageIndex,
    stageId: config.id,
    walks: 0,
    strikeouts: 0,
    hits: 0,
    doubles: 0,
    homeruns: 0,
    longHits: 0,
    suspicionTotal: 0,
    suspicionSamples: 0,
    maxPitchStreak: 0,
    pitchStreakId: "",
    pitchStreak: 0,
    courseStreakKey: "",
    courseStreak: 0,
    missionResults: {},
    missionOverrides: {},
    inningStats: {},
    rewardBoost: { choiceBonus: 0, rareBonus: 0, coreBonus: 0, guaranteedRare: 0, coreChoiceBonus: 0, absorbed: 0 },
    reactionCounts: {},
    recentReactions: [],
    rival: {
      name: "",
      slot: 0,
      plateAppearances: 0,
      onBaseAllowed: 0,
      longHitsAllowed: 0,
      pitchUseCounts: {},
      succeeded: false
    },
    highlight: { active: false, successes: 0, failures: 0, lastText: "" },
    completed: false
  };
}

function ensureStageRunState() {
  if (!state.stageRun || state.stageRun.stageIndex !== state.stageIndex) {
    state.stageRun = createStageRunState(state.stageIndex);
  }
  return state.stageRun;
}

function beginInningTracking(inning = state.inning) {
  const run = ensureStageRunState();
  const stats = createInningStats(inning);
  run.inningStats[inning] = stats;
  state.currentInningStats = stats;
  applyInningStartCardEffects();
}

function currentInningTracking() {
  const run = ensureStageRunState();
  if (!state.currentInningStats || state.currentInningStats.inning !== state.inning) {
    state.currentInningStats = run.inningStats[state.inning] || createInningStats(state.inning);
    run.inningStats[state.inning] = state.currentInningStats;
  }
  return state.currentInningStats;
}

function currentMission() {
  const run = ensureStageRunState();
  if (state.inning === 1) {
    if (!run.missionOverrides[1]) run.missionOverrides[1] = randomFirstInningMission(run.stageIndex);
    return run.missionOverrides[1];
  }
  return stageConfig().missions.find((mission) => mission.inning === state.inning) || null;
}

function randomFirstInningMission(stageIndex = state.stageIndex) {
  const prefix = `s${stageIndex + 1}_i1`;
  return pick([
    { id: `${prefix}_first_strike`, inning: 1, title: "초구 스트라이크 1회 이상", type: "firstPitchStrikesAtLeast", threshold: 1 },
    { id: `${prefix}_no_walk`, inning: 1, title: "볼넷 없이 이닝 종료", type: "noWalk" },
    { id: `${prefix}_low_suspicion`, inning: 1, title: "배합 간파도 낮게 유지", type: "suspicionEndBelow", threshold: 65 },
    { id: `${prefix}_no_three_pitch`, inning: 1, title: "같은 구종 3연속 금지", type: "maxPitchStreakBelow", threshold: 3 }
  ]);
}

function missionActionText(mission) {
  if (!mission) return "이번 이닝에는 추가 과제가 없습니다.";
  switch (mission.type) {
    case "noFirstBatterOnBase":
      return "첫 타자를 내보내지 마세요";
    case "noWalk":
      return "볼넷 없이 이닝을 끝내세요";
    case "suspicionEndBelow":
      return `배합 간파도를 ${mission.threshold}% 이하로 유지하세요`;
    case "firstPitchStrikesAtLeast":
      return `초구 스트라이크를 ${mission.threshold}번 이상 잡으세요`;
    case "maxPitchStreakBelow":
      return `같은 구종을 ${mission.threshold}번 연속 보여주지 마세요`;
    case "weaknessOutsAtLeast":
      return `현재 타자의 공략 보조태그에 맞는 공으로 범타를 ${mission.threshold}번 만드세요`;
    case "weaknessChoiceAtLeast":
      return `현재 타자의 공략 보조태그에 맞는 구종이나 코스를 ${mission.threshold}번 선택하세요`;
    case "noCenterLongHit":
      return "중심 타선에게 장타를 맞지 마세요";
    case "noScoringPositionRun":
      return "득점권에서 실점하지 마세요";
    case "highlightSuccessAtLeast":
      return `하이라이트 승부를 ${mission.threshold}번 성공하세요`;
    case "weaknessPitchSuccessAtLeast":
      return `추천 공략 구종으로 ${mission.threshold}번 성공하세요`;
    case "scorelessInning":
      return "최종 이닝을 무실점으로 막으세요";
    default:
      return mission.title || "이번 이닝 미션을 달성하세요";
  }
}

function missionDisplayName(mission) {
  if (!mission) return "미션 대기";
  const names = {
    noFirstBatterOnBase: "선두 타자 봉쇄",
    noWalk: "볼넷 없는 이닝",
    suspicionEndBelow: "간파 억제",
    firstPitchStrikesAtLeast: "초구 선점",
    maxPitchStreakBelow: "배합 흔들기",
    weaknessOutsAtLeast: "공략 보조태그 활용",
    weaknessChoiceAtLeast: "공략 보조태그 활용",
    noCenterLongHit: "중심 타선 봉쇄",
    noScoringPositionRun: "득점권 위기관리",
    highlightSuccessAtLeast: "하이라이트 승부",
    weaknessPitchSuccessAtLeast: "추천 공략 실행",
    scorelessInning: "무실점 마무리"
  };
  return names[mission.type] || mission.title || "이닝 미션";
}

function missionConditionText(mission) {
  if (!mission) return "다음 미션 대기";
  switch (mission.type) {
    case "noFirstBatterOnBase":
      return "첫 타자 출루 허용 금지";
    case "noWalk":
      return "이닝 종료까지 볼넷 0개";
    case "suspicionEndBelow":
      return `평균 간파도 ${mission.threshold}% 이하`;
    case "firstPitchStrikesAtLeast":
      return `초구 스트라이크 ${mission.threshold}회`;
    case "maxPitchStreakBelow":
      return `같은 구종 ${mission.threshold}연속 금지`;
    case "weaknessOutsAtLeast":
      return `공략 보조태그로 범타 ${mission.threshold}회`;
    case "weaknessChoiceAtLeast":
      return `공략 보조태그에 맞는 선택 ${mission.threshold}회`;
    case "noCenterLongHit":
      return "중심 타선 장타 허용 금지";
    case "noScoringPositionRun":
      return "득점권 실점 허용 금지";
    case "highlightSuccessAtLeast":
      return `하이라이트 승부 성공 ${mission.threshold}회`;
    case "weaknessPitchSuccessAtLeast":
      return `추천 공략 구종 성공 ${mission.threshold}회`;
    case "scorelessInning":
      return "이닝 종료까지 무실점";
    default:
      return mission.title || missionActionText(mission);
  }
}

function missionRewardText() {
  return "성공 시 다음 이닝 첫 타자 공략 보조태그 1개 공개";
}

function rivalActionText(config = stageConfig()) {
  switch (config.id) {
    case "rookie_lineup":
      return "장타를 막으세요. 실투와 반복 패턴이 가장 위험합니다.";
    case "analysis_lineup":
      return "같은 구종을 두 번 이상 보여주지 마세요.";
    case "championship_lineup":
      return "장타를 막고 출루도 1번 이하로 묶으세요.";
    default:
      return config.rival?.goalText || "라이벌의 노림수를 끝까지 숨기고 막아내세요.";
  }
}

function rewardCardById(cardId) {
  return rewardCardCatalog.find((card) => card.id === cardId) || null;
}

function ownedRewardCardId(entry) {
  return typeof entry === "string" ? entry : entry?.cardId || entry?.id || "";
}

function cardStackCount(cardId) {
  return (state.ownedRewardCards || []).filter((entry) => ownedRewardCardId(entry) === cardId).length;
}

function hasRewardCard(cardId) {
  return cardStackCount(cardId) > 0;
}

function ownedCardStacks() {
  const stacks = {};
  (state.ownedRewardCards || []).forEach((entry) => {
    const cardId = ownedRewardCardId(entry);
    if (!cardId) return;
    stacks[cardId] = (stacks[cardId] || 0) + 1;
  });
  return stacks;
}

function ownedRewardCardEntries() {
  return Object.entries(ownedCardStacks())
    .map(([cardId, stack]) => ({ card: rewardCardById(cardId), stack }))
    .filter((entry) => entry.card);
}

function rewardCardCanAppear(card) {
  const stack = cardStackCount(card.id);
  if (card.stackType === "unique") return stack <= 0;
  if (card.stackType === "limited" || card.stackType === "stackable") return stack < (card.maxStack || 1);
  return true;
}

function cardRarityLabel(rarity) {
  return rarity === "core" ? "핵심" : rarity === "rare" ? "희귀" : "일반";
}

function raritySortValue(rarity) {
  return rarity === "core" ? 3 : rarity === "rare" ? 2 : 1;
}

function stageResultStarLabel(stars) {
  const names = stageConfig().starNames || ["클리어", "안정 클리어", "완벽 클리어"];
  return stars >= 3 ? `★★★ ${names[2]}` : stars >= 2 ? `★★ ${names[1]}` : stars >= 1 ? `★ ${names[0]}` : "실패";
}

function suspicionAverageForStage(run = ensureStageRunState()) {
  if (!run.suspicionSamples) return 0;
  return Math.round(run.suspicionTotal / run.suspicionSamples);
}

function isRivalGoalMet(run = ensureStageRunState()) {
  const config = stageConfig(run.stageIndex);
  if (!config.rival) return false;
  if (run.stageIndex === 1) {
    return Object.values(run.rival.pitchUseCounts || {}).every((count) => count < 2);
  }
  if (run.stageIndex === 2) {
    return run.rival.longHitsAllowed <= 0 && run.rival.onBaseAllowed <= 1;
  }
  return run.rival.longHitsAllowed <= 0;
}

function calculateStageResult() {
  const run = ensureStageRunState();
  const config = stageConfig();
  const avgSuspicion = suspicionAverageForStage(run);
  const rivalGoalMet = isRivalGoalMet(run);
  let stars = state.runs <= config.clearRuns ? 1 : 0;
  if (stars && state.runs <= config.stableRuns) stars = 2;
  if (stars && state.runs <= config.perfectRuns) {
    let perfect = true;
    if (state.stageIndex === 0) perfect = run.walks <= 1;
    if (state.stageIndex === 1) perfect = run.maxPitchStreak < 3 && avgSuspicion <= 55;
    if (state.stageIndex === 2) perfect = rivalGoalMet && avgSuspicion <= 60;
    if (perfect) stars = 3;
  }
  run.rival.succeeded = rivalGoalMet;
  return {
    stageIndex: state.stageIndex,
    stageName: config.name,
    innings: config.innings,
    runs: state.runs,
    walks: run.walks,
    strikeouts: run.strikeouts,
    hits: run.hits,
    doubles: run.doubles,
    homeruns: run.homeruns,
    longHits: run.longHits,
    suspicionAverage: avgSuspicion,
    stars,
    starLabel: stageResultStarLabel(stars),
    rivalGoalMet,
    highlightSuccesses: run.highlight.successes,
    highlightFailures: run.highlight.failures,
    rewardBoost: { ...run.rewardBoost }
  };
}

function stageRewardRarityPlan(result) {
  const stageIndex = result.stageIndex;
  const stars = result.stars;
  const base =
    stageIndex === 0
      ? { common: 0.8, rare: 0.2, core: 0 }
      : stageIndex === 1
        ? { common: 0.6, rare: 0.35, core: 0.05 }
        : { common: 0.45, rare: 0.4, core: 0.15 };
  const starBonus = Math.max(0, stars - 1);
  const rareChance = clamp(base.rare + starBonus * 0.04 + (result.rewardBoost.rareBonus || 0), 0, 0.75);
  const coreChance = clamp(base.core + starBonus * 0.015 + (result.rewardBoost.coreBonus || 0), 0, stageIndex >= 2 ? 0.28 : 0.1);
  return Array.from({ length: 3 }, () => {
    const roll = Math.random();
    if (roll < coreChance) return "core";
    if (roll < coreChance + rareChance) return "rare";
    return "common";
  });
}

function pickRewardCardByRarity(rarity, usedIds = new Set()) {
  const canUse = (card) => !STAGE_CARD_EXCLUDED_IDS.has(card.id) && !usedIds.has(card.id) && rewardCardCanAppear(card);
  const candidates = rewardCardCatalog.filter((card) => card.rarity === rarity && canUse(card));
  const fallback = rewardCardCatalog.filter(canUse);
  return pick(candidates.length ? candidates : fallback);
}

function toRewardCardChoice(card, reason = "") {
  return {
    type: "rewardCard",
    cardId: card.id,
    rarity: card.rarity,
    title: card.name,
    desc: card.description,
    effectText: card.effectText,
    triggerCondition: card.triggerCondition,
    cardType: card.type,
    synergyTags: card.synergyTags || [],
    stackType: card.stackType,
    maxStack: card.maxStack,
    recommendReason: reason
  };
}

function recentConditionalCardTypes() {
  const history = ensurePitcherGrowthFields()?.rewardHistory?.conditionTypesByStage || [];
  return new Set(
    history
      .filter((item) => state.stageIndex - (item.stageIndex ?? -99) < CONDITIONAL_CARD_RULES.preventSameTypeRepeatStages)
      .map((item) => item.type)
  );
}

function markConditionalCardType(reward) {
  if (!reward?.conditionType) return;
  const pitcher = ensurePitcherGrowthFields();
  if (!pitcher) return;
  const history = pitcher.rewardHistory.conditionTypesByStage || [];
  history.push({ stageIndex: state.stageIndex, type: reward.conditionType });
  pitcher.rewardHistory.conditionTypesByStage = history.slice(-8);
}

function conditionalStageCardCandidates(result) {
  const blocked = recentConditionalCardTypes();
  const choices = [];
  if (!blocked.has("pitchUpgrade") && MP.collectPitchUpgradeCandidates && MP.pickWeightedPitchUpgrades) {
    const picked = MP.pickWeightedPitchUpgrades(MP.collectPitchUpgradeCandidates("스테이지 보상", result), 1)[0];
    if (picked) choices.push({ ...picked, rarity: "rare", conditionType: "pitchUpgrade", recommendReason: "조건 카드" });
  }
  if (!blocked.has("weaknessMitigation")) {
    const weaknessId =
      state.pitcher?.weaknessTagId ||
      state.pitcher?.revealedWeaknessTags?.[0] ||
      state.pitcher?.hiddenWeaknessTags?.[0] ||
      null;
    if (weaknessId) {
      const tag = tagById(weaknessId);
      choices.push({
        type: "weaknessMitigation",
        weaknessTagId: weaknessId,
        rarity: "rare",
        conditionType: "weaknessMitigation",
        title: `${tag?.name || "약점"} 완화`,
        desc: "투수의 약한 흐름 하나를 덜어냅니다.",
        effectText: "약점 태그 1개 완화",
        operation: "다음 스테이지부터 해당 약점 노출을 줄입니다.",
        recommendReason: "조건 카드"
      });
    }
  }
  if (!blocked.has("bonusTag")) {
    const tagChoice = generateStageTagChoices()[0];
    if (tagChoice) choices.push({ ...tagChoice, rarity: "rare", conditionType: "bonusTag", recommendReason: "조건 카드" });
  }
  return choices;
}

function generateStageCardChoices() {
  const result = state.lastStageResult || calculateStageResult();
  const run = ensureStageRunState();
  const maxStageCardChoices = 3;
  const used = new Set();
  const choices = [];
  const guaranteedRare = Math.min(
    1,
    (result.rivalGoalMet ? (stageConfig(result.stageIndex).rival?.reward?.guaranteedRare || 0) : 0) +
      (run.rewardBoost.guaranteedRare || 0)
  );
  const coreChoiceBonus =
    (result.rivalGoalMet ? (stageConfig(result.stageIndex).rival?.reward?.coreChoiceBonus || 0) : 0) +
    (run.rewardBoost.coreChoiceBonus || 0);
  const extraChoiceQuality =
    (result.rivalGoalMet ? (stageConfig(result.stageIndex).rival?.reward?.choiceBonus || 0) : 0) +
    (run.rewardBoost.choiceBonus || 0) +
    (run.highlight.successes && hasRewardCard("R013") ? 1 : 0);
  const conditionChoice = sample(conditionalStageCardCandidates(result), 1)[0] || null;
  const normalCount = conditionChoice ? 1 : 2;
  while (choices.length < normalCount) {
    const card = pickRewardCardByRarity("common", used);
    if (!card) break;
    used.add(card.id);
    choices.push(toRewardCardChoice(card, `${result.starLabel} 보상`));
  }
  if (conditionChoice) choices.push(conditionChoice);
  const plan = stageRewardRarityPlan(result);
  let gradeRarity = coreChoiceBonus > 0 ? "core" : guaranteedRare > 0 || extraChoiceQuality > 0 ? "rare" : plan.find((rarity) => rarity !== "common") || "rare";
  const gradeCard = pickRewardCardByRarity(gradeRarity, used) || pickRewardCardByRarity("rare", used);
  if (gradeCard) {
    used.add(gradeCard.id);
    choices.push(toRewardCardChoice(gradeCard, gradeRarity === "core" ? "핵심 보상" : "등급 보상"));
  }
  while (choices.length < maxStageCardChoices) {
    const card = pickRewardCardByRarity("common", used);
    if (!card) break;
    used.add(card.id);
    choices.push(toRewardCardChoice(card, `${result.starLabel} 보상`));
  }
  return choices.slice(0, maxStageCardChoices);
}

function cardEffectMultiplier() {
  return hasRewardCard("K004") ? 1.3 : 1;
}

function addCardTriggerLog(cardName, text) {
  if (!cardName || !text) return;
  state.cardTriggerLog = [{ cardName, text }, ...(state.cardTriggerLog || [])].slice(0, 5);
  addLog("카드 효과 발동", `${escapeHtml(cardName)}: ${escapeHtml(text)}`);
}

function addTagTriggerLog(tagName, text) {
  if (!tagName || !text) return;
  state.cardTriggerLog = [{ cardName: tagName, text }, ...(state.cardTriggerLog || [])].slice(0, 5);
  addLog("태그 효과 발동", `${escapeHtml(tagName)}: ${escapeHtml(text)}`);
}

function pitchEffectChanged(before, after) {
  return ["quality", "swing", "chase", "contact", "contactQuality", "doublePlayBonus"].some((key) => before[key] !== after[key]);
}

function applyCardSuspicionDelta(delta, cardName, text) {
  if (!delta || !state.atBat) return;
  state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + delta, 0, 100);
  addCardTriggerLog(cardName, text);
}

function revealBatterWeakness(batter, options = {}) {
  if (!batter?.weaknessTags?.length) return null;
  const revealed = new Set(batter.revealedWeaknessTagIds || []);
  let hidden = batter.weaknessTags.filter((id) => !revealed.has(id));
  if (options.category) {
    const preferred = hidden.filter((id) => batterWeaknessById(id)?.category === options.category);
    if (preferred.length) hidden = preferred;
  }
  if (!hidden.length) return null;
  const tagId = pick(hidden);
  batter.revealedWeaknessTagIds = [...new Set([...(batter.revealedWeaknessTagIds || []), tagId])];
  const tag = batterWeaknessById(tagId);
  const label = options.label || "공략 보조태그 공개";
  addLog(label, `${batter.name}: ${tag?.name || tagId}`);
  showTutorialStep("weakness");
  showEventBanner("다음타자\n약점공개", "reward", GAME_TIMING.weaknessBanner);
  return tag;
}

function markBatterWeaknessCandidates(batter, count = 2, options = {}) {
  if (!batter?.weaknessTags?.length) return [];
  let pool = batter.weaknessTags.slice();
  if (options.category) {
    const preferred = pool.filter((id) => batterWeaknessById(id)?.category === options.category);
    if (preferred.length) pool = preferred;
  }
  const revealed = new Set(batter.revealedWeaknessTagIds || []);
  const already = new Set([...(batter.candidateWeaknessTagIds || []), ...revealed]);
  const picked = sample(pool.filter((id) => !already.has(id)), count);
  batter.candidateWeaknessTagIds = [...new Set([...(batter.candidateWeaknessTagIds || []), ...picked])];
  if (picked.length) {
    addLog("후보 단서 확인", `${batter.name}: ${picked.map((id) => batterWeaknessById(id)?.name || id).join(", ")}`);
    showTutorialStep("weakness");
  }
  return picked;
}

function currentStageRival() {
  const run = ensureStageRunState();
  const byFlag = state.lineup?.find((batter) => batter.isRival);
  if (byFlag) return byFlag;
  if (run.rival?.slot) {
    return state.lineup?.find((batter) => batter.slot === run.rival.slot) || null;
  }
  return null;
}

function revealRivalWeakness(options = {}) {
  const rival = currentStageRival();
  const label = options.label || "라이벌 공략 보조태그 공개";
  if (!rival) {
    addLog(label, "라이벌 타자를 찾지 못했습니다.");
    return null;
  }
  const tag = revealBatterWeakness(rival, { ...options, label });
  if (!tag) addLog(label, `${rival.name}: 남은 공략 보조태그가 없습니다.`);
  return tag;
}

function markUpcomingBatterWeaknessCandidates(count = 2, options = {}) {
  const batter = nextScheduledBatter() || currentBatter();
  return markBatterWeaknessCandidates(batter, count, options);
}

function batterOutcomeRiskChips(batter) {
  const stats = batter?.stats || {};
  const chips = [];
  if ((stats.컨택 || 0) >= 70) chips.push({ label: "안타 위험", className: "hit" });
  if ((stats.파워 || 0) >= 70 || batter?.isBoss) chips.push({ label: "장타 위험", className: "power" });
  if ((stats.선구 || 0) >= 70) chips.push({ label: "볼넷 위험", className: "walk" });
  if ((stats.주력 || 0) >= 75) chips.push({ label: "주루 위험", className: "speed" });
  if (!chips.length) chips.push({ label: "범타 유도 가능", className: "safe" });
  return chips.slice(0, 3);
}

function revealUpcomingBatterWeakness(options = {}) {
  if (!state.lineup?.length) return null;
  for (let offset = 1; offset <= state.lineup.length; offset += 1) {
    const batter = state.lineup[(state.batterIndex + offset) % state.lineup.length];
    const revealed = new Set(batter?.revealedWeaknessTagIds || []);
    const hasHidden = (batter?.weaknessTags || []).some((tagId) => !revealed.has(tagId));
    if (!hasHidden) continue;
    return revealBatterWeakness(batter, { ...options, label: "다음 타자 약점태그 공개" });
  }
  return null;
}

function batterWeaknessById(tagId) {
  return batterWeaknessCatalog.find((tag) => tag.id === tagId) || null;
}

function pitchMatchesWeaknessTag(tag, pitch, location) {
  if (!tag || !pitch || !location) return false;
  const side = locationSideFromRowCol(location.row, location.col);
  const height = locationHeightFromRowCol(location.row);
  const recommended = tag.recommendedPitchTypes || [];
  const pitchMatch = recommended.length ? recommended.includes(pitch.id) : tag.category === "pitchType" && pitch.category !== "fast";
  const zoneMatch =
    tag.recommendedZones?.includes(height) ||
    tag.recommendedZones?.includes(side) ||
    (tag.recommendedZones?.includes("edge") && (side === "inside" || side === "outside"));
  return Boolean(pitchMatch && zoneMatch);
}

function missionNeedsWeaknessTarget(mission) {
  return ["weaknessOutsAtLeast", "weaknessPitchSuccessAtLeast", "weaknessChoiceAtLeast"].includes(mission?.type);
}

function batterHasRevealedWeakness(batter) {
  const revealed = new Set(batter?.revealedWeaknessTagIds || []);
  return (batter?.weaknessTags || []).some((tagId) => revealed.has(tagId));
}

function ensureMissionWeaknessTargetForCurrentBatter() {
  const mission = currentMission();
  if (!missionNeedsWeaknessTarget(mission)) return;
  const stats = currentInningTracking();
  if (stats.missionWeaknessRevealDone) return;
  const batter = currentBatter();
  if (!batterHasRevealedWeakness(batter)) revealBatterWeakness(batter, { label: "공략 보조태그 공개" });
  stats.missionWeaknessRevealDone = true;
}

function pitchMatchesRevealedWeakness(result) {
  const batter = result?.batter;
  if (!batter?.revealedWeaknessTagIds?.length) return false;
  return batter.revealedWeaknessTagIds
    .map(batterWeaknessById)
    .some((tag) => pitchMatchesWeaknessTag(tag, result.pitch, result.location));
}

function plannedCourseMatchesRevealedWeakness(result, plannedCourse) {
  const batter = result?.batter;
  if (!batter?.revealedWeaknessTagIds?.length || !result?.pitch || !plannedCourse) return false;
  const plannedLocation = intendedCourse(
    plannedCourse.zone,
    plannedCourse.intent,
    plannedCourse.targetRow,
    plannedCourse.targetCol
  );
  return batter.revealedWeaknessTagIds
    .map(batterWeaknessById)
    .some((tag) => pitchMatchesWeaknessTag(tag, result.pitch, plannedLocation));
}

function missionSuccess(mission, stats) {
  if (!mission || !stats) return false;
  switch (mission.type) {
    case "noFirstBatterOnBase":
      return !stats.firstBatterOnBaseAllowed;
    case "noWalk":
      return stats.walks === 0;
    case "suspicionEndBelow":
      return (stats.suspicionSamples ? Math.round(stats.suspicionTotal / stats.suspicionSamples) : stats.suspicionEnd) <= mission.threshold;
    case "firstPitchStrikesAtLeast":
      return stats.firstPitchStrikes >= mission.threshold;
    case "maxPitchStreakBelow":
      return stats.maxPitchStreak < mission.threshold;
    case "weaknessOutsAtLeast":
      return stats.weaknessOuts >= mission.threshold;
    case "weaknessChoiceAtLeast":
      return stats.weaknessChoices >= mission.threshold;
    case "noCenterLongHit":
      return stats.centerLongHits === 0;
    case "noScoringPositionRun":
      return stats.scoringPositionRuns === 0;
    case "highlightSuccessAtLeast":
      return stats.highlightSuccesses >= mission.threshold;
    case "weaknessPitchSuccessAtLeast":
      return stats.weaknessPitchSuccesses >= mission.threshold;
    case "scorelessInning":
      return stats.runs === 0;
    default:
      return false;
  }
}

function liveMissionStatus(mission, stats, missionResult = null) {
  if (!mission) return { label: "대기 중", className: "" };
  if (missionResult) {
    return missionResult.success
      ? { label: "달성 완료", className: "is-complete" }
      : { label: "실패", className: "is-fail" };
  }
  if (!stats) return { label: "진행 중", className: "" };
  switch (mission.type) {
    case "noFirstBatterOnBase":
      if (stats.firstBatterOnBaseAllowed) return { label: "실패", className: "is-fail" };
      if (stats.battersStarted > 1) return { label: "달성 완료", className: "is-complete" };
      return { label: "진행 중", className: "" };
    case "firstPitchStrikesAtLeast":
      return stats.firstPitchStrikes >= mission.threshold
        ? { label: "달성 완료", className: "is-complete" }
        : { label: `진행 중 ${stats.firstPitchStrikes}/${mission.threshold}`, className: "" };
    case "weaknessOutsAtLeast":
      return stats.weaknessOuts >= mission.threshold
        ? { label: "달성 완료", className: "is-complete" }
        : { label: `진행 중 ${stats.weaknessOuts}/${mission.threshold}`, className: "" };
    case "weaknessChoiceAtLeast":
      return stats.weaknessChoices >= mission.threshold
        ? { label: "달성 완료", className: "is-complete" }
        : { label: `진행 중 ${stats.weaknessChoices}/${mission.threshold}`, className: "" };
    case "highlightSuccessAtLeast":
      return stats.highlightSuccesses >= mission.threshold
        ? { label: "달성 완료", className: "is-complete" }
        : { label: `진행 중 ${stats.highlightSuccesses}/${mission.threshold}`, className: "" };
    case "weaknessPitchSuccessAtLeast":
      return stats.weaknessPitchSuccesses >= mission.threshold
        ? { label: "달성 완료", className: "is-complete" }
        : { label: `진행 중 ${stats.weaknessPitchSuccesses}/${mission.threshold}`, className: "" };
    default:
      return { label: "진행 중", className: "" };
  }
}

function missionDetailText(mission, stats) {
  if (!mission) return "다음 이닝 미션을 기다리는 중";
  switch (mission.type) {
    case "suspicionEndBelow": {
      const average = stats?.suspicionSamples ? Math.round(stats.suspicionTotal / stats.suspicionSamples) : 0;
      return `이번 이닝 평균 간파도 ${mission.threshold}% 이하|현재 평균 ${average}%`;
    }
    case "noWalk":
      return `이닝 종료까지 볼넷 0개|현재 ${stats?.walks || 0}개`;
    case "scorelessInning":
      return `이닝 종료까지 무실점|현재 ${stats?.runs || 0}실점`;
    case "maxPitchStreakBelow":
      return `같은 구종 ${mission.threshold}연속 금지|현재 최대 ${stats?.maxPitchStreak || 0}연속`;
    case "weaknessChoiceAtLeast":
      return `공략 보조태그에 맞는 구종이나 코스 선택|현재 ${stats?.weaknessChoices || 0}/${mission.threshold}`;
    default:
      return missionActionText(mission);
  }
}

function missionFocusHighlightHtml(text) {
  if (!text) return "";
  const escaped = escapeHtml(text);
  return escaped.replace(/(\d+(?:\.\d+)?(?:개|회|%)?)/g, '<em class="mission-focus-highlight">$1</em>');
}

function missionCompactStatus(liveStatus) {
  const label = liveStatus?.label || "진행";
  if (liveStatus?.className === "is-complete") return "완료";
  if (liveStatus?.className === "is-fail") return "실패";
  const progress = label.match(/\d+\/\d+/)?.[0];
  return progress || "진행";
}

function finalizeInningMission(inningNumber) {
  const run = ensureStageRunState();
  const stats = run.inningStats[inningNumber] || state.currentInningStats;
  const mission = stageConfig().missions.find((item) => item.inning === inningNumber);
  if (!mission || !stats) return null;
  stats.suspicionEnd = Math.round(state.atBat?.suspicion || stats.suspicionEnd || 0);
  const success = missionSuccess(mission, stats);
  run.missionResults[mission.id] = { mission, success };
  if (success) {
    if (hasRewardCard("C013")) run.rewardBoost.choiceBonus += cardStackCount("C013");
    if (dugoutEffectValue("missionChoiceBonus")) run.rewardBoost.choiceBonus += dugoutEffectValue("missionChoiceBonus");
    const revealed = revealUpcomingBatterWeakness();
    addLog("이닝 미션 성공", `${missionActionText(mission)}${revealed ? " · 다음 이닝 첫 타자 공략 보조태그 1개 공개" : ""}`);
  } else {
    if (state.stageIndex === 1 && state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + 5, 0, 100);
    if (state.stageIndex === 2) state.nextBatterSuspicionBonus += 10;
    addLog("이닝 미션 실패", `${missionActionText(mission)} · 다음 이닝은 공략 보조태그 없이 시작합니다.`);
  }
  activeDugoutEffectEntries().forEach((entry) => {
    if (entry.expiresInning !== inningNumber) return;
    if (entry.effects?.scorelessGuaranteedRare && stats.runs === 0) {
      run.rewardBoost.guaranteedRare += entry.effects.scorelessGuaranteedRare;
      addLog("보상 강화", `${entry.title}: 무실점 이닝으로 희귀 카드 선택지 +1`);
    } else if (entry.effects?.scorelessRiskSuspicion && stats.runs > 0) {
      state.nextBatterSuspicionBonus += entry.effects.scorelessRiskSuspicion;
      addLog("도박형 작전 실패", `${entry.title}: 실점으로 다음 타자가 같은 흐름을 더 빨리 기다립니다.`);
    }
    if (entry.effects?.rivalCoreChoiceBonus && run.rival.longHitsAllowed <= 0) {
      run.rewardBoost.coreChoiceBonus += entry.effects.rivalCoreChoiceBonus;
    }
  });
  return { mission, success };
}

function isStageClearedNow() {
  return state.inning > currentStageInnings();
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

function pickBatterWeaknessTags(slot, isBoss) {
  const count = isBoss ? rand(2, 3) : slot >= 3 && slot <= 5 ? 2 : 1;
  const preferred = batterWeaknessCatalog.filter((tag) => {
    if (slot <= 2) return ["count", "zone", "psychology"].includes(tag.category);
    if (slot <= 5) return ["pitchType", "zone", "psychology"].includes(tag.category);
    return true;
  });
  return sample(preferred.length ? preferred : batterWeaknessCatalog, count).map((tag) => tag.id);
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

  function weaknessRepeatScale(tagId) {
    const counts = state.atBat?.weaknessUseCounts || {};
    const nextCount = (counts[tagId] || 0) + 1;
    if (state.atBat) state.atBat.weaknessUseCounts = { ...counts, [tagId]: nextCount };
    if (nextCount <= 1) return 1;
    if (nextCount === 2) {
      adjustBatterMind({ confidence: 3, microRead: "약점 코스 대기" }, batter);
      if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(4), 0, 100);
      return 0.65;
    }
    if (nextCount === 3) {
      adjustBatterMind({ confidence: 6, timing: 3, microRead: "약점 코스 대기" }, batter);
      if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(9), 0, 100);
      return 0.35;
    }
    adjustBatterMind({ confidence: 10, timing: 5, confusion: -4, microRead: "약점 코스 대기" }, batter);
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(14), 0, 100);
    return 0.18;
  }

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

  (batter.weaknessTags || []).forEach((tagId) => {
    const tag = batterWeaknessById(tagId);
    if (!tag || !pitchMatchesWeaknessTag(tag, pitch, location)) return;
    const effects = tag.effects || {};
    const scale = weaknessRepeatScale(tagId);
    effect.swing += (effects.swing || 0) * scale;
    effect.chase += effects.scoringChase && (state.bases[1] || state.bases[2]) ? effects.scoringChase * scale : 0;
    effect.contact += (effects.contact || 0) * scale;
    effect.foul += (effects.foul || 0) * scale;
    effect.contactQuality += (effects.contactQuality || 0) * scale;
    if (scale <= 0.35) {
      effect.contact += scale <= 0.2 ? 0.06 : 0.03;
      effect.contactQuality += scale <= 0.2 ? 10 : 5;
    }
    if (effects.firstPitchSwing && isFirstPitch) effect.swing += effects.firstPitchSwing * scale;
    if (effects.twoStrikeSwing && state.strikes >= 2) effect.swing += effects.twoStrikeSwing * scale;
    if (effects.fullCountContact && isFullCount) effect.contact += effects.fullCountContact * scale;
    effect.label = tag.name;
  });

  effect.chase = clamp(effect.chase, -0.18, 0.18);
  effect.foul = clamp(effect.foul, 0, 0.22);
  return effect;
}

function countKey() {
  return `${state.balls}-${state.strikes}`;
}

function absorbCardPerformance(rareBonus = 0.03, coreBonus = 0) {
  const boost = ensureStageRunState().rewardBoost;
  boost.absorbed = (boost.absorbed || 0) + 1;
  boost.rareBonus += rareBonus;
  boost.coreBonus += coreBonus;
}

const COUNT_PRESSURE = {
  "0-0": { label: "기본 상태", swingInZone: 0, swingOutZone: 0, contact: 0, foul: 0, contactQuality: 0 },
  "1-0": { label: "존 안 공 예상", swingInZone: 0.04, swingOutZone: -0.03, contact: 0.02, foul: 0.01, contactQuality: 2 },
  "2-0": { label: "스트라이크 대기", swingInZone: 0.08, swingOutZone: -0.06, contact: 0.05, foul: 0.02, contactQuality: 6 },
  "3-0": { label: "볼넷 대기", swingInZone: -0.18, swingOutZone: -0.14, contact: 0.03, foul: 0, contactQuality: 4 },
  "0-1": { label: "의도 탐색", swingInZone: -0.02, swingOutZone: 0.02, contact: -0.01, foul: 0.01, contactQuality: -1 },
  "0-2": { label: "유인 경계", swingInZone: 0.03, swingOutZone: -0.05, contact: 0.03, foul: 0.1, contactQuality: -3 },
  "1-1": { label: "균형 카운트", swingInZone: 0.02, swingOutZone: 0, contact: 0.01, foul: 0.02, contactQuality: 1 },
  "1-2": { label: "보호 스윙", swingInZone: 0.05, swingOutZone: -0.02, contact: 0.04, foul: 0.11, contactQuality: -2 },
  "2-1": { label: "존 승부 의식", swingInZone: 0.05, swingOutZone: -0.02, contact: 0.03, foul: 0.02, contactQuality: 3 },
  "2-2": { label: "유인과 존 승부", swingInZone: 0.04, swingOutZone: 0.01, contact: 0.03, foul: 0.07, contactQuality: 1 },
  "3-1": { label: "존 안 공 대기", swingInZone: 0.1, swingOutZone: -0.09, contact: 0.07, foul: 0.03, contactQuality: 8 },
  "3-2": { label: "풀카운트 압박", swingInZone: 0.09, swingOutZone: -0.02, contact: 0.08, foul: 0.12, contactQuality: 5 }
};

function countPressureProfile(balls = state.balls, strikes = state.strikes) {
  return COUNT_PRESSURE[`${balls}-${strikes}`] || COUNT_PRESSURE["0-0"];
}

function runnersKey() {
  const runners = state.bases.map((occupied, index) => (occupied ? index + 1 : "")).filter(Boolean).join("");
  return runners || "empty";
}

function zoneSide(zone) {
  const col = courseZones[zone]?.col ?? 1;
  if (col <= 0) return "outside";
  if (col >= 2) return "inside";
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
  return category || "unknown";
}

function isTargetedPitchCategory(pitchCategory, targetCategory) {
  return pitchCategory === targetCategory;
}

function targetRevealText(result) {
  const target = state.atBat?.target;
  if (!target) return "";
  const pitchCategory = result.pitch?.category;
  if (isTargetedPitchCategory(pitchCategory, target)) {
    if (pitchCategory !== target) return "타자는 변화구 계열을 노렸습니다.";
    return `${categoryNames[target]} 노림이었습니다.`;
  }
  return `타자의 ${categoryNames[target]} 노림을 읽고, ${categoryNames[pitchCategory]}로 빗겨냈습니다.`;
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
  const displayResult = result.displayResult || pitchDisplayResult(result);
  const displayReaction = result.displayReaction || pitchDisplayReaction(result);
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
      <p><b>${escapeHtml(displayResult)}</b><i>→</i><em>${escapeHtml(displayReaction)}</em></p>
      <p class="log-muted">이번 타자 ${currentAtBatPitchCount()}구 · ${escapeHtml(result.location?.actualLabel || "중앙")} · ${escapeHtml(result.countPressureLabel || countPressureProfile().label)}</p>
      ${ballPlan}
      <p class="log-muted">${escapeHtml(result.clue || result.detail || "")}</p>
      ${patternLine}
      ${memoryLines}
      ${falseLine}
      ${extraLines.map((line) => `<p class="log-muted">${escapeHtml(line)}</p>`).join("")}
    </div>
  `;
}

function pitchDisplayResult(result) {
  return (
    {
      ball: "볼",
      calledStrike: "스트라이크",
      swingingStrike: "헛스윙",
      foul: "파울",
      inPlayOut: "범타",
      doublePlay: "병살",
      single: "안타",
      double: "장타",
      homerun: "홈런",
      error: "실책",
      walk: "볼넷"
    }[result?.result] || "결과"
  );
}

function locationSideTag(location) {
  const col = Number(location?.col);
  if (col <= 0) return "outside";
  if (col >= 2) return "inside";
  return "middle";
}

function locationHeightTag(location) {
  const row = Number(location?.row);
  if (row <= 0) return "high";
  if (row >= 2) return "low";
  return "middle";
}

function pitchDisplayReaction(result) {
  if (!result) return "타자 반응을 확인했습니다";
  const side = locationSideTag(result.location);
  const height = locationHeightTag(result.location);
  const ballIntent = result.pattern?.ballIntent || "";
  const timing = result.timingLabel || "";
  const count = result.countBefore || countKey();

  if (result.result === "calledStrike") {
    if (!result.targetMatch) return "노림이 빗나갔습니다";
    if (side === "inside") return "몸쪽에 손이 묶였습니다";
    if (side === "outside") return "바깥쪽을 놓쳤습니다";
    if (height === "low") return "낮은 코스를 놓쳤습니다";
    if (result.pitch?.category === "fast") return "빠른 공에 손이 안 나왔습니다";
    return count === "0-0" ? "지켜봤습니다" : "존 끝에 걸쳤습니다";
  }

  if (result.result === "swingingStrike") {
    if (!result.inZone && ballIntent) return "유인구에 끌려나왔습니다";
    if (timing === "너무 빠름" || result.timingValue > 0.7) return "스윙이 빨랐습니다";
    if (timing === "늦음" || result.timingValue < 0.45) return "스윙이 늦었습니다";
    if (!result.targetMatch || timing === "완전히 속음") return "완전히 속았습니다";
    return "완전히 속았습니다";
  }

  if (result.result === "foul") {
    if (state.strikes >= 2) return "겨우 걷어냈습니다";
    if (result.targetMatch && result.timingValue >= 0.5 && result.timingValue <= 0.72) return "정타에 가까웠습니다";
    if (timing === "너무 빠름" || result.timingValue > 0.7) return "스윙이 빨랐습니다";
    if (timing === "늦음" || result.timingValue < 0.45) return "스윙이 늦었습니다";
    return "겨우 걷어냈습니다";
  }

  if (result.result === "ball") {
    if (ballIntent === "brush" || side === "inside") return "몸쪽을 의식했습니다";
    if (ballIntent === "fishing") return "속지 않았습니다";
    if (count.startsWith("3-")) return "끝까지 골라냈습니다";
    if (ballIntent === "show") return "타자가 쉽게 참았습니다";
    return "여유 있게 골랐습니다";
  }

  if (result.result === "inPlayOut") {
    if (/GROUND/i.test(result.outLabel || "") && height === "low") return "약한 땅볼이 나왔습니다";
    if (side === "inside") return "먹힌 타구가 나왔습니다";
    if (count.endsWith("-2") || count === "3-2") return "급하게 쳤습니다";
    if (/FLY/i.test(result.outLabel || "")) return "얕은 뜬공이 나왔습니다";
    return "배트 중심을 피했습니다";
  }

  if (result.result === "doublePlay") {
    if (height === "low") return "낮은 공에 배트가 눌렸습니다";
    if (side === "inside") return "먹힌 타구가 나왔습니다";
    if (count.endsWith("-2") || count === "3-2") return "급하게 쳤습니다";
    return "배트 중심을 피했습니다";
  }

  if (result.result === "single") {
    if (result.targetMatch) return "타이밍이 맞았습니다";
    if (side === "outside") return "바깥쪽을 따라왔습니다";
    if (result.pitch?.category === "fast") return "빠른 공을 따라왔습니다";
    return "코스를 맞혀냈습니다";
  }
  if (result.result === "double") return result.targetMatch ? "정타로 맞았습니다" : "실투를 놓치지 않았습니다";
  if (result.result === "homerun") return result.targetMatch ? "완전히 읽혔습니다" : "타자가 완벽하게 때렸습니다";
  if (result.result === "error") return "수비가 처리하지 못했습니다";
  return "타자 반응을 확인했습니다";
}

function pitchReactionTag(result) {
  const reaction = result?.displayReaction || pitchDisplayReaction(result);
  if (/늦|손이 안/.test(reaction)) return "fastLate";
  if (/빨랐/.test(reaction)) return "swingEarly";
  if (/유인구|속지|참았|골라|스윙을 멈/.test(reaction)) return "chaseRead";
  if (/몸쪽/.test(reaction)) return "insideAware";
  if (/바깥쪽/.test(reaction)) return "outsideMiss";
  if (/정타|완벽|읽혔|실투/.test(reaction)) return "hardContactRisk";
  if (/겨우|보호/.test(reaction)) return "protectSwing";
  if (/노림/.test(reaction)) return "targetMiss";
  if (/급하게|약한|먹힌|중심/.test(reaction)) return "weakContact";
  return "neutral";
}

function enrichPitchDisplay(result) {
  if (!result) return result;
  result.displayResult = pitchDisplayResult(result);
  result.displayReaction = pitchDisplayReaction(result);
  result.reactionTag = pitchReactionTag(result);
  result.countPressureLabel = countPressureProfile(...String(result.countBefore || countKey()).split("-").map((value) => Number(value))).label;
  return result;
}

function recordPitchReactionSummary(result) {
  if (!result?.reactionTag) return;
  const run = ensureStageRunState();
  run.reactionCounts = run.reactionCounts || {};
  run.reactionCounts[result.reactionTag] = (run.reactionCounts[result.reactionTag] || 0) + 1;
  run.recentReactions = [
    {
      tag: result.reactionTag,
      result: result.displayResult,
      reaction: result.displayReaction,
      count: result.countBefore || countKey(),
      pitchId: result.pitch?.id || ""
    },
    ...(run.recentReactions || [])
  ].slice(0, 12);
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

function batterMindStageMultiplier() {
  return batterMindStageMultipliers[state.stageIndex] || 1;
}

function scaleMindDelta(value) {
  return Math.round(value * batterMindStageMultiplier());
}

function clampBatterMindValue(key, value) {
  const [min, max] = BATTER_MIND_LIMITS[key] || [0, 100];
  return clamp(Math.round(value), min, max);
}

function stageThemeMindSeed(batter) {
  const theme = MP.getStageTheme?.(state.stageThemeId);
  const rivalPattern = batter?.rivalPatternId ? rivalPsychPatterns[batter.rivalPatternId] : null;
  if (!theme && !rivalPattern) return {};
  const stageStrength = MP.stageThemeStrengthFor?.(state.stageIndex) ?? 1;
  const affinityScale = { strong: 1, medium: 0.6, weak: 0.25, exception: -0.45 };
  const affinity = affinityScale[batter?.themeAffinity || "medium"] ?? 0.6;
  const amount = (value) => Math.round(value * stageStrength * affinity);
  const seed = {};
  const add = (key, value) => {
    const next = amount(value);
    if (next) seed[key] = (seed[key] || 0) + next;
  };

  switch (theme?.id) {
    case "contact":
      add("timing", 5);
      seed.microRead = "보호 스윙";
      break;
    case "power":
      add("confidence", 6);
      seed.microRead = "장타 노림";
      break;
    case "eye":
    case "patience":
      add("confidence", 4);
      add("confusion", -3);
      seed.microRead = "선구 모드";
      break;
    case "tricky":
      add("confidence", 3);
      add("timing", 2);
      break;
    case "first_pitch":
      add("timing", 4);
      add("pressure", 2);
      seed.microRead = "직구 기준";
      break;
    case "bottom_revolt":
      if ((batter?.slot || 1) >= 7) {
        add("timing", 5);
        add("confidence", 3);
      }
      break;
    default:
      break;
  }
  if (rivalPattern?.id === "leadoffProbe") {
    add("confidence", 3);
    add("confusion", -2);
    seed.microRead = rivalPattern.microRead;
  } else if (rivalPattern?.id === "patternReader") {
    add("timing", 4);
    add("confidence", 4);
    seed.microRead = rivalPattern.microRead;
  } else if (rivalPattern?.id === "clutchSlugger") {
    add("confidence", 6);
    add("pressure", 3);
    seed.microRead = rivalPattern.microRead;
  }
  return seed;
}

function createBatterMind(batter) {
  const themeSeed = stageThemeMindSeed(batter);
  return {
    timing: clampBatterMindValue("timing", Math.round((batter?.stats?.예측 || 50) / 10) + (themeSeed.timing || 0)),
    confidence: clampBatterMindValue("confidence", (batter?.isBoss ? 14 : 6) + (themeSeed.confidence || 0)),
    confusion: clampBatterMindValue("confusion", themeSeed.confusion || 0),
    pressure: clampBatterMindValue("pressure", (batter?.isRival ? 4 : 0) + (themeSeed.pressure || 0)),
    plateAware: 0,
    microRead: themeSeed.microRead || microReadForTarget(null, batter),
    lastImpression: null,
    lastNote: ""
  };
}

function ensureBatterMind(batter = currentBatter()) {
  if (!state.atBat) return null;
  if (!state.atBat.batterMind) state.atBat.batterMind = createBatterMind(batter);
  return state.atBat.batterMind;
}

function adjustBatterMind(delta, batter = currentBatter()) {
  const mind = ensureBatterMind(batter);
  if (!mind || !delta) return mind;
  ["timing", "confidence", "confusion", "pressure", "plateAware"].forEach((key) => {
    if (delta[key]) mind[key] = clampBatterMindValue(key, mind[key] + scaleMindDelta(delta[key]));
  });
  if (delta.microRead) mind.microRead = delta.microRead;
  if (delta.note) mind.lastNote = delta.note;
  return mind;
}

function microReadForTarget(target, batter) {
  if (target === "fast") return "직구 기준";
  if (target === "breaking") return "스핀 대기";
  if (target === "offspeed") return "느린 공 대기";
  if (batter?.tendency?.id === "walkHunter") return "선구 모드";
  if (batter?.tendency?.id === "twoStrike") return "보호 스윙";
  if (batter?.tendency?.id === "slugger") return "장타 노림";
  return "직구 기준";
}

function batterMindSummary(mind = state.atBat?.batterMind) {
  if (!mind) return "";
  if (mind.confidence >= 70) return "타자가 같은 흐름을 기다리고 있습니다.";
  if (mind.timing >= 68) return "타자의 타이밍이 맞아가고 있습니다.";
  if (mind.confusion >= 55) return "타자의 판단이 늦어지고 있습니다.";
  if (mind.pressure >= 55 || mind.plateAware >= 55) return "플레이트 압박이 남아 반대 코스 설계가 열립니다.";
  return "";
}

function isFastPitch(pitch) {
  return pitch?.category === "fast";
}

function isSlowPitch(pitch) {
  return pitch?.category === "breaking" || pitch?.category === "offspeed";
}

function successfulImpressionResult(result) {
  if (!result) return false;
  if (["calledStrike", "swingingStrike", "inPlayOut", "doublePlay"].includes(result.result)) return true;
  if (result.result === "foul" && (result.timingValue || 0) < 0.48) return true;
  return false;
}

function failedImpressionResult(result) {
  if (!result) return false;
  if (["single", "double", "homerun", "error"].includes(result.result)) return true;
  if (result.result === "ball" && !result.inZone) return true;
  if (result.location?.centerMistake || result.mistake) return true;
  return false;
}

function impressionFromResult(result) {
  if (!successfulImpressionResult(result)) return null;
  const pitch = result.pitch;
  const side = locationSideFromRowCol(result.location?.row ?? 1, result.location?.col ?? 1);
  const height = locationHeightFromRowCol(result.location?.row ?? 1);
  if (isFastPitch(pitch) && side === "inside") {
    return { id: "inside_fast", label: "몸쪽 의식", text: "몸쪽 빠른 공을 의식합니다.", age: 0 };
  }
  if (isFastPitch(pitch) && height === "high") {
    return { id: "high_fast", label: "높은 공 의식", text: "높은 빠른 공을 의식합니다.", age: 0 };
  }
  if (isFastPitch(pitch)) {
    return { id: "fast_timing", label: "직구 기준", text: "타자가 빠른 공 기준을 의식합니다.", age: 0 };
  }
  if (isSlowPitch(pitch) && height === "low") {
    return { id: "low_slow", label: "낮은 변화구 의식", text: "낮은 변화구를 의식합니다.", age: 0 };
  }
  if (isSlowPitch(pitch) && side === "outside") {
    return { id: "outside_slow", label: "바깥쪽 의식", text: "바깥쪽 변화구를 의식합니다.", age: 0 };
  }
  if (isSlowPitch(pitch)) {
    return { id: "slow_timing", label: "느린 공 의식", text: "타자가 느린 공 궤적을 의식합니다.", age: 0 };
  }
  return null;
}

function impressionBoostForPitch(impression, pitch, side, height) {
  let boost = dugoutEffectValue("impressionBonus");
  if (hasRewardCard("K004")) boost += 0.12;
  const stack = (id) => cardStackCount(id);
  if (impression?.id === "fast_timing" && isSlowPitch(pitch)) {
    boost += dugoutEffectValue("slowAfterFastBoost");
    if (hasRewardCard("R001")) boost += 0.18;
    if (pitch.id === "change" && hasRewardCard("C005")) boost += Math.min(0.24, stack("C005") * 0.12);
  }
  if (impression?.id === "inside_fast" && side === "outside") {
    if (hasRewardCard("R010")) boost += 0.18;
    if (hasRewardCard("C010")) boost += Math.min(0.16, stack("C010") * 0.08);
  }
  if (impression?.id === "high_fast" && height === "low" && isSlowPitch(pitch)) {
    if (pitcherHasTag("high_fast_lift")) boost += 0.08;
    if (hasRewardCard("R015")) boost += 0.2;
  }
  if (impression?.id === "low_slow" && height === "high" && isFastPitch(pitch)) {
    if (pitcherHasTag("high_fast_lift")) boost += 0.12;
  }
  return Math.max(0, boost);
}

function currentImpressionEffect(pitch, location) {
  const impression = state.atBat?.batterMind?.lastImpression;
  const empty = { quality: 0, swing: 0, contact: 0, foul: 0, contactQuality: 0, label: "", log: "" };
  if (!impression) return empty;
  const side = locationSideFromRowCol(location.row, location.col);
  const height = locationHeightFromRowCol(location.row);
  const strength = batterMindStageMultiplier() * (1 + impressionBoostForPitch(impression, pitch, side, height));

  const withStrength = (effect) => ({
    quality: Math.round((effect.quality || 0) * strength),
    swing: (effect.swing || 0) * strength,
    contact: (effect.contact || 0) * strength,
    foul: (effect.foul || 0) * strength,
    contactQuality: Math.round((effect.contactQuality || 0) * strength),
    label: effect.label || impression.label,
    log: effect.log || ""
  });

  if (impression.id === "fast_timing" && isSlowPitch(pitch)) {
    return withStrength({
      quality: 3,
      swing: 0.04,
      contact: -0.05,
      contactQuality: -5,
      label: "타이밍 흔듦",
      log: "빠른 공 기준을 심어 느린 공 타이밍을 흔듭니다."
    });
  }
  if (impression.id === "inside_fast" && side === "outside") {
    return withStrength({
      quality: 3,
      swing: location.inZone ? 0.03 : 0.07,
      contact: -0.04,
      contactQuality: -5,
      label: "바깥쪽 속임",
      log: "몸쪽을 의식시킨 뒤 바깥쪽 승부가 열립니다."
    });
  }
  if (impression.id === "high_fast" && height === "low" && isSlowPitch(pitch)) {
    return withStrength({
      quality: 4,
      swing: 0.06,
      contact: -0.06,
      contactQuality: -6,
      label: "눈높이 함정",
      log: "높은 공을 의식시킨 뒤 낮은 변화구가 살아납니다."
    });
  }
  if (impression.id === "low_slow" && height === "high" && isFastPitch(pitch)) {
    return withStrength({
      quality: 3,
      swing: location.inZone ? -0.03 : 0,
      contact: -0.05,
      contactQuality: -5,
      label: "낮은 공 의식",
      log: "낮은 공을 의식시킨 뒤 높은 빠른 공으로 반응을 늦춥니다."
    });
  }
  if (impression.id === "outside_slow" && side === "inside" && isFastPitch(pitch)) {
    return withStrength({
      quality: 3,
      swing: location.inZone ? -0.02 : 0,
      contact: -0.04,
      contactQuality: -5,
      label: "바깥쪽 의식",
      log: "바깥쪽을 의식시킨 뒤 몸쪽 빠른 공이 늦게 들어갑니다."
    });
  }
  if (impression.id === "slow_timing" && isFastPitch(pitch)) {
    return withStrength({
      quality: 2,
      contact: -0.04,
      contactQuality: -4,
      label: "느린 공 의식",
      log: "느린 공 궤적 뒤 빠른 공으로 타이밍을 찌릅니다."
    });
  }
  return empty;
}

function currentBatterMindEffect(targetMatch, location) {
  const mind = state.atBat?.batterMind;
  const empty = { swing: 0, chase: 0, contact: 0, foul: 0, contactQuality: 0, label: "" };
  if (!mind) return empty;
  const stage = batterMindStageMultiplier();
  const timing = (mind.timing || 0) / 100;
  const confidence = (mind.confidence || 0) / 100;
  const confusion = (mind.confusion || 0) / 100;
  const pressure = (mind.pressure || 0) / 100;

  const effect = { ...empty };
  effect.contact += timing * 0.06 * stage;
  effect.foul += timing * 0.05 * stage;
  effect.contactQuality += Math.round(timing * 6 * stage);

  if (targetMatch) {
    effect.swing += confidence * 0.05 * stage;
    effect.contact += confidence * 0.08 * stage;
    effect.contactQuality += Math.round(confidence * 13 * stage);
  } else {
    effect.contact -= confusion * 0.06 * stage;
    effect.contactQuality -= Math.round(confusion * 9 * stage);
  }

  if (!location.inZone) {
    effect.swing += pressure * 0.06 * stage;
    if (mind.microRead === "선구 모드") effect.chase -= (0.04 + confidence * 0.04) * stage;
  }
  if (pressure > 0.55 && !targetMatch) {
    effect.contactQuality -= Math.round(pressure * 5 * stage);
  }
  if (mind.microRead === "보호 스윙" && state.strikes >= 2) {
    effect.foul += 0.04 * stage;
    effect.contactQuality -= Math.round(2 * stage);
  }
  if (mind.microRead === "장타 노림" && targetMatch) {
    effect.contactQuality += Math.round(6 * stage);
  }

  if (confidence >= 0.68) effect.label = "같은 흐름 대기";
  else if (confusion >= 0.55) effect.label = "판단 지연";
  else if (pressure >= 0.55) effect.label = "플레이트 압박";
  return effect;
}

function updateBatterMindAfterPitch(result, plannedCourse, pattern, batter) {
  const mind = ensureBatterMind(batter);
  if (!mind || !result) return [];
  const logs = [];
  const targetMatch = !!result.targetMatch;
  const targetMicro = microReadForTarget(state.atBat?.target, batter);

  if (targetMatch && (result.result === "foul" || ["single", "double", "homerun"].includes(result.result))) {
    adjustBatterMind({ timing: 6, confidence: 7, confusion: -4, microRead: targetMicro }, batter);
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(3), 0, 100);
    logs.push("타자가 기다리던 타이밍에 가까워졌습니다.");
  }

  if (result.result === "ball" && !result.inZone) {
    adjustBatterMind({ confidence: 5, confusion: -3, microRead: "선구 모드" }, batter);
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(2), 0, 100);
    const ballHeight = locationHeightFromRowCol(result.location?.row ?? 1);
    const ballSide = locationSideFromRowCol(result.location?.row ?? 1, result.location?.col ?? 1);
    if (ballHeight === "high") logs.push("타자가 높게 빠지는 공을 보기 시작합니다.");
    else if (ballHeight === "low") logs.push("타자가 낮게 빠지는 공을 참기 시작합니다.");
    else if (ballSide === "inside") logs.push("타자가 몸쪽으로 빠지는 공을 참기 시작합니다.");
    else if (ballSide === "outside") logs.push("타자가 바깥쪽으로 빠지는 공을 참기 시작합니다.");
    else logs.push("타자가 존을 벗어난 공을 고르기 시작합니다.");
  }

  if (result.result === "foul") {
    adjustBatterMind({ timing: 5, confidence: targetMatch ? 3 : 1, microRead: state.strikes >= 2 ? "보호 스윙" : targetMicro }, batter);
    logs.push("파울로 버티며 타이밍을 맞춰갑니다.");
    if (hasRewardCard("R017")) {
      adjustBatterMind({ confusion: 2, confidence: -2 }, batter);
      logs.push("파울 타이밍으로 타자의 기준점을 좁혔습니다.");
    }
  }

  if (["calledStrike", "swingingStrike"].includes(result.result) || result.timingLabel === "완전히 속음") {
    adjustBatterMind({ confusion: 8, pressure: 4, confidence: -5, timing: -3 }, batter);
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) - scaleMindDelta(2), 0, 100);
    logs.push("타자의 판단이 늦어졌습니다.");
  }

  if (["single", "double", "homerun", "error"].includes(result.result)) {
    adjustBatterMind({ timing: 8, confidence: result.result === "homerun" ? 16 : 10, confusion: -6 }, batter);
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(result.result === "homerun" ? 8 : 5), 0, 100);
    logs.push("타자가 같은 흐름을 기다리기 시작합니다.");
  }

  if (result.countBefore === "0-0" && (dugoutEffectValue("firstStrikePressure") || hasRewardCard("C007"))) {
    if (isStrikeLikeResult(result)) {
      adjustBatterMind({ pressure: 5, confusion: 3, confidence: -2, microRead: "플레이트 의식" }, batter);
      logs.push("초구 스트라이크로 타자가 플레이트를 의식합니다.");
    } else if (result.result === "ball" && !result.inZone) {
      adjustBatterMind({ confidence: 4, confusion: -2 }, batter);
      const risk = dugoutEffectValue("firstStrikeRiskSuspicion");
      if (risk && state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(risk), 0, 100);
      logs.push("초구 압박이 빗나가 타자가 더 기다립니다.");
    }
  }

  const rivalPattern = rivalPsychPatterns[batter?.rivalPatternId];
  if (rivalPattern?.id === "patternReader" && result.result === "foul") {
    adjustBatterMind({ timing: 3, confidence: 2 }, batter);
    logs.push("라이벌이 파울로 타이밍을 맞춰갑니다.");
  }
  if (rivalPattern?.id === "leadoffProbe" && result.result === "ball" && !result.inZone) {
    adjustBatterMind({ confidence: 3, microRead: "선구 모드" }, batter);
  }
  if (rivalPattern?.id === "clutchSlugger" && targetMatch && ["foul", "single", "double", "homerun"].includes(result.result)) {
    adjustBatterMind({ confidence: 4, timing: 2, microRead: "장타 노림" }, batter);
  }

  if (result.impressionEffect?.log && successfulImpressionResult(result)) {
    adjustBatterMind({ confusion: 5, pressure: 3, confidence: -2 }, batter);
    logs.push(result.impressionEffect.log);
  }

  const nextImpression = impressionFromResult(result);
  if (nextImpression) {
    mind.lastImpression = nextImpression;
    if (nextImpression.id === "inside_fast") adjustBatterMind({ pressure: 5, plateAware: 8, microRead: "몸쪽 의식" }, batter);
    else if (nextImpression.id === "high_fast") adjustBatterMind({ pressure: 4, plateAware: 5, microRead: "하이존 대응" }, batter);
    else if (nextImpression.id === "fast_timing") adjustBatterMind({ timing: 3, microRead: "직구 기준" }, batter);
    else if (nextImpression.id === "low_slow") adjustBatterMind({ confusion: 2, microRead: "낮은 공 의식" }, batter);
    else if (nextImpression.id === "outside_slow") adjustBatterMind({ confusion: 2, plateAware: 3, microRead: "바깥쪽 대기" }, batter);
    else if (nextImpression.id === "slow_timing") adjustBatterMind({ confusion: 2, microRead: "느린 공 대기" }, batter);
    logs.push(nextImpression.text);
  } else if (failedImpressionResult(result)) {
    mind.lastImpression = null;
  } else if (mind.lastImpression) {
    mind.lastImpression.age = (mind.lastImpression.age || 0) + 1;
    if (mind.lastImpression.age >= 2) mind.lastImpression = null;
  }

  const summary = batterMindSummary(mind);
  if (summary && !logs.includes(summary)) logs.push(summary);
  return [...new Set(logs)].slice(0, 3);
}

const MAX_SUSPICION_ADD_PER_PITCH = 16;

const PATTERN_LOG_LINES = {
  same_pitch_repeat: [
    "타자가 같은 구종 반복을 의식하기 시작합니다.",
    "같은 구종이 이어져 타자가 반복을 기다리기 시작합니다."
  ],
  same_family_repeat: [
    "빠른 공 계열이 반복되어 타자가 빠른 공 기준을 잡기 시작합니다.",
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
  const rivalBonus = rivalPsychPatterns[batter?.rivalPatternId]?.memoryBonus || 0;
  if (batter.bossGimmick?.id === "geniusEye" || batter.memory?.id === "genius") return 10 + rivalBonus;
  if (batter.mind?.id === "adaptive" || batter.memory?.id === "high") return 7 + rivalBonus;
  if (batter.mind?.id === "tricky") return 6 + rivalBonus;
  if (batter.memory?.id === "low") return 3 + rivalBonus;
  return 5 + rivalBonus;
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
    if (col <= 0) return "outside";
    if (col >= 2) return "inside";
    return "center";
  }
  if (col < 0) return "outside";
  if (col > 2) return "inside";
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
    line = "빠른 공 계열이 반복되어 타자가 빠른 공 기준을 잡기 시작합니다.";
  } else if (pattern.id === "same_family_repeat" && lastPitch?.category === "breaking") {
    line = "변화구 흐름이 길어지며 타자가 궤적을 따라가기 시작합니다.";
  } else if (pattern.id === "same_family_repeat" && lastPitch?.category === "offspeed") {
    line = "느린 공 계열이 반복되어 타자가 느린 공을 기다리기 시작합니다.";
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
      suspicionAdd: suspicionPatternValues.samePitch,
      contactBonus: 0.05,
      hardHitBonus: 0.04
    });
  }

  if (countSame(recent3, "family", last.family) >= 2) {
    patterns.push({
      id: "same_family_repeat",
      label: "같은 계열 반복",
      suspicionAdd: suspicionPatternValues.sameFamily,
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
      suspicionAdd: suspicionPatternValues.sameZone,
      swingBonus: 0.06,
      qualityBonus: 0.03
    });
  }

  if (countSame(recent3, "height", last.height) >= 2) {
    patterns.push({
      id: "same_height_repeat",
      label: "같은 높이 반복",
      suspicionAdd: suspicionPatternValues.sameHeight,
      contactBonus: 0.03
    });
  }

  if (last.intent === "ball" && prev.intent === "ball" && last.ballIntent && last.ballIntent === prev.ballIntent) {
    patterns.push({
      id: "same_intent_repeat",
      label: "같은 유인 의도 반복",
      suspicionAdd: suspicionPatternValues.sameIntent,
      takeBallBonus: 0.04,
      foulBonus: 0
    });
  }

  if (last.pitchId === prev.pitchId && last.side === prev.side && last.height === prev.height && last.intent === prev.intent) {
    patterns.push({
      id: "exact_pattern_repeat",
      label: "완전 같은 패턴 반복",
      suspicionAdd: suspicionPatternValues.exactRepeat,
      contactBonus: 0.05,
      hardHitBonus: 0.05
    });
  }

  if (last.targetMatch) {
    patterns.push({
      id: "target_match_read",
      label: "타자 노림수 일치",
      suspicionAdd: suspicionPatternValues.targetMatch,
      contactBonus: 0.04,
      hardHitBonus: 0.04
    });
  }

  if (last.mistake) {
    patterns.push({
      id: "mistake_read",
      label: "실투 노출",
      suspicionAdd: suspicionPatternValues.mistake,
      hardHitBonus: 0.03
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
  const rivalPattern = rivalPsychPatterns[batter?.rivalPatternId];
  if (rivalPattern?.id === "patternReader") {
    patterns.forEach((pattern) => {
      if (["same_pitch_repeat", "same_family_repeat", "same_zone_repeat", "exact_pattern_repeat"].includes(pattern.id)) {
        pattern.suspicionAdd = (pattern.suspicionAdd || 0) + rivalPattern.repeatSuspicionBonus;
        pattern.contactBonus = (pattern.contactBonus || 0) + 0.02;
        pattern.foulBonus = (pattern.foulBonus || 0) + 0.02;
      }
    });
  }
  if (rivalPattern?.id === "clutchSlugger") {
    patterns.forEach((pattern) => {
      if (pattern.id === "target_match_read" || pattern.id === "mistake_read") {
        pattern.hardHitBonus = (pattern.hardHitBonus || 0) + 0.03;
      }
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
  let totalAdd = patterns.reduce((sum, pattern) => sum + (pattern.suspicionAdd || 0), 0);
  let multiplier = dugoutEffectMultiplier("suspicionMult", 1);
  multiplier *= dugoutEffectMultiplier("repeatSuspicionMult", 1);
  multiplier *= suspicionStageMultipliers[state.stageIndex] || 1;
  if (state.inning === 1 && hasRewardCard("C012")) multiplier *= Math.pow(0.9, cardStackCount("C012"));
  if (patterns.some((pattern) => pattern.id === "same_pitch_repeat") && hasRewardCard("R005")) multiplier *= 0.7;
  if (patterns.some((pattern) => pattern.id === "same_zone_repeat") && hasRewardCard("R004")) multiplier *= 0.75;
  const cappedAdd = Math.min(Math.round(totalAdd * learnRate * multiplier), MAX_SUSPICION_ADD_PER_PITCH);
  if (state.atBat) {
    state.atBat.suspicion = clamp((state.atBat.suspicion ?? 0) + cappedAdd, 0, 100);
  }
  if (patterns.length) {
    const mindDelta = { confidence: 0, timing: 0, confusion: 0 };
    if (patterns.some((pattern) => pattern.id === "same_pitch_repeat")) {
      mindDelta.confidence += 3;
      mindDelta.timing += 2;
    }
    if (patterns.some((pattern) => pattern.id === "same_zone_repeat" || pattern.id === "same_height_repeat")) {
      mindDelta.confidence += 2;
    }
    if (patterns.some((pattern) => pattern.id === "target_match_read")) {
      mindDelta.confidence += 4;
      mindDelta.timing += 2;
    }
    if (patterns.some((pattern) => pattern.id === "mistake_read")) {
      mindDelta.confidence += 5;
      mindDelta.confusion -= 3;
    }
    if (mindDelta.confidence || mindDelta.timing || mindDelta.confusion) adjustBatterMind(mindDelta, batter);
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
  if (hasRewardCard("K007") || hasRewardCard("R020")) {
    const currentFamily = pitchFamily(pitch.category);
    const recent = (state.atBat?.choiceHistory || []).slice(-2);
    if (recent.length >= 2 && recent.every((entry) => entry.family !== currentFamily)) {
      delta -= hasRewardCard("K007") ? 4 : 3;
    }
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
  const targetMatch = isTargetedPitchCategory(pitch.category, state.atBat?.target);

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
    targetMatch,
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
  const intent = plannedCourse.intent === "ball" ? "ball" : "strike";
  return {
    pitchType: pitch.name,
    pitchId: pitch.id,
    category: pitch.category,
    family: pitchFamily(pitch.category),
    intent,
    ballIntent: classifyBallIntent(
      Number(plannedCourse.zone) || 5,
      intent,
      plannedCourse.ballPlan || "",
      plannedCourse.targetRow,
      plannedCourse.targetCol
    ),
    zoneX: col + 1,
    zoneY: row + 1,
    zoneLabel: location?.actualLabel || actualCourseLabel(row, col),
    height: locationHeightFromRowCol(row),
    side: locationSideFromRowCol(row, col),
    countBefore: result.countBefore || countKey(),
    runners: result.runnersBefore || runnersKey(),
    result: pitchResultMemoryType(result),
    targetMatch: !!result.targetMatch,
    mistake: !!(result.mistake || result.location?.centerMistake),
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
    ballIntent: pattern?.ballIntent || null,
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
    turn: (state.atBat?.pitchHistory?.length || 0) + 1,
    reliable: guessedTarget === target
  };
}

function refreshRecommendationForNextPitch(batter = currentBatter()) {
  if (!state.atBat || state.waitingNextBatter || state.pendingGameOver || state.gameOver) return;
  const weights = adjustWeightsByMemory(batter.weights, state.lastAtBatMemory);
  const previousTarget = state.atBat.target;
  let nextTarget = weightedCategory(weights);
  if (nextTarget === previousTarget && state.atBat.pitchHistory?.length) {
    nextTarget = weightedCategoryWithout(weights, previousTarget);
  }
  state.atBat.target = nextTarget;
  state.atBat.recommendation = buildRecommendation(nextTarget, batter, state.atBat.suspicion || 0);
}

function generatePitcher(portrait = pick(pitcherPortraits)) {
  const profile = pick(pitcherProfiles);
  const stats = buildPitcherStats(profile);
  const repertoire = buildPitcherRepertoire(profile);
  const weaknessPool = ["homerun_risk", "walk_risk", "full_count_wobble", "pressure_wobble"];
  const coreTagId = coreTagForProfile(profile.id, repertoire);

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
    coreXp: 0,
    coreTier: "bronze",
    pitchMastery: {},
    weaknessTagId: null,
    pendingCoreEvolutionReward: null,
    pendingPitchUpgradeReward: null,
    bossData: 0,
    rewardHistory: { conditionTypesByStage: [] },
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
  const baseBoost = stageIndex === 1 ? 8 : 24;
  const variance = stageIndex === 1 ? 5 : 8;
  return Object.fromEntries(
    Object.entries(stats).map(([label, value]) => [label, clampStat(value + baseBoost + rand(0, variance))])
  );
}

function rivalPatternForStage(stageIndex = state.stageIndex) {
  if (stageIndex >= 2) return rivalPsychPatterns.clutchSlugger;
  if (stageIndex === 1) return rivalPsychPatterns.patternReader;
  return rivalPsychPatterns.leadoffProbe;
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
    const weaknessTags = pickBatterWeaknessTags(slot, isBoss);
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
      weaknessTags,
      revealedWeaknessTagIds: [],
      candidateWeaknessTagIds: [],
      bossGimmick,
      hint: makeBatterHint(stats, weights, isBoss, mind, tendency, memory, bossGimmick),
      tags: makeBatterTags(stats, weights, mind, tendency, isBoss, batterTagIds)
    };
  });
}

function assignStageRival() {
  const config = stageConfig();
  const rivalInfo = config.rival;
  if (!rivalInfo || !state.lineup?.length) return;
  state.lineup.forEach((batter) => {
    batter.isRival = false;
  });
  const candidates = state.lineup.filter((batter) => !batter.isBoss);
  const rival = pick(candidates.length ? candidates : state.lineup);
  const slot = clamp(rival.slot || state.lineup.indexOf(rival) + 1, 1, state.lineup.length);
  const wasBoss = !!rival.isBoss;
  const rivalName = rival.name;
  const rivalPattern = rivalPatternForStage(state.stageIndex);
  rival.isRival = true;
  rival.isBoss = wasBoss;
  rival.rivalPatternId = rivalPattern?.id || null;
  rival.type = `${wasBoss ? "보스 라이벌" : "라이벌 타자"} · ${String(rival.type || "").replace(/^보스 타자 · /, "").replace(/^라이벌 타자 · /, "")}`;
  rival.tags = [...new Set([...(rival.tags || []), "라이벌", ...String(rivalInfo.role || "").split("/").map((item) => item.trim()).filter(Boolean)])];
  rival.weaknessTags = pickBatterWeaknessTags(rival.slot, wasBoss);
  rival.revealedWeaknessTagIds = rival.revealedWeaknessTagIds || [];
  rival.hint = makeBatterHint(rival.stats, rival.weights, rival.isBoss, rival.mind, rival.tendency, rival.memory, rival.bossGimmick);
  ensureStageRunState().rival = {
    ...ensureStageRunState().rival,
    name: rivalName,
    slot,
    plateAppearances: 0,
    onBaseAllowed: 0,
    longHitsAllowed: 0,
    pitchUseCounts: {},
    succeeded: false
  };
  if (hasRewardCard("R007")) revealBatterWeakness(rival);
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
    weaknessUseCounts: {},
    batterMind: createBatterMind(batter),
    batterMemory: createEmptyBatterMemory(batter),
    activeMemoryModifiers: createEmptyMemoryModifiers(),
    suspicion,
    reverseRead: false,
    falseClue: null,
    ballIntent: null,
    resolved: false
  };
}

function syncTitleScreenEls() {
  els.titleOverlay = document.querySelector("#titleOverlay");
  els.titleStartButton = document.querySelector("#titleStartButton");
  els.titleTutorialButton = document.querySelector("#titleTutorialButton");
  els.tutorialOverlay = document.querySelector("#tutorialOverlay");
  els.tutorialBackButton = document.querySelector("#tutorialBackButton");
}

function showTitleScreen() {
  syncTitleScreenEls();
  if (els.titleOverlay) els.titleOverlay.hidden = false;
  if (els.tutorialOverlay) els.tutorialOverlay.hidden = true;
  if (els.pitcherSelectOverlay) els.pitcherSelectOverlay.hidden = true;
  if (els.resultOverlay) els.resultOverlay.hidden = true;
  if (els.rewardOverlay) els.rewardOverlay.hidden = true;
  if (els.dugoutOverlay) els.dugoutOverlay.hidden = true;
  if (els.stageOverlay) els.stageOverlay.hidden = true;
  if (els.themeSelectOverlay) els.themeSelectOverlay.hidden = true;
  state.screenPhase = SCREEN_PHASE.title;
  syncGameOverlayUi();
}

function beginGameFromTitle() {
  if (els.titleOverlay) els.titleOverlay.hidden = true;
  if (els.tutorialOverlay) els.tutorialOverlay.hidden = true;
  syncGameOverlayUi();
  startGame();
}

function openTutorialFromTitle() {
  if (els.titleOverlay) els.titleOverlay.hidden = true;
  if (els.tutorialOverlay) els.tutorialOverlay.hidden = false;
  state.screenPhase = SCREEN_PHASE.tutorial;
  syncGameOverlayUi();
}

function returnToTitleScreen() {
  if (els.tutorialOverlay) els.tutorialOverlay.hidden = true;
  showTitleScreen();
}

function startGame() {
  clearAutoAdvance();
  clearCourseFlash();
  clearRewardTimer();
  clearGameOverTimer();
  hideBallSprite();
  resetTagDetail();
  resetPitcherTagDetail();
  if (els.titleOverlay) els.titleOverlay.hidden = true;
  if (els.tutorialOverlay) els.tutorialOverlay.hidden = true;
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
  state.ownedRewardCards = [];
  state.cardTriggerLog = [];
  state.stageRun = null;
  state.currentInningStats = null;
  state.currentAtBatMeta = null;
  state.pendingDugoutChoices = [];
  state.dugoutPending = false;
  state.dugoutBeforeAtBat = false;
  state.dugoutAdvanceBatterOnConfirm = false;
  state.activeDugoutEffects = [];
  state.pendingRunComplete = false;
  state.pendingRunCompleteMessage = "";
  state.lastStageResult = null;
  state.lastGrowthResult = null;
  state.stageGrowthSummary = null;
  state.nextBatterSuspicionBonus = 0;
  state.nextPitchControlBonus = 0;
  state.releaseTiming = null;
  state.lastReleaseResult = null;
  state.tutorialSeen = {};
  els.resultOverlay.hidden = true;
  if (els.rewardOverlay) els.rewardOverlay.hidden = true;
  if (els.dugoutOverlay) els.dugoutOverlay.hidden = true;
  if (els.runStatusCard) els.runStatusCard.hidden = true;
  if (els.missionFocusCard) els.missionFocusCard.hidden = true;
  if (els.stageOverlay) els.stageOverlay.hidden = true;
  if (els.themeSelectOverlay) els.themeSelectOverlay.hidden = true;
  if (els.stageThemeBadge) els.stageThemeBadge.hidden = true;
  state.awaitingThemeSelection = false;
  state.pendingThemeChoices = [];
  state.awaitingStageStart = false;
  state.stageThemeId = null;
  renderPitcherChoices();
  syncGameOverlayUi();
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
  ensurePitcherGrowthFields(state.pitcher);
  assignStartingBonusTag(state.pitcher);
  state.catcher = pick(catcherTypes);
  state.stageIndex = 0;
  state.stageThemeId = MP.pickStage1Theme ? MP.pickStage1Theme() : null;
  state.awaitingThemeSelection = false;
  state.pendingThemeChoices = [];
  state.awaitingStageStart = true;
  state.stageJustAdvanced = false;
  state.lineup = generateLineup(state.stageIndex);
  state.stageRun = createStageRunState(state.stageIndex);
  assignStageRival();
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
  state.releaseTiming = null;
  state.lastReleaseResult = null;
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
  state.ownedRewardCards = [];
  state.cardTriggerLog = [];
  state.currentInningStats = null;
  state.currentAtBatMeta = null;
  state.pendingDugoutChoices = [];
  state.dugoutPending = false;
  state.dugoutBeforeAtBat = false;
  state.dugoutAdvanceBatterOnConfirm = false;
  state.activeDugoutEffects = [];
  state.pendingRunComplete = false;
  state.pendingRunCompleteMessage = "";
  state.lastStageResult = null;
  state.lastGrowthResult = null;
  resetStageGrowthSummary();
  state.nextBatterSuspicionBonus = 0;
  state.nextPitchControlBonus = 0;
  state.lastAtBatMemory = null;
  state.mobilePitchRecords = [];
  state.patternMemory = createPatternMemory();
  state.pendingGameOver = false;
  state.runStats = createRunStats();
  state.gameOver = false;
  state.waitingNextBatter = false;
  state.batterCardExpanded = false;
  state.tutorialSeen = {};
  state.lastPitchPattern = null;
  beginBalancePlayLog();
  if (balanceLog.active) {
    balanceLog.active.pitcher = {
      id: pitcher.id || pitcher.name,
      name: pitcher.name,
      style: pitcher.style,
      coreTagId: pitcher.coreTagId,
      coreEvolutionId: pitcher.coreEvolutionId || null
    };
  }
  if (MP.initPitchProgressionState) MP.initPitchProgressionState();
  resetTagDetail();
  resetPitcherTagDetail();
  els.resultOverlay.hidden = true;
  if (els.rewardOverlay) els.rewardOverlay.hidden = true;
  if (els.dugoutOverlay) els.dugoutOverlay.hidden = true;
  clearPitcherRevealAnimation();
  els.pitcherSelectOverlay.hidden = true;
  if (els.themeSelectOverlay) els.themeSelectOverlay.hidden = true;
  els.logList.innerHTML = "";
  beginInningTracking(1);
  state.atBat = null;
  state.dugoutPending = false;
  state.dugoutBeforeAtBat = false;
  state.dugoutAdvanceBatterOnConfirm = false;
  state.pendingDugoutChoices = [];
  render();
  showStageThemeOverlay(currentStageNumber(), currentStageInnings());
  const coreTagName = tagById(state.pitcher.coreTagId)?.name || "핵심태그";
  addLog(
    "새 경기",
    `${state.pitcher.name} 선발 등판. 오늘의 핵심 운영은 ${coreTagName}입니다. ${stageConfig().name}에서 ${currentStageRunLimit()}실점에 도달하면 경기 종료입니다.`
  );
  showTutorialStep("firstPitch");
  showTutorialStep("inningMission");
}

function startAtBat() {
  clearAutoAdvance();
  clearCourseFlash();
  resetTagDetail();
  const inningStats = currentInningTracking();
  const isFirstBatterOfInning = inningStats.battersStarted === 0;
  inningStats.battersStarted += 1;
  state.currentAtBatMeta = {
    inning: state.inning,
    batterIndex: state.batterIndex,
    isFirstBatterOfInning
  };
  state.balls = 0;
  state.strikes = 0;
  state.consecutiveBalls = 0;
  state.atBat = createPlan(currentBatter());
  if (state.nextBatterSuspicionBonus) {
    state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + state.nextBatterSuspicionBonus, 0, 100);
    state.nextBatterSuspicionBonus = 0;
  }
  if (isFirstBatterOfInning) {
    if (hasRewardCard("R006")) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) - 10, 0, 100);
    const firstBatterSuspicion = dugoutEffectValue("firstBatterSuspicion");
    if (firstBatterSuspicion) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + firstBatterSuspicion, 0, 100);
    if (hasRewardCard("R008")) revealBatterWeakness(currentBatter());
    if (hasRewardCard("R019") && state.batterIndex < 3) markBatterWeaknessCandidates(currentBatter(), 3);
    if (dugoutEffectValue("revealNextFirstWeakness")) revealBatterWeakness(currentBatter());
    if (dugoutEffectValue("revealCourseWeakness")) revealBatterWeakness(currentBatter(), { category: "zone" });
    if (dugoutEffectValue("candidateNextFirstWeakness")) markBatterWeaknessCandidates(currentBatter(), dugoutEffectValue("candidateNextFirstWeakness"));
    if (dugoutEffectValue("candidateCourseWeakness")) markBatterWeaknessCandidates(currentBatter(), dugoutEffectValue("candidateCourseWeakness"), { category: "zone" });
  }
  ensureMissionWeaknessTargetForCurrentBatter();
  state.lastLocation = null;
  state.lastPitchCall = null;
  state.consecutiveOnBase = 0;
  state.fullCountSeen = 0;
  state.flashZone = null;
  state.releaseTiming = null;
  state.lastReleaseResult = null;
  state.batterCardExpanded = false;
  if (!state.selectedPitchId) state.selectedPitchId = state.pitcher.repertoire[0]?.id || null;
  state.waitingNextBatter = false;
  els.nextBatterButton.hidden = true;
  recordMobileBatterStart(currentBatter());
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
    if (col <= 0) return "바깥쪽";
    if (col >= 2) return "몸쪽";
    return "중앙";
  }
  if (row < 0) return "높은 볼";
  if (row > 2) return "낮은 볼";
  if (col < 0) return "바깥쪽 볼";
  return "몸쪽 볼";
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

function releasePressureBreakdown() {
  const runners = state.bases.filter(Boolean).length;
  let pressure = runners * 12;
  const reasons = [];
  if (runners > 0) reasons.push(`주자 ${runners}명`);
  if (state.bases[1] || state.bases[2]) {
    pressure += 8;
    reasons.push("득점권");
  }
  if (state.balls === 3) {
    pressure += 8;
    reasons.push("볼카운트 몰림");
  }
  if (state.strikes === 2 && runners > 0) {
    pressure += 4;
    reasons.push("결정구 부담");
  }
  if (state.outs === 2 && (state.bases[1] || state.bases[2])) {
    pressure += 5;
    reasons.push("2아웃 득점권");
  }
  const batter = currentBatter();
  if (batter?.isBoss) {
    pressure += 9;
    reasons.push("보스 타자");
  }
  if (batter?.isRival) {
    pressure += 6;
    reasons.push("라이벌");
  }
  const suspicionPressure = Math.max(0, (state.atBat?.suspicion || 0) - 55) * 0.22;
  if (suspicionPressure > 0) {
    pressure += suspicionPressure;
    reasons.push("배합 간파");
  }
  return { pressure: clamp(pressure, 0, 64), reasons };
}

function activeRunnerPressure() {
  return releasePressureBreakdown().pressure;
}

function releaseGradeConfig(grade) {
  const configs = {
    perfect: {
      label: "Perfect",
      message: "손끝이 완벽하게 맞았습니다.",
      tone: "good",
      commandBonus: 12,
      contactMod: -0.03,
      contactQualityMod: -6,
      mistakeChance: 0
    },
    good: {
      label: "Good",
      message: "좋은 릴리즈입니다.",
      tone: "good",
      commandBonus: 6,
      contactMod: -0.015,
      contactQualityMod: -3,
      mistakeChance: 0
    },
    normal: {
      label: "Normal",
      message: "계획대로 던졌습니다.",
      tone: "",
      commandBonus: 0,
      contactMod: 0,
      contactQualityMod: 0,
      mistakeChance: 0
    },
    bad: {
      label: "Bad",
      message: "릴리즈가 흔들렸습니다.",
      tone: "warn",
      commandBonus: -8,
      contactMod: 0.025,
      contactQualityMod: 5,
      mistakeChance: 0.08
    },
    miss: {
      label: "Miss",
      message: "공이 손에서 빠졌습니다.",
      tone: "danger",
      commandBonus: -16,
      contactMod: 0.05,
      contactQualityMod: 10,
      mistakeChance: 0.24
    }
  };
  return configs[grade] || configs.normal;
}

function neutralReleaseResult() {
  return {
    grade: "normal",
    label: "Normal",
    message: "자동 진행: 릴리즈 효과 없음",
    tone: "",
    accuracy: 50,
    position: 0.5,
    commandBonus: 0,
    contactMod: 0,
    contactQualityMod: 0,
    mistakeChance: 0,
    pressure: 0,
    zoneSize: 0,
    perfectSize: 0,
    auto: true
  };
}

function buildReleaseTimingChallenge(pitch, plannedCourse) {
  const control = pitcherEffectiveStat("제구");
  const mental = state.pitcher.stats.멘탈 ?? 60;
  const burden = MP.getBurdenModifiers ? MP.getBurdenModifiers(pitch) : null;
  const runnerPressure = releasePressureBreakdown();
  const burdenPressure = Math.max(0, burden?.commandPenalty || 0) * 1.8 + Math.max(0, pitch.cost || 0) * 1.7;
  const mentalPressure = Math.max(0, 70 - mental) * 0.38;
  const pressureReasons = runnerPressure.reasons.slice(0, 4);
  if (mentalPressure >= 4) pressureReasons.push("멘탈 흔들림");
  if (burdenPressure >= 8) pressureReasons.push("구종 부담");
  const pressure = clamp(runnerPressure.pressure + mentalPressure + burdenPressure, 0, 78);
  const perfectSize = clamp((0.068 + (control - 60) * 0.0028 - pressure * 0.001) * RELEASE_TIMING_ZONE_SCALE, 0.024, 0.14);
  const goodSize = clamp((0.24 + (control - 55) * 0.0034 - pressure * 0.0024) * RELEASE_TIMING_ZONE_SCALE, 0.1, 0.44);
  const baseDuration = clamp(1220 + (control - 55) * 8 + (mental - 55) * 2 - pressure * 9, 660, 1640);
  const duration = Math.round(baseDuration / RELEASE_TIMING_SPEED);
  return {
    active: true,
    pitchId: pitch.id,
    zone: Number(plannedCourse.zone) || 5,
    intent: plannedCourse.intent,
    ballPlan: plannedCourse.ballPlan || "",
    targetRow: plannedCourse.targetRow,
    targetCol: plannedCourse.targetCol,
    startedAt: Date.now(),
    duration,
    perfectSize,
    goodSize,
    pressure,
    pressureReasons,
    control,
    mental,
    shake: pressure >= 32,
    plannedCourse
  };
}

function releaseCursorPercent(challenge, now = Date.now()) {
  return `${releaseCursorPosition(challenge, now) * 100}%`;
}

function clearReleaseTimingAnimation() {
  if (releaseTimingFrame) {
    window.cancelAnimationFrame(releaseTimingFrame);
    releaseTimingFrame = null;
  }
}

function updateReleaseTimingCursor() {
  const challenge = state.releaseTiming?.active ? state.releaseTiming : null;
  if (!challenge) {
    clearReleaseTimingAnimation();
    return;
  }
  const cursorPosition = releaseCursorPercent(challenge);
  els.releaseTimingCursor?.style.setProperty("--release-cursor-x", cursorPosition);
  els.mobileReleaseCursor?.style.setProperty("--cursor-x", cursorPosition);
  releaseTimingFrame = window.requestAnimationFrame(updateReleaseTimingCursor);
}

function startReleaseTimingAnimation() {
  if (releaseTimingFrame || !state.releaseTiming?.active) return;
  updateReleaseTimingCursor();
}

function cancelReleaseTiming({ renderAfter = true, keepResult = false } = {}) {
  if (!state.releaseTiming?.active) return false;
  state.releaseTiming = null;
  clearReleaseTimingAnimation();
  if (!keepResult) state.lastReleaseResult = null;
  if (els.releaseTimingCursor) els.releaseTimingCursor.style.setProperty("--release-cursor-x", "50%");
  els.mobileReleaseCursor?.style.setProperty("--cursor-x", "50%");
  if (renderAfter) render();
  return true;
}

function modelReleaseForBot(pitch, plannedCourse, profile = "player") {
  const challenge = buildReleaseTimingChallenge(pitch, plannedCourse);
  const skillBias = profile === "oracle" ? 0 : profile === "player-smart" ? 0.045 : 0.075;
  const pressureSpread = clamp((challenge.pressure || 0) / 780, 0, 0.1);
  const controlHelp = clamp((challenge.control - 55) / 2200, -0.025, 0.025);
  const missSide = chance(0.5) ? -1 : 1;
  let offset = profile === "oracle" ? (Math.random() - 0.5) * challenge.perfectSize : missSide * (skillBias + pressureSpread - controlHelp) * Math.sqrt(Math.random());
  if (profile === "player-smart" && chance(0.42)) offset *= 0.45;
  offset += (Math.random() - 0.5) * 0.08;
  const position = clamp(0.5 + offset, 0.01, 0.99);
  const release = gradeReleaseTiming(challenge, position);
  release.auto = true;
  release.profile = profile;
  return release;
}

function releaseCursorPosition(challenge, now = Date.now()) {
  const duration = Math.max(240, challenge?.duration || 1200);
  const phase = (((now - challenge.startedAt) % duration) + duration) % duration;
  const progress = phase / duration;
  return progress <= 0.5 ? progress * 2 : 2 - progress * 2;
}

function gradeReleaseTiming(challenge, position = releaseCursorPosition(challenge)) {
  const distance = Math.abs(position - 0.5);
  const perfectHalf = (challenge.perfectSize || 0.07) / 2;
  const goodHalf = (challenge.goodSize || 0.24) / 2;
  const normalHalf = Math.min(0.43, goodHalf + 0.17);
  let grade = "miss";
  if (distance <= perfectHalf) grade = "perfect";
  else if (distance <= goodHalf) grade = "good";
  else if (distance <= normalHalf) grade = "normal";
  else if (distance <= 0.49) grade = "bad";
  const config = releaseGradeConfig(grade);
  return {
    grade,
    label: config.label,
    message: config.message,
    tone: config.tone,
    accuracy: Math.round(clamp((1 - distance * 2) * 100, 0, 100)),
    position: balanceRound(position, 3),
    commandBonus: config.commandBonus,
    contactMod: config.contactMod,
    contactQualityMod: config.contactQualityMod,
    mistakeChance: config.mistakeChance,
    pressure: balanceRound(challenge.pressure || 0, 2),
    zoneSize: balanceRound(challenge.goodSize || 0, 3),
    perfectSize: balanceRound(challenge.perfectSize || 0, 3)
  };
}

function beginReleaseTiming(pitch, plannedCourse) {
  if (!pitch || pitchInputLocked({ includeRelease: false })) return false;
  clearReleaseTimingAnimation();
  state.releaseTiming = buildReleaseTimingChallenge(pitch, plannedCourse);
  state.lastReleaseResult = null;
  hideTiming();
  render();
  startReleaseTimingAnimation();
  return true;
}

function finishReleaseTiming() {
  const challenge = state.releaseTiming;
  if (!challenge?.active) return null;
  const release = gradeReleaseTiming(challenge);
  state.releaseTiming = null;
  clearReleaseTimingAnimation();
  state.lastReleaseResult = release;
  if (els.releaseTimingCursor) els.releaseTimingCursor.style.setProperty("--release-cursor-x", `${release.position * 100}%`);
  els.mobileReleaseCursor?.style.setProperty("--cursor-x", `${release.position * 100}%`);
  return throwPitch(challenge.pitchId, challenge.zone, challenge.targetRow, challenge.targetCol, release, true);
}

function resolvePitchLocation(pitch, plannedCourse) {
  const zone = Number(plannedCourse?.zone || 5);
  const intent = plannedCourse?.intent === "ball" ? "ball" : "strike";
  const aimed = intendedCourse(zone, intent, plannedCourse?.targetRow, plannedCourse?.targetCol);
  const release = plannedCourse?.release || null;
  const runners = state.bases.filter(Boolean).length;
  const mental = state.pitcher.stats.멘탈 ?? 60;
  const pressurePenalty = runners > 0 ? Math.max(0, 72 - mental) * runners * 0.18 : 0;
  const commandScore = clamp(
    (pitch.control + pitcherEffectiveStat("제구")) / 2 -
      pressurePenalty -
      pitch.cost * 0.75 +
      pitcherTagControlBonus(pitch, aimed, intent) +
      rewardCardControlBonus(pitch, aimed, intent) +
      (release?.commandBonus || 0),
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
  if (release?.mistakeChance && chance(release.mistakeChance)) {
    row = clamp(aimed.row + rand(-1, 1), 0, 2);
    col = clamp(aimed.col + rand(-1, 1), 0, 2);
    if (release.grade === "miss" && chance(0.45)) {
      row = 1;
      col = 1;
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
  if (pitchInputLocked({ includeRelease: false })) return;
  if (state.releaseTiming?.active) cancelReleaseTiming({ renderAfter: false });
  state.selectedPitchId = pitchId;
  renderPitchButtons();
  renderCourseControls();
  renderReleaseTimingPanel();
  renderMobileGameUi();
}

function selectPitchByNumber(numberKey) {
  if (pitchInputLocked({ includeRelease: false })) return;
  const index = Number(numberKey) - 1;
  if (index < 0 || index > 4) return;
  const pitch = state.pitcher?.repertoire?.[index];
  if (!pitch) return;
  selectPitch(pitch.id);
}

function throwPitch(pitchId, zone, targetRow = null, targetCol = null, releaseResult = null, force = false) {
  if (!force && pitchInputLocked()) return null;
  if (force) state.releaseTiming = null;

  const pitch = state.pitcher.repertoire.find((item) => item.id === pitchId);
  if (!pitch) return null;

  const release = releaseResult || neutralReleaseResult();
  const plannedCourse = {
    zone: Number(zone) || 5,
    intent: state.pitchIntent,
    ballPlan: state.pitchBallPlan,
    targetRow: Number.isFinite(Number(targetRow)) ? Number(targetRow) : null,
    targetCol: Number.isFinite(Number(targetCol)) ? Number(targetCol) : null,
    release
  };
  state.lastReleaseResult = release;

  state.pitchCount += 1;
  const batter = currentBatter();
  const pattern = buildPitchMindContext(pitch, plannedCourse, batter);
  state.atBat.pitchHistory.push(pitch.category);

  hideTiming();

  const balanceMeta = balanceLog.enabled ? { rolls: {}, probabilities: {}, thresholds: {} } : null;
  const runsBeforePitch = state.runs;
  const cardKey = (entry) => `${entry?.cardName || ""}::${entry?.text || ""}`;
  const beforeCardHead = (state.cardTriggerLog || [])[0] ? cardKey(state.cardTriggerLog[0]) : "";

  const result = enrichPitchDisplay(applyMindGameResult(resolvePitch(pitch, batter, plannedCourse, pattern, balanceMeta), pattern));
  result.release = release;
  if (balanceMeta) result._balanceCapture = { balanceMeta, plannedCourse, pattern, pitch };
  const memoryLogLines = updateBatterMemoryAfterPitch(pitch, plannedCourse, result, batter);
  const mindLogLines = updateBatterMindAfterPitch(result, plannedCourse, pattern, batter);
  result.memoryLogLines = [...memoryLogLines, ...mindLogLines];
  enrichPitchDisplay(result);
  state.lastLocation = result.location;
  animatePitch(result.location, result.pitch);
  updateRead(result);
  const progressionSnapshot = { balls: state.balls, strikes: state.strikes, isBoss: !!batter?.isBoss };
  const previousPattern = state.lastPitchPattern;
  state.lastPitchPattern = pattern;
  result.previousPattern = previousPattern;
  if (MP.processPitchProgressionAfterPitch) MP.processPitchProgressionAfterPitch(result, progressionSnapshot, pattern);
  recordPrePitchStageProgress(result, plannedCourse, pattern);
  state.nextPitchControlBonus = 0;
  applyPitchResult(result);

  if (balanceLog.active && result._balanceCapture) {
    const afterCardLog = state.cardTriggerLog || [];
    const previousHeadIndex = beforeCardHead ? afterCardLog.findIndex((entry) => cardKey(entry) === beforeCardHead) : -1;
    const cardTriggers = beforeCardHead
      ? previousHeadIndex >= 0
        ? afterCardLog.slice(0, previousHeadIndex).map((entry) => entry.cardName)
        : []
      : afterCardLog.map((entry) => entry.cardName);
    recordBalancePitchEvent(result, plannedCourse, pattern, runsBeforePitch, Math.max(0, state.runs - runsBeforePitch), cardTriggers);
    delete result._balanceCapture;
  }
  refreshRecommendationForNextPitch(batter);
  recordPitchPattern(pitch, plannedCourse, result, pattern);
  render();
  return result;
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

function appendEffectLabel(base, note) {
  return [base, note].filter(Boolean).join(" · ");
}

function applyBatterIntentReaction(effect, batter, pattern, location) {
  const intent = pattern?.ballIntent;
  if (!intent || !batter || location.inZone) return;

  const tendency = batter.tendency?.id;
  const isFirstPitch = currentAtBatPitchCount() <= 1;
  const previousIntent = state.atBat?.choiceHistory?.[state.atBat.choiceHistory.length - 1]?.ballIntent || "";

  if (tendency === "firstPitchAggro" && isFirstPitch) {
    if (intent === "fishing") {
      effect.swing += 0.07;
      effect.chase += 0.05;
      effect.contact -= 0.03;
      effect.label = appendEffectLabel(effect.label, "초구 적극 반응");
    } else if (intent === "show") {
      effect.swing += 0.04;
      effect.contactQuality -= 2;
      effect.label = appendEffectLabel(effect.label, "초구 시선 유도");
    }
  }

  if (tendency === "walkHunter") {
    if (intent === "fishing") {
      effect.swing -= 0.04;
      effect.chase -= 0.12;
      effect.label = appendEffectLabel(effect.label, "선구안 저항");
    } else if (intent === "waste") {
      effect.chase -= 0.06;
      effect.contact += 0.03;
      effect.contactQuality += 3;
      effect.label = appendEffectLabel(effect.label, "반응 숨김");
    }
  }

  if (tendency === "slugger") {
    if (intent === "brush") {
      effect.contact -= 0.02;
      effect.contactQuality -= 6;
      effect.label = appendEffectLabel(effect.label, "장타 억제");
    } else if (intent === "show") {
      effect.contactQuality += 4;
      effect.label = appendEffectLabel(effect.label, "장타자 각인 위험");
    }
  }

  if (batter.mind?.id === "adaptive" && previousIntent === intent) {
    effect.chase -= 0.1;
    effect.contact += 0.07;
    effect.contactQuality += 8;
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + scaleMindDelta(6), 0, 100);
    effect.label = appendEffectLabel(effect.label, "반복 의도 적응");
  }
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
    applyBatterIntentReaction(effect, batter, pattern, location);
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

  const rivalPattern = rivalPsychPatterns[batter?.rivalPatternId];
  if (rivalPattern?.id === "leadoffProbe") {
    if (state.balls === 0 && state.strikes === 0 && !location.inZone) effect.chase -= rivalPattern.firstPitchTake;
    if (!location.inZone) effect.chase -= rivalPattern.ballPatience;
  }
  if (rivalPattern?.id === "patternReader" && pattern?.exposed) {
    effect.contact += rivalPattern.exposedContactBonus;
    effect.foul += 0.04;
  }
  if (rivalPattern?.id === "clutchSlugger") {
    if (pattern?.targetMatch || isTargetedPitchCategory(pitch.category, state.atBat?.target)) {
      effect.contactQuality += rivalPattern.targetQualityBonus;
    }
    if (location.centerMistake) effect.contactQuality += rivalPattern.mistakeQualityBonus;
  }

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
  let triggeredTag = "";

  tags.forEach((tag) => {
    const effects = tagEffectsForPitcher(tag, state.pitcher);
    const before = { ...effect };
    applyTagLikeEffects(effect, effects, pitch, location);
    if (pitchEffectChanged(before, effect) && !triggeredTag) triggeredTag = tag.name;
    if (!effect.label && pitchEffectChanged(before, effect) && tag.type === "bonus") effect.label = tag.name;
  });

  const evoEffects = activeEvolutionEffects(pitch, location, atBat, state.pitchIntent);
  const beforeEvolution = { ...effect };
  applyTagLikeEffects(effect, evoEffects, pitch, location);
  const evolution = coreEvolutionById(state.pitcher?.coreEvolutionId);
  if (evolution && pitchEffectChanged(beforeEvolution, effect)) {
    if (!triggeredTag) triggeredTag = evolution.name;
    if (!effect.label) effect.label = evolution.name;
  }
  if (triggeredTag) addTagTriggerLog(triggeredTag, "이번 공 보정 적용");

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
  const release = plannedCourse?.release || null;
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
  const cardEffect = rewardCardPitchEffect(pitch, location, plannedCourse, pattern, batter);
  const impressionEffect = currentImpressionEffect(pitch, location);
  const batterMindEffect = currentBatterMindEffect(targetMatch, location);
  const mem = pattern.memoryModifiers || createEmptyMemoryModifiers();
  const quality = clamp(
    pitchQuality(pitch) +
      (location.commandScore - 60) * 0.08 +
      special.quality +
      mind.quality +
      profile.quality +
      tagEffect.quality +
      impressionEffect.quality +
      cardEffect.quality -
      burden.commandPenalty,
    20,
    99
  );
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
  const countPressure = countPressureProfile(state.balls, state.strikes);

  return {
    pitch,
    batter,
    atBat,
    targetMatch,
    location,
    release,
    special,
    burden,
    mind,
    profile,
    tagEffect,
    batterTag,
    cardEffect,
    impressionEffect,
    batterMindEffect,
    mem,
    quality,
    repeatedPenalty,
    inZone,
    themeFx,
    centerSwingBonus,
    centerContactBonus,
    centerQualityBonus,
    memoryQualityBonus,
    countPressure
  };
}

function pitchSwingProbability(context) {
  const { atBat, batter, targetMatch, inZone, special, mind, tagEffect, batterTag, cardEffect, impressionEffect, batterMindEffect, mem, themeFx, centerSwingBonus, countPressure } = context;
  let swingProbability = inZone ? 0.46 : 0.21;
  if (atBat.approach === "적극") swingProbability += 0.13;
  if (atBat.approach === "신중") swingProbability -= 0.12;
  if (atBat.approach === "초구" && state.balls === 0 && state.strikes === 0) swingProbability += 0.22;
  if (atBat.approach === "보호" && state.strikes === 2) swingProbability += 0.24;
  swingProbability += targetMatch ? 0.2 : -0.09;
  swingProbability +=
    countSwingAdjustment(inZone) +
    special.swing +
    mind.swing +
    tagEffect.swing +
    batterTag.swing +
    cardEffect.swing +
    impressionEffect.swing +
    batterMindEffect.swing +
    centerSwingBonus +
    (inZone ? countPressure.swingInZone : countPressure.swingOutZone) +
    (mem.swingBonus || 0) +
    (themeFx.swing || 0);
  if (!inZone) swingProbability += mind.chase + tagEffect.chase + batterTag.chase + cardEffect.chase + batterMindEffect.chase + (mem.chasePenalty || 0) + (themeFx.chase || 0);
  if (!inZone) swingProbability -= batter.stats.선구 / 280;
  return swingProbability;
}

function pitchTiming(context, balanceMeta = null) {
  const { pitch, batter, atBat, targetMatch, quality, repeatedPenalty } = context;
  const deception = targetMatch ? -0.12 : 0.16;
  const timingBase = 0.34 + batter.stats.예측 / 180 + (targetMatch ? 0.2 : -0.11) - quality / 360 - repeatedPenalty + deception;
  const timingRoll = Math.random();
  const timingValue = clamp(timingBase + (timingRoll - 0.5) * 0.34, 0.05, 0.98);
  const timingLabel = timingText(pitch.category, atBat.target, timingValue);
  if (balanceMeta) {
    balanceMeta.probabilities.timingBase = balanceRound(timingBase, 4);
    balanceMeta.rolls.timing = { roll: balanceRound(timingRoll, 4), value: balanceRound(timingValue, 4), label: timingLabel };
  }
  return {
    timingValue,
    timingLabel,
    fooledContactPenalty: timingLabel === "완전히 속음" ? -0.22 : 0,
    fooledQualityPenalty: timingLabel === "완전히 속음" ? -30 : 0
  };
}

function pitchContactProbability(context, timing) {
  const { batter, targetMatch, quality, repeatedPenalty, special, mind, tagEffect, batterTag, cardEffect, impressionEffect, batterMindEffect, centerContactBonus, themeFx, burden, mem, release, countPressure } = context;
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
    cardEffect.contact +
    impressionEffect.contact +
    batterMindEffect.contact +
    centerContactBonus +
    timing.fooledContactPenalty +
    (themeFx.contact || 0) +
    countPressure.contact +
    burden.mistakeBonus -
    burden.whiffBonus +
    (mem.contactBonus || 0) +
    (release?.contactMod || 0)
  );
}

function pitchFoulProbability(context, timingValue) {
  const { mind, batterTag, cardEffect, impressionEffect, batterMindEffect, mem, themeFx, countPressure } = context;
  return 0.34 + Math.abs(0.58 - timingValue) * 0.28 + (state.strikes === 2 ? 0.12 : 0) + mind.foul + batterTag.foul + cardEffect.foul + impressionEffect.foul + batterMindEffect.foul + countPressure.foul + (mem.foulBonus || 0) + (themeFx.foul || 0);
}

function pitchContactQuality(context, timing) {
  const { batter, targetMatch, quality, repeatedPenalty, special, mind, tagEffect, batterTag, cardEffect, impressionEffect, batterMindEffect, profile, centerQualityBonus, memoryQualityBonus, burden, themeFx, release, countPressure } = context;
  return (
    batter.stats.컨택 * 0.28 +
    batter.stats.파워 * 0.48 +
    timing.timingValue * 42 -
    quality * 0.33 +
    (targetMatch ? 10 : -10) +
    repeatedPenalty * 58 +
    special.contactQuality +
    mind.contactQuality +
    tagEffect.contactQuality +
    batterTag.contactQuality +
    cardEffect.contactQuality +
    impressionEffect.contactQuality +
    batterMindEffect.contactQuality +
    profile.contactQuality +
    centerQualityBonus +
    countPressure.contactQuality +
    timing.fooledQualityPenalty +
    memoryQualityBonus +
    burden.mistakeBonus * 120 +
    burden.homerunBonus * 160 +
    (themeFx.homerunBonus || 0) * 120 +
    (themeFx.contactQuality || 0) +
    (release?.contactQualityMod || 0) +
    rand(-14, 12)
  );
}

function pitchResultSpecial(context) {
  const { special, mind, batterTag, tagEffect, cardEffect, impressionEffect, batterMindEffect, profile } = context;
  return { ...special, label: mind.label || impressionEffect.label || batterMindEffect.label || cardEffect.label || batterTag.label || tagEffect.label || special.label || profile.label };
}

function ballInPlaySpecial(context) {
  const { special, tagEffect, batterTag, cardEffect } = context;
  return {
    ...pitchResultSpecial(context),
    doublePlayBonus: (special.doublePlayBonus || 0) + (tagEffect.doublePlayBonus || 0) + (batterTag.doublePlayBonus || 0) + (cardEffect.doublePlayBonus || 0),
    groundOutReduce: (special.groundOutReduce || 0) + (batterTag.groundOutReduce || 0),
    texasHitBonus: batterTag.texasHitBonus || 0
  };
}

function resolvePitch(pitch, batter, plannedCourse, pattern = {}, balanceMeta = null) {
  const context = buildPitchResolutionContext(pitch, batter, plannedCourse, pattern);
  if (balanceMeta) balanceMeta.context = context;
  const { atBat, targetMatch, location, inZone, mem } = context;
  const swingProbability = pitchSwingProbability(context);
  if (balanceMeta) balanceMeta.probabilities.swing = balanceRound(swingProbability, 4);
  const swung = balanceChance(swingProbability, "swing", balanceMeta);

  if (!swung) {
    let noSwingResult = inZone ? "calledStrike" : "ball";
    const takeBallChance = 0.08 + (mem.takeBallBonus || 0);
    if (!inZone && (mem.takeBallBonus || 0) > 0) {
      if (balanceMeta) balanceMeta.probabilities.takeBall = balanceRound(takeBallChance, 4);
      if (balanceChance(takeBallChance, "takeBall", balanceMeta)) noSwingResult = "ball";
    }
    return {
      pitch,
      batter,
      location,
      inZone,
      swung,
      targetMatch,
      special: pitchResultSpecial(context),
      impressionEffect: context.impressionEffect,
      timingValue: 0,
      timingLabel: inZone ? "지켜봄" : "참아냄",
      result: noSwingResult,
      detail: inZone ? "타자가 그대로 얼어붙었습니다." : "존 밖 공을 끝까지 봤습니다.",
      clue: inZone && !targetMatch ? "노림과 다른 공이 들어간 듯합니다." : "유인구 반복은 신중해야 합니다."
    };
  }

  const timing = pitchTiming(context, balanceMeta);
  const contactProbability = pitchContactProbability(context, timing);
  if (balanceMeta) balanceMeta.probabilities.contact = balanceRound(contactProbability, 4);
  if (!balanceChance(contactProbability, "contact", balanceMeta)) {
    return {
      pitch,
      batter,
      location,
      inZone,
      swung,
      targetMatch,
      special: pitchResultSpecial(context),
      impressionEffect: context.impressionEffect,
      timingValue: timing.timingValue,
      timingLabel: timing.timingLabel,
      result: "swingingStrike",
      detail: "배트가 공 밑을 지나갔습니다.",
      clue: targetMatch ? "기다린 공에 가까웠지만 공의 힘이 이겼습니다. 같은 승부는 한 번 더 신중해야 합니다." : "타이밍을 흔드는 데 성공했습니다."
    };
  }

  const foulProbability = pitchFoulProbability(context, timing.timingValue);
  if (balanceMeta) balanceMeta.probabilities.foul = balanceRound(foulProbability, 4);
  if (balanceChance(foulProbability, "foul", balanceMeta) && timing.timingValue < 0.78) {
    return {
      pitch,
      batter,
      location,
      inZone,
      swung,
      targetMatch,
      special: pitchResultSpecial(context),
      impressionEffect: context.impressionEffect,
      timingValue: timing.timingValue,
      timingLabel: timing.timingLabel,
      result: "foul",
      detail: "가까스로 걷어냈습니다.",
      clue: targetMatch ? "타자가 타이밍을 맞춰가고 있습니다." : "타이밍은 빗나갔지만 배트에 맞혔습니다. 다음 공은 더 확실한 의도가 필요합니다."
    };
  }

  const contactQuality = pitchContactQuality(context, timing);
  if (balanceMeta) balanceMeta.contactQuality = balanceRound(contactQuality, 2);
  return makeBallInPlayResult(
    {
      pitch,
      batter,
      location,
      inZone,
      swung,
      targetMatch,
      special: ballInPlaySpecial(context),
      impressionEffect: context.impressionEffect,
      timingValue: timing.timingValue,
      timingLabel: timing.timingLabel,
      contactQuality
    },
    balanceMeta
  );
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
    return `속였지만 ${direction.side} 외야 앞 빈 곳에 힘없이 떨어졌습니다.`;
  }
  if (bases >= 4) return `타자가 공을 정확히 기다렸고 ${direction.side} 담장을 넘겼습니다.`;
  if (bases === 2) return `타자가 공을 정확히 기다렸습니다. ${direction.lane}을 가르는 2루타입니다.`;
  return `타자가 기다리던 타이밍에 맞췄습니다. ${direction.lane}으로 빠지는 안타입니다.`;
}

function errorChanceFor(base) {
  const weakGrounder = base.contactQuality < 42 || base.location.row >= 2;
  let errorChance = 0.015;
  if (weakGrounder) errorChance += 0.018;
  if (state.bases.some(Boolean)) errorChance += 0.008;
  if ((state.pitcher.stats.멘탈 ?? 60) < 46) errorChance += 0.008;
  return clamp(errorChance, 0.005, 0.055);
}

function makeBallInPlayResult(base, balanceMeta = null) {
  const { contactQuality, batter, pitch, location, special } = base;
  let texasChance = 0.1 + (special?.texasHitBonus || 0);
  if (pitcherHasTag("texas_suppress")) {
    const suppress = tagById("texas_suppress")?.effects?.texasHitSuppress || 0.06;
    texasChance -= suppress;
  }
  texasChance = clamp(texasChance, 0.02, 0.22);
  if (balanceMeta) {
    balanceMeta.thresholds.contactQuality = balanceRound(contactQuality, 2);
    balanceMeta.thresholds.homerun = 89 + (location.centerMistake ? 0 : 3) + (location.row >= 2 ? 2 : 0);
    balanceMeta.thresholds.double = 72 + Math.max(0, (location.centerMistake ? 0 : 3) - 1);
    balanceMeta.thresholds.single = 52;
  }
  const weakGrounder = contactQuality < 38 || location.row >= 2 || pitch.id === "two" || pitch.id === "sinker";
  const doublePlayChance =
    state.bases[0] && state.outs < 2 && contactQuality <= 50
      ? clamp(
          0.14 +
            (pitch.category === "breaking" ? 0.12 : 0) +
            (location.row >= 2 ? 0.1 : 0) +
            (contactQuality < 38 ? 0.1 : 0) +
            (pitch.id === "two" || pitch.id === "sinker" ? 0.06 : 0) +
            (special?.doublePlayBonus || 0),
          weakGrounder ? 0.18 : 0,
          weakGrounder ? 0.48 : 0.32
        )
      : 0;
  if (balanceMeta && doublePlayChance > 0) balanceMeta.probabilities.doublePlay = balanceRound(doublePlayChance, 4);

  if (base.timingLabel === "완전히 속음") {
    if (contactQuality > 48 && balanceChance(texasChance, "texasHit", balanceMeta)) {
      const texasBase = { ...base, hitType: "texas" };
      return {
        ...texasBase,
        result: "single",
        detail: hitDetail(texasBase, 1),
        clue: "선택은 틀리지 않았습니다."
      };
    }
    if (doublePlayChance > 0 && balanceChance(doublePlayChance, "doublePlay", balanceMeta)) {
      return {
        ...base,
        result: "doublePlay",
        detail: "힘없는 땅볼이 병살 코스로 흘렀습니다.",
        clue: "주자 상황까지 계산한 낮은 승부가 통했습니다."
      };
    }
    return {
      ...base,
      result: "inPlayOut",
      outLabel: "GROUND OUT!",
      detail: "타구를 눌렀습니다.",
      clue: "낮은 코스 운영이 통했습니다."
    };
  }

  const cornerLongHitBuffer = location.centerMistake ? 0 : 3;
  const lowLongHitBuffer = location.row >= 2 ? 2 : 0;
  const homerunThreshold = 89 + cornerLongHitBuffer + lowLongHitBuffer;
  const doubleThreshold = 72 + Math.max(0, cornerLongHitBuffer - 1);

  if (contactQuality > homerunThreshold) {
    return {
      ...base,
      result: "homerun",
      detail: hitDetail(base, 4),
      clue: "방금 패턴은 완전히 읽혔습니다."
    };
  }
  if (contactQuality > doubleThreshold) {
    return {
      ...base,
      result: "double",
      detail: hitDetail(base, 2),
      clue: "같은 계열 반복은 위험합니다."
    };
  }
  if (contactQuality > 52) {
    return {
      ...base,
      result: "single",
      detail: hitDetail(base, 1),
      clue: "이 흐름은 당분간 피해야 합니다."
    };
  }
  if (doublePlayChance > 0 && balanceChance(doublePlayChance, "doublePlay", balanceMeta)) {
    return {
      ...base,
      result: "doublePlay",
      detail: "낮게 누른 공이 병살 코스로 갔습니다.",
      clue: "주자 상황을 잘 이용했습니다."
    };
  }
  const errorChance = errorChanceFor(base);
  if (balanceMeta) balanceMeta.probabilities.error = balanceRound(errorChance, 4);
  if (balanceChance(errorChance, "error", balanceMeta)) {
    return {
      ...base,
      result: "error",
      detail: "타구 질은 약했지만 수비 실책으로 출루를 허용했습니다.",
      clue: "타구 질은 약했지만 야수 판단이 흔들렸습니다."
    };
  }
  const groundOutRoll = contactQuality < 38 || pitch.id === "two" || location.row >= 2;
  const groundOutReduce = special?.groundOutReduce || 0;
  if (balanceMeta && groundOutReduce > 0) balanceMeta.probabilities.groundOutReduce = balanceRound(groundOutReduce, 4);
  const groundOut = groundOutRoll && !balanceChance(groundOutReduce, "groundOutReduce", balanceMeta);
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
  const target = state.atBat?.target;

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
  if (hasRewardCard("R016") && result.countBefore === "0-0") {
    scores[selected] += result.swung || result.inZone ? 0.35 : 0.18;
    if (target && result.targetMatch) scores[target] += 0.45;
  }
  if (dugoutEffectValue("reactionCheckBoost") && result.countBefore === "0-0") {
    scores[selected] += dugoutEffectValue("reactionCheckBoost");
  }
  if (hasRewardCard("R017") && result.result === "foul") {
    scores[selected] += 0.65;
    if (target && result.targetMatch) scores[target] += 0.45;
  }
  if (dugoutEffectValue("courseReadBoost") && result.result === "foul") {
    scores[selected] += dugoutEffectValue("courseReadBoost");
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
  if (result.result === "ball") return "BALL";
  if (result.result === "calledStrike") return "STRIKE";
  if (result.result === "swingingStrike") return "헛스윙";
  if (result.result === "foul") return "FOUL";
  if (!result.swung) return "";
  if (result.timingValue > 0.78) return "FULL SWING";
  if (result.timingValue > 0.62) return "GOOD SWING";
  return "WEAK SWING";
}

function swingFeedbackTone(result) {
  if (result.result === "ball") return "good";
  if (result.result === "calledStrike" || result.result === "swingingStrike" || result.result === "foul") return "warn";
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

function hitTitle(result) {
  if (result.result === "single" && result.hitType === "texas") return "TEXAS HIT!";
  if (result.result === "single") return "BASE HIT!";
  if (result.result === "double") return "DOUBLE!";
  if (result.result === "homerun") return "HOME RUN!";
  return "";
}

function isStrikeLikeResult(result) {
  return ["calledStrike", "swingingStrike", "foul"].includes(result?.result);
}

function isAtBatEndingResult(result) {
  return ["walk", "calledStrike", "swingingStrike", "inPlayOut", "error", "doublePlay", "single", "double", "homerun"].includes(result?.result);
}

function isOutResult(result) {
  return ["calledStrike", "swingingStrike", "inPlayOut", "doublePlay"].includes(result?.result);
}

function rewardReasonForAtBat(title, result) {
  if (title === "DOUBLE PLAY!") return "병살 보상";
  if (result?.batter?.isBoss && isOutResult(result)) return "보스 제압 보상";
  if (title === "STRIKE OUT!") return "삼진 보상";
  return "";
}

function isOnBaseResult(result) {
  return ["walk", "error", "single", "double", "homerun"].includes(result?.result);
}

function isLongHitResult(result) {
  return ["double", "homerun"].includes(result?.result);
}

function hasScoringPositionFromKey(key) {
  return String(key || "").includes("2") || String(key || "").includes("3");
}

function recordPrePitchStageProgress(result, plannedCourse, pattern) {
  const run = ensureStageRunState();
  const stats = currentInningTracking();
  const pitchId = result.pitch?.id || pattern?.pitchId || "";
  if (pitchId) {
    if (run.pitchStreakId === pitchId) run.pitchStreak += 1;
    else {
      run.pitchStreakId = pitchId;
      run.pitchStreak = 1;
    }
    run.maxPitchStreak = Math.max(run.maxPitchStreak, run.pitchStreak);
    stats.maxPitchStreak = Math.max(stats.maxPitchStreak, run.pitchStreak);
  }
  const courseKey = `${pattern?.side || zoneSide(plannedCourse.zone)}_${pattern?.height || zoneHeight(plannedCourse.zone)}`;
  if (courseKey === run.courseStreakKey) run.courseStreak += 1;
  else {
    run.courseStreakKey = courseKey;
    run.courseStreak = 1;
  }
  if (result.countBefore === "0-0" && isStrikeLikeResult(result)) stats.firstPitchStrikes += 1;
  const suspicion = Math.round(state.atBat?.suspicion || pattern?.suspicion || 0);
  run.suspicionTotal += suspicion;
  run.suspicionSamples += 1;
  stats.suspicionTotal += suspicion;
  stats.suspicionSamples += 1;
  stats.suspicionEnd = suspicion;
  if (result.batter?.isRival && pitchId) {
    run.rival.pitchUseCounts[pitchId] = (run.rival.pitchUseCounts[pitchId] || 0) + 1;
  }
  if (plannedCourseMatchesRevealedWeakness(result, plannedCourse)) {
    stats.weaknessChoices += 1;
    result.weaknessFeedback = result.weaknessFeedback || "공략 시도";
  }
  if (pitchMatchesRevealedWeakness(result) && isStrikeLikeResult(result)) {
    stats.weaknessPitchSuccesses += 1;
    if (result.weaknessFeedback !== "공략 성공") showEventBanner("약점 공략 성공", "reward", 900);
    result.weaknessFeedback = "공략 성공";
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) - 8, 0, 100);
    if (hasRewardCard("R009")) applyCardSuspicionDelta(-10, "공략 보조태그 활용", "공략 승부 성공으로 다음 같은 흐름을 숨겼습니다.");
    if (hasRewardCard("K005")) state.nextPitchControlBonus += 7;
  }
  if (isOutResult(result)) {
    const relief = result.result === "doublePlay" ? -12 : result.result === "swingingStrike" || result.result === "calledStrike" ? -10 : -5;
    if (state.atBat) state.atBat.suspicion = clamp((state.atBat.suspicion || 0) + relief, 0, 100);
  }
  if (result.countBefore === "0-0" && isStrikeLikeResult(result) && hasRewardCard("C007")) {
    addCardTriggerLog("플레이트 점유", "초구 스트라이크로 타자가 플레이트를 의식합니다.");
  }
  if (result.countBefore === "0-0" && hasRewardCard("R016")) {
    addCardTriggerLog("반응 체크", "초구 반응으로 다음 승부의 기준을 좁혔습니다.");
  }
  if (result.result === "foul" && hasRewardCard("R017")) {
    addCardTriggerLog("파울 분석", "파울 타이밍으로 타자의 기준점을 읽었습니다.");
  }
  if (result.pitch?.id === "curve" && !result.swung && hasRewardCard("C004")) {
    applyCardSuspicionDelta(-5 * cardStackCount("C004"), "커브로 시선 끌기", "커브를 지켜보게 만들어 다음 빠른 공이 살아납니다.");
  }
  if (pattern?.side === "outside" && result.inZone && hasRewardCard("C011")) {
    applyCardSuspicionDelta(-5 * cardStackCount("C011"), "바깥쪽으로 멀어지게", "바깥쪽 제구 성공으로 다음 몸쪽 승부가 숨었습니다.");
  }
  if (result.previousPattern?.category === "fast" && result.pitch?.category !== "fast" && hasRewardCard("R001")) {
    applyCardSuspicionDelta(-8, "완급으로 흔들기", "직구 뒤 느린 공으로 타이밍을 빼앗았습니다.");
  }
  if (result.previousPattern?.pitchId === result.pitch?.id && hasRewardCard("R005") && isStrikeLikeResult(result)) {
    applyCardSuspicionDelta(-5, "같은 공 재요구", "같은 공을 다시 요구했지만 타자가 바로 기다리지 못했습니다.");
  }
  if (
    result.previousPattern?.height === "high" &&
    pattern?.height === "low" &&
    result.pitch?.category !== "fast" &&
    hasRewardCard("R015") &&
    isStrikeLikeResult(result)
  ) {
    addCardTriggerLog("시선 높이 함정", "높은 공 뒤 낮은 변화구로 눈높이를 흔들었습니다.");
  }
  if (result.countBefore === "3-2" && hasRewardCard("R012")) {
    applyCardSuspicionDelta(-5, "풀카운트 침착", "풀카운트 승부 집중");
  }
}

function shouldTriggerHighlight(result, runsScored) {
  if (!result || !isAtBatEndingResult(result)) return false;
  const suspicion = state.atBat?.suspicion || 0;
  if (state.stageIndex < 1) return false;
  const pressureFlags = [
    !!(result.batter?.isRival || result.batter?.isBoss),
    suspicion >= (state.stageIndex === 2 ? 80 : 75),
    hasScoringPositionFromKey(result.runnersBefore),
    state.consecutiveOnBase >= 2,
    runsScored > 0
  ];
  const pressureCount = pressureFlags.filter(Boolean).length;
  if (pressureCount >= 3) return false;
  if (state.stageIndex === 2 && state.inning === 5) return pressureCount <= 2;
  return pressureCount > 0;
}

function recordHighlightResult(result, runsScored) {
  if (!shouldTriggerHighlight(result, runsScored)) return;
  const run = ensureStageRunState();
  const stats = currentInningTracking();
  const success = isOutResult(result) && !isLongHitResult(result) && runsScored <= 0;
  if (success) {
    run.highlight.successes += 1;
    stats.highlightSuccesses += 1;
    run.rewardBoost.rareBonus += 0.1;
    run.rewardBoost.coreBonus += 0.05;
    absorbCardPerformance(0.04, 0.02);
    if (result.batter?.isRival) revealBatterWeakness(result.batter);
    addLog("하이라이트 승부 성공", "위기 승부를 이겨냈습니다. 보상 흐름이 좋아집니다.");
  } else {
    run.highlight.failures += 1;
    run.highlight.lastText = "하이라이트 실패";
    state.nextBatterSuspicionBonus += state.stageIndex === 2 ? 15 : 10;
    addLog("하이라이트 승부 실패", "위기 승부를 놓쳤습니다. 다음 타자가 같은 흐름을 더 빨리 기다립니다.");
  }
}

function recordStageOutcomeFromPitch(result, runsScored = 0) {
  const run = ensureStageRunState();
  const stats = currentInningTracking();
  stats.runs += runsScored;
  if (runsScored > 0 && hasScoringPositionFromKey(result.runnersBefore)) stats.scoringPositionRuns += runsScored;
  if (result.result === "walk") {
    run.walks += 1;
    stats.walks += 1;
  }
  if ((result.result === "calledStrike" || result.result === "swingingStrike") && state.strikes >= 3) {
    run.strikeouts += 1;
    stats.strikeouts += 1;
    absorbCardPerformance(0.03);
  }
  if (["single", "double", "homerun"].includes(result.result)) {
    run.hits += 1;
    stats.hits += 1;
  }
  if (result.result === "double") {
    run.doubles += 1;
    run.longHits += 1;
    stats.doubles += 1;
    stats.longHits += 1;
  }
  if (result.result === "homerun") {
    run.homeruns += 1;
    run.longHits += 1;
    stats.homeruns += 1;
    stats.longHits += 1;
  }
  if (isLongHitResult(result) && result.batter?.slot >= 3 && result.batter?.slot <= 5) stats.centerLongHits += 1;
  if (state.currentAtBatMeta?.isFirstBatterOfInning && isOnBaseResult(result)) stats.firstBatterOnBaseAllowed = true;
  if (result.batter?.isRival && isAtBatEndingResult(result)) {
    run.rival.plateAppearances += 1;
    if (isOnBaseResult(result)) run.rival.onBaseAllowed += 1;
    if (isLongHitResult(result)) run.rival.longHitsAllowed += 1;
  }
  if (pitchMatchesRevealedWeakness(result)) {
    if (isOutResult(result)) stats.weaknessOuts += 1;
    if (["calledStrike", "swingingStrike", "inPlayOut", "doublePlay"].includes(result.result)) {
      stats.weaknessPitchSuccesses += 1;
      if (result.weaknessFeedback !== "공략 성공") showEventBanner("약점 공략 성공", "reward", 900);
      result.weaknessFeedback = "공략 성공";
      absorbCardPerformance(0.03);
      if (hasRewardCard("R009")) applyCardSuspicionDelta(-10, "공략 보조태그 활용", "공략 승부 성공으로 다음 같은 흐름을 숨겼습니다.");
      if (hasRewardCard("K005")) state.nextPitchControlBonus += 7;
    }
  }
  if (result.result === "doublePlay") absorbCardPerformance(0.05, 0.01);
  if ((result.result === "calledStrike" || result.result === "swingingStrike") && state.strikes >= 3 && hasRewardCard("K008")) {
    run.rewardBoost.guaranteedRare += 1;
    addCardTriggerLog("결승구 설계", "2스트 이후 삼진으로 희귀 보상 흐름이 열렸습니다.");
  }
  if ((result.result === "calledStrike" || result.result === "swingingStrike") && state.strikes >= 3 && result.batter?.isBoss) {
    run.rewardBoost.guaranteedRare += 1;
    addLog("보스 삼진 보상", "보스 타자를 삼진으로 잡아 희귀 보상 흐름이 열렸습니다.");
  }
  if (result.outLabel === "GROUND OUT!" && hasRewardCard("K001")) {
    state.nextBatterSuspicionBonus -= 10;
    addCardTriggerLog("땅볼 설계자", "땅볼로 흐름을 끊어 다음 타자가 바로 기다리지 못합니다.");
  }
  if ((result.pitch?.burden || 0) >= 50 && hasRewardCard("K003")) {
    if (isOutResult(result)) applyCardSuspicionDelta(-20, "부담 건 승부", "피로가 쌓인 공으로도 타자의 기다림을 끊었습니다.");
    else if (isLongHitResult(result)) run.rewardBoost.coreBonus = Math.max(0, run.rewardBoost.coreBonus - 0.05);
  }
  recordHighlightResult(result, runsScored);
  checkStageRunLimit(result);
}

function checkStageRunLimit(result = {}) {
  if (state.gameOver || state.pendingGameOver) return;
  const limit = currentStageRunLimit();
  if (state.runs >= limit) {
    queueGameOverAfterResult(result, `${limit}실점에 도달했습니다. 오늘은 타자들이 배합을 더 빨리 읽었습니다.`);
  }
}

function applyPitchResult(result) {
  enrichPitchDisplay(result);
  recordPitchReactionSummary(result);
  const title = pitchLogTitle(result);
  const text = pitchLogText(result);
  const revealText = targetRevealText(result);
  recordMobilePitchResult(result);
  state.lastPitchCall = pitchCall(result);
  playResultSound(result);
  if (state.balls === 3 && state.strikes === 2) {
    state.fullCountSeen += 1;
    if (state.fullCountSeen >= 3) checkWeaknessReveal("fullCountStress");
  }

  const majorText = majorResultText(result);
  if (majorText) showEventBanner(majorText, majorResultTone(result), GAME_TIMING.eventBannerPitchResult);

  const swingFeedback = swingFeedbackText(result);
  const call = pitchCall(result);
  if (swingFeedback) queueTiming(swingFeedback, swingFeedbackTone(result));
  else if (call.label) queueTiming(call.label, call.type === "strike" ? "warn" : call.type === "ball" ? "good" : "danger");
  els.batterFigure.classList.toggle("swing", result.swung);

  window.setTimeout(() => {
    els.strikeZone.classList.remove("flash-danger", "flash-good");
    els.batterFigure.classList.remove("swing");
    hideBallSprite();
  }, GAME_TIMING.pitchResultCleanup);

  if (result.result !== "ball") state.consecutiveBalls = 0;
  const runsBeforePitch = state.runs;

  switch (result.result) {
    case "ball":
      state.consecutiveBalls += 1;
      state.balls += 1;
      if (state.balls >= 4) {
        walkBatter();
        recordStageOutcomeFromPitch({ ...result, result: "walk" }, state.runs - runsBeforePitch);
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
        recordStageOutcomeFromPitch(result, state.runs - runsBeforePitch);
        addOut();
        state.runStats.strikeouts += 1;
        if (result.batter.isBoss) state.runStats.bossOuts += 1;
        finishAtBat("STRIKE OUT!", pitchLogText(result, { reveal: revealText }), {
          result,
          rewardReason: rewardReasonForAtBat("STRIKE OUT!", result)
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
      recordStageOutcomeFromPitch(result, state.runs - runsBeforePitch);
      addOut();
      if (result.batter.isBoss) state.runStats.bossOuts += 1;
      const outTitle = result.outLabel || "FLY OUT!";
      finishAtBat(outTitle, pitchLogText(result, { reveal: revealText }), {
        result,
        rewardReason: rewardReasonForAtBat(outTitle, result)
      });
      break;
    case "error":
      advanceRunners(1);
      recordStageOutcomeFromPitch(result, state.runs - runsBeforePitch);
      noteOnBaseAllowed("error");
      finishAtBat("ERROR!", pitchLogText(result, { reveal: revealText }), { result });
      break;
    case "doublePlay":
      noteOutRecorded();
      recordStageOutcomeFromPitch(result, state.runs - runsBeforePitch);
      turnDoublePlay();
      state.runStats.doublePlays += 1;
      if (result.batter.isBoss) state.runStats.bossOuts += 1;
      finishAtBat("DOUBLE PLAY!", pitchLogText(result, { reveal: revealText }), {
        result,
        rewardReason: rewardReasonForAtBat("DOUBLE PLAY!", result)
      });
      break;
    case "single":
      advanceRunners(1);
      recordStageOutcomeFromPitch(result, state.runs - runsBeforePitch);
      noteOnBaseAllowed("hit");
      state.runStats.hits += 1;
      if (result.batter.isBoss) state.runStats.bossDamage += 1;
      finishAtBat(hitTitle(result), pitchLogText(result, { reveal: revealText }), { result });
      break;
    case "double":
      advanceRunners(2);
      recordStageOutcomeFromPitch(result, state.runs - runsBeforePitch);
      noteOnBaseAllowed("hit");
      state.runStats.hits += 1;
      state.runStats.doubles += 1;
      if (result.batter.isBoss) state.runStats.bossDamage += 1;
      finishAtBat(hitTitle(result), pitchLogText(result, { reveal: revealText }), { result });
      break;
    case "homerun":
      advanceRunners(4);
      recordStageOutcomeFromPitch(result, state.runs - runsBeforePitch);
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
    queueGameOverAfterResult(result, `${currentStageRunLimit()}실점에 도달했습니다. 오늘은 타자들이 배합을 더 빨리 읽었습니다.`);
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
  addLog("위험 보조태그 공개", `${tag.name} · ${tag.description}`);
  showEventBanner("위험 보조태그 공개", "walk", GAME_TIMING.weaknessBanner);
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
  state.releaseTiming = null;
  state.lastReleaseResult = null;
  state.mobilePitchRecords = [];
  if (els.runsText) els.runsText.textContent = "0";
  state.batterIndex = 0;
  state.lineup = generateLineup(state.stageIndex);
  state.stageRun = createStageRunState(state.stageIndex);
  resetStageGrowthSummary();
  state.currentInningStats = null;
  state.currentAtBatMeta = null;
  state.pendingDugoutChoices = [];
  state.dugoutPending = false;
  state.activeDugoutEffects = [];
  state.lastStageResult = null;
  assignStageRival();
  beginInningTracking(1);
  state.dugoutPending = false;
  state.dugoutBeforeAtBat = false;
  state.dugoutAdvanceBatterOnConfirm = false;
  state.pendingDugoutChoices = [];
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
      const completedInning = state.inning;
      finalizeInningMission(completedInning);
      state.outs = 0;
      state.bases = [false, false, false];
      state.inning += 1;
      if (state.inning > currentStageInnings()) {
        state.lastStageResult = calculateStageResult();
        recordBalanceStageClear(state.lastStageResult);
        ensureStageRunState().completed = true;
        state.pendingCoreEvolutionReward = true;
        if (state.stageIndex >= stageInnings.length - 1) {
          state.pendingRunComplete = true;
          state.pendingRunCompleteMessage = "7이닝 최종 스테이지까지 버텨냈습니다. 마운드의 심리전에서 이겼습니다.";
          state.inning = currentStageInnings();
          addLog("최종 스테이지 클리어", `${stageResultStarLabel(state.lastStageResult.stars)} · 마지막 카드 보상을 정산합니다.`);
        } else {
          state.pendingThemeChoices = MP.rollThemeChoices
            ? MP.rollThemeChoices(state.stageIndex + 1, state.pitcher)
            : [];
          state.awaitingThemeSelection = true;
          state.inning = currentStageInnings();
          addLog("스테이지 클리어", `${currentStageInnings()}이닝을 막았습니다. ${stageResultStarLabel(state.lastStageResult.stars)} 보상을 정산합니다.`);
        }
      } else {
        if (MP.recoverPitchBurdenInning) MP.recoverPitchBurdenInning();
        state.mobilePitchRecords = [];
        beginInningTracking(state.inning);
        state.pendingDugoutChoices = generateDugoutChoices();
        state.dugoutPending = state.pendingDugoutChoices.length > 0;
        state.dugoutBeforeAtBat = state.dugoutPending;
        state.dugoutAdvanceBatterOnConfirm = state.dugoutPending;
        addLog(
          "다음 이닝 미션 공개",
          state.dugoutPending
            ? `${missionActionText(currentMission())} · 덕아웃에서 직전 반응을 보고 판단하세요.`
            : `${missionActionText(currentMission())} · 덕아웃 이벤트 없이 바로 다음 이닝으로 갑니다.`
        );
        queueTransitionBanner(`INNING CHANGE · ${state.inning} INNING`, "inning", 1600);
      }
      break;
    }
  }
}

function finishAtBat(title, text, options = {}) {
  const growthResult = processAtBatGrowth(options.result, title);
  addLog(title, appendGrowthMark(text, growthResult));
  recordMobileGrowthMark(growthResult);
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
  state.waitingNextBatter = !state.gameOver && !state.pendingGameOver;
  els.nextBatterButton.hidden = true;
  if (state.gameOver || state.pendingGameOver) return;
  const transition = state.pendingTransitionBanner;
  const stageOverlay = state.pendingStageOverlay;
  state.pendingTransitionBanner = null;
  state.pendingStageOverlay = null;
  if (transition) {
    window.setTimeout(() => {
      if (!state.gameOver) showInningChangeOverlay(transition);
    }, GAME_TIMING.inningTransitionDelay);
  }
  if (state.pendingRunComplete || state.awaitingThemeSelection) {
    logStageGrowthSummaryOnce();
  }
  if (options.rewardReason) {
    state.afterRewardStageOverlay = stageOverlay;
    clearRewardTimer();
    rewardTimer = window.setTimeout(() => {
      rewardTimer = null;
      openRewardDraft(options.rewardReason, options.result);
    }, transition ? GAME_TIMING.rewardAfterOutWithTransition : GAME_TIMING.rewardAfterOut);
    return;
  }
  if (state.pendingRunComplete) {
    clearRewardTimer();
    rewardTimer = window.setTimeout(() => {
      rewardTimer = null;
      openStageTagReward();
    }, transition ? GAME_TIMING.rewardAfterOutWithTransition : 600);
    return;
  }
  if (state.awaitingThemeSelection) {
    clearRewardTimer();
    rewardTimer = window.setTimeout(() => {
      rewardTimer = null;
      openStageTagReward();
    }, transition ? GAME_TIMING.rewardAfterOutWithTransition : 600);
    return;
  }
  if (state.dugoutPending) {
    clearRewardTimer();
    rewardTimer = window.setTimeout(() => {
      rewardTimer = null;
      openDugoutChoiceOverlay();
    }, transition ? GAME_TIMING.rewardAfterOutWithTransition : 450);
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
  rewardTimer = window.setTimeout(() => {
    rewardTimer = null;
    openStageTagReward();
  }, delay + GAME_TIMING.stageTagRewardDelay);
}

function nextScheduledBatter() {
  if (!state.lineup?.length) return null;
  const offset = state.dugoutBeforeAtBat && !state.dugoutAdvanceBatterOnConfirm ? 0 : 1;
  return state.lineup[(state.batterIndex + offset) % state.lineup.length] || null;
}

function dugoutChoiceCanAppear(choice) {
  if (!choice?.requiresNextInningThreat) return true;
  const batter = nextScheduledBatter();
  return !!(batter?.isBoss || batter?.isRival);
}

const DUGOUT_EVENT_CHANCE = 0.7;

const DUGOUT_READ_EVENTS = [
  {
    id: "read_fast_late",
    signal: "fastLate",
    title: "코치의 빠른 공 사인",
    desc: "직전 이닝에서 타자들의 배트가 뒤늦게 따라오는 장면이 있었습니다. 다음 이닝 첫 흐름을 어떻게 잡을까요?",
    choices: [
      {
        label: "강속구로 먼저 밀어붙인다",
        correct: true,
        resultText: "판단 적중\n강속구 구위 상승",
        effects: { fastControl: 6, firstStrikePressure: 1 }
      },
      {
        label: "느린 공 유인을 늘린다",
        correct: false,
        resultText: "판단 빗나감\n초구 정타 위험 증가",
        effects: { firstBatterSuspicion: 8, singleRisk: 0.08 }
      }
    ]
  },
  {
    id: "read_swing_early",
    signal: "swingEarly",
    title: "손끝 감각 확인",
    desc: "타자들이 앞에서 배트를 내는 반응이 보였습니다. 다음 이닝에는 어떤 타이밍으로 흔들까요?",
    choices: [
      {
        label: "느린 공과 변화구를 믿는다",
        correct: true,
        resultText: "판단 적중\n변화구 제구 상승",
        effects: { breakingQuality: 5, slowAfterFastBoost: 0.12 }
      },
      {
        label: "강속구 비중을 더 높인다",
        correct: false,
        resultText: "판단 빗나감\n강속구 정타 위험 증가",
        effects: { firstBatterSuspicion: 6, singleRisk: 0.1 }
      }
    ]
  },
  {
    id: "read_inside_mark",
    signal: "insideAware",
    title: "포수의 몸쪽 사인",
    desc: "몸쪽 승부 이후 타자들이 플레이트를 의식했습니다. 그 의식을 어떻게 회수할까요?",
    choices: [
      {
        label: "바깥쪽 승부로 빼낸다",
        correct: true,
        resultText: "판단 적중\n몸쪽 각인 이후 바깥쪽 범타 확률 증가",
        effects: { impressionBonus: 0.14, courseReadBoost: 0.25 }
      },
      {
        label: "몸쪽을 한 번 더 찌른다",
        correct: false,
        resultText: "판단 빗나감\n몸쪽 반복 의심 증가",
        effects: { repeatSuspicionMult: 1.12, firstBatterSuspicion: 5 }
      }
    ]
  },
  {
    id: "read_hard_contact",
    signal: "hardContactRisk",
    title: "반복 승부 경고",
    desc: "정타에 가까운 반응이나 읽힌 승부가 나왔습니다. 같은 흐름을 이어갈까요?",
    choices: [
      {
        label: "구종이나 높이를 바꾼다",
        correct: true,
        resultText: "판단 적중\n반복 간파 위험 감소",
        effects: { repeatSuspicionMult: 0.82, suspicionMult: 0.92 }
      },
      {
        label: "성공했던 흐름을 유지한다",
        correct: false,
        resultText: "판단 빗나감\n반복 패턴 의심 증가",
        effects: { repeatSuspicionMult: 1.18, firstBatterSuspicion: 10 }
      }
    ]
  }
];

function reactionCount(tag) {
  return ensureStageRunState().reactionCounts?.[tag] || 0;
}

function generateDugoutReadEventChoices() {
  const signalTotal = Object.values(ensureStageRunState().reactionCounts || {}).reduce((sum, value) => sum + value, 0);
  if (signalTotal < 3 || Math.random() > DUGOUT_EVENT_CHANCE) return [];
  const weighted = DUGOUT_READ_EVENTS.map((event) => ({
    event,
    weight: Math.max(0, reactionCount(event.signal))
  })).filter((entry) => entry.weight > 0);
  const selected = weightedPick(weighted)?.event || pick(DUGOUT_READ_EVENTS);
  if (!selected) return [];
  return selected.choices.map((choice, index) => ({
    id: `${selected.id}_${index}`,
    dugoutEventId: selected.id,
    category: "판단",
    title: choice.label,
    desc: selected.desc,
    resultText: choice.resultText,
    correct: !!choice.correct,
    effects: choice.effects || {},
    rarity: "common"
  }));
}

const DUGOUT_RARE_EFFECT_MULT = 1.35;

function applyDugoutRarityToEffects(effects = {}, rarity = "common") {
  if (rarity !== "rare") return { ...effects };
  const boosted = { ...effects };
  const ratioBetterWhenLower = new Set(["burdenControl", "suspicionMult", "repeatSuspicionMult"]);
  const countBoostKeys = new Set([
    "candidateNextFirstWeakness",
    "candidateCourseWeakness",
    "missionChoiceBonus",
    "scorelessGuaranteedRare",
    "longHitGuard",
    "firstStrikePressure",
    "samePitchCall",
    "rivalCoreChoiceBonus"
  ]);
  const riskPenaltyKeys = new Set(["firstStrikeRiskSuspicion", "scorelessRiskSuspicion", "firstBatterSuspicion", "singleRisk", "rivalRisk"]);
  Object.keys(boosted).forEach((key) => {
    const val = boosted[key];
    if (typeof val !== "number") return;
    if (countBoostKeys.has(key) && val >= 1) {
      boosted[key] = val + 1;
      return;
    }
    if (ratioBetterWhenLower.has(key) && val > 0 && val < 1) {
      boosted[key] = Math.round((1 - (1 - val) * DUGOUT_RARE_EFFECT_MULT) * 100) / 100;
      return;
    }
    if (riskPenaltyKeys.has(key) && val > 0) {
      boosted[key] = Math.round(val * 0.85 * 100) / 100;
      return;
    }
    if (val > 0) boosted[key] = Math.round(val * DUGOUT_RARE_EFFECT_MULT * 100) / 100;
  });
  return boosted;
}

function generateDugoutChoices() {
  return generateDugoutReadEventChoices();
}

function renderDugoutChoices() {
  if (!els.dugoutChoiceList) return;
  els.dugoutChoiceList.innerHTML = (state.pendingDugoutChoices || [])
    .map(
      (choice, index) => `
        <button class="dugout-choice-card dugout-choice-card--${escapeHtml(choice.rarity || "common")}" type="button" data-dugout-index="${index}">
          <span class="dugout-choice-category">${escapeHtml(choice.category)}</span>
          ${choice.rarity === "rare" ? '<span class="dugout-choice-rarity">희귀 · 효과 +35%</span>' : ""}
          <strong>${escapeHtml(choice.title)}</strong>
          <p>${escapeHtml(choice.dugoutEventId ? "선택 후 판단 결과가 공개됩니다." : choice.desc)}${choice.dugoutEventId ? "" : choice.rarity === "rare" ? " 희귀 등급은 수치·단서가 한 단계 강화됩니다." : ""}</p>
        </button>
      `
    )
    .join("");
}

function revealOrder(cards) {
  if (cards.length < 3) return cards;
  return [cards[1], cards[0], cards[2], ...cards.slice(3)];
}

function resetChoiceRevealAnimation(overlay, cardSelector) {
  if (!overlay) return;
  overlay.querySelectorAll(cardSelector).forEach((card) => {
    card.getAnimations?.().forEach((animation) => animation.cancel());
    card.querySelectorAll(".choice-reveal-shine").forEach((shine) => shine.remove());
    card.style.removeProperty("opacity");
    card.style.removeProperty("transform");
    card.style.removeProperty("transform-origin");
    card.style.removeProperty("will-change");
    card.style.removeProperty("position");
    card.style.removeProperty("overflow");
  });
}

function addChoiceRevealShine(card, delay = 0) {
  const shine = document.createElement("span");
  shine.className = "choice-reveal-shine";
  shine.style.cssText = [
    "position:absolute",
    "inset:-36% -62%",
    "z-index:5",
    "pointer-events:none",
    "background:linear-gradient(112deg, transparent 39%, rgba(255,255,255,0.12) 47%, rgba(255,232,156,0.4) 50%, rgba(255,255,255,0.16) 53%, transparent 61%)",
    "opacity:0",
    "transform:translateX(-64%) rotate(4deg)"
  ].join(";");
  card.appendChild(shine);
  if (typeof shine.animate === "function") {
    shine
      .animate(
        [
          { opacity: 0, transform: "translateX(-64%) rotate(4deg)" },
          { opacity: 0.9, offset: 0.2 },
          { opacity: 0, transform: "translateX(64%) rotate(4deg)" }
        ],
        { duration: 520, delay, easing: "ease-out", fill: "both" }
      )
      .finished.catch(() => {})
      .finally(() => shine.remove());
  } else {
    window.setTimeout(() => shine.remove(), delay + 540);
  }
}

function playChoiceRevealAnimation(overlay, cardSelector, options = {}) {
  if (!overlay) return 0;
  const cards = [...overlay.querySelectorAll(cardSelector)];
  if (!cards.length) return 0;
  const orderedCards = revealOrder(cards);
  const duration = options.duration || 720;
  const stagger = options.stagger || 140;
  const startScale = options.startScale || 0.94;
  resetChoiceRevealAnimation(overlay, cardSelector);
  orderedCards.forEach((card, orderIndex) => {
    const direction = orderIndex % 2 === 0 ? -1 : 1;
    card.style.position = "relative";
    card.style.overflow = "hidden";
    card.style.opacity = "0";
    card.style.transform = `perspective(900px) rotateY(${direction * 86}deg) scale(${startScale})`;
    card.style.transformOrigin = "50% 50%";
    card.style.willChange = "transform, opacity";
  });
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      orderedCards.forEach((card, orderIndex) => {
        const delay = 80 + orderIndex * stagger;
        if (typeof card.animate === "function") {
          const direction = orderIndex % 2 === 0 ? -1 : 1;
          card.animate(
            [
              {
                opacity: 0,
                transform: `perspective(900px) rotateY(${direction * 86}deg) scale(${startScale})`,
                boxShadow: "0 6px 14px rgba(49, 101, 139, 0.06)"
              },
              {
                opacity: 0.42,
                transform: `perspective(900px) rotateY(${direction * 42}deg) scale(0.975)`,
                offset: 0.28
              },
              {
                opacity: 1,
                transform: `perspective(900px) rotateY(${direction * -7}deg) scale(1.018)`,
                boxShadow: "0 18px 30px rgba(49, 101, 139, 0.2)",
                offset: 0.68
              },
              {
                opacity: 1,
                transform: `perspective(900px) rotateY(${direction * 2}deg) scale(0.998)`,
                offset: 0.86
              },
              {
                opacity: 1,
                transform: "perspective(900px) rotateY(0deg) scale(1)"
              }
            ],
            { duration, delay, easing: "cubic-bezier(0.16, 0.88, 0.2, 1.04)", fill: "forwards" }
          );
        }
        addChoiceRevealShine(card, delay + Math.round(duration * 0.46));
      });
    });
  });
  return 80 + (orderedCards.length - 1) * stagger + duration + 80;
}

function startDugoutRevealAnimation() {
  if (!els.dugoutOverlay) return;
  if (MP.dugoutRevealTimer) {
    window.clearTimeout(MP.dugoutRevealTimer);
    MP.dugoutRevealTimer = null;
  }
  els.dugoutOverlay.classList.remove("is-revealing", "is-revealed");
  void els.dugoutOverlay.offsetWidth;
  els.dugoutOverlay.classList.add("is-revealing");
  const revealMs = playChoiceRevealAnimation(els.dugoutOverlay, ".dugout-choice-card");
  MP.dugoutRevealTimer = window.setTimeout(() => {
    MP.dugoutRevealTimer = null;
    els.dugoutOverlay?.classList.remove("is-revealing");
    els.dugoutOverlay?.classList.add("is-revealed");
    resetChoiceRevealAnimation(els.dugoutOverlay, ".dugout-choice-card");
  }, revealMs || 1100);
}

function clearPitcherRevealAnimation() {
  if (MP.pitcherRevealTimer) {
    window.clearTimeout(MP.pitcherRevealTimer);
    MP.pitcherRevealTimer = null;
  }
  if (!els.pitcherSelectOverlay) return;
  resetChoiceRevealAnimation(els.pitcherSelectOverlay, ".pitcher-choice-card");
  els.pitcherSelectOverlay.classList.remove("is-revealing", "is-revealed");
}

function startPitcherRevealAnimation() {
  if (!els.pitcherSelectOverlay) return;
  clearPitcherRevealAnimation();
  void els.pitcherSelectOverlay.offsetWidth;
  els.pitcherSelectOverlay.classList.add("is-revealing");
  const revealMs = playChoiceRevealAnimation(els.pitcherSelectOverlay, ".pitcher-choice-card", {
    duration: 720,
    startY: 68,
    startScale: 0.88
  });
  MP.pitcherRevealTimer = window.setTimeout(() => {
    MP.pitcherRevealTimer = null;
    els.pitcherSelectOverlay?.classList.remove("is-revealing");
    els.pitcherSelectOverlay?.classList.add("is-revealed");
    resetChoiceRevealAnimation(els.pitcherSelectOverlay, ".pitcher-choice-card");
  }, revealMs || 1100);
}

function openDugoutChoiceOverlay() {
  if (!els.dugoutOverlay || state.gameOver) return;
  clearAutoAdvance();
  showTutorialStep("dugout");
  render();
  const eventChoice = state.pendingDugoutChoices?.find((choice) => choice.dugoutEventId);
  if (els.dugoutTitle) els.dugoutTitle.textContent = eventChoice ? "덕아웃 판단" : `${state.inning}이닝 덕아웃 선택`;
  if (els.dugoutReason) {
    const mission = currentMission();
    const missionText = mission ? missionActionText(mission) : "이번 이닝에는 추가 과제가 없습니다";
    els.dugoutReason.textContent = eventChoice?.desc || `이번 과제: ${missionText} · 이번 이닝을 어떤 흐름으로 풀지 고르세요.`;
  }
  renderDugoutChoices();
  els.dugoutOverlay.hidden = false;
  startDugoutRevealAnimation();
  disablePitchButtons(true);
  syncScreenPhase();
}

function applyDugoutChoice(choice) {
  if (!choice) return;
  const multiplier = cardEffectMultiplier();
  const effects = applyDugoutRarityToEffects(choice.effects || {}, choice.rarity);
  const ratioEffectKeys = new Set(["burdenControl", "suspicionMult", "repeatSuspicionMult"]);
  const flagEffectKeys = new Set([
    "rivalRisk",
    "longHitGuard",
    "revealNextFirstWeakness",
    "revealRivalWeakness",
    "revealCourseWeakness",
    "candidateNextFirstWeakness",
    "candidateCourseWeakness",
    "missionChoiceBonus",
    "scorelessGuaranteedRare",
    "rivalCoreChoiceBonus"
  ]);
  Object.keys(effects).forEach((key) => {
    if (typeof effects[key] !== "number" || flagEffectKeys.has(key)) return;
    if (ratioEffectKeys.has(key) && effects[key] < 1) {
      effects[key] = Math.round((1 - (1 - effects[key]) * multiplier) * 100) / 100;
    } else {
      effects[key] = Math.round(effects[key] * multiplier * 100) / 100;
    }
  });
  if (effects.revealRivalWeakness) {
    revealRivalWeakness();
    if (choice.rarity === "rare") revealRivalWeakness();
  }
  state.activeDugoutEffects = [
    ...(state.activeDugoutEffects || []),
    {
      id: choice.id,
      title: choice.title,
      effects,
      rarity: choice.rarity || "common",
      expiresInning: state.inning
    }
  ];
  const rarityNote = choice.rarity === "rare" ? " · 희귀 강화 적용" : "";
  state.mobileDugoutCue = choice.title;
  if (choice.dugoutEventId) {
    const resultHtml = escapeHtml(choice.resultText || choice.title).replaceAll("\n", "<br>");
    addLog("덕아웃 판단", `<p>${resultHtml}</p><p class="log-muted">선택: ${escapeHtml(choice.title)}</p>`);
    showEventBanner(`${choice.correct ? "판단 적중" : "판단 빗나감"}\n${choice.title}`, choice.correct ? "reward" : "walk", 1300);
  } else {
    addLog("덕아웃 선택", `${choice.title}${rarityNote} · ${choice.desc}`);
    showEventBanner(`이닝 작전\n${choice.title}`, "reward", 1200);
  }
}

function confirmDugoutChoice(index) {
  if (els.dugoutOverlay?.classList.contains("is-revealing")) return;
  const choice = state.pendingDugoutChoices?.[index];
  if (!choice || state.gameOver) return;
  applyDugoutChoice(choice);
  const startsInning = !!state.dugoutBeforeAtBat;
  const advanceBatter = !!state.dugoutAdvanceBatterOnConfirm;
  state.dugoutPending = false;
  state.dugoutBeforeAtBat = false;
  state.dugoutAdvanceBatterOnConfirm = false;
  state.pendingDugoutChoices = [];
  if (els.dugoutOverlay) {
    if (MP.dugoutRevealTimer) {
      window.clearTimeout(MP.dugoutRevealTimer);
      MP.dugoutRevealTimer = null;
    }
    resetChoiceRevealAnimation(els.dugoutOverlay, ".dugout-choice-card");
    els.dugoutOverlay.hidden = true;
    els.dugoutOverlay.classList.remove("is-revealing", "is-revealed");
  }
  state.waitingNextBatter = false;
  if (!startsInning || advanceBatter) state.batterIndex += 1;
  startAtBat();
  render();
  showBatterEntryBanner();
}

function rewardReasonText(reason) {
  if (/병살|DOUBLE PLAY/i.test(reason)) return "병살로 위기를 지웠습니다. 투수 성장 선택지 3개 중 하나를 고르세요.";
  if (/보스|위험|하이라이트/.test(reason)) return "위험한 승부를 막아냈습니다. 강한 성장 선택지 3개 중 하나를 고르세요.";
  if (/삼진|2스트|STRIKE OUT/i.test(reason)) return "삼진으로 흐름을 가져왔습니다. 투수 성장 선택지 3개 중 하나를 고르세요.";
  return "승부를 끝낸 보상입니다. 투수 성장 선택지 3개 중 하나를 고르세요.";
}

function rewardDraftTitle(reason, kind) {
  if (kind === "stageCard") return "스테이지 보상";
  if (kind === "coreEvolution" || kind === "stageTag") return "성장 보상";
  if (/병살|DOUBLE PLAY/i.test(reason)) return "승부 보상 · 병살";
  if (/보스|위험|하이라이트/.test(reason)) return "승부 보상 · 위기 제압";
  if (/삼진|2스트|STRIKE OUT/i.test(reason)) return "승부 보상 · 삼진";
  return "승부 보상";
}

function stageCardRewardReasonText() {
  const result = state.lastStageResult || calculateStageResult();
  const rival = result.rivalGoalMet ? "라이벌 과제 달성" : "라이벌 과제 미달성";
  const lines = [`${result.stageName} · ${result.starLabel}`, rival];
  if (result.highlightSuccesses) lines.push(`하이라이트 ${result.highlightSuccesses}회 성공`);
  if (result.rewardBoost?.absorbed) lines.push(`승부 성과 ${result.rewardBoost.absorbed}회 카드 보상 흡수`);
  lines.push("스테이지 카드 3개 중 하나를 고르세요.");
  return lines.join("\n");
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
    reason = "약한 흐름 보완";
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
  return {
    type: "supportUpgrade",
    tagId: tag.id,
    title: `${tag.name} 강화`,
    desc: `${tag.description} 효과가 더 강해집니다.`,
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

function rewardIdentity(reward) {
  if (!reward) return "";
  if (reward.type === "stat") return `stat:${reward.stat}`;
  if (reward.type === "pitch") return `pitch:${reward.pitchId}:${reward.field}`;
  if (reward.type === "newPitch") return `newPitch:${reward.pitch?.id}`;
  if (reward.type === "tag") return `tag:${reward.tagId}`;
  if (reward.type === "supportUpgrade") return `supportUpgrade:${reward.tagId}`;
  if (reward.type === "rewardCard") return `rewardCard:${reward.cardId}`;
  if (reward.type === "pitchUpgrade") return `pitchUpgrade:${reward.pitchId}:${reward.upgradeId || reward.field || reward.title}`;
  if (reward.type === "coreEvolution") return `coreEvolution:${reward.evolutionId}`;
  return `${reward.type}:${reward.title}`;
}

function dedupeRewardChoices(rewards) {
  const seen = new Set();
  return rewards.filter((reward) => {
    const key = rewardIdentity(reward);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function generateRewardChoices(reason, result) {
  const usedPitch = result?.pitch;
  const rewards = [
    { type: "stat", stat: "제구", amount: rewardAmount("stat"), title: "코너워크 감각", desc: "제구가 소폭 상승합니다." },
    { type: "stat", stat: "구속", amount: rewardAmount("stat"), title: "팔 스피드 상승", desc: "구속이 소폭 상승합니다." },
    { type: "stat", stat: "변화", amount: rewardAmount("stat"), title: "손끝 감각", desc: "변화 수치가 소폭 상승합니다." },
    { type: "stat", stat: "멘탈", amount: rewardAmount("stat"), title: "위기관리 루틴", desc: "멘탈이 소폭 상승합니다." },
    { type: "stat", stat: "예측", amount: rewardAmount("stat"), title: "타자 반응 체크", desc: "마운드 판단 정확도에 쓰이는 예측 수치가 소폭 상승합니다." }
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
  const upgradePicks = MP.pickWeightedPitchUpgrades ? MP.pickWeightedPitchUpgrades(upgradeEntries, 1) : [];
  const uniqueRewards = dedupeRewardChoices(rewards);
  if (upgradePicks.length && chance(0.45)) {
    const pickedUpgradeKeys = new Set(upgradePicks.map(rewardIdentity));
    const filler = sample(uniqueRewards.filter((reward) => !pickedUpgradeKeys.has(rewardIdentity(reward))), Math.max(0, 3 - upgradePicks.length));
    return sample(dedupeRewardChoices([...upgradePicks, ...filler]), 3);
  }

  return sample(uniqueRewards, 3);
}

function generateStageTagChoices() {
  ensurePitcherTagFields(state.pitcher);
  const owned = new Set([...(state.pitcher.bonusTags || [])]);
  if (owned.size >= MAX_SUPPORT_TAGS) return generateSupportTagUpgradeChoices();
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
    selected.push(toSupportReward(themePick.tag, "이번 타선 공략에 유리한 카드"));
    selectedIds.push(themePick.tag.id);
  }

  const weaknessPool = candidates
    .filter((tag) => !selectedIds.includes(tag.id))
    .map((tag) => ({ tag, ...supportTagWeight(tag, selectedIds) }))
    .filter((item) => (supportTagMeta[item.tag.id]?.countersWeakness || []).some((weak) => weaknessSet.has(weak)));
  const weaknessPick = weightedPickFromTop(weaknessPool, 4);
  if (weaknessPick) {
    selected.push(toSupportReward(weaknessPick.tag, "약한 흐름 보완"));
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

function startRewardRevealAnimation() {
  if (!els.rewardOverlay) return;
  if (MP.rewardRevealTimer) {
    window.clearTimeout(MP.rewardRevealTimer);
    MP.rewardRevealTimer = null;
  }
  els.rewardOverlay.classList.remove("is-revealing", "is-revealed");
  void els.rewardOverlay.offsetWidth;
  els.rewardOverlay.classList.add("is-revealing");
  const revealMs = playChoiceRevealAnimation(els.rewardOverlay, ".reward-choice-card", {
    duration: state.rewardKind === "coreEvolution" ? 780 : 720,
    startY: state.rewardKind === "coreEvolution" ? 72 : 68,
    startScale: state.rewardKind === "coreEvolution" ? 0.86 : 0.88
  });
  MP.rewardRevealTimer = window.setTimeout(() => {
    MP.rewardRevealTimer = null;
    els.rewardOverlay?.classList.remove("is-revealing");
    els.rewardOverlay?.classList.add("is-revealed");
    resetChoiceRevealAnimation(els.rewardOverlay, ".reward-choice-card");
  }, revealMs || 1100);
}

function openRewardDraft(reason, result, kind = "normal") {
  if (!els.rewardOverlay || state.gameOver) return;
  clearAutoAdvance();
  if (kind === "stageCard") showTutorialStep("stageCards");
  state.rewardKind = kind;
  state.rewardPending = true;
  if (kind === "stageCard") state.rewardChoices = generateStageCardChoices();
  else if (kind === "stageTag") state.rewardChoices = generateStageTagChoices();
  else if (kind === "coreEvolution") state.rewardChoices = generateCoreEvolutionChoices();
  else state.rewardChoices = generateRewardChoices(reason, result);
  if (!state.rewardChoices.length) {
    state.rewardPending = false;
    state.rewardKind = "normal";
    if (state.dugoutPending) {
      openDugoutChoiceOverlay();
      return;
    }
    scheduleAutoAdvance(900);
    return;
  }
  els.rewardTitle.textContent = rewardDraftTitle(reason, kind);
  els.rewardReason.textContent =
    kind === "coreEvolution"
      ? "핵심태그를 새 운영 방식으로 진화시킵니다."
      : kind === "stageCard"
        ? stageCardRewardReasonText()
        : kind === "stageTag"
          ? "스테이지 종료 후 투수 성향을 정리합니다. 보조태그는 최대 3개까지만 보유합니다."
          : rewardReasonText(reason);
  renderRewardChoices();
  els.rewardOverlay.hidden = false;
  startRewardRevealAnimation();
  disablePitchButtons(true);
}

function openStageTagReward() {
  if (state.pendingCoreEvolutionReward) {
    state.pendingRewardKindAfterCurrent = "coreReward";
    openRewardDraft("스테이지 보상", null, "stageCard");
    return;
  }
  openRewardDraft("스테이지 보상", null, "stageCard");
}

function openCoreTagRewardAfterStageCard() {
  const coreChoices = generateCoreEvolutionChoices();
  state.pendingCoreEvolutionReward = false;
  if (coreChoices.length) {
    openRewardDraft("핵심 진화 보상", null, "coreEvolution");
    return;
  }
  openRewardDraft("핵심태그 보상", null, "stageTag");
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
    }
  }
  if (reward.type === "pitchUpgrade") {
    if (MP.applyPitchUpgradeReward) MP.applyPitchUpgradeReward(reward);
  }
  if (reward.type === "tag") {
    ensurePitcherTagFields(state.pitcher);
    const currentTags = [...new Set(state.pitcher.bonusTags || [])];
    const nextTags = currentTags.includes(reward.tagId)
      ? currentTags
      : currentTags.length < MAX_SUPPORT_TAGS
        ? [...currentTags, reward.tagId]
        : currentTags;
    state.pitcher.bonusTags = nextTags;
    state.pitcher.bonusTagTiers[reward.tagId] = Math.max(state.pitcher.bonusTagTiers[reward.tagId] || 1, reward.tierBoost || 1);
  }
  if (reward.type === "supportUpgrade") {
    ensurePitcherTagFields(state.pitcher);
    state.pitcher.bonusTagTiers[reward.tagId] = (state.pitcher.bonusTagTiers[reward.tagId] || 1) + (reward.tierBoost || 1);
  }
  if (reward.type === "weaknessMitigation") {
    const removeId = reward.weaknessTagId;
    if (state.pitcher.weaknessTagId === removeId) state.pitcher.weaknessTagId = null;
    state.pitcher.revealedWeaknessTags = (state.pitcher.revealedWeaknessTags || []).filter((tagId) => tagId !== removeId);
    state.pitcher.hiddenWeaknessTags = (state.pitcher.hiddenWeaknessTags || []).filter((tagId) => tagId !== removeId);
  }
  if (reward.type === "coreEvolution") {
    ensurePitcherTagFields(state.pitcher);
    state.pitcher.coreEvolutionId = reward.evolutionId;
  }
  if (reward.type === "rewardCard") {
    state.ownedRewardCards = [...(state.ownedRewardCards || []), reward.cardId];
  }
  markConditionalCardType(reward);

  state.runStats.rewards += 1;
  addLog("보상 획득", `${reward.title} · ${reward.operation || reward.desc}`);
  showEventBanner(
    reward.type === "tag" ? "TAG GET!" : reward.type === "supportUpgrade" ? "TAG UP!" : reward.type === "coreEvolution" ? "EVOLUTION!" : "REWARD GET!",
    "reward",
    1050
  );
  state.rewardPending = false;
  state.rewardKind = "normal";
  state.afterRewardStageOverlay = null;
  state.rewardChoices = [];
  if (MP.rewardRevealTimer) {
    window.clearTimeout(MP.rewardRevealTimer);
    MP.rewardRevealTimer = null;
  }
  resetChoiceRevealAnimation(els.rewardOverlay, ".reward-choice-card");
  els.rewardOverlay.hidden = true;
  els.rewardOverlay.classList.remove("is-revealing", "is-revealed");
  render();
  if ((rewardKind === "coreEvolution" || rewardKind === "stageTag") && state.pendingRewardKindAfterCurrent) {
    const nextKind = state.pendingRewardKindAfterCurrent;
    state.pendingRewardKindAfterCurrent = null;
    window.setTimeout(() => {
      if (!state.gameOver) openRewardDraft(nextKind === "stageCard" ? "스테이지 보상" : "보상", null, nextKind);
    }, 280);
    return;
  }
  if (rewardKind === "stageCard") {
    if (state.pendingRewardKindAfterCurrent === "coreReward") {
      state.pendingRewardKindAfterCurrent = null;
      window.setTimeout(() => {
        if (!state.gameOver) openCoreTagRewardAfterStageCard();
      }, 280);
      return;
    }
    if (state.pendingRunComplete) {
      const message = state.pendingRunCompleteMessage || "최종 스테이지까지 클리어했습니다.";
      state.pendingRunComplete = false;
      endGame(true, message);
      return;
    }
    if (state.awaitingThemeSelection) {
      openThemeSelectOverlay();
      return;
    }
  }
  if (rewardKind === "coreEvolution" || rewardKind === "stageTag") {
    if (state.pendingRunComplete) {
      const message = state.pendingRunCompleteMessage || "최종 스테이지까지 클리어했습니다.";
      state.pendingRunComplete = false;
      endGame(true, message);
      return;
    }
    if (state.awaitingThemeSelection) {
      openThemeSelectOverlay();
      return;
    }
  }
  if (afterStageOverlay) {
    queueStageEntryAndTagReward(afterStageOverlay, 450);
    return;
  }
  if ((state.pendingRunComplete || state.awaitingThemeSelection) && rewardKind === "normal") {
    openStageTagReward();
    return;
  }
  if (state.awaitingThemeSelection) {
    openThemeSelectOverlay();
    return;
  }
  if (state.dugoutPending) {
    openDugoutChoiceOverlay();
    return;
  }
  scheduleAutoAdvance(rewardKind === "stageTag" || rewardKind === "stageCard" ? GAME_TIMING.rewardAutoAdvanceStageTag : GAME_TIMING.rewardAutoAdvanceNormal);
}

function rewardChoiceMetaParts(reward) {
  if (reward.type === "rewardCard") {
    const parts = [{ kind: "kind", text: (reward.cardType || []).join(" / ") || "카드" }];
    if (reward.recommendReason) parts.push({ kind: "reason", text: reward.recommendReason });
    return parts;
  }
  if (reward.type === "stat") return [{ kind: "amount", text: `${reward.stat} +${reward.amount}` }];
  if (reward.type === "pitch") return [{ kind: "amount", text: `${reward.field === "control" ? "제구" : reward.field} +${reward.amount}` }];
  if (reward.type === "newPitch") return [{ kind: "kind", text: "새 구종" }];
  if (reward.type === "tag") {
    const family = String(reward.categoryLabel || "").replace(/^보조(?:태그| 장점)\s*·\s*/, "");
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
    return [{ kind: "kind", text: "핵심 진화" }];
  }
  if (reward.type === "pitchUpgrade") {
    return [
      { kind: "kind", text: "구종 강화" },
      { kind: "reason", text: reward.reason || "스테이지 활약" }
    ];
  }
  if (reward.type === "weaknessMitigation") {
    return [
      { kind: "kind", text: "약점 완화" },
      { kind: "reason", text: reward.recommendReason || "조건 카드" }
    ];
  }
  return reward.amount ? [{ kind: "amount", text: `+${reward.amount}` }] : [];
}

function rewardChoiceMetaHtml(reward) {
  const parts = rewardChoiceMetaParts(reward);
  if (!parts.length) return "";
  return `<footer class="reward-card-foot">${parts
    .map((part) => `<span class="reward-chip reward-chip--${part.kind}">${escapeHtml(part.text)}</span>`)
    .join("")}</footer>`;
}

function rewardDisplayDescription(reward) {
  if (!reward) return "";
  if (reward.type === "rewardCard") {
    return reward.effectText || reward.desc || "";
  }
  if (reward.themeReward) {
    return `${reward.desc || ""}`;
  }
  if (reward.type === "tag") {
    return reward.desc || "투수 보조태그를 얻습니다.";
  }
  if (reward.type === "supportUpgrade") {
    return reward.desc || "보유 보조태그 효과를 강화합니다.";
  }
  if (reward.title === "경기 운영") {
    return "이닝 운영과 위기 대응이 쉬워집니다.";
  }
  return reward.desc || "";
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

function rewardUnifiedSubtitle(reward) {
  if (reward.subtitle) return reward.subtitle;
  if (reward.type === "stat") return "";
  if (reward.type === "pitch") return "구종 숙련";
  if (reward.type === "newPitch") return "레퍼토리 확장";
  if (reward.type === "tag") return reward.categoryLabel || "보조태그 획득";
  if (reward.type === "supportUpgrade") return "보조태그 강화";
  if (reward.type === "rewardCard") return (reward.cardType || []).join(" / ") || cardRarityLabel(reward.rarity);
  if (reward.type === "weaknessMitigation") return "약점 완화";
  if (reward.type === "pitchUpgrade") return "구종 강화";
  return "보상";
}

function rewardUnifiedCondition(reward) {
  if (!rewardShouldShowCondition(reward)) return "";
  if (reward.condition) return reward.condition;
  if (reward.triggerCondition) return reward.triggerCondition;
  return "";
}

function rewardUnifiedEffect(reward) {
  if (reward.effectText) return reward.effectText;
  if (reward.type === "stat") return `${reward.stat} +${reward.amount}`;
  if (reward.type === "pitch") return `${reward.field === "control" ? "제구" : reward.field} +${reward.amount}`;
  if (reward.type === "pitchUpgrade") return reward.desc || `${rewardDisplayTitle(reward)} 효과 개방`;
  if (reward.type === "weaknessMitigation") return "약점 태그 1개 완화";
  return rewardDisplayDescription(reward) || "-";
}

function rewardUnifiedOperation(reward) {
  if (reward.operation) return reward.operation;
  if (reward.type === "tag") return "투수 보조태그에 추가";
  if (reward.type === "supportUpgrade") return "보유 태그 효과 상승";
  if (reward.type === "rewardCard") return "조건을 만족하면 자동 발동";
  if (reward.type === "newPitch") return "새 구종 선택지 확보";
  if (reward.type === "pitchUpgrade") return reward.reason ? `${reward.reason} 흐름을 이어서 구종 숙련도를 올립니다.` : "활약한 구종을 더 안정적으로 운용합니다.";
  return reward.desc || "투수 성장에 반영";
}

function rewardShouldShowCondition(reward) {
  return reward?.type === "coreEvolution" || reward?.type === "rewardCard";
}

function rewardRowHtml(label, value) {
  if (!value) return "";
  return `<div class="core-evo-row"><span class="core-evo-label">${escapeHtml(label)}</span><span class="core-evo-value">${escapeHtml(value)}</span></div>`;
}

function rewardDisplayTitle(reward) {
  if (reward.type === "pitchUpgrade") {
    const pitch = pitchById(reward.pitchId);
    return `${pitch?.name || String(reward.title || "").split(" ")[0] || "구종"} 구종 레벨업`;
  }
  if (reward.type === "pitch") {
    const pitch = pitchById(reward.pitchId);
    return `${pitch?.name || String(reward.title || "").split(" ")[0] || "구종"} 구종 레벨업`;
  }
  return reward.title;
}

function renderCoreEvolutionRewardCard(reward, index) {
  const rarity = reward.rarity || (reward.type === "coreEvolution" ? "core" : "common");
  const subtitle = rewardUnifiedSubtitle(reward);
  const title = rewardDisplayTitle(reward);
  return `
    <button class="reward-choice-card core-evolution-card reward-choice-card--${escapeHtml(rarity)}" type="button" data-reward-index="${index}">
      <header class="core-evo-head">
        <div class="core-evo-titles">
          <strong class="core-evo-name">${escapeHtml(title)}</strong>
          ${subtitle ? `<span class="core-evo-sub">${escapeHtml(subtitle)}</span>` : ""}
        </div>
        <span class="reward-rarity-badge reward-rarity-badge--${escapeHtml(rarity)}">${escapeHtml(cardRarityLabel(rarity))}</span>
      </header>
      <div class="core-evo-body">
        ${rewardRowHtml("조건", rewardUnifiedCondition(reward))}
        ${rewardRowHtml("효과", rewardUnifiedEffect(reward))}
        ${rewardRowHtml("운영", rewardUnifiedOperation(reward))}
      </div>
    </button>
  `;
}

function renderRewardChoices() {
  if (!els.rewardChoiceList) return;
  els.rewardChoiceList.classList.add("core-evolution-list");
  els.rewardChoiceList.innerHTML = state.rewardChoices
    .map((reward, index) => renderCoreEvolutionRewardCard(reward, index))
    .join("");
}

function selectRewardChoice(index) {
  if (els.rewardOverlay?.classList.contains("is-revealing")) return;
  applyReward(index);
}

function nextBatter() {
  if (state.gameOver || state.rewardPending || state.dugoutPending) return;
  clearAutoAdvance();
  if (state.waitingNextBatter) state.batterIndex += 1;
  startAtBat();
  render();
  showBatterEntryBanner();
}

function clearAutoAdvance() {
  if (autoAdvanceTimer) {
    window.clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
}

function clearRewardTimer() {
  if (rewardTimer) {
    window.clearTimeout(rewardTimer);
    rewardTimer = null;
  }
}

function clearGameOverTimer() {
  if (gameOverTimer) {
    window.clearTimeout(gameOverTimer);
    gameOverTimer = null;
  }
}

function clearCourseFlash() {
  if (courseFlashTimer) {
    window.clearTimeout(courseFlashTimer);
    courseFlashTimer = null;
  }
  state.flashZone = null;
}

function flashCourse(zone, targetRow = null, targetCol = null) {
  clearCourseFlash();
  const row = Number.isFinite(Number(targetRow)) ? Number(targetRow) : courseZones[zone]?.row ?? 1;
  const col = Number.isFinite(Number(targetCol)) ? Number(targetCol) : courseZones[zone]?.col ?? 1;
  state.flashZone = `${row}:${col}`;
  courseFlashTimer = window.setTimeout(() => {
    state.flashZone = null;
    courseFlashTimer = null;
    renderCourseControls();
  }, GAME_TIMING.courseFlash);
}

function scheduleAutoAdvance(delay = GAME_TIMING.autoAdvanceDefault) {
  clearAutoAdvance();
  if (state.gameOver || state.pendingGameOver) return;
  autoAdvanceTimer = window.setTimeout(() => {
    autoAdvanceTimer = null;
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
  gameOverTimer = window.setTimeout(() => {
    gameOverTimer = null;
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
  if (els.dugoutOverlay) els.dugoutOverlay.hidden = true;
  els.nextBatterButton.hidden = true;
  els.resultTitle.textContent = won ? "클리어" : "경기 종료";
  els.resultMessage.innerHTML = gameSummaryHtml(message);
  els.resultOverlay.hidden = false;
  if (els.stageThemeBadge) els.stageThemeBadge.hidden = true;
  disablePitchButtons(true);
  if (balanceLog.active) balanceLog.active.summary = buildBalanceRunSummary(won, message);
}

function addLog(title, text) {
  const item = document.createElement("div");
  item.className = "log-item";
  item.innerHTML = `<strong class="log-title">${escapeHtml(title)}</strong><div class="log-body">${text}</div>`;
  els.logList.prepend(item);
  while (els.logList.children.length > 18) {
    els.logList.lastElementChild.remove();
  }
  renderMobileRecentLog();
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
  return [...new Set([String(batter.type || "-").replace("보스 타자 · ", ""), ...(batter.tags || [])].filter(Boolean))];
}

function batterTagToneClass(tagName) {
  const tag = batterTagCatalog.find((item) => item.name === tagName);
  const weaknessIds = new Set(["breaking_weak", "inside_weak", "high_fast_vulnerable", "dp_risk"]);
  return tag && weaknessIds.has(tag.id) ? " weakness-chip is-revealed" : "";
}

function batterVisibleTagLimit(batter) {
  if (batter?.isBoss) return 3;
  return (state.stageIndex || 0) <= 0 ? 2 : 3;
}

function batterVisibleInfoLines(batter) {
  return batterInfoLines(batter).slice(0, batterVisibleTagLimit(batter));
}

function batterDisplayTagTier(batter, label, index) {
  if (batterTagToneClass(label).includes("weakness")) return "danger";
  if (batter?.isBoss && index === 0) return "platinum";
  if (batter?.isRival && index === 0) return (state.stageIndex || 0) >= 2 ? "gold" : "silver";
  const stage = state.stageIndex || 0;
  if (stage <= 0) return "bronze";
  if (stage === 1) return index === 0 ? "silver" : "bronze";
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  return "bronze";
}

function batterDisplayTagRole(label, index) {
  if (batterTagToneClass(label).includes("weakness")) return "weakness";
  return index === 0 ? "strength" : "variance";
}

function tagDetailText(tag, batter) {
  const catalogTag = batterTagCatalog.find((item) => item.name === tag);
  if (catalogTag) return catalogTag.description;

  const details = {
    출루형: "컨택과 선구안으로 살아나가려는 타자입니다. 볼 유도 성공률이 낮아질 수 있습니다.",
    중심형: "한 번 맞으면 크게 갑니다. 중앙 실투와 읽힌 패턴을 가장 조심하세요.",
    장타형: "타구 힘이 강합니다. 낮게 누르거나 타이밍을 빼앗아 정타를 피해야 합니다.",
    하위형: "능력치는 낮지만 방심하면 패턴을 읽습니다. 쉬운 반복은 피하세요.",
    보스형: "이번 경기의 위험 타자입니다. 능력치뿐 아니라 고유한 노림수도 함께 봐야 합니다.",
    주루형: "약한 타구도 살아나갈 수 있습니다. 확실한 범타를 유도해야 합니다.",
    파울형: "몰려도 쉽게 끝나지 않습니다. 결정구 반복은 투구 수만 늘릴 수 있습니다.",
    선구형: "존 밖 공을 잘 참습니다. 유인구보다 코너 스트라이크가 필요합니다.",
    직구형: "빠른 공에 기준을 둡니다. 느린 공이나 꺾이는 공으로 타이밍을 흔드세요.",
    변화형: "변화구 궤적을 기다립니다. 존 안 빠른 공으로 먼저 찌를 수 있습니다.",
    느린형: "느린 공에 속지 않으려 합니다. 빠른 공으로 압박하면 반응이 늦을 수 있습니다.",
    포커형: "반응 신뢰도가 낮습니다. 일부러 속이는 스윙·지켜보기에 주의하세요.",
    정직스윙: "반응 신뢰도가 높습니다. 스윙·파울 반응을 비교적 믿어도 됩니다.",
    패턴형: "방금 본 공을 빨리 기억합니다. 성공한 패턴도 바로 반복하면 위험합니다.",
    한방형: "한 번 맞으면 큽니다. 볼넷보다 몰린 공을 더 조심해야 합니다.",
    "초구 적극": "첫 공부터 적극적으로 칩니다. 0-0 중앙 승부는 위험합니다.",
    "초구 관찰": "첫 공을 보고 들어갑니다. 초구 유인구보다 코너 스트라이크가 낫습니다.",
    인내형: "몰려도 파울로 버팁니다. 같은 결정구 반복은 읽힙니다.",
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
  return details[tag] || `${batter.name}의 현재 성향입니다. 승부 중 반응과 기다리는 흐름에 영향을 줍니다.`;
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

function showBatterWeaknessDetail(tagId) {
  if (!els.tagDetail) return;
  const tag = batterWeaknessById(tagId);
  if (!tag) return;
  const detailKey = `weakness:${tagId}`;
  if (!els.tagDetail.hidden && els.tagDetail.dataset.tag === detailKey) {
    resetTagDetail();
    return;
  }
  const pitches = (tag.recommendedPitchTypes || []).map((id) => pitchById(id)?.name || id).join(" / ");
  els.tagDetail.innerHTML = `
    <strong>${escapeHtml(tag.name)}</strong>
    <span>${escapeHtml(tag.description)}</span>
    <span>잘 먹히는 공: ${escapeHtml(pitches || "-")}</span>
  `;
  els.tagDetail.dataset.tag = detailKey;
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
  startPitcherRevealAnimation();
}

function pitchInputLocked(options = {}) {
  const includeRelease = options.includeRelease !== false;
  return (
    state.screenPhase === SCREEN_PHASE.title ||
    state.screenPhase === SCREEN_PHASE.tutorial ||
    state.screenPhase !== SCREEN_PHASE.pitching ||
    state.gameOver ||
    state.waitingNextBatter ||
    state.rewardPending ||
    state.dugoutPending ||
    state.awaitingThemeSelection ||
    state.awaitingStageStart ||
    state.pendingGameOver ||
    (includeRelease && !!state.releaseTiming?.active)
  );
}

function syncScreenPhase() {
  if (els.titleOverlay && !els.titleOverlay.hidden) {
    state.screenPhase = SCREEN_PHASE.title;
    return;
  }
  if (els.tutorialOverlay && !els.tutorialOverlay.hidden) {
    state.screenPhase = SCREEN_PHASE.tutorial;
    return;
  }
  if (state.gameOver || state.pendingGameOver) {
    state.screenPhase = SCREEN_PHASE.gameOver;
    return;
  }
  if (state.rewardPending) {
    state.screenPhase = SCREEN_PHASE.reward;
    return;
  }
  if (state.awaitingStageStart) {
    state.screenPhase = SCREEN_PHASE.transition;
    return;
  }
  if (state.dugoutPending || (els.dugoutOverlay && !els.dugoutOverlay.hidden)) {
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

function renderRunStatusCard() {
  if (!state.pitcher) {
    if (els.runStatusCard) els.runStatusCard.hidden = true;
    if (els.missionFocusCard) els.missionFocusCard.hidden = true;
    return;
  }
  const config = stageConfig();
  const mission = currentMission();
  const result = calculateStageResult();
  const rival = config.rival;
  const missionResult = mission ? ensureStageRunState().missionResults[mission.id] : null;
  const missionStats = mission ? ensureStageRunState().inningStats[state.inning] || state.currentInningStats : null;
  const liveStatus = liveMissionStatus(mission, missionStats, missionResult);
  const missionStatus = liveStatus.label;
  const missionText = missionActionText(mission);
  const missionTitle = missionDisplayName(mission);
  const conditionText = mission ? missionConditionText(mission) : "다음 미션 대기";
  const rewardHtml = missionFocusHighlightHtml(missionRewardText());
  const isMissionComplete = liveStatus.className === "is-complete";
  if (els.missionFocusCard) {
    els.missionFocusCard.hidden = false;
    if (els.missionFocusTitle) {
      els.missionFocusTitle.textContent = mission ? missionTitle : "추가 미션 없음";
    }
    if (els.missionFocusStatus) {
      els.missionFocusStatus.textContent = mission ? missionCompactStatus(liveStatus) : "대기";
      els.missionFocusStatus.classList.toggle("is-complete", isMissionComplete);
      els.missionFocusStatus.classList.toggle("is-fail", liveStatus.className === "is-fail");
    }
    if (els.missionFocusCondition) {
      els.missionFocusCondition.innerHTML = missionFocusHighlightHtml(conditionText);
    }
    if (els.missionFocusReward) {
      els.missionFocusReward.innerHTML = rewardHtml;
    }
    if (els.missionFocusRewardRow) {
      els.missionFocusRewardRow.classList.toggle("is-complete", Boolean(mission) && isMissionComplete);
    }
  }
  if (!els.runStatusCard) return;
  els.runStatusCard.hidden = false;
  if (els.runStageName) els.runStageName.textContent = `STAGE ${currentStageNumber()} · ${config.name}`;
  if (els.runMissionText) {
    els.runMissionText.textContent = mission ? `이번 이닝 미션: ${missionText} · ${missionStatus}` : "이번 이닝에는 추가 과제가 없습니다";
  }
  if (els.runRivalText) {
    const rivalState = ensureStageRunState().rival;
    els.runRivalText.textContent = `라이벌 ${rivalState.name || rival?.name || "-"}: ${rivalActionText(config)} · 장타 ${rivalState.longHitsAllowed}, 출루 ${rivalState.onBaseAllowed}`;
  }
  if (els.runStarText) {
    els.runStarText.textContent = `${result.starLabel} 예상 · 간파도 평균 ${result.suspicionAverage}%`;
  }
  renderOwnedCardSummary();
  renderCardTriggerLog();
}

function renderOwnedCardSummary() {
  if (!els.ownedCardSummary) return;
  const stacks = ownedRewardCardEntries();
  const counts = stacks.reduce(
    (acc, entry) => {
      acc[entry.card.rarity] += entry.stack;
      return acc;
    },
    { common: 0, rare: 0, core: 0 }
  );
  const latest = stacks
    .slice(0, 4)
    .map((entry) => `${entry.card.name}${entry.stack > 1 ? ` x${entry.stack}` : ""}`)
    .join(" · ");
  els.ownedCardSummary.innerHTML = `
    <span>일반 ${counts.common}</span>
    <span>희귀 ${counts.rare}</span>
    <span>핵심 ${counts.core}</span>
    <small>${escapeHtml(latest || "보유 카드 없음")}</small>
  `;
}

function renderCardTriggerLog() {
  if (!els.cardTriggerLog) return;
  const logs = state.cardTriggerLog || [];
  els.cardTriggerLog.innerHTML = logs.length
    ? logs.map((item) => `<span><b>${escapeHtml(item.cardName)}</b> ${escapeHtml(item.text)}</span>`).join("")
    : `<span>카드 발동 대기</span>`;
}

function renderReleaseTimingPanel() {
  if (!els.releaseTimingPanel || !els.releaseTimingButton) return;
  const active = state.releaseTiming?.active ? state.releaseTiming : null;
  const result = state.lastReleaseResult && !state.lastReleaseResult.auto ? state.lastReleaseResult : null;
  els.releaseTimingPanel.classList.remove("is-active", "is-result", "good", "warn", "danger", "is-shaking");
  els.releaseTimingButton.disabled = true;
  els.releaseTimingButton.setAttribute("aria-disabled", "true");
  if (els.mobileThrowButton) {
    els.mobileThrowButton.disabled = !active;
    els.mobileThrowButton.classList.toggle("is-ready", !!active);
  }

  if (active) {
    const goodLeft = (0.5 - active.goodSize / 2) * 100;
    const perfectLeft = (0.5 - active.perfectSize / 2) * 100;
    const pressureText = active.pressureReasons?.length ? active.pressureReasons.join(" · ") : "안정된 상황";
    els.releaseTimingPanel.dataset.state = "active";
    els.releaseTimingPanel.classList.add("is-active");
    els.releaseTimingPanel.classList.toggle("is-shaking", !!active.shake);
    els.releaseTimingButton.disabled = false;
    els.releaseTimingButton.setAttribute("aria-disabled", "false");
    els.releaseTimingGrade.textContent = "타이밍";
    els.releaseTimingMode.textContent = `제구 ${Math.round(active.control)} · 압박 ${Math.round(active.pressure)}`;
    els.releaseTimingHint.textContent = `${pressureText} · 클릭/스페이스 확정 · ESC 취소`;
    els.releaseTimingTrack?.style.setProperty("--good-left", `${goodLeft}%`);
    els.releaseTimingTrack?.style.setProperty("--good-width", `${active.goodSize * 100}%`);
    els.releaseTimingTrack?.style.setProperty("--perfect-left", `${perfectLeft}%`);
    els.releaseTimingTrack?.style.setProperty("--perfect-width", `${active.perfectSize * 100}%`);
    els.releaseTimingTrack?.style.setProperty("--cursor-duration", `${active.duration}ms`);
    startReleaseTimingAnimation();
    return;
  }

  if (result) {
    els.releaseTimingPanel.dataset.state = "result";
    els.releaseTimingPanel.classList.add("is-result");
    if (result.tone) els.releaseTimingPanel.classList.add(result.tone);
    els.releaseTimingGrade.textContent = result.label;
    els.releaseTimingMode.textContent = `정확도 ${result.accuracy}%`;
    els.releaseTimingHint.textContent = result.message;
    els.releaseTimingTrack?.style.setProperty("--good-left", `${(0.5 - (result.zoneSize || 0.24) / 2) * 100}%`);
    els.releaseTimingTrack?.style.setProperty("--good-width", `${(result.zoneSize || 0.24) * 100}%`);
    els.releaseTimingTrack?.style.setProperty("--perfect-left", `${(0.5 - (result.perfectSize || 0.07) / 2) * 100}%`);
    els.releaseTimingTrack?.style.setProperty("--perfect-width", `${(result.perfectSize || 0.07) * 100}%`);
    els.releaseTimingCursor?.style.setProperty("--release-result-x", `${(result.position || 0.5) * 100}%`);
    els.releaseTimingCursor?.style.removeProperty("--release-cursor-x");
    return;
  }

  els.releaseTimingPanel.dataset.state = "idle";
  els.releaseTimingGrade.textContent = "대기";
  els.releaseTimingMode.textContent = "안정 릴리즈";
  els.releaseTimingHint.textContent = "코스를 선택하면 릴리즈 타이밍이 열립니다.";
  els.releaseTimingTrack?.style.setProperty("--good-left", "36%");
  els.releaseTimingTrack?.style.setProperty("--good-width", "28%");
  els.releaseTimingTrack?.style.setProperty("--perfect-left", "46%");
  els.releaseTimingTrack?.style.setProperty("--perfect-width", "8%");
  els.releaseTimingCursor?.style.setProperty("--release-result-x", "50%");
  els.releaseTimingCursor?.style.removeProperty("--release-cursor-x");
}

function render() {
  if (document.body.classList.contains("mobile-batter-open") && isMobilePortraitLayout()) {
    state.batterCardExpanded = true;
  } else {
    state.batterCardExpanded = false;
  }
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
  els.pitcherCard?.classList.add("card-v2");
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
  els.batterCard?.classList.add("card-v2");
  renderSlotBadge(batter);
  renderBatterTypeV2(batter);
  resetTagDetail();
  els.batterCard?.classList.toggle("boss-batter", Boolean(batter.isBoss));
  els.batterCard?.classList.toggle("rival-batter", Boolean(batter.isRival));
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
  renderReleaseTimingPanel();
  renderStageThemeBadge();
  renderRunStatusCard();
  syncScreenPhase();
  syncGameOverlayUi();
  disablePitchButtons(pitchInputLocked({ includeRelease: false }));
  syncMobilePortraitUi();
  renderMobileGameUi();
}

function updateCardToggle(button, expanded, label) {
  if (!button) return;
  button.setAttribute("aria-expanded", String(expanded));
  button.setAttribute("aria-label", `${label} 카드 ${expanded ? "접기" : "펼치기"}`);
  button.classList.toggle("is-expanded", expanded);
  if (button === els.mobileBatterToggle) {
    button.textContent = expanded ? "▼" : "▶";
    return;
  }
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

const MOBILE_PORTRAIT_QUERY = "(min-width: 0px)";
let mobilePanelMode = "";
let mobileSelectedCard = "";

function isMobilePortraitLayout() {
  return true;
}

function syncGameOverlayUi() {
  const overlayOpen = Boolean(
    (els.titleOverlay && !els.titleOverlay.hidden) ||
      (els.tutorialOverlay && !els.tutorialOverlay.hidden) ||
      (els.pitcherSelectOverlay && !els.pitcherSelectOverlay.hidden) ||
      (els.dugoutOverlay && !els.dugoutOverlay.hidden) ||
      (els.rewardOverlay && !els.rewardOverlay.hidden) ||
      (els.stageOverlay && !els.stageOverlay.hidden) ||
      (els.themeSelectOverlay && !els.themeSelectOverlay.hidden) ||
      (els.resultOverlay && !els.resultOverlay.hidden) ||
      (els.stageThemeDetailOverlay && !els.stageThemeDetailOverlay.hidden)
  );
  document.body.classList.toggle("game-overlay-open", overlayOpen);
}

function closeMobileSheets() {
  mobilePanelMode = "";
  if (els.mobileInfoPanel) els.mobileInfoPanel.hidden = true;
  if (els.mobilePlayerDetailPanel) {
    els.mobilePlayerDetailPanel.hidden = true;
    els.mobilePlayerDetailPanel.innerHTML = "";
  }
  if (els.mobilePanelBackdrop) els.mobilePanelBackdrop.hidden = true;
  mobileSelectedCard = "";
  els.mobileGameShell?.querySelector(".mobile-pitcher-summary")?.classList.remove("is-selected");
  els.mobileGameShell?.querySelector(".mobile-batter-summary")?.classList.remove("is-selected");
  els.mobilePitchTab?.classList.add("is-active");
  els.mobileLogTab?.classList.remove("is-active");
  els.mobileInfoTab?.classList.remove("is-active");
}

function renderMobileCountDots(container, value, total) {
  if (!container) return;
  container.innerHTML = Array.from({ length: total }, (_, index) => `<i class="${index < value ? "is-on" : ""}"></i>`).join("");
}

function renderMobileZones() {
  if (!els.mobileStrikeZone) return;
  const active = state.releaseTiming?.active ? state.releaseTiming : null;
  els.mobileStrikeZone.innerHTML = Array.from({ length: 25 }, (_, index) => {
    const row = Math.floor(index / 5) - 1;
    const col = (index % 5) - 1;
    const inside = row >= 0 && row <= 2 && col >= 0 && col <= 2;
    const nearestRow = clamp(row, 0, 2);
    const nearestCol = clamp(col, 0, 2);
    const zone = nearestRow * 3 + nearestCol + 1;
    const selected = active && Number(active.targetRow) === row && Number(active.targetCol) === col;
    return `<button class="mobile-zone-button${inside ? " is-strike" : ""}${selected ? " is-selected" : ""}" type="button" data-mobile-zone="${zone}" data-target-row="${row}" data-target-col="${col}" data-intent="${inside ? "strike" : "ball"}" aria-label="${escapeHtml(actualCourseLabel(row, col))}" ${pitchInputLocked({ includeRelease: false }) ? "disabled" : ""}></button>`;
  }).join("");
}

function renderMobilePitchButtons() {
  if (!els.mobilePitchButtons || !state.pitcher) return;
  els.mobilePitchButtons.innerHTML = state.pitcher.repertoire.slice(0, 5).map((pitch) => {
    if (MP.ensurePitchRuntime) MP.ensurePitchRuntime(pitch);
    const burdenValue = Math.min(100, Math.max(0, pitch.burden || 0));
    const burdenLabel = MP.burdenLabel ? MP.burdenLabel(burdenValue) : "안정";
    const burdenTone = burdenValue >= 70 ? "danger" : burdenValue >= 45 ? "warn" : "stable";
    const levelTier = pitchLevelTierId(pitch);
    return `<button class="mobile-pitch-button${state.selectedPitchId === pitch.id ? " is-selected" : ""}" type="button" data-mobile-pitch="${escapeHtml(pitch.id)}" data-burden="${burdenTone}" data-pitch-tier="${escapeHtml(levelTier)}" ${pitchInputLocked({ includeRelease: false }) ? "disabled" : ""}>
      <img src="${pitchIconUrl(pitch)}" alt=""><strong>${escapeHtml(pitch.name)}</strong><small>${pitchVelocityKmh(pitch)}km/h</small><em>${escapeHtml(burdenLabel)}</em>
    </button>`;
  }).join("");
}

function mobilePitcherTagText() {
  if (!state.pitcher) return "태그 준비 중";
  ensurePitcherTagFields(state.pitcher);
  const names = [];
  const core = state.pitcher.coreTagId ? tagById(state.pitcher.coreTagId) : null;
  if (core?.name) names.push(core.name);
  (state.pitcher.bonusTags || []).slice(0, 5).forEach((id) => names.push(supportTagDisplayName(id)));
  return names.filter(Boolean).slice(0, 2).join(" · ") || state.pitcher.style || "균형형 투수";
}

function mobileTagChipsHtml(text, kind) {
  return String(text || "")
    .split(/(?:\s*·\s*|\s*쨌\s*)/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 7)
    .map((tag) => `<button type="button" data-mobile-${kind}-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`)
    .join("");
}

function mobileTagTierFromNumber(tier) {
  if (tier >= 4) return "platinum";
  if (tier >= 3) return "gold";
  if (tier >= 2) return "silver";
  return "bronze";
}

function pitchLevelTierId(pitch) {
  const level = pitch?.level || 1;
  if (level >= 5) return "platinum";
  if (level >= 4) return "gold";
  if (level >= 3) return "silver";
  if (level >= 2) return "bronze";
  return "none";
}

function mobileTagButtonsHtml(items, kind) {
  const limit = kind === "pitcher" || kind === "batter" ? 2 : 7;
  return (items || [])
    .filter((item) => item?.label)
    .slice(0, limit)
    .map((item) => `<button type="button" data-tier="${escapeHtml(item.tier || "bronze")}" data-role="${escapeHtml(item.role || item.section || "tag")}" data-mobile-${kind}-tag="${escapeHtml(item.label)}">${escapeHtml(item.label)}</button>`)
    .join("");
}

function mobilePitcherTagItems() {
  if (!state.pitcher) return [];
  ensurePitcherTagFields(state.pitcher);
  const items = [];
  const core = state.pitcher.coreTagId ? tagById(state.pitcher.coreTagId) : null;
  if (core?.name) items.push({ label: core.name, tier: state.pitcher.coreTier || "bronze", section: "core", text: tagDescriptionForPitcher(core) });
  (state.pitcher.bonusTags || []).forEach((id) => {
    const tag = tagById(id);
    const label = supportTagDisplayName(id);
    items.push({
      label,
      tier: mobileTagTierFromNumber(supportTagTier(state.pitcher, id)),
      section: "support",
      text: tag?.description || pitcherTagDetailText(label)
    });
  });
  return items;
}

function mobileBatterTagItems(batter) {
  return batterVisibleInfoLines(batter).map((label, index) => {
    const tier = batterDisplayTagTier(batter, label, index);
    const role = batterDisplayTagRole(label, index);
    return { label, tier, role, text: tagDetailText(label, batter) };
  });
}

function mobilePitcherTagChipsHtml() {
  return mobileTagButtonsHtml(mobilePitcherTagItems(), "pitcher");
}

function mobileBatterTagChipsHtml(batter) {
  return mobileTagButtonsHtml(mobileBatterTagItems(batter), "batter");
}

function mobileBatterMetaText(batter) {
  if (!batter) return "1번타자";
  const labels = [`${batter.slot || 1}번타자`];
  if (batter.isBoss) labels.push("보스");
  if (batter.isRival) labels.push("키맨");
  return labels.join(" · ");
}

function mobileModalTagButtonsHtml(items) {
  return (items || []).map((tag) => `<button type="button" data-tier="${escapeHtml(tag.tier || "bronze")}" data-mobile-modal-tag="${escapeHtml(tag.label)}" data-mobile-modal-tag-text="${escapeHtml(tag.text || tag.label)}" data-mobile-modal-tag-section="${escapeHtml(tag.section || "tag")}">${escapeHtml(tag.label)}</button>`).join("");
}

function mobilePitcherStatusHtml() {
  const mental = state.pitcher?.stats?.멘탈 ?? 60;
  const maxBurden = Math.max(0, ...(state.pitcher?.repertoire || []).map((pitch) => pitch.burden || 0));
  const releaseLabel = state.lastReleaseResult?.label || (mental >= 70 ? "안정 릴리즈" : mental >= 55 ? "보통 릴리즈" : "흔들림 주의");
  const mentalLabel = mental >= 70 ? "안정" : mental >= 55 ? "보통" : "주의";
  const burdenLabel = maxBurden >= 70 ? "관리 필요" : maxBurden >= 45 ? "주의" : "안정";
  return `<div class="mobile-detail-status"><span><b>릴리즈</b><em>${escapeHtml(releaseLabel)}</em></span><span><b>멘탈</b><em>${escapeHtml(mentalLabel)}</em></span><span><b>구종 피로도</b><em>${escapeHtml(burdenLabel)}</em></span></div>`;
}

function pitcherTagDetailText(label) {
  const tag = [...coreTagCatalog, ...supportTags()].find((item) => item.name === label || supportTagDisplayName(item.id) === label);
  return tag?.description || `${label} 태그입니다. 투수 운영과 타자 반응에 영향을 줍니다.`;
}

function showMobileModalTagDetail(title, text, section = "") {
  const selector = section ? `[data-mobile-detail-tag-text="${section}"]` : "[data-mobile-detail-tag-text]";
  const box = els.mobilePlayerDetailPanel?.querySelector(selector);
  if (!box) return;
  els.mobilePlayerDetailPanel?.querySelectorAll("[data-mobile-detail-tag-text]").forEach((item) => {
    if (item !== box) {
      item.hidden = true;
      item.dataset.activeTag = "";
    }
  });
  if (!box.hidden && box.dataset.activeTag === title) {
    box.hidden = true;
    box.dataset.activeTag = "";
    return;
  }
  box.dataset.activeTag = title;
  box.innerHTML = `<strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p>`;
  box.hidden = false;
}

function mobileStatsGridHtml(stats, limit = 5) {
  return Object.entries(stats || {})
    .slice(0, limit)
    .map(([key, value]) => `<b><span>${escapeHtml(key)}</span><em>${escapeHtml(value)}</em></b>`)
    .join("");
}

function renderMobilePlayerDetail() {
  if (!els.mobilePlayerDetailPanel) return;
  els.mobileGameShell?.querySelector(".mobile-pitcher-summary")?.classList.toggle("is-selected", mobileSelectedCard === "pitcher");
  els.mobileGameShell?.querySelector(".mobile-batter-summary")?.classList.toggle("is-selected", mobileSelectedCard === "batter");
  if (!mobileSelectedCard || !state.pitcher) {
    els.mobilePlayerDetailPanel.hidden = true;
    els.mobilePlayerDetailPanel.innerHTML = "";
    return;
  }
  const batter = currentBatter();
  if (mobileSelectedCard === "pitcher") {
    const tags = mobilePitcherTagItems();
    const coreTags = mobileModalTagButtonsHtml(tags.filter((tag) => tag.section === "core"));
    const supportTagsHtml = mobileModalTagButtonsHtml(tags.filter((tag) => tag.section !== "core"));
    els.mobilePlayerDetailPanel.innerHTML = `
      <header><div><strong>${escapeHtml(state.pitcher.name || "-")}</strong></div><button class="mobile-detail-close" type="button" data-mobile-detail-close>×</button></header>
      <section class="mobile-detail-section"><strong>주요 능력</strong><div class="mobile-detail-grid">${mobileStatsGridHtml(state.pitcher.stats, 5)}</div></section>
      <section class="mobile-detail-section"><strong>핵심태그</strong><div class="mobile-detail-tags">${coreTags || "<span>태그 없음</span>"}</div><div class="mobile-detail-tag-text" data-mobile-detail-tag-text="core" hidden></div></section>
      <section class="mobile-detail-section"><strong>보조태그</strong><div class="mobile-detail-tags">${supportTagsHtml || "<span>태그 없음</span>"}</div><div class="mobile-detail-tag-text" data-mobile-detail-tag-text="support" hidden></div></section>
      <section class="mobile-detail-section"><strong>현재 상태</strong>${mobilePitcherStatusHtml()}</section>
    `;
  } else {
    const tags = mobileBatterTagItems(batter)
      .map((tag) => `<button type="button" data-tier="${escapeHtml(tag.tier || "bronze")}" data-mobile-modal-tag="${escapeHtml(tag.label)}" data-mobile-modal-tag-text="${escapeHtml(tag.text)}">${escapeHtml(tag.label)}</button>`)
      .join("");
    const recent = (state.mobilePitchRecords || [])
      .filter((item) => item.type !== "batter")
      .slice(0, 2)
      .map((item) => `<span>${escapeHtml(item.pitch)} ${item.speed}km/h / ${escapeHtml(item.outcome)}</span>`)
      .join("");
    els.mobilePlayerDetailPanel.innerHTML = `
      <header><div><strong>${escapeHtml(batter?.name || "-")}</strong></div><button class="mobile-detail-close" type="button" data-mobile-detail-close>×</button></header>
      <section class="mobile-detail-section"><strong>주요 능력</strong><div class="mobile-detail-grid">${mobileStatsGridHtml(batter?.stats, 5)}</div></section>
      <section class="mobile-detail-section"><strong>태그</strong><div class="mobile-detail-tags">${tags}</div><div class="mobile-detail-tag-text" data-mobile-detail-tag-text="tag" hidden></div></section>
      <section class="mobile-detail-section"><strong>최근 승부 기록</strong><div class="mobile-detail-pitches">${recent || "<span>기록 없음</span>"}</div></section>
    `;
  }
  els.mobilePlayerDetailPanel.dataset.kind = mobileSelectedCard;
  els.mobilePlayerDetailPanel.hidden = false;
  if (els.mobilePanelBackdrop) els.mobilePanelBackdrop.hidden = false;
}

function renderMobileRelease() {
  if (!els.mobileReleasePanel) return;
  const active = state.releaseTiming?.active ? state.releaseTiming : null;
  const result = state.lastReleaseResult && !state.lastReleaseResult.auto ? state.lastReleaseResult : null;
  els.mobileReleasePanel.classList.toggle("is-active", !!active);
  els.mobileReleasePanel.classList.toggle("is-shaking", !!active?.shake);
  els.mobileReleasePanel.dataset.state = active ? "active" : result ? "result" : "idle";
  if (active) {
    const goodLeft = (0.5 - active.goodSize / 2) * 100;
    const perfectLeft = (0.5 - active.perfectSize / 2) * 100;
    els.mobileReleaseGrade.textContent = "타이밍";
    els.mobileReleaseMode.textContent = `제구 ${Math.round(active.control)} · 압박 ${Math.round(active.pressure)}`;
    els.mobileReleasePanel.style.setProperty("--good-left", `${goodLeft}%`);
    els.mobileReleasePanel.style.setProperty("--good-width", `${active.goodSize * 100}%`);
    els.mobileReleasePanel.style.setProperty("--perfect-left", `${perfectLeft}%`);
    els.mobileReleasePanel.style.setProperty("--perfect-width", `${active.perfectSize * 100}%`);
    els.mobileReleasePanel.style.setProperty("--cursor-duration", `${active.duration}ms`);
  } else if (result) {
    els.mobileReleaseGrade.textContent = result.label;
    els.mobileReleaseMode.textContent = `정확도 ${result.accuracy}%`;
    els.mobileReleaseCursor?.style.setProperty("--cursor-x", `${(result.position || 0.5) * 100}%`);
  } else {
    els.mobileReleaseGrade.textContent = "대기";
    els.mobileReleaseMode.textContent = "코스를 선택하세요";
    els.mobileReleaseCursor?.style.setProperty("--cursor-x", "50%");
  }
  if (els.mobileThrowButton) {
    els.mobileThrowButton.disabled = !active;
    els.mobileThrowButton.classList.toggle("is-ready", !!active);
  }
}

function renderMobileDuelRead(recommendation) {
  if (!els.mobileDuelReadFlow) return;
  const flowLabel = els.mobileDuelReadFlow.closest("span");
  if (flowLabel?.firstChild) flowLabel.firstChild.textContent = "흐름 ";
  els.mobileDuelReadFlow.textContent = mobileCatcherLine();
  els.mobileDuelReadPitch.textContent = recommendation?.title || "대기";
  const riskLabel = els.mobileDuelReadRisk.closest("span");
  if (riskLabel?.firstChild) riskLabel.firstChild.textContent = "판단 ";
  els.mobileDuelReadRisk.textContent = recommendation?.confidence ? `${Math.round(recommendation.confidence)}%` : "대기";
  return;
  const confidence = recommendation?.confidence || 0;
  const suspicion = Math.round(clamp(state.atBat?.suspicion || 0, 0, 100));
  els.mobileDuelReadFlow.textContent = confidence >= 76 ? "강함" : confidence >= 58 ? "보통" : "흐림";
  els.mobileDuelReadPitch.textContent = recommendation?.title || "대기";
  els.mobileDuelReadRisk.textContent = `${suspicion}%`;
}

function mobileCatcherLine() {
  const suspicion = state.atBat?.suspicion || 0;
  if (suspicion >= 70) return "반복 흐름 조심";
  if (state.bases.some(Boolean)) return "주자 묶고 낮게";
  if (state.balls >= 2) return "존 근처로 수습";
  if (state.strikes >= 2) return "코스 보고 결정";
  return "반응 보고 다음 코스";
  if (suspicion >= 70) return "같은 흐름은 읽힐 수 있습니다.";
  if (state.bases.some(Boolean)) return "주자부터 묶고 낮게 버티세요.";
  if (state.balls >= 2) return "무리한 유인보다 존 근처가 낫습니다.";
  if (state.strikes >= 2) return "결정은 서두르지 말고 코스를 보세요.";
  return "타자 반응을 보고 다음 코스를 정하세요.";
}

function mobilePitchOutcomeLabel(result) {
  if (result.result === "ball" && state.balls >= 3) return "볼넷";
  if (["calledStrike", "swingingStrike"].includes(result.result) && state.strikes >= 2) return "삼진";
  return {
    ball: "볼",
    calledStrike: "스트라이크",
    swingingStrike: "헛스윙",
    foul: "파울",
    inPlayOut: "범타",
    doublePlay: "병살",
    single: "안타",
    double: "2루타",
    homerun: "홈런",
    error: "실책"
  }[result.result] || "결과";
}

function recordMobilePitchResult(result) {
  recordMobileBatterStart(currentBatter());
  const records = state.mobilePitchRecords || [];
  const pitch = result.pitch || {};
  const dugoutCue = state.mobileDugoutCue || "";
  const mainCause = result.specialEffect?.label || state.cardTriggerLog?.[0]?.cardName || dugoutCue;
  const cause = [...new Set([result.weaknessFeedback, mainCause].filter(Boolean))].join(" · ");
  if (dugoutCue && mainCause === dugoutCue) state.mobileDugoutCue = "";
  const note = cause || result.clue || result.detail || result.mindEffect?.label || result.timingLabel || result.location?.label || "";
  records.unshift({
    no: state.atBat?.pitchHistory?.length || state.pitchCount || records.length + 1,
    pitch: pitch.name || "투구",
    pitchId: pitch.id || "",
    category: pitch.category || "",
    speed: pitchVelocityKmh(pitch),
    zone: mobilePitchZoneLabel(result.location),
    note,
    detail: mobilePitchDetailText(result, note),
    reaction: mobilePitchReactionText(result),
    outcome: mobilePitchResultShortLabel(result),
    outLabel: result.outLabel || "",
    result: result.result || ""
  });
  state.mobilePitchRecords = records;
}

function mobilePitchZoneLabel(location) {
  if (!location) return "-";
  const row = Number(location.row);
  const col = Number(location.col);
  const high = row <= 0;
  const low = row >= 2;
  const inside = col >= 2;
  const outside = col <= 0;
  if (inside && high) return "몸쪽높게";
  if (inside && low) return "몸쪽낮게";
  if (outside && high) return "바깥높게";
  if (outside && low) return "바깥낮게";
  if (inside) return "몸쪽";
  if (outside) return "바깥";
  if (high) return "높게";
  if (low) return "낮게";
  return "중앙";
}

function mobilePitchResultShortLabel(result) {
  if (result.result === "ball") return state.balls >= 3 ? "볼넷" : "볼";
  if (result.result === "calledStrike") return state.strikes >= 2 ? "삼진" : "스트라이크";
  if (result.result === "swingingStrike") return state.strikes >= 2 ? "삼진" : "헛스윙";
  if (result.displayResult) return result.displayResult;
  if (result.result === "inPlayOut") return mobilePitchOutLabel(result);
  return {
    foul: "파울",
    doublePlay: "병살",
    single: "안타",
    double: "2루타",
    homerun: "홈런",
    error: "실책"
  }[result.result] || "결과";
}

function mobilePitchOutLabel(result) {
  const outLabel = result?.outLabel || "";
  if (/GROUND/i.test(outLabel)) return "땅볼 아웃";
  if (/FLY/i.test(outLabel)) return "플라이 아웃";
  return "범타";
}

function mobilePitchTimingSide(result) {
  const timing = Number(result?.timingValue);
  if (!Number.isFinite(timing)) return "default";
  if (timing < 0.45) return "late";
  if (timing > 0.7) return "early";
  return "default";
}

function mobilePitchReactionText(result) {
  if (result?.displayReaction) return result.displayReaction;
  if (result.result === "calledStrike") return "타자가 지켜봤습니다";
  if (result.result === "ball") return "타자가 골라냈습니다";
  if (result.result === "swingingStrike") {
    const side = mobilePitchTimingSide(result);
    if (side === "early") return "타자가 먼저 배트를 냈습니다";
    if (side === "late") return "타자가 공을 늦게 따라갔습니다";
    return "노린 공과 달라 배트가 헛나갔습니다";
  }
  if (result.result === "foul") {
    const side = mobilePitchTimingSide(result);
    if (side === "early") return "타자가 먼저 맞혔습니다";
    if (side === "late") return "타자가 늦게 따라왔습니다";
    return "정타는 아니지만 배트에 맞혔습니다";
  }
  if (result.result === "inPlayOut") {
    return /GROUND/i.test(result.outLabel || "") ? "땅볼을 유도했습니다" : "약한 타구를 유도했습니다";
  }
  if (result.result === "doublePlay") return "땅볼을 유도했습니다";
  if (result.result === "single") return "타이밍을 맞췄습니다";
  if (result.result === "double") return "강한 타구를 허용했습니다";
  if (result.result === "homerun") return "타자가 완벽하게 때려냈습니다";
  if (result.result === "error") return "수비가 처리하지 못했습니다";
  return "타자 반응을 확인했습니다";
}

function mobilePitchResultTone(result) {
  return {
    ball: "ball",
    calledStrike: "strike",
    swingingStrike: "whiff",
    foul: "foul",
    inPlayOut: "out",
    doublePlay: "out",
    single: "hit",
    double: "hit",
    homerun: "hit",
    error: "hit"
  }[result?.result] || "neutral";
}

function mobilePitchDetailText(result, note = "") {
  const pitchName = result.pitch?.name || "공";
  const zone = mobilePitchZoneLabel(result.location);
  const weaknessText =
    result.weaknessFeedback === "공략 성공"
      ? " 공개된 약점 흐름과 맞아 타자의 대응이 늦었습니다."
      : result.weaknessFeedback === "공략 시도"
        ? " 공략 보조태그에 맞춘 선택이었고, 결과와 함께 다음 반응을 확인해야 합니다."
        : "";
  if (result.result === "ball") return `${zone} ${pitchName}을 타자가 기다렸습니다. 존 밖 공을 골라내며 승부를 길게 가져갑니다.${weaknessText}`;
  if (result.result === "calledStrike") return `${zone} ${pitchName}이 존에 들어왔고 타자가 지켜봤습니다. 같은 코스 반복은 다음 공에 읽힐 수 있습니다.${weaknessText}`;
  if (result.result === "swingingStrike") {
    const side = mobilePitchTimingSide(result);
    const next =
      side === "early"
        ? "다음 공은 느린 공이나 낮은 코스로 타이밍을 더 뺏을 수 있습니다."
        : side === "late"
          ? "빠른 공으로 밀어붙이거나 높은 코스를 활용할 수 있습니다."
          : "직전 배합이 먹혔지만 같은 패턴 반복은 바로 읽힐 수 있습니다.";
    return `${zone} ${pitchName}에 배트가 나왔습니다. ${mobilePitchReactionText(result)} ${next}${weaknessText}`;
  }
  if (result.result === "foul") return `${zone} ${pitchName}을 파울로 걷어냈습니다. ${mobilePitchReactionText(result)} 같은 구종이나 같은 코스를 바로 반복하면 다음에는 정타 위험이 올라갑니다.${weaknessText}`;
  if (result.result === "inPlayOut") return `${zone} ${pitchName}을 맞혔지만 정타는 아니었습니다. ${mobilePitchReactionText(result)} 범타 흐름을 유지하려면 높이나 계열을 한 번 바꿔 읽히는 것을 줄이세요.${weaknessText}`;
  if (result.result === "doublePlay") return `${zone} ${pitchName}으로 땅볼 흐름을 만들었습니다. 주자까지 함께 지우며 승부를 크게 정리했습니다.${weaknessText}`;
  if (result.result === "single") return `${zone} ${pitchName}에 타자가 배트를 맞혔습니다. 다음 승부는 같은 계열을 피하고 반대 코스나 높이 변화로 기준을 흔드세요.${weaknessText}`;
  if (result.result === "double") return `${zone} ${pitchName}이 강한 타구로 이어졌습니다. 장타 흐름을 끊기 위해 낮은 코스나 완급 전환이 필요합니다.`;
  if (result.result === "homerun") return `${zone} ${pitchName}을 완벽하게 맞았습니다. 같은 패턴과 몰린 공은 바로 줄여야 합니다.`;
  if (result.result === "error") return `${zone} ${pitchName}이 인플레이가 됐고 수비가 처리하지 못했습니다. 타자 반응은 다음 승부 판단에 계속 참고하세요.`;
  return note || "타자 반응을 확인했습니다.";
}

function recordMobileBatterStart(batter) {
  const records = state.mobilePitchRecords || [];
  const key = `${state.inning}:${state.batterIndex}:${batter?.name || ""}`;
  if (records.some((item) => item.type === "batter" && item.key === key)) return;
  records.unshift({ type: "batter", key, slot: batter?.slot || state.batterIndex + 1, batter: batter?.name || "타자" });
  state.mobilePitchRecords = records;
}

function recordMobileGrowthMark(growthResult) {
  const label = growthMarkLabel(growthResult);
  if (!label) return;
  showEventBanner(`성장+\n${label}`, "growth", 1400);
}

function renderMobileRecentLog() {
  if (!els.mobileRecentLog) return;
  const card = els.mobileRecentLog.closest(".mobile-recent-log-card");
  const current = currentBatter();
  const items = (state.mobilePitchRecords || []).length
    ? state.mobilePitchRecords
    : current
      ? [{ type: "batter", slot: current.slot || state.batterIndex + 1, batter: current.name || "타자" }]
      : [];
  const shouldShow = items.length > 0;
  if (card) {
    card.hidden = false;
    card.classList.toggle("is-empty", !shouldShow);
    card.closest(".mobile-mid-panel")?.classList.toggle("is-log-empty", !shouldShow);
    const header = card.querySelector("header");
    if (header) {
      let count = header.querySelector(".mobile-count-badge");
      if (!count) {
        count = document.createElement("span");
        count.className = "mobile-count-badge";
        header.insertBefore(count, els.mobileRecentLogMore || null);
      }
      count.textContent = `${state.balls}-${state.strikes}`;
      header.querySelector(".mobile-suspicion-chip")?.remove();
    }
    const suspicionValue = Math.round(clamp(state.atBat?.suspicion || 0, 0, 100));
    let suspicionCard = card.previousElementSibling?.classList?.contains("mobile-suspicion-card")
      ? card.previousElementSibling
      : null;
    if (!suspicionCard) {
      suspicionCard = document.createElement("button");
      suspicionCard.type = "button";
      suspicionCard.className = "mobile-suspicion-card";
      suspicionCard.dataset.mobileSuspicion = "true";
      card.parentElement?.insertBefore(suspicionCard, card);
    }
    suspicionCard.innerHTML = `<span>의심도</span><strong>${suspicionValue}%</strong><i><u style="width:${suspicionValue}%"></u></i>`;
  }
  if (!shouldShow) {
    els.mobileRecentLog.innerHTML = '<p class="mobile-recent-log-empty">아직 투구 기록 없음</p>';
    return;
  }
  const visibleItems = items.filter((item) => item.type !== "growth").slice(0, 4);
  els.mobileRecentLog.innerHTML = `
    <div class="mobile-pitch-compact-list">
      ${visibleItems
        .map(
          (item) => item.type === "batter"
            ? `<div class="mobile-recent-log-row is-batter-marker"><span>${escapeHtml(item.slot || "-")}번 타자 ${escapeHtml(item.batter)}</span></div>`
            : `<div class="mobile-recent-log-row mobile-pitch-compact-row" data-result="${escapeHtml(item.result)}">
            <span class="mobile-pitch-order">${item.no}구</span>
            <span class="mobile-pitch-zone">${escapeHtml(item.zone || "-")}</span>
            <b>${escapeHtml(item.pitch)}</b>
            <em class="mobile-result-badge mobile-result-badge--${escapeHtml(mobilePitchResultTone(item))}">${escapeHtml(item.outcome)}</em>
            <small>${escapeHtml(item.reaction || item.detail || "타자 반응을 확인했습니다")}</small>
          </div>`
        )
        .join("")}
    </div>`;
}

function renderMobileInfoPanel() {
  if (!els.mobileInfoPanelBody || !mobilePanelMode) return;
  if (mobilePanelMode === "tag") return;
  if (mobilePanelMode === "log") {
    els.mobileInfoPanelTitle.textContent = "승부기록";
    const pitchItems = (state.mobilePitchRecords || []).filter((item) => item.type !== "batter");
    els.mobileInfoPanelBody.innerHTML = pitchItems.length
      ? `<div class="mobile-pitch-detail-list">${pitchItems
          .map(
            (item) => `<article class="log-item mobile-pitch-detail-row" data-result="${escapeHtml(item.result)}">
              <strong>결과 · ${item.no}구 ${escapeHtml(item.zone || "-")} ${escapeHtml(item.pitch)} ${escapeHtml(item.outcome)}</strong>
              <p><span>설명</span>${escapeHtml(item.detail || item.note || "타자 반응을 확인했습니다.")}</p>
            </article>`
          )
          .join("")}</div>`
      : '<p class="mobile-empty-info">아직 승부기록이 없습니다.</p>';
    return;
  }
  if (mobilePanelMode === "mission") {
    const mission = currentMission();
    const stats = mission ? ensureStageRunState().inningStats[state.inning] || state.currentInningStats : null;
    const result = mission ? ensureStageRunState().missionResults[mission.id] : null;
    const live = liveMissionStatus(mission, stats, result);
    const detailLines = String(missionDetailText(mission, stats) || "").split("|").filter(Boolean);
    els.mobileInfoPanelTitle.textContent = mission ? missionDisplayName(mission) : "이닝 미션";
    els.mobileInfoPanelBody.innerHTML = mission
      ? `<div class="mobile-mission-detail">
          <strong>${escapeHtml(mission.title || missionDisplayName(mission))}</strong>
          <p><span>목표</span>${escapeHtml(missionActionText(mission))}</p>
          ${detailLines.map((line) => `<p><span>진행</span>${escapeHtml(line)}</p>`).join("")}
          <p><span>상태</span>${escapeHtml(missionCompactStatus(live))}</p>
          <p><span>보상</span>${escapeHtml(missionRewardText())}</p>
        </div>`
      : '<p class="mobile-empty-info">이번 이닝에는 추가 미션이 없습니다.</p>';
    return;
  }
  if (mobilePanelMode === "suspicion") {
    const suspicion = Math.round(clamp(state.atBat?.suspicion || 0, 0, 100));
    const tone = suspicion >= 70 ? "높음" : suspicion >= 45 ? "주의" : "낮음";
    els.mobileInfoPanelTitle.textContent = "타자 의심도";
    els.mobileInfoPanelBody.innerHTML = `<div class="mobile-suspicion-detail">
      <strong>${suspicion}% · ${tone}</strong>
      <p>타자가 투구 패턴을 어느 정도 좁혀가고 있는지 보여줍니다.</p>
      <p>같은 구종, 같은 코스, 같은 높이를 반복하면 더 빨리 올라갑니다.</p>
      <p>다른 계열이나 다른 높이로 흐름을 바꾸면 의심도를 낮추거나 상승을 늦출 수 있습니다.</p>
    </div>`;
    return;
  }
  const batter = currentBatter();
  const batterTags = batter ? batterVisibleInfoLines(batter).join(" · ") : "상대 정보 없음";
  const pitcherStats = state.pitcher?.stats ? Object.entries(state.pitcher.stats).map(([key, value]) => `${key} ${value}`).join(" · ") : "투수 정보 없음";
  const batterStats = batter?.stats ? Object.entries(batter.stats).map(([key, value]) => `${key} ${value}`).join(" · ") : "타자 정보 없음";
  els.mobileInfoPanelTitle.textContent = "선수 정보";
  els.mobileInfoPanelBody.innerHTML = `<div class="mobile-info-summary">
    <article><strong>${escapeHtml(state.pitcher?.name || "-")}</strong><span>${escapeHtml(mobilePitcherTagText())}</span><span>${escapeHtml(pitcherStats)}</span></article>
    <article><strong>${escapeHtml(batter?.name || "-")}</strong><span>${escapeHtml(batterTags)}</span><span>${escapeHtml(batterStats)}</span></article>
  </div>`;
}

function openMobilePanel(mode) {
  if (!isMobilePortraitLayout()) return;
  mobilePanelMode = mode;
  els.mobileInfoPanel.hidden = false;
  els.mobilePanelBackdrop.hidden = false;
  els.mobilePitchTab?.classList.toggle("is-active", !mode);
  els.mobileLogTab?.classList.toggle("is-active", mode === "log");
  els.mobileInfoTab?.classList.toggle("is-active", mode === "info");
  renderMobileInfoPanel();
}

function renderMobileGameUi() {
  if (!isMobilePortraitLayout() || !els.mobileGameShell || !state.pitcher) return;
  const batter = currentBatter();
  const mission = currentMission();
  const missionResult = mission ? ensureStageRunState().missionResults[mission.id] : null;
  const missionStats = mission ? ensureStageRunState().inningStats[state.inning] || state.currentInningStats : null;
  const liveStatus = liveMissionStatus(mission, missionStats, missionResult);
  const recommendation = state.atBat?.recommendation;
  const theme = MP.getStageTheme?.(state.stageThemeId);

  if (els.mobileStageThemeSummary) {
    els.mobileStageThemeSummary.innerHTML = `<span>STAGE ${currentStageNumber()}</span><strong>${escapeHtml(theme?.name || stageConfig().name || "테마")}</strong>`;
  }
  els.mobileInningText.textContent = `${Math.min(state.inning, currentStageInnings())} / ${currentStageInnings()}`;
  els.mobileRunsText.textContent = state.runs;
  els.mobileTargetText.textContent = `${currentStageRunLimit()}실점 시 종료`;
  renderMobileCountDots(els.mobileBallsDots, state.balls, 3);
  renderMobileCountDots(els.mobileStrikesDots, state.strikes, 2);
  renderMobileCountDots(els.mobileOutsDots, state.outs, 2);
  els.mobileBases?.querySelectorAll("[data-base]").forEach((base) => {
    const index = Number(base.dataset.base) - 1;
    base.classList.toggle("is-occupied", !!state.bases[index]);
  });

  els.mobileMissionCard.hidden = !mission;
  els.mobileMissionCard.classList.toggle("is-complete", liveStatus?.className === "is-complete");
  els.mobileMissionCard.classList.toggle("is-fail", liveStatus?.className === "is-fail");
  els.mobileMissionTitle.textContent = mission ? missionDisplayName(mission) : "추가 미션 없음";
  els.mobileMissionCondition.textContent = mission ? missionConditionText(mission) : "이번 이닝은 기본 운영";
  els.mobileMissionStatus.textContent = mission ? missionCompactStatus(liveStatus) : "대기";
  els.mobilePitcherName.textContent = state.pitcher.name || "-";
  els.mobilePitcherTags.innerHTML = mobilePitcherTagChipsHtml();
  els.mobileBatterName.textContent = batter?.name || "-";
  els.mobileBatterTags.innerHTML = mobileBatterTagChipsHtml(batter);
  els.mobileBattingSlot.textContent = mobileBatterMetaText(batter);
  const suspicion = clamp(state.atBat?.suspicion || 0, 0, 100);
  els.mobileSuspicionText.textContent = `${Math.round(suspicion)}%`;
  els.mobileSuspicionFill.style.width = `${suspicion}%`;

  renderMobileZones();
  renderMobilePitchButtons();
  renderMobileRelease();
  renderMobileDuelRead(recommendation);
  renderMobileRecentLog();
  renderMobilePlayerDetail();
  els.mobileRecommendConfidence.textContent = "판단";
  els.mobileRecommendTitle.textContent = "마운드 판단";
  els.mobileRecommendText.textContent = mobileCatcherLine();
  if (mobilePanelMode) renderMobileInfoPanel();
}

function syncMobilePortraitUi() {
  const mobile = isMobilePortraitLayout();
  document.body.classList.toggle("mobile-portrait", mobile);
  if (!mobile) closeMobileSheets();
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
  const labels = [];
  if (batter.isBoss) labels.push("BOSS");
  if (batter.isRival) labels.push("RIVAL");
  els.battingSlot.innerHTML = `<span>${batter.slot}번</span>${labels.length ? `<small>${labels.join("/")}</small>` : ""}`;
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
      <div class="card-v2-row">${
        support.length || weakness.length
          ? `${chipList(support, "bonus", (tag) => supportTagDisplayName(tag.id))}${chipList(weakness, "weakness")}`
          : emptyChip("아직 없음", "support")
      }</div>
      <div class="pitcher-tag-detail-slot"></div>
    </section>
  `;
  repositionOpenPitcherTagDetail();
}

function renderBatterTypeV2(batter) {
  if (!els.batterType) return;
  const tags = batterVisibleInfoLines(batter);
  const tagButtons = tags
    .map((line, index) => {
      const cls = `${index === 0 ? "type-main" : "type-tag"}${batterTagToneClass(line)}`;
      const tier = batterDisplayTagTier(batter, line, index);
      const role = batterDisplayTagRole(line, index);
      return `<button class="${cls}" type="button" data-batter-tag="${escapeHtml(line)}" data-tier="${escapeHtml(tier)}" data-role="${escapeHtml(role)}">${escapeHtml(line)}</button>`;
    })
    .join("");
  const revealed = new Set(batter.revealedWeaknessTagIds || []);
  const candidates = new Set(batter.candidateWeaknessTagIds || []);
  const hintChips = [...new Set(batter.weaknessTags || [])]
    .map((tagId) => {
      const tag = batterWeaknessById(tagId);
      if (!tag) return "";
      if (revealed.has(tagId)) {
        return `<button class="type-tag weakness-chip is-revealed" type="button" data-batter-weakness="${escapeHtml(tagId)}">${escapeHtml(tag.name)}</button>`;
      }
      if (candidates.has(tagId)) {
        return `<button class="type-tag weakness-chip is-candidate" type="button" data-batter-weakness="${escapeHtml(tagId)}">${escapeHtml(tag.name)}</button>`;
      }
      return "";
    })
    .join("");
  els.batterType.innerHTML = `
    <span class="card-v2-inline-kicker">보조태그</span>
    <span class="card-v2-inline-row">${tagButtons}${hintChips}</span>
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
  if (!state.atBat?.readScores) {
    if (els.readGuess) els.readGuess.textContent = "대기";
    if (els.readBars) {
      els.readBars.innerHTML = ["fast", "breaking", "offspeed"]
        .map(
          (key) => `
        <div class="read-line">
          <span>${categoryNames[key]}</span>
          <div class="bar-track"><div class="bar-fill" style="width: 33%"></div></div>
          <strong>33</strong>
        </div>
      `
        )
        .join("");
    }
    return;
  }
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

function playerBotConceptScoreText(text = "") {
  let score = 0;
  if (/심리전|노림|분석|제구|땅볼|득점권|풀카운트|약점|반응 체크|포수|배합|인상/.test(text)) score += 18;
  if (/장타|홈런|담장|장타력|위력/.test(text)) score -= 24;
  if (/도박|감수|실점 위험|볼넷 위험/.test(text)) score -= 10;
  return score;
}

function pickPlayerBotRewardIndex(choices, rewardKind = "normal") {
  const ownedIds = new Set((state.ownedRewardCards || []).map((entry) => entry.cardId || entry.id));
  let best = 0;
  let bestScore = -Infinity;
  choices.forEach((reward, index) => {
    let score = 0;
    const text = `${reward.title || ""} ${reward.desc || ""} ${reward.effectText || ""} ${reward.recommendReason || ""} ${reward.reason || ""}`;
    score += playerBotConceptScoreText(text);
    if (rewardKind === "stageCard" || reward.type === "rewardCard") {
      score += { core: 120, rare: 70, common: 25 }[reward.rarity] || 10;
      if (ownedIds.has(reward.cardId) && reward.stackType === "unique") score -= 90;
      if ((reward.synergyTags || []).some((tag) => /심리|제구|분석|땅볼|득점권/.test(tag))) score += 12;
    } else if (reward.type === "pitchUpgrade") score += 112;
    else if (reward.type === "pitch") score += 102;
    else if (reward.type === "newPitch") {
      score += (state.pitcher?.repertoire?.length || 0) < 4 ? 94 : 62;
      const categories = new Set((state.pitcher?.repertoire || []).map((pitch) => pitch.category));
      if (reward.pitch?.category && !categories.has(reward.pitch.category)) score += 16;
    } else if (reward.type === "stat") {
      const order = ["제구", "예측", "멘탈", "변화", "구속"];
      const statIndex = order.indexOf(reward.stat);
      score += statIndex >= 0 ? 80 - statIndex * 10 : 20;
    } else if (reward.type === "coreEvolution") {
      score += 96;
      score += playerBotConceptScoreText(`${reward.condition || ""} ${reward.effectText || ""} ${reward.operation || ""}`);
    } else if (reward.type === "stageTag" || reward.type === "supportTag") {
      score += 70;
    }
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}

function pickPlayerBotDugoutIndex(choices) {
  const mission = currentMission();
  const missionText = mission ? missionActionText(mission) : "";
  let best = 0;
  let bestScore = -Infinity;
  choices.forEach((choice, index) => {
    let score = 0;
    const text = `${choice.title || ""} ${choice.desc || ""} ${choice.category || ""}`;
    score += playerBotConceptScoreText(text);
    const effects = choice.effects || {};
    if (effects.longHitGuard) score += 30;
    if (effects.burdenControl) score += 16;
    if (effects.suspicionMult && effects.suspicionMult < 1) score += 14;
    if (effects.revealRivalWeakness) score += 18;
    if (effects.candidateNextFirstWeakness) score += 14;
    if (effects.candidateCourseWeakness) score += 12;
    if (effects.fastControl) score += 10;
    if (effects.breakingQuality) score += 10;
    if (effects.firstBatterSuspicion && effects.firstBatterSuspicion < 0) score += 12;
    if (effects.missionChoiceBonus && /실점|병살|삼진|첫 타자/.test(missionText)) score += 10;
    if (effects.scorelessRiskSuspicion) score -= 22;
    if (effects.firstStrikeRiskSuspicion) score -= 14;
    if (effects.singleRisk) score -= 8;
    if (effects.rivalRisk) score -= 6;
    if (choice.category === "도박형") score -= 20;
    if (choice.rarity === "rare") score += 8;
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}

function pickPlayerBotThemeIndex(themes) {
  let best = 0;
  let bestScore = -Infinity;
  themes.forEach((theme, index) => {
    let score = 0;
    const text = `${theme.name || ""} ${theme.shortDesc || ""} ${theme.dangerText || ""} ${theme.rewardHint || ""}`;
    score += playerBotConceptScoreText(text);
    if (/장타|홈런|장타력|담장|위력/.test(theme.dangerText || "")) score -= 28;
    if (/볼넷|안타|출루/.test(theme.dangerText || "") && !/장타|홈런/.test(theme.dangerText || "")) score += 6;
    if (/카드|보상|핵심/.test(theme.rewardHint || "")) score += 8;
    if (score > bestScore) {
      bestScore = score;
      best = index;
    }
  });
  return best;
}

function pickPlayerBotChoice(kind, choices, extra = {}) {
  if (!choices?.length) return 0;
  if (kind === "reward") return pickPlayerBotRewardIndex(choices, extra.rewardKind || "normal");
  if (kind === "dugout") return pickPlayerBotDugoutIndex(choices);
  if (kind === "theme") return pickPlayerBotThemeIndex(choices);
  return 0;
}

function impressionHintFromCatcherText(text = "") {
  if (text.includes("직구 기준")) return "fast_timing";
  if (text.includes("몸쪽 의식")) return "inside_fast";
  if (text.includes("높은 공 의식")) return "high_fast";
  if (text.includes("낮은 변화구")) return "low_slow";
  if (text.includes("바깥쪽 변화구") || text.includes("바깥쪽 의식")) return "outside_slow";
  return null;
}

function getPlayerVisiblePitchContext() {
  const atBat = state.atBat;
  if (!atBat) return null;
  const scores = atBat.readScores || { fast: 1, breaking: 1, offspeed: 1 };
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0) || 1;
  const readEntries = Object.entries(scores)
    .map(([key, value]) => [key, Math.round((value / total) * 100)])
    .sort((a, b) => b[1] - a[1]);
  const readTop = readEntries[0] || ["fast", 33];
  const readGuess = readTop[1] < 42 ? null : readTop[0];
  const recommendation = atBat.recommendation || null;
  const recommendGuess =
    recommendation && recommendation.confidence >= 58 ? recommendation.guessedTarget || null : null;
  const catcherSign = currentCatcherSign();
  return {
    readGuess,
    readPercents: Object.fromEntries(readEntries),
    guessedTarget: readGuess || recommendGuess || recommendation?.guessedTarget || "fast",
    recommendation: recommendation
      ? {
          guessedTarget: recommendation.guessedTarget,
          recommendedCategory: recommendation.recommendedCategory,
          confidence: recommendation.confidence,
          title: recommendation.title,
          text: recommendation.text
        }
      : null,
    suspicion: Math.round(atBat.suspicion || 0),
    catcherTitle: catcherSign.title,
    catcherText: catcherSign.text,
    impressionHint: impressionHintFromCatcherText(catcherSign.text)
  };
}

function currentCatcherSign() {
  const catcher = state.catcher || catcherTypes[0];
  const recommendation = state.atBat?.recommendation;
  const target = recommendation?.guessedTarget || state.atBat?.target || "fast";
  const counter = counterCategoryForTarget(target);
  const pitchName = representativePitchName(counter);
  const suspicion = state.atBat?.suspicion || 0;
  const impression = state.atBat?.batterMind?.lastImpression;
  const mind = state.atBat?.batterMind;

  if (impression?.id === "fast_timing") {
    return {
      title: `${catcher.label} · 이전 공 활용`,
      text: "직구 기준이 남았습니다. 체인지업이나 스플리터로 타이밍을 배신할 수 있습니다."
    };
  }
  if (impression?.id === "inside_fast") {
    return {
      title: `${catcher.label} · 바깥쪽 속임`,
      text: "몸쪽 의식이 남았습니다. 바깥쪽 변화구나 바깥 유인구가 살아납니다."
    };
  }
  if (impression?.id === "high_fast") {
    return {
      title: `${catcher.label} · 눈높이 함정`,
      text: "높은 공 의식이 남았습니다. 낮은 변화구로 시선을 떨어뜨릴 수 있습니다."
    };
  }
  if (impression?.id === "low_slow") {
    return {
      title: `${catcher.label} · 낮은 공 의식`,
      text: "낮은 변화구 의식이 남았습니다. 높은 빠른 공으로 반응을 늦출 수 있습니다."
    };
  }
  if (impression?.id === "outside_slow") {
    return {
      title: `${catcher.label} · 바깥쪽 의식`,
      text: "바깥쪽 변화구 의식이 남았습니다. 몸쪽 빠른 공으로 타이밍을 찌를 수 있습니다."
    };
  }
  if ((mind?.confidence || 0) >= 70) {
    return {
      title: `${catcher.label} · 노림수 경계`,
      text: "타자가 같은 흐름을 기다립니다. 같은 계열 반복보다 배합을 배신하는 선택이 필요합니다."
    };
  }

  if (catcher.id === "safe") {
    return {
      title: `${catcher.label} · ${catcher.tone}`,
      text: suspicion >= 65 ? "타자가 흐름을 읽었습니다. 반대 코스나 다른 계열이 필요합니다." : `${pitchName}를 존 끝에 붙여 큰 타구를 줄이자는 사인입니다.`
    };
  }
  if (catcher.id === "attack") {
    return {
      title: `${catcher.label} · ${catcher.tone}`,
      text: state.strikes >= 2 ? `${pitchName} 결정구로 배트를 끌어내자는 사인입니다. 단, 반복된 결정구는 위험합니다.` : "첫 공으로 카운트를 가져와 다음 선택지를 넓히자는 사인입니다."
    };
  }
  if (catcher.id === "analysis") {
    return {
      title: `${catcher.label} · ${catcher.tone}`,
      text: `타자가 기다릴 가능성이 있는 흐름을 피해 ${pitchName}로 반대로 찌르자는 사인입니다.`
    };
  }
  return {
    title: `${catcher.label} · ${catcher.tone}`,
    text: state.bases.some(Boolean) ? "주자가 있어도 승부구를 요구합니다. 성공하면 흐름을 끊을 수 있습니다." : `${pitchName}로 과감하게 존을 찌르자는 사인입니다.`
  };
}

function renderSuspicionMeter() {
  if (!els.suspicionText || !els.suspicionFill) return;
  const suspicion = Math.round(state.atBat?.suspicion || 0);
  const stateLabel =
    suspicion >= 80 ? "위험" : suspicion >= 60 ? "간파도" : suspicion >= 30 ? "경계" : "안정";
  els.suspicionText.textContent = `${suspicion}% · ${stateLabel}`;
  els.suspicionFill.style.width = `${suspicion}%`;
  els.suspicionFill.classList.toggle("danger", suspicion >= 80);
  if (els.suspicionHint) {
    const mindHint = batterMindSummary(state.atBat?.batterMind);
    if (mindHint && suspicion < 80) els.suspicionHint.textContent = mindHint;
    else if (suspicion >= 80) els.suspicionHint.textContent = "타자가 같은 흐름을 기다립니다. 반복 선택은 장타로 이어질 수 있습니다.";
    else if (suspicion >= 60) els.suspicionHint.textContent = "기다리는 공이 생겼습니다. 성공했던 패턴도 이제는 위험합니다.";
    else if (suspicion >= 30) els.suspicionHint.textContent = "타자가 코스와 계열을 좁히기 시작합니다. 같은 흐름을 조심하세요.";
    else els.suspicionHint.textContent = "아직 타자가 방향을 잡지 못했습니다. 반복 패턴만 조심하세요.";
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
}

function pitchIconUrl(pitch) {
  return `assets/images/pitches/${pitch.id}.png`;
}

function burdenChipIcon(tierId) {
  return tierId === "stable" ? "✓" : "⚠";
}

function burdenUiHint(tierId) {
  const hints = {
    stable: "손끝이 살아 있음",
    load: "조금씩 노출 중",
    overload: "제구가 몰릴 수 있음",
    limit: "실투와 장타 위험"
  };
  return hints[tierId] || hints.stable;
}

function renderPitchButtons() {
  els.pitchButtons.classList.toggle("pitch-buttons--single-column", state.pitcher.repertoire.length <= 2);
  els.pitchButtons.innerHTML = state.pitcher.repertoire
    .map((pitch, index) => {
      if (MP.ensurePitchRuntime) MP.ensurePitchRuntime(pitch);
      const burdenValue = Math.min(100, Math.max(0, pitch.burden || 0));
      const burdenTierLabel = MP.burdenLabel ? MP.burdenLabel(burdenValue) : "안정";
      const burdenTierId = MP.getBurdenModifiers ? MP.getBurdenModifiers(pitch).tierId : "stable";
      const selected = state.selectedPitchId === pitch.id;
      const masteryTier = state.pitcher?.pitchMastery?.[pitch.id]?.tier || "none";
      const masteryMeta = GROWTH_TIER_LABEL[masteryTier] || "무등급";
      const hint = burdenUiHint(burdenTierId);
      return `
        <button
          class="pitch-button${selected ? " selected" : ""}"
          type="button"
          data-pitch="${pitch.id}"
          data-burden-tier="${burdenTierId}"
          data-pitch-tier="${escapeHtml(pitchLevelTierId(pitch))}"
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
            <span class="pitch-meta">${escapeHtml(pitch.label)} · ${pitchVelocityKmh(pitch)}km/h · ${escapeHtml(masteryMeta)}</span>
            <small class="pitch-role">${escapeHtml(pitch.note || "")}</small>
            <span class="pitch-burden-hint">${escapeHtml(hint)}</span>
          </div>
          <div class="pitch-fatigue">
            <span class="pitch-fatigue-label">구종 피로도</span>
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
    const flashKey = `${button.dataset.targetRow}:${button.dataset.targetCol}`;
    button.disabled = pitchInputLocked({ includeRelease: false });
    button.classList.toggle("flash", state.flashZone === flashKey);
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
  if (pitchInputLocked({ includeRelease: false })) return;
  const plannedIntent = intent === "ball" ? "ball" : "strike";
  state.pitchIntent = plannedIntent;
  state.pitchBallPlan =
    plannedIntent === "ball" ? classifyBallIntent(zone, "ball", "", targetRow, targetCol) || "waste" : "";
  flashCourse(zone, targetRow, targetCol);
  if (!state.selectedPitchId) {
    state.selectedPitchId = state.pitcher.repertoire[0]?.id || null;
    renderPitchButtons();
  }
  if (state.selectedPitchId) {
    const pitch = state.pitcher.repertoire.find((item) => item.id === state.selectedPitchId);
    if (!pitch) return;
    const plannedCourse = {
      zone: Number(zone) || 5,
      intent: state.pitchIntent,
      ballPlan: state.pitchBallPlan,
      targetRow: Number.isFinite(Number(targetRow)) ? Number(targetRow) : null,
      targetCol: Number.isFinite(Number(targetCol)) ? Number(targetCol) : null
    };
    beginReleaseTiming(pitch, plannedCourse);
  }
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
  if (MP.timingDismissHandler) {
    window.removeEventListener("pointerdown", MP.timingDismissHandler);
    MP.timingDismissHandler = null;
  }
  [els.timingBadge, els.mobileTimingBadge].filter(Boolean).forEach((badge) => {
    badge.textContent = text;
    badge.classList.remove("show", "good", "warn", "danger");
    if (tone) badge.classList.add(tone);
    badge.classList.add("show");
  });
  els.strikeZone.classList.toggle("flash-danger", tone === "danger");
  els.strikeZone.classList.toggle("flash-good", tone === "good");
  MP.timingDismissHandler = () => hideTiming();
  window.setTimeout(() => {
    if (MP.timingDismissHandler) window.addEventListener("pointerdown", MP.timingDismissHandler, { once: true });
  }, 0);
}

function queueTiming(text, tone) {
  if (timingTimer) window.clearTimeout(timingTimer);
  timingTimer = window.setTimeout(() => {
    setTiming(text, tone);
    timingTimer = null;
  }, GAME_TIMING.timingFeedbackDelay);
}

function hideTiming() {
  if (MP.timingDismissHandler) {
    window.removeEventListener("pointerdown", MP.timingDismissHandler);
    MP.timingDismissHandler = null;
  }
  if (timingTimer) {
    window.clearTimeout(timingTimer);
    timingTimer = null;
  }
  [els.timingBadge, els.mobileTimingBadge].filter(Boolean).forEach((badge) => {
    badge.textContent = "";
    badge.classList.remove("show", "good", "warn", "danger");
  });
}

function showEventBanner(text, tone = "inning", duration = GAME_TIMING.eventBannerDefault) {
  const banners = [els.inningBanner, els.mobileInningBanner].filter(Boolean);
  if (!banners.length) return;
  if (inningBannerTimer) {
    window.clearTimeout(inningBannerTimer);
    inningBannerTimer = null;
  }
  if (MP.inningBannerDismissHandler) {
    window.removeEventListener("pointerdown", MP.inningBannerDismissHandler);
    MP.inningBannerDismissHandler = null;
  }
  banners.forEach((banner) => {
    const baseClass = banner === els.mobileInningBanner ? "mobile-inning-banner" : "inning-banner";
    if (tone === "growth") {
      const lines = String(text || "").split("\n").filter(Boolean);
      banner.innerHTML = `<span>${escapeHtml(lines[0] || "성장+")}</span><strong>${lines.slice(1).map(escapeHtml).join("<br>")}</strong>`;
    } else {
      banner.textContent = text;
    }
    banner.className = `${baseClass} ${tone}`;
    banner.hidden = false;
    banner.classList.add("show");
  });
  MP.inningBannerDismissHandler = () => {
    banners.forEach((banner) => {
      banner.classList.remove("show");
      banner.hidden = true;
    });
    window.removeEventListener("pointerdown", MP.inningBannerDismissHandler);
    MP.inningBannerDismissHandler = null;
  };
  inningBannerTimer = window.setTimeout(() => {
    window.addEventListener("pointerdown", MP.inningBannerDismissHandler, { once: true });
    inningBannerTimer = null;
  }, 0);
}

function showStageOverlay(title, subtitle, duration = GAME_TIMING.stageOverlayDefault) {
  if (!els.stageOverlay) return;
  els.stageTitle.textContent = title;
  els.stageTitle.classList.remove("stage-title-split");
  els.stageSubtitle.textContent = subtitle;
  if (els.stageThemePanel) els.stageThemePanel.hidden = true;
  if (els.stageStartButton) els.stageStartButton.hidden = true;
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
    <div class="stage-theme-detail-row"><span>특징</span><p>${escapeHtml(theme.shortDesc)}</p></div>
    <div class="stage-theme-detail-row"><span>위험</span><p>${escapeHtml(theme.dangerText)}</p></div>
    <div class="stage-theme-detail-row"><span>공략</span><p>${escapeHtml(theme.counterText)}</p></div>
    <div class="stage-theme-detail-row"><span>보상</span><p>${escapeHtml(theme.rewardHint)}</p></div>
  `;
}

function closeStageThemeDetail() {
  if (!els.stageThemeDetailOverlay) return;
  els.stageThemeDetailOverlay.hidden = true;
  els.stageThemeDetailOverlay.classList.remove("show");
}

function openStageThemeDetail() {
  const theme = MP.getStageTheme ? MP.getStageTheme(state.stageThemeId) : null;
  if (!theme || state.gameOver || els.pitcherSelectOverlay?.hidden === false) return;
  if (!els.stageThemeDetailOverlay) return;
  if (els.stageThemeDetailTitle) els.stageThemeDetailTitle.textContent = theme.name;
  if (els.stageThemeDetailBody) els.stageThemeDetailBody.innerHTML = stageThemeDetailHtml(theme);
  els.stageThemeDetailOverlay.hidden = false;
  els.stageThemeDetailOverlay.classList.add("show");
  els.stageThemeDetailClose?.focus();
}

function showStageThemeOverlay(stageNumber, innings, themeId = state.stageThemeId) {
  if (!els.stageOverlay) return;
  state.awaitingStageStart = true;
  const config = stageConfig((stageNumber || currentStageNumber()) - 1);
  const theme = MP.getStageTheme ? MP.getStageTheme(themeId || state.stageThemeId) : null;
  const run = ensureStageRunState();
  const rivalName = run.rival?.name || state.lineup?.find((batter) => batter.isRival)?.name || "-";
  els.stageTitle.classList.add("stage-title-split");
  els.stageTitle.innerHTML = `
    <span class="stage-number-line">STAGE ${stageNumber || currentStageNumber()}</span>
    <em class="stage-lineup-line">${escapeHtml(config.name)}</em>
  `;
  els.stageSubtitle.innerHTML = `
    <strong class="stage-rule-innings">${innings || currentStageInnings()}이닝</strong>
    <span class="stage-rule-limit">목표 ${currentStageRunLimit()}실점 시 경기 종료</span>
  `;
  if (els.stageThemePanel && theme) {
    els.stageThemePanel.hidden = false;
    els.stageThemePanel.innerHTML = `
      <p class="stage-theme-summary"><span>스테이지 테마</span><strong>${escapeHtml(theme.name)}</strong></p>
      <p class="stage-theme-summary"><span>라이벌</span><strong>${escapeHtml(rivalName)}</strong></p>
      <p class="stage-theme-note">${escapeHtml(config.rival?.goalText || "")}</p>
      <p class="stage-theme-note">${escapeHtml(config.themeText || "")}</p>
    `;
  } else if (els.stageThemePanel) {
    els.stageThemePanel.hidden = true;
    els.stageThemePanel.innerHTML = "";
  }
  els.stageOverlay.hidden = false;
  els.stageOverlay.classList.add("show");
  if (els.stageStartButton) els.stageStartButton.hidden = false;
}

function startStageFromOverlay() {
  if (!state.awaitingStageStart || state.gameOver) return;
  state.awaitingStageStart = false;
  state.stageJustAdvanced = false;
  state.waitingNextBatter = false;
  els.stageOverlay?.classList.remove("show");
  if (els.stageOverlay) els.stageOverlay.hidden = true;
  if (!state.dugoutPending && !state.atBat) startAtBat();
  render();
  if (state.dugoutPending) openDugoutChoiceOverlay();
  else showBatterEntryBanner();
}

function renderStageThemeBadge() {
  if (!els.stageThemeBadge) return;
  const theme = MP.getStageTheme ? MP.getStageTheme(state.stageThemeId) : null;
  if (!theme || state.gameOver || els.pitcherSelectOverlay?.hidden === false) {
    els.stageThemeBadge.hidden = true;
    return;
  }
  els.stageThemeBadge.hidden = false;
  els.stageThemeBadge.classList.add("stage-theme-badge--clickable");
  els.stageThemeBadge.setAttribute("role", "button");
  els.stageThemeBadge.setAttribute("tabindex", "0");
  els.stageThemeBadge.setAttribute("aria-label", `${theme.name} 스테이지 테마 자세히 보기`);
  els.stageThemeBadge.title = "클릭하여 테마 설명 보기";
  els.stageThemeBadge.innerHTML = `<span class="stage-theme-badge-label">스테이지 테마</span><strong>${escapeHtml(theme.name)}</strong><span class="stage-theme-badge-hint">${escapeHtml(theme.shortDesc)}</span>`;
}

function renderThemeChoiceCards() {
  if (!els.themeChoiceList) return;
  els.themeChoiceList.innerHTML = (state.pendingThemeChoices || [])
    .map((theme) => {
      const fit = MP.themeFitLabel ? MP.themeFitLabel(theme, state.pitcher) : null;
      const fitTone = fit?.tone || "neutral";
      return `
      <button class="theme-choice-card reward-choice-card core-evolution-card" type="button" data-theme-id="${escapeHtml(theme.id)}">
        <header class="core-evo-head">
          <div class="core-evo-titles">
            <strong class="core-evo-name">${escapeHtml(theme.name)}</strong>
            <span class="core-evo-sub">${escapeHtml(theme.shortDesc)}</span>
          </div>
        </header>
        <div class="core-evo-body">
          ${fit ? rewardRowHtml("적합", fit.text) : ""}
          ${rewardRowHtml("위험", theme.dangerText)}
          ${rewardRowHtml("보상", theme.rewardHint)}
        </div>
      </button>
    `;
    })
    .join("");
}

function openThemeSelectOverlay() {
  if (!els.themeSelectOverlay || state.gameOver) return;
  clearAutoAdvance();
  showTutorialStep("nextLineup");
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
  state.awaitingStageStart = true;
  showStageThemeOverlay(currentStageNumber(), currentStageInnings(), themeId);
  state.pendingStageOverlay = null;
  state.waitingNextBatter = false;
  render();
}

function showBatterEntryBanner() {
  if (state.gameOver) return;
  showNextBatterBanner();
}

function showNextBatterBanner() {
  if (state.gameOver) return;
  const batter = currentBatter();
  const role = batter.isBoss ? "보스 · " : "";
  showEventBanner(`NEXT BATTER\n${role}${batter.slot}번 타자 ${batter.name}`, "next", GAME_TIMING.nextBatterBanner);
}

function hideBallSprite() {
  if (pitchFlightFrame) {
    window.cancelAnimationFrame(pitchFlightFrame);
    pitchFlightFrame = null;
  }
  [els.ballSprite, els.mobileBallSprite].filter(Boolean).forEach((sprite) => {
    sprite.getAnimations?.().forEach((animation) => animation.cancel());
    sprite.classList.remove("animate");
    sprite.style.setProperty("--ball-opacity", "0");
    sprite.style.setProperty("--ball-visibility", "hidden");
  });
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
  const mobile = isMobilePortraitLayout();
  const sprite = mobile && els.mobileBallSprite ? els.mobileBallSprite : els.ballSprite;
  const zone = mobile && els.mobileStrikeZone ? els.mobileStrikeZone : els.strikeZone;
  if (!sprite || !zone) return;
  const zoneRect = zone.getBoundingClientRect();
  const sceneRect = sprite.parentElement.getBoundingClientRect();
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

  sprite.style.setProperty("--ball-start-x", `${startX}px`);
  sprite.style.setProperty("--ball-start-y", `${startY}px`);
  sprite.style.setProperty("--ball-end-x", `${endX}px`);
  sprite.style.setProperty("--ball-end-y", `${endY}px`);

  if (pitchFlightFrame) window.cancelAnimationFrame(pitchFlightFrame);
  sprite.getAnimations?.().forEach((animation) => animation.cancel());
  sprite.classList.remove("animate");
  void sprite.offsetWidth;
  sprite.style.setProperty("--ball-current-x", `${startX}px`);
  sprite.style.setProperty("--ball-current-y", `${startY}px`);
  sprite.style.setProperty("--ball-scale", "0.34");
  sprite.style.setProperty("--ball-rotate", "0deg");
  sprite.style.setProperty("--ball-opacity", "1");
  sprite.style.setProperty("--ball-visibility", "visible");
  sprite.classList.add("animate");

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

    sprite.style.setProperty("--ball-current-x", `${x}px`);
    sprite.style.setProperty("--ball-current-y", `${y}px`);
    sprite.style.setProperty("--ball-scale", String(scale));
    sprite.style.setProperty("--ball-rotate", `${rotate}deg`);

    if (progress < 1) {
      pitchFlightFrame = window.requestAnimationFrame(tick);
    } else {
      pitchFlightFrame = null;
    }
  };
  pitchFlightFrame = window.requestAnimationFrame(tick);
}

function bindUiEvents() {
  if (uiEventsBound) return;
  uiEventsBound = true;

  syncTitleScreenEls();
  els.titleOverlay?.addEventListener("click", (event) => {
    if (event.target.closest("#titleStartButton")) {
      event.preventDefault();
      beginGameFromTitle();
      return;
    }
    if (event.target.closest("#titleTutorialButton")) {
      event.preventDefault();
      openTutorialFromTitle();
    }
  });
  els.tutorialOverlay?.addEventListener("click", (event) => {
    if (event.target.closest("#tutorialBackButton")) {
      event.preventDefault();
      returnToTitleScreen();
    }
  });
  els.newGameButton.addEventListener("click", startGame);
  els.bgmToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleBgm();
  });
  els.restartButton.addEventListener("click", startGame);
  els.nextBatterButton.addEventListener("click", nextBatter);
  els.stageStartButton?.addEventListener("click", startStageFromOverlay);
  document.addEventListener("pointerdown", unlockAudio, { once: true });
  els.batterCardToggle?.addEventListener("click", () => {
    state.batterCardExpanded = !state.batterCardExpanded;
    render();
  });
  els.mobileBatterToggle?.addEventListener("click", () => {
    openMobilePanel("info");
  });
  els.mobileLogMore?.addEventListener("click", () => {
    openMobilePanel("log");
  });
  els.mobileRecentLogMore?.addEventListener("click", () => {
    openMobilePanel("log");
  });
  els.mobilePitchTab?.addEventListener("click", () => closeMobileSheets());
  els.mobileLogTab?.addEventListener("click", () => openMobilePanel("log"));
  els.mobileInfoTab?.addEventListener("click", () => openMobilePanel("info"));
  els.mobileMissionCard?.addEventListener("click", () => openMobilePanel("mission"));
  els.mobileNewGameButton?.addEventListener("click", startGame);
  els.mobileThrowButton?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    finishReleaseTiming();
  });
  els.mobileReleasePanel?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    finishReleaseTiming();
  });
  els.mobilePitchButtons?.addEventListener("pointerdown", (event) => {
    const button = event.target.closest?.("[data-mobile-pitch]");
    if (button) {
      event.preventDefault();
      selectPitch(button.dataset.mobilePitch);
    }
  });
  els.mobileStrikeZone?.addEventListener("pointerdown", (event) => {
    const button = event.target.closest?.("[data-mobile-zone]");
    if (button) {
      event.preventDefault();
      handleCourseClick(button.dataset.mobileZone, button.dataset.targetRow, button.dataset.targetCol, button.dataset.intent);
    }
  });
  els.mobileGameShell?.addEventListener("click", (event) => {
    if (
      state.releaseTiming?.active &&
      !event.target.closest?.("[data-mobile-pitch], [data-mobile-zone], #mobileReleasePanel")
    ) {
      finishReleaseTiming();
      return;
    }
    const closeButton = event.target.closest?.("[data-mobile-detail-close]");
    if (closeButton) {
      closeMobileSheets();
      return;
    }
    const modalTag = event.target.closest?.("[data-mobile-modal-tag]");
    if (modalTag) {
      showMobileModalTagDetail(modalTag.dataset.mobileModalTag, modalTag.dataset.mobileModalTagText || "", modalTag.dataset.mobileModalTagSection || "");
      return;
    }
    const batterTag = event.target.closest?.("[data-mobile-batter-tag]");
    if (batterTag) {
      const tag = batterTag.dataset.mobileBatterTag;
      mobileSelectedCard = "batter";
      renderMobilePlayerDetail();
      showMobileModalTagDetail(tag, tagDetailText(tag, currentBatter()), "tag");
      return;
    }
    const pitcherTag = event.target.closest?.("[data-mobile-pitcher-tag]");
    if (pitcherTag) {
      const tag = pitcherTag.dataset.mobilePitcherTag;
      mobileSelectedCard = "pitcher";
      renderMobilePlayerDetail();
      const section = mobilePitcherTagItems().find((item) => item.label === tag)?.section || "support";
      showMobileModalTagDetail(tag, pitcherTagDetailText(tag), section);
      return;
    }
    if (event.target.closest?.("[data-mobile-suspicion]")) {
      openMobilePanel("suspicion");
      return;
    }
    const playerCard = event.target.closest?.(".mobile-player-card");
    if (playerCard?.classList.contains("mobile-pitcher-summary")) {
      mobileSelectedCard = mobileSelectedCard === "pitcher" ? "" : "pitcher";
      if (mobileSelectedCard) renderMobilePlayerDetail();
      else closeMobileSheets();
      return;
    }
    if (playerCard?.classList.contains("mobile-batter-summary")) {
      mobileSelectedCard = mobileSelectedCard === "batter" ? "" : "batter";
      if (mobileSelectedCard) renderMobilePlayerDetail();
      else closeMobileSheets();
    }
  });
  els.mobilePanelBackdrop?.addEventListener("click", closeMobileSheets);
  els.mobileInfoPanelClose?.addEventListener("click", closeMobileSheets);
  els.mobileSheetBackdrop?.addEventListener("click", () => {
    closeMobileSheets();
  });
  window.matchMedia(MOBILE_PORTRAIT_QUERY).addEventListener("change", () => {
    syncMobilePortraitUi();
    renderMobileGameUi();
  });
  els.strikeZone.addEventListener("click", (event) => {
    const button = event.target.closest?.(".zone-button");
    if (button) handleCourseClick(button.dataset.zone, button.dataset.targetRow, button.dataset.targetCol, button.dataset.intent);
  });
  els.releaseTimingButton?.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    finishReleaseTiming();
  });
  els.batterType?.addEventListener("click", (event) => {
    const weaknessButton = event.target.closest?.("[data-batter-weakness]");
    if (weaknessButton) {
      showBatterWeaknessDetail(weaknessButton.dataset.batterWeakness);
      return;
    }
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
  els.pitchButtons?.addEventListener("pointerdown", (event) => {
    const button = event.target.closest?.("button[data-pitch]");
    if (button) {
      event.preventDefault();
      selectPitch(button.dataset.pitch);
    }
  });
  els.pitcherChoiceList?.addEventListener("click", (event) => {
    if (els.pitcherSelectOverlay?.classList.contains("is-revealing")) return;
    const button = event.target.closest?.("[data-pitcher-index]");
    if (!button) return;
    const pitcher = state.pitcherChoices[Number(button.dataset.pitcherIndex)];
    if (pitcher) beginGameWithPitcher(pitcher);
  });
  els.rewardChoiceList?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-reward-index]");
    if (button) selectRewardChoice(Number(button.dataset.rewardIndex));
  });
  els.dugoutChoiceList?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-dugout-index]");
    if (button) confirmDugoutChoice(Number(button.dataset.dugoutIndex));
  });
  els.themeChoiceList?.addEventListener("click", (event) => {
    const button = event.target.closest?.("[data-theme-id]");
    if (button?.dataset.themeId) confirmStageTheme(button.dataset.themeId);
  });
  els.stageThemeBadge?.addEventListener("click", openStageThemeDetail);
  els.stageThemeBadge?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStageThemeDetail();
    }
  });
  els.stageThemeDetailClose?.addEventListener("click", closeStageThemeDetail);
  els.stageThemeDetailOverlay?.addEventListener("click", (event) => {
    if (event.target === els.stageThemeDetailOverlay) closeStageThemeDetail();
  });
  if (document.addEventListener) {
    document.addEventListener("keydown", (event) => {
      if (state.releaseTiming?.active && event.key === "Escape") {
        event.preventDefault();
        cancelReleaseTiming();
        return;
      }
      if (event.key === "Escape" && els.stageThemeDetailOverlay && !els.stageThemeDetailOverlay.hidden) {
        closeStageThemeDetail();
        return;
      }
      if (state.releaseTiming?.active && (event.key === " " || event.key === "Enter")) {
        event.preventDefault();
        finishReleaseTiming();
        return;
      }
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
  ensurePitcherGrowthFields,
  processAtBatGrowth,
  shouldShowGrowthMark,
  generateLineup,
  createPlan,
  openRewardDraft,
  generateRewardChoices,
  generateStageTagChoices,
  generateStageCardChoices,
  generateSupportTagUpgradeChoices,
  generateCoreEvolutionChoices,
  generateDugoutChoices,
  calculateStageResult,
  currentMission,
  checkStageRunLimit,
  ownedRewardCardEntries,
  revealBatterWeakness,
  revealRivalWeakness,
  openDugoutChoiceOverlay,
  selectRewardChoice,
  confirmDugoutChoice,
  confirmStageTheme,
  openStageTagReward,
  startStageFromOverlay,
  coreEvolutionById,
  applyReward,
  selectPitch,
  beginReleaseTiming,
  finishReleaseTiming,
  cancelReleaseTiming,
  buildReleaseTimingChallenge,
  gradeReleaseTiming,
  modelReleaseForBot,
  throwPitch,
  tagById,
  pitchById,
  stageConfig,
  currentStageNumber,
  currentStageRunLimit,
  currentStageInnings,
  getBatterMind: () => state.atBat?.batterMind || null,
  getLastImpression: () => state.atBat?.batterMind?.lastImpression || null,
  getBatterMemory: () => state.atBat?.batterMemory || null,
  assertPitcherCardLayout,
  getPlayerVisiblePitchContext,
  pickPlayerBotChoice,
  enableBalancePlayLog,
  setBalancePlayLogMeta,
  buildBalanceRunSummary,
  getBalanceRunSummary: () => balanceLog.active?.summary || buildBalanceRunSummary(state.gameOver && els.resultTitle?.textContent === "클리어", ""),
  exportBalanceRunJson: (includePitchEvents = true) => {
    const summary = balanceLog.active?.summary || MP.debug.getBalanceRunSummary();
    if (!summary) return null;
    if (!includePitchEvents) {
      const { pitchEvents, ...rest } = summary;
      return JSON.stringify(rest, null, 2);
    }
    return JSON.stringify(summary, null, 2);
  }
};
MP.enableBalancePlayLog = enableBalancePlayLog;
MP.setBalancePlayLogMeta = setBalancePlayLogMeta;
MP.buildBalanceRunSummary = buildBalanceRunSummary;
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
    const mission = currentMission();
    const config = stageConfig();
    const run = ensureStageRunState();
    const stageResult = calculateStageResult();
    const missionStats = mission ? run.inningStats[state.inning] || state.currentInningStats : null;
    const missionResult = mission ? run.missionResults[mission.id] : null;
    const liveStatus = liveMissionStatus(mission, missionStats, missionResult);
    snap.run = {
      stageId: config.id,
      stageName: config.name,
      stageNumber: currentStageNumber(),
      inningTarget: currentStageInnings(),
      clearLimit: currentStageClearLimit(),
      clearRuns: currentStageClearLimit(),
      failRuns: currentStageRunLimit(),
      mission: mission
        ? {
            id: mission.id,
            inning: mission.inning,
            title: mission.title,
            actionText: missionActionText(mission),
            type: mission.type,
            reward: missionRewardText(mission),
            liveStatus: liveStatus.label,
            status: run.missionResults[mission.id]
              ? (run.missionResults[mission.id].success ? "success" : "fail")
              : "active"
          }
        : null,
      missionResults: Object.keys(run.missionResults || {}).map((id) => ({
        id,
        title: run.missionResults[id]?.mission?.title || id,
        success: !!run.missionResults[id]?.success
      })),
      rival: {
        name: run.rival?.name || config.rival?.name || "",
        goalText: config.rival?.goalText || "",
        actionText: rivalActionText(config),
        rewardText: config.rival?.rewardText || "",
        longHitsAllowed: run.rival.longHitsAllowed,
        onBaseAllowed: run.rival.onBaseAllowed,
        risk: run.rival.risk
      },
      stars: {
        count: stageResult.stars,
        label: stageResult.starLabel,
        suspicionAverage: stageResult.suspicionAverage
      },
      ownedRewardCards: ownedRewardCardEntries().map((entry) => ({
        id: entry.card.id,
        name: entry.card.name,
        rarity: entry.card.rarity,
        stack: entry.stack,
        effectText: entry.card.effectText || ""
      })),
      cardTriggerLog: (state.cardTriggerLog || []).slice(-8),
      dugoutPending: !!state.dugoutPending,
      pendingDugoutChoices: (state.pendingDugoutChoices || []).map((choice) => ({
        id: choice.id,
        title: choice.title,
        category: choice.category,
        desc: choice.desc
      })),
      activeDugoutEffects: (state.activeDugoutEffects || []).map((effect) => ({
        id: effect.id,
        title: effect.title,
        turns: effect.turns
      })),
      reactionCounts: run.reactionCounts || {},
      recentReactions: run.recentReactions || [],
      highlight: run.highlight,
      lastStageResult: state.lastStageResult
    };
    if (state.pitcher) {
      snap.pitcher = {
        name: state.pitcher.name,
        style: state.pitcher.style,
        coreTagId: state.pitcher.coreTagId,
        coreEvolutionId: state.pitcher.coreEvolutionId || null,
        coreXp: state.pitcher.coreXp || 0,
        coreTier: state.pitcher.coreTier || "bronze",
        pitchMastery: { ...(state.pitcher.pitchMastery || {}) },
        bossData: state.pitcher.bossData || 0,
        pendingCoreEvolutionReward: state.pitcher.pendingCoreEvolutionReward || null,
        pendingPitchUpgradeReward: state.pitcher.pendingPitchUpgradeReward || null,
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
    snap.growth = {
      lastGrowthResult: state.lastGrowthResult || null,
      stageGrowthSummary: state.stageGrowthSummary || null
    };
    if (batter) {
      snap.currentBatter = {
        name: batter.name,
        type: batter.type,
        isBoss: !!batter.isBoss,
        stats: { ...batter.stats },
        tendency: batter.tendency,
        mind: batter.mind,
        weaknessTags: (batter.weaknessTags || []).map((tag) => ({
          id: tag.id,
          name: tag.name,
          revealed: !!tag.revealed
        })),
        revealedWeaknessTags: (batter.weaknessTags || [])
          .filter((tag) => tag.revealed)
          .map((tag) => tag.name || tag.id)
      };
    }
    return snap;
  }

  MP.debug.testConsoleSnapshot = testConsoleSnapshot;

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
showTitleScreen();
