"use client"
import { useLogin } from "@/contexts/authContext"

export default function DashBoard() {
    const { handleLogout, } = useLogin()

    return (
        <div onClick={handleLogout}>
            button
        </div>
    )
}