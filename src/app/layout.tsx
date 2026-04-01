import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const SITE_NAME = "윤슬이집 스튜디오";
const SITE_URL = "https://sun-glitter.vercel.app";
const SITE_DESCRIPTION =
  "제주 월정리 윤슬이집 스튜디오 예약 안내 페이지입니다. 위치, 주차, 장비 대여, 촬영 문의 양식을 확인하세요.";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_NAME,
    template: "%s | 윤슬이집 스튜디오",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "제주 스튜디오",
    "월정리 스튜디오",
    "제주 촬영 스튜디오",
    "윤슬이집",
    "스튜디오 예약",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
  },

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
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
