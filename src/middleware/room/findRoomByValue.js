// Import Modules
const moment = require("moment");

// Import Models
const Room = require("../../model/room");
const City = require("../../model/city");
const Resort = require("../../model/resort");
const Transaction = require("../../model/transaction");

// Import Middlewares
const { updatedFieldRooms } = require("../../middleware/room/updatedRoom");

exports.findRoomsNoOptions = async () => {
  let newDataRooms = [];

  // Find rooms by name-city value
  try {
    const cities = await City.find();

    // Find Resorts belongto City
    const resorts = await Resort.find({ _id: { $in: cities.resorts } });

    // Get Id of room each resort
    const roomIds = [];
    resorts.forEach((resort) =>
      resort.rooms.forEach((room) => roomIds.push(room))
    );

    // Find Rooms by roomIds filtered
    const rooms = await Room.find({ _id: { $in: roomIds } }).lean();

    // Updated Key For Rooms
    rooms.forEach((room) => {
      room.nameCity = cities.name;
      resorts.forEach((resort) => {
        if (resort.rooms.includes(room._id.toString())) {
          room.nameResort = resort.name;
          return false;
        }
      });
      return room;
    });

    newDataRooms = rooms;
  } catch (error) {
    console.log(error);
  }

  return newDataRooms;
};

exports.findRoomByNameCity = async (nameCity) => {
  let newDataRooms = [];

  // Find rooms by name-city value
  try {
    const cities = await City.find();
    const findedCity = cities.find((city) => city.name === nameCity);
    if (!findedCity) {
      return false;
    }
    // Find Resorts belongto City
    const resorts = await Resort.find({ _id: { $in: findedCity.resorts } });

    // Get Id of room each resort
    const roomIds = [];
    resorts.forEach((resort) =>
      resort.rooms.forEach((room) => roomIds.push(room))
    );

    // Find Rooms by roomIds filtered
    const rooms = await Room.find({ _id: { $in: roomIds } }).lean();

    // Updated Field For Rooms
    rooms.forEach((room) => {
      room.nameCity = findedCity.name;
      resorts.forEach((resort) => {
        if (resort.rooms.includes(room._id.toString())) {
          room.nameResort = resort.name;
          return false;
        }
      });
      return room;
    });

    newDataRooms = rooms;
  } catch (error) {
    console.log(error);
  }

  return newDataRooms;
};

exports.findRoomByOptions = async (options, updatedDataRooms) => {
  let newDataRooms = [];
  const totalPeople = options.adults + options.children;

  try {
    // Check room filtered by value City
    if (updatedDataRooms.length === 0) {
      const rooms = await Room.find().lean();
      const filteredRooms = rooms.filter(
        (room) =>
          room.numberRooms.length >= options.rooms &&
          room.detail.maxPeople * options.rooms >= totalPeople
      );

      return await updatedFieldRooms(filteredRooms);
    }

    newDataRooms = updatedDataRooms.filter(
      (room) =>
        room.numberRooms.length >= options.rooms &&
        room.detail.maxPeople * options.rooms >= totalPeople
    );
  } catch (error) {
    console.log(error);
  }

  return newDataRooms;
};

exports.findRoomByDateBooking = async (
  conventStartDateInput,
  conventEndDateInput,
  updatedDataRooms
) => {
  let newDataRooms = [];

  // Lọc những transaction có các room đã booking trước
  const transactions = await Transaction.find();
  const rooms = await Room.find().lean();
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

  // -----------------------------------------------------------------------------------------
  // Kiểm tra nếu arr vừa lọc ko có giá trị thì return toàn bộ Resort
  if (filteredItemsByDBooking.length === 0) {
    // Kiểm tra rooms đã được lọc qua 2 điều kiện nameCity và options chưa
    if (updatedDataRooms.length === 0) {
      const modifiedRooms = await updatedFieldRooms(rooms);
      return modifiedRooms;
    } else {
      return updatedDataRooms;
    }
  }

  // -------------------------------------------------------------------
  // Kiểm tra nếu arr vừa lọc có giá trị thì bắt đầu xét điều kiện
  // Kiểm tra rooms được lọc qua 2 điều kiện nameCity và options chưa
  if (updatedDataRooms.length === 0) {
    newDataRooms = await updatedFieldRooms(rooms);
  } else {
    newDataRooms = updatedDataRooms;
  }
  // Tìm kiếm các loại phòng đã full trong arr transaction đã lọc
  const findRoomsFull = newDataRooms
    .map((room) => {
      const matchingRoomItem = filteredItemsByDBooking.find(
        (roomItem) =>
          room._id.toString() === roomItem.roomId &&
          room.numberRooms.length === roomItem.rooms.length
      );
      return matchingRoomItem;
    })
    .filter((item) => item !== undefined);

  // Cập nhật arr room tổng để loại bỏ những loại phòng full từ findRoomsFull
  const filteredRooms = newDataRooms.filter(
    (mRoom) =>
      !findRoomsFull.find((fRoom) => mRoom._id.toString() === fRoom.roomId)
  );
  return filteredRooms;
};
