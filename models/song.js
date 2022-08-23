const { Schema, model } = require('mongoose')

const songSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        plays: {
            type: Number,
            default: 0
        },
        artist: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = model('Song', songSchema)
