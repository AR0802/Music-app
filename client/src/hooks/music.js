import { useState, useEffect, useCallback } from 'react'

export const useMusic = () => {
    const [tracks, setTracks] = useState([])
    const [currentTrack, setCurrentTrack] = useState({})
    const [trackIndex, setTrackIndex] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)

    const tracksSetter = useCallback((tracks, currentTrack, trackIndex) => {
        setTracks(tracks)
        setCurrentTrack(currentTrack)
        setTrackIndex(trackIndex)
        localStorage.setItem('MusicData', JSON.stringify({
            tracks, currentTrack, trackIndex
        }))
    }, [])

    const isPlayingSetter = useCallback(isPlaying => {
        setIsPlaying(isPlaying)
        localStorage.setItem('isPlaying', JSON.stringify(isPlaying))
    }, [])

    const currentTimeSetter = useCallback(currentTime => {
        setCurrentTime(currentTime)
        localStorage.setItem('currentTime', JSON.stringify(currentTime))
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('MusicData'))
        if (data && data.tracks) {
            tracksSetter(data.tracks, data.currentTrack, data.trackIndex)
        }
    }, [tracksSetter])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('isPlaying'))
        if (data) {
            isPlayingSetter(data)
        }
    }, [isPlayingSetter])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('currentTime'))
        if (data) {
            currentTimeSetter(data)
        }
    }, [currentTimeSetter])

    return { tracks, trackIndex, currentTrack, isPlaying, currentTime, tracksSetter, isPlayingSetter, currentTimeSetter }
}