# Vultr 설정과 이후 진행 목록

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


2026-09-08 배포 진행: Vultr `158.247.203.145`의 `/opt/pds`에 MariaDB 12.3.3·Spring Boot API·Caddy를 배포했다. V1~V3와 21개 표·131개 열·키 항목 94개·CHECK 26개를 확인했고, 내부 API 15개 점검과 별도 임시 스키마의 21개 표 복원 대조가 통과했다. Brevo STARTTLS 인증·테스트 메일 접수와 Spring 메일 상태 검사가 성공했으며, 사용자가 네이버 받은편지함 도착을 확인했다.

현재 남은 작업: 프론트는 사용자 확인상 미구현이며 기본 주소 /는 준비 중 안내와 HTTP 503을 반환한다. 소셜 외부 설정은 프론트 완성 뒤 진행한다. 외부 암호화 백업 저장소·예약/복구와 전체 과제 인수 검증은 남아 있다. Chicago 45.76.27.48은 사용자가 직접 삭제했다고 확인했다.

이전 Chicago 관찰 기록: 사용자 제공 서버 상세 화면에서 45.76.27.48 / pds-cloud-01 / Chicago / 8vCPU·16384MB·350GB NVMe / Ubuntu 26.04 LTS x64 / linuxuser / 자동 백업 Enabled를 확인했다. 이전 배포 선택 화면의 Seoul과 실제 생성 지역이 다르며 원인은 미확정이다. 이 인스턴스에는 Docker·앱·DB 설치를 진행하지 않았다. 이후 사용자가 해당 Chicago 서버를 직접 삭제했다고 확인했다.

2026-09-08. 사용자 제공 화면에서 서울 Shared CPU AMD High Performance `vhp-8c-16gb-amd`(8vCPU·16GB·350GB), Ubuntu 26.04 LTS x64, 자동 백업 ON, 수량 1, 합계 월 US$115.20(화면 시간당 US$0.158)을 확인했다. 이는 배포 전 선택 화면의 기록이며, 이후 실제 SSH·Docker 확인 결과는 위 최신 기록을 따른다. 새 서버의 자동 백업과 실제 크레딧 적용·만료일은 미확인이다.

## 다른 PC·Mac에서도 관리할 때

현재 적용 순서: 다른 PC·Mac의 SSH 키·방화벽 등록은 필요할 때까지 보류하고, 현재 Windows PC의 키로 Vultr 서버 구성을 이어간다. SSH는 Vultr와 NAS 모두에서 서버 관리에 쓰일 수 있다. Mac용 준비 도구는 보관만 하며 추가 PC 등록·실제 방화벽 변경은 실행하지 않았다.

[Mac 접속 준비 안내](remote-access.md)와 [비밀값 없는 준비 ZIP](downloads/pds-access-kit.zip)을 추가했다. 각 PC에서 별도 키를 생성하고 실행 서버에 공개키를 추가하며, 기존 pds-web에 접속 네트워크별 SSH 22번 /32 규칙을 추가한다. 기존 Windows의 키·허용 규칙을 먼저 지우지 않는다. Mac용 도구는 PDS 전용 SSH 설정을 사용하고 기존 ~/.ssh/config를 수정하지 않는다. 아래 키 경로는 현재 Windows PC 전용이다.

## 1. 배포 전에 SSH 공개키 등록

이 PC에서 전용 Ed25519 키를 생성했다. Vultr 등록은 아직 하지 않았다.

- Account → SSH Keys → Add SSH Key.
- 이름: `pds-vultr-admin`.
- 공개키: `D:/workspace/PDC_Diary/.local/vultr/pds-vultr-ed25519.pub` 파일의 `ssh-ed25519`로 시작하는 한 줄 전체를 붙여 넣고 저장.
- 개인키: 같은 경로의 확장자 없는 `pds-vultr-ed25519`. Vultr 입력란·채팅·노션·Git에 복사하지 않는다. 이 PC에서 접속할 때 사용한다.
- 키 폴더는 Git 제외 및 Windows 접근 권한 제한을 확인했다. 공개키 지문은 `SHA256:h8vLe2AcBNhdDpyWVmIc/lpqclnT9kbC+ajW/p/Pl2o`다.

[공식 SSH 키 등록](https://docs.vultr.com/products/orchestration/ssh-keys/add-ssh-keys)

## 2. 방화벽 그룹 등록

현재 배포 화면을 남겨 두고 다른 탭에서 Products → Network → Firewall → Add Firewall Group으로 이동한다. 그룹 이름/설명은 `pds-web`을 사용한다. Inbound IPv4 Rules에 아래 세 규칙을 추가한다.

| 용도 | 프로토콜 | 포트 | Source |
| --- | --- | --- | --- |
| 관리자 접속 | TCP / SSH | 22 | My IP — 현재 접속 중인 PC의 공인 IPv4 한 개(/32) |
| 웹 HTTP·인증서 발급 | TCP / HTTP | 80 | Anywhere / 0.0.0.0/0 |
| 웹 HTTPS | TCP / HTTPS | 443 | Anywhere / 0.0.0.0/0 |

규칙마다 Add Firewall Rule로 저장한다. SSH의 My IP는 현재 브라우저가 사용하는 네트워크 기준이다. 접속 PC가 늘거나 공인 IP가 바뀌면 필요한 /32 규칙을 추가하고 새 접속을 확인한 뒤 사용하지 않는 규칙만 정리한다. 같은 공유기의 공인 IPv4가 같으면 규칙 하나를 공유한다. DB 3306/3919와 API 8080·웹 내부 3000 포트는 열지 않는다. MariaDB는 Docker 내부망에서 3306을 쓰며 기존 사용자 PC의 3919 DB는 건드리지 않는다.

[공식 방화벽 규칙](https://docs.vultr.com/products/network/firewall-groups/management/rules) · [My IP 선택 안내](https://docs.vultr.com/how-to-use-vultrs-broadcaster-marketplace-app)

## 3. 배포 화면의 최종 선택값

| 화면 항목 | 선택/입력값 |
| --- | --- |
| Plan / Location | 현재 선택 유지: Shared CPU AMD High Performance, 8vCPU·16GB·350GB, Seoul |
| Image Selection | Operating System |
| Operating System | Ubuntu |
| Image Version | Ubuntu 26.04 LTS x64 — 현재 선택 유지 |
| SSH Keys | 위에서 등록한 pds-vultr-admin |
| Startup Script | 선택 안 함 |
| Firewall Group | 위에서 등록한 pds-web |
| Server 1 Hostname | pds-cloud-01 |
| Server 1 Label | pds-cloud-01 |
| Instance Connectivity | Instance(s) with Public IP |
| Public IPv4 / Public IPv6 | IPv4 ON / IPv6 OFF |
| VPC Network | OFF |
| Automatic Backups | ON 유지 — 월 US$19.20 추가 |
| DDoS Protection | OFF |
| Limited User Login | ON으로 변경 |
| Cloud-Init User Data | OFF |
| Quantity | 1 |
| Total Price | 화면 기준 US$115.20/mo, US$0.158/hr |

Docker 공식 설치 문서는 Ubuntu 26.04 LTS와 x86_64를 지원 대상으로 명시한다. Limited User Login은 일반적으로 `linuxuser`를 만들고 선택한 공개키를 설치하며 관리 명령은 sudo로 실행한다. 실제 생성 후 표시된 사용자명과 SSH 접속을 확인한다. 자동 백업 유지가 이번 권장값이며 DB 일관 덤프·외부 암호화 백업과 복원 검증은 별도로 수행한다.

[Docker 지원 OS](https://docs.docker.com/engine/install/ubuntu/) · [Vultr 일반 사용자와 SSH 키](https://docs.vultr.com/support/platform/ssh-keys/how-do-i-use-an-ssh-key-with-a-non-root-user-on-a-vultr-instance) · [자동 백업 비용](https://docs.vultr.com/support/platform/billing/how-much-does-it-cost-to-enable-automatic-backups)

## 4. 크레딧 확인 후 서버 생성

1. Billing에서 실제 US$250 크레딧 적용 여부·만료일/시간대·현재 플랜과 백업의 적용 범위를 확인한다. 화면의 서버+백업 월 US$115.20은 250보다 작지만, 이 선택 화면만으로 실제 무료 적용을 확정할 수 없다. 세금·초과 사용·추가 저장소는 별도일 수 있다.
2. 위 키와 방화벽이 선택되었고 수량 1·견적이 맞으면 Deploy를 누른다.
3. Running이 되면 서버의 Public IPv4, Billing의 크레딧 금액과 만료일/시간대를 알려 준다. 비밀번호·API 키는 전달하지 않는다.
4. 개발 작업에서 최초 SSH 호스트 지문을 Vultr Console과 대조한 뒤 공개키 접속과 sudo를 확인한다. SSH 키 선택을 빠뜨렸다면 실행 서버를 재설치하는 버튼을 누르지 말고 콘솔에서 키를 추가하는 경로를 사용한다.

[프로모션 조건](https://docs.vultr.com/support/platform/billing/how-can-i-add-a-promotional-code) · [가입과 체험 종료](https://docs.vultr.com/platform/create-an-account) · [실행 서버의 키 변경](https://docs.vultr.com/how-to-add-and-delete-ssh-keys)

## 5. 서버 생성 후 사용자 준비물과 개발 순서

사용자가 준비할 나머지 항목:

- DNS 관리 서비스 이름과 관리 화면 접근. `plandosee.app`의 정확한 A/CNAME 레코드는 서버 IP 확정 후 안내한다.
- Brevo 기존 도메인의 Authenticated 상태, 발신자 이름/주소. 도메인 등록은 사용자 진술로 완료했으므로 다시 등록하지 않는다.
- SMTP login/key를 Git에서 제외한 로컬 `.env.brevo.local`에 입력한다. 파일이 없을 때만 루트 `.env.example`을 복사한다. SMTP key는 API key·계정 로그인 비밀번호와 다르다.
- 실제 인증/비밀번호 재설정 메일을 받을 본인 이메일 한 개.

개발 작업 순서:

1. 서버 지문 대조·SSH·Docker Engine/Compose와 시험 컨테이너 실행은 확인했다. 전체 OS 패키지 업데이트·Vultr 방화벽·복구 경로 확인은 남아 있다. [설치 증거](server-bootstrap-status.md)를 따른다.
2. 준비한 인프라 Compose로 내부 MariaDB·권한 분리·migration과 Caddy를 구성한다. 웹/API는 linux/amd64 이미지 digest를 고정한다. 프론트 이미지가 준비되기 전 전체 서비스 배포 완료로 기록하지 않는다.
3. DNS·HTTPS와 Brevo SMTP 587/STARTTLS를 연결한다.
4. 공개 과제와 개인 계정 접근 분리, 가입·인증·비밀번호 재설정의 메일 실수신, Swagger 계약에 따른 프론트 연동을 확인한다.
5. 외부 비공개 저장소를 정해 매일 일관 DB 덤프·암호화·7일 보관과 실제 복원 대조를 검증한다. 별도 저장소는 아직 선정/구매 전이다. Vultr 자동 백업만으로 이 검증을 대체하지 않는다.
6. 프론트 완성 후 카카오·네이버·구글 앱 등록·키·콜백·동의 항목·필요 검수와 실로그인을 한 번에 진행한다.

[전체 사용자 준비물](user-preparation.md) · [프론트 API 안내](frontend-integration.md) · [Swagger 안내](swagger/README.md)

## 6. 한 달 내 WTR Pro 이전

작은 클라우드 서버로 줄이지 않고 WTR Pro(5825U·32GB)로 이전하는 사용자 방향을 유지한다. 한 달 내 이전은 사용자 예상이며 정확한 이전일은 미확정이다.

1. 실제 크레딧 만료 약 1주 전을 목표로 WTR의 OS·외부 접속·저장 공간을 확인하고 같은 이미지/환경으로 별도 DB 예행 복원을 검증한다.
2. 만료 전에 최종 쓰기 중단 → 덤프 → 빈 대상 복원 → 데이터 대조 → DNS 전환과 서비스 검사를 완료한다.
3. WTR 전환과 외부 백업 복구가 확인된 후 기존 Vultr 인스턴스를 Destroy하고, 남은 유료 스냅샷/저장소 등도 확인해 필요한 데이터 보존 후 정리한다.

서버를 Stop해도 정상 과금된다. 자동갱신 해제만으로 비용 종료를 보장하지 않으며 인스턴스 과금 종료는 Destroy 기준이다. 자동 삭제·예약 알림·실제 서버 생성/배포/이전은 이번 설정 안내 작업에서 실행하지 않았다.

[정지 서버 과금](https://docs.vultr.com/products/compute/instances/cloud-compute/faq) · [인스턴스 삭제](https://docs.vultr.com/products/compute/instances/cloud-compute/management/destroy-instance)
