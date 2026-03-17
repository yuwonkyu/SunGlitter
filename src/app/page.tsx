import LinkCard, { type LinkItem } from "@/components/ui/LinkCard";

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
    subtitle: "제주특별자치도 제주시 구좌읍 월정1길 70-3",
    href: "https://map.naver.com/p/search/%EC%A0%9C%EC%A3%BC%ED%8A%B9%EB%B3%84%EC%9E%90%EC%B9%98%EB%8F%84%20%EC%A0%9C%EC%A3%BC%EC%8B%9C%20%EA%B5%AC%EC%A2%8C%EC%9D%8D%20%EC%9B%94%EC%A0%951%EA%B8%B8%2070-3",
    external: true,
  },
];

const Home = () => (
  <div className="paper-bg min-h-screen px-5 py-8">
    <main className="mx-auto w-full max-w-md">
      <section className="fade-up rounded-2xl border border-(--line) bg-(--card) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
        <p className="text-xs tracking-[0.3em] text-(--muted)">
          YOONSEUL HOUSE
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          윤슬이네 스튜디오
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-(--muted)">
          제주 구좌읍 월정리에 있는 감성 스튜디오입니다. 아래 링크에서 예약 및
          스케쥴을 확인해 주세요.
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
