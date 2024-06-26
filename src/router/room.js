// Import Modules
const express = require("express");
const roomController = require("../controller/room");

// Import Controllers
const router = express.Router();

router.get("", roomController.getRooms);

router.get("/detail", roomController.getDetailRoom);

router.post("/search", roomController.postSearchRoom);

router.post("/find-room", roomController.postFindRoom);

router.post("/check", roomController.postCheckRoom);

module.exports = router;
