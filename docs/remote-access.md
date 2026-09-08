# 다른 PC·Mac에서 서버 관리하기

현재 적용 순서: 다른 PC·Mac의 SSH 키·방화벽 등록은 필요할 때까지 보류하고, 현재 Windows PC의 키로 Vultr 서버 구성을 이어간다. SSH는 Vultr와 NAS 모두에서 서버 관리에 쓰일 수 있다. Mac용 준비 도구는 보관만 하며 추가 PC 등록·실제 방화벽 변경은 실행하지 않았다.

2026-09-08 사용자 요청: 다른 컴퓨터, 특히 Mac에서 SSH·방화벽·접속 환경을 빠르게 준비할 수 있게 한다. PC마다 Ed25519 키를 만들고 개인키는 그 PC에만 보관한다. 서비스 설정은 서버에 유지하며 관리 PC가 바뀌었다고 앱·DB를 다시 설치하지 않는다.

## 준비한 파일

- [Mac으로 옮길 ZIP](downloads/pds-access-kit.zip): 안내·두 Bash 스크립트·접속 정책·검증 기록만 포함한다. 개인키·SMTP/API 비밀값·실제 서버 IP는 없다.
- [전체 사용 안내](../workspaces/PDC_Diary_Infra/access/README-KO.md): 인프라 저장소의 정본. ZIP에도 같은 안내가 포함된다.
- [접속 정책](../workspaces/PDC_Diary_Infra/access/access-policy.json): PC별 키·허용 포트·현재 적용 상태.
- [실제 검증 기록](../workspaces/PDC_Diary_Infra/access/verification.json).

ZIP을 Mac에 복사해 압축을 푼 뒤 그 폴더에서 다음을 실행한다. `macbook`은 장치를 구분할 이름이다.

```bash
bash pds-access.sh setup macbook
bash pds-access.sh network
```

첫 명령은 암호 입력을 받아 키를 만들고 공개키·등록용 파일을 준비한다. 두 번째 명령은 현재 터미널의 공인 IPv4를 api.ipify.org에서 조회하여 방화벽에 넣을 `/32`를 표시한다. 조회가 안 되면 Vultr 화면의 My IP를 사용한다.

## 최초 한 번 등록

Mac에서 `pbcopy < ~/.ssh/pds/id_ed25519.pub`로 공개키를 복사한다. 공개키와 PC 이름을 이 작업에 전달하면 기존 관리자 접속으로 서버에 추가할 수 있다. 서버 IP·관리자 접근이 아직 없으므로 실제 등록은 하지 않았다.

서버 생성 전에는 Vultr Account → SSH Keys에 등록하고 배포할 때 선택한다. 생성 후에는 실행 서버의 `authorized_keys`에 추가해야 한다. Vultr 계정에 등록만 해서는 실행 서버에 적용되지 않는다. 재설치 버튼을 사용하지 않는다. [Vultr 공식 설명](https://docs.vultr.com/how-to-add-and-delete-ssh-keys)

`setup`이 만든 `~/.ssh/pds/server-enroll.sh`는 공개키만 포함한다. 필요하면 기존 관리자 또는 웹 Console로 서버에 전달하고 등록 대상인 `linuxuser`로 실행한다. 기존 키 백업·동일 키 중복 방지·제한 옵션 보존을 포함하며 root 실행을 거부한다.

Mac의 Vultr 브라우저에서 기존 **pds-web** 그룹에 **TCP 22 / My IP(/32)** 규칙을 추가한다. 기존 Windows 규칙과 80/443 공통 규칙을 유지한다. 같은 공유기의 공인 IPv4가 같으면 규칙 하나를 공유한다. 그룹의 서버 연결도 확인한다. 3919/3306/8080/3000은 공개하지 않는다. [방화벽 규칙](https://docs.vultr.com/products/network/firewall-groups/management/rules)

## 이후 접속

아래의 설명용 주소를 실제 Vultr Public IPv4로 바꾼다.

```bash
bash pds-access.sh configure cloud 203.0.113.10
bash pds-access.sh connect
```

기존 `~/.ssh/config`는 수정하지 않는다. 생성되는 PDS 전용 설정을 써서 도구 폴더 없이도 접속할 수 있다.

```bash
ssh -F ~/.ssh/pds/cloud.conf pds-cloud
```

최초 접속은 웹 Console에서 확인한 서버 ED25519 지문과 대조한다. 도구는 지문 확인을 끄거나 기존 known_hosts를 삭제하지 않는다. 키·방화벽 등록 후 `whoami`·`sudo -v`로 계정과 권한을 확인해야 실제 접속 완료다.

장소가 바뀌면 키를 재생성하지 않고 `network`로 IP를 확인해 새 `/32` 규칙을 추가한다. 새 접속 검증 후 불필요해진 규칙을 정리한다. 브라우저와 SSH에 서로 다른 VPN/프록시가 적용되면 출발 IP가 다를 수 있다.

WTR 이전 후에는 `configure wtr 실제_WTR_IP 실제_사용자명`과 `connect wtr`를 사용한다. Vultr 설정은 보존하고 WTR의 공개키·방화벽·원격 관리 경로는 별도 확인한다. 실제 WTR IP·OS·사용자명·원격 접속은 아직 미확인이다.

## 검증 범위

Windows Git Bash 5.3.15와 실제 OpenSSH로 신규 키 생성·재실행 시 키/기존 SSH 설정 보존·설정 해석·잘못된 입력 차단·WTR 설정 분리·기존 서버 키 백업·중복 차단·제한 옵션 보존을 확인했다. 스크립트 문법 검사도 통과했다.

Windows의 Git Bash가 심볼릭 링크 대신 파일 복사를 수행하여 심볼릭 링크 차단의 실행 검사는 제외했다. 실제 Mac(Bash 3.2 포함)·Vultr SSH·방화벽·공인 IP 조회는 실행 전이다. API·DB 계약과 원문 44개 조건은 변경하지 않는다.

ZIP 재생성: 구상 저장소에서 `pwsh -File scripts/build-access-kit.ps1`. 명시한 파일 5개만 묶고 ZIP 내부 파일의 SHA-256을 정본과 대조한다. 인프라 정본이 아직 원격에 push되지 않아도 ZIP을 별도로 Mac에 전달할 수 있다.
