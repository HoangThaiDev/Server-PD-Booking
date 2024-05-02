const mongoose = require("mongoose");

const URI_SERVER =
  "mongodb+srv://thaindev2000:Cy1PJh5EDVq9W68t@cluster0.bqyvw4f.mongodb.net/my_system?retryWrites=true&w=majority&appName=Cluster0";

const mongooseConnect = (callback) => {
  mongoose
    .connect(URI_SERVER)
    .then((result) => {
      console.log("Connected to MongoDB successfully");
      callback();
    })
    .catch((err) => console.log(err));
};

module.exports = mongooseConnect;
