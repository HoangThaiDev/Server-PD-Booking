// Import Modal
const Room = require("../model/room");
const Transaction = require("../model/transaction");

// Import Modules
const { default: mongoose } = require("mongoose");
const moment = require("moment");

// Import Middlewares
const {
  findRoomByNameCity,
  findRoomByOptions,
  findRoomsNoOptions,
  findRoomByDateBooking,
} = require("../middleware/room/findRoomByValue");
const { updatedFieldRooms } = require("../middleware/room/updatedRoom");
const {
  checkDateBookingInput,
} = require("../middleware/cart/checkDateBookingInput");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    if (rooms.length === 0) {
      res.status(404).json({ error: "No Found Room Data" });
    }

    let modifiedRooms = await updatedFieldRooms(rooms);

    res.status(200).json(modifiedRooms);
  } catch (error) {
    console.log(error);
  }
};

exports.getDetailRoom = async (req, res) => {
  const { nameCity, nameResort, roomId } = req.query;

  try {
    const room = await Room.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(roomId),
        },
      },
      {
        $addFields: {
          nameCity: nameCity,
          nameResort: nameResort,
        },
      },
    ]);

    if (!room) {
      res.status(404).json({ error: "Internal Server Error" });
      return false;
    }
    res.status(200).json(room[0]);
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
    if (modifiedRooms.length === 0) {
      res.status(400).json({ message: "No found room with your name choice!" });
      return false;
    }
    res.status(200).json(modifiedRooms);
  } catch (error) {
    res.status(400).json({ message: "Internal Server Error" });
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
      return false;
    } catch (err) {
      console.log(err);
    }
  }

  // Check condition when client input name city
  if (nameCity.length > 0) {
    const filteredRoomByNameCity = await findRoomByNameCity(nameCity);

    if (!filteredRoomByNameCity) {
      res
        .status(404)
        .json({ message: "No Found Rooms With Your City Choice!" });
      return false;
    }
    updatedDataRooms = filteredRoomByNameCity;
  }

  // Check condition when client input value options
  if (options.rooms > 0 || options.adults > 0 || options.children > 0) {
    const filteredRoomByOptions = await findRoomByOptions(
      options,
      updatedDataRooms
    );

    if (filteredRoomByOptions.length === 0) {
      res
        .status(404)
        .json({ message: "No Found Rooms With Your Options Choice!" });
      return false;
    }
    updatedDataRooms = filteredRoomByOptions;
  }

  // Check condition when client input value dateBooking
  if (dateBooking.startDate.length > 0 && dateBooking.endDate.length > 0) {
    // Check && convert value startDate, endDate valid
    const {
      conventStartDateInput,
      conventEndDateInput,
      isCheckDateInputValid,
    } = checkDateBookingInput(dateBooking.startDate, dateBooking.endDate);

    if (!isCheckDateInputValid) {
      res
        .status(400)
        .json({ session: false, message: "Choose date booking failled!" });
      return false;
    }

    const filteredRoomByDateBooking = await findRoomByDateBooking(
      conventStartDateInput,
      conventEndDateInput,
      updatedDataRooms
    );
    if (filteredRoomByDateBooking.length === 0) {
      res
        .status(404)
        .json({ message: "No Found Rooms With Your Date Booking!" });
      return false;
    }
    updatedDataRooms = filteredRoomByDateBooking;
  }
  // Response To Client

  if (updatedDataRooms.length > 0) {
    res.status(200).json(updatedDataRooms);
    return false;
  } else {
    res.status(400).json([]);
  }
};

exports.postCheckRoom = async (req, res) => {
  const { convertStartDate, convertEndDate, room } = req.body;

  const conventStartDateInput = moment(convertStartDate, "DD/MM/YYYY").startOf(
    "day"
  );
  const conventEndDateInput = moment(convertEndDate, "DD/MM/YYYY").startOf(
    "day"
  );

  // Lọc những transaction có các room đã booking trước
  const transactions = await Transaction.find();
  const consolidatedItems = transactions.flatMap((tr) => tr.cart.items);

  const filteredItemsByDBooking = consolidatedItems.filter((item) => {
    const convertStartDateOfItem = moment(
      item.date.startDate,
      "DD/MM/YYYY"
    ).startOf("day");
    const convertEndDateOfItem = moment(
      item.date.endDate,
      "DD/MM/YYYY"
    ).startOf("day");

    // -----------------------------------------------------------------------------------------
    // Kiểm tra xem client nhập date booking có trùng với các item đã booking trước ko
    const isCheckItemInvalid =
      conventStartDateInput.isBefore(convertEndDateOfItem, "day") &&
      conventEndDateInput.isAfter(convertStartDateOfItem, "day");

    // Nếu có thì lọc ra để cập nhật
    if (isCheckItemInvalid) {
      return item;
    }
  });

  // Tìm các room trong transaction theo roomId đang booking
  const findRoomById = filteredItemsByDBooking.filter(
    (item) => item.roomId === room._id
  );

  // Lọc các phòng đã được booking trước trong transaction và cập nhật giá trị Room hiện tại

  findRoomById.forEach((item) => {
    item.rooms.forEach((r) => {
      const findIndex = room.numberRooms.findIndex((item) => item === r);
      room.numberRooms.splice(findIndex, 1);
    });
  });
  console.log(convertStartDate, convertEndDate);
  res.status(200).json(room);
};
