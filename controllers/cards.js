const Card = require('../models/card')
const { OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('../utils/errors')

const getCards = (req, res) => {
  Card.find({})
    .then(card => res.status(OK).send({ data: card }))
    .catch(err => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }))
}

const createCard = (req, res) => {
  const { name, link } = req.body
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(CREATED).send({ data: card }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные в методы создания карточки' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' })
      }
      return res.status(OK).send({ data: card })
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const addCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .then(card => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' })
      }
      return res.status(OK).send({ data: card })
    })
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .then(card => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' })
      }
      return res.status(OK).send({ data: card })
    })
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' })
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

module.exports = {
  getCards, createCard, deleteCard, addCardLike, removeCardLike
}