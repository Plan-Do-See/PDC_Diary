# 메뉴 전환과 SSR 원인 분석

2026-09-11 최신: [세 탭 상태 유지·메뉴 스위치](persistent-tabs.md). 기존 UI/SSR 유지, 입력·펼침·조건·스크롤 복원과 필요한 API 갱신. PT20·PC9·NM11·타입/단위21/Windows 빌드 통과. 노션 재조회 확인, 로컬 반영·푸시/운영 배포 미실행. 아래 기록은 당시 상태다.


2026-09-11 사용자 요청: 메뉴가 정적 페이지처럼 전환되는 원인과 SSR 적용 여부 분석. 이번에는 애플리케이션 소스를 수정하지 않았다.

## 확인된 사실

- SSR 적용: 공통 diary/Plan 레이아웃 force-dynamic, async 서버 페이지에서 요청자별 readApi(no-store), Next standalone 서버를 사용한다. 정적 export가 아니다. 최초 HTML과 이후 메뉴 이동의 RSC 응답은 구분해야 한다. SSR은 서버에서 렌더링하는 방식이며 브라우저 탭의 상태 보존을 자동 보장하는 조건이 아니다.
- 현재 실제 로컬 웹에서 합성 계획을 펼친 후 메뉴 Do → Plan을 이동했다. 문서 요청0, RSC 요청2, 같은 문서와 main 유지. 하지만 같은 계획 카드 DOM은 교체됐고 돌아온 카드는 접혀 있었다.
- 같은 왕복에서 task-order 조회17건이 관찰됐다. TaskOrderList는 각 계획에 생성되고 mount/fingerprint 변경 effect에서 순서 스냅샷을 조회한다. 접힌 계획도 컴포넌트가 존재한다. 서버 목록 조회와 별도로 재배치 버전을 얻기 위한 조회다. 전체 DB 쿼리 수나 응답 지연 기여도를17로 해석하지 않는다.
- PlanCollection의 보기 및 DiaryWorkbench의 선택/방문 상태는 페이지 하위 useState에 있다. 공통 WorkspaceFrame에는 화면별 상태를 복원하는 저장소가 없다. 메뉴는 별도 URL로 이동하는 Link이고 prefetch=false라 클릭 전 선조회하지 않는다.

## 결론과 기존 설명 교정

확정: 동적 서버 렌더링과 클라이언트 라우팅은 동작하지만, 메뉴 이동 후 본문 상태가 초기화되고 새 서버 응답과 계획별 추가 조회를 기다리는 구조다. 이것이 앱의 탭처럼 이어지지 않는 느낌을 설명하는 직접 근거다. 사용자 환경의 모든 지연을 한 원인으로 단정하지 않는다.

이전 문서 요청0 검증은 전체 새로고침 제거를 확인한 것이며, 페이지 상태 보존 완료의 증거가 아니다. 이후 loading 경계 제거는 깜빡임만 해결했으며 조회/컴포넌트 생명주기/탭 복원을 바꾸지 않았다. 데이터 최신 조회가 정상이라는 이전 답변은 이 구현 부족을 충분히 설명하지 못했다.

AI 제안(이번 미구현): SSR은 유지하고 계정·공간별 탭 상태와 URL/이력 복원을 설계한다. 화면 상태를 복원하며 최신 서버 조회 결과로 부분 갱신하고 변경 성공/만료 시 관련 자료를 갱신한다. 순서 스냅샷은 실제 펼친/재배치 가능한 계획에 필요한 시점에 조회하도록 범위를 줄인다. 미확정 저장과 인증 만료·공개/개인 전환 때 상태 폐기, 동일 요청 합치기와 오래된 응답 배제 기준을 함께 정해야 한다. no-store를 무작정 해제하거나 SSR을 제거하는 방식으로 해결하지 않는다.

출처: 현재 웹 layout, screens/plans, workspace-navigation/frame, collection-view, diary-workbench, task-order-list, lib/api/server 원문; RULES·웹 AGENTS·navigation-motion; 설치된 Next16.3.4 안내 및 [공식 Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components). 실제 증거는 menu-rendering-analysis.json. 새 실제 기록·서버 저장·빌드·푸시·배포 없음. 로컬 공개 경로만 검사했고 로그인된 개인 경로의 같은 재현은 미실행이다.
