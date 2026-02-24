import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "한국아트크래프트협회 | KACA",
  description:
    "마블플루이드아트를 중심으로 전시회, 교육, 제품 개발 등 다양한 활동을 펼치는 한국아트크래프트협회 공식 홈페이지",
  keywords: "마블플루이드아트, 아트크래프트, 전시회, 교육, 레진아트, KACA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-[#f8f6f2] text-[#1a1a2e] antialiased">
        <Header />
        <main className="pt-16 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
