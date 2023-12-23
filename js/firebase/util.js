const { ref } = require("@firebase/database");
const { db } = require("./config");
/**
 * 
 * @param {string} key 
 * @return {import("@firebase/database").DatabaseReference}
 */
const getFirebaseRef = (key) => {
  return ref(db, key);
};

module.exports = { getFirebaseRef };
