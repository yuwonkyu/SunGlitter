import type { Metadata } from "next";
import LinkCard, { type LinkItem } from "@/components/ui/LinkCard";

export const metadata: Metadata = {
  title: "홈",
  description:
    "제주 월정리 윤슬이집 스튜디오 홈입니다. 예약 안내, 예약 현황, 인스타그램, 지도 정보를 확인하세요.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "윤슬이집 스튜디오",
    description:
      "제주 월정리 윤슬이집 스튜디오 홈입니다. 예약 안내와 예약 현황을 확인하세요.",
    url: "/",
  },
  twitter: {
    title: "윤슬이집 스튜디오",
    description:
      "제주 월정리 윤슬이집 스튜디오 홈입니다. 예약 안내와 예약 현황을 확인하세요.",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "윤슬이집 스튜디오",
  url: "https://sun-glitter.vercel.app",
  image: "https://sun-glitter.vercel.app/og-image.png",
  telephone: "010-8641-3015",
  address: {
    "@type": "PostalAddress",
    addressCountry: "KR",
    addressRegion: "제주특별자치도",
    addressLocality: "제주시 구좌읍 월정리",
    streetAddress: "월정1길 70-1",
  },
  sameAs: ["https://www.instagram.com/yoonseul.house/"],
};

const LINKS: LinkItem[] = [
  {
    title: "예약 안내",
    subtitle: "DM 예약 방법 및 주의사항 안내",
    href: "/reserve-guide",
  },
  {
    title: "예약 현황 (예약보기)",
    subtitle: "스케줄표 확인",
    href: "/schedule",
  },
  {
    title: "인스타그램",
    subtitle: "@yoonseul.house",
    href: "https://www.instagram.com/yoonseul.house/",
    external: true,
  },
  {
    title: "네이버 지도",
    subtitle: "제주특별자치도 제주시 구좌읍 월정리 607",
    href: "https://naver.me/xsZAv68G",
    external: true,
  },
];

const Home = () => (
  <div className="paper-bg min-h-screen px-5 py-8">
    <main className="mx-auto w-full max-w-md">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <section className="fade-up rounded-2xl border border-(--line) bg-(--card) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
        <p className="text-xs tracking-[0.3em] text-(--muted)">
          YOONSEUL HOUSE
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          윤슬이집
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-(--muted)">
          제주 월정리 바다 앞, 돌담 사이마다 자연광이 머무는 촬영 스튜디오.
        </p>
      </section>

      <section className="mt-5 space-y-3">
        {LINKS.map((item, index) => (
          <LinkCard
            key={item.title}
            item={item}
            animationDelay={index * 80}
          />
        ))}
      </section>
    </main>
  </div>
);

export default Home;
