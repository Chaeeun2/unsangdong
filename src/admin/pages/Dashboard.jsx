import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { statsService } from '../services/dataService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    menuCount: 0,
    contentCount: 0,
    noticeCount: 0,
    mainImagesCount: 0,
    bookCount: 0,
    pressCount: 0,
    todayVisits: 0,
    monthlyVisits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      
      // 통계 데이터 로드
      const statsData = await statsService.getStats();
      setStats(statsData);

    } catch (error) {
      console.error('대시보드 데이터 로딩 실패:', error);
    } finally {
      setLoading(false);
    }
  }

  // 현재 월 이름 가져오기
  const currentMonth = new Date().toLocaleString('ko-KR', { month: 'long' });

  return (
    <AdminLayout>
      <div className="admin-content">
        <h2 className="admin-page-title">대시보드</h2>
        <div className="admin-content-layout">
          <div className="admin-content-main">
            {loading ? (
              <div className="admin-content-section">
                <p>대시보드 데이터를 로딩 중입니다...</p>
              </div>
            ) : (
              <>
                {/* 통계 섹션 */}
                <div className="admin-content-header">
                  <h3 className="admin-content-title">사이트 현황</h3>
                </div>
                <div className="admin-dashboard-guide">
                  <p>UNSANGDONG 관리자 페이지에 오신 것을 환영합니다.<br />왼쪽 메뉴에서 관리할 항목을 선택해주세요.</p>
                </div>
                <div className="admin-dashboard-stats">
                  <div className="admin-stat-item">
                    <h4>오늘 방문자</h4>
                    <p>{stats.todayVisits}명</p>
                  </div>
                  <div className="admin-stat-item">
                    <h4>{currentMonth} 방문자</h4>
                    <p>{stats.monthlyVisits}명</p>
                  </div>
                  <div className="admin-stat-item">
                    <h4>메인 이미지</h4>
                    <p>{stats.mainImagesCount}개</p>
                  </div>
                </div>

                {/* 관리 메뉴 섹션 */}
                <div className="admin-dashboard-recent">
                  <div className="admin-recent-section">
                    <div className="admin-content-header">
                      <h3 className="admin-content-title">메인페이지 관리</h3>
                      <button 
                        onClick={() => navigate('/admin/mainpage')} 
                        className="admin-button"
                      >
                        메인페이지 관리
                      </button>
                    </div>
                    <div className="admin-recent-list">
                      <div className="admin-recent-item">
                        <span className="admin-recent-title">가로 이미지와 세로 이미지를 업로드하여 메인페이지를 관리할 수 있습니다.</span>
                      </div>
                    </div>
                  </div>

                  {/* 수상 내역 관리 섹션 */}
                  <div className="admin-recent-section">
                    <div className="admin-content-header">
                      <h3 className="admin-content-title">수상 내역 관리</h3>
                      <button 
                        onClick={() => navigate('/admin/awards')} 
                        className="admin-button"
                      >
                        수상 내역 관리
                      </button>
                    </div>
                    <div className="admin-recent-list">
                      <div className="admin-recent-item">
                        <span className="admin-recent-title">영문/한국어 수상 내역을 추가, 수정, 삭제할 수 있습니다.</span>
                      </div>
                    </div>
                  </div>

                  {/* 프로젝트 관리 섹션 */}
                  <div className="admin-recent-section">
                    <div className="admin-content-header">
                      <h3 className="admin-content-title">프로젝트 관리</h3>
                      <button 
                        onClick={() => navigate('/admin/projects')} 
                        className="admin-button"
                      >
                        프로젝트 관리
                      </button>
                    </div>
                    <div className="admin-recent-list">
                      <div className="admin-recent-item">
                        <span className="admin-recent-title">Architecture, Art, Design 프로젝트를 추가, 수정, 삭제할 수 있습니다.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ABOUT 관리 섹션 */}
                <div className="admin-dashboard-recent">
                  <div className="admin-recent-section">
                    <div className="admin-content-header">
                      <h3 className="admin-content-title">ABOUT 관리</h3>
                      <button 
                        onClick={() => navigate('/admin/about')} 
                        className="admin-button"
                      >
                        ABOUT 관리
                      </button>
                    </div>
                    <div className="admin-recent-list">
                      <div className="admin-recent-item">
                        <span className="admin-recent-title">회사 정보, CEO 정보, 이미지 등 About 페이지 콘텐츠를 관리할 수 있습니다.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact 관리 섹션 */}
                <div className="admin-dashboard-recent">
                  <div className="admin-recent-section">
                    <div className="admin-content-header">
                      <h3 className="admin-content-title">Contact 관리</h3>
                      <button 
                        onClick={() => navigate('/admin/contact')} 
                        className="admin-button"
                      >
                        Contact 관리
                      </button>
                    </div>
                    <div className="admin-recent-list">
                      <div className="admin-recent-item">
                        <span className="admin-recent-title">연락처 정보 수정 및 문의사항을 확인하고 관리할 수 있습니다.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 