import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
import Error from '../../components/Error/Error'
import { useHttp } from '../../hooks/http'
import './Auth.css'

const Signup = props => {
    const { loading, request, error } = useHttp()
    const [form, setForm] = useState({
        email: '',
        password: '',
        name: ''
    })
    const navigate = useNavigate()

    const inputChangeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value })
    }

    const signupHandler = async event => {
        event.preventDefault()
        try {
            await request(
                'http://localhost:5000/auth/signup', 
                'POST', 
                { ...form },
                { 'Content-Type': 'application/json' }
            )
            navigate('/login')
        } catch (e) { }
    }

    return (
        <div className='container'>
            <h1>Зарегистрируйтесь и слушайте бесплатно</h1>
            {error ? <Error>{error}</Error> : null}
            <form onSubmit={signupHandler}>
                <Input
                    name='email'
                    type='text'
                    label='Ваш адрес электронной почты'
                    placeholder='Введите адрес электронной почты'
                    onChange={inputChangeHandler}
                />
                <Input
                    name='password'
                    type='password'
                    label='Придумайте пароль'
                    placeholder='Придумайте пароль'
                    onChange={inputChangeHandler}
                />
                <Input
                    name='name'
                    type='text'
                    label='Ваше имя'
                    placeholder='Укажите свое имя'
                    onChange={inputChangeHandler}
                />
                <Button class='auth-signup' type='submit' loading={loading}>Зарегистрироваться</Button>
            </form>
            <p>Уже есть аккаунт? <Link className='signupLink' to='/login'>Войти</Link>.</p>
        </div>
    )
}

export default Signup