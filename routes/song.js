const express = require('express')

const songController = require('../controllers/song')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/songs', isAuth, songController.getSongs)

router.get('/mostPopularSongs/:playlistId', isAuth, songController.getMostPopularSongs)

router.post('/searchSongs', isAuth, songController.searchSongs)

router.post('/addSong', isAuth, songController.addSongToPlaylist)

router.delete('/removeSong', isAuth, songController.removeSongFromPlaylist)

router.post('/addSongPlay', isAuth, songController.addSongPlay)

router.post('/song', isAuth, songController.createSong)

router.get('/song/:songId/:playlistId', isAuth, songController.getPlaylistAndCurrentSong)

router.post('/song/:songId', isAuth, songController.getSongsAndCurrentSong)

router.put('/song/:songId', isAuth, songController.updateSong)

router.delete('/song/:songId', isAuth, songController.deleteSong)

module.exports = router