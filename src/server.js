// import Modules
const express = require("express");
const cors = require("cors");
const app = express();
const mongooseConnect = require("./utils/database");
const env = require("./config/enviroment");
const { corsOptions } = require("./config/cors");

// Import Router
const cityRouter = require("./router/city");
const resortRouter = require("./router/resort");
const roomRouter = require("./router/room");
const cartRouter = require("./router/cart");
const userRouter = require("./router/user");

// Create Middlewares
app.use(express.json());
app.use(cors(corsOptions));

// Create Server DBS + Connect Server
mongooseConnect(() => {
  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, (err) => {
      console.log(
        `Production: Hi ${env.AUTHOR}. Start server at port: ${process.env.PORT}`
      );
    });
  } else {
    app.listen(env.LOCAL_APP_PORT, (err) => {
      console.log(
        `LocalDev: Hi ${env.AUTHOR}. Start server at host: ${env.LOCAL_APP_HOST} and port: ${env.LOCAL_APP_PORT}`
      );
    });
  }
});

/// Create Routes
app.use("/users", userRouter);
app.use("/cities", cityRouter);
app.use("/resorts", resortRouter);
app.use("/rooms", roomRouter);
app.use("/carts", cartRouter);
