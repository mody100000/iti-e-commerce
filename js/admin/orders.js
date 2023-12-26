const { get, update } = require("@firebase/database");
const $ = require("jquery");
const { getFirebaseRef } = require("../firebase/util");
const { createASpinner } = require("../ui/spinner");

const viewAllOrders = async () => {
  const tableBodyRef = $("#admin-orders-wrapper tbody");
  const spinner = createASpinner("admin-orders-wrapper");

  spinner.show();
  const allOrdersSnapshot = await get(getFirebaseRef("orders"));
  spinner.hide();

  const allOrders = allOrdersSnapshot.val();
  if (allOrders) {
    Object.entries(allOrders)
      .forEach(([orderId, order]) => {
        const row = $(`
        <tr>
            <td>${orderId}</td>
            <td>
                <ul>
                    ${order.products.map(
                      (product) => `
                        <li>title: ${product.title}, quantity: ${
                        product.quantity
                      }, total: $${product.quantity * product.price}</li>
                    `
                    )}
                </ul>
            </td>
            <td>${order.status}</td>
        </tr>
    `);
        const approveBtn = $(
          `<button class="btn btn-success">Approve</button>`
        );
        const denyButton = $(`<button class="btn btn-danger">Deny</button>`);

        approveBtn.on("click", () => approveOrder(orderId));
        denyButton.on("click", () => denyOrder(orderId));

        if (order.status !== "approved") {
          row.append($("<td></td>").append(approveBtn));
        } else {
          row.append($("<td></td>"));
        }

        if (order.status !== "denied") {
          row.append($("<td></td>").append(denyButton));
        } else {
          row.append($("<td></td>"));
        }

        tableBodyRef.append(row);
      });
  }
};

const approveOrder = (orderRef) => {
  update(getFirebaseRef(`orders/${orderRef}`), {
    status: "approved",
  });
  window.location.reload();
};

const denyOrder = (orderRef) => {
  update(getFirebaseRef(`orders/${orderRef}`), {
    status: "denied",
  });
  window.location.reload();
};

module.exports = {
  viewAllOrders,
};
