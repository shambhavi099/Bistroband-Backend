const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore");

require("dotenv").config();

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_KEY
);

admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const db = getFirestore();

module.exports = db;