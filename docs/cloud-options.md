# 저가 클라우드 비교와 추천

2026-09-08 / **최종 제공자: Vultr(사용자 선택). 계정·구매·서버 생성·배포는 확인 전.**

## 현재 적용할 배포안

- 한 달 안에 WTR Pro로 이전할 것이라는 사용자 예상에 맞춰 체험용 Vultr 서울(icn), Shared CPU AMD High Performance `vhp-8c-16gb-amd`: 8vCPU·RAM 16GB·350GB, Ubuntu LTS amd64를 추천한다. 공식 카탈로그 서버 요금은 월 US$96이며 최종 견적·재고·주문은 미확인이다.
- US$250·최대 30일 체험의 실제 지급·대상 상품·만료일 확인 후 생성한다. 만료/소진 뒤 자원을 유지하면 과금되므로 그 전에 유료 유지 또는 복원 검증을 마친 WTR 이전을 결정한다.
- 서버 자동 백업은 선택 시 20% 추가(서버+자동 백업 US$115.20). 기존 7일 외부 암호화 DB 덤프는 유지하며 외부 저장소 비용·세금·초과량은 별도다. 추가 서비스는 아직 구매하지 않았다.
- Next.js·Spring·MariaDB·Caddy와 기존 이전 절차를 유지한다. 제공자 선택으로 원문 44개 요구·API/DB 계약을 변경하지 않는다.
- [사용자 준비물](user-preparation.md) · [Vultr 구성 안내](vultr-setup.md). AWS·Google Cloud·Oracle 가입은 현재 준비물에서 제외한다.

### 한 달 고사양 체험 후 종료/이전 검토

사용자는 작은 클라우드 서버로 줄일 필요가 없으며 한 달 안에 마이그레이션할 것으로 예상한다고 밝혔다. 현재 방향은 Vultr 체험 운영 후 기존 이전 대상인 WTR Pro로 전환하는 것이다. 정확한 이전일은 미확정이다. 크레딧 적용 범위·잔액·만료일을 확인하고 만료 전에 WTR의 앱/DB 복원·접근·데이터 대조와 DNS 전환을 마친 뒤 기존 Vultr 자원을 삭제한다. 자동갱신을 끄는 방식으로 비용 종료를 보장하지 않으며, 정지 상태도 정상 과금된다. 자동 삭제·알림·실제 주문/이전은 실행하지 않았다.

현재 공식 공개 API에서 서울(icn) 목록에 AMD High Performance 8vCPU·16GB·350GB(vhp-8c-16gb-amd) 월 US$96을 확인했다. 한 달 체험용으로 이 플랜을 추천한다. 자동 백업 선택 시 서버 합계는 월 US$115.20이며 세금·초과량·외부 백업 저장소 등은 별도다. 실제 재고·크레딧 대상 여부·주문 견적은 확인 전이며 플랜 추천과 주문 완료를 구분한다.

[정지 과금·다운그레이드 제한](https://docs.vultr.com/products/compute/instances/cloud-compute/faq) · [자원 삭제](https://docs.vultr.com/products/compute/instances/cloud-compute/management/destroy-instance) · [공식 가격 API](https://api.vultr.com/v2/plans?per_page=500)

아래 비교는 제공자 선택 전에 조사한 자료다. 과거 추천은 현재 선택을 대체하지 않는다.

## Oracle 가입 실패 후 대안 · 2026-09-08

사용자는 Oracle 가입이 안 된다고 알렸고 AWS와 Google Cloud 무료 체험은 둘 다 사용한 적 없다고 답했다. 오류 화면·원인은 미확인으로 두며 가입 실패의 원인을 추정하지 않는다. **Oracle을 보류하고 Google Cloud의 US$300·90일 체험을 우선 추천**한다. 실제 신규 체험 자격/결제수단 인증/혜택 적용은 해당 계정에서 확인해야 한다. 제공자를 확정하거나 계정을 생성하지 않았다.

| 후보 | 확인한 무료 조건 | 판단 |
| --- | --- | --- |
| Google Cloud Free Trial | 신규 자격 충족 시 US$300, 최대 90일. 유료 전환을 하지 않으면 소진/만료 때 서비스 중지 | 현재 우선 추천. Vultr보다 시험 기간이 길고 무료 체험 상태에서 자동 청구가 없음 |
| AWS Free plan | 신규 계정 US$100 지급 + 활동 완료 시 최대 US$100 추가. 최대 6개월 또는 크레딧 소진 중 빠른 시점에 종료 | 대안. 6개월 전체 운영을 보장하는 금액은 아니며 EC2 허용 유형·디스크·IPv4·백업 합계 확인 필요 |
| Vultr 프로모션 | 공식 US$250·최대 30일 배너. 개별 쿠폰 적용은 미확인 | 한 달 안에 배포/이전을 시험할 때 후보. 소진/만료 뒤 자원 유지 시 과금 |

[Google 체험 조건](https://docs.cloud.google.com/free/docs/free-cloud-features) · [AWS Free/Paid 플랜](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html) · [Vultr 체험 배너](https://docs.vultr.com/upgrade-one-click-wordpress) · [Vultr 과금](https://docs.vultr.com/platform/create-an-account)

Google은 이전 Free Trial 가입뿐 아니라 Google Cloud·Maps Platform·Firebase 유료 이용 이력도 자격 조건에 포함한다. 사용자의 답은 무료 체험 미사용을 확인한 것이며 그 외 자격까지 검증했다는 뜻은 아니다. 카드 등 결제수단 확인이 필요하며 무료 체험 상태에서는 이용료가 청구되지 않는다. 유료 계정으로 전환하면 크레딧 밖 사용이 과금될 수 있다. 업그레이드하지 않고 90일 경과 또는 US$300 소진 시 자원이 중지되고, 유예 기간 이후 데이터가 삭제될 수 있으므로 만료 전에 외부 백업·복원·이전을 마친다. [가입 FAQ](https://cloud.google.com/signup-faqs)

제안 구성은 **서울 asia-northeast3의 e2-medium(RAM 4GB·공유 CPU) + Ubuntu + Next.js·Spring·MariaDB·Caddy**다. 2 vCPU가 보이지만 지속 사용 CPU 합계는 1 vCPU 상당인 공유 유형이다. 공식 문서에서 서울 E2 지원을 확인했으며 실제 계정의 할당량·생성·4GB 부하 시험은 미검증이다. 빌드는 서버 밖에서 수행한다. 디스크·공인 IP·전송량·로그·백업까지 크레딧에서 소모되므로 서버 생성 전 견적 합계를 확인한다. [E2 사양](https://docs.cloud.google.com/compute/docs/general-purpose-machines) · [서울 리전](https://docs.cloud.google.com/compute/docs/regions-zones)

AWS는 Free plan을 선택하는 조건으로 비교한다. 유료 플랜 전환이나 Organizations 참여 등 자동 전환을 일으키는 기능을 사용하지 않은 Free plan에서는 사용 요금이 청구되지 않고 만료/소진 시 계정 접근이 종료된다. EC2 Free plan에는 지정 인스턴스 유형 제한이 있다. Lightsail 무료 체험 관련 공식 페이지의 안내가 서로 달라, Lightsail을 무료 플랜에서 무조건 사용할 수 있다고 보장하지 않는다. [플랜 조건](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/free-tier-plans.html) · [EC2 허용 유형과 Lightsail 비교](https://aws.amazon.com/free/compute/lightsail-vs-ec2/) · [Lightsail 과금 FAQ](https://docs.aws.amazon.com/lightsail/latest/userguide/amazon-lightsail-frequently-asked-questions-faq-billing-and-account-management.html)

**90일 이후 서버 임대료를 없애려면 이미 보유한 WTR Pro로 이전하는 안이 현실적인 후속 후보**다. 전기·회선·장비 밖 백업 비용과 운영 관리가 남으며 정확한 금액은 측정 전이다. 초기 클라우드 운영 후 이전한다는 사용자 결정을 유지하고, WTR OS/외부 접속/실복원은 후속 확인한다. Google의 지속 무료 e2-micro는 미국 일부 리전·1GB RAM 범위여서 현재 전체 구성의 장기 무료 대안으로 우선 추천하지 않는다.

지금은 배포 준비 시점에 Google Free Trial 계정과 크레딧 적용/만료 상태를 확인하면 된다. 프론트·이미지가 준비되기 전에 체험 기간을 불필요하게 소모하지 않는다. Brevo 준비물·소셜 로그인 외부 설정을 프론트 이후로 미루는 결정·API/DB 계약은 유지한다.

아래 Oracle/Vultr/Lightsail 설명은 앞선 비교 자료이며, Oracle 가입부터 진행하라는 이전 추천은 현재 보류다.

## Vultr 250달러 체험 조사 · 2026-09-08

**판단: 프론트와 배포 준비를 마친 뒤 첫 배포·메일·복원 시험용으로 쓰는 것은 추천할 만하다.** 계속 월 0원이 목표라면 Oracle Always Free가 기존 장기 무료 후보이며, Vultr는 최대 30일 체험 후 유료 유지 또는 이전이 필요한 후보다. 사용자는 Vultr 조사를 요청했으며 제공자 변경·가입·결제·배포를 확정하지 않았다.

### 공식 자료에서 확인한 조건

- Vultr 공식 문서의 가입 배너는 **US$250 / 30일**을 안내한다. 계정 생성 문서도 무료 크레딧을 최대 30일 제공한다고 설명한다. 적게 쓴 잔액을 여러 달에 걸쳐 사용하는 예산으로 계산하지 않는다.
- 유효한 카드 또는 PayPal 연결, 사용자당 프로모션 코드 1개, 크레딧 만료·양도 불가가 일반 조건이다. 카드 연결은 초기 입금 US$0 옵션과 소액 임시 승인 안내가 있으며 다른 결제 방식은 입금이 필요할 수 있다.
- 크레딧이 소진되거나 만료되기 전에 자원을 해제해야 추가 청구를 피할 수 있다. **인스턴스 전원을 꺼도 정상 요금이 발생하며 Destroy해야 해당 인스턴스 과금이 끝난다.** 데이터 복원 확인 뒤 불필요한 자원을 정리하고, 별도 스냅샷·볼륨 등 남은 자원도 확인한다.
- 사용자가 본 정확한 프로모션 URL은 제공되지 않았다. 광고 배너 외 개별 쿠폰의 신규 계정 자격, 적용 상품, 정확한 시작/만료 시각, 실제 지급·적용 여부는 미확인이다. 프로모션 상세 페이지는 웹 열기 오류 및 직접 조회의 Cloudflare 확인 페이지 때문에 내용을 확보하지 못했다. 가입 화면과 Billing에서 US$250 적용·만료·대상 상품을 확인한 뒤 서버를 생성한다.

[공식 250달러 배너](https://docs.vultr.com/upgrade-one-click-wordpress) · [가입·만료 후 과금](https://docs.vultr.com/platform/create-an-account) · [프로모션 공통 조건](https://docs.vultr.com/support/platform/billing/how-can-i-add-a-promotional-code) · [정지/삭제 과금](https://docs.vultr.com/products/compute/instances/cloud-compute/faq)

### 현재 요금과 프로젝트 적용

공식 공개 API `GET https://api.vultr.com/v2/plans?per_page=500`를 읽어 아래 값을 확인했다. 네 상품의 locations에 서울 `icn`이 있고 서울 별도 location_cost 항목은 없었다. 이는 카탈로그 확인이며 실제 계정의 배포 가능 재고·최종 견적·성능 시험은 아니다. [공식 가격 API](https://api.vultr.com/v2/plans?per_page=500) · [지역별 요금 안내](https://docs.vultr.com/support/platform/billing/is-pricing-the-same-in-all-data-center-locations) · [지역 코드](https://docs.vultr.com/vultr-server-status-json-endpoints)

| 상품 | vCPU / RAM / 디스크 | 서버 월 요금 | 자동 백업 선택 시 서버 합계 |
| --- | --- | --- | --- |
| Regular `vc2-1c-2gb` | 1 / 2GB / SSD 55GB | US$10 | US$12 |
| Regular `vc2-2c-4gb` | 2 / 4GB / SSD 80GB | US$20 | US$24 |
| AMD High Performance `vhp-1c-2gb-amd` | 1 / 2GB / 50GB | US$12 | US$14.40 |
| AMD High Performance `vhp-2c-4gb-amd` | 2 / 4GB / 100GB | US$24 | US$28.80 |

자동 백업 추가 요율은 서버 기본 요금의 20%다. 위 합계에는 세금·초과 전송·추가 저장소·스냅샷·외부 DB 백업 저장소 등이 포함되지 않는다. 자동 백업은 최근 2개이며 기존 7일 암호화 DB 덤프·외부 복원 검증을 대신하지 않는다. [백업 요율](https://docs.vultr.com/support/platform/billing/how-much-does-it-cost-to-enable-automatic-backups) · [백업 보관 범위](https://docs.vultr.com/vps-automatic-backups)

제안은 **서울 Shared CPU Regular 2vCPU·4GB 한 대에 Next.js·Spring·MariaDB·Caddy**다. 10명이라는 수만으로 충분하다고 확정하지 않으며 완성 이미지를 실행해 메모리·응답·백업 복구를 확인한다. 빌드는 서버 밖에서 수행한다. 2GB는 절약 후보지만 세 프로세스의 실제 메모리를 측정한 뒤 판단한다. 체험 금액을 소진하려고 큰 서버를 선택할 이유는 없다. 예를 들어 월 US$20 상품에서 체험 중 US$20만 차감됐어도 만료된 나머지 US$230을 다음 달 요금에 쓰는 식으로 계산할 수 없다.

Brevo는 기존 SMTP 587·STARTTLS 구성을 유지할 수 있다. Vultr 공식 문서는 기본 차단이 outbound 25이며 외부 SMTP의 465/587 사용을 허용한다고 설명한다. 실제 배포 서버→Brevo 접속·수신함 도착은 별도 검증 전이다. [SMTP 정책](https://docs.vultr.com/support/products/compute/why-is-smtp-blocked)

Vultr 일반 Intel/AMD 서버와 WTR 5825U는 amd64 환경으로 구성할 수 있어 OCI A1의 ARM용 이미지 검증 부담을 피할 수 있다는 설계상 이점이 있다. 컨테이너·MariaDB 덤프·비밀값·DNS 전환 절차는 기존 이전 준비를 사용하되 실복원/전환 시험은 필요하다. 프론트와 배포 이미지가 준비될 때 체험을 시작하고 만료 약 1주 전에 유료 유지 또는 준비된 WTR/다른 클라우드 이전을 결정하는 안을 추천한다. 실제 알림 예약·자동 삭제·배포는 생성하지 않았다.

## 무료 우선 후속 추천

사용자는 10명 규모에서 무료 호스팅을 먼저 검토하도록 요청했다. **Oracle Always Free A1에 웹·Spring·MariaDB를 함께 올리는 안을 먼저 시도**하도록 추천을 조정한다. 기존 유료 추천은 운영 편의를 우선한 판단이었으며 무료 이용이 불가능하다는 뜻이 아니었다. 아직 Oracle을 사용자 확정 제공자로 기록하거나 자원 확보에 성공했다고 주장하지 않는다.

현재 무료 계정 한도는 합계 2 OCPU·12GB, 부트/블록 볼륨 합계 200GB다. MariaDB는 VM의 영구 볼륨에서 직접 운영하므로 DB 종류를 바꾸지 않는다. 30일 체험 크레딧을 쓰는 임시 무료 자원과 Always Free를 구분한다. 자원 부족이면 생성이 안 될 수 있고 미사용 조건에 따른 회수·무료 SLA 부재가 있다. 그 조건을 감수하고 소규모 시험 운영을 시작할 수 있다는 추천이며 용량·가용성을 보장하는 것은 아니다.

백업은 VM 밖 비공개 OCI Object Storage에 일관 DB 덤프를 암호화해 7일 보관하는 안이다. 처음에는 Standard 저장량을 5GB 이하로 제한하고 객체 요청량도 확인한다. 공식 문서는 계정 상태에 따라 Standard 10GB 또는 전체 20GB 무료량을 구분하므로 가입 계정의 실제 무료 표기를 먼저 확인한다. Restic의 OCI S3 호환 연결·복원은 아직 실행하지 않았다. [OCI 무료 자원](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm) · [가입/카드/무료 SLA FAQ](https://www.oracle.com/cloud/free/faq/)

Render 무료 서비스는 15분 미사용 시 잠들고 영구 디스크를 제공하지 않으며 무료 PostgreSQL은 30일 만료다. Koyeb 무료는 512MB·0.1vCPU·볼륨 불가·미사용 1시간 후 중지다. 따라서 이 무료 상품만으로 현재 MariaDB 영구 저장까지 운영하는 구성은 맞지 않는다. 무료 호스팅 유무보다 DB 영속성과 실행 환경 조건이 선택 기준이다. [Render 무료 조건](https://render.com/docs/free) · [Koyeb 무료 조건](https://www.koyeb.com/docs/reference/instances)

OCI A1은 ARM이므로 linux/arm64 컨테이너를 빌드·검증하고 WTR의 5825U는 linux/amd64 이미지를 사용한다. 코드·MariaDB 덤프/복원 형식은 유지하고 같은 릴리스의 플랫폼별 이미지 digest를 기록한다. 홈 리전은 가입 때 서울을 우선 검토하되 가입 가능 여부·자원 가용성을 확인한다. 실제 계정·카드/키는 사용자만 준비하고 배포·검증은 개발 작업에서 진행한다.

## 앞선 유료 대안

무료 자원을 확보하지 못하거나 운영 조건이 맞지 않을 때 AWS Lightsail 서울 Linux IPv4 2GB 서버와 비공개 객체 저장소를 유료 대안으로 검토한다. 서버 US$12 + 저장소 US$1 = **월 US$13부터**다. 한국 중심 이용을 가정했고, WTR Pro로 이전할 시기가 미정이므로 연간 선납 없이 시작하는 것을 권한다. 이는 조사한 후보 중 운영 시작 조건이 명확한 절약안이라는 판단이며, 시장 전체 최저가나 실제 생성 성공을 뜻하지 않는다.

초기 약 10명이라는 정보만으로 용량을 보장하지 않는다. 완성 이미지를 서버에서 실행하고 SSR·저장·집계·동시 내보내기에서 메모리·응답을 확인한다. 2GB가 부족하면 4GB(서버 US$24 + 저장소 US$1 = 월 US$25부터)를 검토한다. Linux 운영·패치·백업 복구는 우리가 구성하고 관리해야 한다. [Lightsail 공식 가격](https://aws.amazon.com/lightsail/pricing/) · [서울 리전](https://docs.aws.amazon.com/lightsail/latest/userguide/understanding-regions-and-availability-zones-in-amazon-lightsail.html)

## 확인한 가격과 조건

| 후보 | 공식 표시 기준 | 이번 판단 |
| --- | --- | --- |
| Lightsail 서울 Linux IPv4 2GB | 2 vCPU·60GB SSD·3TB 전송, 서버 월 US$12 | 무료 확보가 어려울 때의 유료 대안. 생성·성능 미검증 |
| Lightsail 서울 Linux IPv4 4GB | 2 vCPU·80GB SSD·4TB 전송, 서버 월 US$24 | 2GB가 부족할 때 검토 |
| OVHcloud VPS-1 2027 | 2 vCore·4GB·40GB NVMe, Asia 사이트 US$4.54부터 | 더 저렴한 후보. 상품 연결 견적의 pricing=upfront12는 12개월 선납을 가리킨다. 이를 월 단위 해지 가능한 US$4.54로 해석하지 않음. 월납·지역별 실제 합계·싱가포르 재고 미확인 |
| Oracle Always Free A1 | 공식 현재 기준 합계 2 OCPU·12GB, 월 1,500 OCPU시간·9,000 GB시간 무료 | 무료 우선 요청에 따른 첫 시도 후보. 자원 부족·미사용 회수 조건을 확인하며 실제 확보 전 |
| Hetzner 유럽 CX23 | 2 vCPU·4GB·40GB, 기본 월 €5.49, IPv4·백업·세금 별도 | 상품 페이지에 not available / currently unavailable 표시. 한국 지연과 실제 구매 미검증 |

OVH의 싱가포르 페이지는 VPS-1을 S$5.78부터 표시한다. 국가별 결제 사이트·통화와 선택 지역이 실제 견적에 영향을 줄 수 있으므로 USD 광고 최저가를 싱가포르 월납 확정 가격으로 쓰지 않는다. 아시아 VPS-1 전송량은 월 500GB 이후 10Mbps 제한이라는 각주가 있어 본문의 무제한 문구만으로 판단하지 않는다. 포함 백업은 직전 24시간으로 설명되어 있으며, 우리가 요구한 7일 DB 덤프 보관·복구 검증을 대체하지 않는다. [OVH Asia 요금](https://www.ovhcloud.com/asia/vps/) · [싱가포르 상품](https://www.ovhcloud.com/en-sg/vps/vps-singapore/) · [연결된 선납 견적](https://www.ovhcloud.com/asia/vps/configurator/?brick=VPS%2BModel%2B1&planCode=vps-2027-model1&pricing=upfront12&processor=+&storage=40__SSD__NVMe&vcore=2__vCore)

Oracle 공식 문서의 무료 A1 용량은 과거의 4 OCPU·24GB 설명과 다르다. 현재 Always Free 계정 문구인 2 OCPU·12GB를 사용했다. CPU·네트워크·메모리의 미사용 조건과 회수 가능성을 확인했다. ARM 선택 시 이미지 빌드와 동작 검증도 추가로 필요하다. [Oracle Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)

Hetzner는 2026-06-15 가격 조정의 새 가격을 확인했다. [가격 조정](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/) · [현재 상품 상태](https://www.hetzner.com/cloud/cost-optimized/)

Vultr 가격 HTML 본문은 확보하지 못했지만 후속 조사에서 공식 공개 API의 요금을 읽었다. 현재 확인값과 250달러 체험 조건은 이 문서 상단에 기록했다.

## 실제 예산 범위와 다음 단계

- Lightsail 백업 저장소 US$1은 5GB 저장·25GB 전송 한도다. 매일 암호화된 일관 DB 덤프를 서버 밖에 7일 보관하며 총 보관량과 복원 결과를 확인한다.
- 위 합계는 서버와 해당 백업 저장소만 포함한다. 세금·환율·도메인 갱신·Brevo 유료 사용·전송/저장 초과·추가 스냅샷·CI/이미지 저장 비용은 별도다. 스냅샷은 과금 대상 GB당 월 US$0.05다. 무료 체험을 정상 비용에서 빼지 않았다.
- 제공자·계정 선택 뒤 정확한 월납 견적, 사용 한도와 과금 알림을 확인하고 서버 생성으로 진행한다. 아직 계정 가입·선납·결제·서버 생성은 실행하지 않았다.
- 기존 Docker Compose·MariaDB·Brevo SMTP와 WTR 이전 준비를 유지한다. 이 추천 때문에 API·DB 계약이나 원문 44개 조건은 변경하지 않았다.
