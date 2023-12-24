const { initializeApp } = require("@firebase/app");
const { getDatabase } = require("@firebase/database");
const { getStorage } = require("@firebase/storage");

const config = {
  apiKey: "AIzaSyALWI1F4sKFd-skGlNUSpZlClMQVowJjWQ",
  authDomain: "e-commerce-3ec4e.firebaseapp.com",
  databaseURL:
    "https://e-commerce-3ec4e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "e-commerce-3ec4e",
  storageBucket: "e-commerce-3ec4e.appspot.com",
  messagingSenderId: "55240342124",
  appId: "1:55240342124:web:87265b6448dd47e83f7649",
};

const app = initializeApp(config);

module.exports = { app, db: getDatabase(app), storage: getStorage(app) };
