const UsersModel = require('../models/users')
const { spawn } = require('child_process');

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
        UsersModel.createNewUser(python_result)  
        res.json({
              message: 'Python script ran successfully.',
              data: python_result
          })
      } else {
          console.error(`Python script exited with error code ${code}`);
          res.send('Error');
      }
  });
}

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
  createNewUser,
  updateUser,
  deleteUser
}