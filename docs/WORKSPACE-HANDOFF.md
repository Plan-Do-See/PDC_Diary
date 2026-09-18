# 다른 컴퓨터에서 작업 재개

기준일: 2026-09-18. 이 문서는 현재 상태의 진입점이며 과거 진행 기록보다 먼저 읽는다.

## 저장소 배치

임의의 작업 폴더 아래에 다음 네 저장소를 형제로 clone한다. 드라이브나 사용자 이름은 달라도 된다.

```sh
git clone https://github.com/Plan-Do-See/PDC_Diary.git
git clone https://github.com/Plan-Do-See/PDC_Diary_Nextjs.git
git clone https://github.com/Plan-Do-See/PDC_Diary_Spring.git
git clone https://github.com/Plan-Do-See/PDC_Diary_Security.git
```

| 저장소 | 정본과 역할 | 재개 안내 |
|---|---|---|
| PDC_Diary | RULE, 사용자 결정, 요구사항, 승인/폐기 기록 | 이 문서 |
| PDC_Diary_Nextjs | 기존 제품 웹, 승인 시안 원본·미리보기 | [HANDOFF](../../PDC_Diary_Nextjs/HANDOFF.md) |
| PDC_Diary_Spring | 기존 API·DB·마이그레이션, canonical OpenAPI, Docker·Caddy·NAS·배포·백업·복구 | [HANDOFF](../../PDC_Diary_Spring/HANDOFF.md) |
| PDC_Diary_Security | 보안 설계·점검 결과·미검증 항목 | [HANDOFF](../../PDC_Diary_Security/HANDOFF.md) |

별도 인프라 저장소는 없다. 이전의 `workspaces/PDC_Diary_Infra`는 commit과 원격이 없던 로컬 준비 폴더였으며, 안전한 배포·운영 자료는 Spring 저장소의 `ops/`로 편입했다. 운영 현황·Compose·Caddy·배포·백업·복구의 정본은 Spring 저장소다.

## 현재 확정 상태

- 기존 Next.js·Spring·MariaDB 제품은 구현·배포되어 있다. 운영은 2026-09-14 NAS 이전 기록이 최신이며 과거 Vultr 운영 문구는 당시 기록이다.
- Spring V1~V4와 기존 API를 보존한다. 새 프론트 때문에 필요한 변경만 증분 적용한다.
- 12개 화면·공통 상태 시안은 사용자 승인 완료다. 새 디자인의 제품 코드 적용과 백엔드 증분 구현은 아직 시작하지 않았다.
- 시안 정본은 프론트 저장소 `design/approved-2026-09-18/source/`, 브라우저 확인본은 같은 폴더의 `preview/`다. `design/approved-2026-09-18/README.md`에서 승인 파일을 찾는다. 과거 대화의 개인 Codex 경로 대신 이 경로를 사용한다.
- 노션 및 노션 동기화 JSON 갱신, 외부 OAuth 실연동은 사용자 지시로 보류 중이다. 운영 배포는 별도 승인 단계다.
- 시안 데이터는 합성 자료다. 실제 사용자 기록 요건·전체 인수 완료를 뜻하지 않는다.

## 작업 전에 읽을 순서

1. 해당 저장소 `AGENTS.md`와 [RULES](../RULES.md).
2. [현재 체크포인트](../../PDC_Diary_Nextjs/docs/redesign/frontend-component-editing-state-2026-09-17.md), [승인 화면 목록](../../PDC_Diary_Nextjs/docs/redesign/frontend-screen-production-plan-2026-09-18.md).
3. [프론트 개편 명세](frontend-redesign-2026-09-17.md), [UI 명세](../../PDC_Diary_Nextjs/docs/redesign/frontend-redesign-ui-spec-2026-09-17.md), 변경할 시안 원문.
4. [백엔드 영향표](../../PDC_Diary_Spring/docs/frontend-backend-impact-2026-09-18.md), [작업 세션 설계](work-session-design-2026-09-17.md), Spring `contracts/openapi.yaml`과 `contracts/pds-schema-v2.json`.
5. [구현 순서](../../PDC_Diary_Nextjs/docs/redesign/frontend-implementation-plan.md). 첫 작업은 기존 계약과 승인 UI의 차이 확정이다.

## 이어서 할 일

선택 입력·작업 세션·반복 일정·통계 비교/스냅샷·계정 설정/저장된 보기·알림/오류의 차이를 정본 계약에 반영한다. 이후 V5 및 기존 Spring 확장, 승인 시안의 Next.js 공통 컴포넌트와 각 화면 구현, 전체 인수 검증 순서로 진행한다. 기존 API·자료 보존과 공개/개인 경계를 유지한다.

메인 전체 원본 안에서 지정 컴포넌트만 수정하고 SUIT, 초록 버튼/흰 전경, 애니메이션, 세 화면 비율·라이트/다크 검사를 유지한다. RULE은 사용자 후속 지시로 변경할 수 있다. 완료한 검증과 미실행 검증을 구별해 체크포인트에 기록한다.

## 환경과 비공개 자료

Node.js 22 이상, npm, Java 21, PowerShell 7(Windows 도우미 사용 시), MariaDB 12.3.3 개발 도구가 필요하다. 실제 설치·실행 방법은 각 저장소 HANDOFF를 따른다. 비밀번호·메일 키·세션·DB·백업·`.env.local`은 Git으로 옮기지 않는다. 개발용 격리 DB는 별도로 만들며 운영 접속 정보는 승인된 별도 전달 수단을 사용한다.

시안은 Node.js만으로 열 수 있고 외부 글꼴·아이콘 CDN에는 인터넷이 필요하다. 새 컴퓨터의 실제 실행과 운영 재검증은 이 인계 작업에서 수행한 것으로 간주하지 않는다.
