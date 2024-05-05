require('dotenv').config()
const PORT = process.env.PORT || 3000
const express = require('express')
const multer = require('multer')
const app = express()

const middlewareLogRequest = require('./middleware/logs')
const usersRoutes = require('./routes/users')
const pythonRoutes = require('./routes/python_test')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'))

app.use(middlewareLogRequest)
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 100000}));

app.use('/users', usersRoutes)
app.use('/python', pythonRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
