import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "윤슬이네 스튜디오",
  description: "제주 구좌읍 월정리의 감성 스튜디오, 윤슬이네 스튜디오입니다. 예약 및 일정 확인은 아래 링크를 이용해 주세요.",
  metadataBase: new URL("https://yoonseul.house"),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://yoonseul.house",
    siteName: "윤슬이네 스튜디오",
    title: "윤슬이네 스튜디오",
    description: "제주 구좌읍 월정리의 감성 스튜디오, 윤슬이네 스튜디오입니다. 예약 및 일정 확인은 아래 링크를 이용해 주세요.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "윤슬이네 스튜디오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "윤슬이네 스튜디오",
    description: "제주 구좌읍 월정리의 감성 스튜디오, 윤슬이네 스튜디오입니다.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKr.variable} antialiased`}>{children}</body>
    </html>
  );
}
