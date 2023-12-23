const { get } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const { createASpinner } = require("../ui/spinner");

/**
 * wrapperId is a the id of the wraper and it should contain a table child
 * @param {string} wrapperId
 * @param {string} ref
 * @param {{
 *     type: "number" | "string" | "long_string" | "dropdown"
 *       name: string
 * }[]} fieldsConfig
 */
async function crud(wrapperId, ref, fieldsConfig) {
    const wrapperRef = document.getElementById(wrapperId)
    const tableRef = wrapperRef.querySelector("table")
    const tbodyRef = tableRef.querySelector("tbody")
    const theadRef = tableRef.querySelector("thead")

    // show items
    const spinner = createASpinner(wrapperId);

    spinner.show()
    const snapshot = await get(getFirebaseRef(ref))
    spinner.hide()

    const data = snapshot.val()
    if(!data) {
        // no items in the real time database
        wrapperRef.appendChild(document.createTextNode("No data found"))
        return
    }

    // fill the thead
    const columns = data
}
