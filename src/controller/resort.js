// Import Models
const Resort = require("../model/resort");
const City = require("../model/city");
const Room = require("../model/room");

exports.getResorts = async (req, res, next) => {
  try {
    const resorts = await Resort.find();
    if (resorts.length === 0) {
      res.status(404).json({ error: "Not Found Resorts" });
    }
    res.status(200).json(resorts);
  } catch (error) {
    console.log(error);
  }
};

exports.getDetailResort = async (req, res) => {
  const resortId = req.params.resortId;

  try {
    const resort = await Resort.findById(resortId);
    if (!resort) {
      res.status(404).json({ error: "Internal Server Error" });
      return false;
    }

    // Find the city to which the resort belongs
    const findCityByResort = await City.findOne({
      resorts: {
        $in: resort._id.toString(),
      },
    });

    // Find other resorts with the same City
    const findResortsHasSameCity = await Resort.find({
      _id: { $in: findCityByResort.resorts, $nin: resort._id.toString() },
    });

    const newDataResort = {
      current_resort: resort,
      other_resorts: findResortsHasSameCity,
    };

    res.status(200).json(newDataResort);
  } catch (error) {
    console.log(error);
  }
};

exports.postSearchResort = async (req, res) => {
  const nameValueInput = req.body.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

  try {
    const resorts = await Resort.find();
    const filteredResortByName = resorts.filter((resort) =>
      resort.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .includes(nameValueInput)
    );
    res.status(200).json(filteredResortByName);
  } catch (error) {
    console.log(error);
  }
};

exports.postFindRoomsBelongResort = async (req, res) => {
  const roomIds = req.body.roomIds;

  try {
    const rooms = await Room.find({ _id: { $in: roomIds } });
    if (rooms.length === 0) {
      res.status(404).json({ error: "Internal Server Error" });
    }
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
  }
};
