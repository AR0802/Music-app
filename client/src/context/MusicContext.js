import { createContext } from 'react'

export const MusicContext = createContext({
    tracks: [],
    currentTrack: {},
    trackIndex: null,
    isPlaying: false,
    currentTime: 0,
    tracksSetter: () => {},
    isPlayingSetter: () => {},
    currentTimeSetter: () => {}
})