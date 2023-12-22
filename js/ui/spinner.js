const { fromHTML } = require("./utils");

/**
 * @param {string} parentElementId
 *
 */
const createASpinner = (parentElementId) => {
  const element = document.getElementById(parentElementId);
  if (!element) return;
  const spinnerElement = fromHTML(`
    <div class="spinner-border" role="status">
        <span class="sr-only"></span>
    </div>
  `);
  const show = () => {
    element.classList.add("center");
    element.insertBefore(spinnerElement, element.firstChild);
  };
  const hide = () => {
    element.classList.remove("center");
    element.removeChild(spinnerElement);
  };

  return { show, hide };
};

module.exports = { createASpinner };
