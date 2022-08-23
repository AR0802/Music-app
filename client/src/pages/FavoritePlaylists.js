import React, { useState, useEffect, useContext } from 'react'

import Playlist from '../components/Playlist/Playlist'
import Spinner from '../components/Spinner/Spinner'
import Navigation from '../components/Navigation/Navigation'
import Content from '../components/Content/Content'
import { useHttp } from '../hooks/http'
import { AuthContext } from '../context/AuthContext'
import { contextMenuHandler } from '../util/util'

const FavoritePlaylists = props => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [playlists, setPlaylists] = useState(null)

    useEffect(() => {
        async function getFavoritePlalylists() {
            try {
                const data = await request(
                    'http://localhost:5000/user/playlists/' + auth.userId,
                    'GET',
                    null,
                    { Authorization: 'Bearer ' + auth.token }
                )
                setPlaylists(data.playlists)
            } catch (e) {
                console.log(e)
            }
        }
        getFavoritePlalylists()
    }, [auth.token, auth.userId, request])

    let content = (
        <Content>
            <Spinner />
        </Content>
    )

    if (playlists !== null) {
        content = (
            <Content contentClass='content-home' forFavoritePlaylists={playlists[0] !== undefined ? true : false}>
                {playlists[0] !== undefined ?
                    playlists.map(p =>   
                        <Playlist
                            key={p._id}
                            id={p._id}
                            src={p.imageUrl}
                            title={p.title}
                            description={p.description}
                        />
                    ) : <h1 style={{ color: '#fff', margin: '0 auto' }}>Здесь пока ничего нет.</h1>
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

export default FavoritePlaylists