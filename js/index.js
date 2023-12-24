// bootstrab
require("bootstrap/dist/js/bootstrap");
require("jquery/dist/jquery");
require("./firebase/config");
const { crud } = require("./crud/crud");
const { isAuthenticated } = require("./auth/checkAuth");
const { fromHTML } = require("./ui/utils");
const init = async () => {
  require("./auth/login");
};
init();

// render navbars
const pathname = window.location.pathname;

if (pathname.startsWith("/pages/admin")) {
  document.body.prepend(
    fromHTML(`
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">E-commerce Admin</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item active">
            <a class="nav-link" href="/pages/admin/index.html">Home <span class="sr-only">(current)</span></a>
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
}

const productsWrapperRef = document.getElementById("products-list");
const categoriesWrapperRef = document.getElementById("categories-list");

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
  if (productsWrapperRef) {
    getAllProducts();
  }
  if (categoriesWrapperRef) {
    getAllCategories();
  }
}
