const jwt = require('jsonwebtoken')
const UnauthorizedErr = require('../errors/unauthorized-err')

module.exports = (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedErr('Необходима авторизация'))
    // return res.status(401).send({ message: 'Необходима авторизация' })
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(token, 'some-secret-key')
  } catch (err) {
    next(new UnauthorizedErr('Необходима авторизация'))
    // return res.status(401).send({ message: 'Необходима авторизация' })
  }

  req.user = payload // записываем пейлоуд в объект запроса

  return next() // пропускаем запрос дальше
}
