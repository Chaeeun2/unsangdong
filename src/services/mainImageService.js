// 메인 페이지에서 사용할 이미지 서비스
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from '@firebase/firestore';
import { db } from '../admin/lib/firebase';

// 이미지 압축 유틸리티
const imageOptimizer = {
  // Cloudflare R2 이미지 변환 URL 생성
  getOptimizedImageUrl(originalUrl, options = {}) {
    if (!originalUrl || !originalUrl.includes('r2.dev')) {
      return originalUrl;
    }

    const {
      format = 'webp',
      quality = 80,
      width,
      height
    } = options;

    // Cloudflare Images 변환 파라미터
    const params = new URLSearchParams();
    params.append('format', format);
    params.append('quality', quality);
    
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    
    // 원본 URL에 변환 파라미터 추가
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}${params.toString()}`;
  },

  // 디바이스별 최적화된 이미지 URL 생성
  getResponsiveImageUrl(originalUrl, deviceType = 'desktop') {
    const options = {
      format: 'webp',
      quality: 85
    };

    switch (deviceType) {
      case 'mobile':
        options.width = 800;
        options.quality = 75;
        break;
      case 'tablet':
        options.width = 1200;
        options.quality = 80;
        break;
      default: // desktop
        options.width = 1920;
        options.quality = 85;
    }

    return this.getOptimizedImageUrl(originalUrl, options);
  },

  // 가로 이미지용 최적화 (1000px)
  getHorizontalImageUrl(originalUrl) {
    return this.getOptimizedImageUrl(originalUrl, {
      format: 'webp',
      quality: 50,
      width: 1000
    });
  },

  // 세로 이미지용 최적화 (600px)
  getVerticalImageUrl(originalUrl) {
    return this.getOptimizedImageUrl(originalUrl, {
      format: 'webp',
      quality: 50,
      width: 600
    });
  }
};

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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
        id: doc.id,
          ...data,
          // 원본 URL과 최적화된 URL 모두 제공
          imageUrl: data.imageUrl,
          optimizedImageUrl: data.type === 'horizontal' 
            ? imageOptimizer.getHorizontalImageUrl(data.imageUrl)
            : imageOptimizer.getVerticalImageUrl(data.imageUrl)
        };
      });
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
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
        id: doc.id,
          ...data,
          imageUrl: data.imageUrl,
          optimizedImageUrl: data.type === 'horizontal' 
            ? imageOptimizer.getHorizontalImageUrl(data.imageUrl)
            : imageOptimizer.getVerticalImageUrl(data.imageUrl)
        };
      });
    } catch (error) {
      console.error('메인 이미지 로딩 실패:', error);
      return [];
    }
  },

  // 이미지 최적화 유틸리티 export
  imageOptimizer
}; 