# Vultr 서버 설치 진행 기록

최신 배포 증거: [DB·백엔드·메일 배포 진행](deployment-status.md) — 내부 API·21개 표 복원·메일 수신 확인, 공개 DNS/HTTPS·API·Swagger 확인 완료, 프론트는 미구현.


Docker 설치 당시 기록 · 2026-09-08 18:06 KST: 새 Vultr `158.247.203.145`에 SSH 공개키로 접속했고, Ubuntu 26.04.1 LTS x86_64·8 vCPU·약 16GB RAM·350GiB 디스크를 확인했다. cloud-init의 region은 `kr`(한국), availability_zone은 null이다. 한국 지역은 확인했으며 관리 화면의 Seoul 표시는 재확인 전이다. 공식 Docker Engine 29.8.0·Compose 5.5.1 설치, 서비스 active/enabled와 `hello-world` 실행을 확인했다. 앱·DB 컨테이너와 DNS/HTTPS는 아직 배포하지 않았다.

## 직접 확인한 결과

- 검증 시각: 2026-09-08T09:06:35Z (18:06:35 KST).
- SSH 사용자 `linuxuser`, hostname `pds-cloud-01`, sudo 비대화형 실행 가능.
- 서버 ED25519 지문 `SHA256:If3Z8M4Qx4O/Y16H+xBqNipYfE7pKNup3+E3mI6ieZY`이 사용자 제공 Vultr Console 출력과 일치한다. 로컬 known_hosts에 고정하고 StrictHostKeyChecking=yes로 접속했다.
- Ubuntu 26.04.1 LTS, x86_64, 8 vCPU, RAM 16,220,078,080 bytes, 디스크 375,809,638,400 bytes(350GiB), swap 약 8GiB.
- cloud-init status=done, v1.region=kr, v1.availability_zone=null. 도시명은 이 출력만으로 확정하지 않는다.
- Docker Engine 29.8.0, Compose 5.5.1, containerd 2.3.4, Buildx 0.37.0.
- 공식 서명 APT 저장소로 설치한 스크립트 종료 코드 0. `docker run --rm hello-world` 성공 후 시험 컨테이너 자동 제거.
- 독립 SSH 재조회: Docker active/enabled, 컨테이너 목록 비어 있음, 재부팅 요구 없음.
- TCP 리스너는 외부 주소의 SSH 22와 루프백 DNS 53만 관찰했다. DB·API·웹 포트를 공개하지 않았다. Vultr 방화벽 규칙 자체는 미확인이다.
- apt 출력에 기존 패키지 10개 미업그레이드가 있었다. 이번에는 Docker 설치에 필요한 작업만 수행했으며 전체 OS 패치 완료로 기록하지 않는다.

## SSH 키 권한 복구

SSH 접속 복구: 사용자 승인에 따라 기존 로컬 개인키 하나의 소유자를 Administrator로 바꾸고 Administrator·SYSTEM만 접근하도록 ACL을 제한했다. 키 지문은 유지됐고 이후 공개키 인증에 성공했다. 키 복사 제안은 자동 승인 검토에서 거부되어 실행하지 않았으며, 승인된 기존 파일의 권한 수정으로 해결했다.

처음에는 파일 소유자가 CodexSandboxOffline인 반면 SSH 프로세스는 Administrator였고, 읽기 권한 추가 후에도 OpenSSH가 too open / bad permissions로 거부했다. 승인된 ACL 정리 후 같은 키로 인증에 성공했다. 개인키 내용은 문서·노션·Git에 복사하지 않았다.

Windows ssh-keyscan은 unsupported KEX method 오류를 냈지만 일반 ssh는 정상적으로 키 교환했다. 서버 공개키 등록 오류나 서버 전체 SSH 장애로 단정하지 않는다.

## 재현 가능한 설치 준비물

- 인프라 `scripts/host-preflight.sh`: OS·자원·cloud-init·sudo·Docker를 읽으며 환경 변수나 cloud user-data를 출력하지 않는다.
- 인프라 `scripts/bootstrap-docker.sh`: Ubuntu amd64에서 공식 서명 저장소로 Engine/Compose를 설치하고 hello-world를 실행한다. 기존 비관리 Docker 저장소·충돌 패키지는 제거하지 않고 중단한다.
- 두 스크립트 모두 로컬 Bash 문법 검사와 원격 실행을 통과했다. 서버 임시 작업 경로는 `/home/linuxuser/pds-bootstrap.h0bgLZ`다.
- 상세 버전과 실제 판정은 인프라 `releases/host-bootstrap-verification.json`에 기록한다.

## 남은 작업과 미확인 사항

현재 남은 작업: 프론트는 사용자 확인상 미구현이며 기본 주소 /는 준비 중 안내와 HTTP 503을 반환한다. 소셜 외부 설정은 프론트 완성 뒤 진행한다. 외부 암호화 백업 저장소·예약/복구와 전체 과제 인수 검증은 남아 있다. Chicago 45.76.27.48은 사용자가 직접 삭제했다고 확인했다.

이번 작업에서 서버 신규 주문·기존 Chicago 삭제·OS 전체 업그레이드·서버 재부팅·추가 PC 키 등록은 실행하지 않았다. 기존 사용자 MariaDB 3919와 API/DB 계약, 원문 44개 조건은 변경하지 않았다. 앱 이미지·운영 secret·외부 백업 저장소가 준비되기 전에는 전체 Compose를 실행하지 않는다.

[Docker 공식 Ubuntu 설치](https://docs.docker.com/engine/install/ubuntu/)
