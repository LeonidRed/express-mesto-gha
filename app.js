const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const userRoutes = require('./routes/users')
const cardRoutes = require('./routes/cards')

const { PORT = 3000, BASE_PATH } = process.env

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connect to MestoDB')
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send(
    `<html>
      <body>
        <p>Ответ на сигнал из далёкого космоса!!</p>
      </body>
    </html>`
  )
})

// мидлвэр для временного решения авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '649b0dc20fc9ee778e78b3d9'
  };

  next();
});

// app.get('/users', (req, res) => {
//   User.find({})
//     .then(user => res.send({ data: user }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// })

// app.get('/users/:userId', (req, res) => {
//   User.findById(req.params.id)
//     .then(user => res.send({ data: user }))
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// });

// app.post('/users', (req, res) => {
//   const { name, about, avatar } = req.body;
//   User.create({ name, about, avatar })
//     // вернём записанные в базу данные
//     .then(user => res.send({ data: user }))
//     // данные не записались, вернём ошибку
//     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
// });

app.use(userRoutes)
app.use(cardRoutes)

app.use(express.static(path.join(__dirname, 'public')))
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  // console.log(BASE_PATH)
})