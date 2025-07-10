// Firebase에 초기 Awards 데이터를 저장하는 스크립트
import { awardsService } from '../services/dataService';

const initialAwardsData = [
  {
    year: "2024",
    awards: [
      {
        title: {
          EN: "Grand Prize and Citizens' Choice Special Award from the 42nd Seoul Architecture Awards – 'Odong Public Library'",
          KO: "제42회 서울시 건축상 대상 및 시민선택특별상 – '오동도서관'"
        }
      }
    ]
  },
  {
    year: "2023",
    awards: [
      {
        title: {
          EN: "Special Award from Korea Wood Architecture Awards – 'Odong Public Library'",
          KO: "한국목조건축대상 특별상 – '오동도서관'"
        }
      },
      {
        title: {
          EN: "Award from the Korean Institute of Architects (KIA) – 'Odong Public Library'",
          KO: "대한건축학회상 – '오동도서관'"
        }
      }
    ]
  },
  {
    year: "2022",
    awards: [
      {
        title: {
          EN: "Excellence Award in Social & Public part from Korea Architecture Culture Awards – 'Change Up Ground Pohang'",
          KO: "한국건축문화대상 사회공공부문 우수상 – '체인지업그라운드 포항'"
        }
      },
      {
        title: {
          EN: "Architecture Award from the Korean Institute of Architects (KIA) – 'Change Up Ground Pohang'",
          KO: "대한건축학회상 – '체인지업그라운드 포항'"
        }
      }
    ]
  },
  {
    year: "2020",
    awards: [
      {
        title: {
          EN: "1st prize, Seoul Compact City International Design Competition – Designing Multi-Level Complex on the Bukbu Expressway",
          KO: "서울시 컴팩트시티 국제설계공모 최우수상 – 북부간선도로 상부 다층복합단지 설계"
        }
      }
    ]
  },
  {
    year: "2019",
    awards: [
      {
        title: {
          EN: "2nd prize, Design Competition for Ecological and Leisure-cultural Waterfront Space in Seoul International District",
          KO: "서울 국제금융지구 생태여가문화 수변공간 설계공모 우수상"
        }
      },
      {
        title: {
          EN: "Design Competition for '1BL Public Housing in the Goduk-Gangil District'",
          KO: "고덕강일 1BL 공공임대주택 설계공모 당선"
        }
      },
      {
        title: {
          EN: "3rd prize, Urban Farming Platform Design Proposal Competition",
          KO: "도시농업플랫폼 설계공모 장려상"
        }
      }
    ]
  },
  {
    year: "2018",
    awards: [
      {
        title: {
          EN: "2nd prize, Architecture Award from Seoul Metropolitan City – 'Sopoong-gil Community'",
          KO: "서울특별시 건축상 우수상 – '소풍길 공동체'"
        }
      },
      {
        title: {
          EN: "The Plan Awards Public space, Italy – 'Hannae Forest of wisdom'",
          KO: "The Plan Awards 공공공간 부문 (이탈리아) – '한내지혜의숲'"
        }
      },
      {
        title: {
          EN: "K-Design Award Gold Winner of Complex Library",
          KO: "K-Design Award 복합도서관 부문 골드 수상"
        }
      }
    ]
  },
  {
    year: "2017",
    awards: [
      {
        title: {
          EN: "1st prize, Architecture Award from Seoul Metropolitan City – 'Hannae Forest of wisdom'",
          KO: "서울특별시 건축상 대상 – '한내지혜의숲'"
        }
      },
      {
        title: {
          EN: "Award from Korean Architecture & Culture – 'Hannae Forest of wisdom'",
          KO: "한국건축문화대상 – '한내지혜의숲'"
        }
      },
      {
        title: {
          EN: "Year's Architecture best 7 – 'Hannae Forest of wisdom'",
          KO: "올해의 건축 베스트 7 – '한내지혜의숲'"
        }
      },
      {
        title: {
          EN: "1st prize, The generation-Convergence Start-Up Center and 50 Plus Campus",
          KO: "세대융합형 창업지원센터 및 50플러스캠퍼스 설계공모 최우수상"
        }
      }
    ]
  },
  {
    year: "2016",
    awards: [
      {
        title: {
          EN: "1st prize, Dasan-Dong Fortress Wall of Seoul Parking and Cultural Center",
          KO: "서울성곽 다산동 주차문화센터 설계공모 최우수상"
        }
      }
    ]
  },
  {
    year: "2015",
    awards: [
      {
        title: {
          EN: "Sejong-daero Historic Culture Space Design Competition, 2nd Prize",
          KO: "세종대로 역사문화공간 설계공모 우수상"
        }
      },
      {
        title: {
          EN: "International Idea competition for Urban Regeneration of Jamsil Sports Complex",
          KO: "잠실종합운동장 일대 도시재생 국제아이디어 공모 당선"
        }
      }
    ]
  },
  {
    year: "2013",
    awards: [
      {
        title: {
          EN: "Gangnam-gu beautiful architecture – 'Bogojae'",
          KO: "강남구 아름다운 건축물 – '보고재'"
        }
      }
    ]
  },
  {
    year: "2012",
    awards: [
      {
        title: {
          EN: "Architecture Award from Seoul Metropolitan City – 'Sungdong Municipal Office Complex'",
          KO: "서울특별시 건축상 – '성동구청 복합청사'"
        }
      },
      {
        title: {
          EN: "Architecture Award of Seoul Metropolitan City – 'Seongdong Cultural & Welfare Center'",
          KO: "서울특별시 건축상 – '성동구민회관'"
        }
      }
    ]
  },
  {
    year: "2011",
    awards: [
      {
        title: {
          EN: "Korean Good Design Award – Holiday Inn GwangJu",
          KO: "굿디자인어워드 – 홀리데이인 광주"
        }
      },
      {
        title: {
          EN: "Architecture Award from Seoul Metropolitan City – 'Yellow Diamond, Culture Complex'",
          KO: "서울특별시 건축상 – '옐로우 다이아몬드, 문화복합시설'"
        }
      },
      {
        title: {
          EN: "Award from Korean Architecture & Culture – 'Yellow Diamond, Culture Complex'",
          KO: "한국건축문화대상 – '옐로우 다이아몬드, 문화복합시설'"
        }
      },
      {
        title: {
          EN: "1st prize award in green technology from Korea Institute of Ecological Architecture and Environment",
          KO: "한국생태환경건축학회 친환경기술부문 대상"
        }
      }
    ]
  },
  {
    year: "2010",
    awards: [
      {
        title: {
          EN: "Award from the Korean Institute of Architects (KIA)",
          KO: "대한건축학회상"
        }
      },
      {
        title: {
          EN: "Architecture Award from Seoul Metropolitan City",
          KO: "서울특별시 건축상"
        }
      }
    ]
  },
  {
    year: "2009",
    awards: [
      {
        title: {
          EN: "Grand prize award from Korean Space & Culture Institute",
          KO: "한국공간문화학회 대상"
        }
      },
      {
        title: {
          EN: "Good Designer prize of Korean Good Design Award",
          KO: "굿디자인어워드 굿디자이너상"
        }
      }
    ]
  },
  {
    year: "2007",
    awards: [
      {
        title: {
          EN: "Award from the Korean Institute of Architects (KIA)",
          KO: "대한건축학회상"
        }
      },
      {
        title: {
          EN: "Architecture Award of Seoul Metropolitan City",
          KO: "서울특별시 건축상"
        }
      },
      {
        title: {
          EN: "Award of Korean Architecture & Culture",
          KO: "한국건축문화대상"
        }
      },
      {
        title: {
          EN: "Architectural Review Highly Commended Award",
          KO: "Architectural Review 고도추천상"
        }
      }
    ]
  },
  {
    year: "2006",
    awards: [
      {
        title: {
          EN: "Design Vanguard Award by Architectural Record – 'Gallery Yeh'",
          KO: "Architectural Record 디자인 뱅가드 어워드 – '갤러리 예'"
        }
      }
    ]
  },
  {
    year: "2005",
    awards: [
      {
        title: {
          EN: "Award from the Korean Institute of Architects (KIA) – 'Gallery Yeh'",
          KO: "대한건축학회상 – '갤러리 예'"
        }
      }
    ]
  },
  {
    year: "1994",
    awards: [
      {
        title: {
          EN: "Honorable Mention, Shinkenchiku Takiron International Competion",
          KO: "신건축 타키론 국제공모 장려상"
        }
      }
    ]
  }
];

export async function initializeAwardsData() {
  try {
    console.log('Awards 초기 데이터 저장 시작...');
    await awardsService.saveAwardsData(initialAwardsData);
    console.log('Awards 초기 데이터 저장 완료!');
    return true;
  } catch (error) {
    console.error('Awards 초기 데이터 저장 실패:', error);
    return false;
  }
}

// 브라우저 콘솔에서 직접 실행할 수 있도록 전역 함수로 노출
window.initializeAwardsData = initializeAwardsData; 