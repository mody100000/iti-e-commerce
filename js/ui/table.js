/**
 * @param {HTMLElement} tbodyRef
 * @param {string} rowId
 * @param {HTMLElement[]} elements
 */
const addRowToTable = (tbodyRef, rowId, elements) => {
  const newRow = tbodyRef.insertRow();
  newRow.id = rowId;
  elements.forEach((element) => {
    var cell = newRow.insertCell();
    cell.appendChild(element);
  });
};
/**
 * @param {string} tableId
 * @param {string} rowID
 */
const deleteRowFromTable = (tableId, rowID) => {
  const row = document.querySelector(`#${tableId} tr#${rowID}`);
  row.remove();
};

module.exports = { addRowToTable, deleteRowFromTable };
