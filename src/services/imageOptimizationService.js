// 이미지 최적화 서비스
// 프로젝트 썸네일, 상세, 뉴스 페이지 이미지들을 WebP로 변환하고 압축

const imageOptimizer = {
  // 이미지 최적화 URL 생성 (메인 페이지와 동일한 방식)
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

    // Cloudflare R2 변환 파라미터 (메인 페이지와 동일)
    const params = new URLSearchParams();
    params.append('format', format);
    params.append('quality', quality);
    
    if (width) params.append('width', width);
    if (height) params.append('height', height);
    
    // 원본 URL에 변환 파라미터 추가
    const separator = originalUrl.includes('?') ? '&' : '?';
    return `${originalUrl}${separator}${params.toString()}`;
  },

  // 썸네일 이미지 최적화 (1000px, 85% 품질)
  getThumbnailUrl(originalUrl) {
    return imageOptimizer.getOptimizedImageUrl(originalUrl, {
      format: 'webp',
      quality: 85,
      width: 1000
    });
  },

  // 상세 이미지 최적화 (원본 크기 유지, WebP 변환)
  getDetailImageUrl(originalUrl) {
    return imageOptimizer.getOptimizedImageUrl(originalUrl, {
      format: 'webp',
      quality: 85
    });
  },

  // 메인 이미지 최적화 (고품질)
  getMainImageUrl(originalUrl) {
    return imageOptimizer.getOptimizedImageUrl(originalUrl, {
      format: 'webp',
      quality: 90
    });
  },

  // 디바이스별 반응형 이미지 최적화
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

    return imageOptimizer.getOptimizedImageUrl(originalUrl, options);
  },

  // 프로젝트 이미지 최적화
  optimizeProjectImages(project) {
    if (!project) return project;

    const optimizedProject = { ...project };

    // 썸네일 이미지 최적화 (thumbnailImage 필드)
    if (project.thumbnailImage) {
      optimizedProject.optimizedThumbnailImage = imageOptimizer.getThumbnailUrl(project.thumbnailImage);
    }

    // 메인 이미지 최적화 (mainImage 필드)
    if (project.mainImage) {
      optimizedProject.optimizedMainImage = imageOptimizer.getMainImageUrl(project.mainImage);
    }

    // 상세 이미지들 최적화
    if (project.images && Array.isArray(project.images)) {
      optimizedProject.optimizedImages = project.images.map(image => 
        imageOptimizer.getDetailImageUrl(image)
      );
    }

    // 미디어 배열 최적화
    if (project.media && Array.isArray(project.media)) {
      optimizedProject.optimizedMedia = project.media.map(media => {
        if (media.type === 'image' && media.src) {
          const optimizedSrc = imageOptimizer.getDetailImageUrl(media.src);
          return {
            ...media,
            optimizedSrc: optimizedSrc
          };
        }
        return media;
      });
    }

    // 갤러리 이미지들 최적화
    if (project.galleryImages && Array.isArray(project.galleryImages)) {
      optimizedProject.optimizedGalleryImages = project.galleryImages.map(image => 
        imageOptimizer.getDetailImageUrl(image)
      );
    }

    return optimizedProject;
  },

  // 프로젝트 배열에 최적화된 이미지 URL 추가
  optimizeProjectArray(projects) {
    if (!Array.isArray(projects)) return projects;
    
    return projects.map(project => imageOptimizer.optimizeProjectImages(project));
  },

  // 뉴스 이미지 최적화
  optimizeNewsImages(news) {
    if (!news) return news;

    const optimizedNews = { ...news };

    // 뉴스 이미지들 최적화
    if (news.image_urls && Array.isArray(news.image_urls)) {
      optimizedNews.optimizedImageUrls = news.image_urls.map(image => 
        imageOptimizer.getDetailImageUrl(image)
      );
    }

    return optimizedNews;
  }
};

export const imageOptimizationService = {
  // 이미지 최적화 유틸리티
  imageOptimizer,

  // 프로젝트 데이터 최적화
  optimizeProject: imageOptimizer.optimizeProjectImages,
  optimizeProjects: imageOptimizer.optimizeProjectArray,
  optimizeProjectImages: imageOptimizer.optimizeProjectImages,
  optimizeNewsImages: imageOptimizer.optimizeNewsImages,

  // 개별 이미지 최적화
  getThumbnailUrl: imageOptimizer.getThumbnailUrl,
  getDetailImageUrl: imageOptimizer.getDetailImageUrl,
  getMainImageUrl: imageOptimizer.getMainImageUrl,
  getResponsiveImageUrl: imageOptimizer.getResponsiveImageUrl
}; 