require('dotenv').config()
const db = require("../models");
const Users = db.users;
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.verifyUser = async (req, res) => {
  const pythonScriptPath = 'src/utils/deepface_verify.py';
  const { id } = req.params;

  const input = req.body;
  let python_result;

  const pythonProcess = spawn(process.env.PYTHON_PATH ? process.env.PYTHON_PATH : 'python', [pythonScriptPath]);

  const imagePath = path.join(process.env.DATABASE_PATH, id + '.jpeg');
  const imageBuffer = fs.readFileSync(imagePath);
  const image = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
  pythonProcess.stdin.write(JSON.stringify(image) + '\n');

  pythonProcess.stdin.write(JSON.stringify(input) + '\n');

  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', (data) => {
    let output = data.toString().trim();
    const result = JSON.parse(output);
    python_result = result;
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      if (python_result.verified) {
        res.json({
          message: 'User verified.',
          data: python_result
        })
      } else {
        res.json({
          message: 'User unverified.',
          data: python_result
        })
      }
    } else {
      console.error(`Python script exited with error code ${code}`);
      res.status(500).json({
        message: `Python script exited with error code ${code}`,
        data: null
      })
    }
  });
}

exports.findUser = async (req, res) => {
  const pythonScriptPath = 'src/utils/deepface_find.py';

  const input = req.body;

  const pythonProcess = spawn(process.env.PYTHON_PATH ? process.env.PYTHON_PATH : 'python', [pythonScriptPath]);

  pythonProcess.stdin.write(JSON.stringify(input) + '\n');

  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', async (data) => {
    let output = data.toString().trim();
    const result = JSON.parse(output);
    id = result;
    try {
      if (id == "Face not found.") {
        return res.status(404).json({
          message: "Face not found.",
          data: null,
        })
      }

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
        message: 'User found successfully.',
        data: responseData
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({
        message: error.message || "Some error occurred while finding user.",
        data: null
      });
    }
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with error code ${code}`);
      res.status(500).json({
        message: `Python script exited with error code ${code}`,
        data: null
      })
    }
  });
};

// CREATE: untuk menambahkan data ke dalam tabel users
exports.createNewUser = async (req, res) => {
  const pythonScriptPath = 'src/utils/deepface_create.py';

  const { body } = req
  const { image } = body

  const pythonProcess = spawn(process.env.PYTHON_PATH ? process.env.PYTHON_PATH : 'python', [pythonScriptPath]);

  pythonProcess.stdin.write(JSON.stringify(image) + '\n');

  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', async (data) => {
    let output = data.toString().trim();
    const result = JSON.parse(output);
    id = result;
    try {
      if (id == "Face not detected.") {
        return res.status(404).json({
          message: "Face not detected.",
          data: null,
        })
      }

      try {
        const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        const filePath = path.join(process.env.DATABASE_PATH, body.nrp + '.jpeg');
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
        })
      }

      const user = {
        nrp: body.nrp,
        name: body.name,
      }

      const data = await Users.create(user);
      res.json({
        message: `User with id=${data.nrp} created successfully.`,
        data: data
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({
        message: error.message || "Some error occurred while finding user.",
        data: null
      });
    }
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python script exited with error code ${code}`);
      res.status(500).json({
        message: `Python script exited with error code ${code}`,
        data: null
      })
    }
  });
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


