/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// 환경변수에서 허용된 관리자 이메일 가져오기
const ALLOWED_ADMIN_EMAILS = process.env.ALLOWED_ADMIN_EMAILS ?
  process.env.ALLOWED_ADMIN_EMAILS.split(",").map((email) => email.trim()) :
  ["admin@unsangdong.com"];

/**
 * 수동으로 관리자 권한 설정/해제 (관리자용)
 */
exports.manualSetAdminClaim = functions.https.onCall(async (data, context) => {
  // 호출자가 이미 관리자인지 확인
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
        "permission-denied",
        "관리자만 접근 가능합니다.",
    );
  }

  try {
    const {uid, isAdmin} = data;

    if (!uid) {
      throw new functions.https.HttpsError(
          "invalid-argument",
          "사용자 UID가 필요합니다.",
      );
    }

    const userRecord = await admin.auth().getUser(uid);
    const currentClaims = userRecord.customClaims || {};

    await admin.auth().setCustomUserClaims(uid, {
      ...currentClaims,
      admin: isAdmin,
      email: userRecord.email,
    });

    console.log(`🔧 수동 관리자 권한 설정: ${userRecord.email} (admin: ${isAdmin})`);

    return {success: true, email: userRecord.email, isAdmin};
  } catch (error) {
    console.error("❌ 수동 커스텀 클레임 설정 실패:", error);
    throw new functions.https.HttpsError(
        "internal",
        "관리자 권한 설정에 실패했습니다.",
    );
  }
});

/**
 * 현재 사용자의 커스텀 클레임 확인
 */
exports.getUserClaims = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "로그인이 필요합니다.");
  }

  try {
    const userRecord = await admin.auth().getUser(context.auth.uid);
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      customClaims: userRecord.customClaims || {},
    };
  } catch (error) {
    console.error("❌ 사용자 클레임 조회 실패:", error);
    throw new functions.https.HttpsError("internal", "사용자 정보 조회에 실패했습니다.");
  }
});

/**
 * 로그인 시 관리자 권한 업데이트 (HTTP 함수로 구현)
 */
exports.updateAdminClaimOnLogin = functions.https.onRequest(async (req, res) => {
  try {
    // Authorization 헤더에서 토큰 확인
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({error: "인증 토큰이 필요합니다."});
      return;
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await admin.auth()
        .verifyIdToken(token);

    const isAdmin = ALLOWED_ADMIN_EMAILS.includes(decodedToken.email);
    const currentClaims = decodedToken.customClaims || {};

    // 관리자 권한이 변경된 경우에만 업데이트
    if (currentClaims.admin !== isAdmin) {
      await admin.auth().setCustomUserClaims(decodedToken.uid, {
        ...currentClaims,
        admin: isAdmin,
        email: decodedToken.email,
      });

      console.log(`🔄 관리자 권한 업데이트: ${decodedToken.email} (admin: ${isAdmin})`);
    }

    res.json({success: true, isAdmin});
  } catch (error) {
    console.error("❌ 커스텀 클레임 업데이트 실패:", error);
    res.status(500).json({error: "관리자 권한 업데이트에 실패했습니다."});
  }
});

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
