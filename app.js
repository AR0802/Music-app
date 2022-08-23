const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')

const authRoutes = require('./routes/auth')
const playlistsRoutes = require('./routes/playlist')
const songsRoutes = require('./routes/song')
const userRoutes = require('./routes/user')

const app = express()

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      return cb(null, 'images')
    }
    cb(null, 'music')
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'image') {
      return cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
    }
    cb(null, file.originalname)
  }
})

app.use(express.json())
app.use(
  multer({ storage: fileStorage }).any()
)
app.use('/music', express.static(path.join(__dirname, 'music')))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use('/auth', authRoutes)
app.use('/playlist', playlistsRoutes)
app.use('/song', songsRoutes)
app.use('/user', userRoutes)

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message
  const data = error.data
  res.status(status).json({ message: message, data: data })
})

mongoose
  .connect(
    'mongodb+srv://AR:08022002@practicecluster.axdsx.mongodb.net/musicApp?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(5000)
  })
  .catch(err => console.log(err))