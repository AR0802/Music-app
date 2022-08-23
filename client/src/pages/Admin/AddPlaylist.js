import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Error from '../../components/Error/Error'
import Navigation from '../../components/Navigation/Navigation'
import Content from '../../components/Content/Content'
import { useHttp } from '../../hooks/http'
import { AuthContext } from '../../context/AuthContext'
import { contextMenuHandler } from '../../util/util'

const AddPlaylist = props => {
    const auth = useContext(AuthContext)
    const { loading, request } = useHttp()
    const [playlist, setPlaylist] = useState(null)
    const [playlistForm, setPlaylistForm] = useState({
        title: '',
        image: '',
        description: ''
    })
    const [error, setError] = useState(null)
    const [userId, setUserId] = useState(null)
    const playlistId = useParams().playlistId
    const navigate = useNavigate()

    useEffect(() => {
        setUserId(props.cid)
    }, [props.cid])

    useEffect(() => {
        if (!!userId !== false) {
            if (playlistId !== undefined) {
                async function getPlaylist() {
                    try {
                        const data = await request(
                            'http://localhost:5000/user/userPlaylist/' + playlistId,
                            'POST',
                            { userId },
                            { Authorization: 'Bearer ' + auth.token, 'Content-Type': 'application/json' }
                        )
                        setPlaylist(data.playlist)
                    } catch (e) {
                        console.log(e)
                    }
                }
                getPlaylist()
            }
        }
        if (playlistId !== undefined) {
            async function getPlaylist() {
                try {
                    const data = await request(
                        'http://localhost:5000/playlist/playlist/' + playlistId,
                        'GET',
                        null,
                        { Authorization: 'Bearer ' + auth.token }
                    )
                    setPlaylist(data.playlist)
                } catch (e) {
                    console.log(e)
                }
            }
            getPlaylist()
        }
    }, [auth.token, playlistId, userId, request])

    useEffect(() => {
        if (playlist !== null) {
            setPlaylistForm({ 'title': playlist.title, 'image': playlist.imageUrl, 'description': playlist.description })
        }
    }, [playlist])

    const playlistInputChangeHandler = event => {
        setPlaylistForm({ ...playlistForm, [event.target.name]: event.target.value })
    }

    const playlistFileInputChangeHandler = (input, value, files) => {
        setPlaylistForm({ ...playlistForm, [input]: files ? files[0] : value })
    }

    const addPlaylistHandler = async event => {
        event.preventDefault()
        if (!!userId !== false) {
            try {
                if (playlistForm.title === '') {
                    return setError('Введите название плейлиста.')
                }
                const formData = new FormData()
                formData.append('title', playlistForm.title)
                formData.append('image', playlistForm.image)
                formData.append('description', playlistForm.description)
                await request(
                    'http://localhost:5000/user/userPlaylist',
                    'POST',
                    formData,
                    { Authorization: 'Bearer ' + auth.token }
                )
                navigate('/collection/playlists')
            } catch (e) {
                setError(e.message)
            }
        } else {
            async function makeFormRequest() {
                try {
                    const formData = new FormData()
                    formData.append('title', playlistForm.title)
                    formData.append('image', playlistForm.image)
                    formData.append('description', playlistForm.description)
                    if (playlistId === undefined) {
                        await request(
                            'http://localhost:5000/playlist/playlist',
                            'POST',
                            formData,
                            { Authorization: 'Bearer ' + auth.token }
                        )
                        navigate('/')
                    } else {
                        const data = await request(
                            'http://localhost:5000/playlist/playlist/' + playlistId,
                            'PUT',
                            formData,
                            { Authorization: 'Bearer ' + auth.token }
                        )
                        if (data.status) {
                            return navigate('/')
                        }
                        navigate('/collection/playlists')
                    }
                } catch (e) {
                    setError(e.message)
                }
            }

            if (playlist !== null) {
                if (playlist.status !== 'gmrqgjqerpgjeogjgpoiqejhpqiehjqkmglrmvqemrvklq') {
                    if (playlistForm.title === '') {
                        return setError('Введите название плейлиста.')
                    }
                    return makeFormRequest()
                }
            }

            if (playlistForm.title === '') {
                return setError('Введите название плейлиста.')
            }
            if (playlistId === undefined) {
                if (playlistForm.image === '') {
                    return setError('Выберите изображение.')
                }
            }
            if (playlistForm.description === '') {
                return setError('Введите описание плейлиста.')
            }
            makeFormRequest()
        }
    }

    return (
        <div onContextMenu={event => contextMenuHandler(event, auth.status)}>
            <Navigation />
            <Content>
                <div className='container'>
                    {error ? <Error>{error}</Error> : null}
                    <form onSubmit={addPlaylistHandler}>
                        <Input
                            name='title'
                            type='text'
                            label='Название плейлиста'
                            placeholder='Введите название плейлиста'
                            onChange={playlistInputChangeHandler}
                            value={playlistForm.title}
                        />
                        <Input
                            name='image'
                            type='file'
                            label='Обложка плейлиста'
                            onChange={playlistFileInputChangeHandler}
                        />
                        <Input
                            name='description'
                            type='text'
                            label='Описание плейлиста'
                            placeholder='Введите описание плейлиста'
                            onChange={playlistInputChangeHandler}
                            value={playlistForm.description}
                        />
                        <Button
                            class='auth-signup'
                            type='submit'
                            loading={loading}
                        >
                            {!!userId === false ? 
                                playlistId === undefined ? 'Добавить Плейлист' : 'Изменить Плейлист'
                                : 'Создать Плейлист'
                            }
                        </Button>
                    </form>
                </div>
            </Content>
        </div>
    )
}

export default AddPlaylist