# 프론트엔드 ↔ 백엔드 연동 안내

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


2026-09-08 / OpenAPI 0.2.0 / DB 계약 2.1. 현재 백엔드 작업 트리와 대조한 문서다. DB·API·Caddy와 공개 HTTPS·Swagger는 배포·확인했으며 프론트 구현과 전체 인수 검증은 남아 있다.

## 먼저 볼 파일

| 파일 | 용도 |
| --- | --- |
| [OpenAPI YAML](../contracts/openapi.yaml) / [JSON](../contracts/openapi.json) | 요청·응답·필드·예시·오류·보안. JSON 형태의 YAML 1.2이며 내용은 동일 |
| [Swagger 실행 안내](swagger/README.md) | 엔드포인트와 모델을 펼쳐 보는 로컬 문서 화면 |
| [문서 출처](../contracts/api-publication.json) | 백엔드 원문 SHA256·소스 파일 해시·동기화 시각 |
| [DB 계약](../contracts/pds-schema-v2.json) | 관계·제약·시간대·집계 규칙 |
| [RULE](../RULES.md) / [요구사항](requirements.json) | 원문 44개와 번호 없는 필수 인수 조건 |

42개 경로·59개 HTTP 작업을 공개·개인·이메일·계정·소셜·운영으로 구분했다. 소셜 경로와 health는 Spring Security/Actuator가 처리하며 일반 Controller와 구분한다. 공개 API·HTTPS·Swagger와 Brevo SMTP 시험 메일의 받은편지함 도착을 확인했다. 프론트 화면·외부 OAuth·가입/재설정/알림 전체 동선은 아직 검증 전이다.

## 주소와 접근 범위

- 운영 API: `https://plandosee.app/api/v1/...`. [공개 Swagger](https://plandosee.app/docs/)와 [배포된 연동 안내](https://plandosee.app/docs/frontend-integration.md)를 확인할 수 있다. 프론트 미구현으로 사이트 루트(`/`)의 503은 현재 의도한 준비 화면 응답이다.
- 로컬 API: `http://localhost:8080`. HTTP 개발 시에만 `COOKIE_SECURE=false`로 실행한다.
- 공개 `/api/v1/public/...`: 로그인 없이 읽기·쓰기 가능. 첫 화면에 meta의 공개 안내 문구를 그대로 표시한다.
- 개인 `/api/v1/me/...`: 로그인한 소유자만 허용. 비로그인 401, 다른 공간의 리소스 ID는 404다. 요청에 user_id/workspace_id를 넣어 범위를 고르지 않는다.
- 백엔드에 CORS 허용 설정은 없다. Next.js와 API를 같은 origin 아래 reverse proxy/rewrite로 연결한다. 포트가 다른 브라우저 요청을 단순히 `credentials: include`로 보내도 CORS가 해결되는 것은 아니다.
- Next.js SSR에서 개인 조회 시 들어온 Cookie를 서버 API 요청에 전달하고 `cache: 'no-store'`를 사용한다. 개인 응답을 공유 캐시에 저장하지 않는다. 프록시/Route Handler로 로그인할 경우 백엔드 `Set-Cookie`가 브라우저까지 전달되어야 한다.

## 쿠키·CSRF·이메일 화면

쿠키는 `PDS_SESSION`, HttpOnly·Secure·SameSite=Lax, 세션 유휴 시간은 30분이다. 브라우저 JS가 쿠키를 읽거나 localStorage에 로그인 토큰을 저장하지 않는다. 최초 공개 변경 요청에도 익명 세션의 CSRF가 필요하다.

1. `GET /api/v1/auth/csrf` → `{header: 'X-CSRF-TOKEN', token: '...'}`. 이때의 쿠키를 보존한다.
2. 모든 POST/PUT/DELETE에 같은 세션 쿠키와 반환된 헤더/토큰을 보낸다.
3. 로그인 성공 후 세션 ID와 CSRF가 바뀌므로 토큰을 다시 조회한다. 로그아웃·세션 만료 후에도 다시 조회한다.

동일 origin 브라우저 코드의 최소 예시:

```ts
type Csrf = { header: string; token: string };
let csrf: Csrf | undefined;

export async function loadCsrf(): Promise<Csrf> {
  const response = await fetch('/api/v1/auth/csrf', {
    credentials: 'same-origin', cache: 'no-store',
  });
  if (!response.ok) throw new Error(`CSRF ${response.status}`);
  return (csrf = await response.json());
}

export async function mutate<T>(path: string, method: string, body?: unknown, key?: string): Promise<T | undefined> {
  const token = csrf ?? await loadCsrf();
  const response = await fetch(path, {
    method, credentials: 'same-origin', cache: 'no-store',
    headers: {
      'Content-Type': 'application/json', [token.header]: token.token,
      ...(key ? { 'Idempotency-Key': key } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    // 상태와 코드를 화면의 오류/충돌 처리에 전달. 자동 재실행하지 않음.
    throw Object.assign(new Error(problem.error ?? `HTTP_${response.status}`), { status: response.status });
  }
  if (path.endsWith('/auth/login') || path.endsWith('/auth/logout')) csrf = undefined;
  return response.status === 204 ? undefined : response.json();
}
```

가입은 email/password/display_name, 로그인은 email/password를 보낸다. 비밀번호는 JS 문자열 길이 12 이상, UTF-8 72바이트 이하이다. 가입·메일 재발송의 202는 접수이며 메일 도착/가입 여부를 증명하지 않는다. 이메일 확인 전 로그인은 실패한다.

| 프론트 화면 | 역할 |
| --- | --- |
| `/account/login` | 이메일 로그인. 성공 후 CSRF 재발급·account 재조회 |
| `/account/verify#token=...` | fragment의 token을 읽어 `/api/v1/auth/verify`에 POST. 30분·일회성 |
| `/account/reset#token=...` | token·새 password를 `/api/v1/auth/reset-password`에 POST. 15분·일회성 |
| `/account` | 내 기록과 계정 화면. `/api/v1/me/account` 사용 |

토큰은 URL query가 아닌 fragment로 전달된다. 읽은 뒤 `history.replaceState`로 주소에서 지우고 분석/로그/오류 보고에 담지 않는다. 비밀번호 재설정은 기존 DB 세션을 모두 무효화한다. 이메일 주소·verified 플래그를 현재 account 응답이 제공한다고 가정하지 않는다. `providers`는 `[{provider:'email'}]` 형식이다.

## 계획·할 일·완료 흐름

계획 목록/생성/수정 응답은 `plan_revisions` 행이다. **응답의 `id`는 버전 행 ID, `plan_id`가 고정 계획 ID**다. 수정은 전체 계획 필드와 최신 `expected_revision`을 전송한다. 계획 단건 GET은 없으므로 목록 또는 revision 목록에서 찾는다.

할 일 목록/수정 응답은 `Task`, 상세는 `TaskDetail`이다. 생성에는 plan_id/title/due_date/priority/estimated_minutes/tags가 필요하다. 수정 PUT은 전체 필드와 최신 row_version을 `expected_version`으로 전달한다. 삭제 DELETE에도 `{expected_version}` 본문을 넣는다. `trash=true` 목록은 삭제 자료만 반환하고 restore로 되살린다.

완료/되돌리기/실행/틀 복제/이월은 `Idempotency-Key`가 필수다. 클릭 의도마다 `crypto.randomUUID()`를 만들고 통신 실패 재시도에는 같은 본문과 키를 유지한다. 성공한 요청의 같은 키를 다른 행동에 재사용하지 않는다. 완료에는 현재 `cycle`을 보내며, 되돌리기가 성공하면 cycle이 증가한다.

완료 응답은 **할 일 전체가 아닌 완료 사건**이다. 완료 후 할 일과 집계를 다시 조회한다. 완료를 취소한 후 과거 완료 요청을 재시도하면 과거 사건 응답이 반환될 수 있으므로 응답만으로 현재 상태를 done으로 덮어쓰지 않는다. 버튼 비활성화만으로 중복 방지를 구현하지 않는다.

실행은 started_at/ended_at에 UTC `Z`·분 정밀도를 사용한다. 서울 오전 10시는 `01:00:00Z`다. `actual_minutes`는 서버 계산이므로 보내지 않는다. 같은 할 일의 시간이 겹치면 409를 표시하고 사용자가 확인한 뒤 confirm_overlap=true로 보낸다. 성공 기록의 본문을 바꾸는 재시도는 새 키를 사용한다.

## 검색·집계·내보내기

검색 q는 제목·설명·태그 부분 검색이다. `%`, `_`는 문자 그대로다. plan_id/status/priority/due_from/due_to/overdue/blocked/trash/sort와 반복 `tag=공부&tag=운동`을 지원한다. 서로 다른 필터는 AND, tag들은 OR다. 페이지네이션은 현재 없다. 태그는 NFC·앞뒤 공백 제거·소문자화 후 중복 제거한다.

| sort | 서버 정렬·동률 처리 |
| --- | --- |
| due (기본) | 마감일↑ → 우선순위↑ → 생성 시각↑ → ID↑ |
| priority | 우선순위↑ → 마감일↑ → 생성 시각↑ → ID↑ |
| estimate | 예상 분↓ → 마감일↑ → 생성 시각↑ → ID↑ |
| newest | 생성 시각↓ → ID↑ |

`GET /review?from=2026-09-08&to=2026-09-14&plan_id=...`는 현재 계획 기간이 조회 기간과 겹치는 계획의 미삭제 할 일을 대상으로 한다. 계획 ID는 선택이며 대상 할 일의 **전체 실행**을 합한다. 화면에 `계획 기간 기준 · 현재 상태 · 대상 할 일의 전체 실행`을 표시한다.

- planned: 대상 할 일 수. 계획 문서 수가 아니다.
- completed: 현재 done. delayed: 미완료이며 마감이 서울 오늘 이전. 오늘 마감은 지연 아님.
- blocked: 공백 아닌 막힌 이유가 있는 고유 할 일 수. 완료와 겹칠 수 있다.
- 차이: 실제 분 - 예상 분. 각 숫자는 같은 응답의 evidence 자료로 연결한다. 다른 시각의 요청으로 근거만 바꾸지 않는다.

review.evidence와 export.tasks는 DB 원천 행이므로 tags 속성이 없다. 상세/할 일 목록은 tags를 포함한다. export는 별도 task_tags 배열을 제공한다. 회고 POST 후 carry-forwards POST가 다음 계획과 출처 연결을 만들며 target_plan_id를 반환한다. 틀 복제에는 원본 미삭제 할 일 ID별 새 마감일을 빠짐없이 보낸다.

`/export`는 JSON 단일 파일이다. from/to/plan_id는 export.review에만 적용되고, 다른 원천 배열은 해당 공간 전체다. 삭제 표시와 모든 이력을 포함한다. Blob으로 다운로드하며 계정·세션·토큰 자료를 프론트가 덧붙이지 않는다.

## 오류 처리

| 상태/코드 | 프론트 대응 |
| --- | --- |
| 400 INVALID_* / 필드 코드 | 입력 표시. `INVALID_TOKEN`은 만료·재사용·잘못된 값 포함, 메일 재신청 안내 |
| 401 | 세션 만료/비로그인 또는 로그인 실패. 개인 캐시 비우기·로그인 안내 |
| 403 ACCESS_DENIED | 같은 세션의 CSRF·로그인 상태 확인. 임의 자동 변경 재시도 금지 |
| 404 NOT_FOUND | 해당 공간에서 자료를 찾을 수 없음. 타인 자료 여부를 추측해 노출하지 않음 |
| 409 VERSION_CONFLICT / REVISION_CONFLICT / CYCLE_CONFLICT | 최신 자료 재조회, 사용자가 변경 의도를 확인 |
| 409 IDEMPOTENCY_CONFLICT | 키·본문 재사용 오류. 네트워크 재시도인지 새로운 행동인지 구분 |
| 409 OVERLAP_CONFIRMATION_REQUIRED | 기존 실행을 보여 주고 중복 시간 저장 의사 확인 |
| 409 기타 | NOT_COMPLETED / DELETION_STATE_CONFLICT / CONFLICT 등 현재 상태 재조회 |
| 429 RATE_LIMITED | 재시도 제한 표시. 현재 Retry-After 헤더는 없음 |
| 5xx·네트워크·비JSON 오류 | 실패와 재시도 UI. 빈 목록/0 집계로 성공처럼 표시하지 않음 |

정상 업무 오류는 `{error:'CODE'}`다. Spring의 잘못된 라우팅/헤더/파라미터 오류나 프록시 오류도 있을 수 있으므로 모든 실패 본문이 같은 모양이라고 가정하지 않는다. text는 문자열로 렌더링하고 HTML로 삽입하지 않는다. 스크립트 문자열 원문 보존·무실행은 프론트에서 별도 검증해야 한다.

## 소셜·알림과 남은 검증

사용자 지시로 **소셜 제공자 앱 등록·키·콜백·공개 검수는 프론트 완성 뒤 한 번에 진행**한다. 현재 `/auth/providers`의 false는 정상 준비 상태다. 활성화 후 로그인은 `/oauth2/authorization/{provider}`로 최상위 이동한다. 계정 연결은 로그인 상태에서 `/me/link/{provider}` POST 후 반환 URL로 이동한다. 로그인과 계정 연결을 섞지 않는다.

알림 GET/PUT은 개인 전용이다. enabled/reflection_enabled/local_time/days_before를 모두 전달한다. enabled=true에는 이메일 검증이 필요하며 `VERIFIED_EMAIL_REQUIRED`를 처리한다. 일반 SMTP 시험 메일의 수신은 확인했다. 이 알림 기능의 실제 발송·스케줄러 실운영은 아직 검증 전이다.

실제 프론트에서 익명 전체 동선, 개인 A/B 접근 분리, HTTP 세션/CSRF, 중복 완료, 시간대, JSON 다운로드, XSS 무실행, 가입/재설정/알림 동선의 메일 수신, 소셜 외부 콜백, 배포 성능을 확인한다. Swagger 구조 검사와 기존 14개 백엔드 검사를 이 검증의 대체로 세지 않는다.
