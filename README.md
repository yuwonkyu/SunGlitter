# 윤슬이네 스튜디오 링크 사이트

모바일 중심으로 만든 링크 허브 + 예약현황 보드 프로젝트입니다.

## 스택

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Upstash Redis (버셀 배포용 예약현황 저장소)

## 페이지

- / : 링크 허브 홈
- /schedule : 예약현황 보기
- /0000000000000-00000-000 : 관리자 예약현황 등록/수정/삭제
- /admin : 접근 시 404 (숨김 처리)

## 로컬 실행

1. 의존성 설치

```bash
npm install
```

2. 환경변수 설정

프로젝트 루트에 .env.local 파일을 만들고 .env 내용을 복사해 값 입력

3. 개발 서버

```bash
npm run dev
```

## 환경변수

- ADMIN_PASSWORD: 관리자 로그인 비밀번호
- ADMIN_SESSION_SECRET: 관리자 세션 서명 키
- UPSTASH_REDIS_REST_URL: Upstash Redis URL
- UPSTASH_REDIS_REST_TOKEN: Upstash Redis Token
- GATE_USER: 관리자 경로 Basic Auth 아이디 (기본값: admin)
- GATE_PASSWORD: 관리자 경로 Basic Auth 비밀번호 (필수 설정)

참고: Redis 환경변수가 없으면 로컬 메모리 저장으로 동작하며 서버 재시작 시 데이터가 사라집니다.

## 버셀 배포

1. Git 저장소를 Vercel에 연결
2. Project Settings > Environment Variables에 위 4개 값 등록
3. 배포

## 관리자 전용 수정 권한

구현되어 있습니다.

- /yoonseulhouse-admin-jhj 로그인 성공 시 HttpOnly 쿠키 세션 발급
- /api/schedule의 POST/PUT/DELETE는 관리자 세션이 없으면 401 반환
- 일반 사용자는 /schedule에서 조회만 가능
