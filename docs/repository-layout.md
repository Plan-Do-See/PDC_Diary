# 저장소 구성

배포 이해·면접 준비: [로컬 설명서](deployment-interview-guide.md) · [노션 학습 페이지](https://app.notion.com/p/3d50def9f6268114b1b2cf7b997b3ee7?pvs=204)

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.

2026-09-08 / v1.3 / 설계 상태. 현재 구상 저장소는 Plan-Do-See/PDC_Diary이며 로컬 origin과 사용자 지정으로 확인했다. 웹·백엔드·Android·인프라 구현 저장소는 아래 분리 계획으로 관리한다.

| 저장소 | 담당 |
|---|---|
| PDC_Diary | RULE·44개 조건·Markdown/JSON 설계·노션 동기화·증거·제출 링크 |
| PDC_Diary_Spring | Spring Boot·JDBC·MariaDB migration·OpenAPI·DB 계약 정본 |
| PDC_Diary_Web | Next.js App Router·React·TypeScript·SSR·Client Component |
| PDC_Diary_Android | Kotlin·Jetpack Compose·Android 네이티브 기능과 테스트 |
| PDC_Diary_Infra | Caddy·Compose·배포·백업·복구·버전 조합 |

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

PDC_Diary_Web/
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

release.json에는 다섯 저장소 commit, 웹·API 이미지 digest, Android 앱 버전·빌드 checksum, API 계약·DB migration 버전을 기록한다. 기존 앱에 호환되는 변경을 우선하고 깨지는 변경은 /api/v2로 분리한다. DB 백업 → 호환 migration → 웹/API 교체 → 공개 동선 확인 순서로 배포한다. 앱 이미지 롤백과 DB 역변경을 동일하게 취급하지 않는다.

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

**AI 추천 — 사용자 확정 전:** 현재 한 프로젝트에서는 구상 저장소의 `docs/security/`에 공통 보안 설계를 모으고, 실제 수정과 회귀 검사는 Spring·Web·Infra 각 저장소에서 관리하는 방식을 추천한다. 설계 항목마다 관련 코드/PR/검증 증거를 연결하면 코드와 설계가 어긋나는 일을 줄일 수 있다. 보안 수정 규모는 아직 정밀 검토 전이므로 확정하지 않는다. 이 제안으로 새 저장소나 보안 설계 파일을 생성하지 않았다.

접근 권한을 별도로 제한해야 하는 미해결 취약점·재현 상세를 보관하거나 여러 프로젝트의 공통 보안 설계를 독립 관리할 때는 별도 비공개 저장소가 유용하다. 일반 설계에는 비밀값과 개인 기록 원문을 넣지 않는다. 각 코드 저장소의 `SECURITY.md`는 제보 방법·지원 정책의 안내로 사용하고 전체 설계는 연결해 참조할 수 있다. [GitHub 보안 정책 문서](https://docs.github.com/en/code-security/getting-started/adding-a-security-policy-to-your-repository).
