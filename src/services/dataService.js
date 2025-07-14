// Firebase Firestore 데이터 서비스 (홈페이지용)
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  orderBy, 
  query, 
  where,
  limit,
  updateDoc
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
  },

  // 카테고리별 사용 중인 연도 목록 가져오기
  async getYearsByCategory(category) {
    try {
      const q = query(
        collection(db, 'contents'),
        where('category', '==', category)
      );
      
      const querySnapshot = await getDocs(q);
      const years = new Set();
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.year && data.year.toString().trim() !== '') {
          years.add(data.year.toString());
        }
      });
      
      // 연도를 내림차순으로 정렬하여 반환
      return Array.from(years).sort((a, b) => b - a);
    } catch (error) {
      console.error('카테고리별 연도 가져오기 실패:', error);
      return [];
    }
  }
};

// 뉴스 서비스 (홈페이지용)
export const newsService = {
  // 뉴스 목록 가져오기
  async getNews(options = {}) {
    try {
      const { page = 1, limit: limitCount = 10 } = options;
      
      const q = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const allNews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      // 클라이언트 측 페이지네이션
      const startIndex = (page - 1) * limitCount;
      const endIndex = startIndex + limitCount;
      const paginatedNews = allNews.slice(startIndex, endIndex);
      
      return {
        news: paginatedNews,
        totalCount: allNews.length,
        totalPages: Math.ceil(allNews.length / limitCount),
        currentPage: page
      };
    } catch (error) {
      console.error('뉴스 불러오기 실패:', error);
      throw error;
    }
  },

  // 뉴스 상세 가져오기
  async getNewsById(id) {
    try {
      const docRef = doc(db, 'news', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const newsData = { id: docSnap.id, ...docSnap.data() };
        
        return {
          ...newsData,
          createdAt: newsData.createdAt?.toDate()
        };
      } else {
        throw new Error('뉴스를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('뉴스 상세 불러오기 실패:', error);
      throw error;
    }
  },

  // 최근 뉴스 가져오기
  async getRecentNews(limitCount = 5) {
    try {
      const q = query(
        collection(db, 'news'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
    } catch (error) {
      console.error('최근 뉴스 불러오기 실패:', error);
      throw error;
    }
  }
};

// Book 서비스 (홈페이지용)
export const bookService = {
  // 모든 Book 가져오기
  async getBooks() {
    try {
      const q = query(collection(db, 'books'));
      const querySnapshot = await getDocs(q);
      const books = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      
      // 클라이언트에서 정렬: order 필드가 있으면 order로, 없으면 createdAt으로
      return books.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.order !== undefined) return -1;
        if (b.order !== undefined) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } catch (error) {
      console.error('Book 목록 불러오기 실패:', error);
      throw error;
    }
  },

  // Book 상세 가져오기
  async getBook(id) {
    try {
      const docRef = doc(db, 'books', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const bookData = { id: docSnap.id, ...docSnap.data() };
        return {
          ...bookData,
          createdAt: bookData.createdAt?.toDate()
        };
      } else {
        throw new Error('Book을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Book 상세 불러오기 실패:', error);
      throw error;
    }
  }
};

// Press 관리 (홈페이지용)
export const pressService = {
  // 모든 Press 가져오기
  async getPress() {
    try {
      const q = query(collection(db, 'press'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Press 목록 조회 오류:', error);
      throw error;
    }
  }
};