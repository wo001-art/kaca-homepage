import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Band 데이터에서 추출한 협회 정보 (정적 데이터)
export const KACA_INFO = {
  name: "한국아트크래프트협회",
  nameEn: "Korea Art Craft Association",
  subtitle: "마블플루이드아트의 아름다움을 세상에 전합니다",
  president: "손종탁",
  vicePresident: "이지연",
  educationDirector: "이소영",
  prDirector: "김영숙",
  productDirector: "한기홍",
  description:
    "한국아트크래프트협회는 마블플루이드아트를 중심으로 전시회, 교육, 제품 개발 등 다양한 활동을 펼치고 있는 예술 단체입니다. Band 커뮤니티를 통해 2,000건 이상의 활동 기록을 보유하고 있으며, 전국 각지의 작가들과 함께 아트크래프트 문화를 확산하고 있습니다.",
  exhibitions: [
    {
      title: "2024 마블플루이드아트 정기전시회",
      location: "서울 인사동 갤러리",
      date: "2024년 10월",
      description: "협회 소속 작가 30명의 마블플루이드아트 작품 전시",
    },
    {
      title: "울산 아트크래프트 특별전",
      location: "울산 문화예술회관",
      date: "2024년 7월",
      description: "울산 지역 작가들의 특별 기획 전시",
    },
    {
      title: "파주 헤이리 초대전",
      location: "파주 헤이리 예술마을",
      date: "2024년 5월",
      description: "부회장 이지연 작가 초대 그룹전",
    },
    {
      title: "2023 송년 전시회",
      location: "서울 갤러리",
      date: "2023년 12월",
      description: "한 해를 마무리하는 협회 정기 전시",
    },
  ],
  education: [
    {
      title: "마블플루이드아트 기초반",
      instructor: "이소영 교육이사",
      schedule: "매월 첫째/셋째 토요일",
      description: "아크릴 물감과 실리콘 오일을 활용한 기초 마블링 기법",
    },
    {
      title: "레진아트 심화반",
      instructor: "협회 전문 강사진",
      schedule: "매월 둘째/넷째 토요일",
      description: "에폭시 레진을 활용한 고급 아트 크래프트 기법",
    },
    {
      title: "원데이클래스 (수시)",
      instructor: "각 지역 협회 작가",
      schedule: "수시 개설",
      description: "전국 각지에서 진행되는 1일 체험 클래스",
    },
    {
      title: "자격증 과정",
      instructor: "협회 인증 강사",
      schedule: "분기별 개설",
      description: "마블플루이드아트 지도사 자격증 취득 과정",
    },
  ],
};
