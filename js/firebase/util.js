const { ref } = require("@firebase/database");
const { db } = require("./config");

const getFirebaseRef = (key) => {
  return ref(db, key);
};

module.exports = { getFirebaseRef };
