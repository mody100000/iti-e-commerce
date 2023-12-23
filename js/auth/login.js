const { showToast } = require("../ui/toast");
const { getAuth, signInWithEmailAndPassword } = require("@firebase/auth");

/**
 * @param {SubmitEvent} event
 */
const handleFormLogin = (event) => {
  event.preventDefault();

  const form = document.forms["login-form"];

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

      showToast(`great you are signed in with user ${user.email}`, "success");
      //   TODO: redirect the user
    })
    .catch((error) => {
      const errorMessage = error.message;
      showToast(errorMessage, "danger");
    });
};

const loginFormRef = document.getElementById("login-form");

if (loginFormRef) {
  // login page
  loginFormRef.addEventListener("submit", handleFormLogin);
}
