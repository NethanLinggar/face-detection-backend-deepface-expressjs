const UsersModel = require('../models/users')
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const verifyUser = async (req, res) => {
  const pythonScriptPath = 'src/utils/deepface_verify.py';
  const { id } = req.params;

  const input = req.body;
  let python_result;

  const pythonProcess = spawn('python', [pythonScriptPath]);

  // Sending image to Python process
  const imagePath = path.join('database', id + '.jpg');
  const imageBuffer = fs.readFileSync(imagePath);
  const image = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');
  pythonProcess.stdin.write(JSON.stringify(image) + '\n');

  // Sending input to Python process
  pythonProcess.stdin.write(JSON.stringify(input) + '\n');

  // End the input stream to signal Python that no more data will be sent
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
      res.json({
        message: 'VERIFY user success',
        data: python_result
      })
    } else {
      console.error(`Python script exited with error code ${code}`);
      res.status(500).json({
        message: 'Server Error',
        serverMessage: `Python script exited with error code ${code}`
      })
    }
  });
}

const findUser = async (req, res) => {
  const pythonScriptPath = 'src/utils/deepface_find.py';

  const input = req.body;

  const pythonProcess = spawn('python', [pythonScriptPath]);

  pythonProcess.stdin.write(JSON.stringify(input) + '\n');

  pythonProcess.stdin.end();

  pythonProcess.stdout.on('data', async (data) => {
    let output = data.toString().trim();
    const result = JSON.parse(output);
    id = result;
    try {
      const [userData] = await UsersModel.getUser(id);
      let imageBase64;
      const imageExtensions = ['jpg', 'jpeg', 'png'];
      for (const ext of imageExtensions) {
        const imagePath = path.join('database', `${id}.${ext}`);
        if (fs.existsSync(imagePath)) {
          imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
          break;
        }
      }
      const responseData = {
        ...userData[0],
        image: imageBase64
      };
      res.json({
        message: 'FIND user success',
        data: responseData
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({
        message: 'Server Error',
        serverMessage: error.message
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
        message: 'Server Error',
        serverMessage: `Python script exited with error code ${code}`
      });
    }
  });
};

const getAllUsers = async (req, res) => {
  try {
    const [data] = await UsersModel.getAllUsers()
    res.json({
      message: 'GET all users success',
      data: data
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

const getUser = async (req, res) => {
  const { id } = req.params
  try {
    const [userData] = await UsersModel.getUser(id)
    let imageBase64;
    const imageExtensions = ['jpg', 'jpeg', 'png'];
    for (const ext of imageExtensions) {
      const imagePath = path.join('database', `${id}.${ext}`);
      if (fs.existsSync(imagePath)) {
        imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
        break;
      }
    }
    const responseData = {
      ...userData[0],
      image: imageBase64
    }
    res.json({
      message: 'GET user success',
      data: responseData
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

const createNewUser = async (req, res) => {
  const { body } = req
  const { image } = body;
  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    const detectedType = image.split(';')[0].split('/')[1];
    const filename = body.nrp + '.' + detectedType;
    const filePath = path.join('database', filename);
    fs.writeFileSync(filePath, imageBuffer);
    await UsersModel.createNewUser(body)
    res.json({
      message: 'CREATE new user success',
      data: image
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

const updateUser = async (req, res) => {
  const { id } = req.params
  const { body } = req
  try {
    await UsersModel.updateUser(body, id)
    res.json({
      message: 'UPDATE user success',
      data: {
        nrp: id,
        ...body
      }
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    await UsersModel.deleteUser(id)
    res.json({
      message: 'DELETE user success',
      data: null
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

module.exports = {
  verifyUser,
  findUser,
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser
}