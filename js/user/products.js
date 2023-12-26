const { get } = require("@firebase/database");
const { getFirebaseRef } = require("../firebase/util");
const $ = require("jquery");
const { createASpinner } = require("../ui/spinner");
const { addToCart } = require("./cart");
const { toggleProductInWishList } = require("./cart");

const FILLED_HEART_ICON= '<i class="fa-solid fa-heart"></i>'
const EMPTY_HEART_ICON= '<i class="fa-regular fa-heart"></i>'

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
        <div class="col-12 col-sm-6 col-md-4">
        <div class="card cards">
          <img src="${product.image}" class="card-img-top product-card-image" alt="..." />
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price}$</p>
            <div class="row justify-content-between">
            <div class="col">
            <a href="/pages/users/product.html?ref=${refId}" class="btn btn-warning">See Product</a>
            </div>
          </div>
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

  // get if the product is inside the wishlist for the current user
  let iconElement = EMPTY_HEART_ICON
  const userWishListSnapshot = await get(getFirebaseRef(`wishList/${window.user?.user_id}`))
  const userWishList = userWishListSnapshot.val()
  if(userWishList){
    Object.values(userWishList).forEach(wishListItem => {
      if(wishListItem.productRef === productRef){
        iconElement = FILLED_HEART_ICON
      }
    })
  }

  wrapper.append(
    $(`
  <div class="row">
  <div class="col-md-6">
    <img
      src="${product.image}"
      alt="Product Image"
      class="img-fluid"
      style="border-radius:10px;"
    />
  </div>
  <div class="col-md-6">
    <h2 class="mb-3">${product.name}</h2>
    <p class="lead">${product.description}</p>
    <p><strong>Stock:</strong> ${product.quantity}</p>
    <p><strong>Price:</strong> $${product.price}</p>
    <p><strong>Category:</strong> ${product.category}</p>
  
    <button class="btn btn-warning" id="add-to-cart-btn">Add to Cart</button></br></br>
    <button class="btn btn-warning" id="add-to-wish-list-btn">
      ${iconElement}
    </button>
  </div>
  </div>
  <div class="container-fluid" style="height:10vh;">
  </div>
  <footer class="bg-dark text-light text-center py-3">
        <p>&copy; 2023 OnlineMarket. All rights reserved.</p>
  </footer>
  
  
  `)
  );
  const addToCartBtn = $("#add-to-cart-btn");
  addToCartBtn.on("click", async () => {
    addToCartBtn.prop("disabled", true);
    await addToCart(productRef, 1);
    addToCartBtn.prop("disabled", false);
  });
  const toggleProductInWishListBtn = $("#add-to-wish-list-btn");
  toggleProductInWishListBtn.on("click", async () => {
    toggleProductInWishListBtn.prop("disabled", true);
    const isProductInWishList = await toggleProductInWishList(productRef);
    toggleProductInWishListBtn.prop("disabled", false);
    
    toggleProductInWishListBtn.html(isProductInWishList ? FILLED_HEART_ICON : EMPTY_HEART_ICON)
  });
};
module.exports = { renderProductsGrid, getProductDetails };
