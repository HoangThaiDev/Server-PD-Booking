// Import Models
const City = require("../model/city");

exports.getCities = async (req, res) => {
  try {
    const cities = await City.find();
    if (cities.length === 0) {
      res.status(404).json({ error: "Internal Server Error" });
    }
    res.status(200).json(cities);
  } catch (error) {
    console.log(error);
  }
};

exports.getDetailCity = async (req, res) => {
  const cityId = req.params.cityId;

  try {
    const city = await City.findById(cityId);
    if (!city) {
      res.status(404).json({ error: "Internal Server Error" });
      return false;
    }
    res.status(200).json(city);
  } catch (error) {
    console.log(error);
  }
};

exports.postSearchCity = async (req, res) => {
  const nameValueInput = req.body.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

  try {
    const cities = await City.find();
    const filteredCityByName = cities.filter((city) => {
      return city.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .includes(nameValueInput);
    });

    res.status(200).json(filteredCityByName);
  } catch (error) {
    console.log(error);
  }
};
