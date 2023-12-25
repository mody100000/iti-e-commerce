// bootstrab
require("bootstrap/dist/js/bootstrap");
require("jquery/dist/jquery");
require("./firebase/config");
const { crud } = require("./crud/crud");
const { isAuthenticated } = require("./auth/checkAuth");
const { fromHTML } = require("./ui/utils");
const { renderProductsGrid, getProductDetails } = require("./user/products");
const { showProductsInCart } = require("./user/cart");
const { listUserOrders } = require("./user/order");
const { USER_HOMEPAGE_PATH, ADMIN_HOMEPAGE_PATH } = require("./auth/auth");
const init = async () => {
  require("./auth/auth");
};
init();

// render navbars
const pathname = window.location.pathname;

if (pathname.startsWith("/pages/admin") && !pathname.includes("login")) {
  document.body.prepend(
    fromHTML(`
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div style="display: flex;align-items: center;gap: 15px">
    <img class="logo" src="/images/logo.png" width="70" height="70" alt="logo" />
    <a class="navbar-brand" href="#">E-commerce Admin</a>
  </div>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="${ADMIN_HOMEPAGE_PATH}">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/pages/admin/products/index.html">Products</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/pages/admin/category/index.html">Categories</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/pages/admin/orders/index.html">Orders</a>
          </li>
        </ul>
      </div>
    </nav>
  
  `)
  );
} else if (pathname.startsWith("/pages/users") && !pathname.includes("login")) {
  document.body.prepend(
    fromHTML(`
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <img
      class="logo"
      width="50"
      height="50"
      src="/images/logo.png"
      alt="logo"
    />
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a
            class="nav-link active"
            aria-current="page"
            href="${USER_HOMEPAGE_PATH}"
            >Home</a
          >
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/users/track_orders.html">Orders</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/users/contact_us.html">Contact Us</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/pages/users/about_us.html">About Us</a>
        </li>
      </ul>
      <a href="/pages/users/wish_list.html"
        ><i
          class="fa-regular fa-heart fa-2x"
          style="margin-right: 2vw; margin-left: 2vw"
        ></i
      ></a>
      <a href="/pages/users/cart.html"
        ><i class="fa-solid fa-cart-shopping fa-2x"></i
      ></a>
    </div>
  </div>
</nav>
  
  `)
  );
}

const getAllProducts = async () => {
  crud("products-list", "products", [
    {
      name: "name",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "category",
      type: "dropdown",
      fkRef: "categories",
    },
    {
      name: "image",
      type: "file",
    },
    {
      name: "price",
      type: "number",
    },
    {
      name: "quantity",
      type: "number",
    },
  ]);
};

const getAllCategories = async () => {
  crud("categories-list", "categories", [
    {
      name: "name",
      type: "text",
    },
  ]);
};

const valid = isAuthenticated();

if (valid) {
  if (pathname === "/pages/admin/products/index.html") {
    getAllProducts();
  } else if (pathname === "/pages/admin/category/index.html") {
    getAllCategories();
  } else if (pathname === USER_HOMEPAGE_PATH) {
    renderProductsGrid();
  } else if (pathname === "/pages/users/product.html") {
    getProductDetails();
  } else if (pathname === "/pages/users/cart.html") {
    showProductsInCart();
  } else if (pathname === "/pages/users/track_orders.html") {
    listUserOrders();
  }
}
