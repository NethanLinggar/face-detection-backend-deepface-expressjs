require('dotenv').config()
const db = require("../models");
const Users = db.users;
const Logs = db.logs;

// CREATE: untuk menambahkan data ke dalam tabel logs
exports.createNewLog = async (req, res) => {
  try {
    const userNrp = req.body.userNrp;
    const user = await Users.findOne({ where: { nrp: userNrp } });
    if (!user) {
      return res.status(400).json({
        message: `User with nrp ${userNrp} does not exist.`,
        data: null,
      });
    }
    const log = {
      userNrp: userNrp,
    };
    const data = await Logs.create(log);
    res.json({
      message: "Log created successfully.",
      data: data,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || "Some error occurred while creating the log.",
      data: null,
    })
  }
};

// READ: Mengambil data sesuai id yang dikirimkan
exports.getLogs = async (req, res) => {
  const { userNrp } = req.params
  try {
    const logs = await Logs.findAll({ where: { userNrp } })
    if (!logs) {
      return res.status(404).json({
        message: "Logs not found.",
        data: null,
      })
    }
    res.json({
      message: "Logs retrieved successfully.",
      data: logs,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || "Some error occurred while retrieving logs.",
      data: null,
    })
  }
};