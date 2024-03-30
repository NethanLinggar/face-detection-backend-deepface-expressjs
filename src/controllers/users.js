const createNewUser = (req, res) => {
  console.log(req.body)
  res.json({
    message: 'CREATE new user success'
  })
}

const getAllUsers = (req, res) => {
  const data = {
    name: "Farrel Anjay",
    email: "farrelanjay@gmail.com",
    address: "jl. anjay"
  }
  res.json({
    message: 'GET all users success',
    data: data
  })
}

const updateUser = (req, res) => {
  const { id } = req.params
  console.log('id: ', id)
  res.json({
    message: 'UPDATE user success',
    data: req.body
  })
}

const deleteUser = (req, res) => {
  const { id } = req.params
  console.log('id: ', id)
  res.json({
    message: 'DELETE user success',
    data: {
      id: id,
      name: 'Farrel Anjay',
      email: 'farrelanjay@gmail.com',
      address: "jl. anjay"
    }
  })
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}