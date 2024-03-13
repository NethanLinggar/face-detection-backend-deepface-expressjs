const getAllFaces = (req, res) => {
  res.json({
    message: 'GET all faces success'
  })
}

const createNewFace = (req, res) => {
  res.json({
    message: 'CREATE new face success'
  })
}

module.exports = {
  getAllFaces,
  createNewFace
}