const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')

const User = require('../models/user')
const Song = require('../models/song')
const Playlist = require('../models/playlist')

exports.getSong = async (req, res, next) => {
    try {
        const songId = req.params.songId
        const userId = req.body.userId
        const playlistId = req.body.playlistId
        const user = await User.findById(userId) 
        const playlist = await Playlist.findById(playlistId)
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        let liked = false
        let userPl = false
        for (i = 0; i < user.songs.length; i++) {
            if (user.songs[i]._id.toString() === songId.toString()) {
                liked = true
                break
            }
        }
        if (playlist) {
            for (i = 0; i < user.playlists.length; i++) {
                if (playlist.status !== 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq') {
                    if (user.playlists[i]._id.toString() === playlistId.toString()) {
                        userPl = true
                        break
                    }
                }
            }
        }
        res.status(200).json({
            liked: liked,
            songId: songId,
            userPl
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.getTracks = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId).populate('songs')
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({
            tracks: user.songs
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.getPlaylists = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId).populate('playlists')
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        res.status(200).json({
            playlists: user.playlists
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.getPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.playlistId
        const userId = req.body.userId
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        let liked = false
        for (i = 0; i < user.playlists.length; i++) {
            if (user.playlists[i]._id.toString() === playlistId.toString()) {
                liked = true
                break
            }
        }
        res.status(200).json({
            liked: liked,
            playlistId: playlistId
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.getUserPlaylist = async (req, res, next) => {
    const playlistId = req.params.playlistId
    const userId = req.body.userId
    try {
        const user = await User.findById(userId)
        let userPlaylistId = null
        for (let i = 0; i < user.playlists.length; i++) {
            if (user.playlists[i].toString() === playlistId.toString()) {
                userPlaylistId = user.playlists[i]
                break
            }
        }
        if (!userPlaylistId) {
            const error = new Error('Could not find playlist.')
            error.statusCode = 404
            throw error
        }
        const playlist = await Playlist.findById(userPlaylistId)
        res.status(200).json({ message: 'Playlist fetched.', playlist: playlist })
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    }
}

exports.createUserPlaylist = async (req, res, next) => {
    const errors = validationResult(req)
    try {
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed.')
        error.statusCode = 422
        error.data = errors.array()
        throw error
      }
      const user = await User.findById(req.userId)
      let imageUrl = ''
      if (req.files[0]) {
        imageUrl = req.files[0].path
      }
      const title = req.body.title
      let description = req.body.description
      if (!!description === false) {
        description = user.name
      }
      const playlist = new Playlist({
          title: title,
          imageUrl: imageUrl,
          description: description,
          status: 'envklnvlqnvlknqver'
      })
      await playlist.save()
      user.playlists.push(playlist)
      await user.save()
      res.status(201).json({
        message: 'User playlist created successfully!'
      })
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      if (req.files[0]) {
        clearImage(req.files[0].path)
      }
      next(err)
    }
}

exports.likeSong = async (req, res, next) => {
    try {
        const songId = req.params.songId
        const userId = req.body.userId
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        user.songs.push(songId)
        await user.save()
        res.status(200).json({
            message: 'Song added to user successfully.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.deleteSong = async (req, res, next) => {
    try {
        const songId = req.params.songId
        const userId = req.body.userId
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        await user.songs.pull(songId)
        await user.save()
        res.status(200).json({ message: 'Deleted song.' })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.addPlaylistToUser = async (req, res, next) => {
    try {
        const playlistId = req.body.playlistId
        const userId = req.body.userId
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        user.playlists.push(playlistId)
        await user.save()
        res.status(200).json({
            message: 'Playlist added to user successfully.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.removePlaylistFromUser = async (req, res, next) => {
    try {
        const playlistId = req.body.playlistId
        const userId = req.body.userId
        const user = await User.findById(userId)
        if (!user) {
            const error = new Error('Not authorized.')
            error.statusCode = 404
            throw error
        }
        await user.playlists.pull(playlistId)
        await user.save()
        res.status(200).json({
            message: 'Playlist removed from user successfully.'
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500
        }
        next(err)
    }
}

exports.search = async (req, res, next) => {
    try {
      const searchData = req.body.searchData
      const songsByTitle = await Song.find({ title: searchData })
      const songsByArtist = await Song.find({ artist: searchData })
      const songs = songsByTitle.concat(songsByArtist)
      const playlists = await Playlist.find({ title: searchData, status: 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq' })
      res.status(200).json({
        songs: songs,
        playlists: playlists
      })
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500
      }
      next(err)
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath)
    fs.unlink(filePath, err => console.log(err))
  }