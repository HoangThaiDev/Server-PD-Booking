const express = require("express");
const router = express.Router();
const cityController = require("../controller/city");

router.get("", cityController.getCities);

router.get("/detail/:cityId", cityController.getDetailCity);

router.post("/search", cityController.postSearchCity);

module.exports = router;
