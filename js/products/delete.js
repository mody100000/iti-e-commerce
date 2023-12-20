// this file is for deleting a product

const { remove } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");

const deleteProduct = async (productKey) => {
  const productRef = getFirebaseRef(`products/${productKey}`);
  //   TODO: update the ui : remove the row
  await remove(productRef);
};

module.exports = { deleteProduct };
