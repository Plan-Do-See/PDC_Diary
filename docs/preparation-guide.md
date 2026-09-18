# 개발·배포 준비물

2026-09-09 최신 상태: 공개/개인 웹을 [운영 주소](https://plandosee.app)에 배포했다. 계획/이력·할 일·실행/완료·검색/필터/정렬·돌아보기/근거·다음 계획·전체 JSON·휴지통/복제·이메일 계정·알림 설정을 연결했다. 타입/Windows·Linux 빌드, 단위13·격리 API/DB17·운영 HTTPS16개를 통과했다. 사용자 최신 지시로 소셜 로그인은 명시적으로 다시 요청할 때까지 작업을 보류한다. 실제 사용자 1/5/3·최종 DB 계약·전체 인수는 미완료. 상세: [웹 구현·검증](../../PDC_Diary_Nextjs/docs/full-implementation.md). 아래 이전 단계 기록은 당시 상태다.

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


2026-09-08 / 기존 설계 v1.3의 준비물 안내 · 설치·배포 완료 보고가 아님

## 전체 연결

개발 PC에서 코드를 작성·검증하고, GitHub Actions가 배포용 이미지를 만든다. Linux 서버는 그 이미지를 실행한다. 웹과 Android는 동일한 Spring Boot API·MariaDB를 사용한다.

웹/Android → plandosee.app → Caddy → Next.js(웹) 또는 Spring Boot(/api/v1) → MariaDB

이 문서는 준비물 설명이며 백엔드의 로컬 구현·검증 상태는 검증 기록을 따른다. 이 문서 작성으로 설치·계정 생성·결제·배포가 완료된 것은 아니다. 개인 영역은 이메일 가입·카카오·네이버·구글 로그인, 본인만 접근·향후 공동 편집 확장 고려로 확정했다. 각 소셜 제공자의 앱 등록·허용 콜백·정보 요청·필요한 검수와 이메일 발신 도메인·SMTP 계정 준비가 남아 있다. 실제 비밀값은 공개 문서에 넣지 않는다. [백엔드 구성 결정](backend-decisions.md)과 [구성 추천](backend-recommendations.md)에 준비 상태와 추천을 구분한다.

## 지금 PC에 준비할 것

| 준비물 | 무엇을 하는가 | 준비 방식 |
| --- | --- | --- |
| JDK 21 LTS | Java 코드를 빌드하고 Spring Boot를 실행 | 개발 PC에 설치, JAVA_HOME·PATH 확인 |
| Node.js 24 LTS + 패키지 관리자 | Next.js 개발·빌드·SSR 실행과 라이브러리 설치 | Node는 현재 v24.19.0 실행 확인. npm 또는 pnpm 중 하나를 프로젝트에서 고정 |
| Git + GitHub 접근 | 소스 이력·저장소·협업·자동 빌드 | Git 명령 확인. 조직 저장소 생성·push·Actions·Packages 권한 확인 필요 |
| WSL 2 + Docker Desktop | Windows에서 Linux 컨테이너 실행 | WSL 버전 응답 확인. Docker의 Linux 컨테이너 실행은 미검증 |
| Docker Compose | MariaDB 등 여러 서비스를 한 설정으로 실행 | Docker Desktop에 포함. docker compose 명령으로 사용 |
| 코드 편집기 | 코드 작성·디버깅 | 백엔드용 IntelliJ IDEA, 웹용 VS Code 등 본인이 사용할 도구 선택 |

Spring Boot 4.1.x + Java 21을 기준으로 시작한다. Next.js는 Node.js 20.9 이상이 필요하며 이 프로젝트는 24 LTS를 기준으로 한다. 정확한 버전은 호환 검증 뒤 고정한다. [Spring 요구사항](https://docs.spring.io/spring-boot/system-requirements.html) · [Next.js 설치](https://nextjs.org/docs/app/getting-started/installation) · [Node.js 릴리스](https://nodejs.org/en/about/previous-releases)

Docker Desktop은 지원되는 Windows 10/11의 WSL 2·하드웨어 가상화 환경을 전제로 한다. Windows Server에서는 Docker Desktop이 지원되지 않으므로 Linux 환경을 별도로 마련해야 한다. [Windows 설치 조건](https://docs.docker.com/desktop/setup/install/windows-install/) · [Compose 포함 여부](https://docs.docker.com/compose/install/)

## Spring Boot·Docker를 구분하기

| 이름 | 쉬운 설명 | 이 프로젝트에서의 역할 |
| --- | --- | --- |
| Spring Boot | 백엔드를 만드는 프레임워크 | 계획 저장·할 일·집계·중복 방지·입력 검증 |
| JDK | Java 개발·실행 도구 | Spring Boot를 빌드하고 실행 |
| Gradle Wrapper | 프로젝트에 지정된 빌드 도구를 내려받아 실행 | 라이브러리 다운로드·테스트·실행 파일 생성 |
| Docker 이미지 | 프로그램과 실행 환경을 묶은 배포 단위 | 웹·API·DB 실행 버전을 맞춤 |
| Docker 컨테이너 | 이미지를 실제로 실행한 프로세스 환경 | PC와 서버에서 각 서비스를 실행 |
| Docker Compose | 여러 컨테이너의 연결·설정을 선언하는 파일과 도구 | 웹·API·DB·Caddy를 함께 관리 |
| MariaDB | 자료를 영구 저장하는 DB | 계획·이력·할 일·실행·돌아보기 저장 |
| Caddy | 외부 요청을 받아 웹/API로 보내는 웹 서버 | HTTPS 인증서 관리·경로별 전달 |

Spring Boot 자체를 일반 설치 프로그램처럼 설치할 필요는 없다. 프로젝트의 Gradle 의존성으로 가져온다. Wrapper가 포함된 프로젝트는 별도 전역 Gradle 설치 없이 지정 버전을 사용한다. 백엔드 준비안은 Gradle Wrapper이며 정확한 버전은 프로젝트 생성 시 고정한다. [Spring 설치 방식](https://docs.spring.io/spring-boot/installing.html) · [Gradle Wrapper](https://docs.gradle.org/current/userguide/gradle_wrapper.html)

개발 중에는 웹·API를 PC에서 실행하고 MariaDB를 Docker로 띄울 수 있다. 배포 검증 때 전체 Compose 구성을 실행한다. DB 자료는 컨테이너의 임시 파일 영역이 아닌 영구 볼륨에 저장하고, 백업을 별도로 둔다.

## 프로젝트를 만들면서 준비할 것

| 담당 저장소 | 필요한 파일·설정 |
| --- | --- |
| PDC_Diary | RULE·설계 Markdown·44개 조건·증거·노션 연결 |
| PDC_Diary_Spring | Gradle Wrapper·Spring MVC/Validation/JDBC·MariaDB 드라이버·Flyway·JUnit/Testcontainers·Dockerfile |
| PDC_Diary_Nextjs | Next.js App Router·React·TypeScript·패키지 잠금 파일·lint·브라우저 테스트·Dockerfile |
| PDC_Diary_Android | Kotlin·Compose·ViewModel·API 연결·앱 빌드·기기 테스트·서명 설정 |
| PDC_Diary_Spring/ops | compose.yaml·Caddyfile·배포/백업/복구 스크립트·release.json·.env.example |

- 백엔드에 `contracts/openapi.yaml`과 `contracts/pds-schema-v2.json` 정본을 둔다. OpenAPI에는 요청·응답·오류·요청 키·동시 수정 충돌 규칙을 정의한다.

- MariaDB/Flyway/JDBC의 실제 조합을 시험하고 migration을 작성한다. 계획 이력·중복 완료·서울 날짜·분 단위·집계 근거를 같은 DB 버전에서 검증한다.

- 개발 DB와 운영 DB·비밀번호를 분리한다. 환경변수 예시는 공개 가능하게 만들고 실제 비밀값은 Git·브라우저·APK에 넣지 않는다.

- 공개 과제 공간은 로그인 없이 모든 요구 기능을 제공한다. 이번에 추가하는 개인 영역은 계정별 권한을 검사하고 공개 데이터와 분리한다. AWS·GitHub의 관리 계정은 서비스 이용자 로그인과 별개다.

- DB 행을 보는 DBeaver, API를 호출하는 Bruno/Postman 등의 GUI 도구는 선택 사항이다. 자동 검증은 프로젝트 테스트에서 실행한다.

## 배포 전에 준비할 계정·서버

WTR Pro는 Ryzen 7 5825U·RAM 32GB·6TB×2·2TB×1이며 CCTV용 하드로 24시간 사용 가능하다는 사용자 진술이다. 초기 이용자는 약 10명 예상이다. 실제 가용성·OS·외부 접속·월 예산은 미확인이다. 초기 운영은 클라우드, WTR Pro는 후속 이전 대상이다. 2026-09-08 후속 결정: 사용자가 JDBC·Spring Security·웹 JDBC 세션·외부 SMTP와 휴지통 복원(REC-01)·계획 틀 복제(REC-02)·선택형 알림(REC-03)을 모두 채택했다. n8n은 후속 알림·운영 자동화로 검토하고 인증 메일은 Spring에서 외부 SMTP로 전송한다. 클라우드부터 구현하고 WTR Pro로 이전할 수 있도록 준비한다.

| 준비물 | 목적·조건 |
| --- | --- |
| AWS 계정·결제수단(추천 선택 시) | Lightsail 서버·백업 운영. 계정 MFA, 제한된 운영 권한과 비용 알림 설정 |
| Linux VPS 1대 | Caddy·Next.js·Spring Boot·MariaDB를 실행. 초기 후보는 서울 Lightsail |
| 공인 고정 IP + SSH 키 | 도메인을 연결하고 서버에 접속. SSH 접근은 관리 출처로 제한 |
| 도메인 DNS 관리 권한 | plandosee.app의 A 레코드를 서버 IPv4에 연결. IPv6 운영 시 AAAA도 일치시킴 |
| Docker Engine + Compose 플러그인 | Linux 운영 서버에서 컨테이너 실행. Java·Node는 앱 이미지에 포함 |
| Caddy + 영구 인증서 저장소 | 도메인·80/443 접근 조건을 맞춰 HTTPS 발급·갱신 |
| GitHub Actions + 이미지 저장소 | CI에서 테스트·이미지 빌드 후 GHCR 등의 레지스트리에 저장 |
| 서버 밖 비공개 백업 | 일관 DB 덤프·7일 보관·다른 DB 복구 시험 |
| 운영 설정·비밀값 | DB 실행/마이그레이션 계정, 배포·이미지 읽기·백업 자격증명을 용도별 관리 |
| 로그·상태 확인·복구 절차 | 헬스체크, 로그 용량 제한, 디스크·백업 실패 확인, 재시작·롤백 절차 |

공개 웹은 `https://plandosee.app`, 공통 API는 `https://plandosee.app/api/v1`이다. DB 3306·내부 웹/API 포트는 외부에 공개하지 않는다. 도메인 구매는 사용자 진술로 확인했고 DNS·HTTPS·백엔드 연결은 확인했으며 프론트는 미구현이다.

Caddy가 DNS와 외부 80/443 접근 조건을 충족하면 공개 인증서를 발급·갱신한다. 인증서 저장소도 영구 보관한다. [Caddy HTTPS](https://caddyserver.com/docs/automatic-https)

저장소를 5개로 나누어도 서버를 5대 살 필요는 없다. CI에서 빌드하고 서버는 완성 이미지로 실행한다. GitHub 소스 공개와 GHCR 이미지 공개는 별도 설정이다. [GHCR 사용](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

## 예산

| 항목 | 기준 |
| --- | --- |
| 도메인 | plandosee.app 구매 완료(사용자 진술). 실제 결제액·갱신가는 미확인 |
| 개발 도구 | 개인·교육 용도의 Docker Desktop은 무료 범위. 조직 업무 사용은 해당 라이선스 조건 확인 |
| 서버 + 기본 백업 | Lightsail 2GB $12 + $1 = 월 $13부터 / 4GB $24 + $1 = 월 $25부터 |
| 크기 선택 | 2GB 우선 검토, SSR·API·DB 부하 시험을 통과해야 운영 채택; 부족하면 4GB 검토 |
| 추가 비용 | 세금·환율·도메인 갱신·사용량 초과·추가 스냅샷·CI/레지스트리 과금은 별도 |

가격 기준 2026-09-08. 백업 $1은 저장 5GB·전송 25GB 한도다. 무료 체험을 정상 월 비용에서 차감하지 않는다. [Lightsail 요금](https://aws.amazon.com/lightsail/pricing/) · [서버 번들](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-bundles.html) · [Docker 이용 조건](https://docs.docker.com/desktop/setup/install/windows-install/)

## Android를 시작할 때 추가

- **Android Studio + Android SDK + Platform Tools(adb)**: Kotlin·Compose 앱 개발·빌드·기기 연결. Studio가 제공하는 Java 런타임과 Android Gradle Plugin의 호환 조합을 사용한다.

- **Android 실기기 또는 에뮬레이터**: 개발자 옵션·USB 디버깅으로 실제 동작을 확인한다. 에뮬레이터를 쓸 경우 가상화·RAM·디스크 여유를 추가로 확보한다.

- **앱 ID·아이콘·버전·서명키**: 배포할 앱의 식별자와 업데이트 서명을 정한다. 키는 공개 저장소에 넣지 않고 백업한다.

- **배포 방식**: 본인 기기 개발 테스트는 Play 출시와 분리한다. Play 출시는 Console 계정·본인 확인·AAB·스토어 설명/스크린샷·개인정보처리방침·데이터 안전성 작성이 필요하다.

- **Play 비용·일정**: 계정 등록은 현재 1회 US$25. 2023-11-13 이후 생성한 개인 계정에는 12명이 연속 14일 참여하는 비공개 테스트 후 정식 출시 신청 요건이 적용된다.

- Play 외부 배포도 대상 국가·시점에 따른 Android 개발자 검증 정책을 확인한다. 공개 배포 경로는 아직 선택하지 않았다.

Android 구현·기기 검사·배포는 웹 과제 8~10시간과 별도다. iOS는 현재 범위에서 제외한다.

[Studio 설치](https://developer.android.com/studio/install) · [앱 서명](https://developer.android.com/studio/publish/app-signing) · [Play 가입](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en) · [개인 계정 테스트](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en) · [개발자 검증](https://developer.android.com/developer-verification)

## 사용자가 직접 준비할 것

1. GitHub 조직/계정의 저장소 생성·push·Actions·Packages 권한. 서버를 만들 단계에는 AWS 계정·결제수단·예산과 도메인 DNS 관리 접근.

2. 공개해도 되고 사용자가 실제로 사용할 계획 1개 이상, 같은 계획의 할 일 5개 이상, 실제 실행 기록 3개 이상, 다음 계획에 반영할 사용자 확인 개선점 한 줄. 사용자 승인 시 AI가 계획·할 일·실행 기록을 작성·입력할 수 있다.

3. Android 단계에는 실제 검사할 기기와 배포 방식. 계정 본인 확인과 결제는 사용자가 진행한다.

자격증명 원문을 대화나 공개 문서에 넣을 필요는 없다. 코드·설정·명세·테스트 작성은 개발 작업으로 진행하고, 실제 기록·공개 범위·계정 소유 확인은 본인이 판단한다.

## 현재 확인 상태와 시작 순서

- 확인: Git 명령, Node.js v24.19.0 실행, WSL 2.7.13.0 버전 응답, pnpm 명령 경로, 도메인 구매 사용자 진술.

- Java 21.0.12.1과 Spring Boot 4.1.1·Gradle 9.7.1 컴파일을 확인했다. JDK 소켓 전용 임시 경로를 지정하여 로컬 빌드 오류를 해결했다. 사용자가 알려 준 MariaDB 포트는 3919이고 127.0.0.1:3919 초기 응답에서 12.3.3을 확인했다. 기존 DB 로그인·데이터 변경은 하지 않았다. 상세 실행 증거는 후속 검증 기록에 남긴다. Docker·Android·클라우드 배포는 별도 검증 대상이다.

- 개발 PC의 RAM/가상화 상태는 미확인이다. 개발 권장안은 RAM 16GB 이상, Docker·IDE·Android 에뮬레이터를 함께 쓰면 32GB에 여유를 두는 것이다. 이는 프로젝트 권장안이며 공식 최소 사양을 뜻하지 않는다.

**순서:** JDK·Node·Docker 실행 확인 → 저장소·기본 프로젝트·로컬 DB 연결 → 실제 버전 조합/첫 migration 검증 → 기능 구현·실제 자료 검증 → 서버·DNS·HTTPS·백업 배포 → Android 확장.

추가 설치·계정 생성·결제·배포는 이번 설명 작업에서 수행하지 않았다.

## 이메일 발송 준비

메일 설정 예시는 Brevo SMTP(smtp-relay.brevo.com:587, STARTTLS) 기준으로 준비한다. SMTP 로그인과 SMTP 키는 환경 변수로 주입한다. 발신 도메인 인증(Brevo code·DKIM·DMARC), 트랜잭션 발송 활성화, Gmail·네이버 실제 수신 확인은 남아 있다. 외부 서비스를 써도 받은편지함 도착을 보장하지 않으며, WTR 이전 후에도 같은 외부 SMTP를 유지한다.

## 백엔드 준비 완료 범위

백엔드 구현 결과(2026-09-08): PDC_Diary_Spring에 계정·공간·세션·도메인 API와 Flyway V1~V3, 휴지통 복원·틀 복제·선택형 이메일 알림을 작성했다. MariaDB 12.3.3 로컬 검사 14개와 21개 표 덤프→복원 대조가 통과했다. Compose 구조 검사도 통과했다. 실제 외부 OAuth·Brevo 수신·클라우드/WTR·웹/Android 검증은 남아 있다. [검증 기록](backend-verification.md)을 따른다.

MariaDB 3919는 사용자 지정 개발 포트다. 로컬 시험은 별도 3307에서 실행했다. Docker 엔진 설치 여부·컨테이너 기동·웹/Android 빌드는 확인하지 않았다. 공식 Compose 실행 파일로 미해결 환경 변수 상태의 구조 검사만 수행했다.

## 저가 클라우드 후속 추천 · 제공자 미선정

최종 사용자 선택은 Vultr다. 한 달 안에 WTR Pro로 이전할 것이라는 사용자 예상에 맞춰, 체험용 서울 AMD High Performance 8vCPU·16GB(월 US$96)를 추천한다. 작은 클라우드 서버로 축소하는 경로는 준비하지 않는다. 실제 이전일·크레딧 적용·앱 배포는 확인 전이다.

[가격·조건 비교와 추천 근거](cloud-options.md)를 따른다. 기존 Docker Compose·MariaDB 덤프와 WTR 이전 절차를 유지하며 API·DB 계약 변경은 없다.

## 무료 호스팅·메일 준비·프론트 API 후속 지시

2026-09-08 최신 결정: 사용자가 최종 클라우드 제공자로 Vultr를 선택했다. 사용자는 작은 클라우드 서버로 줄일 필요가 없고 한 달 안에 이전할 것으로 예상한다고 밝혔다. WTR Pro로의 이전을 목표로 서울(icn) Shared CPU AMD High Performance 8vCPU·RAM 16GB·350GB 한 대를 체험용으로 추천하며 공식 카탈로그의 서버 요금은 월 US$96이다. US$250·최대 30일 프로모션의 실제 적용/만료는 확인 전이다. 새 한국 서버의 DB·백엔드·Caddy 배포와 SMTP 시험을 확인했다. 공개 HTTPS·API·Swagger는 확인했고 프론트는 미구현이다. Brevo 도메인 Authenticated는 사용자 진술로 확인했다. 발신자 PlanDoSee <no-reply@plandosee.app>의 서버 SMTP 시험을 통과했고, 사용자가 네이버 받은편지함 도착을 확인했다. 소셜 제공자 앱 등록·키·콜백·검수는 프론트 완성 뒤 한 번에 진행한다. 클라우드부터 운영하고 WTR Pro로 후속 이전하는 방침을 유지한다. 구상 저장소의 OpenAPI 0.2.0·Swagger UI·프론트 안내는 42개 경로·59개 작업·38개 모델·예시 43개와 소스 대조/브라우저 검사를 통과했다.

[사용자 준비물 한 번에 보기](user-preparation.md) · [프론트 연동 안내](frontend-integration.md) · [Swagger 실행](swagger/README.md) · [무료 호스팅 비교](cloud-options.md)
