const db = require("../models");
const Users = db.users;
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// CREATE: untuk menambahkan data ke dalam tabel users
exports.createNewUser = async (req, res) => {
  const { body } = req
  const { image } = body
  try {
    if (image) {
      try {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const detectedType = image.split(';')[0].split('/')[1];
        const filename = body.nrp + '.' + detectedType;
        const filePath = path.join('database', filename);
        fs.writeFileSync(filePath, imageBuffer);
      } catch (imageError) {
        return res.status(500).json({
          message: "Image not saved.",
          data: null,
        })
      }
    } else {
      return res.status(400).json({
        message: "Image not received.",
        data: null,
      })
    }

    const user = {
      nrp: body.nrp,
      name: body.name,
    }

    const data = await Users.create(user);
    res.json({
      message: `User with id=${data.nrp} created successfully.`,
      data: data,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while creating the Users.",
      data: null,
    })
  }
};

// READ: menampilkan atau mengambil semua data sesuai model dari database
exports.getAllUsers = (req, res) => {
  try {
    Users.findAll()
      .then((users) => {
        res.json({
          message: "Users retrieved successfully.",
          data: users,
        })
      })
  } catch (error) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving books.",
      data: null,
    })
  }
};

// READ: Mengambil data sesuai id yang dikirimkan
exports.getUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await Users.findByPk(id)
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        data: null,
      })
    }

    let imageBase64;
    const imagePath = path.join('database', `${id}.jpeg`);
    if (fs.existsSync(imagePath)) {
      imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
    };

    const responseData = {
      ...user.dataValues,
      image: imageBase64,
    }

    res.json({
      message: "User retrieved successfully.",
      data: responseData,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message || "Some error occurred while retrieving user.",
      data: null,
    })
  }
};

// UPDATE: Merubah data sesuai dengan id yang dikirimkan sebagai params 
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const num = await Users.update(req.body, {
      where: { nrp: id },
    })

    if (num == 1) {
      res.json({
        message: `User with nrp=${id} updated successfully.`,
        data: req.body,
      })
    } else {
      res.json({
        message: `User with nrp=${id} was not found or req.body is empty!`,
        data: req.body,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || "An error occurred while deleting the user.",
      data: null,
    })
  }
};

// DELETE: Menghapus data sesuai id yang dikirimkan
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the user file
    const filename = `${id}.jpeg`;
    const filePath = path.join('database', filename);
    fs.unlinkSync(filePath);

    // Delete the user from the database
    const num = await Users.destroy({
      where: { nrp: id },
    })

    if (num == 1) {
      res.json({
        message: `User with nrp=${id} deleted successfully.`,
        data: req.body,
      })
    } else {
      res.json({
        message: `User with nrp=${id} was not found!`,
        data: req.body,
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message || 'An error occurred while deleting the user.',
      data: null,
    })
  }
};


