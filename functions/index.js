const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const admin = require("firebase-admin");
const serviceAccount = require('./todoproject-11d4c-firebase-adminsdk-1rrkq-d8605602f5');
const dotenv = require('dotenv');

// 환경변수 관리
dotenv.config(); 

let firebase;
if(admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
} else {
    firebase = admin.app();
}



module.exports = {
    api: require('./api'),
}

