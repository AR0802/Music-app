const fs = require('fs')
const path = require('path')

const Song = require('../models/song')
const Playlist = require('../models/playlist')

exports.getSongs = async (req, res, next) => {
  try {
    const songs = await Song.find()
    res.status(200).json({
      message: 'Fetched songs successfully.',
      songs: songs
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getMostPopularSongs = async (req, res, next) => {
  try {
    const playlistId = req.params.playlistId
    const songs = await Song
      .find()
      .sort({ plays: -1 })
    const playlist = await Playlist.findById(playlistId)
    playlist.songs = songs
    await playlist.save()
    res.status(200).json({
      message: 'Fetched songs successfully.',
      songs: songs
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.searchSongs = async (req, res, next) => {
  try {
    const searchData = req.body.searchData
    const playlistId = req.body.playlistId
    const songsByTitle = await Song.find({ title: searchData })
    const songsByArtist = await Song.find({ artist: searchData })
    const allSongs = songsByTitle.concat(songsByArtist)
    const playlist = await Playlist.findById(playlistId)
    const songs = []
    allSongs.map(song => {
      let exist = false
      for (i = 0; i < playlist.songs.length; i++) {
        if (song._id.toString() === playlist.songs[i]._id.toString()) {
          exist = true
          break
        }
      }
      if (!exist) {
        songs.push(song)
      }
    })
    res.status(200).json({
      message: 'Fetched songs successfully.',
      songs: songs
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.addSongToPlaylist = async (req, res, next) => {
  try {
    const playlistId = req.body.playlistId
    const songId = req.body.songId
    const playlist = await Playlist.findById(playlistId)
    const song = await Song.findById(songId)
    playlist.songs.push(song)
    await playlist.save()
    res.status(200).json({
      message: 'Song added to playlist successfully.'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.removeSongFromPlaylist = async (req, res, next) => {
  try {
    const playlistId = req.body.playlistId
    const songId = req.body.songId
    const playlist = await Playlist.findById(playlistId)
    const song = await Song.findById(songId)
    await playlist.songs.pull(song)
    await playlist.save()
    res.status(200).json({
      message: 'Song removed from playlist successfully.'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.createSong = async (req, res, next) => {
  try {
    const title = req.body.title
    const imageUrl = req.files[0].path
    const content = req.files[1].path
    const artist = req.body.artist
    const song = new Song({
        title: title,
        imageUrl: imageUrl,
        content: content,
        artist: artist
    })
    await song.save()
    res.status(201).json({
      message: 'Song created successfully!',
      song: song
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    clearImage(req.files[0].path)
    clearImage(req.files[1].path)
    next(err)
  }
}

exports.addSongPlay = async (req, res, next) => {
  try {
    const songPath = req.body.songPath
    const song = await Song.findOne({ content: songPath })
    song.plays++
    await song.save()
    res.status(201).json({
      message: 'Song play added successfully!'
    })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getPlaylistAndCurrentSong = async (req, res, next) => {
  const playlistId = req.params.playlistId
  const songId = req.params.songId
  const playlist = await Playlist.findById(playlistId).populate('songs')
  const song = await Song.findById(songId)
  let trackIndex
  playlist.songs.map((song, index) => {
    if (song._id.toString() === songId.toString()) {
      trackIndex = index
    }
  })
  try {
    if (!playlist) {
      const error = new Error('Could not find playlist.')
      error.statusCode = 404
      throw error
    }
    res.status(200).json({ playlist: playlist.songs[0] !== undefined ? playlist.songs : [{...song._doc}], currentTrack: song, trackIndex })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.getSongsAndCurrentSong = async (req, res, next) => {
  try {
    const songId = req.params.songId
    const searchedSongs = req.body.searchedSongs
    const song = await Song.findById(songId)
    let trackIndex
    searchedSongs.map((song, index) => {
      if (song._id.toString() === songId.toString()) {
        trackIndex = index
      }
    })
      res.status(200).json({ playlist: searchedSongs, currentTrack: song, trackIndex })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.updateSong = async (req, res, next) => {
  const songId = req.params.songId
  const title = req.body.title
  const artist = req.body.artist
  let contentUrl = req.body.content
  let imageUrl = req.body.image
  if (req.files) {
    imageUrl = req.files[0].path
    contentUrl = req.files[1].path
  }
  try {
    if (!imageUrl || !contentUrl) {
        const error = new Error('No file picked.')
        error.statusCode = 422
        throw error
    }
    const song = await Song.findById(songId)
    if (!song) {
        const error = new Error('Could not find song.')
        error.statusCode = 404
        throw error
    }
    if (imageUrl !== song.imageUrl) {
        clearImage(song.imageUrl)
    }
    if (contentUrl !== song.contentUrl) {
        clearImage(song.contentUrl)
    }
    song.title = title
    song.imageUrl = imageUrl
    song.contentUrl = contentUrl
    song.artist = artist
    const result = await song.save()
    res.status(200).json({ message: 'Playlist updated!', song: result })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    next(err)
  }
}

exports.deleteSong = async (req, res, next) => {
  const songId = req.params.songId
  try {
    const song = await Song.findById(songId)
    if (!song) {
      const error = new Error('Could not find song.')
      error.statusCode = 404
      throw error
    }
    clearImage(song.imageUrl)
    clearImage(song.contentUrl)
    await Song.findByIdAndRemove(songId)
    res.status(200).json({ message: 'Deleted song.' })
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