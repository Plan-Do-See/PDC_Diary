# 저장소 구성

2026-09-09 최신 상태: 공개/개인 웹을 [운영 주소](https://plandosee.app)에 배포했다. 계획/이력·할 일·실행/완료·검색/필터/정렬·돌아보기/근거·다음 계획·전체 JSON·휴지통/복제·이메일 계정·알림 설정을 연결했다. 타입/Windows·Linux 빌드, 단위13·격리 API/DB17·운영 HTTPS16개를 통과했다. 사용자 최신 지시로 소셜 로그인은 명시적으로 다시 요청할 때까지 작업을 보류한다. 실제 사용자 1/5/3·최종 DB 계약·전체 인수는 미완료. 상세: [웹 구현·검증](../../PDC_Diary_Nextjs/docs/full-implementation.md). 아래 이전 단계 기록은 당시 상태다.

문서·AI 문맥 관리: [관리 구조와 RAG 도입안](context-management.md). 기존 저장소별 정본 책임을 유지하고 현재 상태·변경 이력·검색 출처·계약 버전을 구분하는 AI 추천이다. 새 저장소/검색 서버를 만들거나 기존 기록을 재편한 것은 아니다.

2026-09-09 사용자 확정: PDC_Diary_Security에 Spring·Next.js 등 항목별 보안점검과 설계를 기록한다. Spring 소스/설정 대조와 40개 점검표를 작성했고, Caddy의 Swagger 문서 인증 부재와 정적 보안 문제 2건(자원 사용 한도·reset/동시 로그인 경합)을 정리했다. 코드·운영 설정·비밀번호·DB 변경과 새 실행 시험은 하지 않았다. 공개 과제 조건과 API/DB 계약은 유지한다. [보안 문서 정본](../../PDC_Diary_Security/spring/security-review.md).

2026-09-09 현재 구현: 사용자가 랜딩 디자인을 채택하고 불필요한 버튼 동작만 정리해 구현을 시작했다. [공개 계획 생성·수정·이력](../../PDC_Diary_Nextjs/docs/f0-implementation.md)을 격리 MariaDB/Spring으로 연결했고 빌드/타입·단위 9개·브라우저/API/DB 대조를 통과했다. 디자인은 유지하며 실제 할 일·실행·돌아보기·개인 인증·배포와 전체 인수는 남아 있다. [검증 범위](../../PDC_Diary_Nextjs/docs/f0-verification.json)와 노션 10·02·03·06을 함께 갱신했다.

2026-09-09 후속 사용자 요청으로 `PDC_Diary_Nextjs`에 [랜딩 디자인 초안](../../PDC_Diary_Nextjs/docs/landing-design-draft.md)을 제작했다. 아이보리·청록색과 Plan/Do/See→다음 계획 전환은 AI 디자인 제안이다. 프로덕션 빌드·타입·로컬 데스크톱/모바일 조작을 확인했다. 실제 저장·인증·배포와 전체 인수 검증은 미완료이며 [검증 기록](../../PDC_Diary_Nextjs/docs/landing-design-verification.json)을 따른다.

2026-09-09 사용자 요청으로 `PDC_Diary_Nextjs`에 프론트 구현 구상을 작성했다. 서버 정상은 사용자 확인이며 이번에 재점검하지 않았다. 공개 Plan→Do→See→다음 Plan과 개인 화면, 이메일·세 소셜·휴지통·복제·알림을 기존 계약에 연결했다. 화면/폴더/단계/시간은 AI 제안이며 업무 기능은 미구현이다. [Next.js 구상 요약](frontend-implementation-plan.md)과 형제 저장소의 상세 계획·44개 추적·검증 기록을 따른다.

배포 이해·면접 준비: [로컬 설명서](deployment-interview-guide.md) · [노션 학습 페이지](https://app.notion.com/p/3d50def9f6268114b1b2cf7b997b3ee7?pvs=204)

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.

## 현재 GitHub 저장소 · 사용자 확인

2026-09-09 사용자 제공 GitHub 화면 기준으로 현재 원격 저장소는 아래 5개다. 공개 범위는 화면에서 확인했으며 새 시크릿 창의 접근 검사를 이번에 실행한 것은 아니다.

| 저장소 | 공개 범위 | 담당 |
| --- | --- | --- |
| PDC_Diary | Public | 전체 구상·RULE·결정·문서/노션 연결 |
| PDC_Diary_Spring | Public | 백엔드 구현·API/DB 계약·migration·테스트 |
| PDC_Diary_Nextjs | Public | 프런트엔드 구현·SSR·화면·웹 테스트 |
| PDC_Diary_Security | Private | 영역별 보안 분석·점검·보호 설계 |
| PDC_Diary_Optimization | Private | 성능 개선 분석·설계 및 최적화 분석·설계 |

`PDC_Diary_Infra`는 기존 로컬 독립 Git 작업 영역(`workspaces/PDC_Diary_Infra`)으로 유지하며 제공된 GitHub 목록에는 없다. Android 저장소는 향후 분리 계획으로 유지한다. 두 항목을 현재 GitHub 저장소 5개에 포함하지 않는다.

Optimization의 분석·설계 역할은 사용자 확정이다. 실제 최적화 코드·회귀 검사·전후 측정은 변경 대상 구현/인프라 저장소에 연결하고, Optimization에는 측정 조건·근거·개선안·적용 commit·결과를 연결하는 방식을 추천한다. 성능 제안은 채택/적용/측정 상태를 구분하고 기존 기능·보안·과제 조건을 완화하지 않는다.

공개 범위와 출처는 [repository-inventory.json](repository-inventory.json)에 기록한다. Security·Optimization의 비공개 원문은 공개 문서·공개 검색 출력에 복사하지 않는다. 제출용 최종 소스·필수 증거는 기존 무인증 접근 조건을 충족해야 한다.

웹과 Android의 UI·상태 코드는 각각 구현한다. OpenAPI 계약, 서버 데이터, 날짜·시간 단위, 집계·중복 방지 규칙은 공통이다. 초기 API는 /api/v1이며 모든 클라이언트가 같은 Spring Boot API를 호출한다.

## 주요 파일 배치

```text
PDC_Diary_Spring/
  src/main/java/.../plan/ task/ execution/ review/ common/
  src/main/resources/db/migration/
  src/test/                       # 동일 버전 MariaDB 통합 시험
  contracts/openapi.yaml
  contracts/pds-schema-v2.json
  Dockerfile

PDC_Diary_Nextjs/
  src/app/                        # 라우팅·SSR 조회
  src/features/                   # 폼·편집·DnD 등 클라이언트 화면
  src/lib/api/                    # 계약 기반 타입과 API 접근
  tests/                          # 컴포넌트·브라우저 검사
  next.config.ts
  package.json
  tsconfig.json
  Dockerfile                      # Node.js 서버

PDC_Diary_Android/
  app/src/main/java/.../ui/        # Compose·ViewModel
  app/src/main/java/.../data/      # API·Repository
  app/src/main/java/.../export/    # Storage Access Framework
  app/src/test/
  app/src/androidTest/
  app/build.gradle.kts
  gradle/libs.versions.toml

PDC_Diary_Infra/
  compose.yaml
  caddy/Caddyfile
  scripts/deploy/ backup/ restore/
  environments/.env.example
  releases/release.json
  docs/operations.md
```

DB 계약 정본을 PDC_Diary_Spring/contracts/pds-schema-v2.json으로 이관했다. 아직 공개 릴리스가 없으므로 명세 저장소에는 동일 내용의 생성 미러를 유지한다. 공개 릴리스 후 특정 버전 참조로 전환한다. 두 복사본을 따로 수정하지 않는다. 웹의 TypeScript·Android의 Kotlin API 모델은 같은 OpenAPI 버전을 소비한다.

## 웹과 Android의 경계

이번에 공개 과제 공간과 로그인하는 개인 계정 영역을 함께 구현한다. 공개 과제 경로는 기존 무인증 기능을 유지하며 개인 영역의 인증·접근 범위는 공통 Spring API가 검사한다. SSR·브라우저·Android 호출에서 같은 경계를 적용한다. 이메일 가입·카카오·네이버·구글 로그인, 현재 본인만 접근·향후 공동 편집 확장 고려를 DB/API 계약에 구체화한다. [백엔드 구성 결정](backend-decisions.md)의 AUTH-01~07을 검증에 추가하며 기존 8~10시간 공개 과제 일정에 개인 영역 추가 작업을 포함했다고 보지 않는다. 개인 공간·멤버 관계와 웹 JDBC 세션은 사용자가 채택했다. PDC_Diary_Spring에서 물리 migration과 API 구현·검증을 진행한다.

Next.js는 기본 Turbopack을 사용한다. Vite를 별도 결합하지 않는다. SSR은 초기 화면을 위해 내부 Spring API를 조회하고, 브라우저의 쓰기는 같은 출처 /api/v1 API로 보낸다. 업무 데이터 조회는 no-store로 처리하고 커밋 뒤 목록·집계·근거를 함께 갱신한다. Next.js가 MariaDB를 직접 조회하거나 업무 규칙을 복제하지 않는다.

Android는 Kotlin·Jetpack Compose를 사용한다. ViewModel·Coroutines/Flow·Repository로 UI와 데이터 접근을 분리한다. 재진입·저장 완료 후 서버를 재조회하며, 앱 로컬 저장소를 원본 DB로 삼지 않는다. JSON 내보내기는 서버 파일을 받아 Storage Access Framework로 사용자가 선택한 위치에 저장한다.

웹 저장 후 Android 재조회, Android 저장 후 웹 새로고침으로 ID·날짜·값·단위·집계가 같은지 확인한다. 요청 키·cycle·409 충돌 처리와 공개 안내는 양쪽에 동일하게 적용한다. 원문 44개 과제 조건과 전체 기능을 웹에서 우선 검증하고 Android에서도 같은 기능을 검증한다.

iOS는 현재 개발·배포 대상에서 제외한다. Windows·macOS에서는 우선 웹을 사용하며 네이티브 앱은 향후 별도 결정한다. Android 구현·기기 검사·배포는 웹 과제 8~10시간 예상과 별도다. n8n은 후속 자동화 대상으로 검토하고 인증 메일은 외부 SMTP로 처리한다.

## 배포·호환·검증

Caddy의 /api/v1은 Spring Boot로, 다른 웹 요청은 Next.js Node.js 서버로 전달한다. DB와 내부 서비스 포트는 외부에 공개하지 않는다. Next.js SSR 런타임이 추가되므로 Node.js·JVM·DB 메모리를 함께 검증한다. Android는 설치형 클라이언트이므로 별도 API 서버를 만들지 않는다.

서비스 도메인은 사용자가 구매한 plandosee.app으로 확정했다. 웹은 https://plandosee.app, 웹·Android 공통 API는 https://plandosee.app/api/v1을 사용하도록 계획한다. DNS·HTTPS·백엔드·Swagger 연결은 확인했으며 프론트는 미구현이다.

백엔드 CI는 JUnit·MariaDB 통합 검사·이미지 빌드를, 웹 CI는 lint·타입·컴포넌트·브라우저 검사·next build를, Android CI는 lint·단위·Compose UI 검사·앱 빌드를, 인프라 CI는 설정 검사를 담당한다. 운영 서버에서 빌드하지 않는다. 첫 배포는 로컬 Jib 이미지 tar와 SHA-256 전송 검증을 사용했으며 CI/registry push는 후속 준비다. 서명키·비밀번호는 공개 Git·브라우저·APK·이미지에 넣지 않는다.

release.json에는 해당 배포에 참여한 명세·구현·인프라 저장소 commit, 웹·API 이미지 digest, Android 배포 시 앱 버전·빌드 checksum, API 계약·DB migration 버전을 기록한다. Security·Optimization의 분석 근거는 적용한 결정/commit으로 연결한다. 기존 앱에 호환되는 변경을 우선하고 깨지는 변경은 /api/v2로 분리한다. DB 백업 → 호환 migration → 웹/API 교체 → 공개 동선 확인 순서로 배포한다. 앱 이미지 롤백과 DB 역변경을 동일하게 취급하지 않는다.

필수 RULE은 각 저장소 AGENTS.md에서 명세 버전을 고정해 참조한다. 제출한 모든 소스 URL은 새 시크릿 창에서 접근을 확인한다. 백엔드·DB·HTTPS·Swagger는 배포했으며 원격 저장소 생성·push·최종 배포 commit 연결은 남아 있다.

근거: [Next.js 렌더링](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Next.js 자체 호스팅](https://nextjs.org/docs/app/guides/self-hosting), [Jetpack Compose](https://developer.android.com/compose), [Android 아키텍처](https://developer.android.com/topic/architecture), [파일 저장](https://developer.android.com/training/data-storage/shared/documents-files).


## 실제 로컬 구성

인프라 저장소의 `access/`가 다중 PC·Mac SSH 도구의 정본이다. 구상 저장소 `docs/downloads/pds-access-kit.zip`은 `scripts/build-access-kit.ps1`로 정본의 허용된 파일 5개만 묶는 전달용 산출물이며 키·비밀값은 포함하지 않는다. [다른 PC 접속 안내](remote-access.md).

백엔드 `D:/workspace/PDC_Diary_Spring`에 코드·migration·OpenAPI·관측 DB 계약과 14개 로컬 시험을 작성했다. 인프라는 `D:/workspace/PDC_Diary/workspaces/PDC_Diary_Infra`의 독립 Git 저장소이며 명세 저장소에서 ignore한다. 공개 원격 릴리스와 웹/Android 저장소 구현·최종 다섯 commit 연결은 남아 있다. [실제 검증](backend-verification.md).

## 무료 호스팅·메일 준비·프론트 API 후속 지시

2026-09-08 최신 결정: 사용자가 최종 클라우드 제공자로 Vultr를 선택했다. 사용자는 작은 클라우드 서버로 줄일 필요가 없고 한 달 안에 이전할 것으로 예상한다고 밝혔다. WTR Pro로의 이전을 목표로 서울(icn) Shared CPU AMD High Performance 8vCPU·RAM 16GB·350GB 한 대를 체험용으로 추천하며 공식 카탈로그의 서버 요금은 월 US$96이다. US$250·최대 30일 프로모션의 실제 적용/만료는 확인 전이다. 새 한국 서버의 DB·백엔드·Caddy 배포와 SMTP 시험을 확인했다. 공개 HTTPS·API·Swagger는 확인했고 프론트는 미구현이다. Brevo 도메인 Authenticated는 사용자 진술로 확인했다. 발신자 PlanDoSee <no-reply@plandosee.app>의 서버 SMTP 시험을 통과했고, 사용자가 네이버 받은편지함 도착을 확인했다. 소셜 제공자 앱 등록·키·콜백·검수는 프론트 완성 뒤 한 번에 진행한다. 클라우드부터 운영하고 WTR Pro로 후속 이전하는 방침을 유지한다. 구상 저장소의 OpenAPI 0.2.0·Swagger UI·프론트 안내는 42개 경로·59개 작업·38개 모델·예시 43개와 소스 대조/브라우저 검사를 통과했다.

[사용자 준비물 한 번에 보기](user-preparation.md) · [프론트 연동 안내](frontend-integration.md) · [Swagger 실행](swagger/README.md) · [무료 호스팅 비교](cloud-options.md)

## 2026-09-08 프론트 인계 문서 확인과 보안 문서 배치 제안

프론트 개발 착수에 필요한 OpenAPI·쿠키/CSRF·SSR·식별자·충돌 처리·오류·소셜 후속 시점은 [연동 안내](frontend-integration.md)에 모았다. 백엔드 README의 웹 연결 계약과 구상 저장소의 API/설계 문서를 연결했다. 소스 대조 검사 결과는 OpenAPI 0.2.0, 42개 경로·59개 작업·38개 모델·예시 43개 통과다. 배포 전이라는 오래된 문구를 현재 확인 결과에 맞췄다. 이 점검은 프론트 구현이나 보안 정밀 검토를 수행했다는 뜻이 아니다.

현재 구상 저장소 변경은 미커밋·미push이며, 백엔드 저장소에는 아직 첫 커밋이 없다. 따라서 로컬 문서 준비·공개 Swagger 배포와 GitHub 소스 공개 완료를 구분한다.

**2026-09-08 과거 AI 추천 — 2026-09-09 사용자 결정으로 대체:** 당시에는 구상 저장소의 `docs/security/`를 추천했다. 현재 정본은 사용자가 지정한 `PDC_Diary_Security`이며 Spring·Next.js 등 항목별로 기록한다. 실제 수정과 회귀 검사는 각 구현 저장소에 두고 보안 설계에서 연결한다. 구체적 보호 방식은 이번 정적 점검 결과의 AI 추천이며 아직 적용하지 않았다.

접근 권한을 별도로 제한해야 하는 미해결 취약점·재현 상세를 보관하거나 여러 프로젝트의 공통 보안 설계를 독립 관리할 때는 별도 비공개 저장소가 유용하다. 일반 설계에는 비밀값과 개인 기록 원문을 넣지 않는다. 각 코드 저장소의 `SECURITY.md`는 제보 방법·지원 정책의 안내로 사용하고 전체 설계는 연결해 참조할 수 있다. [GitHub 보안 정책 문서](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository).
