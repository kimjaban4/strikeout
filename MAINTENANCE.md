# 유지보수 안내

## 어디를 수정하면 되는가

- 게임 규칙과 화면 동작은 `game.js`에서 수정합니다.
- `js/00-constants.js`, `js/01-state.js`, `js/02-game-core.js`는 배포 과정에서 자동 생성됩니다. 직접 수정하지 않습니다.
- 구종 성장 규칙은 `js/03-pitch-progression.js`에서 수정합니다.
- 스테이지 테마 규칙은 `js/04-stage-theme.js`에서 수정합니다.

## 화면 스타일 파일

- `styles.css`: 오래된 공통 스타일
- `css/05-card-layout.css`: 카드 공통 배치
- `css/10-pitcher-card.css`: 투수 카드 세부 배치
- `css/20-pitch-selection.css`: 구종 선택 카드 배치

## 수정 후 확인

아래 명령 하나로 실행 파일 생성, 배포 폴더 동기화, 화면 테스트를 차례로 확인합니다.

```powershell
npm.cmd run verify
```

파일 배치 구조만 빠르게 확인할 때는 아래 명령을 사용합니다.

```powershell
npm.cmd run check:structure
```
