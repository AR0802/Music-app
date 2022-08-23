const { Router } = require('express')
const { body } = require('express-validator')

const User = require('../models/user')
const authController = require('../controllers/auth')

const router = Router()

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Введите корректный Email.')
            .custom(async (value, { req }) => {
                const userDoc = await User.findOne({ email: value })
                if (userDoc) {
                    return Promise.reject('Такой Email уже существует.')
                }
            }),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Пароль слишком короткий.'),
        body('name')
            .isLength({ min: 1 })
            .withMessage('Укажите имя.'),
    ],
    authController.signup
)

router.post('/login', authController.login)

module.exports = router