const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp } = require('firebase/firestore');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

// Firebase 설정
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// R2 설정
const r2Config = {
  region: 'auto',
  endpoint: process.env.REACT_APP_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.REACT_APP_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_R2_SECRET_ACCESS_KEY,
  },
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const r2Client = new S3Client(r2Config);

// 이미지 업로드 함수
async function uploadImageToR2(imagePath, fileName) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const key = `books/${fileName}`;
    
    await r2Client.send(new PutObjectCommand({
      Bucket: process.env.REACT_APP_R2_BUCKET_NAME,
      Key: key,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000',
    }));
    
    const publicUrl = `${process.env.REACT_APP_R2_PUBLIC_URL}/${key}`;
    console.log(`✅ 이미지 업로드 완료: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ 이미지 업로드 실패 (${fileName}):`, error);
    throw error;
  }
}

// Book 데이터 저장 함수
async function saveBookToFirebase(bookData) {
  try {
    const docRef = await addDoc(collection(db, 'books'), {
      ...bookData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log(`✅ Book 저장 완료: ${bookData.title} (ID: ${docRef.id})`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Book 저장 실패 (${bookData.title}):`, error);
    throw error;
  }
}

// 메인 실행 함수
async function initializeBooksData() {
  const books = [
    {
      title: '언상동의 언상일상',
      size: '작게',
      thumbnailImage: 'books/book1.jpg',
      order: 1,
      externalLink: ''
    },
    {
      title: '건축신인상',
      size: '중간',
      thumbnailImage: 'books/book2.jpg', 
      order: 2,
      externalLink: ''
    },
    {
      title: '최고건축상',
      size: '크게',
      thumbnailImage: 'books/book3.jpg',
      order: 3,
      externalLink: ''
    }
  ];

  try {
    for (const book of books) {
      const filePath = path.join(publicDir, 'images', book.thumbnailImage);
      
      try {
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = `books/${Date.now()}-${path.basename(book.thumbnailImage)}`;
        const mimeType = 'image/jpeg';
        
        const publicUrl = await r2Service.uploadImage(fileName, fileBuffer, mimeType);
        
        const bookData = {
          title: book.title,
          size: book.size,
          thumbnailImage: publicUrl,
          order: book.order,
          externalLink: book.externalLink,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(collection(db, 'books'), bookData);
      } catch (fileError) {
        // 파일 처리 오류 시 기본값으로 진행
        const bookData = {
          title: book.title,
          size: book.size,
          thumbnailImage: '',
          order: book.order,
          externalLink: book.externalLink,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'books'), bookData);
      }
    }
  } catch (error) {
    throw error;
  }
}

initializeBooksData(); 