import { KACA_INFO } from "@/lib/notion";

export default function ExhibitionsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a96e] text-sm tracking-widest mb-4">EXHIBITIONS</p>
          <h1 className="text-4xl font-bold mb-6">전시회</h1>
          <p className="text-gray-300 text-lg">
            한국아트크래프트협회의 전시 활동을 소개합니다
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {KACA_INFO.exhibitions.map((ex, i) => (
              <div
                key={ex.title}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Placeholder image */}
                <div className="w-full md:w-1/2 aspect-video rounded-2xl bg-gradient-to-br from-[#1a1a2e] via-[#533483] to-[#e94560] flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-5xl mb-2">🎨</p>
                    <p className="text-sm opacity-70">전시 이미지</p>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="text-[#c9a96e] text-sm font-medium mb-2">{ex.date}</p>
                  <h3 className="text-2xl font-bold mb-3">{ex.title}</h3>
                  <p className="text-gray-500 mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {ex.location}
                  </p>
                  <p className="text-gray-600 leading-relaxed">{ex.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
