const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const UnauthorizedErr = require('../errors/unauthorized-err')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
    required: [true, 'Поле должно быть заполнено'],
    unique: [true, 'Пользователь с такие email уже существует'],
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
}, { versionKey: false })

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'))
        return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'))
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // return Promise.reject(new Error('Неправильные почта или пароль'))
            return Promise.reject(new UnauthorizedErr('Неправильные почта или пароль'))
          }

          return user // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema)
