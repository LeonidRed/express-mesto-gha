const Card = require('../models/card')

const getCards = (req, res) => {
  Card.find({})
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
}

const createCard = (req, res) => {
  const { name, link } = req.body
  console.log(req.body)
  Card.create({ name, link, owner: req.user._id })
    // вернём записанные в базу данные
    .then(card => res.send({ data: card }))
    // данные не записались, вернём ошибку
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
  // .catch(err => console.log(err))
}

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
}

const addCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
}

const removeCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true })
    .then(card => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
}

module.exports = {
  getCards, createCard, deleteCard, addCardLike, removeCardLike
}