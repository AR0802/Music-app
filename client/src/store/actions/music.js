import * as actionTypes from './actionTypes'

export const pressLike = (liked, songId) => {
    return {
        type: actionTypes.PRESS_LIKE,
        liked,
        songId
    }
}

export const setLike = (liked, songId) => {
    return {
        type: actionTypes.SET_LIKE,
        liked,
        songId
    }
}