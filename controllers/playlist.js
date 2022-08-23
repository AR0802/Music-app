const fs = require('fs')
const path = require('path')
const { validationResult } = require('express-validator')

const Playlist = require('../models/playlist')
const User = require('../models/user')

exports.getPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ status: 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq'})
    res.status(200).json({
      message: 'Fetched playlists successfully.',
      playlists: playlists
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getPlaylistSongs = async (req, res, next) => {
  try {
    const playlistId = req.body.playlistId
    const playlist = await Playlist.findById(playlistId).populate('songs')
    res.status(200).json({
      message: 'Fetched songs successfully.',
      songs: playlist.songs
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.createPlaylist = async (req, res, next) => {
  const errors = validationResult(req)
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }
    const title = req.body.title
    const imageUrl = req.files[0].path
    const description = req.body.description
    const playlist = new Playlist({
        title: title,
        imageUrl: imageUrl,
        description: description,
        status: req.status
    })
    await playlist.save()
    res.status(201).json({
      message: 'Playlist created successfully!',
      playlist: playlist
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    clearImage(req.files[0].path)
    next(err)
  }
}

exports.getPlaylist = async (req, res, next) => {
  const playlistId = req.params.playlistId
  const playlist = await Playlist.findById(playlistId)
  try {
    if (!playlist) {
      const error = new Error('Could not find playlist.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ message: 'Playlist fetched.', playlist: playlist })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.updatePlaylist = async (req, res, next) => {
  const errors = validationResult(req)
  try {
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.')
      error.statusCode = 422
      error.data = errors.array()
      throw error
    }
    const playlistId = req.params.playlistId
    const title = req.body.title
    const description = req.body.description
    let imageUrl = req.body.image
    if (req.files[0]) {
      imageUrl = req.files[0].path
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      const error = new Error('Could not find playlist.')
      error.statusCode = 404
      throw error
    }
    if (imageUrl !== playlist.imageUrl) {
      clearImage(playlist.imageUrl)
    }
    playlist.title = title
    playlist.imageUrl = imageUrl
    playlist.description = description
    const status = playlist.status === 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq' ? true : false
    const result = await playlist.save()
    res.status(200).json({ message: 'Playlist updated!', playlist: result, status: status })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.deletePlaylist = async (req, res, next) => {
  const playlistId = req.params.playlistId
  try {
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
      const error = new Error('Could not find playlist.')
      error.statusCode = 404
      throw error
    }
    if (playlist.status !== 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq') {
      const user = await User.findById(req.userId)
      await user.playlists.pull(playlistId)
      await user.save()
    }
    const status = playlist.status === 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq' ? true : false
    clearImage(playlist.imageUrl)
    await Playlist.findByIdAndRemove(playlistId)
    res.status(200).json({ message: 'Deleted playlist.', status })
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