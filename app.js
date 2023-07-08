const helmet = require('helmet')
const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { errors } = require('celebrate')
const userRoutes = require('./routes/users')
const cardRoutes = require('./routes/cards')
const {
  createUser, login,
} = require('./controllers/users')
const auth = require('./middlewares/auth')
const { validateUser, validateUserLogin } = require('./middlewares/validationUser')

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
// app.use((req, res, next) => {
//   req.user = {
//     _id: '64a59ed68f663149610f9826',
//   }

//   next()
// })

app.post('/signin', validateUserLogin, login)
app.post('/signup', validateUser, createUser)
app.use(auth, userRoutes)
app.use(auth, cardRoutes)
// app.use(userRoutes)
// app.use(cardRoutes)
app.use('*', (req, res) => res.status(404).send({ message: 'Такого пути не существует' }))

app.use(express.static(path.join(__dirname, 'public')))

app.use(errors())

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    })
  next()
})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
