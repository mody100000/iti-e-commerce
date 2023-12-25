const { get, orderByChild, query, equalTo } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const $ = require("jquery");
const { createASpinner } = require("../ui/spinner");

const listUserOrders = async () => {
  const currentUser = window.user;
  if (!currentUser) return;

  const userId = currentUser.user_id;

  const ordersRef = getFirebaseRef("orders");

  const userOrdersQuery = query(
    ordersRef,
    orderByChild("userId"),
    equalTo(userId)
  );

  const spinner = createASpinner("ordersAccordion");
  spinner.show();
  const userOrdersSnapshot = await get(userOrdersQuery);
  spinner.hide();

  if (userOrdersSnapshot.exists) {
    const orders = userOrdersSnapshot.val();
    if (!orders) return;

    const ordersWrapper = $(`#ordersAccordion`);
    Object.entries(orders).forEach(([orderRef, order]) => {
      let total = 0;
      ordersWrapper.append(
        $(`
        <div class="accordion-item">
        <h2 class="accordion-header" id="order-${orderRef}">
          <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#order-collaps-${orderRef}"
            aria-expanded="true"
            aria-controls="order-collaps-${orderRef}"
          >
            Order #${orderRef.substring(0, 5)} - Status: <span class="badge mx-2
            ${
              order.status === "pending"
                ? "bg-warning"
                : order.status === "approved"
                ? "bg-success"
                : order.status === "denied"
                ? "bg-danger"
                : ""
            }
            
            
            ">${order.status}</span>
          </button>
        </h2>
        <div
          id="order-collaps-${orderRef}"
          class="accordion-collapse collapse show"
          aria-labelledby="order-${orderRef}"
          data-bs-parent="#ordersAccordion"
        >
          <div class="accordion-body">
            <ul>
            ${order.products.map((product) => {
              total += product.price * product.quantity;
              return `<li>Product: ${product.title} - Quantity: ${product.quantity} - Price: $${product.price}</li>`;
            })}
            </ul>
            <p><strong>Total Price:</strong> $${total}</p>
          </div>
        </div>
        </div>

        `)
      );
    });
  }
};

module.exports = { listUserOrders };
