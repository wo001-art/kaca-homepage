import Link from "next/link";
import { KACA_INFO } from "@/lib/notion";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        {/* Decorative marble effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#e94560] blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#c9a96e] blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[#533483] blur-[80px]" />
        </div>

        <div className="relative z-10 text-center px-4">
          <p className="text-[#c9a96e] tracking-[0.3em] text-sm mb-4 uppercase">
            Korea Art Craft Association
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {KACA_INFO.name}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {KACA_INFO.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/exhibitions"
              className="bg-[#e94560] text-white px-8 py-3 rounded-full hover:bg-[#d63651] transition-colors font-medium"
            >
              전시회 보기
            </Link>
            <Link
              href="/education"
              className="border border-[#c9a96e] text-[#c9a96e] px-8 py-3 rounded-full hover:bg-[#c9a96e] hover:text-[#1a1a2e] transition-colors font-medium"
            >
              교육 안내
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-sm tracking-widest mb-2">ABOUT US</p>
            <h2 className="text-3xl font-bold">협회 소개</h2>
          </div>
          <p className="text-center text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            {KACA_INFO.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              { num: "2,000+", label: "활동 기록" },
              { num: "30+", label: "소속 작가" },
              { num: "6", label: "카테고리" },
              { num: "10+", label: "전시회 개최" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-[#e94560]">{stat.num}</p>
                <p className="text-gray-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exhibitions Preview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-sm tracking-widest mb-2">EXHIBITIONS</p>
            <h2 className="text-3xl font-bold">최근 전시회</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {KACA_INFO.exhibitions.slice(0, 4).map((ex) => (
              <div
                key={ex.title}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-8 text-white hover:scale-[1.02] transition-transform"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a96e]/10 rounded-full blur-2xl" />
                <p className="text-[#c9a96e] text-sm mb-2">{ex.date}</p>
                <h3 className="text-xl font-bold mb-2">{ex.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{ex.location}</p>
                <p className="text-gray-300 text-sm">{ex.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/exhibitions"
              className="text-[#e94560] hover:underline font-medium"
            >
              전체 전시회 보기 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Education Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-sm tracking-widest mb-2">EDUCATION</p>
            <h2 className="text-3xl font-bold">교육 프로그램</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {KACA_INFO.education.map((edu) => (
              <div
                key={edu.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <h3 className="font-bold text-lg mb-2">{edu.title}</h3>
                <p className="text-[#c9a96e] text-sm mb-2">{edu.instructor}</p>
                <p className="text-gray-500 text-xs mb-3">{edu.schedule}</p>
                <p className="text-gray-600 text-sm">{edu.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/education"
              className="text-[#e94560] hover:underline font-medium"
            >
              교육 상세 보기 &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">함께 만들어가는 아트크래프트의 세계</h2>
          <p className="text-gray-300 mb-8">
            한국아트크래프트협회와 함께 마블플루이드아트의 아름다움을 경험해보세요.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#c9a96e] text-[#1a1a2e] px-10 py-4 rounded-full font-bold hover:bg-[#b89858] transition-colors"
          >
            문의하기
          </Link>
        </div>
      </section>
    </>
  );
}
