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
  const inLoginPage = (window.location.pathname === "/pages/auth/login.html")
  if(inLoginPage) return
  window.location = "/pages/auth/login.html";
};

module.exports = { isAuthenticated };
