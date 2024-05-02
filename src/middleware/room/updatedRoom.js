const City = require("../../model/city");
const Resort = require("../../model/resort");

exports.updatedRooms = async (rooms, nameCity) => {
  try {
    const resorts = await Resort.find();
    const cities = await City.find();

    return rooms.map((room) => {
      // Find the resort of room by roomId based on rooms of collection resort
      resorts.forEach((resort) => {
        if (resort.rooms.includes(room._id.toString())) {
          room.nameResort = resort.name;

          // Find the city of resort by resortId based on resorts of collection city
          cities.forEach((city) => {
            if (city.resorts.includes(resort._id.toString())) {
              room.nameCity = city.name;
              return false;
            }
          });
          return false;
        }
      });
      return room;
    });
  } catch (error) {
    console.log(error);
  }
};
