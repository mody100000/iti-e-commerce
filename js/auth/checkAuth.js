const { jwtDecode } = require("jwt-decode");
const {
  USER_LOGIN_PATH,
  ADMIN_LOGIN_PATH,
  USER_SIGNUP_PATH,
  ADMIN_HOMEPAGE_PATH,
  USER_HOMEPAGE_PATH,
} = require("./auth");

const pathname = window.location.pathname;
const isLoginOrSignupPage =
  pathname === ADMIN_LOGIN_PATH ||
  pathname === USER_LOGIN_PATH ||
  pathname === USER_SIGNUP_PATH;

const isAdminLocalStorage = localStorage.getItem("isAdmin");
const isAdmin = isAdminLocalStorage === "true";
/**
 * @return {boolean}
 */
const isAuthenticated = () => {
  // retrieve the token
  const token = localStorage.getItem("TOKEN");
  if (!token) return redirectToLogin();

  try {
    const payload = jwtDecode(token);
    // save the user data
    window.user = payload;
    // authenticated

    // prevent logged in users(admin / non-admin) to access any login or signup page.
    if (isLoginOrSignupPage) {
      if (pathname.includes("admin") && isAdmin) {
        window.location = ADMIN_HOMEPAGE_PATH;
      } else {
        window.location = USER_HOMEPAGE_PATH;
      }
    }
    // prevent non admin users to access admin pages
    if (!isAdmin && isPathProtected()) {
      window.location = USER_HOMEPAGE_PATH;
    }
    return true;
  } catch {
    console.log("token is invalid");
    localStorage.removeItem("TOKEN");
    redirectToLogin();
  }
};

const redirectToLogin = () => {
  if (isPathPublic()) return;

  if (pathname.startsWith("/pages/admin")) {
    window.location = ADMIN_LOGIN_PATH;
  } else {
    window.location = USER_LOGIN_PATH;
  }
};

/**
 * @return {boolean}
 */
const isPathProtected = () => {
  return pathname.startsWith("/pages/admin") && !isLoginOrSignupPage;
};

/**
 * @return {boolean}
 */
const isPathPublic = () => {
  return isLoginOrSignupPage || pathname == "/";
};
module.exports = { isAuthenticated };
