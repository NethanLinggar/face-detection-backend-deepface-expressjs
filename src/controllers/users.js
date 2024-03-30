const getAllUsers = (req, res) => {
  const data = {
    name: "Farrel Memek",
    email: "farrelmemek@gmail.com",
    address: "jl. memek"
  }
  res.json({
    message: 'GET all users success',
    data: data
  })
}

const createNewUser = (req, res) => {
  console.log(req.body)
  res.json({
    message: 'CREATE new users success'
  })
}

module.exports = {
  getAllUsers,
  createNewUser
}