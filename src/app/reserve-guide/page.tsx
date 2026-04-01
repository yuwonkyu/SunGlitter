import type { Metadata } from "next";
import BackLink from "@/components/ui/BackLink";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "예약은 어떻게 확정되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DM 문의 후 계좌 입금이 확인되면 예약이 최종 확정됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "최소 이용 시간과 요금은 어떻게 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "최소 2시간부터 예약 가능하며, 시간당 50,000원 기준으로 운영됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "촬영 인원 제한이 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "기본 최대 4명까지 가능하며, 인원 추가 시 시간당 인당 10,000원이 추가됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "장비 대여가 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "조명, 삼각대, 스탠드, 렌즈 등은 사전 협의 후 대여 가능합니다.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: "https://sun-glitter.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "예약 안내",
      item: "https://sun-glitter.vercel.app/reserve-guide",
    },
  ],
};

export const metadata: Metadata = {
  title: "예약 안내",
  description:
    "윤슬이집 스튜디오 예약 안내 페이지입니다. 위치, 주차, 결제, 장비 대여, DM 문의 양식을 확인하세요.",
  alternates: {
    canonical: "/reserve-guide",
  },
  openGraph: {
    title: "예약 안내 | 윤슬이집 스튜디오",
    description:
      "윤슬이집 스튜디오 예약 안내 페이지입니다. 위치, 주차, 결제, 장비 대여, DM 문의 양식을 확인하세요.",
    url: "/reserve-guide",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "윤슬이집 스튜디오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "예약 안내 | 윤슬이집 스튜디오",
    description:
      "윤슬이집 스튜디오 예약 안내 페이지입니다. 위치, 주차, 결제, 장비 대여, DM 문의 양식을 확인하세요.",
    images: ["/og-image.png"],
  },
};

const ReserveGuidePage = () => {
  return (
    <div className="paper-bg min-h-screen px-5 py-8">
      <main className="mx-auto w-full max-w-md">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <section className="fade-up rounded-2xl border border-(--line) bg-(--card) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
          <h1 className="mb-2 text-2xl font-bold">예약 안내</h1>
          <p className="mb-4 text-sm text-(--muted)">
            예약 및 촬영 문의 전, 아래 안내와 DM 문의 양식을 확인해 주세요.
            <br />
            <span className="font-semibold">@yoonseul.house</span> 계정 DM으로
            문의해 주시면 빠르게 안내드립니다.
          </p>

          <div className="mb-4">
            <h2 className="mb-1 text-lg font-semibold">예약 확정 안내</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              <li>
                위치: 제주 월정리 (제주특별자치도 제주시 구좌읍 월정1길 70-1)
              </li>
              <li>
                주차: 인근 공용 주차장 이용 가능 (촬영팀 차량 기준 약 5대)
              </li>
              <li className="group">
                결제: 계좌 입금 후 예약 최종 확정
                <br />
                <span className="inline-block  select-none rounded bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 blur-[3px] opacity-90 transition duration-150 hover:blur-none hover:opacity-100 active:blur-none active:opacity-100 group-hover:blur-none group-active:blur-none">
                  국민은행 943202 00 074074 조형진
                </span>

              </li>
              <li>
                촬영 사진 활용 동의 시 5% 할인
                <br />
                (촬영 현장 사진 및 결과물의 홍보·포트폴리오 활용)
              </li>
              <li>장비 대여: 조명, 삼각대, 스탠드, 렌즈 등 사전 협의 가능</li>
              <li>
                이용 안내: 가구·소품 이동 가능, 촬영 후 원위치 정리 필수
              </li>
              <li>
                예약 시간에는 촬영 준비 및 정리 시간이 포함됩니다.
              </li>
              <li>
                파손 안내: 가구·소품·시설 파손/오염 시 복구 및 배상 비용이
                청구될 수 있습니다.
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="mb-1 text-lg font-semibold">DM 문의 양식</h2>
            <div className="rounded border border-zinc-200 bg-zinc-50 p-3 text-sm">
              <div className="mb-2">
                <span className="font-medium">1. 촬영 날짜 및 시간</span>{" "}
                <span className="text-zinc-500">
                  예시: 25.01.20 15:00 ~ 17:00 (2시간)
                </span>
                <p className="mt-1 text-xs text-zinc-500">
                  시간당 50,000원 / 최소 2시간부터
                </p>
              </div>
              <div className="mb-2">
                <span className="font-medium">2. 촬영 인원</span>{" "}
                <span className="text-zinc-500">
                  최대 4명 / 인원 추가 시 시간당 인당 10,000원
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">3. 촬영 내용</span>{" "}
                <span className="text-zinc-500">
                  예시: 브랜드, 유튜브, 드라마
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">4. 필요 장비 여부</span>
              </div>
              <div>
                <span className="font-medium">5. 촬영 사진 활용 동의</span>{" "}
                <span className="text-zinc-500">O / X</span>
              </div>
            </div>
          </div>

          <p className="mb-4 text-sm text-(--muted)">
            제주의 빛과 바람이 머무는 공간 윤슬이집에서 좋은 촬영 되시길
            바랍니다.
            <br />
            문의: 010-8641-3015
          </p>

          <a
            href="https://www.instagram.com/yoonseul.house/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full rounded-md bg-zinc-900 px-3 py-2 text-center text-sm font-semibold text-white"
          >
            인스타그램 DM 보내기
          </a>
        </section>
        <BackLink className="pt-3" />
      </main>
    </div>
  );
};

export default ReserveGuidePage;
