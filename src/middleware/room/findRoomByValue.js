const Room = require("../../model/room");
const City = require("../../model/city");
const Resort = require("../../model/resort");
const { updatedRooms } = require("../../middleware/room/updatedRoom");

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

    // Updated Key For Rooms
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

exports.findRoomByOptions = async (options, updatedDataRooms = []) => {
  let newDataRooms = [];
  const totalPeople = options.adults + options.children;

  try {
    // Check room filtered by value City
    if (updatedDataRooms.length === 0) {
      const filteredRooms = await Room.aggregate([
        {
          $match: {
            "detail.maxPeople": { $gte: totalPeople },
          },
        },
        {
          $addFields: {
            totalRooms: { $size: "$numberRooms" },
          },
        },
        {
          $match: {
            totalRooms: { $gte: options.rooms },
          },
        },
      ]);
      return await updatedRooms(filteredRooms);
    }

    newDataRooms = updatedDataRooms.filter(
      (room) =>
        room.numberRooms.length >= options.rooms &&
        room.detail.maxPeople >= totalPeople
    );
  } catch (error) {
    console.log(error);
  }

  return newDataRooms;
};

exports.findRoomByDateString = (req, res) => {};
