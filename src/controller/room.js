const Room = require("../model/room");
const {
  findRoomByNameCity,
  findRoomByOptions,
  findRoomsNoOptions,
} = require("../middleware/room/findRoomByValue");

const { updatedRooms } = require("../middleware/room/updatedRoom");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    if (rooms.length === 0) {
      res.status(404).json({ error: "No Found Room Data" });
    }

    let modifiedRooms = await updatedRooms(rooms);

    res.status(200).json(modifiedRooms);
  } catch (error) {
    console.log(error);
  }
};

exports.getDetailRoom = async (req, res) => {
  const roomId = req.params.roomId;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({ error: "Internal Server Error" });
      return false;
    }
    res.status(200).json(room);
  } catch (error) {
    console.log(error);
  }
};

exports.postSearchRoom = async (req, res) => {
  const nameValueInput = req.body.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

  // Tìm kiếm Room theo value của name-input
  try {
    const rooms = await Room.find().lean();
    const filteredRoomByName = rooms.filter((room) =>
      room.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .includes(nameValueInput)
    );

    let modifiedRooms = await updatedRooms(filteredRoomByName);

    res.status(200).json(modifiedRooms);
  } catch (error) {
    console.log(error);
  }
};

exports.postFindRoom = async (req, res) => {
  let updatedDataRooms = [];
  const { nameCity, options, dateBooking } = req.body;

  // Check all value is empty or not
  const checkValueInputEmpty =
    nameCity.length === 0 &&
    dateBooking.startDate.length === 0 &&
    dateBooking.endDate.length === 0 &&
    options.rooms === 0 &&
    options.adults === 0 &&
    options.children === 0;

  if (checkValueInputEmpty) {
    // If value empty then return All Rooms
    try {
      const modifiedRooms = await findRoomsNoOptions();
      res.status(200).json(modifiedRooms);
    } catch (err) {
      console.log(err);
    }
  }

  if (nameCity.length > 0) {
    const filteredRoomByNameCity = await findRoomByNameCity(nameCity);

    if (!filteredRoomByNameCity) {
      res.status(404).json({ message: "No Found City With Your City Choice!" });
      return false;
    }
    updatedDataRooms = filteredRoomByNameCity;
  }

  if (options.rooms > 0 || options.adults > 0 || options.children > 0) {
    const filteredRoomByOptions = await findRoomByOptions(
      options,
      updatedDataRooms
    );

    if (filteredRoomByOptions.length === 0) {
      res
        .status(404)
        .json({ message: "No Found City With Your Options Choice!" });
      return false;
    }
    updatedDataRooms = filteredRoomByOptions;
  }

  // Response To Client
  if (updatedDataRooms.length > 0) {
    res.status(200).json(updatedDataRooms);
  }
};
