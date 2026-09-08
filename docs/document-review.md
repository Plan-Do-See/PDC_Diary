# 이전 PDF 검토 기록

2026-09-08 / v1.3 / 아래는 도메인 확정 전 PDF에 수행한 검토의 이력이다. 사용자 지시에 따라 PDF를 삭제했고 현재 문서는 Markdown·JSON과 노션으로 관리한다. 앱 구현·실제 DB 검증 전이다.

- PDF 20쪽을 Poppler로 렌더링하고 전체 페이지의 표·문자·여백·잘림을 시각 확인했다.
- 원문 44개 조건의 ID·문장과 지정 공개 안내가 PDF에 모두 포함됨을 확인했다.
- 요구사항 파일은 v1.2와 바이트 단위로 동일하다. SHA-256: 31e361e0819bb91682a8d1820d4957392765b15b5f62dae0857859eb669658b2.
- 공식 출처 링크 24개, 페이지 번호·문자 추출·페이지 경계·API 경로 검사를 통과했다.
- MariaDB 9개 표와 원래 데이터 규칙을 유지했다. 계약은 status=design, verified_against_database=false다.
- 웹 Next.js·TypeScript와 Android Kotlin·Jetpack Compose, iOS 보류, 향후 데스크톱 범위를 RULE·PDF·저장소 문서·계약에 반영했다.
- 웹과 Android가 분리된 다섯 저장소 구성을 명시했다. 공통 API·데이터 규칙과 저장소별 배포 버전 기록을 유지한다.
- Next.js SSR 런타임 추가에 따라 4GB를 잠정 예산, 2GB를 부하 시험 통과 후 절약 후보로 표시했다. 실제 용량 적합성을 확인한 것은 아니다.
- 기존 Flutter 언급은 변경 이력과 과거 Context7 출처에만 남겼다. 이번 Next.js·Android 결정은 공식 웹 문서로 확인했다.

앱·공개 URL·서버 DB·Android 빌드·Flyway 호환·부하·사용자 실제 자료는 아직 검증하지 않았다. 신규 원격 저장소 생성·push·서버 배포·인프라 결제도 수행하지 않았다. 사용자는 plandosee.app 구매를 알렸으며, 이 사실과 DNS·HTTPS·배포 연결 검증은 구분한다.

