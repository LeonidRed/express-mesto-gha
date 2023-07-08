const Card = require('../models/card')
const {
  OK, CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/errors')
const NotFoundError = require('../errors/not-found-err')
const BadRequestErr = require('../errors/bad-request-err')

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(OK).send({ data: card }))
    .catch(next)
  // .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' }))
}

const createCard = (req, res, next) => {
  const { name, link } = req.body
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные в методы создания карточки'))
        // return res.status(BAD_REQUEST)
        // .send({ message: 'Переданы некорректные данные в методы создания карточки' })
      }
      next(err)
      // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const deleteCard = (req, res, next) => {
  console.log(req.params.cardId)
  Card.findById(req.params.cardId)
    .then((card) => {
      // console.log(card.owner.toString())
      // console.log(req.user._id)
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена')
        // res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' })
      } else if (card.owner.toString() !== req.user._id) {
        throw new BadRequestErr('У вас нет прав на удаление этой карточки')
        // res.status(BAD_REQUEST).send({ message: 'У вас нет прав на удаление этой карточки' })
      } else {
        Card.findByIdAndRemove(req.params.cardId).then(() => res.status(OK).send({ message: 'Карточка удалена' }))
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'))
        // return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' })
      }
      next(err)
      // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

// const deleteCard = (req, res) => {
//   Card.findByIdAndRemove(req.params.cardId)
//     .then((card) => {
//       if (!card) {
//         return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' })
//       }
//       return res.status(OK).send({ data: card })
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' })
//       }
//       return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
//     })
// }

const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки')
        // return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' })
      }
      return res.status(OK).send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные для постановки/снятии лайка'))
        // return res.status(BAD_REQUEST)
        // .send({ message: 'Переданы некорректные данные для постановки/снятии лайка' })
      }
      next(err)
      // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

const removeCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки')
        // return res.status(NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' })
      }
      return res.status(OK).send({ data: card })
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные для постановки/снятии лайка'))
        // return res.status(BAD_REQUEST)
        // .send({ message: 'Переданы некорректные данные для постановки/снятии лайка' })
      }
      next(err)
      // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла ошибка' })
    })
}

module.exports = {
  getCards, createCard, deleteCard, addCardLike, removeCardLike,
}
