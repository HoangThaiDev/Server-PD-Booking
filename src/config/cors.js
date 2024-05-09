// Import Modules
const { WHITELIST_DOMAINS } = require("../utils/constants");

exports.corsOptions = {
  origin: function (origin, callback) {
    if (WHITELIST_DOMAINS.includes(origin)) {
      console.log("sai localhost");
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
