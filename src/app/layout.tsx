import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sun-glitter.vercel.app"),

  title: "윤슬이집 스튜디오",
  description:
    "제주 월정리 윤슬이집 스튜디오 예약 안내.",

  alternates: {
    canonical: "https://sun-glitter.vercel.app",
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://sun-glitter.vercel.app",
    siteName: "윤슬이집 스튜디오",
    title: "윤슬이집 스튜디오",
    description:
      "제주 월정리 윤슬이집 스튜디오 예약 안내.",
    images: [
      {
        url: "https://sun-glitter.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "윤슬이집 스튜디오",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "윤슬이집 스튜디오",
    description:
      "제주 월정리 윤슬이집 스튜디오 예약 안내.",
    images: ["https://sun-glitter.vercel.app/og-image.png"],
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="ko">
    <body className={`${notoSansKr.variable} antialiased`}>{children}</body>
  </html>
);

export default RootLayout;
