const getAllFaces = (req, res) => {
  res.json({
    message: 'GET all faces success'
  })
}

const createNewFace = (req, res) => {
  console.log(req.body)
  res.json({
    message: 'CREATE new face success'
  })
}

module.exports = {
  getAllFaces,
  createNewFace
}