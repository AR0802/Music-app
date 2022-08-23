import * as actionTypes from '../actions/actionTypes'

const initialState = {
    songs: []
}

const reducer = (state = initialState, action) => {
    const i = state.songs.findIndex(s => {
        if (s.songId.toString() === action.songId.toString()) {
            return true
        }
        return false
    })

    switch (action.type) {
        case actionTypes.PRESS_LIKE:
            const songs = state.songs
            if (i !== -1) {
                songs[i].liked = !action.liked
            }
            return {
                ...state,
                songs: songs
            }
        case actionTypes.SET_LIKE:
            if (i === -1) {
                return {
                    ...state,
                    songs: state.songs.concat({ liked: action.liked, songId: action.songId })
                }
            }
            return {
                ...state
            }
        default: 
            return state
    }
}

export default reducer