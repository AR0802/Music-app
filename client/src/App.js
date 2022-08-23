import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useRoutes } from './routes'
import { useAuth } from './hooks/auth'
import { AuthContext } from './context/AuthContext'
import { MusicContext } from './context/MusicContext'
import { useMusic } from './hooks/music'

function App() {
  const { token, userId, status, userName, login, logout } = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)
  const { tracks, currentTrack, trackIndex, isPlaying, currentTime, tracksSetter, isPlayingSetter, currentTimeSetter } = useMusic()
  const navigate = useNavigate()
  
  useEffect(() => {
      navigate(JSON.parse(window.sessionStorage.getItem('lastRoute') || '{}'))
      window.onbeforeunload = () => {
          window.sessionStorage.setItem('lastRoute', JSON.stringify(window.location.pathname))
      }
  }, [])

  return (
    <AuthContext.Provider value={{
      token, userId, isAuthenticated, status, userName, login, logout
    }}>
      <MusicContext.Provider value={{
        tracks, currentTrack, trackIndex, isPlaying, currentTime, tracksSetter, isPlayingSetter, currentTimeSetter
      }}>
        {routes}
      </MusicContext.Provider>
    </AuthContext.Provider>
  )
}

export default App