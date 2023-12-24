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
  //creating a form modal
  let editProductData = null; // Variable to store data of the product being edited

  function showEditModel(editData) {
    editProductData = editData; // Store the product data in the variable
    const inputValues = {}; // Object to store input values
    const modal = createModalStructure(true, editData, inputValues);
    const editButton = modal.querySelector(".btn-info");
    editButton.onclick = () => handleEditProduct(inputValues);
    wrapperRef.appendChild(modal);
    showModal();
  }

  function handleEditProduct(inputValues) {
    // Access the input values from the inputValues object
    const editedProductName = inputValues.productName; // Assuming "productName" is the input name

    // TODO: Submit the edited product data, e.g., update the product name in the database
    // For demonstration purposes, I'll log the edited product name to the console
    console.log("Edited Product Name:", editedProductName);

    // Close the modal
    hideModal();

    // Reset the variable storing the product data
    editProductData = null;
  }
  function createForm(fieldsConfig, isEditing, editData, inputValues) {
    const form = document.createElement("form");

    fieldsConfig.forEach((field) => {
      const formGroup = document.createElement("div");
      formGroup.classList.add("form-group");

      const label = document.createElement("label");
      label.textContent = field.name;

      const input = document.createElement("input");
      input.setAttribute("type", field.type);
      input.classList.add("form-control");
      input.setAttribute("placeholder", field.name);

      // If editing, populate input with existing data
      if (isEditing && editData && field.name in editData) {
        input.value = editData[field.name];
      }

      formGroup.appendChild(label);
      formGroup.appendChild(input);

      form.appendChild(formGroup);
    });

    const actionButton = document.createElement("button");
    actionButton.textContent = isEditing ? "Save" : "Add";
    actionButton.type = "button";
    actionButton.classList.add("btn", isEditing ? "btn-info" : "btn-primary");
    actionButton.onclick = isEditing ? () => saveEdit(editData) : showModel;

    form.appendChild(actionButton);

    return form;
  }

  function showModel() {
    // Create the modal structure for adding a new item
    const modal = createModalStructure(false);
    wrapperRef.appendChild(modal);
    showModal();
  }

  function showEditModel(editData) {
    // Create the modal structure for editing an existing item
    const modal = createModalStructure(true, editData);
    const editButton = modal.querySelector(".btn-info"); // Get the "Save" button inside the modal
    editButton.onclick = () => saveEdit(editData);

    wrapperRef.appendChild(modal);
    showModal();
  }

  function createModalStructure(isEditing, editData) {
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", "myModal");
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "exampleModalLabel");
    modal.setAttribute("aria-hidden", "true");

    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Create a form and append form inputs inside the modal based on fieldsConfig
    const form = createForm(fieldsConfig, isEditing, editData);
    modalContent.appendChild(form);

    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    return modal;
  }

  async function saveEdit(editData) {
    // Implement logic to save edited data to the database
    hideModal();
    // Additional logic for saving the edited data goes here
  }

  function showModal() {
    // Show the modal
    const modalElement = document.getElementById("myModal");
    modalElement.classList.add("show", "d-block");
  }

  function hideModal() {
    // Hide the modal
    const modalElement = document.getElementById("myModal");
    modalElement.classList.remove("show", "d-block");

    // Remove the modal from the DOM after it is hidden
    modalElement.parentNode.removeChild(modalElement);
  }

  //   function showModel() {}

  //   function hideModel() {}

  //   async function createProduct() {}

  //   async function editProduct(refId) {}

  //   async function createProduct(refId, index) {}

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
    editBtn.classList.add("btn", "btn-info");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => showEditModel(item);

    const cells = Object.values(item).map((v) => document.createTextNode(v));
    const nameCell = cells.find((cell, i) => columns[i] === "name"); // Assuming "name" is a column
    const name = nameCell ? nameCell.nodeValue : "";
    addRowToTable(tbodyRef, refId, [
      document.createTextNode(refId), // id
      ...cells, // rest of the data
      delBtn, // delete button
      editBtn, // edit button
    ]);
  });
}

module.exports = { crud };
