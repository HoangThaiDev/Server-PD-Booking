// Import Modules
const express = require("express");
const router = express.Router();

// Import Controllers
const resortController = require("../controller/resort");

router.get("", resortController.getResorts);

router.get("/detail/:resortId", resortController.getDetailResort);

router.post("/search", resortController.postSearchResort);

router.post("/detail/rooms", resortController.postFindRoomsBelongResort);

module.exports = router;
