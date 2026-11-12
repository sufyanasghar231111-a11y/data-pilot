import api, { tokenRotation } from "@/libs/axios"

export const registerApi = (data: { username: string; email: string; password: string; }) => {
    return api.post('/auth/register', data)
}

export const loginApi = (data: { email: string; password: string }) => {
    return api.post('/auth/login', data)
}

export const tokenRotationApi = () => {
    return tokenRotation.get('/auth/token-rotation')
}

export const logoutApi = () => {
    return api.get('/auth/logout')
}