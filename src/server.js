// import Modules
const express = require("express");
const cors = require("cors");
const app = express();
const mongooseConnect = require("./utils/database");
const env = require("./config/enviroment");
const { corsOptions } = require("./config/cors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

// Import Router
const cityRouter = require("./router/city");
const resortRouter = require("./router/resort");
const roomRouter = require("./router/room");
const cartRouter = require("./router/cart");
const userRouter = require("./router/user");
const checkoutRouter = require("./router/checkout");
const transactionRouter = require("./router/transaction");

// Create store save session
const store = new MongoDBStore({
  uri: env.MONGODB_URI_SERVER,
  collection: "sessions",
});
console.log(env.BUILD_MODE);
// Create Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(
  session({
    secret: "my secret key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
      sameSite: env.BUILD_MODE === "production" ? "strict" : "lax",
      secure: env.BUILD_MODE === "production",
    },
    store: store,
  })
);

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
app.use("/checkouts", checkoutRouter);
app.use("/transactions", transactionRouter);
