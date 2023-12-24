const { jwtDecode } = require("jwt-decode");

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
    return true;
  } catch {
    console.log("token is invalid");
    localStorage.removeItem("TOKEN");
    redirectToLogin();
  }
};

const redirectToLogin = () => {
  const pathname = window.location.pathname;
  const inLoginPage =
    pathname === "/pages/admin/login/admin_login.html" ||
    pathname === "/pages/users/user_login.html";
  if (inLoginPage) return;
  window.location = "/pages/admin/login/admin_login.html";
};

module.exports = { isAuthenticated };
