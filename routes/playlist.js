const express = require('express')
const { body } = require('express-validator')

const playlistController = require('../controllers/playlist')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/playlists', isAuth, playlistController.getPlaylists)

router.post('/playlistSongs', isAuth, playlistController.getPlaylistSongs)

router.post(
    '/playlist',
    [
        body('title')
            .isLength({ max: 25 })
            .withMessage('Название плейлиста слишком длинное.'),
        body('description')
            .isLength({ max: 30 })
            .withMessage('Описание плейлиста слишком длинное.')
    ],
    isAuth, 
    playlistController.createPlaylist
)

router.get('/playlist/:playlistId', isAuth, playlistController.getPlaylist)

router.put(
    '/playlist/:playlistId',
    [
        body('title')
            .isLength({ max: 25 })
            .withMessage('Название плейлиста слишком длинное.'),
        body('description')
            .isLength({ max: 30 })
            .withMessage('Описание плейлиста слишком длинное.')
    ],
    isAuth, 
    playlistController.updatePlaylist
)

router.delete('/playlist/:playlistId', isAuth, playlistController.deletePlaylist)

module.exports = router