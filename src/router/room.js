const express = require("express");
const roomController = require("../controller/room");

const router = express.Router();

router.get("", roomController.getRooms);

router.get("/detail/:roomId", roomController.getDetailRoom);

router.post("/search", roomController.postSearchRoom);

router.post("/find-room", roomController.postFindRoom);

module.exports = router;
