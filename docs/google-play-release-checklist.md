# 마운드 심리전 Google Play 출시 체크리스트

기준일: 2026-08-11

## 1. 앱 빌드

- [x] Android 프로젝트 생성: Capacitor 8
- [x] 앱 이름: `마운드 심리전`
- [x] 임시 앱 ID: `io.github.kimjaban4.strikeout`
- [x] `compileSdk 36`, `targetSdk 36`, `minSdk 24`
- [x] 광고·분석·로그인 SDK 없음
- [x] Android 민감 권한 없음
- [x] 게임 저장 데이터의 기기 백업 비활성
- [x] 개인정보처리방침을 앱과 웹 배포본에 포함
- [x] 게임 전용 Android 런처 아이콘과 스플래시 적용
- [x] Android 뒤로가기: 상세창·메뉴 우선 닫기, 게임 중 메뉴 열기
- [x] 앱 백그라운드 전환 시 BGM 일시정지 및 복귀 처리
- [x] 디버그 AAB 빌드 성공
- [x] 미서명 release AAB 빌드 및 lintVital 성공: 68.6MB
- [ ] Play Console 앱 생성 전에 최종 앱 ID 확정
- [ ] 업로드 키 생성 및 Play App Signing 등록
- [ ] 서명된 release AAB 생성
- [ ] 실제 Android 기기에서 설치·업데이트·오프라인 실행 확인

## 2. Play Console 선언값

- 앱 또는 게임: 게임
- 카테고리: 스포츠
- 광고 포함: 아니요
- 앱 액세스: 별도 로그인 없이 모든 기능 이용 가능
- 데이터 보안: 수집 없음 / 공유 없음
- 개인정보처리방침 URL: `https://kimjaban4.github.io/strikeout/docs/privacy-policy.html`
- 대상 연령: 확정 필요. 아동 대상이 아니라면 13세 이상으로 선언 권장
- 콘텐츠 등급: 야구 게임 내용에 맞춰 IARC 설문 작성

온라인 기능, 광고, 분석 SDK, 계정 또는 결제를 추가하면 위 선언과 개인정보처리방침을 다시 검토해야 합니다.

## 3. 스토어 등록 자료

- [x] 앱 아이콘 512×512 PNG
- [x] 그래픽 이미지 1024×500 PNG
- [x] 실제 게임 휴대전화 스크린샷 1080×1920 4장
- [x] 짧은 설명 80자 이내 작성
- [x] 자세한 설명 4,000자 이내 작성
- [x] 스크린샷 순서와 대체 텍스트 작성
- [ ] 지원 이메일 및 개발자 표시 정보 확정
- [x] 개인정보처리방침 공개 URL `200` 응답 및 본문 확인

## 4. 품질 점검

- [x] 웹 게임 smoke 테스트 59개 통과
- [x] 진행 중 RUN 폐기 전 확인
- [x] BGM·효과음 개별 설정 및 기기 저장
- [x] 브라우저 자동 테스트로 Android 뒤로가기 분기 확인
- [x] Android 리소스 컴파일과 디버그 AAB 생성 확인
- [ ] 실제 기기에서 뒤로가기 버튼이 메뉴/팝업부터 닫는지 확인
- [ ] 전화·화면 전환 후 게임 상태와 음향 복귀 확인
- [ ] 320px~태블릿 화면에서 잘림·빈 화면·가로 스크롤 확인
- [ ] 저사양 Android 기기에서 투구 애니메이션 프레임 확인
- [ ] 앱 시작, 새 RUN, 이어하기, 12스테이지 완주, 실패 후 재시작 확인

## 5. 테스트 트랙

- [ ] 내부 테스트에 서명 AAB 업로드
- [ ] 최소 2개 실제 Android 기기에서 설치 및 업데이트 테스트
- [ ] Play Console 사전 출시 보고서 확인
- [ ] 개발자 계정 생성일과 계정 유형 확인
- [ ] 2023-11-13 이후 생성된 개인 계정이면 비공개 테스트 12명·14일 연속 유지
- [ ] 비공개 테스터 의견과 수정 내역 기록
- [ ] 프로덕션 액세스 신청 답변 작성
- [ ] 프로덕션 출시 전 관리형 게시 사용 여부 결정

## 6. 제출 근거

Play Console에 복사할 문구와 선언값은 `docs/google-play-submission.md`에 정리합니다.

- 미리보기 자료: https://support.google.com/googleplay/android-developer/answer/9866151
- 데이터 보안: https://support.google.com/googleplay/android-developer/answer/10787469
- 콘텐츠 등급: https://support.google.com/googleplay/android-developer/answer/9859655
- 신규 개인 계정 테스트: https://support.google.com/googleplay/android-developer/answer/14151465
