require('dotenv').config()
const PORT = process.env.PORT || 3000
const express = require('express')
const app = express()

const middlewareLogRequest = require('./middleware/logs')
const usersRoutes = require('./routes/users')
const pythonRoutes = require('./routes/python_test')

app.use(middlewareLogRequest)
app.use(express.json())

app.use('/users', usersRoutes)
app.use('/python', pythonRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
