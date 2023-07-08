const router = require('express').Router()
const {
  getCards, deleteCard, createCard, addCardLike, removeCardLike,
} = require('../controllers/cards')
const { validateCardId, validateCard } = require('../middlewares/validationCard')

router.get('/cards', getCards)

router.delete('/cards/:cardId', validateCardId, deleteCard)

router.post('/cards', validateCard, createCard)

router.put('/cards/:cardId/likes', validateCardId, addCardLike)

router.delete('/cards/:cardId/likes', validateCardId, removeCardLike)

module.exports = router
