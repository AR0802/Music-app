import { useState, useEffect, useCallback } from 'react'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [status, setStatus] = useState('')
    const [userName, setName] = useState('')

    const login = useCallback((token, userId, status, userName) => {
        setToken(token)
        setUserId(userId)
        setStatus(status)
        setName(userName)
        localStorage.setItem('userData', JSON.stringify({
            token, userId, status, userName
        }))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setStatus(null)
        setName(null)
        localStorage.removeItem('userData')
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('userData'))
        if (data && data.token) {
            login(data.token, data.userId, data.status, data.userName)
        }
    }, [login])

    return { token, userId, status, userName, login, logout }
}