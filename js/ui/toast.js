const Toastify = require("toastify-js");

// implement toast notifications
/**
 *
 * @param {string} text
 * @param {"info" | "warning" | "danger" | "success" | "default"} type
 * @param {number} duration
 */
const showToast = (text, type, duration) => {
  Toastify({
    text,
    duration: duration || 3000,
    close: true,
    gravity: "bottom", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background:
        type === "danger"
          ? "linear-gradient(to right, #e53935, #b71c1c)"
          : type === "info"
          ? "linear-gradient(to right, #2196F3, #1565C0)"
          : type === "success"
          ? "linear-gradient(to right, #4CAF50, #388E3C)"
          : type === "warning"
          ? "linear-gradient(to right, #FFC107, #FFA000)"
          : type === "default"
          ? "linear-gradient(to right, #9e9e9e, #616161)"
          : "",
    },
  }).showToast();
};

module.exports = { showToast };
