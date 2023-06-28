const User = require('../models/user')
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors')

const getUsers = (req, res) => {
  User.find({})
    .then(user => res.status(OK).send({ data: user }))
    .catch(err => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }))
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body
  User.create({ name, about, avatar })
    .then(user => res.status(CREATED).send({ data: user }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const findUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' })
      }
      return res.status(OK).send({ data: user })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const updateUser = (req, res) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' })
      }
      return res.status(OK).send({ data: user })
    })
    .catch(err => {
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
    { new: true }
  )
    .then(user => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' })
      }
      return res.status(OK).send({ data: user })
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

module.exports = {
  getUsers, createUser, findUserById, updateUser, updateUserAvatar
}