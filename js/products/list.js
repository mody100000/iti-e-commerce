// this file is for getting all the products and list them in a table

const { getFirebaseRef } = require("../firebase/util");
const { deleteProduct } = require("./delete");
const { addRowToTable } = require("../ui/table");
const { createASpinner } = require("../ui/spinner");
const { get, push } = require("@firebase/database");
const { isAuthenticated } = require("../auth/checkAuth");
const TABLE_ID = "products-table";

const tableRef = document.getElementById(TABLE_ID);

const getAllProducts = async () => {
  const productsRef = getFirebaseRef("products");
  const spinner = createASpinner("products-list");

  // await push(productsRef, {
  //   name: "product 1"
  // })
  spinner.show();
  const snapshot = await get(productsRef);
  spinner.hide();

  const products = snapshot.val();
  if (!products) return;

  Object.entries(products).forEach(([productKey, productData], index) => {
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn", "btn-danger");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteProduct(productKey, index);

    addRowToTable(TABLE_ID, productKey, [
      document.createTextNode(productKey),
      document.createTextNode(productData.name),
      delBtn,
    ]);
  });
};

if (tableRef) {
  // products page is shown
  const valid = isAuthenticated();
  if (valid) getAllProducts();
}
