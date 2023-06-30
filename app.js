const helmet = require('helmet')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/users')
const cardRoutes = require('./routes/cards')

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connect to MestoDB')
})

const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// мидлвэр для временного решения авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '649b0dc20fc9ee778e78b3d9',
  }

  next()
})

app.use(userRoutes)
app.use(cardRoutes)
app.use('*', (req, res) => res.status(404).send({ message: 'Такого пути не существует' }))

app.use(express.static(path.join(__dirname, 'public')))
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
