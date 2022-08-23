import React, { useContext } from 'react'

import { MusicContext } from '../../../../context/MusicContext'
import { ReactComponent as Play } from '../assets/play.svg'
import { ReactComponent as Pause } from '../assets/pause.svg'
import { ReactComponent as Next } from '../assets/next.svg'
import { ReactComponent as Prev } from '../assets/prev.svg'
import './AudioControls.css'

const AudioControls = ({ isPlaying, onPlayPauseClick, onPrevClick, onNextClick }) => {
    const music = useContext(MusicContext)

    return (
        <div className="audio-controls">
            <button
                type="button"
                className="prev"
                aria-label="Previous"
                onClick={onPrevClick}
            >
                <Prev />
            </button>
            {isPlaying ? (
                <button
                    type="button"
                    className="pause"
                    onClick={() => onPlayPauseClick(false)}
                    aria-label="Pause"
                >
                    <Pause />
                </button>
                ) : (
                <button
                    type="button"
                    className="play"
                    onClick={() => onPlayPauseClick(true)}
                    aria-label="Play"
                    disabled={!(Object.keys(music.currentTrack).length !== 0 && music.tracks.length !== 0)}
                >
                    <Play />
                </button>
            )}
            <button
                type="button"
                className="next"
                aria-label="Next"
                onClick={onNextClick}
            >
                <Next />
            </button>
        </div>
    )
    
}
  
export default AudioControls