const router = require('express').Router()
const {
  getCards, deleteCard, createCard, addCardLike, removeCardLike,
} = require('../controllers/cards')

router.get('/cards', getCards)

router.delete('/cards/:cardId', deleteCard)

router.post('/cards', createCard)

router.put('/cards/:cardId/likes', addCardLike)

router.delete('/cards/:cardId/likes', removeCardLike)

module.exports = router
