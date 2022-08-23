const { Router } = require('express')
const { body } = require('express-validator')

const userController = require('../controllers/user')
const isAuth = require('../middleware/is-auth')

const router = Router()

router.get('/tracks/:userId', isAuth, userController.getTracks)

router.get('/playlists/:userId', isAuth, userController.getPlaylists)

router.post('/search', isAuth, userController.search)

router.post('/playlist/:playlistId', isAuth, userController.getPlaylist)

router.post('/userPlaylist/:playlistId', isAuth, userController.getUserPlaylist)

router.post(
    '/userPlaylist',
    [
        body('title')
            .isLength({ max: 14 })
            .withMessage('Название плейлиста слишком длинное.'),
        body('description')
            .isLength({ max: 30 })
            .withMessage('Описание плейлиста слишком длинное.')
    ],
    isAuth, 
    userController.createUserPlaylist
)

router.post('/playlist', isAuth, userController.addPlaylistToUser)

router.delete('/playlist', isAuth, userController.removePlaylistFromUser)

router.post('/song/:songId', isAuth, userController.getSong)

router.put('/song/:songId', isAuth, userController.likeSong)

router.delete('/song/:songId', isAuth, userController.deleteSong)

module.exports = router