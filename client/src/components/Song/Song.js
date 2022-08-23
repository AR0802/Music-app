import React, { useState, useContext, useEffect } from 'react'
import { connect } from 'react-redux'
import { pressLike, setLike } from '../../store/actions/index';

import Like from '../Like/Like'
import { ReactComponent as Play } from '../Navigation/AudioPlayer/assets/play.svg'
import { ReactComponent as Pause } from '../Navigation/AudioPlayer/assets/pause.svg'
import { useHttp } from '../../hooks/http'
import { AuthContext } from '../../context/AuthContext'
import { MusicContext } from '../../context/MusicContext'
import './Song.css'

const Song = props => {
    const auth = useContext(AuthContext)
    const music = useContext(MusicContext)
    const { loading, request } = useHttp()
    const [like, setLike] = useState(false)
    const [userPl, setUserPl] = useState(false)

    useEffect(() => {
        async function getSongData() {
            try {
                const songId = props.song._id
                const userId = auth.userId
                const playlistId = props.playlistId
                const data = await request(
                    'http://localhost:5000/user/song/' + songId,
                    'POST',
                    { userId, playlistId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
                props.onSetLike(data.liked, data.songId)
                setLike(data.liked)
                setUserPl(data.userPl)
            } catch (e) {
                console.log(e)
            }
        }
        getSongData()
    }, [auth.token, auth.userId, props, request])

    const likeClickHandler = async () => {
        try {
            const songId = props.song._id
            const userId = auth.userId
            props.onPressLike(like, songId)
            if (!like) {
                props.onSetLike(true, songId)
                setLike(true)
                return await request(
                    'http://localhost:5000/user/song/' + songId,
                    'PUT',
                    { userId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
            }
            props.onSetLike(false, songId)
            setLike(false)
            await request(
                'http://localhost:5000/user/song/' + songId,
                'DELETE',
                { userId },
                { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
            )
        } catch (e) {
            console.log(e)
        }
    }

    const arClickHandler = async () => {
        try {
            const songId = props.song._id
            const playlistId = props.playlistId
            if (props.forSearch) {
                await request(
                    'http://localhost:5000/song/addSong',
                    'POST',
                    { songId, playlistId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
            } else {
                await request(
                    'http://localhost:5000/song/removeSong',
                    'DELETE',
                    { songId, playlistId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
            }
            const data = await request(
                `http://localhost:5000/song/song/${songId}/${playlistId}`,
                'GET',
                null,
                { Authorization: 'Bearer ' + auth.token }
            )
            if (songId !== music.currentTrack._id) {
                music.currentTimeSetter(0)
            }
            music.tracksSetter(data.playlist, data.currentTrack, data.trackIndex)
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    const playSongHandler = async () => {
        try {
            const playlistId = props.playlistId
            const songId = props.song._id
            if (music.isPlaying) {
                music.isPlayingSetter(false)
            } else {
                music.isPlayingSetter(true)
            }
            let data
            if (!props.searchedSongs) {
                data = await request(
                    `http://localhost:5000/song/song/${songId}/${playlistId}`,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                )
            } else {
                const searchedSongs = props.searchedSongs
                data = await request(
                    `http://localhost:5000/song/song/${songId}`,
                    'POST',
                    { searchedSongs },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
            }
            if (JSON.stringify(music.currentTrack._id) !== JSON.stringify(data.currentTrack._id)) {
                music.tracksSetter(data.playlist, data.currentTrack, data.trackIndex)
                music.isPlayingSetter(true)
                music.currentTimeSetter(0)
            } else if (JSON.stringify(music.tracks) !== JSON.stringify(data.playlist)) {
                music.tracksSetter(data.playlist, data.currentTrack, data.trackIndex)
                if (music.isPlaying) {
                    music.isPlayingSetter(false)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className='song-container'>
            {props.forPlaylist ?
                <div
                    className='song-index'
                    style={music.currentTrack !== undefined ?
                        props.song._id === music.currentTrack._id ? { color: '#0fdd59' } : null
                        : null
                    }
                >
                    {props.i}
                </div> : null
            }
            {music.currentTrack !== undefined ?
                music.currentTrack._id === props.song._id ?
                    music.isPlaying ? (
                        <button
                            type="button"
                            className={"song-pause " + (music.currentTrack !== undefined ?
                                props.song._id === music.currentTrack._id ? 'active' : null
                                : null
                            )}
                            onClick={playSongHandler}
                            aria-label="Pause"
                        >
                            <Pause />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={"song-play " + (music.currentTrack !== undefined ?
                                props.song._id === music.currentTrack._id ? 'active' : null
                                : null
                            )}
                            onClick={playSongHandler}
                            aria-label="Play"
                        >
                            <Play />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="song-play"
                            onClick={playSongHandler}
                            aria-label="Play"
                        >
                            <Play />
                        </button>
                    )
                : (
                    <button
                        type="button"
                        className="song-play"
                        onClick={playSongHandler}
                        aria-label="Play"
                    >
                        <Play />
                    </button>
                )
            }
            <img
                className={'song-image'}
                src={'http://localhost:5000/' + props.song.imageUrl}
                alt=''
            />
            <div
                className={'song-title'}
                style={music.currentTrack !== undefined ?
                    props.song._id === music.currentTrack._id ? { color: '#0fdd59' } : null
                    : null
                }
            >
                {props.song.title}
            </div>
            <div className={'song-artist'}>{props.song.artist}</div>
            {!props.withoutPlays ? <div className='song-plays'>{props.song.plays}</div> : null}
            {auth.status === 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq' ? (
                !props.withoutAR ? (
                    <button
                        className='ar-button'
                        onClick={arClickHandler}
                        disabled={loading}
                    >
                        {props.forSearch ? 'Добавить' : 'Удалить'}
                    </button>
                ) : null)
                : userPl ? (
                    <button
                        className='ar-button'
                        onClick={arClickHandler}
                        disabled={loading}
                    >
                        {props.forSearch ? 'Добавить' : 'Удалить'}
                    </button>
                ) : null
            }
            <div className='like-song-button'>
                <Like songId={props.song._id} onClick={likeClickHandler} />
            </div>
        </div>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        onPressLike: (liked, songId) => dispatch(pressLike(liked, songId)),
        onSetLike: (liked, songId) => dispatch(setLike(liked, songId))
    }
}

export default connect(null, mapDispatchToProps)(Song)