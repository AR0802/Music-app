import React from 'react'
import { Link } from 'react-router-dom'

import './Playlist.css'

const playlist = props => {
    const src = props.src === '' ? 'images/2022-07-16T14-28-09.365Z-Music.png' : props.src

    return (
        <Link className='playlist-container' to={'/playlist/' + props.id}>
            <img className='playlist-image' src={'http://localhost:5000/' + src} alt='' />
            <p className='playlist-title'>{props.title}</p>
            <p className='playlist-description'>{props.description}</p>
        </Link>
    )
}

export default playlist