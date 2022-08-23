import { useState, useCallback } from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setLoading(true)
        try {
            if (headers['Content-Type']) {
                body = JSON.stringify(body)
            }

            let response
            if (method === 'GET') {
                response = await fetch(url, { method, headers })
            } else {
                response = await fetch(url, { method, body, headers })
            }

            const data = await response.json()

            if (!response.ok) {
                if (data.data) {
                    throw new Error(data.data[0].msg)
                }
                throw new Error(data.message || 'Что-то пошло не так.')
            }

            setLoading(false)
            setError(null)

            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    return { loading, error, request }
}