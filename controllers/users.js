const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const {
  OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/errors')

const getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(OK).send({ data: user }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }))
}

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const findUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' })
      }
      return res.status(OK).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const updateUser = (req, res) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' })
      }
      return res.status(OK).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' })
      }
      return res.status(OK).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

// const login = (req, res) => {
//   const { email, password } = req.body

//   User.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Неправильные почта или пароль'))
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             // хеши не совпали — отклоняем промис
//             return Promise.reject(new Error('Неправильные почта или пароль'))
//           }
//           const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })
//           // аутентификация успешна
//           return res.send({ token })
//         })
//         .catch((err) => {
//           res.status(NOT_FOUND).send({ message: err.message })
//         })
//     })
// }

const login = (req, res) => {
  const { email, password } = req.body

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' })

      // вернём токен
      res.send({ token })
    })
    .catch((err) => {
      res.status(401).send({ message: err.message })
    })
}

module.exports = {
  getUsers, createUser, findUserById, updateUser, updateUserAvatar, login,
}
