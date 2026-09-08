# 저장소 구성
2026-09-08 / v1.3 / 설계 상태. 현재 구상 저장소는 Plan-Do-See/PDC_Diary이며 로컬 origin과 사용자 지정으로 확인했다. 웹·백엔드·Android·인프라 구현 저장소는 아래 분리 계획으로 관리한다.

| 저장소 | 담당 |
|---|---|
| PDC_Diary | RULE·44개 조건·Markdown/JSON 설계·노션 동기화·증거·제출 링크 |
| PDC_Diary_Backend | Spring Boot·JDBC·MariaDB migration·OpenAPI·DB 계약 정본 |
| PDC_Diary_Web | Next.js App Router·React·TypeScript·SSR·Client Component |
| PDC_Diary_Android | Kotlin·Jetpack Compose·Android 네이티브 기능과 테스트 |
| PDC_Diary_Infra | Caddy·Compose·배포·백업·복구·버전 조합 |

웹과 Android의 UI·상태 코드는 각각 구현한다. OpenAPI 계약, 서버 데이터, 날짜·시간 단위, 집계·중복 방지 규칙은 공통이다. 초기 API는 /api/v1이며 모든 클라이언트가 같은 Spring Boot API를 호출한다.

## 주요 파일 배치

```text
PDC_Diary_Backend/
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

현재 명세 저장소의 DB 계약은 백엔드 구현 시작 시 백엔드 contracts/pds-schema-v2.json으로 이관한다. 이후 명세 저장소는 특정 백엔드 릴리스 링크를 유지한다. 동일 계약을 여러 저장소에서 따로 수정하지 않는다. 웹의 TypeScript·Android의 Kotlin API 모델은 같은 OpenAPI 버전을 소비한다.

## 웹과 Android의 경계

Next.js는 기본 Turbopack을 사용한다. Vite를 별도 결합하지 않는다. SSR은 초기 화면을 위해 내부 Spring API를 조회하고, 브라우저의 쓰기는 같은 출처 /api/v1 API로 보낸다. 업무 데이터 조회는 no-store로 처리하고 커밋 뒤 목록·집계·근거를 함께 갱신한다. Next.js가 MariaDB를 직접 조회하거나 업무 규칙을 복제하지 않는다.

Android는 Kotlin·Jetpack Compose를 사용한다. ViewModel·Coroutines/Flow·Repository로 UI와 데이터 접근을 분리한다. 재진입·저장 완료 후 서버를 재조회하며, 앱 로컬 저장소를 원본 DB로 삼지 않는다. JSON 내보내기는 서버 파일을 받아 Storage Access Framework로 사용자가 선택한 위치에 저장한다.

웹 저장 후 Android 재조회, Android 저장 후 웹 새로고침으로 ID·날짜·값·단위·집계가 같은지 확인한다. 요청 키·cycle·409 충돌 처리와 공개 안내는 양쪽에 동일하게 적용한다. 원문 44개 과제 조건과 전체 기능을 웹에서 우선 검증하고 Android에서도 같은 기능을 검증한다.

iOS는 현재 개발·배포 대상에서 제외한다. Windows·macOS에서는 우선 웹을 사용하며 네이티브 앱은 향후 별도 결정한다. Android 구현·기기 검사·배포는 웹 과제 8~10시간 예상과 별도다. n8n은 확정 구성에 추가하지 않았다.

## 배포·호환·검증

Caddy의 /api/v1은 Spring Boot로, 다른 웹 요청은 Next.js Node.js 서버로 전달한다. DB와 내부 서비스 포트는 외부에 공개하지 않는다. Next.js SSR 런타임이 추가되므로 Node.js·JVM·DB 메모리를 함께 검증한다. Android는 설치형 클라이언트이므로 별도 API 서버를 만들지 않는다.

서비스 도메인은 사용자가 구매한 plandosee.app으로 확정했다. 웹은 https://plandosee.app, 웹·Android 공통 API는 https://plandosee.app/api/v1을 사용하도록 계획한다. DNS·HTTPS·배포 연결은 미확인이며 이번 작업에서 변경하지 않았다.

백엔드 CI는 JUnit·MariaDB 통합 검사·이미지 빌드를, 웹 CI는 lint·타입·컴포넌트·브라우저 검사·next build를, Android CI는 lint·단위·Compose UI 검사·앱 빌드를, 인프라 CI는 설정 검사를 담당한다. 운영 서버에서 빌드하지 않는다. 서명키·비밀번호는 공개 Git·브라우저·APK·이미지에 넣지 않는다.

release.json에는 다섯 저장소 commit, 웹·API 이미지 digest, Android 앱 버전·빌드 checksum, API 계약·DB migration 버전을 기록한다. 기존 앱에 호환되는 변경을 우선하고 깨지는 변경은 /api/v2로 분리한다. DB 백업 → 호환 migration → 웹/API 교체 → 공개 동선 확인 순서로 배포한다. 앱 이미지 롤백과 DB 역변경을 동일하게 취급하지 않는다.

필수 RULE은 각 저장소 AGENTS.md에서 명세 버전을 고정해 참조한다. 제출한 모든 소스 URL은 새 시크릿 창에서 접근을 확인한다. 이번 문서 작업에서는 원격 저장소 생성·push·배포를 실행하지 않았다.

근거: [Next.js 렌더링](https://nextjs.org/docs/app/getting-started/server-and-client-components), [Next.js 자체 호스팅](https://nextjs.org/docs/app/guides/self-hosting), [Jetpack Compose](https://developer.android.com/compose), [Android 아키텍처](https://developer.android.com/topic/architecture), [파일 저장](https://developer.android.com/training/data-storage/shared/documents-files).

