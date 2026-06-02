# 유지보수 가이드

## 기준 파일

| 파일 | 역할 |
| --- | --- |
| `game.js` | 게임 로직의 기준 소스 |
| `js/00-constants.js` | `game.js`에서 생성되는 상수 모듈 |
| `js/01-state.js` | `game.js`에서 생성되는 상태와 DOM 참조 모듈 |
| `js/02-game-core.js` | `game.js`에서 생성되는 핵심 로직 모듈 |
| `js/03-pitch-progression.js` | 수동 관리하는 구종 성장 모듈 |
| `js/04-stage-theme.js` | 수동 관리하는 스테이지 테마 모듈 |
| `styles.css` | 레거시 공통 스타일 |
| `css/10-pitcher-card.css` | 투수 카드 전용 스타일 |
| `css/20-pitch-selection.css` | 구종 선택 전용 스타일 |

`index.html`의 스크립트 순서를 바꾸면 게임 초기화가 깨질 수 있습니다.

## 수정 후 확인

일반적인 수정은 아래 명령 하나로 배포본까지 반영합니다.

```powershell
npm.cmd run build:deploy
```

자동 테스트:

```powershell
npm.cmd run test:smoke
```

배포본 동기화만 확인:

```powershell
npm.cmd run check:deploy
```

## 화면 단계

- `pitcherSelect`: 선발 선택
- `pitching`: 투구 가능
- `reward`: 보상 선택
- `transition`: 다음 타자 대기
- `gameOver`: 경기 종료

입력 잠금은 `pitchInputLocked()`에서 관리합니다.
