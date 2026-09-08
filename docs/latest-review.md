# 프로그램·인프라 최신 결정

2026-09-08 / v1.3 / 설계 갱신. 사용자가 `plandosee.app` 구매를 알렸다. 앱 구현·신규 원격 저장소 생성·서버 배포·인프라 결제는 미실행.

서비스 도메인은 `plandosee.app`으로 확정했다. 웹 주소는 `https://plandosee.app`, 공통 API 기본 주소는 `https://plandosee.app/api/v1`로 계획한다. DNS·HTTPS·배포 연결은 미확인이며 도메인 확정을 서비스 공개 완료로 보지 않는다. 실제 결제액·갱신 가격은 확인하지 않았다.

사용자의 후속 지시로 PDF를 삭제하고, 앞으로 Markdown·JSON 설계 문서와 노션을 함께 관리한다. 사용자가 다시 요청하기 전에는 PDF 생성·갱신·검증을 수행하지 않는다.

개발 PC·프로젝트 의존성·배포 계정/서버·Android 준비물은 [준비물 안내](preparation-guide.md)와 [노션 08 문서](https://app.notion.com/p/3d50def9f6268108b778ed9f330b70a6)에 정리했다. Node.js 24.19.0·WSL 버전 응답은 확인했으며 Java·Docker·Android 도구의 실행과 서버 배포는 아직 검증 전이다.

사용자가 웹 Next.js + TypeScript, 앱 Android 네이티브 우선을 결정했다. Android 구현 도구는 Kotlin + Jetpack Compose로 선정했다. 기존 Flutter 제안을 대체하며 iOS는 현재 개발·배포 범위에서 제외한다. Windows·macOS 네이티브는 향후 별도 결정하고 현재는 웹을 제공한다.

| 영역 | 현재 구성 |
|---|---|
| 웹 | Next.js App Router + React + TypeScript, 기본 Turbopack |
| Android | Kotlin + Jetpack Compose + ViewModel + Coroutines/Flow + Repository |
| 공통 API | Spring Boot 4.1.x + Java 21 LTS + Spring JDBC, HTTPS /api/v1 |
| DB | MariaDB 12.3 LTS + InnoDB, Flyway 호환 시험 후 정확한 버전 고정 |
| 운영 | Caddy + Next.js Node.js + Spring Boot + MariaDB, Docker Compose |

Next.js SSR은 초기 조회 화면을 렌더링한다. 편집·DnD·입력 상태는 Client Component가 처리한다. 두 클라이언트는 Spring API를 사용하며 DB 접근·집계·완료 중복 방지·날짜 판정은 서버가 담당한다. 웹 SSR을 위해 Node.js 런타임이 추가된다. [Next.js 렌더링](https://nextjs.org/docs/app/getting-started/server-and-client-components), [기본 빌드 도구](https://nextjs.org/docs/app/api-reference/turbopack), [자체 호스팅](https://nextjs.org/docs/app/guides/self-hosting).

Android UI는 Kotlin·Compose로 따로 구현한다. 서버와 같은 API 계약·시간 단위·오류 규칙을 사용하며 앱 재진입과 저장 뒤 자료를 재조회한다. 전체 JSON은 Storage Access Framework로 저장한다. 웹↔앱 교차 재조회에서 ID·날짜·값·집계를 비교한다. [Compose](https://developer.android.com/compose), [앱 아키텍처](https://developer.android.com/topic/architecture), [파일 저장](https://developer.android.com/training/data-storage/shared/documents-files).

백엔드·DB 설계의 9개 표, 불변 계획 이력, 완료 고유 제약, UTC DATETIME(6)·서울 DATE, 동일 집합 집계·근거 규칙은 유지했다. MariaDB 12.3은 LTS지만 Flyway 공개 지원표에는 10.11까지만 명시되어 실제 조합을 확인한 것은 아니다. 첫 구현 단계에 migration·JDBC 왕복·트랜잭션 시험을 둔다. [MariaDB 유지보수](https://mariadb.org/about/), [Flyway 지원표](https://documentation.red-gate.com/flyway/getting-started-with-flyway/system-requirements/supported-databases-and-versions).

## SSR을 고려한 운영 예산

한국 사용자가 중심인 소규모 텍스트 앱이라는 가정이다. 실제 사용량·성능·메모리는 아직 측정하지 않았다.

| 후보 | 월 서버 + 백업 기본액 | 판단 |
|---|---|---|
| Lightsail 서울 Linux IPv4 2GB | $12 + $1 = $13부터 | SSR·Spring·DB 부하 시험 통과 시 절약안 |
| Lightsail 서울 Linux IPv4 4GB | $24 + $1 = $25부터 | 추가 Node.js 런타임을 고려한 잠정 예산 기준 |
| Hetzner 유럽 CX23 4GB | 기본 €5.49, IPv4·백업 별도 | 공식 페이지 구매 불가 표시로 채택 보류 |

객체 저장소 $1은 5GB 저장·25GB 전송 한도다. 기본액은 서비스 한도 내 가정이며 세금·환율·도메인·초과량은 별도다. 스냅샷은 과금 대상 총 GB당 월 $0.05 추가다. 무료 체험을 정상 운영 비용에서 차감하지 않았다. 가격·구매 불가 표시는 같은 날 앞선 조사에서 확인했다. [AWS 가격](https://aws.amazon.com/lightsail/pricing/), [Hetzner 가격](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/), [상품 표시](https://www.hetzner.com/cloud/cost-optimized/).

4GB가 필요하거나 충분하다고 확정한 것은 아니다. SSR·저장·집계·동시 export에서 Node.js·JVM·DB의 RSS·응답·CPU·디스크를 측정해 크기를 결정한다. 빌드는 CI에서 하고 완성 이미지만 서버에서 실행한다. 일관 DB 덤프를 서버 밖 비공개 저장소에 7일 보관하고 다른 DB에 복구한다. OS·DB 패치·복구는 직접 운영한다.

## 저장소와 완료 범위

PDC_Diary는 명세·증거, PDC_Diary_Backend는 API·DB 계약, PDC_Diary_Web은 Next.js, PDC_Diary_Android는 Kotlin·Compose, PDC_Diary_Infra는 배포를 담당한다. 새 원격 저장소는 아직 생성하지 않았다. 상세는 [저장소 구성](repository-layout.md)에 있다.

웹의 44개 필수 과제 조건은 축소하지 않았다. 원문 조건 파일은 v1.2와 바이트 단위로 같다. 웹 8~10시간 목표와 Android 개발·기기 시험·배포는 별도다. 로그인은 과제 7에서 다루고 현재 공개 안내·무인증 기능은 유지한다. n8n 도입은 확정하지 않았다.

이번 변경은 최신 Next.js·Android 공식 문서로 확인했다. 이전 Context7 조회는 백엔드·DB 설계 근거로 보존하되 Flutter 조회 결과는 대체된 설계의 역사로 표시한다. 이번 Android 결정에 새 Context7 조회를 수행했다고 주장하지 않는다.

