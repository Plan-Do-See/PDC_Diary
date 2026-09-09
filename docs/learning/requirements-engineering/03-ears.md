# 03 · EARS 요구사항 문장

[Notion 문서](https://app.notion.com/p/3d60def9f62681a8b0bfd826fc7a1b95?pvs=204)

<mention-page url="https://app.notion.com/p/3d60def9f62681c2bca2cf1e7c4263f6"/>
**EARS = Easy Approach to Requirements Syntax.** 조건이 적용되는 상태·사건과 시스템의 응답을 일정한 문장 구조로 표현한다.
> \[사전 상태\]에서 \[사건\]이 발생하면, \[시스템\]은 \[관찰 가능한 결과\]를 보장해야 한다.
위 문장은 설명을 위한 한국어 적용 형태다. 항상 적용되는 요구처럼 상태·사건이 필요 없는 패턴도 있다.
| 패턴 | 쓸 때 | 문장 뼈대 |
| --- | --- | --- |
| 항상 적용 · Ubiquitous | 특정 사건 없이 유지할 규칙 | 시스템은 …해야 한다. |
| 사건 · Event-driven | 특정 사건에 응답 | When 사건, 시스템은 …해야 한다. |
| 상태 · State-driven | 특정 상태인 동안 | While 상태, 시스템은 …해야 한다. |
| 원하지 않는 상황 · Unwanted behaviour | 오류·비정상 상황 처리 | If 상황, then 시스템은 …해야 한다. |
| 선택 기능 · Optional feature | 기능이 있는 구성에 적용 | Where 기능, 시스템은 …해야 한다. |
| 조합 · Complex | 상태와 사건 등을 함께 제한 | While 상태, when 사건, 시스템은 …해야 한다. |
## 다이어리 설명 예시
- **사건:** 계획 수정이 저장되면, 시스템은 수정 전 버전을 이력에 보존해야 한다.
- **사건:** 완료 집계 숫자를 선택하면, 시스템은 그 숫자에 포함된 할 일을 표시해야 한다.
EARS 문장에는 결과를 적고 **검사 절차·증거·출처는 별도 항목**으로 연결한다. DB 고유 제약 등 구현 선택은 별도로 정리하되, 이미 확정된 기술 요구는 보존한다.
## NASA와의 관계
**EARS로 문장을 구조화하고 → NASA 지침으로 품질을 점검한다.** 형식이 맞아도 빠진 조건, 잘못된 목표, 모순된 정책은 남을 수 있다.
출처: [EARS 원저자 설명 — Alistair Mavin](https://alistairmavin.com/ears/).

