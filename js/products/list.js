// this file is for getting all the products and list them in a table

const { getFirebaseRef } = require("../firebase/util");
const { deleteProduct } = require("./delete");
const { addRowToTable } = require("../ui/table");
const { createASpinner } = require("../ui/spinner");
const { get, push } = require("@firebase/database");
const { isAuthenticated } = require("../auth/checkAuth");
const { crud } = require("../crud/crud");
const TABLE_ID = "products-table";

const tableRef = document.getElementById(TABLE_ID);

const getAllProducts = async () => {
  crud("products-list", "products", []);
};

if (tableRef) {
  // products page is shown
  const valid = isAuthenticated();
  if (valid) getAllProducts();
}
