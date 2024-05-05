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

const getUserImage = async (req, res) => {
  const { id } = req.params
  try {
    const [data] = await UsersModel.getUserImage(id);
    res.json({
      message: 'GET user Base64 success',
      data: data
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
  try {
    await UsersModel.createNewUser(body)
    res.json({
      message: 'CREATE new user success',
      data: body
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
  getUserImage,
  createNewUser,
  updateUser,
  deleteUser
}