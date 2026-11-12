"use client"
import { useRegister } from "@/contexts/authContext"

export default function RegisterPageComponent() {
    const { handleChangeRegister, registerInput, handleSubmit } = useRegister()
    return (
        <div className="w-full h-full text-white">
            <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col gap-3 border">
                <input type="text" name="username" id="" onChange={handleChangeRegister} value={registerInput.username} />
                <input type="text" name="email" id="" onChange={handleChangeRegister} value={registerInput.email} />
                <input type="text" name="password" id="" onChange={handleChangeRegister} value={registerInput.password} />
                <button type="submit">sign in</button>
            </form>
        </div>
    )
}