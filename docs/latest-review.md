# 프로그램·인프라 최신 결정

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


2026-09-08 배포 진행: Vultr `158.247.203.145`의 `/opt/pds`에 MariaDB 12.3.3·Spring Boot API·Caddy를 배포했다. V1~V3와 21개 표·131개 열·키 항목 94개·CHECK 26개를 확인했고, 내부 API 15개 점검과 별도 임시 스키마의 21개 표 복원 대조가 통과했다. Brevo STARTTLS 인증·테스트 메일 접수와 Spring 메일 상태 검사가 성공했으며, 사용자가 네이버 받은편지함 도착을 확인했다.

현재 남은 작업: 프론트는 사용자 확인상 미구현이며 기본 주소 /는 준비 중 안내와 HTTP 503을 반환한다. 소셜 외부 설정은 프론트 완성 뒤 진행한다. 외부 암호화 백업 저장소·예약/복구와 전체 과제 인수 검증은 남아 있다. Chicago 45.76.27.48은 사용자가 직접 삭제했다고 확인했다.

이전 Chicago 관찰 기록: 사용자 제공 서버 상세 화면에서 45.76.27.48 / pds-cloud-01 / Chicago / 8vCPU·16384MB·350GB NVMe / Ubuntu 26.04 LTS x64 / linuxuser / 자동 백업 Enabled를 확인했다. 이전 배포 선택 화면의 Seoul과 실제 생성 지역이 다르며 원인은 미확정이다. 이 인스턴스에는 Docker·앱·DB 설치를 진행하지 않았다. 이후 사용자가 해당 Chicago 서버를 직접 삭제했다고 확인했다.

현재 적용 순서: 다른 PC·Mac의 SSH 키·방화벽 등록은 필요할 때까지 보류하고, 현재 Windows PC의 키로 Vultr 서버 구성을 이어간다. SSH는 Vultr와 NAS 모두에서 서버 관리에 쓰일 수 있다. Mac용 준비 도구는 보관만 하며 추가 PC 등록·실제 방화벽 변경은 실행하지 않았다.

2026-09-08 다중 PC·Mac 접속 준비: 인프라 access/에 키 생성·전용 SSH 설정·공인 IP 조회·기존 서버 공개키 추가 스크립트와 정책/검증 JSON을 작성했다. ZIP은 허용 목록의 파일 5개만 포함하며 압축 내부 SHA-256과 정본 일치를 확인했다. Windows Git Bash 5.3.15/OpenSSH에서 기존 키·SSH 설정 보존, 입력 검증, 설정 해석, WTR 분리, 키 백업·중복 방지·제한 옵션 보존을 확인했다. Windows의 symlink 생성이 복사로 처리되어 해당 실행 검사는 제외했다. 실제 Mac/Bash 3.2·클라우드 SSH·방화벽·공인 IP 조회는 실행 전이며 원문 44개와 API/DB 계약은 변경하지 않았다. [사용 안내](remote-access.md).

2026-09-08 사용자 화면 확인: 서울 vhp-8c-16gb-amd(8vCPU·16GB·350GB), Ubuntu 26.04 LTS x64, 자동 백업 ON, 수량 1, 합계 월 US$115.20/시간당 US$0.158이 선택되어 있다. Ubuntu 26.04는 Docker 공식 지원 대상으로 확인했다. pds-vultr-admin 전용 SSH 공개키를 로컬에 생성했고 Git 제외·Windows 폴더 접근 권한 제한을 확인했다. 현재 새 서버의 공개키 인증은 성공했다. Vultr 계정 키 목록·방화벽 적용·실제 크레딧 적용/만료일은 미확인이다. 설정 권장값은 pds-web 방화벽(TCP 22 My IP, 80/443 Anywhere), hostname/label pds-cloud-01, Limited User Login ON, Public IPv4 ON, IPv6/VPC/DDoS/Cloud-Init OFF이며 Startup Script는 선택하지 않는다.

항목별 선택값·SSH 키 등록·방화벽·배포 이후 준비와 WTR 이전 순서는 [Vultr 설정 안내](vultr-setup.md)에 정리했다. 이번 변경은 설정 안내와 로컬 키 준비이며 서버 배포 또는 기존 실행 검사의 재실행이 아니다.

2026-09-08 후속 범위 결정: 이번에 공개 과제 공간과 로그인하는 개인 계정 영역을 함께 구현한다. 개인 영역은 이메일 가입·카카오·네이버·구글 로그인, 현재 본인만 접근·향후 공동 편집 확장 고려로 확정했다. 기존 무인증 과제 조건은 공개 공간에서 유지하며, 웹 JDBC 세션과 보안 쿠키를 채택했으며 추가 일정·외부 인증 검증은 남아 있다. [백엔드 구성 결정](backend-decisions.md)에 사용자 답변과 AUTH-01~07 인수 기준을 기록했다. 서버 구현과 일부 로컬 검증을 마쳤으며 외부 인증·배포 검증은 남아 있다.

최신 운영 결정: WTR Pro는 Ryzen 7 5825U·RAM 32GB·6TB×2·2TB×1이며 CCTV용 하드로 24시간 사용 가능하다는 사용자 진술이다. 초기 이용자는 약 10명 예상이다. 실제 가용성·OS·외부 접속·월 예산은 미확인이다. 초기 운영은 클라우드, WTR Pro는 후속 이전 대상이다. 2026-09-08 후속 결정: 사용자가 JDBC·Spring Security·웹 JDBC 세션·외부 SMTP와 휴지통 복원(REC-01)·계획 틀 복제(REC-02)·선택형 알림(REC-03)을 모두 채택했다. n8n은 후속 알림·운영 자동화로 검토하고 인증 메일은 Spring에서 외부 SMTP로 전송한다. 클라우드부터 구현하고 WTR Pro로 이전할 수 있도록 준비한다.

2026-09-08 / v1.3 / 설계 갱신. 사용자가 `plandosee.app` 구매를 알렸다. 구상 저장소는 `Plan-Do-See/PDC_Diary`로 확인했으며 [README](../README.md)에 개요·문서 안내를 정리했다. 백엔드 구현·로컬 시험을 수행했다. 웹/Android·서버 배포·인프라 결제는 미실행이다.

서비스 도메인은 `plandosee.app`으로 확정했다. 웹 주소는 `https://plandosee.app`, 공통 API 기본 주소는 `https://plandosee.app/api/v1`로 계획한다. DNS·HTTPS·백엔드·Swagger 연결은 확인했다. 프론트와 전체 과제 공개 완료는 별도다. 실제 결제액·갱신 가격은 확인하지 않았다.

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

기존 9개 도메인 표의 원칙에 계정·공간 경계를 추가한다. Flyway MariaDB 공식 문서(2026-09-03 갱신)는 12.3.2를 검증 버전으로 명시한다. 사용자 개발 DB는 3919 포트 응답 기준 12.3.3이다. 우리 migration·JDBC·트랜잭션의 실제 검사는 별도로 수행한다. [Flyway MariaDB](https://documentation.red-gate.com/flyway/reference/database-driver-reference/mariadb).

## SSR을 고려한 운영 예산

한국 사용자가 중심인 소규모 텍스트 앱이라는 가정이다. 실제 사용량·성능·메모리는 아직 측정하지 않았다.

| 후보 | 월 서버 + 백업 기본액 | 판단 |
|---|---|---|
| Lightsail 서울 Linux IPv4 2GB | $12 + $1 = $13부터 | SSR·Spring·DB 부하 시험 통과 시 절약안 |
| Lightsail 서울 Linux IPv4 4GB | $24 + $1 = $25부터 | 2GB 통합 부하 검사에서 부족할 때의 증설 대안 |
| Hetzner 유럽 CX23 4GB | 기본 €5.49, IPv4·백업 별도 | 공식 페이지 구매 불가 표시로 채택 보류 |

객체 저장소 $1은 5GB 저장·25GB 전송 한도다. 기본액은 서비스 한도 내 가정이며 세금·환율·도메인·초과량은 별도다. 스냅샷은 과금 대상 총 GB당 월 $0.05 추가다. 무료 체험을 정상 운영 비용에서 차감하지 않았다. 가격·구매 불가 표시는 같은 날 앞선 조사에서 확인했다. [AWS 가격](https://aws.amazon.com/lightsail/pricing/), [Hetzner 가격](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/), [상품 표시](https://www.hetzner.com/cloud/cost-optimized/).

4GB가 필요하거나 충분하다고 확정한 것은 아니다. SSR·저장·집계·동시 export에서 Node.js·JVM·DB의 RSS·응답·CPU·디스크를 측정해 크기를 결정한다. 빌드는 CI에서 하고 완성 이미지만 서버에서 실행한다. 일관 DB 덤프를 서버 밖 비공개 저장소에 7일 보관하고 다른 DB에 복구한다. OS·DB 패치·복구는 직접 운영한다.

## 저장소와 완료 범위

Plan-Do-See/PDC_Diary는 명세·증거, PDC_Diary_Spring는 API·DB 계약, PDC_Diary_Web은 Next.js, PDC_Diary_Android는 Kotlin·Compose, PDC_Diary_Infra는 배포를 담당한다. 기존 PDC_Diary_Spring에 백엔드를 생성했고 workspaces/PDC_Diary_Infra에 별도 로컬 Git 저장소를 만들었다. 웹/Android 저장소·인프라 원격 연결은 남아 있다. 상세는 [저장소 구성](repository-layout.md)에 있다.

웹의 44개 필수 과제 조건은 축소하지 않았다. 원문 44개 id·text·verify는 유지하고 별도 backend_progress 상태/증거 링크를 추가했다. 공개 웹 과제 8~10시간 목표와 Android 개발·기기 시험·배포는 별도다. 사용자 후속 결정으로 개인 계정 영역도 이번에 구현하되 인증·접근 분리 검증의 추가 시간은 미산정이다. 공개 과제의 안내·무인증 기능은 유지한다. n8n은 후속 자동화 대상으로 검토하고 인증 메일 경로에서는 사용하지 않는다.

이번 변경은 최신 Next.js·Android 공식 문서로 확인했다. 이전 Context7 조회는 백엔드·DB 설계 근거로 보존하되 Flutter 조회 결과는 대체된 설계의 역사로 표시한다. 이번 Android 결정에 새 Context7 조회를 수행했다고 주장하지 않는다.


## 현재 백엔드 작업

백엔드 구현 결과(2026-09-08): PDC_Diary_Spring에 계정·공간·세션·도메인 API와 Flyway V1~V3, 휴지통 복원·틀 복제·선택형 이메일 알림을 작성했다. MariaDB 12.3.3 로컬 검사 14개와 21개 표 덤프→복원 대조가 통과했다. Compose 구조 검사도 통과했다. 실제 외부 OAuth·Brevo 수신·클라우드/WTR·웹/Android 검증은 남아 있다. [검증 기록](backend-verification.md)을 따른다.

Java 21.0.12.1과 Spring Boot 4.1.1·Gradle 9.7.1 컴파일을 확인했다. JDK 소켓 전용 임시 경로를 지정하여 로컬 빌드 오류를 해결했다. 사용자가 알려 준 MariaDB 포트는 3919이고 127.0.0.1:3919 초기 응답에서 12.3.3을 확인했다. 기존 DB 로그인·데이터 변경은 하지 않았다. 상세 실행 증거는 후속 검증 기록에 남긴다.

메일 설정 예시는 Brevo SMTP(smtp-relay.brevo.com:587, STARTTLS) 기준으로 준비한다. SMTP 로그인과 SMTP 키는 환경 변수로 주입한다. 발신 도메인 인증(Brevo code·DKIM·DMARC), 트랜잭션 발송 활성화, Gmail·네이버 실제 수신 확인은 남아 있다. 외부 서비스를 써도 받은편지함 도착을 보장하지 않으며, WTR 이전 후에도 같은 외부 SMTP를 유지한다.

## 저가 클라우드 후속 추천 · 제공자 미선정

최종 사용자 선택은 Vultr다. 한 달 안에 WTR Pro로 이전할 것이라는 사용자 예상에 맞춰, 체험용 서울 AMD High Performance 8vCPU·16GB(월 US$96)를 추천한다. 작은 클라우드 서버로 축소하는 경로는 준비하지 않는다. 실제 이전일·크레딧 적용·앱 배포는 확인 전이다.

[가격·조건 비교와 추천 근거](cloud-options.md)를 따른다. 기존 Docker Compose·MariaDB 덤프와 WTR 이전 절차를 유지하며 API·DB 계약 변경은 없다.

## 무료 호스팅·메일 준비·프론트 API 후속 지시

2026-09-08 최신 결정: 사용자가 최종 클라우드 제공자로 Vultr를 선택했다. 사용자는 작은 클라우드 서버로 줄일 필요가 없고 한 달 안에 이전할 것으로 예상한다고 밝혔다. WTR Pro로의 이전을 목표로 서울(icn) Shared CPU AMD High Performance 8vCPU·RAM 16GB·350GB 한 대를 체험용으로 추천하며 공식 카탈로그의 서버 요금은 월 US$96이다. US$250·최대 30일 프로모션의 실제 적용/만료는 확인 전이다. 새 한국 서버의 DB·백엔드·Caddy 배포와 SMTP 시험을 확인했다. 공개 HTTPS·API·Swagger는 확인했고 프론트는 미구현이다. Brevo 도메인 Authenticated는 사용자 진술로 확인했다. 발신자 PlanDoSee <no-reply@plandosee.app>의 서버 SMTP 시험을 통과했고, 사용자가 네이버 받은편지함 도착을 확인했다. 소셜 제공자 앱 등록·키·콜백·검수는 프론트 완성 뒤 한 번에 진행한다. 클라우드부터 운영하고 WTR Pro로 후속 이전하는 방침을 유지한다. 구상 저장소의 OpenAPI 0.2.0·Swagger UI·프론트 안내는 42개 경로·59개 작업·38개 모델·예시 43개와 소스 대조/브라우저 검사를 통과했다.

[사용자 준비물 한 번에 보기](user-preparation.md) · [프론트 연동 안내](frontend-integration.md) · [Swagger 실행](swagger/README.md) · [무료 호스팅 비교](cloud-options.md)

## Vultr 체험 크레딧 조사

2026-09-08 Vultr 후속 조사: 공식 US$250 체험 배너와 최대 30일, 만료/소진 뒤 과금·정지만으로 과금 중단 불가를 확인했다. 공개 가격 API상 서울(icn) 제공 목록에 Regular 2GB US$10/월·4GB US$20/월, AMD High Performance 2GB US$12/월·4GB US$24/월이 있다. 실제 재고·개별 쿠폰 자격/지급/만료·최종 견적은 미확인이다. 프론트/이미지 준비 후 서울 Regular 4GB로 첫 배포·메일·복원 시험에 사용하는 안은 추천하며, 장기 월 0원 후보는 Oracle Always Free로 구분한다. 제공자 선택·가입·결제·배포는 하지 않았다.

[조건·실측 가격·이전 판단](cloud-options.md#vultr-250달러-체험-조사--2026-09-08)

