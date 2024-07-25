require('dotenv').config()
const db = require("../models");
const Users = db.users;
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.verifyUser = async (req, res) => {
  const { id } = req.params;
  const input = req.body;

  try {
    const imagePath = path.join(process.env.DATABASE_PATH, `${id}.jpeg`);
    const imageBuffer = fs.readFileSync(imagePath);
    const image = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');

    const pythonScriptPath = path.join(__dirname, '../utils/deepface_verify.py');
    const pythonProcess = spawn(process.env.PYTHON_PATH || 'python', [pythonScriptPath]);

    let pythonResult = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(pythonResult.trim());
          if (result.verified) {
            res.json({
              message: 'User verified.',
              data: result
            });
          } else {
            res.json({
              message: 'User unverified.',
              data: result
            });
          }
        } catch (err) {
          console.error(`JSON parse error: ${err}`);
          res.status(500).json({
            message: 'Error parsing Python script output.',
            data: null
          });
        }
      } else {
        console.error(`Python script exited with error code ${code}`);
        res.status(500).json({
          message: `Python script exited with error code ${code}`,
          data: null
        });
      }
    });

    // Write input to the Python process
    pythonProcess.stdin.write(JSON.stringify(image) + '\n');
    pythonProcess.stdin.write(JSON.stringify(input) + '\n');
    pythonProcess.stdin.end();

  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      message: 'An error occurred during verification.',
      data: null
    });
  }
};

exports.findUser = async (req, res) => {
  const input = req.body;

  try {
    const pythonScriptPath = path.join(__dirname, '../utils/deepface_find.py');
    const pythonProcess = spawn(process.env.PYTHON_PATH || 'python', [pythonScriptPath]);
    
    let pythonResult = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error: ${data.toString()}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(pythonResult.trim());
          const id = result;
          console.log(result)

          if (id === "Face not found.") {
            return res.status(200).json({
              message: "Face not found.",
              data: result,
            });
          }

          const user = await Users.findByPk(id);
          if (!user) {
            return res.status(200).json({
              message: "User not found.",
              data: null,
            });
          }

          let imageBase64;
          const imagePath = path.join(process.env.DATABASE_PATH, `${id}.jpeg`);
          if (fs.existsSync(imagePath)) {
            imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
          }

          const responseData = {
            ...user.dataValues,
            image: imageBase64,
          };

          res.json({
            message: 'User found successfully.',
            data: responseData
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
          res.status(500).json({
            message: err.message || "Some error occurred while finding user.",
            data: null
          });
        }
      } else {
        console.error(`Python script exited with error code ${code}`);
        res.status(500).json({
          message: `Python script exited with error code ${code}`,
          data: null
        });
      }
    });

    pythonProcess.stdin.write(JSON.stringify(input) + '\n');
    pythonProcess.stdin.end();
    
  } catch (error) {
    console.error(`Error: ${error}`);
    res.status(500).json({
      message: 'An error occurred during verification.',
      data: null
    });
  }
};

// CREATE: untuk menambahkan data ke dalam tabel users
exports.createNewUser = async (req, res) => {
  const { body } = req;
  const { image, nrp, name } = body;

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const filePath = path.join(process.env.DATABASE_PATH, nrp + '.jpeg');
    fs.writeFileSync(filePath, imageBuffer);

    // Delete .pkl files
    const files = fs.readdirSync(process.env.DATABASE_PATH);
    const pklFiles = files.filter(file => path.extname(file) === '.pkl');
    if (pklFiles) {
      pklFiles.forEach(file => {
        fs.unlinkSync(path.join(process.env.DATABASE_PATH, file));
      });
    }
  } catch (imageError) {
    return res.status(500).json({
      message: "Image not saved.",
      data: null,
    });
  }

  try {
    const user = {
      nrp: nrp,
      name: name,
    };

    const data = await Users.create(user);
    res.json({
      message: `User with id=${data.nrp} created successfully.`,
      data: data,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: error.message || "Some error occurred while creating the user.",
      data: null,
    });
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
    const imagePath = path.join(process.env.DATABASE_PATH, id + '.jpeg');
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
  const { id } = req.params
  const { image } = req.body
  try {
    if (image) {
      try {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(process.env.DATABASE_PATH, id + '.jpeg');
        fs.writeFileSync(filePath, imageBuffer);
      } catch (imageError) {
        return res.status(500).json({
          message: "Image not saved.",
          data: null,
        })
      }
    }

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
    const filePath = path.join(process.env.DATABASE_PATH, id + '.jpeg');
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


