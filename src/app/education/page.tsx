import { KACA_INFO } from "@/lib/notion";

export default function EducationPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a96e] text-sm tracking-widest mb-4">EDUCATION</p>
          <h1 className="text-4xl font-bold mb-6">교육 프로그램</h1>
          <p className="text-gray-300 text-lg">
            기초부터 전문가 과정까지, 체계적인 마블플루이드아트 교육
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {KACA_INFO.education.map((edu) => (
            <div
              key={edu.title}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Color bar */}
              <div className="h-2 bg-gradient-to-r from-[#c9a96e] to-[#e94560]" />
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3">{edu.title}</h3>
                <div className="flex flex-col gap-2 mb-4">
                  <p className="text-[#c9a96e] font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {edu.instructor}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {edu.schedule}
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed">{edu.description}</p>
                <button className="mt-6 bg-[#1a1a2e] text-white px-6 py-2 rounded-full text-sm hover:bg-[#e94560] transition-colors">
                  자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
