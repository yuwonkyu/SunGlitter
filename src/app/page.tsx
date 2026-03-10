import Link from "next/link";

const links = [
  {
    title: "예약 링크 (신청하기)",
    subtitle: "준비중",
    href: "#",
    disabled: true,
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

export default function Home() {
  return (
    <div className="paper-bg min-h-screen px-5 py-8">
      <main className="mx-auto w-full max-w-md">
        <section className="fade-up rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.07)]">
          <p className="text-xs tracking-[0.3em] text-[var(--muted)]">
            YOONSEUL HOUSE
          </p>
          <h1 className="mt-2 text-2xl font-bold text-[var(--foreground)]">
            윤슬이네 스튜디오
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            제주 구좌읍 월정리에 있는 감성 스튜디오입니다. 아래 링크에서 예약 및
            채널을 확인해 주세요.
          </p>
        </section>

        <section className="mt-5 space-y-3">
          {links.map((item, index) => {
            const baseClass =
              "card-in block rounded-xl border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_5px_14px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5";
            const style = {
              animationDelay: `${index * 80}ms`,
            } as const;

            if (item.disabled) {
              return (
                <div
                  key={item.title}
                  className={`${baseClass} cursor-not-allowed opacity-70`}
                  style={style}
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {item.subtitle}
                  </p>
                </div>
              );
            }

            if (item.external) {
              return (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseClass}
                  style={style}
                >
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">
                    {item.subtitle}
                  </p>
                </a>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                className={baseClass}
                style={style}
              >
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {item.subtitle}
                </p>
              </Link>
            );
          })}
        </section>

        <div className="mt-6 text-center text-xs text-[var(--muted)]">
          <Link href="/admin" className="underline underline-offset-4">
            관리자 예약현황 편집
          </Link>
        </div>
      </main>
    </div>
  );
}
