import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#c9a96e] font-bold text-lg mb-4">KACA</h3>
            <p className="text-sm leading-relaxed">
              한국아트크래프트협회
              <br />
              마블플루이드아트의 아름다움을 세상에 전합니다
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">바로가기</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href="/about" className="hover:text-[#c9a96e] transition-colors">협회소개</Link>
              <Link href="/exhibitions" className="hover:text-[#c9a96e] transition-colors">전시회</Link>
              <Link href="/education" className="hover:text-[#c9a96e] transition-colors">교육</Link>
              <Link href="/contact" className="hover:text-[#c9a96e] transition-colors">문의</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">연락처</h4>
            <div className="text-sm flex flex-col gap-2">
              <p>Email: info@kaca-art.com</p>
              <p>Band: 한국아트크래프트협회</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 한국아트크래프트협회 (KACA). All rights reserved.</p>
          <p className="text-xs mt-2 text-gray-600">Powered by Notion CMS + Next.js | Built by WOOKVAN</p>
        </div>
      </div>
    </footer>
  );
}
