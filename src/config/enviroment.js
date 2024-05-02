/** Config env */
require("dotenv").config();

const env = {
  MONGODB_URI_SERVER: process.env.MONGODB_URI_SERVER,
  DATABASE_NAME: process.env.DATABASE_NAME,
  AUTHOR: process.env.AUTHOR,
  LOCAL_APP_HOST: process.env.LOCAL_APP_HOST,
  LOCAL_APP_PORT: process.env.LOCAL_APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
};

module.exports = env;
