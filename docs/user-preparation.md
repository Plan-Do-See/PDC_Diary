# 사용자가 준비할 것 · 한 번에 정리

2026-09-09 최신 상태: 공개/개인 웹을 [운영 주소](https://plandosee.app)에 배포했다. 계획/이력·할 일·실행/완료·검색/필터/정렬·돌아보기/근거·다음 계획·전체 JSON·휴지통/복제·이메일 계정·알림 설정을 연결했다. 타입/Windows·Linux 빌드, 단위13·격리 API/DB17·운영 HTTPS16개를 통과했다. 사용자 최신 지시로 소셜 로그인은 명시적으로 다시 요청할 때까지 작업을 보류한다. 실제 사용자 1/5/3·최종 DB 계약·전체 인수는 미완료. 상세: [웹 구현·검증](../../PDC_Diary_Nextjs/docs/full-implementation.md). 아래 이전 단계 기록은 당시 상태다.

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


2026-09-08 배포 진행: Vultr `158.247.203.145`의 `/opt/pds`에 MariaDB 12.3.3·Spring Boot API·Caddy를 배포했다. V1~V3와 21개 표·131개 열·키 항목 94개·CHECK 26개를 확인했고, 내부 API 15개 점검과 별도 임시 스키마의 21개 표 복원 대조가 통과했다. Brevo STARTTLS 인증·테스트 메일 접수와 Spring 메일 상태 검사가 성공했으며, 사용자가 네이버 받은편지함 도착을 확인했다.

현재 남은 작업: 프론트는 사용자 확인상 미구현이며 기본 주소 /는 준비 중 안내와 HTTP 503을 반환한다. 소셜 외부 설정은 프론트 완성 뒤 진행한다. 외부 암호화 백업 저장소·예약/복구와 전체 과제 인수 검증은 남아 있다. Chicago 45.76.27.48은 사용자가 직접 삭제했다고 확인했다.

이전 Chicago 관찰 기록: 사용자 제공 서버 상세 화면에서 45.76.27.48 / pds-cloud-01 / Chicago / 8vCPU·16384MB·350GB NVMe / Ubuntu 26.04 LTS x64 / linuxuser / 자동 백업 Enabled를 확인했다. 이전 배포 선택 화면의 Seoul과 실제 생성 지역이 다르며 원인은 미확정이다. 이 인스턴스에는 Docker·앱·DB 설치를 진행하지 않았다. 이후 사용자가 해당 Chicago 서버를 직접 삭제했다고 확인했다.

현재 적용 순서: 다른 PC·Mac의 SSH 키·방화벽 등록은 필요할 때까지 보류하고, 현재 Windows PC의 키로 Vultr 서버 구성을 이어간다. SSH는 Vultr와 NAS 모두에서 서버 관리에 쓰일 수 있다. Mac용 준비 도구는 보관만 하며 추가 PC 등록·실제 방화벽 변경은 실행하지 않았다.

2026-09-08. **Brevo 발신 도메인 등록은 사용자 진술로 완료**다. 도메인을 다시 등록할 필요는 없다. 도메인의 Authenticated 상태·SMTP 실발송은 직접 확인 전이다. **소셜 로그인 외부 등록·키·검수는 프론트 완성 뒤 한 번에 진행**한다.

## 지금 준비

다른 PC·Mac에서는 [접속 준비 ZIP과 안내](remote-access.md)를 사용한다. 최초 키 등록·현재 네트워크의 방화벽 허용 후 같은 접속 명령을 반복해서 쓸 수 있다. Windows 개인키를 다른 장치로 복사하지 않는다.

서버 IP 전달과 SSH·Docker 준비는 완료했다. 사용자는 아래 남은 계정·도메인·메일 정보를 준비하면 된다. [실제 설치 결과](server-bootstrap-status.md) · [설정 안내](vultr-setup.md).

| 항목 | 사용자가 할 일 | 완료되면 알려 줄 것 |
| --- | --- | --- |
| Vultr 잔여 확인 | 크레딧 잔액·만료일과 새 서버 자동 백업·방화벽 연결 확인. Chicago 삭제는 사용자 확인 완료 | 비밀값을 제외한 상태·날짜 |
| Brevo 발신자 | 완료: PlanDoSee / no-reply@plandosee.app, Authenticated는 사용자 확인 | 추가 전달 불필요 |
| Brevo SMTP 연결값 | 비공개 파일 입력·서버 적용·TLS 인증 완료 | 키를 다시 전달하지 않음 |
| 발송 검사·DNS | 네이버 받은편지함 도착 확인 완료. pdcvultr 하위 주소에 등록된 사실 확인. A 레코드 이름 @ 수정 후 공개 HTTPS·API·Swagger 확인 완료 | 추가 DNS 입력 없음 |

SMTP 서버는 smtp-relay.brevo.com, 포트 587, STARTTLS를 사용한다. 백엔드가 본문을 만들므로 사용자가 Brevo 메일 템플릿이나 n8n 워크플로를 만들 필요는 없다. 트랜잭션 발송이 비활성/심사 상태이면 Brevo 화면의 활성화 절차가 필요하다. 발신 도메인 인증과 SMTP 발송 가능 상태는 별개다. [Brevo SMTP](https://help.brevo.com/hc/en-us/articles/7924908994450-Send-transactional-emails-using-Brevo-SMTP) · [SMTP 키](https://help.brevo.com/hc/en-us/articles/7959631848850-Create-and-manage-your-SMTP-keys) · [발송 상태 문제](https://help.brevo.com/hc/en-us/articles/115000188150-Troubleshooting-Issues-with-Brevo-SMTP)

Vultr 공식 체험 배너는 US$250·최대 30일이며 실제 계정의 적용 금액/만료일이 기준이다. 만료 또는 소진 뒤 자원을 남겨두면 요금이 발생하고 정지만으로 과금이 끝나지 않는다. 만료 전 유지/이전과 백업 복구를 확인한다. 프로모션이 적용되지 않으면 서버 생성 전에 확인한다. [Vultr 가입 안내](https://docs.vultr.com/platform/create-an-account) · [프로모션 조건](https://docs.vultr.com/support/platform/billing/how-can-i-add-a-promotional-code)

## 프론트가 준비된 뒤 한 번에

- 카카오·네이버·구글 개발자 앱 생성/설정·필요한 검수. 정확한 콜백·동의 항목·키 저장 위치를 그 단계에 일괄 안내한다. 지금은 키를 준비하지 않아도 된다.
- 본인 실제 계획 1개 이상, 실제 할 일 5개 이상, 실제 실행 3개 이상과 개선점·본인 판단을 화면에 입력한다. 테스트/AI 예시로 대신하지 않는다.
- 가입·비밀번호 재설정 메일이 본인 수신함에 도착하고 링크가 정상 작동하는지 함께 확인한다.

## 개발 작업으로 처리할 것

서버/컨테이너·DB 계정과 migration·암호화 백업·HTTPS·SMTP 환경 연결·프론트 구현·계약 타입·실제 동작 검증은 개발 작업에서 처리한다. 사용자는 서비스를 처음부터 수동 구성하는 법을 배울 필요가 없다. SSH/API 접근은 계정 준비 후 해당 환경의 비밀값 저장 방식으로 연결한다.

Vultr가 최종 선택이다. 사용자는 한 달 안에 이전할 것으로 예상하며 작은 클라우드 서버로 줄일 필요가 없다고 밝혔다. WTR 이전을 목표로 체험용 서울 AMD High Performance 8vCPU·16GB·350GB(서버 월 US$96)를 추천한다. 제공자 선택·플랜 추천과 실제 가입/구매/배포 완료는 구분한다. [Vultr 준비 순서](vultr-setup.md) · [비용 비교](cloud-options.md) · [프론트 API 안내](frontend-integration.md)
