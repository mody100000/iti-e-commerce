const { push, get, update, remove } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const $ = require("jquery");
const { createASpinner } = require("../ui/spinner");

const addToCart = async (productRef, quantity = 1) => {
  const currentUser = window.user;
  if (!currentUser) return;
  // get the product
  const productSnapshot = await get(getFirebaseRef(`products/${productRef}`));
  const productVal = productSnapshot.val();
  if (!productVal) return alert("Error: wrong product ref");

  // check if there is an item for this product in the cart
  let existingCartItemRef = undefined;
  let newQuantitiy = null;

  const currentCartItemsSnapshot = await get(
    getFirebaseRef(`cart/${currentUser.user_id}`)
  );

  const currentCartItems = currentCartItemsSnapshot.val();
  if (currentCartItems) {
    // check if the product exist or not
    for (const [cartItemRef, product] of Object.entries(currentCartItems)) {
      if (product.productRef == productRef) {
        existingCartItemRef = cartItemRef;
        newQuantitiy += product.quantity + quantity;
        break;
      }
    }
  }

  if (existingCartItemRef) {
    await update(
      getFirebaseRef(`cart/${currentUser.user_id}/${existingCartItemRef}`),
      {
        quantity: newQuantitiy,
      }
    );
  } else {
    await push(getFirebaseRef(`cart/${currentUser.user_id}`), {
      productRef,
      title: productVal.name,
      price: productVal.price,
      image: productVal.image,
      quantity: 1,
    });
  }

  //   redirect to cart
  window.location = "/pages/users/cart.html";
};

/**
 *
 * @param {string} productRef
 * @returns {boolean} newState
 */
const toggleProductInWishList = async (productRef) => {
  const currentUser = window.user;
  if (!currentUser) return;

  // get the product
  const productSnapshot = await get(getFirebaseRef(`products/${productRef}`));
  const productVal = productSnapshot.val();
  if (!productVal) return alert("Error: wrong product ref");

  const currentWishListItemsSnapshot = await get(
    getFirebaseRef(`wishList/${currentUser.user_id}`)
  );
  let existingWishListItemRef = null;

  const currentWishListItems = currentWishListItemsSnapshot.val();
  if (currentWishListItems) {
    // check if the product exist or not
    for (const [wishListItemRef, product] of Object.entries(
      currentWishListItems
    )) {
      if (product.productRef == productRef) {
        existingWishListItemRef = wishListItemRef;
        break;
      }
    }
  }

  if (existingWishListItemRef) {
    await remove(
      getFirebaseRef(
        `/wishList/${currentUser.user_id}/${existingWishListItemRef}`
      )
    );
    return false;
  } else {
    await push(getFirebaseRef(`wishList/${currentUser.user_id}`), {
      productRef,
      title: productVal.name,
      price: productVal.price,
      image: productVal.image,
      category: productVal.category,
    });
    return true;
  }
};
const showProductsInCart = async () => {
  const currentUser = window.user;
  if (!currentUser) return;

  const spinner = createASpinner("cart-wrapper");
  const tableBodyRef = $(`#cart-table tbody`);

  spinner.show();
  const snapshot = await get(getFirebaseRef(`cart/${currentUser.user_id}`));
  spinner.hide();

  const products = snapshot.val();
  if (!products) return;

  let total = 0;
  Object.entries(products).forEach(([ref, product]) => {
    const productTotal = product.quantity * product.price;
    total += productTotal;
    tableBodyRef.append(
      $(`
      <tr>
        <td><img src="${
          product.image
        }" class="cover" width="50" height="50" alt="${
        product.title
      }" class="img-thumbnail" width="100" height="100"></td>
        <td>${product.title}</td>
        <td>$${product.price}</td>
        <td>${product.quantity}</td>
        <td>$${product.quantity * product.price}</td>
      </tr>
    `)
    );
  });

  tableBodyRef.append(
    $(`
   <tr class="table-warning">
    <td colspan="4" class="text-end"><strong>Total:</strong></td>
    <td>$${total}</td>
  </tr>
  `)
  );

  // checkout button
  const checkoutBtn = $("#checkout-btn");
  checkoutBtn.on("click", async () => {
    checkoutBtn.prop("disabled", true);
    await checkoutAndCreateOrder();
    checkoutBtn.prop("disabled", false);
  });
};
const showProductsInWishList = async () => {
  const currentUser = window.user;
  if (!currentUser) return;

  const spinner = createASpinner("wish-list-wrapper");
  const tableBodyRef = $(`#wish-list-table tbody`);

  spinner.show();
  const snapshot = await get(getFirebaseRef(`wishList/${currentUser.user_id}`));
  spinner.hide();

  const products = snapshot.val();
  if (!products) return;

  let total = 0;
  Object.entries(products).forEach(([ref, product]) => {
    tableBodyRef.append(
      $(`
      <tr>
        <td><img src="${product.image}" class="cover" width="50" height="50" alt="${product.title}" class="img-thumbnail" width="100" height="100"></td>
        <td>${product.title}</td>
        <td>$${product.price}</td>
      </tr>
    `)
    );
  });
};
const checkoutAndCreateOrder = async () => {
  const currentUser = window.user;
  if (!currentUser) return;

  const userCartRef = getFirebaseRef(`cart/${currentUser.user_id}`);
  const snapshot = await get(userCartRef);

  const cart = snapshot.val();
  if (!cart) return;

  // create an order
  await push(getFirebaseRef(`orders`), {
    userId: currentUser.user_id,
    products: [...Object.values(cart)],
    status: "pending",
  });

  // empty the cart
  await remove(userCartRef);

  window.location = "/pages/users/track_orders.html";
};

module.exports = {
  addToCart,
  toggleProductInWishList,
  showProductsInWishList,
  showProductsInCart,
  checkoutAndCreateOrder,
};
