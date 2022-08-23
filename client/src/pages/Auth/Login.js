import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Error from '../../components/Error/Error'
import { useHttp } from '../../hooks/http'
import { AuthContext } from '../../context/AuthContext'
import './Auth.css'

const Login = props => {
    const auth = useContext(AuthContext)
    const { loading, request, error } = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()

    const inputChangeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const loginHandler = async event => {
        event.preventDefault()
        try {
            const data = await request(
                'http://localhost:5000/auth/login',
                'POST',
                { ...form },
                { 'Content-Type': 'application/json' }
            )
            auth.login(data.token, data.userId, data.status, data.userName)
            navigate('/')
        } catch (e) { }
    }

    return (
        <div className='container container--pad'>
            {error ? <Error>{error}</Error> : null}
            <form onSubmit={loginHandler}>
                <Input
                    name='email'
                    type='text'
                    label='Электронная почта'
                    placeholder='Электронная почта'
                    onChange={inputChangeHandler}
                />
                <Input
                    name='password'
                    type='password'
                    label='Пароль'
                    placeholder='Пароль'
                    onChange={inputChangeHandler}
                />
                <Button class='auth-login' type='submit' loading={loading}>ВОЙТИ</Button>
            </form>
            <hr style={{ width: '75%' }} />
            <p className='loginP'>Нет аккаунта?</p>
            <Link className='loginLink' to='/signup'>Регистрация</Link>
        </div>
    )
}

export default Login