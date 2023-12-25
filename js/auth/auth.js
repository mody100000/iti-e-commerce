const { showToast } = require("../ui/toast");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("@firebase/auth");
const $ = require("jquery");

const USER_HOMEPAGE_PATH = "/pages/users/user_home_page.html";
const USER_LOGIN_PATH = "/pages/users/user_login.html";
const USER_SIGNUP_PATH = "/pages/users/registeration.html";
const ADMIN_HOMEPAGE_PATH = "/pages/admin/index.html";
const ADMIN_LOGIN_PATH = "/pages/admin/login/admin_login.html";

/**
 * @param {SubmitEvent} event
 */
const handleAdminFormLogin = (event) => {
  event.preventDefault();

  const form = document.forms["admin-login-form"];

  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");

  // validation
  if (email.trim() === "" || password.trim() === "") {
    showToast("Both email and password are required", "danger");
    return;
  }

  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const accessToken = user.accessToken;
      //   save jwt in local storage
      localStorage.setItem("TOKEN", accessToken);
      localStorage.setItem("isAdmin", "true");

      showToast(`great you are signed in with user ${user.email}`, "success");
      //   TODO: redirect the user
      window.location = ADMIN_HOMEPAGE_PATH;
    })
    .catch((error) => {
      const errorMessage = error.message;
      showToast(errorMessage, "danger");
    });
};

/**
 * @param {SubmitEvent} event
 */
const handleUserLogin = (event) => {
  event.preventDefault();

  const form = document.forms["user-login-form"];

  const formData = new FormData(form);
  const email = formData.get("email");
  const password = formData.get("password");

  // validation
  if (email.trim() === "" || password.trim() === "") {
    showToast("Both email and password are required", "danger");
    return;
  }

  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const accessToken = user.accessToken;
      //   save jwt in local storage
      localStorage.setItem("TOKEN", accessToken);
      localStorage.setItem("isAdmin", "false");

      showToast(`great you are signed in with user ${user.email}`, "success");
      window.location = USER_HOMEPAGE_PATH;
    })
    .catch((error) => {
      const errorMessage = error.message;
      showToast(errorMessage, "danger");
    });
};

/**
 * @param {SubmitEvent} event
 */
const handleUserRegisteration = (event) => {
  event.preventDefault();

  const form = document.forms["user-signup-form"];

  const serialized = $(form).serializeArray();
  const data = serialized.reduce((prev, curr) => {
    return { ...prev, [curr.name]: curr.value };
  }, {});

  for (const [key, value] of Object.entries(data)) {
    if (value.trim() === "") {
      showToast(`${key} field is required`, "danger");
      break;
    }
  }

  const auth = getAuth();

  $("#signup-btn").prop("disabled", true);
  createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      $("#signup-btn").prop("disabled", false);
      // Signed up
      const user = userCredential.user;
      const accessToken = user.accessToken;
      //   save jwt in local storage
      localStorage.setItem("TOKEN", accessToken);
      localStorage.setItem("isAdmin", "false");

      window.location = USER_HOMEPAGE_PATH;
    })
    .catch((error) => {
      $("#signup-btn").prop("disabled", false);

      const errorMessage = error.message;
      showToast(errorMessage, "danger");
    });
};

const adminLoginFormRef = document.getElementById("admin-login-form");
const userLoginFormRef = document.getElementById("user-login-form");
const userSignupFormRef = document.getElementById("user-signup-form");

const pathname = window.location.pathname;

if (pathname === ADMIN_LOGIN_PATH) {
  adminLoginFormRef.addEventListener("submit", handleAdminFormLogin);
}
if (pathname === USER_LOGIN_PATH) {
  userLoginFormRef.addEventListener("submit", handleUserLogin);
}
if (pathname === USER_SIGNUP_PATH) {
  userSignupFormRef.addEventListener("submit", handleUserRegisteration);
}

module.exports = {
  USER_HOMEPAGE_PATH,
  USER_LOGIN_PATH,
  USER_SIGNUP_PATH,
  ADMIN_HOMEPAGE_PATH,
  ADMIN_LOGIN_PATH,
};
