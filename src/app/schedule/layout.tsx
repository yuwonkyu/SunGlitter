import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "예약 현황",
  description:
    "윤슬이집 스튜디오 예약 현황 페이지입니다. 달력에서 날짜별 예약 상태를 확인할 수 있습니다.",
  alternates: {
    canonical: "/schedule",
  },
  openGraph: {
    title: "예약 현황 | 윤슬이집 스튜디오",
    description:
      "윤슬이집 스튜디오 예약 현황 페이지입니다. 달력에서 날짜별 예약 상태를 확인할 수 있습니다.",
    url: "/schedule",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "윤슬이집 스튜디오" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "예약 현황 | 윤슬이집 스튜디오",
    description:
      "윤슬이집 스튜디오 예약 현황 페이지입니다. 달력에서 날짜별 예약 상태를 확인할 수 있습니다.",
    images: ["/og-image.png"],
  },
};

const ScheduleLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return children;
};

export default ScheduleLayout;