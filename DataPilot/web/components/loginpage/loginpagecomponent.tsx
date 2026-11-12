"use client"
import { useLogin } from "@/contexts/authContext"

export default function LoginPageComponent() {

    const { handleChangeLogin, loginUser, handleLogin } = useLogin()

    return (
        <div className="w-full h-full text-white">
            <form onSubmit={handleLogin} className="flex items-center justify-center flex-col gap-3 border">
                <input type="text" name="email" id="" onChange={handleChangeLogin} value={loginUser.email} />
                <input type="text" name="password" id="" onChange={handleChangeLogin} value={loginUser.password} />
                <button type="submit">Log in</button>
            </form>
        </div>
    )
}