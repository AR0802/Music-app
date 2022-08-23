import React, { useState } from 'react'

import './Content.css'

const Content = props => {
    const [width, setWidth] = useState(document.documentElement.clientWidth - 240)
    const [height, setHeight] = useState(document.documentElement.clientHeight - 150)

    window.onresize = () => {
        setWidth(document.documentElement.clientWidth - 240)
        setHeight(document.documentElement.clientHeight - 150)
    } 

    return (
        <div className='content' style={{ width: width, height: height }}>
            {props.forFavoritePlaylists ? <h1 className='content-title'>Любимые плейлисты</h1> : null}
            <div className={props.contentClass}>
                {props.children}
            </div>
        </div>
    )
}

export default Content