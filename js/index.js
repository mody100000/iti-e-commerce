// bootstrab
require("bootstrap");
require("./firebase/config");

const init = async () => {
  await require("./products/list");
};
init();
