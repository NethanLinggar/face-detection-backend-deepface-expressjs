const UsersModel = require('../models/users')
const { spawn } = require('child_process');

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
    const [data] = await UsersModel.getUser(id)
    res.json({
      message: 'GET user success',
      data: data
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

const getUserEmbedding = async (req, res) => {
  const { id } = req.params
  try {
    const [data] = await UsersModel.getUserEmbedding(id);
    res.json({
      message: 'GET user embedding success',
      data: data
    })
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error
    })
  }
}

const verifyUser = async (req, res) => {
  const pythonScriptPath = 'src/utils/deepface_verify.py';
  const { id } = req.params

  const [embedding] = await UsersModel.getUserEmbedding(id);
  const input = req.body;
  let python_result;

  const pythonProcess = spawn('python', [pythonScriptPath]);

  // Sending embedding to Python process
  pythonProcess.stdin.write(JSON.stringify(embedding) + '\n');

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

const createNewUser = async (req, res) => {
  const pythonScriptPath = 'src/utils/deepface_insert.py';

  const input = req.body;
  let python_result;

  const pythonProcess = spawn('python', [pythonScriptPath]);

  pythonProcess.stdin.write(JSON.stringify(input))
  pythonProcess.stdin.end()

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
      // UsersModel.createNewUser(python_result)  
      res.json({
        message: 'CREATE new user success',
        // data: python_result
        data: UsersModel.createNewUser(python_result)
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
  getAllUsers,
  getUser,
  getUserEmbedding,
  verifyUser,
  createNewUser,
  updateUser,
  deleteUser
}