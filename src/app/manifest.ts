import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "윤슬이집 스튜디오",
  short_name: "윤슬이집",
  description:
    "제주 월정리 윤슬이집 스튜디오 예약 안내와 예약 현황을 확인할 수 있는 페이지입니다.",
  start_url: "/",
  display: "standalone",
  background_color: "#f8f5ef",
  theme_color: "#f8f5ef",
  lang: "ko-KR",
  icons: [
    {
      src: "/og-image.png",
      sizes: "1200x630",
      type: "image/png",
      purpose: "any",
    },
  ],
});

export default manifest;
