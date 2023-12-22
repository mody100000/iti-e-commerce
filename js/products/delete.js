// this file is for deleting a product

const { remove } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const { deleteRowFromTable } = require("../ui/table");
const { showToast } = require("../ui/toast");
/**
 *
 * @param {string} productKey
 */
const deleteProduct = async (productKey) => {
  const productRef = getFirebaseRef(`products/${productKey}`);
  deleteRowFromTable("products-table", productKey);
  await remove(productRef);
  showToast("Product is deleted", "success");
};

module.exports = { deleteProduct };
