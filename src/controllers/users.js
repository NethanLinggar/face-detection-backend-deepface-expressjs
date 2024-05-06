const UsersModel = require('../models/users')
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

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
    let [userData] = await UsersModel.getUser(id)
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
    // const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(image, 'base64');
    // const detectedType = image.split(';')[0].split('/')[1];
    const filename = body.nrp + '.jpg';
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
  getAllUsers,
  getUser,
  createNewUser,
  updateUser,
  deleteUser
}