import React, { useState, useContext, useEffect, useCallback } from 'react'

import Playlist from '../components/Playlist/Playlist'
import Spinner from '../components/Spinner/Spinner'
import Navigation from '../components/Navigation/Navigation'
import Content from '../components/Content/Content'
import { useHttp } from '../hooks/http'
import { AuthContext } from '../context/AuthContext'
import { contextMenuHandler } from '../util/util'

const Home = props => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [playlists, setPlaylists] = useState(null)

    const getPlaylists = useCallback(async () => {
        try {
            const data = await request(
                'http://localhost:5000/playlist/playlists',
                'GET',
                null,
                { Authorization: 'Bearer ' + auth.token }
            )
            setPlaylists(data.playlists)
        } catch (e) {
            console.log(e)
        }
    }, [auth.token, request])

    useEffect(() => {
        if (auth.token !== null) {
            getPlaylists()
        }
    }, [auth.token, getPlaylists])

    let content = (
        <Content>
            {auth.token !== null ? <Spinner /> : null}
        </Content>
    )

    if (playlists !== null) {
        content = (
            <Content contentClass='content-home'>
                {playlists.map(p =>
                    <Playlist
                        key={p._id}
                        id={p._id}
                        src={p.imageUrl}
                        title={p.title}
                        description={p.description}
                    />
                )}
            </Content>
        )
    }

    return (
        <div onContextMenu={event => contextMenuHandler(event, auth.status)}>
            <Navigation home={true}/>
            {content}
        </div>
    )
}

export default Home