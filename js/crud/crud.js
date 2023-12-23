const { get, remove } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const { createASpinner } = require("../ui/spinner");
const { addRowToTable } = require("../ui/table");
const { showToast } = require("../ui/toast");

/**
 * wrapperId is a the id of the wraper and it should contain a table child
 * @param {string} wrapperId
 * @param {string} ref
 * @param {{
 *     type: "number" | "string" | "long_string" | "dropdown"
 *     name: string
 * }[]} fieldsConfig
 */
async function crud(wrapperId, ref, fieldsConfig) {
  const wrapperRef = document.getElementById(wrapperId);
  const tableRef = wrapperRef.querySelector("table");
  const tbodyRef = tableRef.querySelector("tbody");
  const theadRef = tableRef.querySelector("thead");

  // create a model and append it to the wrapper ref

  // create a form and append the form inputs inside the modal from the fieldsConfig

  // append the add button to the wrapper ref

  // show items
  const spinner = createASpinner(wrapperId);

  spinner.show();
  const snapshot = await get(getFirebaseRef(ref));
  spinner.hide();

  const data = snapshot.val();
  if (!data) {
    // no items in the real time database
    wrapperRef.appendChild(document.createTextNode("No data found"));
    return;
  }

  /////////////////////////////////// methods //////////////////////////
  async function deleteItem(refId, index) {
    // TODO: confirm message
    const itemRef = getFirebaseRef(`${ref}/${refId}`);
    const row = tbodyRef.querySelector(`#${refId}`);
    row.remove();
    await remove(itemRef);
    showToast("Item is deleted", "success");
  }

  function showModel() {}

  function hideModel() {}

  async function createProduct() {}

  async function editProduct(refId) {}

  async function createProduct(refId, index) {}

  /////////////////////////////////// end methods //////////////////////////

  // fill the thead
  const firstItem = Object.values(data)[0];
  const columns = Object.keys(firstItem); // ["name", "discription", "price"]

  const headerRow = theadRef.insertRow();

  const idCell = headerRow.insertCell();
  const idHeader = document.createElement("th");
  idHeader.textContent = "ID";

  idCell.appendChild(idHeader);

  columns.forEach((col) => {
    const cell = headerRow.insertCell();
    const cellHeader = document.createElement("th");
    cellHeader.textContent = col;
    cell.appendChild(cellHeader);
  });

  headerRow.insertCell(); // for delete column

  // fill the body
  Object.entries(data).forEach(([refId, item], index) => {
    // delete button
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn", "btn-danger");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteItem(refId, index);
    // edit button
    const editBtn = document.createElement("button");
    delBtn.classList.add("btn", "btn-info");
    delBtn.textContent = "Edit";
    delBtn.onclick = () => editProduct(refId);

    const cells = Object.values(item).map((v) => document.createTextNode(v));
    addRowToTable(tbodyRef, refId, [
      document.createTextNode(refId), // id
      ...cells, // rest of the data
      delBtn, // delte button
    ]);
  });
}

module.exports = { crud };
