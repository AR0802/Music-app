import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import Song from '../../components/Song/Song'
import Spinner from '../../components/Spinner/Spinner'
import Navigation from '../../components/Navigation/Navigation'
import Content from '../../components/Content/Content'
import { AuthContext } from '../../context/AuthContext'
import { useHttp } from '../../hooks/http'
import { contextMenuHandler } from '../../util/util'
import './PlaylistContent.css'

const PlaylistContent = props => {
    const auth = useContext(AuthContext)
    const { loading, request } = useHttp()
    const [playlist, setPlaylist] = useState(null)
    const [songsData, setSongsData] = useState(null)
    const [searchedSongs, setSearchedSongs] = useState(null)
    const [linkPath, setLinkPath] = useState('')
    const [like, setLike] = useState(false)
    const playlistId = useParams().playlistId
    const navigate = useNavigate()

    useEffect(() => {
        setLinkPath('/admin/edit-playlist/' + playlistId)

        async function getPlaylist() {
            try {
                const data = await request(
                    'http://localhost:5000/playlist/playlist/' + playlistId,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                )
                setPlaylist(data.playlist)
            } catch (e) {
                console.log(e)
            }
        }

        async function getSongsData() {
            try {
                if (playlistId === '62d2f04e5389add4cad32d4a') {
                    const data = await request(
                        'http://localhost:5000/song/mostPopularSongs/' + playlistId,
                        'GET',
                        null,
                        { Authorization: 'Bearer ' + auth.token }
                    )
                    return setSongsData(data.songs)
                }
                const data = await request(
                    'http://localhost:5000/playlist/playlistSongs',
                    'POST',
                    { playlistId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
                setSongsData(data.songs)
            } catch (e) {
                console.log(e)
            }
        }

        if (auth.token !== null) {
            getSongsData()
        }

        getPlaylist()
    }, [auth.token, playlistId, request])

    useEffect(() => {
        async function checkPlaylistLiked() {
            try {
                const userId = auth.userId
                const data = await request(
                    'http://localhost:5000/user/playlist/' + playlistId,
                    'POST',
                    { userId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
                setLike(data.liked)
            } catch (e) {
                console.log(e)
            }
        }
        checkPlaylistLiked()
    }, [auth.token, auth.userId, playlistId, request])

    const searchTracksHandler = async event => {
        try {
            const searchData = event.target.value
            const data = await request(
                'http://localhost:5000/song/searchSongs',
                'POST',
                { searchData, playlistId },
                { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
            )
            setSearchedSongs(data.songs)
        } catch (e) {
            console.log(e)
        }
    }

    const deletePlaylistHandler = async () => {
        try {
            const data = await request(
                'http://localhost:5000/playlist/playlist/' + playlistId,
                'DELETE',
                {},
                { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
            )
            if (data.status) {
                return navigate('/')
            }
            navigate('/collection/playlists')
        } catch (e) {
            console.log(e)
        }
    }

    const playlistLikeHandler = async () => {
        try {
            const userId = auth.userId
            if (!like) {
                setLike(true)
                await request(
                    'http://localhost:5000/user/playlist',
                    'POST',
                    { playlistId, userId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
            } else {
                setLike(false)
                await request(
                    'http://localhost:5000/user/playlist',
                    'DELETE',
                    { playlistId, userId },
                    { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                )
            }
        } catch (e) {
            console.log(e)
        }
    }

    let content = (
        <Content>
            <Spinner />
        </Content>
    )

    if (!!playlist !== false) {
        let extraContent = null
        if ((playlist.status === 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq' && 
            auth.status === 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq') ||
            playlist.status !== 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq') {
                extraContent = (
                    <>
                        {playlist.songs.length !== 0 ? <hr /> : null}
                        <p className='searchP'>Добавить треки в плейлист</p>
                        <input
                            className='searchInput'
                            name='search'
                            placeholder='Поиск треков'
                            type='search'
                            onChange={searchTracksHandler}
                        />
                        <Link
                            className='playlist-btn playlist-btn-edit'
                            to={linkPath}
                        >
                            Изменить Плейлист
                        </Link>
                        <button
                            className='playlist-btn playlist-btn-delete'
                            onClick={deletePlaylistHandler}
                            disabled={loading}
                        >
                            Удалить Плейлист
                        </button>
                        {searchedSongs !== null ? searchedSongs.map(ss => 
                                <Song
                                    key={ss._id}
                                    song={ss}
                                    searchedSongs={searchedSongs}
                                    playlistId={playlist._id}
                                    forSearch
                                    withoutPlays
                                />
                            ) : null
                        }
                    </>
                )
            }
        content = (
            <Content>
                {songsData !== null ?
                    (
                        <>
                            {playlist.status === 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq' ?
                                <div className={'playlistLike ' + (like ? 'active' : '')} onClick={playlistLikeHandler}></div> :
                                null
                            }
                            <h1 className='playlist-title-header'>{playlist.title}</h1>
                            <table>
                                <thead>
                                    <tr>
                                        <th className='th'>#</th>
                                        <th className='th'>Название</th>
                                        <th className='th'>Прослушивания</th>
                                    </tr>
                                </thead>
                            </table>
                            <hr />
                            {songsData.map((song, index) => 
                                <Song
                                    key={song._id}
                                    song={song}
                                    i={index + 1}
                                    playlistId={playlist._id}
                                    forPlaylist
                                    withoutAR={playlistId === '62d2f04e5389add4cad32d4a' ? true : false}
                                />
                            )}
                            {extraContent}
                        </>
                    ) : null
                }
            </Content>
        )
    }

    return (
        <div onContextMenu={event => contextMenuHandler(event, auth.status)}>
            <Navigation />
            {content}
        </div>
    )
}

export default PlaylistContent