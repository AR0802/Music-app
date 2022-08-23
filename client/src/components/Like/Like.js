import React, { useState, useRef, useEffect } from 'react'
import { connect } from 'react-redux'

import './Like.css'

const Like = props => {
    const ref = useRef(null)
    const [like, setLike] = useState(false)

    useEffect(() => {
        if (props.songs) {
            const i = props.songs.findIndex(s => {
                if (s.songId.toString() === props.songId.toString()) {
                    return true
                }
                return false
            })
            if (props.songs[i]) {
                setLike(props.songs[i].liked)
            }
        }

        function handleClick() {
            if (!like) {
                this.classList.add('active')
                setLike(true)
            } else {
                this.classList.remove('active')
                setLike(false)
            }
        }
        
        const element = ref.current
        element.addEventListener('click', handleClick)

        return () => {
            element.removeEventListener('click', handleClick)
        }
    }, [like, props.songId, props.songs])

    return (
        <div className={'like ' + (like ? 'active' : '')} ref={ref} onClick={props.onClick}></div>
    )
}

const mapStateToProps = state => {
    return {
        songs: state.songs
    }
}

export default connect(mapStateToProps)(Like)