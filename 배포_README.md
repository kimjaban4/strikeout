# 배포 안내

개발 소스는 `야구게임/`, 정적 배포 복사본은 `web-deploy/mount-psycho-baseball/`입니다.

## 배포 반영

`야구게임/` 폴더에서 아래 명령을 실행합니다.

```powershell
npm.cmd run build:deploy
```

이 명령은 다음 작업을 한 번에 처리합니다.

1. `game.js`에서 `js/00-constants.js`, `js/01-state.js`, `js/02-game-core.js`를 다시 생성
2. 브라우저가 사용하는 HTML, CSS, JS, 이미지, 오디오를 배포 폴더에 복사
3. 작업본과 배포본의 SHA-256 해시가 같은지 확인

`js/03-pitch-progression.js`, `js/04-stage-theme.js`는 수동 관리 파일이지만 배포 명령이 함께 복사합니다.

## 로컬 실행

```powershell
npm.cmd start
```

브라우저에서 `http://127.0.0.1:4173`에 접속합니다.

## 테스트

```powershell
npm.cmd run test:smoke
```

정적 호스팅에는 `web-deploy/mount-psycho-baseball/` 폴더 전체를 업로드합니다.
