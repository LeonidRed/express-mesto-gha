const User = require('../models/user')

const getUsers = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    // вернём записанные в базу данные
    .then(user => res.send({ data: user }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const findUserById = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const updateUser = (req, res) => {
  const { name, about } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true }
  )
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true }
  )
    .then(user => res.send({ data: user }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  getUsers, createUser, findUserById, updateUser, updateUserAvatar
}