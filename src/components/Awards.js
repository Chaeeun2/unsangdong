import React from 'react';
import './Awards.css';

function Awards() {
  // 1994년부터 2024년까지 수상 데이터
  const awardsData = [
    {
      year: `2024`,
      awards: [
        {
          title: `Grand Prize and Citizens’ Choice Special Award from the 42nd Seoul Architecture Awards – 'Odong Public Library'`
        }
      ]
    },
    {
      year: `2023`,
      awards: [
        {
          title: `Special Award from Korea Wood Architecture Awards – 'Odong Public Library'`
        },
        {
          title: `Award from the Korean Institute of Architects (KIA) – 'Odong Public Library'`
        }
      ]
    },
    {
      year: `2022`,
      awards: [
        {
          title: `Excellence Award in Social & Public part from Korea Architecture Culture Awards – 'Change Up Ground Pohang'`
        },
        {
          title: `Architecture Award from the Korean Institute of Architects (KIA) – 'Change Up Ground Pohang'`
        }
      ]
    },
    {
      year: `2020`,
      awards: [
        {
          title: `1st prize, Seoul Compact City International Design Competition – Designing Multi-Level Complex on the Bukbu Expressway`
        }
      ]
    },
    {
      year: `2019`,
      awards: [
        {
          title: `2nd prize, Design Competition for Ecological and Leisure-cultural Waterfront Space in Seoul International District`
        },
        {
          title: `Design Competition for '1BL Public Housing in the Goduk-Gangil District'`
        },
        {
          title: `3rd prize, Urban Farming Platform Design Proposal Competition`
        }
      ]
    },
    {
      year: `2018`,
      awards: [
        {
          title: `2nd prize, Architecture Award from Seoul Metropolitan City – 'Sopoong-gil Community'`
        },
        {
          title: `The Plan Awards Public space, Italy – 'Hannae Forest of wisdom'`
        },
        {
          title: `K-Design Award Gold Winner of Complex Library`
        }
      ]
    },
    {
      year: `2017`,
      awards: [
        {
          title: `1st prize, Architecture Award from Seoul Metropolitan City – 'Hannae Forest of wisdom'`
        },
        {
          title: `Award from Korean Architecture & Culture – 'Hannae Forest of wisdom'`
        },
        {
          title: `Year’s Architecture best 7 – 'Hannae Forest of wisdom'`
        },
        {
          title: `1st prize, The generation-Convergence Start-Up Center and 50 Plus Campus`
        }
      ]
    },
    {
      year: `2016`,
      awards: [
        {
          title: `1st prize, Dasan-Dong Fortress Wall of Seoul Parking and Cultural Center`
        }
      ]
    },
    {
      year: `2015`,
      awards: [
        {
          title: `Sejong-daero Historic Culture Space Design Competition, 2nd Prize`
        },
        {
          title: `International Idea competition for Urban Regeneration of Jamsil Sports Complex`
        }
      ]
    },
    {
      year: '2013',
      awards: [
        {
          title: `Gangnam-gu beautiful architecture – 'Bogojae'`
        }
      ]
    },
    {
      year: '2012',
      awards: [
        {
          title: `Architecture Award from Seoul Metropolitan City – 'Sungdong Municipal Office Complex'`
        },
        {
          title: `Architecture Award of Seoul Metropolitan City – 'Seongdong Cultural & Welfare Center'`
        }
      ]
    },
    {
      year: '2011',
      awards: [
        {
          title: `Korean Good Design Award – Holiday Inn GwangJu`
        },
        {
          title: `Architecture Award from Seoul Metropolitan City – 'Yellow Diamond, Culture Complex'`
        },
        {
          title: `Award from Korean Architecture & Culture – 'Yellow Diamond, Culture Complex'`
        },
        {
          title: `1st prize award in green technology from Korea Institute of Ecological Architecture and Environment`
        }
      ]
    },
    {
      year: '2010',
      awards: [
        {
          title: `Award from the Korean Institute of Architects (KIA)`
        },
        {
          title: `Architecture Award from Seoul Metropolitan City`
        }
      ]
    },
    {
      year: '2009',
      awards: [
        {
          title: `Grand prize award from Korean Space & Culture Institute`
        },
        {
          title: `Good Designer prize of Korean Good Design Award`
        }
      ]
    },
    {
      year: '2007',
      awards: [
        {
          title: `Award from the Korean Institute of Architects (KIA)`
        },
        {
          title: `Architecture Award of Seoul Metropolitan City`
        },
        {
          title: `Award of Korean Architecture & Culture`
        },
        {
          title: `Architectural Review Highly Commended Award`
        }
      ]
    },
    {
      year: '2006',
      awards: [
        {
          title: `Design Vanguard Award by Architectural Record – 'Gallery Yeh'`
        }
      ]
    },
    {
      year: '2005',
      awards: [
        {
          title: `Award from the Korean Institute of Architects (KIA) – 'Gallery Yeh'`
        }
      ]
    },
    {
      year: '1994',
      awards: [
        {
          title: `Honorable Mention, Shinkenchiku Takiron International Competion`
        }
      ]
    }
  ];

  return (
    <div className="awards-container">
      <div className="awards-title">AWARDS</div>
      <div className="awards-content">
        <div className="awards-list">
          {awardsData.map((yearData, yearIndex) => (
            <div key={yearIndex} className="awards-year-section">
              <div className="awards-year">{yearData.year}</div>
              <div className="awards-items">
                {yearData.awards.map((award, awardIndex) => (
                  <div key={awardIndex} className="award-item">
                    <div className="award-main">
                      <div className="award-title">{award.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
          </div>
        </div>
  );
}

export default Awards; 