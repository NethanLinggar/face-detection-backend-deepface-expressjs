const express = require('express')
const app = express()

const middlewareLogRequest = require('./middleware/logs')
const usersRoutes = require('./routes/users')
const pythonRoutes = require('./routes/python_test')

app.use(middlewareLogRequest)
app.use(express.json())

app.use('/users', usersRoutes)
app.use('/python', pythonRoutes)

// app.use('/', (req, res) => {
//   dbPool.execute('SELECT * FROM users', (err, rows) => {
//     if (err) {
//       res.json({
//         message: 'connection failed'
//       })
//     }

//     res.json({
//       message: 'connection success',
//       data: rows
//     })
//   })
// })
// app.get('/', (req, res) => {
//   res.send("Hello GET from Node API Server")
// })
// app.post('/', (req, res) => {
//   res.send("Hello POST from Node API Server")
// })

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
