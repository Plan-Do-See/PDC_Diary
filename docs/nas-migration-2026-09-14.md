## 2026-09-14 · NAS web-server 이전 완료
사용자 요청에 따라 PlanDoSee의 프론트·API·DB를 Vultr에서 NAS의 web-server VM으로 이전했다. 운영 주소는 [plandosee.app](https://plandosee.app) 그대로다. Cloudflare의 기본 도메인 A 레코드를 211.194.175.156으로 변경했고 DNS only와 기존 메일 인증 레코드를 유지했다. 일반 외부 HTTPS 요청의 도착 IP가 NAS임을 확인했다.
Next.js·Spring·MariaDB는 원본과 동일한 이미지로 실행한다. DB 22개 표의 전체 행을 정렬한 덤프 SHA-256이 원본과 일치했고 Flyway V1~V4, DB 계정 권한도 대조했다. 사용자 1·계획 2·할 일 1·실행 기록 0은 전체 DB 집계이며 과제의 실제 기록 요건 충족을 뜻하지 않는다.
화면·정적 자산·API·문서·개인 API 401·CSRF 403/잘못된 입력 400·보안 쿠키 등 HTTP 검사 16개와 브라우저 랜딩/기존 공개 계획 표시를 확인했다. 초기 복원 스크립트에 V4 표의 쓰기 권한이 빠져 잘못된 입력 검사에서 401이 발생했으며, 원본의 실제 권한 복원 후 같은 검사가 400으로 통과했다. 실제 기록이나 시험 메일은 생성하지 않았다.
Vultr 158.247.203.145의 앱·DB·프록시는 모두 중지했고 원본 볼륨과 백업은 보존했다. 인스턴스 삭제와 과금 종료는 수행하지 않았다. 소셜 로그인 보류와 전체 과제 인수 미완료는 유지한다. NAS 재부팅 복구·실제 계정 로그인/메일 실수신·외부 정기 백업·공인 IP 자동 갱신은 이번에 검증하지 않았다.

### 현재 운영 경로
VM은 4vCPU·메모리 4GB이고 이전 후 약 2.8GiB의 가용 메모리를 관찰했다. 관리 접속은 기존 Tailscale의 `nogravybeef@100.75.23.19`, LAN 주소는 `192.168.0.22`다. 배포 폴더는 `/home/nogravybeef/plandosee`, Compose는 `compose.yaml`과 `compose.nas.yaml`을 함께 사용한다.
공유기의 기존 TCP 80·443 → VM 전달을 공유하며, 포트폴리오 스택의 공통 Caddy가 HTTPS를 처리한 뒤 `127.0.0.1:18082`의 PlanDoSee 내부 프록시로 전달한다. 내부 프록시가 API 경로는 `api:8080`, 화면은 `web:3000`, 문서는 정적 파일로 보낸다. DB는 전용 내부 네트워크의 3306이며 외부에 노출하지 않는다. 전달된 클라이언트 IP는 지정한 Docker 게이트웨이만 신뢰한다.
백업은 NAS `/home/nogravybeef/pds-nas-migration`과 원본 Vultr `/home/linuxuser/pds-nas-migration`에 있다. 비밀값·DB 덤프·인증서는 비공개 보관하며 Git/노션에는 복사하지 않는다. 서비스 재배포 시 NAS override를 생략하면 80/443 충돌이나 설정 누락이 발생할 수 있으므로 아래 명령을 사용한다.
```bash
cd /home/nogravybeef/plandosee
sudo docker compose -f compose.yaml -f compose.nas.yaml --profile web ps
sudo docker compose -f compose.yaml -f compose.nas.yaml --profile web config --quiet
```

### 이전 증거와 복구 주의
- 전체 22개 표의 정렬된 데이터 덤프 SHA-256: b501feaa351f2d814dce0e2429cc97947744414915c8952c6763057bd76edb41
- 웹 이미지: sha256:5fc579eac58e3baec01700c8289211bfe1cd86e3b73fb7211c9018ab36d5cfac
- API 이미지: sha256:613f860110ff5cb76b574ddf4a924dc563094d88d2fd9b33e378fed516fd7ce6
- 기존 20260911T0505Z 실행 이미지를 이동했고 소스 재빌드·DB 스키마 변경은 하지 않았다.
- 원본 데이터 대조는 NAS API 재시작 전에 수행했다. 이후 세션·운영 작업으로 생기는 변화까지 원본과 같다고 주장하지 않는다.
- 원본 runtime/migration 계정의 SHOW GRANTS를 비공개로 복원하고 행 순서를 정렬해 일치를 확인했다. 과거 서버 provision-db.sh만으로 권한 복원을 끝내지 않는다.
- DNS 캐시 전환 중에는 원본 프록시만 NAS로 임시 전달했고, 이후 원본 네 컨테이너를 모두 중지했다. 원본 서버 재가동을 자동 복구 절차로 사용하지 않는다.
- NAS에서 새로 저장한 데이터가 생겼다면 이전 Vultr DB는 오래된 사본이다. 롤백 전에 NAS의 최신 DB를 안전하게 확보하고 단일 쓰기 서버를 유지해야 한다.
- NAS Compose의 API/web read-only, 비특권 실행, 1.5GiB/1GiB 한도와 별도 DB/네트워크를 유지한다. 실제 부하 시험은 이번에 하지 않았다.
- HTTP 16개 확인 시각: 2026-09-14T02:32:52Z. 브라우저 랜딩과 공개 계획 표시를 추가 확인했다. 기존 계정 로그인·전체 쓰기 기능·실제 메일 실수신은 이번 이전에서 재시험하지 않았다.
- VM 재부팅 복구, 외부 정기 백업, 공인 IP 자동 갱신 및 Vultr 인스턴스 삭제는 남아 있다. 수동 DNS A 레코드이므로 집 공인 IP 변경 시 갱신이 필요하다.