const { Schema, model, Types } = require('mongoose')

const playlistSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String
    },
    description: {
      type: String
    },
    songs: [
      {
        type: Types.ObjectId,
        ref: 'Song',
        required: true
      }
    ],
    status: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = model('Playlist', playlistSchema)
