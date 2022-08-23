import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home from './pages/Home'
import Signup from './pages/Auth/Signup'
import Login from './pages/Auth/Login'
import Search from './pages/Search'
import AddPlaylist from './pages/Admin/AddPlaylist'
import AddTrack from './pages/Admin/AddTrack'
import PlaylistContent from './pages/PLaylistContent/PlaylistContent'
import FavoriteTracks from './pages/FavoriteTracks'
import FavoritePlaylists from './pages/FavoritePlaylists'

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/collection/tracks" element={<FavoriteTracks />} />
                <Route path="/collection/playlists" element={<FavoritePlaylists />} />
                {window.location.search.split('cid=')[1] !== undefined ? 
                    <Route path="/add-playlist" element={<AddPlaylist cid={window.location.search.split('cid=')[1]} />} /> : 
                    null
                }
                <Route path="/playlist/:playlistId" element={<PlaylistContent />} />
                <Route path="/admin/add-track" element={<AddTrack />} />
                <Route path="/admin/add-playlist" element={<AddPlaylist />} />
                <Route path="/admin/edit-playlist/:playlistId" element={<AddPlaylist />} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
    )
}