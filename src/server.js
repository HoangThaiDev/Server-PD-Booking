// import Modules
const express = require("express");
const cors = require("cors");
const app = express();
const mongooseConnect = require("./util/database");
const env = require("./config/enviroment");

const PORT = 5000;

// Import Router
const cityRouter = require("./router/city");
const resortRouter = require("./router/resort");
const roomRouter = require("./router/room");
const cartRouter = require("./router/cart");
const userRouter = require("./router/user");

// Create Middlewares
app.use(express.json());
app.use(cors());

// Create Server DBS + Connect Server
mongooseConnect(() => {
  app.listen(PORT, (err) => {
    console.log(
      `Hi ${env.AUTHOR} Start server with port ${env.LOCAL_APP_PORT}`
    );
  });
});

/// Create Routes
app.use("/users", userRouter);
app.use("/cities", cityRouter);
app.use("/resorts", resortRouter);
app.use("/rooms", roomRouter);
app.use("/carts", cartRouter);
