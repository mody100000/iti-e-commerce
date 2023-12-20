// this file is for getting all the products and list them in a table

const { onValue } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const { deleteProduct } = require("./delete");
const TABLE_ID = "products-table";

const tableRef = document.getElementById(TABLE_ID);

const getAllProducts = async () => {
  const tbodyRef = tableRef.getElementsByTagName("tbody")[0];
  //   TODO: add a spinner loader
  onValue(getFirebaseRef("products"), (snapshot) => {
    const products = snapshot.val();

    Object.entries(products).forEach(([productKey, productData], index) => {
      // Insert a row at the end of table
      var newRow = tbodyRef.insertRow();

      var idCell = newRow.insertCell();
      idCell.appendChild(document.createTextNode(productKey));

      // Insert a cell at the end of the row
      var idCell = newRow.insertCell();
      idCell.appendChild(document.createTextNode(productData.name));

      //   delete button
      var deleteCell = newRow.insertCell();
      const delBtn = document.createElement("button");
      delBtn.classList.add("btn", "btn-danger");
      delBtn.textContent = "Delete";
      delBtn.onclick = () => deleteProduct(productKey);
      deleteCell.appendChild(delBtn);
    });
  });
};

if (tableRef) {
  // products page is shown

  // TODO: check the authentication for admin and redirect if not authorized
  getAllProducts();
}
