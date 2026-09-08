# Vultr 배포 진행과 검증

배포 이해·면접 준비: [로컬 설명서](deployment-interview-guide.md) · [노션 학습 페이지](https://app.notion.com/p/3d50def9f6268114b1b2cf7b997b3ee7?pvs=204)

2026-09-08 배포 진행: Vultr `158.247.203.145`의 `/opt/pds`에 MariaDB 12.3.3·Spring Boot API·Caddy를 배포했다. V1~V3와 21개 표·131개 열·키 항목 94개·CHECK 26개를 확인했고, 내부 API 15개 점검과 별도 임시 스키마의 21개 표 복원 대조가 통과했다. Brevo STARTTLS 인증·테스트 메일 접수와 Spring 메일 상태 검사가 성공했으며, 사용자가 네이버 받은편지함 도착을 확인했다.

현재 남은 작업: 프론트는 사용자 확인상 미구현이며 기본 주소 /는 준비 중 안내와 HTTP 503을 반환한다. 소셜 외부 설정은 프론트 완성 뒤 진행한다. 외부 암호화 백업 저장소·예약/복구와 전체 과제 인수 검증은 남아 있다. Chicago 45.76.27.48은 사용자가 직접 삭제했다고 확인했다.

## 실제로 배포한 것

- 경로: `/opt/pds`. 실행 컨테이너는 `pds-db-1`, `pds-api-1`, `pds-proxy-1`이다.
- 배포 방식: 빌드 PC에서 Jib 3.5.4로 Java 21 linux/amd64 이미지를 만들고 SHA-256 대조 후 서버에 로드했다. API는 UID/GID 10001, 읽기 전용 파일시스템, 1536MiB 제한이며 DB/API 호스트 포트를 열지 않는다. root·migration·runtime DB 자격을 분리했고 운영 비밀 파일은 root 600/디렉터리 700이다. SMTP 키는 비공개 파일로만 전송했으며 진행 기록에는 포함하지 않는다.
- PostgreSQL 등 다른 DB로 바꾸지 않았으며 사용자 PC의 기존 MariaDB 3919는 건드리지 않았다.
- 웹은 `web` 프로필로 분리했다. 프론트가 없으므로 현재 기본 페이지는 503 응답이며 이를 웹 구현 완료로 보지 않는다.
- Swagger 정적 파일 6개를 서버에 설치했다. `/docs/` 공개 HTTPS 응답과 브라우저 문서 표시를 확인했다. 문서는 42개 경로·59개 작업·38개 모델·43개 예시와 소스 대조 검사를 통과했다.

## 실제 검사와 한계

| 검사 | 확인 결과 |
| --- | --- |
| MariaDB | 12.3.3, V1~V3 성공, 21개 표·131개 열·키 항목 94개·CHECK 26개 |
| API 내부 HTTP | 15개 통과: 상태·공개 조회·개인 401·CSRF 403/400·Secure/HttpOnly/SameSite 쿠키·소셜 비활성 |
| 비밀 파일·컨테이너 | root 파일 600/디렉터리 700, API UID 10001·읽기 전용·1536MiB, DB/API 외부 포트 없음 |
| 외부 HTTP | 일반 도메인 조회로 HTTPS에 연결 성공. HTTP 308 이동 확인 |
| HTTPS | 기본 도메인 A 수정 후 정식 인증서 발급·신뢰 검증 성공. 공개 API·Swagger 200 |
| 메일 | 서버 STARTTLS·로그인·테스트 1통 접수, Spring 메일 상태 UP, 네이버 받은편지함 도착은 사용자 확인 |
| DB 초기 복원 | 동일 서버의 별도 임시 스키마에서 21개 표 행 수·전체 체크섬 일치. 외부 백업 복구는 아님 |

첫 복원 스크립트는 내부 Docker 명령이 표 목록 stdin을 소비해 1개 표만 비교했다. 배열 순회와 전체 개수 검증으로 수정한 뒤 21개 전부를 재검사했다. 1개 표 비교 결과를 전체 복원 통과로 사용하지 않는다. 사용자의 실제 계획·할 일·실행 기록은 생성하지 않았다.

메일 시험은 동일 서버의 Python SMTP 발송과 Spring SMTP 상태 검사다. 가입 확인·비밀번호 재설정 화면을 포함한 전체 이메일 인증 동선은 프론트 준비 후 별도 검증한다.

## 재현과 다음 작업

- 백엔드 Jib 이미지: 빌드 PC에서 `scripts/build.ps1 -Tasks jibBuildTar`. 공개 registry push 없이 tar를 전송하고 manifest digest로 고정했다. Docker 29 서버의 이미지 ID는 Jib의 config ID와 다르므로 실제 inspect 값과 manifest digest를 대조한다.
- 초기 배포: 인프라 `scripts/deploy-initial-backend.sh`. 기존 secret/환경 파일이 있으면 초기화를 거부한다. 이미 배포했으므로 재실행하지 않는다.
- 점검: `scripts/smoke-backend.py`, `scripts/verify-initial-restore.sh`. 복원 덤프는 서버 root 전용 `backups/`에 있으며 Git에 포함하지 않는다.
- SMTP 적용: `scripts/configure-smtp.py`는 사용자가 지정한 테스트 수신자에게 메일을 발송한다. 이번 1회 발송은 완료했으므로 단순 확인용으로 다시 실행하지 않는다.
- DNS A 수정과 정식 인증서 발급 후 `https://plandosee.app/api/v1/meta`, `/docs/`의 공개 HTTPS와 문서 표시를 확인했다.
- 프론트 구현·웹 이미지 배포·소셜 외부 등록, 외부 비공개 Restic 저장소·자동 백업·복구 검증은 남았다.
- 원문 44개와 DB/API 필드 계약은 유지한다. 실제 전체 과제 합격 또는 최종 공개 소스 제출 완료를 주장하지 않는다.

기계 판독 증거: `workspaces/PDC_Diary_Infra/releases/deployment-verification.json`. Git commit은 아직 없으며 배포 이미지는 SHA-256으로 기록했다.

[Jib tar 빌드 공식 안내](https://github.com/GoogleContainerTools/jib/blob/master/jib-gradle-plugin/README.md) · [Compose raw 환경 파일](https://docs.docker.com/reference/compose-file/services/#format)

최종 문서 점검: OpenAPI 42개 경로·59개 작업·38개 모델·43개 예시와 소스 대조를 다시 통과했다. 구상·백엔드·인프라 저장소의 추적 대상 및 Git 제외되지 않은 작업 파일 116개에서 알려진 SMTP 로그인·키의 평문 일치를 찾지 못했다. 이 검사는 전체 Git 이력·이미지·임의 인코딩에 대한 비밀값 점검을 대신하지 않는다. 비밀 파일과 SSH 개인키가 Git 제외 대상임을 확인했다.

Cloudflare의 “Proxying is required…” 배너는 프록시를 통한 보호·캐시 기능 안내다. DNS only도 유효한 DNS 동작이며 해당 배너가 기본 도메인의 A 레코드 누락을 설명하지 않는다. 초기 HTTPS 확인까지 DNS only·TTL Auto와 서버 IP를 유지하는 안을 안내했다. [Cloudflare 프록시 상태](https://developers.cloudflare.com/dns/proxy-status/) · [기본 도메인 @](https://developers.cloudflare.com/dns/concepts/)

공개 검증: 2026-09-08T10:37:45.780Z 실제 도메인·TLS 신뢰 검증을 유지한 외부 검사 29개가 통과했다. 공개 200·개인 401·CSRF 없는 변경 403·유효한 CSRF와 잘못된 입력 400, Secure/HttpOnly/SameSite=Lax 쿠키, HTTP→HTTPS 308, Swagger 6개 파일의 로컬 SHA-256 일치를 확인했다. 브라우저에서도 최신 Swagger 설명과 서비스 정보 항목이 표시됐다. 사용자 기록·추가 메일은 생성하지 않았다. [공개 Swagger](https://plandosee.app/docs/) · [API 상태 정보](https://plandosee.app/api/v1/meta)

추가 증거: `workspaces/PDC_Diary_Infra/releases/public-https-verification.json`. 초기 제한 실행 환경에서는 연결이 거부됐지만 같은 시각 승인된 외부 연결과 브라우저에서 정상 응답했다. 이 도구 환경 실패를 서버 장애로 기록하지 않는다.

## 2026-09-08 프론트 인계 문서 재확인

연동 안내·Swagger README·구상 및 백엔드 README에서 오래된 배포/메일 상태를 수정했다. 과거 로컬 검증 표는 당시 기록으로 구분해 보존했다. OpenAPI 0.2.0의 42개 경로·59개 작업·38개 모델·43개 예시와 소스 대조 검사를 다시 통과했다. 프론트 인계 문서는 준비됐으며 현재 로컬 변경의 Git 커밋·push와 백엔드 첫 커밋은 아직 하지 않았다.

2026-09-08T10:57:56.955Z 공개 연동 안내의 HTTP 200·정상 TLS·로컬/공개 SHA-256 일치를 확인했다. [별도 문서 검증 증거](frontend-handoff-verification.json)를 추가했으며 앞선 29개 외부 점검 증거는 당시 파일 버전의 결과로 보존한다. 최초 문서 확인 도구가 수신 완료 뒤 해제된 소켓의 TLS 속성을 읽다가 실패해 수신 시작 시 TLS 상태를 보존하도록 고쳤다. 같은 주소 재검사로 성공했으며 이를 서버 장애로 판단하지 않는다.

보안 설계는 기존 구상 저장소의 docs/security/에 모으고 실제 수정은 각 구현 저장소에서 관리하는 안을 AI 추천으로 기록했다. 사용자 확정·보안 정밀 검토·별도 저장소 생성은 수행하지 않았다. [저장소 구성과 제안](repository-layout.md). 이번 작업은 문서와 공개 정적 문서만 수정했으며 런타임·DB/API 계약·원문 44개 조건은 변경하지 않았다.
