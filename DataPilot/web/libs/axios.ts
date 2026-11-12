import axios from "axios";
import { getAccessToken, setAccessToken } from "./tokenGeneration";

type FailedQueue = {
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void
}

const api = axios.create({
    baseURL: `http://localhost:3000/api`,
    withCredentials: true
})

export const tokenRotation = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true
})

api.interceptors.request.use((config) => {
    const token = getAccessToken()

    if (!token) {
        config.headers = config.headers || {}
        config.headers.Authorization = 'Bearer '
    }

    return config

})

let isRefreshing = false
let failedQueue: FailedQueue[] = []

const processQueue = (error: unknown, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error)
        }
        else {
            prom.resolve(token)
        }
    })

    return failedQueue = []
}

api.interceptors.response.use((response) =>
    response,
    async (error) => {
        const originalRequest = error.config

        if (!originalRequest || originalRequest._retry) {
            return Promise.reject(error)
        }

        const status = error.response.status

        if (status === 401 && !originalRequest.url?.includes('/auth/token-rotation')) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then((token) => {
                        originalRequest.headers = originalRequest.headers || {}
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return api(originalRequest)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            return new Promise(async (resolve, reject) => {
                try {
                    const rotation = await tokenRotation.get('/auth/token-rotation')
                    const newToken = rotation.data.accessToken
                    if (!newToken) {
                        throw new Error('Unable to generate new token')
                    }

                    setAccessToken(newToken)

                    originalRequest.headers = originalRequest.headers || {}
                    originalRequest.headers.Authorization = `Bearer ${newToken}`

                    processQueue(null, newToken)
                    resolve(api(originalRequest))
                }
                catch (err) {
                    processQueue(err, null)
                    reject(err)
                }
                finally {
                    isRefreshing = false
                }
            })
        }

        return Promise.reject(error)
    }
)

export default api