"use client"
import { setAccessToken } from "@/libs/tokenGeneration";
import { loginApi, logoutApi, registerApi, tokenRotationApi } from "@/services/frontend/authApi";
import { AuthUser } from "@/types/userType";
import { tryCatch } from "@/utils/tryCatch";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type LoginInput = {
    email: string,
    password: string
}

type LoginType = {
    handleChangeLogin: (e: { target: { name: string; value: string; }; }) => void
    loginUser: LoginInput
    setLoginUser: React.Dispatch<React.SetStateAction<LoginInput>>;
    handleLogin: (e: { preventDefault: () => void; }) => void
    handleLogout: () => void
}

type RegisterInputs = {
    username: string,
    email: string,
    password: string
}

type RegisterType = {
    registerInput: RegisterInputs,
    setRegisterInput: React.Dispatch<React.SetStateAction<RegisterInputs>>;
    handleChangeRegister: (e: { target: { name: string; value: string; }; }) => void
    handleSubmit: (e: { preventDefault: () => void; }) => void
}

type AuthProviderType = {
    user: AuthUser | null
    setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
    authReady: boolean;
    setAuthReady: React.Dispatch<React.SetStateAction<boolean>>;
}

export const loginProvider = createContext<LoginType | null>(null)
export const registerProvider = createContext<RegisterType | null>(null)
export const authProvider = createContext<AuthProviderType | null>(null)

export default function AuthContext({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)

    const [loginUser, setLoginUser] = useState<LoginInput>({
        email: '',
        password: ''
    })

    const [registerInput, setRegisterInput] = useState<RegisterInputs>({
        username: '',
        email: '',
        password: ''
    })

    const [authReady, setAuthReady] = useState<boolean>(false)

    function handleChangeLogin(e: { target: { name: string; value: string; }; }) {
        setLoginUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    function handleChangeRegister(e: { target: { name: string; value: string; }; }) {
        setRegisterInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const router = useRouter()

    async function handleLogin(e: { preventDefault: () => void; }) {
        e.preventDefault()
        const [res, error] = await tryCatch(loginApi({
            email: loginUser.email,
            password: loginUser.password
        }))

        if (error) {
            console.log(error);
            return
        }

        setUser(res?.data.user)
        setAccessToken(res?.data.accessToken)
        setAuthReady(true)
        if (res?.data.user) {
            router.push('/dashboard')
        }
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()
        const [res, error] = await tryCatch(registerApi({
            username: registerInput.username,
            email: registerInput.email,
            password: registerInput.password
        }))

        if (error) {
            console.log(error);
            return
        }

        setUser(res?.data.user)
        setAccessToken(res?.data.user)
        if (res?.data.user) {
            router.push('/dashboard')
        }
    }

    async function initialization() {
        const [res, error] = await tryCatch(tokenRotationApi())

        const token = res?.data.accessToken

        if (!token) {
            setAccessToken(null)
            return
        }

        if (error) {
            setAccessToken(null)
            setUser(null)
            console.log(error);
            return
        }

        setAccessToken(res?.data.accessToken)
        setUser(res?.data.user)
        setAuthReady(true)
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        initialization()
    }, [])

    async function handleLogout() {
        const [res, error] = await tryCatch(logoutApi())

        if (error) {
            console.log(error);
            return
        }

        if (res?.data.logout) {
            setAccessToken(null)
            setAuthReady(false)
            setUser(null)
            router.replace('/auth/login')
        }

    }

    return (
        <loginProvider.Provider value={{ handleChangeLogin, loginUser, setLoginUser, handleLogin, handleLogout }}>
            <registerProvider.Provider value={{ handleChangeRegister, registerInput, setRegisterInput, handleSubmit }}>
                <authProvider.Provider value={{ user, setUser, setAuthReady, authReady }}>
                    {children}
                </authProvider.Provider>
            </registerProvider.Provider>
        </loginProvider.Provider>
    )
}

export function useLogin() {
    const context = useContext(loginProvider)
    if (!context) {
        throw new Error('uselogin must ne inside loginProvider')
    }
    return context
}

export function useRegister() {
    const context = useContext(registerProvider)
    if (!context) {
        throw new Error('useRegister must ne inside registerProvider')
    }
    return context
}

export function useAuth() {
    const context = useContext(authProvider)
    if (!context) {
        throw new Error('useAuth must ne inside authProvider')
    }
    return context
}

