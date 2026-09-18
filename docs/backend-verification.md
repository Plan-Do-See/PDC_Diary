# 백엔드 구현·검증 기록

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


2026-09-08 / **아래 시험표는 배포 이전 로컬 검증 당시의 기록이다.** 이후 DB·API·HTTPS·Swagger 배포와 SMTP 시험 수신을 확인했다. 현재 상태는 [배포 검증 기록](deployment-status.md)을 따른다. 전체 과제 완료를 뜻하지 않는다.

## 결정과 구현 위치

사용자는 공개 과제 공간과 개인 계정 영역, 이메일·카카오·네이버·구글, 현재 개인 전용·향후 공동 편집 확장, 모든 추천 기능을 채택했다. 초기 운영은 클라우드이며 WTR Pro(5825U·32GB·6TB×2·2TB×1)는 후속 이전 대상이다. 메일은 Brevo SMTP를 사용한다. 이후 사용자가 도메인 Authenticated 상태를 확인했고 서버 SMTP 시험 메일의 네이버 받은편지함 도착을 확인했다. n8n은 후속 자동화로 검토한다.

- API 정본: `D:/workspace/PDC_Diary_Spring`, 기존 origin `https://github.com/Plan-Do-See/PDC_Diary_Spring.git`. 현재 백엔드 배포는 확인했으며 commit·push·공개 릴리스는 아직 하지 않았다.
- 당시 배포 준비 자료는 commit·원격이 없는 로컬 폴더에 작성됐다. 2026-09-18 사용자 교정에 따라 별도 Infra 저장소로 취급하지 않으며, 안전한 자료는 `PDC_Diary_Spring/ops`에 편입했다.
- 계약: 백엔드 `contracts/openapi.yaml`, `contracts/pds-schema-v2.json`, 실제 관측 `contracts/mariadb-12.3.3-observed.json`. 명세 DB 계약은 정본과 동일한 생성 미러다. 공개 릴리스가 생기면 특정 버전 참조로 전환한다.

## 직접 확인한 결과 — 배포 이전 로컬 시험

| 검사 | 실제 결과 | 한계 |
| --- | --- | --- |
| 개발 DB 3919 | 127.0.0.1:3919 초기 프로토콜 응답은 12.3.3-MariaDB | 로그인·데이터 조회·migration·수정은 하지 않음 |
| Java·빌드 | Java 21.0.12.1, Spring Boot 4.1.1, Gradle 9.7.1; test·bootJar 성공 | Linux 컨테이너 이미지 빌드·실행은 미실행 |
| 통합 시험 | BackendIntegrationTests 12개, 실패/오류 0 | 격리된 MariaDB 12.3.3·MockMvc; 실제 브라우저/외부 OAuth는 아님 |
| 집계 경계 | ReviewBoundaryTests 2개, 실패/오류 0 | 빈 집합·서울 자정·오늘 마감·완료 지연 제외·공백 이유·고유 막힘 수 |
| DB migration | Flyway V1~V3 성공; 21개 표·131개 열·키·CHECK 관측 | 21개 중 1개는 Flyway 이력 표. Windows 표 이름 대소문자 접힘은 Linux와 별도 검증 필요 |
| 덤프→복원 | 2026-09-08T06:55:04.3839488Z, 새 격리 DB에 복원; 21개 표 행 수·CHECKSUM TABLE EXTENDED 전체 행 체크섬 모두 일치 | 외부 Restic 저장소·WTR 복구/가용성은 미검증 |
| Compose | v5.5.1 `config --no-interpolate --no-env-resolution --no-path-resolution --quiet` 성공 | 구조 검사. 실제 secret·이미지·DNS·컨테이너 실행 검증은 아님 |
| 인프라 스크립트 | Git Bash의 `bash -n` 5개 스크립트 통과 | Linux 실배포·Restic·DB 계정 프로비저닝은 미실행 |
| 계약 | 9개 도메인 표의 열이 관측 DB와 일치, OpenAPI 26개 경로의 내부 참조 검사 통과 | 전체 OpenAPI 의미 검증/클라이언트 생성·UI 연동은 미실행 |

마지막 실행용 JAR SHA256: `E7D8916AD8406A8597CBF23631C33F74DE9BBC65CA79F6D712C17219E1786770`.

검증에 사용한 덤프 SHA256: `8AB0DFE026E072A3B0EF78A80A1EF71B54C02F5900580EDE424A8008945F836B`. 덤프 원문과 시험 자격은 `.tmp`의 비공개 파일이며 노션·Git에 게시하지 않는다. 검사용 계획·실행·판단은 사용자 실제 기록으로 세지 않는다.

## 요구사항 추적

원문 44개 `id`·`text`·`verify`는 유지했다. 아래는 기존 V 검사에 추가한 백엔드 증거이며 UI·배포 인수 판정을 대체하지 않는다.

| 연결 | 구현/로컬 시험 | 남은 인수 검증 |
| --- | --- | --- |
| V01 · T06-C04~C08 | 계획 저장·전체 revision 보존·낡은 버전 거부·앱 계정 UPDATE 거부 | 실제 웹 입력·DB/화면 대조 |
| V02~V03 · C09~C20 | CRUD·현재 상태·soft delete·서버 검색/AND 필터/태그 OR·4개 정렬과 동률 처리 | 웹·Android 화면·새로고침·표시 기준 |
| V04 · C21~C22 | 같은 키/다른 키 동시 완료·cycle·되돌리기·늦은 재시도·실행 포함 원자 롤백·현재 완료 집계 | 배포 환경 동시 요청·브라우저 두 클릭 |
| V05 · C23~C27 | 실행 저장·예상 값/계획 이력 유지·중복 시간 확인·시작 전 종료 거부 | 사용자 실제 시각/분의 UI·DB·JSON 대조 |
| V06 · C28~C32·C83 | 같은 스냅샷 원천 집계/근거·계획 ID 필터·기간 밖 실행 포함·빈 집합·서울 날짜 경계·집계 필터와 전체 export 범위 구분 | 배포 화면의 각 숫자에서 근거로 이동 |
| V07 · C33 | 회고 원문·개선점·다음 계획 연결, 중복 이월 방지 | 사용자 판단·실제 UI 동선 |
| V08 · C34~C36·C78~C81 | 실제 MariaDB 저장·공간별 전체 JSON·삭제/이력 포함·덤프 복원 | 실제 사용자 계획 ≥1·할 일 ≥5·실행 ≥3, 새 브라우저/배포 영속성 |
| V09~V10 · C01·C57~C60·C82 | 공개 API·개인 API 구분, 지정 공개 문구를 meta API로 제공, 텍스트를 JSON 자료로 저장 | 첫 화면·XSS 무실행·비밀 5개 표면·공개 소스/결과 URL·확인 4줄/본인 판단 3줄·최종 배포 commit |

| 추가 ID | 확인한 것 | 아직 확인하지 않은 것 |
| --- | --- | --- |
| AUTH-01 | 공개 계획 API가 무인증으로 읽기/쓰기 가능, CSRF는 로그인 장벽 없이 발급 | 모든 공개 UI/제출 주소 |
| AUTH-02~04 | 비로그인 개인 API 401·다른 사용자/공개 경로의 개인 ID 404, 교차 공간 FK 거부, 요청 키 공간 분리와 export 비노출 | 모든 경로의 배포/브라우저 교차 회귀 |
| AUTH-05 | 내부 사용자와 외부 제공자/subject 분리, 명시적 연결·타인 계정 연결 거부 | Google·Kakao·Naver 실제 코드 교환/콜백/검수, 외부 이메일 미제공 응답 |
| AUTH-06 | 이메일 미확인 로그인 거부·일회용/만료/재발급 토큰, 재설정 후 DB 세션 삭제와 기존 HTTP 쿠키의 401, HttpOnly 쿠키 | 실제 HTTPS Secure 쿠키·메일 전달·로그아웃/휴면/네트워크 끊김 회귀 |
| AUTH-07 | 소유자 확인·멤버 관계·DB 소유자 FK·현재 단일 owner 제약 | 향후 공동 편집 확장은 현재 구현 대상 아님 |
| REC-01 | 삭제/복원과 목록 제외/복귀·삭제 포함 JSON | 휴지통 UI |
| REC-02 | 새 날짜 확인·계획/할 일 복제·실행 미복제 | 틀 선택/날짜 확인 UI |
| REC-03 | 수신 기본 거부·검증된 이메일 필요·시각/기간 설정 저장 | 일일 발송·실패/재시도·SMTP·수신함 도착·운영 알림 |

## 실패와 수정도 보존

1. Initializr metadata의 `4.1.1.RELEASE` 생성 요청은 BOM 해석 오류로 실패했다. 실제 버전 표기 `4.1.1`로 생성 성공했다.
2. Gradle가 JDK Unix 소켓 연결에서 실패했다. IPv4·java.io.tmpdir·다른 설치 JDK로는 해결되지 않았다. JDK 소스에서 소켓 전용 경로 설정을 확인하고 `jdk.net.unixdomain.tmpdir`을 지정한 뒤 빌드·시험이 통과했다. OS 수준 근본 원인까지 확정하지 않는다.
3. DB 세션 저장 검사는 통과했지만 추가 HTTP 검사에서 기대한 쿠키 이름을 찾지 못했다. DefaultCookieSerializer에 이름·경로·HttpOnly·Secure·SameSite를 명시한 뒤 로그인 유지/재설정 후 접근 차단 검사가 통과했다. 이전 자동 설정의 상세 원인은 미확정이다.
4. Windows 시험 클라이언트에서 TLS `SEC_E_NO_CREDENTIALS`로 덤프가 실패했다. 격리된 127.0.0.1:3307 시험 클라이언트만 TLS를 사용하지 않도록 명시한 뒤 복원이 통과했다. Brevo STARTTLS·운영 HTTPS 설정은 유지했다.

## 남은 연결

현재 남은 항목은 프론트 구현·웹 이미지, 세 소셜 제공자 앱/허용 콜백/필요 검수, 실제 화면에서 가입·메일 확인·재설정·알림 동선, 외부 암호화 백업과 복구, 부하 시험, WTR 이전이다. Vultr DB·API·Caddy·DNS/HTTPS·Swagger와 일반 SMTP 시험 수신은 확인했다. 실제 크레딧 만료·월 예산은 미확인이다. 계약의 전역 status=design·verified_against_database=false는 배포 commit까지 확인하는 최종 관문을 유지하기 위한 것이며, 로컬 관측·시험은 별도 필드에 기록했다.

## 무료 호스팅·메일 준비·프론트 API 후속 지시 — 이전 검토 이력

아래 문단은 Oracle 가입 실패·Vultr 선택·배포 이전의 검토 기록이다. 현재 제공자는 Vultr이며 DB·API·HTTPS·Swagger와 Brevo SMTP 시험 수신은 확인했다. 과거 미확인 상태를 현재 상태로 읽지 않는다.

2026-09-08 후속 상태: Brevo 발신 도메인 등록은 사용자 진술로 완료했다. Authenticated 표시·발신자·SMTP 키·실수신은 별도 확인 전이다. 소셜 제공자 앱 등록·키·콜백·검수는 프론트 완성 뒤 한 번에 진행한다. 사용자는 무료 호스팅을 우선 검토하도록 요청했으며 Oracle Always Free A1(현재 무료 계정 기준 2 OCPU·12GB)의 자원 확보를 먼저 시도하는 안을 추천한다. 제공자 선택·가입·자원 확보·배포는 아직 미확인이다. 구상 저장소에 OpenAPI 0.2.0 YAML/JSON 미러·Swagger UI·프론트 연동 안내를 추가했고 42개 경로·59개 작업·38개 모델, 예시 43개와 소스 경로 대조·브라우저 렌더링 검사가 통과했다.

[사용자 준비물 한 번에 보기](user-preparation.md) · [프론트 연동 안내](frontend-integration.md) · [Swagger 실행](swagger/README.md) · [무료 호스팅 비교](cloud-options.md)

문서 검증: `pnpm docs:check`로 OpenAPI 3.1 구조·공개/개인 인증·CSRF·Controller/프레임워크 59개 작업·요청 본문/필수 헤더·예시 43개를 확인했다. Headless Edge에서 6개 그룹을 펼쳐 59개 작업 및 로그인 응답 표시, pageerror 0을 확인했다. 최초 검사 대기는 접힌 그룹의 숨겨진 항목을 기다려 실패했고, 그룹을 펼친 뒤 같은 UI 검사를 통과했다. 백엔드 업무 코드는 이번에 변경하지 않았으며 기존 14개 런타임 시험을 재실행하지 않았다. 새 문서의 사례는 API 실제 호출 결과로 주장하지 않는다.
