const express = require('express')
const app = express()

const facesRoutes = require('./routes/faces.js')
app.use('/faces', facesRoutes)

app.get('/', (req, res) => {
  res.send("Hello GET from Node API Server")
})
app.post('/', (req, res) => {
  res.send("Hello POST from Node API Server")
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
