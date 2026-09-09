# Swagger 문서 보기

2026-09-09 보안 점검: 현재 로컬 Caddy 설정의 `/docs/*`는 비밀번호 없이 제공된다. API 실행 버튼 비활성화는 문서 접근 보호를 대신하지 않는다. [문서 전체 경로 보호 설계](../../../PDC_Diary_Security/spring/security-review.md#swagger-비밀번호-설계)를 작성했으며 실제 인증 설정·비밀번호 적용은 하지 않았다. 보호된 운영 문서를 필수 무인증 제출 URL로 사용하지 않는다.

최신 배포 증거: [DB·백엔드·메일 배포 진행](../deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


구상 저장소의 OpenAPI를 공식 Swagger UI 5.32.11로 표시한다. 백엔드·DB 실행 없이 모델과 요청/응답을 볼 수 있다. 문서 뷰어의 API 실행 버튼은 비활성화했으며 실제 연동은 프론트와 같은 origin에서 검증한다.

저장소 루트에서 Node.js와 pnpm으로 실행:

```powershell
pnpm install --frozen-lockfile --ignore-scripts
pnpm docs:check
pnpm docs:serve
```

브라우저에서 `http://127.0.0.1:8787`을 연다. 종료는 Ctrl+C다. 다른 포트는 DOCS_PORT로 지정한다. HTML을 파일로 직접 열지 않는다. 패키지 설치 후 뷰어는 로컬 파일만 읽으며 외부 CDN이나 Swagger의 외부 검증 서버에 문서를 보내지 않는다.

백엔드 정본 변경 후:

```powershell
pnpm docs:sync
pnpm docs:check
# 백엔드 위치가 다르면:
node scripts/sync-api-contract.mjs D:/다른위치/PDC_Diary_Spring
node scripts/check-api-docs.mjs D:/다른위치/PDC_Diary_Spring
```

정본은 `PDC_Diary_Spring/contracts/openapi.yaml`이다. 구상 저장소의 YAML·JSON과 출처 manifest는 동기화 스크립트로 생성한다. 백엔드가 옆에 있으면 실제 소스/경로/본문/필수 헤더까지 검사하고, 없으면 휴대 가능한 문서의 구조·예시·해시만 검사한다. 공개 문서는 [https://plandosee.app/docs/](https://plandosee.app/docs/)에 배포해 확인했다. 현재 로컬 변경의 Git 커밋·원격 push는 아직 하지 않았다.

[프론트 연동 안내](../frontend-integration.md) · [YAML](../../contracts/openapi.yaml) · [JSON](../../contracts/openapi.json) · [출처 manifest](../../contracts/api-publication.json)
