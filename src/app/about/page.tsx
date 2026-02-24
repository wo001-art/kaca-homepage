import { KACA_INFO } from "@/lib/notion";

export default function AboutPage() {
  const officers = [
    { role: "협회장", name: KACA_INFO.president, area: "울산" },
    { role: "부회장", name: KACA_INFO.vicePresident, area: "파주 헤이리" },
    { role: "교육이사", name: KACA_INFO.educationDirector, area: "" },
    { role: "문화홍보이사", name: KACA_INFO.prDirector, area: "" },
    { role: "제품개발기획이사", name: KACA_INFO.productDirector, area: "" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a96e] text-sm tracking-widest mb-4">ABOUT US</p>
          <h1 className="text-4xl font-bold mb-6">협회 소개</h1>
          <p className="text-gray-300 text-lg leading-relaxed">{KACA_INFO.description}</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "전시 & 교류",
              desc: "정기 전시회와 특별전을 통해 작가들의 작품을 대중에게 알리고, 작가 간 교류의 장을 마련합니다.",
              icon: "🎨",
            },
            {
              title: "교육 & 양성",
              desc: "기초부터 자격증 과정까지 체계적인 교육 프로그램을 운영하여 마블플루이드아트 전문가를 양성합니다.",
              icon: "📚",
            },
            {
              title: "제품 & 개발",
              desc: "아트크래프트 관련 제품을 기획하고 개발하여 협회 회원들의 창작 활동을 지원합니다.",
              icon: "💎",
            },
          ].map((item) => (
            <div key={item.title} className="text-center p-8 bg-white rounded-2xl shadow-sm">
              <p className="text-4xl mb-4">{item.icon}</p>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Officers */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#c9a96e] text-sm tracking-widest mb-2">OFFICERS</p>
            <h2 className="text-3xl font-bold">임원진</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {officers.map((o) => (
              <div
                key={o.role}
                className="bg-[#f8f6f2] rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#e94560] mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {o.name[0]}
                </div>
                <p className="text-[#c9a96e] text-sm font-medium">{o.role}</p>
                <p className="text-xl font-bold mt-1">{o.name}</p>
                {o.area && <p className="text-gray-500 text-sm mt-1">{o.area}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
