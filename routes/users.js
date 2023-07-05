const router = require('express').Router()
const {
  getUsers, findUserById, updateUser, updateUserAvatar,
} = require('../controllers/users')

router.get('/users', getUsers)

router.get('/users/:userId', findUserById)

router.patch('/users/me', updateUser)

router.patch('/users/me/avatar', updateUserAvatar)

module.exports = router
