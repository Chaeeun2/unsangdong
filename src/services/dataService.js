// Firebase Firestore 데이터 서비스 (홈페이지용)
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  orderBy, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// 콘텐츠 관리 (홈페이지용)
export const contentService = {
  // 모든 콘텐츠 가져오기
  async getContents(category = null) {
    let q;
    
    if (category && category !== 'all') {
      q = query(collection(db, 'contents'), 
        where('category', '==', category)
      );
    } else {
      q = query(collection(db, 'contents'));
    }
    
    const querySnapshot = await getDocs(q);
    const contents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // 클라이언트에서 정렬: order 필드가 있으면 order로, 없으면 createdAt으로
    return contents.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return new Date(b.createdAt?.toDate()) - new Date(a.createdAt?.toDate());
    });
  },

  // 콘텐츠 상세 가져오기
  async getContent(id) {
    const docRef = doc(db, 'contents', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('콘텐츠를 찾을 수 없습니다.');
    }
  }
};

// 프로젝트 타입 관리 (홈페이지용)
export const projectTypeService = {
  // 프로젝트 타입 옵션 가져오기
  async getProjectTypes() {
    try {
      const docRef = doc(db, 'projectTypes', 'config');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        // 기본 타입 설정
        return {
          Architecture: ['HOUSE', 'Commercial', 'Residential', 'Cultural', 'Office', 'Hotel', 'Restaurant'],
          Art: ['Exhibition', 'Artwork', 'Installation', 'Sculpture', 'Painting', 'Performance'],
          Design: ['Interior', 'Furniture', 'Product', 'Branding', 'Graphic', 'Web']
        };
      }
    } catch (error) {
      console.error('프로젝트 타입 가져오기 실패:', error);
      // 에러 시 기본값 반환
      return {
        Architecture: ['HOUSE', 'Commercial', 'Residential', 'Cultural', 'Office', 'Hotel', 'Restaurant'],
        Art: ['Exhibition', 'Artwork', 'Installation', 'Sculpture', 'Painting', 'Performance'],
        Design: ['Interior', 'Furniture', 'Product', 'Branding', 'Graphic', 'Web']
      };
    }
  }
}; 