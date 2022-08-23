import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Error from '../../components/Error/Error'
import Navigation from '../../components/Navigation/Navigation'
import Content from '../../components/Content/Content'
import { useHttp } from '../../hooks/http'
import { AuthContext } from '../../context/AuthContext'

const AddTrack = props => {
    const auth = useContext(AuthContext)
    const { loading, request } = useHttp()
    const [trackForm, setTrackForm] = useState({
        title: '',
        image: '',
        song: '',
        artist: ''
    })
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const trackInputChangeHandler = event => {
        setTrackForm({ ...trackForm, [event.target.name]: event.target.value })
    }

    const trackFileInputChangeHandler = (input, value, files) => {
        setTrackForm({ ...trackForm, [input]: files ? files[0] : value })
    }

    const addTrackHandler = async event => {
        event.preventDefault()
        try {
            if (trackForm.title === '') {
                return setError('Введите название трека.')
            }
            if (trackForm.image === '') {
                return setError('Выберите изображение.')
            }
            if (trackForm.song === '') {
                return setError('Выберите запись.')
            }
            if (trackForm.artist === '') {
                return setError('Введите исполнителя.')
            }
            const formData = new FormData()
            formData.append('title', trackForm.title)
            formData.append('image', trackForm.image)
            formData.append('song', trackForm.song)
            formData.append('artist', trackForm.artist)
            await request(
                'http://localhost:5000/song/song',
                'POST',
                formData,
                { Authorization: 'Bearer ' + auth.token }
            )
            navigate('/')
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            <Navigation />
            <Content page='AddTrack'>
                <div className='container'>
                    {error ? <Error>{error}</Error> : null}
                    <form onSubmit={addTrackHandler}>
                        <Input
                            name='title'
                            type='text'
                            label='Название трека'
                            placeholder='Введите название трека'
                            onChange={trackInputChangeHandler}
                        />
                        <Input
                            name='image'
                            type='file'
                            label='Обложка трека'
                            onChange={trackFileInputChangeHandler}
                        />
                        <Input
                            name='song'
                            type='file'
                            label='Трек'
                            onChange={trackFileInputChangeHandler}
                        />
                        <Input
                            name='artist'
                            type='text'
                            label='Исполнитель'
                            placeholder='Введите исполнителя'
                            onChange={trackInputChangeHandler}
                        />
                        <Button class='auth-login' type='submit' loading={loading}>Добавить Трек</Button>
                    </form>
                </div>
            </Content>
        </>
    )
}

export default AddTrack