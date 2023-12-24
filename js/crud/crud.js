const { get, remove, update, push } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const { createASpinner } = require("../ui/spinner");
const { addRowToTable } = require("../ui/table");
const { showToast } = require("../ui/toast");
const { fromHTML } = require("../ui/utils");
const $ = require("jquery");
const { storage } = require("../firebase/config");
const { ref, uploadBytes, getDownloadURL } = require("@firebase/storage");
/**
 * wrapperId is a the id of the wraper and it should contain a table child
 * @param {string} wrapperId
 * @param {string} ref
 * @param {{
 *     type: "number" | "text" | "textarea" | "dropdown" | "file"
 *     name: string
 *     fkRef: string
 * }[]} fieldsConfig
 */
async function crud(wrapperId, ref, fieldsConfig) {
  const wrapperRef = document.getElementById(wrapperId);
  const tableRef = wrapperRef.querySelector("table");
  const tbodyRef = tableRef.querySelector("tbody");
  const theadRef = tableRef.querySelector("thead");

  renderModal(ref, wrapperRef);

  // show items
  const spinner = createASpinner(wrapperId);
  spinner.show();
  const snapshot = await get(getFirebaseRef(ref));
  spinner.hide();

  // add add button
  const addBtn = $(`
 <button class="btn btn-success mb-4 ml-4" data-toggle="modal" data-target="#modal-${ref}">Create ${ref}</button>
`);

  addBtn.on("click", () => {
    showCreateModel();
  });
  $(wrapperRef).prepend(addBtn);

  const data = snapshot.val();
  if (!data) {
    // no items in the real time database
    wrapperRef.appendChild(
      fromHTML(`
    <div class="d-flex align-items-center justify-content-center">
      <div class="alert alert-warning text-center" role="alert">
        <h4 class="alert-heading">No Data Found</h4>
        <p>Sorry, there is no data available.</p>
      </div>
    </div>
    `)
    );
    return;
  }

  /////////////////////////////////// methods //////////////////////////
  async function deleteItem(refId) {
    // TODO: confirm message
    const itemRef = getFirebaseRef(`${ref}/${refId}`);
    const row = tbodyRef.querySelector(`#${refId}`);
    row.remove();
    await remove(itemRef);
    showToast("Item is deleted", "success");
  }

  function showEditModel(data, itemRef) {
    // ref is the global ref for the collection like "products"
    // itemRef is the ref of the item like the ref of a specific product
    fillModalDynamicData(ref, fieldsConfig, itemRef, data);
  }

  function showCreateModel() {
    // ref is the global ref for the collection like "products"
    // itemRef is the ref of the item like the ref of a specific product
    fillModalDynamicData(ref, fieldsConfig);
  }

  /////////////////////////////////// end methods //////////////////////////

  // TABLE
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
    cellHeader.setAttribute("scope", "col");
    cellHeader.textContent = col;
    cell.appendChild(cellHeader);
  });

  headerRow.insertCell(); // for delete column
  headerRow.insertCell(); // for edit column

  // fill the body
  Object.entries(data).forEach(([refId, item]) => {
    // delete button
    const delBtn = document.createElement("button");
    delBtn.classList.add("btn", "btn-danger");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteItem(refId);

    // edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("btn", "btn-info");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("data-toggle", "modal");
    editBtn.setAttribute("data-target", `#modal-${ref}`);
    editBtn.onclick = () => showEditModel(item, refId);

    const cells = Object.values(item).map((v) => {
      if (typeof v == "string" && v.startsWith("https://firebasestorage")) {
        // we have an image
        const img = fromHTML(`
        <img src="${v}" class="img-fluid border" width="100" height="100" />
        `);
        return img;
      }

      return document.createTextNode(v);
    });
    addRowToTable(tbodyRef, refId, [
      document.createTextNode(refId), // id
      ...cells, // rest of the data
      delBtn, // delete button
      editBtn, // edit button
    ]);
  });
}

/**
 *
 * @param {string} ref
 * @param {HTMLElement} wrapperRef
 */
function renderModal(ref, wrapperRef) {
  const modal = fromHTML(`
    <div class="modal fade" id="modal-${ref}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Edit</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body" id="modal-${ref}-body">
        </div>
        <div class="modal-footer" id="modal-${ref}-footer">
        </div>
      </div>
      </div>
    </div>
  `);
  wrapperRef.appendChild(modal);
}

/**
 *
 * @param {string} ref // global ref
 * @param {{
 *     type: "number" | "text" | "textarea" | "dropdown" | "file"
 *     name: string
 *     fkRef: string
 * }[]} fields
 * @param {string} itemRef
 * @param {Object} data
 */
async function fillModalDynamicData(ref, fields, itemRef, data) {
  const isEditing = !!data && !!itemRef;

  const modalBody = $(`#modal-${ref}-body`);
  const modalFooter = $(`#modal-${ref}-footer`);

  modalBody.empty();
  modalFooter.empty();

  const form = $(`
    <form id="form-${ref}"></form>
  `);

  const fkFields = fields.filter((field) => !!field.fkRef);
  const fkCollections = {};
  for (const field of fkFields) {
    const collectionRef = getFirebaseRef(field.fkRef);
    const snapshot = await get(collectionRef);
    const value = snapshot.val();
    if (!value) fkCollections[field.name] = [];
    else
      fkCollections[field.name] = Object.values(value).map((item) => item.name);
  }

  console.log(fkCollections);
  fields.forEach((field) => {
    let element;
    switch (field.type) {
      case "text":
        element = fromHTML(`
        <div class="form-outline mb-4">
          <label class="form-label" for="${field.name}">${field.name}</label>
          <input type="text" id="${field.name}" class="form-control" name="${
          field.name
        }"
          ${isEditing ? `value="${data[field.name]}"` : ""}
          />
        </div>
        `);
        break;
      case "number":
        element = fromHTML(`
        <div class="form-outline mb-4">
          <label class="form-label" for="${field.name}">${field.name}</label>
          <input type="number" id="${field.name}" class="form-control" name="${
          field.name
        }"
          ${isEditing ? `value="${data[field.name]}"` : ""}
          />
        </div>
        `);
        break;
      case "file":
        element = fromHTML(`
        <div class="form-outline mb-4">
          <label class="form-label" for="${field.name}">${field.name}</label>
          <input type="file" id="field-${
            field.name
          }" class="form-control" name="${field.name}"
          ${isEditing ? `value="${data[field.name]}"` : ""}
          />
        </div>
        `);
        break;
      case "dropdown":
        element = fromHTML(`
        <div class="form-outline mb-4">
        <label class="form-label" for="${field.name}">${field.name}</label>
          <select class="custom-select" id="${field.name}" name="${field.name}">
            ${fkCollections[field.name].map(
              (key) => `
              <option 
              ${isEditing ? (key == data[field.name] ? "selected" : "") : ""}
              value="${key}">${key}</option>
            `
            )}
          </select>
        </div>
        `);
        break;
      case "textarea":
        element = fromHTML(`
        <div class="form-outline mb-4">
          <label class="form-label" for="${field.name}">${field.name}</label>
          <textarea class="form-control" id="${field.name}" name="${field.name}" rows="3">${isEditing ? data[field.name] : ""}</textarea>
        </div>

          `);
        break;
      default:
        element = fromHTML(
          `<span>Error: field type ${field.type} not supported</span>`
        );
        break;
    }
    form.append(element);
  });

  modalBody.append(form);

  // add close button to modal
  modalFooter.append(
    fromHTML(`
    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
  `)
  );

  // add save button to modal
  const saveBtn = fromHTML(`
  <button type="button" class="btn btn-primary">Save changes</button>
  `);

  saveBtn.onclick = isEditing
    ? () => handleCreateAndUpdate(ref, form, fields, `${ref}/${itemRef}`)
    : () => handleCreateAndUpdate(ref, form, fields);
  modalFooter.append(saveBtn);
}

/**
 *
 * @param {string} ref
 * @param {HTMLFormElement} form
 * @param {[]} fieldsConfig
 * @param {string} fullItemRef
 *
 */
async function handleCreateAndUpdate(ref, form, fieldsConfig, fullItemRef) {
  const edit = !!fullItemRef;
  const serialized = $(form).serializeArray();
  const data = serialized.reduce((prev, curr) => {
    return { ...prev, [curr.name]: curr.value };
  }, {});

  const fileFields = fieldsConfig.filter((field) => field.type == "file");

  for (const field of fileFields) {
    const inputFieldRef = $(`#field-${field.name}`);
    const file = inputFieldRef.prop("files")[0];
    if (file) {
      const url = await uploadFile(file);
      data[field.name] = url;
    }
  }
  if (edit) {
    await update(getFirebaseRef(fullItemRef), data);
  } else {
    await push(getFirebaseRef(ref), data);
  }
  window.location.reload();
}

/**
 *
 * @param {Blob | Uint8Array | ArrayBuffer} file
 * @return {Promise<string>}
 */
async function uploadFile(file) {
  const fileRef = ref(storage, "images/" + file.name);

  return uploadBytes(fileRef, file).then(() => {
    return getDownloadURL(fileRef).then((downloadURL) => {
      return downloadURL;
    });
  });
}

module.exports = { crud };
