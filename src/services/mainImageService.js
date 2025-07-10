// 메인 페이지에서 사용할 이미지 서비스
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../admin/lib/firebase';

export const mainImageService = {
  // 타입별 메인 이미지 가져오기 (홈페이지용)
  async getMainImagesByType(type) {
    try {
      const q = query(
        collection(db, 'mainImages'),
        where('type', '==', type),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`${type} 이미지 로딩 실패:`, error);
      return [];
    }
  },

  // 모든 메인 이미지 가져오기
  async getAllMainImages() {
    try {
      const q = query(collection(db, 'mainImages'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('메인 이미지 로딩 실패:', error);
      return [];
    }
  }
}; 