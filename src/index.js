const express = require('express')
const app = express()

const middlewareLogRequest = require('./middleware/logs')
const usersRoutes = require('./routes/users')
const facesRoutes = require('./routes/faces')
const pythonRoutes = require('./routes/python_test')

app.use(middlewareLogRequest)
app.use(express.json())

app.use('/users', usersRoutes)
app.use('/faces', facesRoutes)
app.use('/python', pythonRoutes)

app.get('/', (req, res) => {
  res.send("Hello GET from Node API Server")
})
app.post('/', (req, res) => {
  res.send("Hello POST from Node API Server")
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
