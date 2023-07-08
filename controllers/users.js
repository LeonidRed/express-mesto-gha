const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const NotFoundError = require('../errors/not-found-err')
const BadRequestErr = require('../errors/bad-request-err')
const UnauthorizedErr = require('../errors/unauthorized-err')
const ConflictErr = require('../errors/conflict-err')

const {
  OK, CREATED,
} = require('../utils/errors')

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.status(OK).send({ data: user }))
    .catch(next)
}

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные при создании пользователя'))
      } else if (err.code === 11000) {
        next(new ConflictErr('Такой email адрес уже зарегистрирован'))
      }
      next(err)
    })
}

const findUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден')
      }
      return res.status(OK).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные пользователя'))
      }
      next(err)
    })
}

const updateUser = (req, res, next) => {
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
        throw new NotFoundError('Пользователь с указанным _id не найден')
      }
      return res.status(OK).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные пользователя'))
      }
      next(err)
    })
}

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден')
      }
      return res.status(OK).send({ data: user })
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('ППереданы некорректные данные при обновлении аватара'))
      }
      next(err)
    })
}

const login = (req, res, next) => {
  const { email, password } = req.body
  console.log(email, password)

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' })

      // вернём токен
      res.send({ token })
    })
    .catch(() => {
      next(new UnauthorizedErr('Неудачная попытка авторизации'))
    })
}

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(OK).send({ data: user }))
    .catch(next)
}

module.exports = {
  getUsers, createUser, findUserById, updateUser, updateUserAvatar, login, getCurrentUser,
}
