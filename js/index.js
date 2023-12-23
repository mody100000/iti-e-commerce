// bootstrab
require("bootstrap");
require("./firebase/config");

const init = async () => {
  require("./products/list");
  require("./auth/login");
};
init();
