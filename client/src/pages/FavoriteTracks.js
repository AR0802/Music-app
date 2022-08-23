import React, { useState, useEffect, useContext } from 'react'

import Song from '../components/Song/Song'
import Spinner from '../components/Spinner/Spinner'
import Navigation from '../components/Navigation/Navigation'
import Content from '../components/Content/Content'
import { useHttp } from '../hooks/http'
import { AuthContext } from '../context/AuthContext'
import { contextMenuHandler } from '../util/util'

const FavoriteTracks = props => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [songs, setSongs] = useState(null)

    useEffect(() => {
        async function getFavoriteSongs() {
            try {
                const data = await request(
                    'http://localhost:5000/user/tracks/' + auth.userId,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                )
                setSongs(data.tracks)
            } catch (e) {
                console.log(e)
            }
        }
        getFavoriteSongs()
    }, [auth.token, auth.userId, request])

    let content = (
        <Content>
            <Spinner />
        </Content>
    )

    if (songs !== null) {
        content = (
            <Content>
                {songs[0] !== undefined ? (
                    <>
                        <h1 className='playlist-title-header' style={{ marginTop: '0', marginBottom: '-1rem' }}>Любимые треки</h1>
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
                        {songs.map((song, index) =>
                            <Song
                                key={song._id}
                                song={song}
                                searchedSongs={songs}
                                i={index + 1}
                                forPlaylist
                                withoutAR
                            />
                        )}
                    </>
                ) : <h1 style={{ color: '#fff', textAlign: 'center' }}>Здесь пока ничего нет.</h1>}
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

export default FavoriteTracks