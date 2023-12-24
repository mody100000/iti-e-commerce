const { get } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const $ = require("jquery");
const { createASpinner } = require("../ui/spinner");
const { addToCart } = require("./cart");

const renderProductsGrid = async () => {
  const gridElement = $("#products-grid");

  const spinner = createASpinner("products-grid");
  spinner.show();
  const snapshot = await get(getFirebaseRef("products"));
  spinner.hide();

  const val = snapshot.val();
  if (!val)
    return gridElement.append(
      $(`
  <div class="d-flex align-items-center justify-content-center">
    <div class="alert alert-warning text-center" role="alert">
      <h4 class="alert-heading">No Data Found</h4>
      <p>Sorry, there is no data available.</p>
    </div>
  </div>
  `)
    );

  // we have data

  Object.entries(val).forEach(([refId, product]) => {
    gridElement.append(
      $(`
        <div class="col-6 col-md-4">
        <div class="card cards">
          <img src="${product.image}" class="card-img-top product-card-image" alt="..." />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price}$</p>
            <a href="/pages/users/product.html?ref=${refId}" class="btn btn-warning m-3">See Product</a>
            <i class="fa-regular fa-heart"></i>
          </div>
        </div>
      </div>
        
        `)
    );
  });
};

const getProductDetails = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productRef = urlParams.get("ref");
  if (!productRef) return;

  const spinner = createASpinner("product-details-wrapper");
  const wrapper = $(`#product-details-wrapper`);
  spinner.show();
  const snapshot = await get(getFirebaseRef(`products/${productRef}`));
  spinner.hide();

  const product = snapshot.val();

  wrapper.append(
    $(`
  <div class="row">
  <div class="col-md-6">
    <img
      src="${product.image}"
      alt="Product Image"
      class="img-fluid"
    />
  </div>
  <div class="col-md-6">
    <h2 class="mb-3">${product.name}</h2>
    <p class="lead">${product.description}</p>
    <p><strong>Stock:</strong> ${product.quantity}</p>
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Category:</strong> ${product.category}</p>
  
    <button class="btn btn-primary" id="add-to-cart-btn">Add to Cart</button>
  </div>
  </div>
  
  `)
  );
  const addToCartBtn = $("#add-to-cart-btn");
  addToCartBtn.on("click", async () => {
    addToCartBtn.prop("disabled", true);
    await addToCart(productRef, 1);
    addToCartBtn.prop("disabled", false);
  });
};
module.exports = { renderProductsGrid, getProductDetails };
