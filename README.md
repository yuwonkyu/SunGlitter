# 윤슬이집 스튜디오 예약 서비스 (SunGlitter)

제주 월정리 **윤슬이집 스튜디오**를 위한 예약 안내/현황 서비스입니다.
사용자는 홈 링크 허브에서 예약 안내와 예약 현황을 확인하고,
운영자는 관리자 화면에서 날짜·시간 슬롯을 등록/수정/삭제합니다.

## 주요 페이지

- `/` : 링크 허브(예약 안내, 예약 현황, 인스타그램, 지도)
- `/reserve-guide` : 예약 절차 및 DM 문의 양식 안내
- `/schedule` : 달력 기반 예약 현황 조회
- `/robots.txt`, `/sitemap.xml` : 검색엔진 크롤링/사이트맵

## 핵심 기능

- 예약 슬롯을 날짜/시간 기준으로 정렬해 표시
- 예약 상태(`available`, `pending`, `booked`) 관리
- 관리자 슬롯 CRUD API 제공 (`POST`, `PUT`, `DELETE`)
- 예약 시간은 30분 단위(`HH:00`, `HH:30`)만 허용
- 홈/예약안내/예약현황 페이지 SEO 메타데이터 적용
- 홈 페이지 LocalBusiness JSON-LD 구조화 데이터 적용

## 관리자 접근 보안

관리자 경로는 2단계로 보호됩니다.


## 데이터 저장 동작

- 기본 저장소: **Upstash Redis**
- Redis 환경변수가 없으면 **메모리 저장소**로 동작
- 메모리 저장소는 서버 재시작 시 데이터가 초기화됨

## 기술 스택

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Upstash Redis

## 환경변수

`.env.local` 예시:

```env
ADMIN_PASSWORD=your-admin-password
ADMIN_SESSION_SECRET=replace-with-long-random-secret

GATE_USER=admin
GATE_PASSWORD=your-basic-auth-password

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

설명:

- `ADMIN_PASSWORD`: 관리자 로그인 비밀번호
- `ADMIN_SESSION_SECRET`: 관리자 세션 서명 키 (운영에서 필수 권장)
- `GATE_USER`: Basic Auth 아이디 (기본값 `admin`)
- `GATE_PASSWORD`: Basic Auth 비밀번호 (관리자 경로 보호를 위해 설정 권장)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: 영구 저장용 Redis 연결 정보

## 실행 방법

1. 의존성 설치

```bash
npm install
```

2. 환경변수 설정 (`.env.local`)

3. 개발 서버 실행

```bash
npm run dev
```

4. 프로덕션 빌드/실행

```bash
npm run build
npm run start
```

## 운영 메모 (Windows + OneDrive)

OneDrive 동기화 폴더에서 개발 시, 간헐적으로 `.next/dev` 파일 rename 단계에서
`EPERM: operation not permitted` 오류가 발생할 수 있습니다.

- 빠른 복구: Node 프로세스 종료 → `.next` 폴더 삭제 → `npm run dev` 재실행
- 재발 방지: 가능하면 프로젝트를 OneDrive 바깥 경로(예: `C:\dev`)에서 개발

## 수정·재사용 금지 정책 (중요)

본 저장소와 소스코드는 **윤슬이집 스튜디오 운영 목적에 한해** 제공됩니다.

- 운영자의 명시적 사전 승인 없는 소스 수정, 복제, 배포, 재사용을 금지합니다.
- 코드 일부/전체를 템플릿화하거나 다른 프로젝트로 전용하는 행위를 금지합니다.
- 포크 후 기능 변경, UI 재활용, 상업적 사용, 파생 저작물 제작을 금지합니다.
- 저장소 접근 권한이 있더라도 별도 허가 없는 사용권은 부여되지 않습니다.

위 정책을 위반한 사용은 즉시 중단 요청 및 필요한 조치 대상이 될 수 있습니다.
