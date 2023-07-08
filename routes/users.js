const router = require('express').Router()
const {
  getUsers, findUserById, updateUser, updateUserAvatar, getCurrentUser,
} = require('../controllers/users')
const { validateUserId, validateUserUpdate, validateUserAvatarUpdate } = require('../middlewares/validationUser')

router.get('/users/me', getCurrentUser)

router.get('/users', getUsers)

router.get('/users/:userId', validateUserId, findUserById)

router.patch('/users/me', validateUserUpdate, updateUser)

router.patch('/users/me/avatar', validateUserAvatarUpdate, updateUserAvatar)

module.exports = router
