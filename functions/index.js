// console.log('firebase-functions version:', require('firebase-functions/package.json').version);
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Firebase Admin 초기화
admin.initializeApp();

// 기본 함수 (필요시 추가)
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.json({ message: "Hello from Firebase Functions!" });
}); 