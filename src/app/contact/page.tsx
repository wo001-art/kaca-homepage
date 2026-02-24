export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#c9a96e] text-sm tracking-widest mb-4">CONTACT</p>
          <h1 className="text-4xl font-bold mb-6">문의하기</h1>
          <p className="text-gray-300 text-lg">
            한국아트크래프트협회에 대해 궁금한 점이 있으시면 연락해주세요
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-8">연락처 정보</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[#c9a96e] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">이메일</p>
                  <p className="text-gray-600">info@kaca-art.com</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[#c9a96e] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">Band</p>
                  <p className="text-gray-600">한국아트크래프트협회</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[#c9a96e] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold">운영시간</p>
                  <p className="text-gray-600">평일 10:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-8">문의 양식</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">이름</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a96e] transition-colors"
                  placeholder="이름을 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">이메일</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a96e] transition-colors"
                  placeholder="이메일을 입력해주세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">문의 유형</label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a96e] transition-colors bg-white">
                  <option>가입 문의</option>
                  <option>교육 문의</option>
                  <option>전시 문의</option>
                  <option>제휴/협력</option>
                  <option>기타</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">내용</label>
                <textarea
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a96e] transition-colors resize-none"
                  placeholder="문의 내용을 입력해주세요"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#1a1a2e] text-white py-3 rounded-lg hover:bg-[#e94560] transition-colors font-medium"
              >
                문의 보내기
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
