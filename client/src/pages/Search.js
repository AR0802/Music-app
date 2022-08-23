import React, { useState, useContext } from 'react'

import Song from '../components/Song/Song'
import Playlist from '../components/Playlist/Playlist'
import Navigation from '../components/Navigation/Navigation'
import Content from '../components/Content/Content'
import { useHttp } from '../hooks/http'
import { AuthContext } from '../context/AuthContext'
import { contextMenuHandler } from '../util/util'

const Search = props => {
    const auth = useContext(AuthContext)
    const { request } = useHttp()
    const [searchedSongs, setSearchedSongs] = useState(null)
    const [searchedPLaylists, setSearchedPLaylists] = useState(null)

    const searchHandler = async event => {
        try {
            const searchData = event.target.value
            const data = await request(
                'http://localhost:5000/user/search',
                'POST',
                { searchData },
                { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
            )
            setSearchedSongs(data.songs)
            setSearchedPLaylists(data.playlists)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div onContextMenu={event => contextMenuHandler(event, auth.status)}>
            <Navigation />
            <Content>
                <input
                    className='searchInput'
                    name='search'
                    placeholder='Введите трек, исполнителя или плейлист'
                    type='search'
                    onChange={searchHandler}
                />
                {searchedPLaylists !== null ? 
                    <div className='content-home'> 
                        {searchedPLaylists.map(sp => 
                            <Playlist
                                key={sp._id}
                                id={sp._id}
                                src={sp.imageUrl}
                                title={sp.title}
                                description={sp.description}
                            />
                        )} 
                    </div> : 
                    null 
                }
                {searchedSongs !== null ? searchedSongs.map(ss => 
                        <Song
                            key={ss._id}
                            song={ss}
                            searchedSongs={searchedSongs}
                            forSearch
                            withoutAR
                            withoutPlays
                        />
                    ) : null
                }
            </Content>
        </div>
    )
}

export default Search