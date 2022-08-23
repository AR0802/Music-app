import React, { useState, useEffect, useRef, useContext } from 'react'

import AudioControls from './AudioControls/AudioControls'
import { useHttp } from '../../../hooks/http'
import { MusicContext } from '../../../context/MusicContext'
import { AuthContext } from '../../../context/AuthContext'
import './AudioPlayer.css'

const AudioPlayer = props => {
    const auth = useContext(AuthContext)
    const music = useContext(MusicContext)
    const { request } = useHttp()

    const [isReady, setIsReady] = useState(0)

    let title, artist, imageUrl, content
    if (music.currentTrack) {
        title = music.currentTrack.title
        artist = music.currentTrack.artist
        imageUrl = music.currentTrack.imageUrl
        content = 'http://localhost:5000/' + music.currentTrack.content
    }

    const audioRef = useRef(new Audio(content))
    const intervalRef = useRef()

    const { duration } = audioRef.current

    const currentPercentage = duration
        ? `${(music.currentTime / duration) * 100}%`
        : "0%"
    const trackStyling = `
        -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #fff), color-stop(${currentPercentage}, #777))
    `

    const startTimer = () => {
        clearInterval(intervalRef.current)
        intervalRef.current = setInterval(() => {
            if (audioRef.current.ended) {
                if (music.tracks.length > 1) {
                    if (music.tracks.length - 1 !== music.trackIndex) {
                        toNextTrack()
                    } else {
                        if (props.home) {
                            setIsReady(1)
                        } else {
                            setIsReady(0)
                        }
                        music.tracksSetter(music.tracks, music.tracks[0], 0)
                        music.isPlayingSetter(false)
                        music.currentTimeSetter(0)
                    }
                } else {
                    music.isPlayingSetter(false)
                    music.currentTimeSetter(0)
                }
            } else {
                music.currentTimeSetter(audioRef.current.currentTime)
            }
        }, [1000])
    }

    const onScrub = value => {
        clearInterval(intervalRef.current)
        audioRef.current.currentTime = value
        music.currentTimeSetter(audioRef.current.currentTime)
    }

    const onScrubEnd = () => {
        if (!music.isPlaying) {
            music.isPlayingSetter(true)
        }
        startTimer()
    }

    const toPrevTrack = () => {
        if (music.tracks.length > 1) {
            if (music.trackIndex - 1 < 0) {
                music.tracksSetter(music.tracks, music.tracks[music.tracks.length - 1], music.tracks.length - 1)
                music.isPlayingSetter(true)
                music.currentTimeSetter(0)
            } else {
                music.tracksSetter(music.tracks, music.tracks[music.trackIndex - 1], music.trackIndex - 1)
                music.isPlayingSetter(true)
                music.currentTimeSetter(0)
            }
        }
    }

    const toNextTrack = () => {
        if (music.tracks.length > 1) {
            if (music.trackIndex < music.tracks.length - 1) {
                music.tracksSetter(music.tracks, music.tracks[music.trackIndex + 1], music.trackIndex + 1)
                music.isPlayingSetter(true)
                music.currentTimeSetter(0)
            } else {
                music.tracksSetter(music.tracks, music.tracks[0], 0)
                music.isPlayingSetter(true)
                music.currentTimeSetter(0)
            }
        }
    }

    useEffect(() => {
        async function currentTrackChangeHandler() {
            audioRef.current.pause()

            audioRef.current = new Audio(content)
            audioRef.current.currentTime = music.currentTime
            music.currentTimeSetter(audioRef.current.currentTime)

            if ((props.home && isReady !== 0 && isReady !== 1 && music.isPlaying !== false) || 
                (!props.home && isReady !== 0 && music.isPlaying !== false)) {
                    audioRef.current.play()
                    music.isPlayingSetter(true)
                    startTimer()
                    const songPath = content.split('5000/')[1]
                    try {
                        await request(
                            'http://localhost:5000/song/addSongPlay',
                            'POST',
                            { songPath },
                            { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                        )
                    } catch (e) {
                        console.log(e)
                    }
            } else {
                setIsReady(isReady + 1)
            }
        }
        currentTrackChangeHandler()
    }, [music.currentTrack])

    useEffect(() => {
        if (music.isPlaying) {
            audioRef.current.play()
            startTimer()
        } else {
            audioRef.current.pause()
        }
    }, [music.isPlaying])

    useEffect(() => {
        return () => {
            audioRef.current.pause()
            clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <div className='player'>
            {auth.isAuthenticated ? 
                !!music.currentTrack !== false ? (
                    <div className='player-song-container'>
                        {!!imageUrl !== false ? (
                            <img
                                className='player-song-image'
                                src={'http://localhost:5000/' + imageUrl}
                                alt=''
                            />) : null
                        }
                        <div className='player-song-title'>{title}</div>
                        <div className='player-song-artist'>{artist}</div>
                        <div className='audio'>
                            <AudioControls
                                isPlaying={music.isPlaying}
                                onPrevClick={toPrevTrack}
                                onNextClick={toNextTrack}
                                onPlayPauseClick={music.isPlayingSetter}
                            />
                        </div>
                        <input
                            type="range"
                            value={music.currentTime}
                            step="1"
                            min="0"
                            max={duration ? duration : `${duration}`}
                            onChange={e => onScrub(e.target.value)}
                            onMouseUp={onScrubEnd}
                            onKeyUp={onScrubEnd}
                            style={{ background: trackStyling }}
                            disabled={music.tracks.length === 0 ? true : false}
                        />
                    </div>) : null
                : null
            }
        </div>
    )
}

export default AudioPlayer