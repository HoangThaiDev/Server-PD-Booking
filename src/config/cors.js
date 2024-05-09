// Import Modules
const { WHITELIST_DOMAINS } = require("../utils/constants");
const env = require("../config/enviroment");

exports.corsOptions = {
  origin: function (origin, callback) {
    if (env.BUILD_MODE === "dev") {
      return callback(null, true);
    }
    if (WHITELIST_DOMAINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
